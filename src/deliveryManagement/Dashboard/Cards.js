/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import './css/Dashboard.css';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, FormControl, IconButton, InputLabel, Menu, MenuItem, Modal, Select, Tooltip } from '@mui/material';
import {
    InputAdornment, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './Dashboard';
import Timer from './Timer';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import Typography from '@mui/material/Typography';
import Close from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

const styleDue = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    paddingTop: '15px',
    paddingRight: '15px',
    paddingLeft: '15px',
    paddingBottom: '15px'
};

const Cards = ({ data, getDeliverCardData }) => {
    const [accountList, setAccountList] = useState([]);
    const regexMobile = /^[0-9\b]+$/;
    const [isEdit, setIsEdit] = useState(false);
    const tokenRef = useRef(null);
    const desiredAmountRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [itemList, setItemList] = useState(data.deliveryData || []);
    const [indexDelete, setIndexDelete] = useState(null);
    const [deliveryManData, setDeliveryManData] = useState([]);
    const [deliveryManId, setDeliveryManId] = useState('');
    const [billData, setBillData] = useState();
    const changeRef = useRef(null)
    const [updateDeliveryPopUp, setUpdatDeliveryPopUp] = useState(false)
    const [updateDeliveryPopUpData, setUpdateDeliveryPopUpData] = useState()
    const [isOther, setIsOther] = useState(false)
    const [isBill, setIsBill] = useState(false);
    const [formData, setFormData] = useState({
        token: '',
        billChange: 0,
        desiredAmt: 0,
        billAmt: ''
    });
    const commentRef = useRef(null)
    const priceRef = useRef(null)
    const [totalValues, setTotalValues] = useState({
        amount: data.totalBillAmt,
        change: data.totalChange,
        desiredAmount: data.totalDesiredAmt
    });
    const [isTokenError, setIsTokenError] = useState(false);
    const [selectedDeliveryManName, setSelectedDeliveryManName] = useState()
    const [timerClass, setTimerClass] = useState('customBgGreen');
    const [loading, setLoading] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [selectedBill, setSelectedBill] = useState();
    const [error, setError] = useState(false);
    const regex = /^\d*\.?\d*$/;
    const [success, setSuccess] = useState(false);
    const [upiId, setUpiId] = useState([])
    const [selectedUpiData, setSelectedUpiData] = useState();
    const [upiIdPopUp, setUpiIdPopUp] = useState(false)



    const [openDue, setOpenDue] = React.useState(false);
    const [openDueSelected, setOpenDueSelected] = React.useState('');
    const [dueFormData, setDueFormData] = useState({
        accountId: '',
        dueNote: '',
        selectedAccount: ''
    })
    const [addAccount, setAddAccount] = useState(false);
    const [accountFormData, setAccountFormData] = useState({
        customerName: "",
        customerNumber: ""
    })
    const handleCloseDue = () => {
        setOpenDue(false);
    }
    const saveDue = () => {
        updateMarkingOfDeliveryDue(openDueSelected, 'due')
        setOpenDue(false)
    }
    const getAccountList = async () => {
        await axios
            .get(`${BACKEND_BASE_URL}billingrouter/ddlDueAccountData`, config)
            .then((res) => {
                setAccountList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            });
    }
    const handleSaveAccount = async () => {
        if (!accountFormData.customerName) {
            setError('Please add customer name')
        } else if (!accountFormData.customerNumber) {
            setError('Please add customer number')
        }
        else {
            setLoading(true);
            await axios
                .post(
                    `${BACKEND_BASE_URL}billingrouter/addCustomerAccount`,
                    accountFormData,
                    config
                )
                .then((res) => {
                    setLoading(false);
                    setSuccess(true);
                    setAccountFormData({
                        customerName: "",
                        customerNumber: ""
                    })
                    setAddAccount(false);
                    setDueFormData((prev) => ({
                        ...prev,
                        accountId: res.data.accountId,
                        selectedAccount: res.data,
                    }))
                    getAccountList();
                })
                .catch((error) => {
                    setError(
                        error.response && error.response.data
                            ? error.response.data
                            : "Network Error ...!!!"
                    );
                });
        }
    };
    const clickAddAccount = () => {
        setAddAccount(true);
    }
    const handleAccountChange = (e, value) => {
        if (value) {
            setDueFormData((prevState) => ({
                ...prevState,
                selectedAccount: value,
                accountId: value.accountId
            }));
        } else {
            setDueFormData((prevState) => ({
                ...prevState,
                selectedAccount: '',
                accountId: ''
            }));
        }
    };
    if (loading) {
        toast.loading("Please wait...", {
            toastId: 'loading'
        });
    }
    if (success) {
        toast.dismiss('loading');
        toast('Success!', {
            type: 'success',
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setSuccess(false);
        setTimeout(() => {
            setLoading(false);
        }, 50);
    }
    if (error) {
        setLoading(false);
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setError(false);
    }

    const open = Boolean(anchorEl);

    const handleClick = (event, index, bill) => {
        setAnchorEl(event.currentTarget);
        setIndexDelete(index);
        setOpenIndex(index)
        setSelectedBill(bill)
        console.log('bill', bill)
    };
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    useEffect(() => {
        getDeliveryManData();
        getDeliverCardData();
        getAllUpiId();
        getAccountList();
    }, []);
    const getAllUpiId = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/ddlUPI`, config)
            .then((res) => {
                setUpiId(res.data)
                setSelectedUpiData(res.data[0].upiId)
            })
            .catch((error) => {
                console.log('Error => ', error)
                setError(error?.response?.data || 'Network Error!!!..')
            })
    }
    const getDeliveryManData = async () => {
        try {
            await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/ddlPersonData`, config)
                .then((res) => {
                    setDeliveryManData(res.data);
                    const deliveryManName = res.data.find(val => val.personId === data.personId)
                    setSelectedDeliveryManName(deliveryManName)
                })
                .catch((error) => {
                    console.log('Error', error);
                    setError(error?.response?.data || 'Network Error')
                });
        } catch (error) {
            console.log(error.response.data || 'Network Error!!..');
            setError(error?.response?.data || 'Network Error')
        }
    };

    // useEffect(() => {
    //     const filteredItems = itemList.filter(bill => bill.billPayType !== 'other');
    //     const totalAmount = filteredItems.reduce((acc, bill) => acc + parseFloat(bill.billAmt || 0), 0);
    //     const totalChange = filteredItems.reduce((acc, bill) => acc + parseFloat(bill.billChange || 0), 0);
    //     const totalDesiredAmount = filteredItems.reduce((acc, bill) => acc + parseFloat(bill.desiredAmt || 0), 0);

    //     setTotalValues({
    //         amount: totalAmount,
    //         change: totalChange,
    //         desiredAmount: totalDesiredAmount
    //     });
    // }, [itemList]);

    const handleClose = () => {
        setAnchorEl(null);
        setIndexDelete(null);
    };

    const handleAddData = () => {
        if (formData.token) {
            if (formData.token === 'O' || formData.token === 'B') {
                const newItem = {
                    token: formData.token,
                    billAmt: parseFloat(formData.billAmt) || 0,
                    billChange: parseFloat(formData.billChange) || 0,
                    desiredAmt: parseFloat(formData.desiredAmt) || 0,
                    deliveryType: formData.token === 'O' ? 'other' : 'Due Bill',
                    billPayType: formData.billPayType,
                    billId: formData.billId,
                    billAddress: formData.billAddress || formData.Comment || ''
                };
                console.log('newItem', newItem)
                let newTotalAmount;
                let newTotalChange;
                let newTotalDesiredAmt;
                if (newItem.token === 'B') {
                    newTotalAmount = totalValues.amount + parseFloat(formData.billAmt || 0);
                    newTotalChange = totalValues.change + parseFloat(formData.billChange || 0);
                    newTotalDesiredAmt = totalValues.desiredAmount + parseFloat(formData.desiredAmt || 0);
                }
                else {
                    newTotalAmount = totalValues.amount;
                    newTotalChange = totalValues.change;
                    newTotalDesiredAmt = totalValues.desiredAmount;
                }
                setFormData({
                    Comment: '',
                    billAmt: '',
                    desiredAmt: '',
                    billChange: '',
                    token: ''
                });
                setIsTokenError(false);
                setIsOther(false)
                setIsBill(false)
                tokenRef.current.focus();
                handeAddItemData(newItem, newTotalAmount, newTotalChange, newTotalDesiredAmt);
                return;
            }
            const tokenExists = itemList.some(item => item.token === formData.token);
            if (tokenExists) {
                alert(`Token number ${formData.token} is already added.`);
                setFormData({
                    ...formData,
                    token: '',
                    Comment: '',
                    billAmt: '',
                    desiredAmt: '',
                    billChange: '',
                });
                tokenRef.current.focus();
            } else {
                const newItem = {
                    token: formData.token,
                    billAmt: parseFloat(formData.billAmt) || 0,
                    billChange: parseFloat(formData.billChange) || 0,
                    desiredAmt: parseFloat(formData.desiredAmt) || 0,
                    deliveryType: formData.billType,
                    billPayType: formData.billPayType,
                    billId: formData.billId,
                    billAddress: formData.billAddress || formData.Comment || ''
                };
                let newTotalAmount;
                let newTotalChange;
                let newTotalDesiredAmt;
                console.log('newItem', newItem)
                if (newItem.billPayType === 'online' || newItem.billPayType === 'due') {
                    newTotalAmount = totalValues.amount + parseFloat(formData.billAmt || 0);
                    newTotalChange = totalValues.change + parseFloat(formData.billChange || 0)
                    newTotalDesiredAmt = totalValues.desiredAmount + parseFloat(formData.billChange || 0);
                }
                else {
                    newTotalAmount = totalValues.amount + parseFloat(formData.billAmt || 0);
                    newTotalChange = totalValues.change + parseFloat(formData.billChange || 0);
                    newTotalDesiredAmt = totalValues.desiredAmount + parseFloat(formData.desiredAmt || 0);
                }
                setFormData({
                    Comment: '',
                    billAmt: '',
                    desiredAmt: '',
                    billChange: '',
                    token: ''
                });
                setIsTokenError(false);
                tokenRef.current.focus();
                handeAddItemData(newItem, newTotalAmount, newTotalChange, newTotalDesiredAmt);
            }
        } else {
            setIsTokenError(true);
        }
    };

    const handeAddItemData = async (newData, newTotalAmount, newTotalChange, newTotalDesiredAmt) => {
        const jsonData = {
            deliveryId: data.deliveryId,
            personId: selectedDeliveryManName.personId,
            totalBillAmt: newTotalAmount,
            totalChange: newTotalChange,
            totalDesiredAmt: newTotalDesiredAmt,
            durationTime: data.durationTime,
            deliveryBillData: [...itemList, newData]
        };
        console.log('jsonData:', jsonData);
        await axios.post(`${BACKEND_BASE_URL}deliveryAndPickUprouter/updateDeliveryData`, jsonData, config)
            .then((res) => {
                // getDeliverCardData();
                fetchCardData()
                console.log('res', res.data)
                setItemList(res.data.deliveryData)
                setTotalValues({
                    amount: newTotalAmount,
                    change: newTotalChange,
                    desiredAmount: newTotalDesiredAmt
                });
            })
            .catch((error) => {
                console.log('Error', error)
                setError(error?.response?.data || 'Netwrok Error!!!...')
            })
    }
    const handleBillNoKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!formData.token) {
                return setIsTokenError(true)
            }
            if (isOther) {
                commentRef?.current?.focus();
                setFormData((prev) => ({
                    ...prev,
                    billPayType: 'other'
                }))
            }
            else if (isBill) {
                commentRef.current.focus();
                setFormData((prev) => ({
                    ...prev,
                    billPayType: 'bill'
                }))
            }
            else {
                console.log('token Name', formData.token)
                setIsOther(false)
                await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDeliveryDataByToken?tknNo=${formData.token}`, config)
                    .then((res) => {

                        if (res.data.billPayType === 'due') {
                            handleDirectAdd(res.data)
                            setFormData({
                                token: ''
                            })
                        }
                        else if (res.data.billPayType === 'debit') {
                            handleDirectAdd(res.data)
                            setFormData({
                                token: ''
                            })
                        }
                        else if (res.data.billPayType === 'complimentary') {
                            handleDirectAdd(res.data)
                            setFormData({
                                token: ''
                            })
                        }
                        else if (res.data.billPayType === 'online') {
                            handleDirectAdd(res.data)
                            setFormData({
                                token: ''
                            })
                        }
                        else {
                            setFormData((prev) => ({
                                ...prev,
                                billAmt: res.data.settledAmount,
                                billAddress: res.data.billAddress,
                                billId: res.data.billId,
                                billPayType: res.data.billPayType,
                                billType: res.data.billType,
                                desiredAmt: formData.billChange ? res.data.settledAmount + parseFloat(formData.billChange ? formData.billChange : 0) : res.data.settledAmount,
                            }));
                            console.log('Data', res.data)
                            changeRef.current.focus();
                        }
                    })
                    .catch((error) => {
                        console.log('Error', error);
                        setError(error?.response?.data || 'Network Error')
                        setFormData({
                            billAmt: '',
                            token: '',
                            Comment: '',
                            desiredAmt: '',
                            billChange: ''
                        })
                        if (error.response.data === "Token Number Not Found") {
                            tokenRef.current.focus();
                        }
                    });
            }
        }
    };
    const handleDirectAdd = async (resData) => {
        // console.log('billAddress', billAddress);
        // console.log('billId', billId);
        // console.log('billPayType', billPayType);
        // console.log('billType', billType);
        // console.log('token', token);

        const newBillAmt = parseFloat(totalValues.amount || 0) + parseFloat(resData.settledAmount || 0);
        const newChangeAmt = parseFloat(totalValues.change || 0);
        const newDesiredAmt = parseFloat(totalValues.desiredAmount || 0);
        console.log('LLLLLLLLLLL', resData.tokenNo)
        const newItemData = {
            token: resData.tokenNo,
            billAmt: resData.settledAmount,
            billChange: 0,
            desiredAmt: 0,
            deliveryType: resData.billType,
            billPayType: resData.billPayType,
            billId: resData.billId,
            billAddress: resData.billAddress || ''
        };

        console.log('NewItem', newItemData);

        const jsonItemData = {
            deliveryId: data.deliveryId,
            personId: selectedDeliveryManName.personId,
            totalBillAmt: newBillAmt,
            totalChange: newChangeAmt,
            totalDesiredAmt: newDesiredAmt,
            durationTime: data.durationTime,
            deliveryBillData: [...itemList, newItemData]
        };
        console.log('jsonItemData:', jsonItemData);

        await axios.post(`${BACKEND_BASE_URL}deliveryAndPickUprouter/updateDeliveryData`, jsonItemData, config)
            .then((res) => {
                console.log('res', res.data);
                fetchCardData();
                setItemList(res.data.deliveryData);
                setTotalValues({
                    amount: newBillAmt,
                    change: newChangeAmt,
                    desiredAmount: newDesiredAmt
                });
            })
            .catch((error) => {
                console.log('Error', error);
                setError(error?.response?.data || 'Network Error!!!...');
            })
    }

    const handleBillNoChange = (e) => {
        const token = e.target.value.toUpperCase();
        setFormData(prev => ({
            token: token
        }));
        setIsTokenError(false)
        if (token === 'O') {
            setIsOther(true)
        }
        else if (token === 'B') {
            setIsBill(true)
        }
        else {
            setIsOther(false)
            setIsBill(false)
        }
    };

    const handleDesiredAmountChange = (e) => {
        const changeValue = parseInt(e.target.value);
        const billAmountValue = parseInt(formData.billAmt);
        if (regex.test(e.target.value)) {
            setFormData((prev) => ({
                ...prev,
                desiredAmt: e.target.value,
                billChange: changeValue - billAmountValue
            }));
        }
    };
    const handleDesiredAmountChangeOther = (e) => {
        if (regex.test(e.target.value)) {
            setFormData((prev) => ({
                ...prev,
                billAmt: e.target.value,
            }));
        }
    };

    const handleDeleteItem = () => {
        console.log('Deleting Item')
        if (itemList.length > 1) {
            const password = window.prompt("Please enter the password:");
            if (password === "123") {
                handleDelteAPi()
            }
        } else {
            removerDelivery();
        }
        handleClose()
    }
    const handleDelteAPi = async () => {
        var amount = 0;
        var change = 0;
        var desiredAmount = 0;
        if (itemList[indexDelete].billPayType === 'online' || itemList[indexDelete].billPayType === 'due' || itemList[indexDelete].billPayType === 'debit' || itemList[indexDelete].billPayType === 'cancel') {
            amount = parseFloat(totalValues.amount || 0) - parseFloat(itemList[indexDelete].billAmt || 0);
            change = parseFloat(totalValues.change || 0) - parseFloat(itemList[indexDelete].billChange || 0);
            desiredAmount = parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[indexDelete].billChange || 0);
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: desiredAmount,
                amount: amount,
                change: change,
            }));
            console.log('ItemList', itemList[indexDelete])
        }
        else if (itemList[indexDelete].billPayType === 'other') {
            amount = totalValues.amount;
            change = totalValues.change;
            desiredAmount = totalValues.desiredAmount;
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: prev.desiredAmount,
                amount: prev.amount,
                change: prev.change
            }))
        }
        else {
            amount = parseFloat(totalValues.amount || 0) - parseFloat(itemList[indexDelete].billAmt || 0);
            change = parseFloat(totalValues.change || 0) - parseFloat(itemList[indexDelete].billChange || 0);
            desiredAmount = parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[indexDelete].desiredAmt || 0);
            console.log('ItemList', itemList[indexDelete])
            console.log('Cash He')
            const totalAmunt = parseFloat(totalValues.amount || 0);
            console.log('Cash', totalAmunt)
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: desiredAmount,
                amount: amount,
                change: change,
            }))
        }

        console.log('Daa', amount, change, desiredAmount);
        const filteredData = itemList.filter((_, index) => index !== indexDelete);
        setItemList(filteredData);
        const jsonData = {
            deliveryId: data.deliveryId,
            personId: selectedDeliveryManName.personId,
            totalBillAmt: amount,
            totalChange: change,
            totalDesiredAmt: desiredAmount,
            durationTime: data.durationTime,
            deliveryBillData: filteredData,
        };
        console.log('jsonTotalDaata', jsonData, totalValues)
        try {
            const res = await axios.post(`${BACKEND_BASE_URL}deliveryAndPickUprouter/updateDeliveryData`, jsonData, config);
            setItemList(res.data.deliveryData);
            // getDeliverCardData();
            fetchCardData();
        } catch (error) {
            console.error('API Error:', error);
            setError(error?.response?.data || 'Network Error!!!');
            // getDeliverCardData();
            fetchCardData();
        }
    };
    const ITEM_HEIGHT = 48;
    const deleteCards = async () => {
        // await axios.delete(`${BACKEND_BASE_URL}deliveryAndPickUprouter/removeDeliveryData?deliveryId=${data.deliveryId}`, config)
        //     .then((res) => {
        //         console.log('Remove', res.data)
        //         setSuccess(true)
        //         getDeliverCardData();
        //     })
        //     .catch((error) => {
        //         console.log('Error', error)
        //         setError(error.response.data || 'Netwrok Error!!..')
        //     })
        const dataObject = {
            deliveryData: itemList,
            personName: data.personName
        }
        setUpdatDeliveryPopUp(true)
        setUpdateDeliveryPopUpData(dataObject)
    }
    const stopDelivery = async () => {
        // await axios.delete(`${BACKEND_BASE_URL}deliveryAndPickUprouter/removeDeliveryData?deliveryId=${data.deliveryId}`, config)
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/stopDeliveryData?deliveryId=${data.deliveryId}`, config)
            .then((res) => {
                console.log('Remove', res.data)
                getDeliverCardData();
            })
            .catch((error) => {
                console.log('Error', error)
                setError(error?.response?.data || 'Netwrok Error!!..')
            })
    }
    const handleUpdateDeliveryMan = async () => {
        console.log('personId', deliveryManId)
        const deliveryManSet = deliveryManId
        if (deliveryManSet) {
            await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/updateDeliveryPerson?deliveryId=${data.deliveryId}&personId=${deliveryManSet}`, config)
                .then((res) => {

                    console.log('respon delivery', res.data)
                    const deliveryManNameData = deliveryManData.find(val => val.personId === res.data)
                    console.log('PersonObject', deliveryManNameData)
                    setSelectedDeliveryManName(deliveryManNameData)
                    setIsEdit(false);
                    getDeliverCardData();
                })
                .catch((error) => {
                    console.log('Error', error)
                    setError(error?.response?.data || 'Network Error !!..')
                    setIsEdit(false)
                })
        }
        else {
            setIsEdit(false)
        }
    }
    const updateTimerClass = (elapsedSeconds) => {
        const remainingMinutes = Math.floor(elapsedSeconds / 60);
        const customSeconds = Math.floor(remainingMinutes / elapsedSeconds)
        setElapsedTime(`${remainingMinutes}:${customSeconds}`)
        if (remainingMinutes <= 19) {
            setTimerClass('customBgGreen');
            // setTimerClass('customBgRed')
        } else if (remainingMinutes <= 44) {
            // setTimerClass('customBgRed')
            setTimerClass('customBgYellow');
        }
        else {
            setTimerClass('customBgRed')
        }
    };
    const removerDelivery = async () => {
        const password = window.prompt("Please enter the password:");
        if (password === "123") {
            try {
                await axios.delete(`${BACKEND_BASE_URL}deliveryAndPickUprouter/removeDeliveryData?deliveryId=${data.deliveryId}`, config)
                    .then((res) => {
                        console.log('Remove', res.data)
                        getDeliverCardData();
                        // fetchCardData();
                    })
                    .catch((error) => {
                        console.log('Error', error)
                        setError(error?.response?.data || 'Netwrok Error!!..')
                    })
            } catch (error) {
                setError(error?.response?.data || 'Network Error!!..')
            }
        }
    }
    // const updateMarkingOfDelivery = async (deliveryData, type) => {
    //     const password = window.prompt("Please enter the password:");
    //     if (password === "123") {
    //         console.log('data', deliveryData, 'Type', type);
    //         let totalChange;
    //         let totalDesiredAmount;
    //         let totalAmount;
    //         if (type === 'due' && deliveryData.billPayType === 'cash') {
    //             const anotherTotalAmount = parseFloat(totalValues.desiredAmount || 0) - parseFloat(deliveryData.desiredAmt || 0);
    //             totalDesiredAmount = anotherTotalAmount + deliveryData.billChange
    //             totalChange = parseFloat(totalValues.change|| 0)
    //             totalAmount = parseFloat(totalValues.amount|| 0)
    //             console.log('DeliveryData', deliveryData);
    //             console.log('Total Amount', anotherTotalAmount);
    //             console.log('Total change', totalChange);
    //             setTotalValues({
    //                 ...totalValues,
    //                 desiredAmount: totalDesiredAmount,
    //                 amount:totalAmount,
    //                 change:totalChange
    //             });
    //             setItemList(prevList => {
    //                 const updatedList = prevList.map((item, index) => {
    //                     if (index === indexDelete) {
    //                         return {
    //                             ...item,
    //                             desiredAmt: item.billChange,
    //                             billChange: 0
    //                         };
    //                     }
    //                     return item;
    //                 });
    //                 return updatedList;
    //             });
    //         }
    //         else if (type === 'online' && deliveryData.billPayType === 'cash') {
    //             const anotherTotalAmount = parseFloat(totalValues.desiredAmount || 0) - parseFloat(deliveryData.desiredAmt || 0);
    //             totalDesiredAmount = anotherTotalAmount + deliveryData.billChange
    //             totalChange = parseFloat(totalValues.change|| 0)
    //             totalAmount = parseFloat(totalValues.amount|| 0)
    //             console.log('DeliveryData', deliveryData);
    //             console.log('Total Amount', anotherTotalAmount);
    //             console.log('Total change', totalChange);
    //             setTotalValues({
    //                 ...totalValues,
    //                 desiredAmount: totalDesiredAmount,
    //                 amount:totalAmount,
    //                 change:totalChange
    //             });
    //             setItemList(prevList => {
    //                 const updatedList = prevList.map((item, index) => {
    //                     if (index === indexDelete) {
    //                         return {
    //                             ...item,
    //                             desiredAmt: item.billChange,
    //                             billChange: 0
    //                         };
    //                     }
    //                     return item;
    //                 });
    //                 return updatedList;
    //             });
    //         }
    //         else if (type === 'debit' && deliveryData.billPayType === 'cash') {
    //             const anotherTotalAmount = parseFloat(totalValues.desiredAmount || 0) - parseFloat(deliveryData.desiredAmt || 0);
    //             totalDesiredAmount = anotherTotalAmount + deliveryData.billChange
    //             console.log('DeliveryData', deliveryData);
    //             console.log('Total Amount', anotherTotalAmount);
    //             console.log('Total change', totalChange);
    //             totalChange = parseFloat(totalValues.change|| 0)
    //             totalAmount = parseFloat(totalValues.amount|| 0)
    //             setTotalValues({
    //                 ...totalValues,
    //                 desiredAmount: totalDesiredAmount,
    //                 amount:totalAmount,
    //                 change:totalChange
    //             });
    //             setItemList(prevList => {
    //                 const updatedList = prevList.map((item, index) => {
    //                     if (index === indexDelete) {
    //                         return {
    //                             ...item,
    //                             desiredAmt: item.billChange,
    //                             billChange: 0
    //                         };
    //                     }
    //                     return item;
    //                 });
    //                 return updatedList;
    //             });
    //         }
    //         else if (type === 'cash') {
    //             totalDesiredAmount = parseFloat(totalValues.desiredAmount || 0) + parseFloat(deliveryData.billAmt || 0);
    //             // totalDesiredAmount = anotherTotalAmount - deliveryData.billChange
    //             console.log('Cashe Data', totalDesiredAmount)
    //             totalChange = parseFloat(totalValues.change|| 0)
    //             totalAmount = parseFloat(totalValues.amount|| 0)
    //             setTotalValues({
    //                 ...totalValues,
    //                 desiredAmount: totalDesiredAmount,
    //                 amount:totalAmount,
    //                 change:totalChange
    //             });
    //         }
    //         else if (type === 'cancel') {
    //             if (deliveryData.billPayType === 'online') {
    //                 totalDesiredAmount = totalValues.desiredAmount
    //                 totalAmount = parseFloat(totalValues.amount || 0) - parseFloat(deliveryData.billAmt || 0)
    //                 totalChange = parseFloat(totalValues.change || 0) - parseFloat(deliveryData.billChange || 0)
    //                 console.log('Change', totalChange);
    //                 console.log('Total Amount', totalAmount);
    //                 console.log('Total Desired', totalChange);
    //                 setTotalValues((prev) => ({
    //                     ...prev,
    //                     amount: totalAmount,
    //                     change: totalChange,
    //                     desiredAmount: totalDesiredAmount
    //                 }))
    //                 setItemList(prevList => {
    //                     const updatedList = prevList.map((item, index) => {
    //                         if (index === indexDelete) {
    //                             return {
    //                                 ...item,
    //                                 desiredAmt: 0,
    //                                 billChange: 0
    //                             };
    //                         }
    //                         return item;
    //                     });
    //                     return updatedList;
    //                 });
    //             }
    //             if (deliveryData.billPayType === 'due') {
    //                 totalDesiredAmount = totalValues.desiredAmount
    //                 totalAmount = parseFloat(totalValues.amount || 0) - parseFloat(deliveryData.billAmt || 0)
    //                 totalChange = parseFloat(totalValues.change || 0) - parseFloat(deliveryData.billChange || 0)
    //                 console.log('Change', totalChange);
    //                 console.log('Total Amount', totalAmount);
    //                 console.log('Total Desired', totalChange);
    //                 setTotalValues((prev) => ({
    //                     ...prev,
    //                     amount: totalAmount,
    //                     change: totalChange,
    //                     desiredAmount: totalDesiredAmount
    //                 }))
    //                 setItemList(prevList => {
    //                     const updatedList = prevList.map((item, index) => {
    //                         if (index === indexDelete) {
    //                             return {
    //                                 ...item,
    //                                 desiredAmt: item.billChange,
    //                                 billChange: 0
    //                             };
    //                         }
    //                         return item;
    //                     });
    //                     return updatedList;
    //                 });
    //             }
    //             if (deliveryData.billPayType === 'debit') {
    //                 totalDesiredAmount = totalValues.desiredAmount
    //                 totalAmount = parseFloat(totalValues.amount || 0) - parseFloat(deliveryData.billAmt || 0)
    //                 totalChange = parseFloat(totalValues.change || 0) - parseFloat(deliveryData.billChange || 0)
    //                 console.log('Change', totalChange);
    //                 console.log('Total Amount', totalAmount);
    //                 console.log('Total Desired', totalChange);
    //                 setTotalValues((prev) => ({
    //                     ...prev,
    //                     amount: totalAmount,
    //                     change: totalChange,
    //                     desiredAmount: totalDesiredAmount
    //                 }))
    //             }
    //             else if (deliveryData.billPayType === 'cash') {
    //                 totalDesiredAmount = parseFloat(deliveryData.desiredAmt) + parseFloat(deliveryData.billAmt)
    //                 console.log('Change', totalChange);
    //                 console.log('Total Amount', totalAmount);
    //                 console.log('Total Desired', totalChange);
    //                 setTotalValues((prev) => ({
    //                     ...prev,
    //                     desiredAmount: totalDesiredAmount
    //                 }))
    //             }
    //         }
    //         handleUpdatePayType(deliveryData, type, totalDesiredAmount, totalAmount, totalChange)
    //     }
    // }
    const updateMarkingOfDelivery = async (deliveryData, type) => {
        const password = window.prompt("Please enter the password:");
        if (password === "123") {
            console.log('data', deliveryData, 'Type', type);
            let totalChange;
            let totalDesiredAmount;
            let totalAmount;

            const calculateAmounts = (desiredAmt, billChange, billAmt) => {
                totalDesiredAmount = parseFloat(totalValues.desiredAmount || 0) - parseFloat(desiredAmt || 0) + billChange;
                totalChange = parseFloat(totalValues.change || 0);
                totalAmount = parseFloat(totalValues.amount || 0);
            };

            if ((type === 'due' && deliveryData.billPayType === 'cash') ||
                (type === 'online' && deliveryData.billPayType === 'cash') ||
                (type === 'debit' && deliveryData.billPayType === 'cash') ||
                (type === 'online' && deliveryData.billPayType === 'due') ||
                (type === 'due' && deliveryData.billPayType === 'online')) {
                calculateAmounts(deliveryData.desiredAmt, deliveryData.billChange, deliveryData.billAmt);
            } else if (type === 'cash') {
                totalDesiredAmount = parseFloat(totalValues.desiredAmount || 0) + parseFloat(deliveryData.billAmt || 0);
                totalChange = parseFloat(totalValues.change || 0);
                totalAmount = parseFloat(totalValues.amount || 0);
            } else if (type === 'Cancel') {
                if (deliveryData.billPayType === 'online' || deliveryData.billPayType === 'due' || deliveryData.billPayType === 'debit') {
                    totalDesiredAmount = totalValues.desiredAmount;
                    totalAmount = parseFloat(totalValues.amount || 0) - parseFloat(deliveryData.billAmt || 0);
                    totalChange = parseFloat(totalValues.change || 0) - parseFloat(deliveryData.billChange || 0);
                } else if (deliveryData.billPayType === 'cash') {
                    totalDesiredAmount = parseFloat(totalValues.desiredAmount || 0) - parseFloat(deliveryData.desiredAmt || 0) + parseFloat(deliveryData.billChange || 0);
                    totalChange = parseFloat(totalValues.change || 0);
                    totalAmount = parseFloat(totalValues.amount || 0);
                }
            }

            console.log('Total Amount', totalAmount);
            console.log('Total Change', totalChange);
            console.log('Total Desired Amount', totalDesiredAmount);

            setTotalValues({
                desiredAmount: totalDesiredAmount,
                amount: totalAmount,
                change: totalChange
            });

            setItemList(prevList => {
                const updatedList = prevList.map((item, index) => {
                    if (index === indexDelete) {
                        return {
                            ...item,
                            desiredAmt: item.billChange,
                            billChange: 0
                        };
                    }
                    return item;
                });
                return updatedList;
            });

            handleUpdatePayType(deliveryData, type, totalDesiredAmount, totalAmount, totalChange);
        }
    };
    const updateMarkingOfDeliveryDue = async (deliveryData, type) => {
        const password = window.prompt("Please enter the password:");
        if (password === "123") {
            console.log('data', deliveryData, 'Type', type);
            let totalChange;
            let totalDesiredAmount;
            let totalAmount;

            const calculateAmounts = (desiredAmt, billChange, billAmt) => {
                totalDesiredAmount = parseFloat(totalValues.desiredAmount || 0) - parseFloat(desiredAmt || 0) + billChange;
                totalChange = parseFloat(totalValues.change || 0);
                totalAmount = parseFloat(totalValues.amount || 0);
            };

            if ((type === 'due' && deliveryData.billPayType === 'cash') ||
                (type === 'online' && deliveryData.billPayType === 'cash') ||
                (type === 'debit' && deliveryData.billPayType === 'cash') ||
                (type === 'online' && deliveryData.billPayType === 'due') ||
                (type === 'due' && deliveryData.billPayType === 'online')) {
                calculateAmounts(deliveryData.desiredAmt, deliveryData.billChange, deliveryData.billAmt);
            } else if (type === 'cash') {
                totalDesiredAmount = parseFloat(totalValues.desiredAmount || 0) + parseFloat(deliveryData.billAmt || 0);
                totalChange = parseFloat(totalValues.change || 0);
                totalAmount = parseFloat(totalValues.amount || 0);
            } else if (type === 'Cancel') {
                if (deliveryData.billPayType === 'online' || deliveryData.billPayType === 'due' || deliveryData.billPayType === 'debit') {
                    totalDesiredAmount = totalValues.desiredAmount;
                    totalAmount = parseFloat(totalValues.amount || 0) - parseFloat(deliveryData.billAmt || 0);
                    totalChange = parseFloat(totalValues.change || 0) - parseFloat(deliveryData.billChange || 0);
                } else if (deliveryData.billPayType === 'cash') {
                    totalDesiredAmount = parseFloat(totalValues.desiredAmount || 0) - parseFloat(deliveryData.desiredAmt || 0) + parseFloat(deliveryData.billChange || 0);
                    totalChange = parseFloat(totalValues.change || 0);
                    totalAmount = parseFloat(totalValues.amount || 0);
                }
            }

            console.log('Total Amount', totalAmount);
            console.log('Total Change', totalChange);
            console.log('Total Desired Amount', totalDesiredAmount);

            setTotalValues({
                desiredAmount: totalDesiredAmount,
                amount: totalAmount,
                change: totalChange
            });

            setItemList(prevList => {
                const updatedList = prevList.map((item, index) => {
                    if (index === indexDelete) {
                        return {
                            ...item,
                            desiredAmt: item.billChange,
                            billChange: 0
                        };
                    }
                    return item;
                });
                return updatedList;
            });

            handleUpdatePayType(deliveryData, type, totalDesiredAmount, totalAmount, totalChange);
        }
    };
    const handleUpdatePayType = async (deliveryData, type, totalDesiredAmount, totalAmount, totalChange) => {
        const UpiJsonData = upiId.find(val => val.upiId === selectedUpiData);
        let jsonData;
        if (type === 'online') {
            jsonData = {
                deliveryId: data.deliveryId,
                totalBillAmt: totalAmount,
                totalChange: totalChange,
                onlineId: UpiJsonData.onlineId,
                isOfficial: UpiJsonData.isOfficial,
                totalDesiredAmt: totalDesiredAmount,
                payTypeData: {
                    bwdId: deliveryData.bwdId,
                    billId: deliveryData.billId,
                    deliveryType: deliveryData.deliveryType,
                    billPayType: type,
                    billAmt: deliveryData.billAmt,
                    billChange: deliveryData.billChange,
                    desiredAmt: (() => {
                        switch (type) {
                            case 'online':
                            case 'due':
                            case 'debit':
                            case 'Cancel':
                                return deliveryData.billChange;
                            case 'cash':
                                return parseFloat(deliveryData.billAmt) + parseFloat(deliveryData.desiredAmt);
                            case 'complimentary':
                                return 0;
                            default:
                                return undefined;
                        }
                    })()
                }
            };
        } else if (type === 'due') {
            jsonData = {
                deliveryId: data.deliveryId,
                totalBillAmt: totalAmount,
                totalChange: totalChange,
                billNote: dueFormData.dueNote,
                accountId: dueFormData.accountId,
                totalDesiredAmt: totalDesiredAmount,
                payTypeData: {
                    bwdId: deliveryData.bwdId,
                    billId: deliveryData.billId,
                    deliveryType: deliveryData.deliveryType,
                    billPayType: type,
                    billAmt: deliveryData.billAmt,
                    billChange: deliveryData.billChange,
                    desiredAmt: (() => {
                        switch (type) {
                            case 'online':
                            case 'due':
                            case 'debit':
                            case 'Cancel':
                                return deliveryData.billChange;
                            case 'cash':
                                return parseFloat(deliveryData.billAmt) + parseFloat(deliveryData.desiredAmt);
                            case 'complimentary':
                                return 0;
                            default:
                                return undefined;
                        }
                    })()
                }
            };
        }
        else {
            jsonData = {
                deliveryId: data.deliveryId,
                totalBillAmt: totalAmount,
                totalChange: totalChange,
                totalDesiredAmt: totalDesiredAmount,
                payTypeData: {
                    bwdId: deliveryData.bwdId,
                    billId: deliveryData.billId,
                    deliveryType: deliveryData.deliveryType,
                    billPayType: type,
                    billAmt: deliveryData.billAmt,
                    billChange: deliveryData.billChange,
                    desiredAmt: (() => {
                        switch (type) {
                            case 'online':
                            case 'due':
                            case 'debit':
                            case 'Cancel':
                                return deliveryData.billChange;
                            case 'cash':
                                return parseFloat(deliveryData.billAmt) + parseFloat(deliveryData.desiredAmt);
                            case 'complimentary':
                                return 0;
                            default:
                                return undefined;
                        }
                    })()
                }
            };
        }

        console.log('JsonData:-', jsonData)
        await axios.post(`${BACKEND_BASE_URL}deliveryAndPickUprouter/changePayTypeByDelivery`, jsonData, config)
            .then((res) => {
                console.log(res.data)
                // get  DeliverCardData();
                fetchCardData()
                handleClose();
                setDueFormData({
                    accountId: '',
                    dueNote: '',
                    selectedAccount: ''
                })
                setOpenDue(false);
                setFormData({
                    token: ''
                })
            })
            .catch((error) => {
                setFormData({
                    token: ''
                })
                console.log('Error', error)
                setError(error?.response?.data || 'Network Error!!!...')
            })
    }
    const fetchCardData = async () => {
        try {
            await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getOnDeliveryData`, config)
                .then((res) => {
                    const deliveryId = data.deliveryId
                    const findDelivery = res.data.find(val => val.deliveryId === deliveryId)
                    const deliveryData = findDelivery.deliveryData
                    setItemList(deliveryData)
                    console.log('Response Data', findDelivery)
                })
                .catch((error) => {
                    console.log('Error', error)
                })
        } catch (error) {
            console.log('error', error)
        }
    }
    const handleChangeUPI = (event) => {
        setSelectedUpiData(event.target.value);
    };
    const handleSaveUpiId = async () => {
        const DeliveryData = itemList.find((_, index) => index === indexDelete);
        console.log('DeliverdData', DeliveryData)
        setUpiIdPopUp(false)
        updateMarkingOfDelivery(DeliveryData, 'online')
        setSelectedUpiData(upiId[0].upiId)
    }

    const handleDue = (DeliveryData) => {
        handleClose();
        setOpenDue(true);
        setOpenDueSelected(DeliveryData)
        // updateMarkingOfDelivery(DeliveryData, type)
    }
    return (
        <div className='w-full'>
            <div className="overflow-hidden w-full bg-white rounded-lg shadow-md border ">
                <div className="cardHeader">
                    <div className="topHeader">
                        <div className={`deliveryManInfo items-center ${timerClass} px-3 py-2 flex w-full justify-between pl-2`}>
                            <div className="name flex items-center w-2/5 text-ellipsis">
                                {isEdit ? (
                                    <select
                                        name="deliverMan"
                                        className='custom-select editWidth'
                                        defaultValue={selectedDeliveryManName.personName}
                                        onChange={(e) => {
                                            const selectedPerson = deliveryManData.find(val => val.personName === e.target.value);
                                            setDeliveryManId(selectedPerson?.personId || '');
                                        }}
                                    >
                                        <option value="" disabled>Delivery Man</option>
                                        {deliveryManData && deliveryManData.map((val, index) => (
                                            <option value={val.personName} key={index}>{val.personName}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div
                                        className="cursor-pointer w-full text-ellipsis text-lg overflow-hidden whitespace-nowrap"
                                        onClick={() => setIsEdit(true)}
                                    >
                                        {selectedDeliveryManName?.personName}
                                    </div>

                                )}
                                {/* {!isEdit && (
                                    <div className="edit-icon ml-2" onClick={() => setIsEdit(true)}>
                                        <ModeEditIcon />
                                    </div>
                                )} */}
                                {isEdit && (
                                    <div className="edit-actions cursor-pointer flex gap-2 ml-2">
                                        <div className="cursor-pointer" onClick={() => handleUpdateDeliveryMan()}>
                                            <CheckIcon className='TopHeaderIcon' />
                                        </div>
                                        {/* <div className="cancel-icon" onClick={() => setIsEdit(false)}>
                                            <CloseIcon />
                                        </div> */}
                                    </div>
                                )}
                            </div>
                            <div className="timer text-start mr-36">
                                <p className=" bg-white rounded-2xl px-3 p-1">
                                    <Timer startTime={data?.timeDifference} onTimeUpdate={updateTimerClass} />
                                </p>
                            </div>
                            <div className="cursor-pointer" onClick={removerDelivery}>
                                <ClearIcon className='TopHeaderIcon' />
                            </div>
                        </div>
                        <div className="bottomHeader border-t border-gray-300 " >
                            <div className="grid grid-cols-12 w-full gap-2 px-3 py-2">
                                <div className="bottomHeaderBillNo col-span-2 mr-5">
                                    <input
                                        type="text"
                                        placeholder="Tkn No"
                                        className={`popoverSearch w-full p-1 rounded-md border ${isTokenError ? 'input-error' : 'border-black'}`}
                                        ref={tokenRef}
                                        value={formData.token || ''}
                                        onChange={handleBillNoChange}
                                        onKeyDown={handleBillNoKeyDown}
                                    />
                                    {isTokenError && (
                                        <p className="helper-text">Enter No</p>
                                    )}
                                </div>
                                {isOther ? (
                                    <>
                                        <div className="bottomHeaderBillNo col-span-5 mr-5">
                                            <input
                                                type="text"
                                                placeholder="Comment"
                                                className="popoverSearch w-full p-1 rounded-md border border-black"
                                                value={formData.Comment || ''}
                                                ref={commentRef}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        Comment: e.target.value
                                                    }))
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        desiredAmountRef.current.focus();
                                                    }
                                                }}
                                                disabled={!formData.token ? true : false}
                                            />
                                        </div>
                                        <div className="bottomHeaderBillNo col-span-3 mr-5">
                                            <input
                                                type="text"
                                                placeholder="Desired Amt."
                                                className="popoverSearch w-full p-1 rounded-md border border-black"
                                                ref={desiredAmountRef}
                                                value={formData.billAmt || ''}
                                                onChange={handleDesiredAmountChangeOther}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddData();
                                                    }
                                                }}
                                                disabled={!formData.token ? true : false}
                                            />
                                        </div>
                                    </>
                                ) :
                                    isBill ? (
                                        <>
                                            <div className="bottomHeaderBillNo col-span-3 mr-5">
                                                <input
                                                    type="text"
                                                    placeholder="Comment"
                                                    className="popoverSearch w-full p-1 rounded-md border border-black"
                                                    value={formData.Comment || ''}
                                                    ref={commentRef}
                                                    onChange={(e) => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            Comment: e.target.value
                                                        }))
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            priceRef.current.focus();
                                                        }
                                                    }}
                                                    disabled={!formData.token ? true : false}
                                                />
                                            </div>
                                            <div className="bottomHeaderBillNo col-span-3 mr-5">
                                                <input
                                                    type="text"
                                                    placeholder="Price"
                                                    className="popoverSearch w-full p-1 rounded-md border border-black"
                                                    value={formData.billAmt || ''}
                                                    readOnly={!isBill ? true : false}
                                                    ref={priceRef}
                                                    onChange={(e) => {
                                                        if (regex.test(e.target.value)) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                billAmt: e.target.value || '0',
                                                                desiredAmt: e.target.value || '0'
                                                            }))
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            changeRef.current.focus();
                                                        }
                                                    }}
                                                    disabled={!formData.token ? true : false}
                                                />
                                            </div>
                                            <div className="bottomHeaderBillNo col-span-2 mr-5">
                                                <input
                                                    type="text"
                                                    placeholder="Change"
                                                    className="popoverSearch w-full p-1 rounded-md border border-black"
                                                    ref={changeRef}
                                                    value={formData.billChange || ''}
                                                    onChange={(e) => {
                                                        if (regex.test(e.target.value)) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                billChange: e.target.value || '',
                                                                desiredAmt: parseInt(e.target.value || 0) + parseInt(formData.billAmt || 0)
                                                            }));
                                                        }
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.select();
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            // desiredAmountRef.current.focus();
                                                            handleAddData();
                                                        }
                                                    }}
                                                    disabled={!formData.token ? true : false}
                                                />
                                            </div>
                                            {/* <div className="bottomHeaderBillNo col-span-3 mr-5">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Desired Amount"
                                                                        className="popoverSearch w-full p-1 rounded-md border border-black"
                                                                        ref={desiredAmountRef}
                                                                        value={formData.desiredAmount}
                                                                        onChange={handleDesiredAmountChange}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                e.preventDefault();
                                                                                handleAddData();
                                                                            }
                                                                        }}
                                                                    />
                                                                </div> */}
                                        </>
                                    ) :
                                        (
                                            <>
                                                <div className="bottomHeaderBillNo col-span-3 mr-5">
                                                    <input
                                                        type="text"
                                                        placeholder="Price"
                                                        className="popoverSearch w-full p-1 rounded-md border border-black"
                                                        value={formData.billAmt || ''}
                                                        readOnly
                                                        disabled={!formData.token ? true : false}
                                                    />
                                                </div>
                                                <div className="bottomHeaderBillNo col-span-2 mr-5">
                                                    <input
                                                        type="text"
                                                        placeholder="Change"
                                                        className="popoverSearch w-full p-1 rounded-md border border-black"
                                                        ref={changeRef}
                                                        value={formData.billChange || ''}
                                                        onChange={(e) => {
                                                            if (regex.test(e.target.value)) {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    billChange: e.target.value,
                                                                    desiredAmt: parseInt(e.target.value || 0) + parseInt(formData.billAmt || 9)
                                                                }));
                                                            }
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.select();
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                desiredAmountRef.current.focus();
                                                            }
                                                        }}
                                                        disabled={!formData.token ? true : false}
                                                    />
                                                </div>
                                                <div className="bottomHeaderBillNo col-span-3 mr-5">
                                                    <input
                                                        type="text"
                                                        placeholder="Desired Amt."
                                                        className="popoverSearch w-full p-1 rounded-md border border-black"
                                                        ref={desiredAmountRef}
                                                        value={formData.desiredAmt || ''}
                                                        onChange={handleDesiredAmountChange}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddData();
                                                            }
                                                        }}
                                                        disabled={!formData.token ? true : false}
                                                    />
                                                </div>
                                            </>
                                        )}
                                <div className="bottomHeaderBillNo col-span-2">
                                    <button
                                        className="bg-blue-500 rounded-md text-white w-full px-4 p-1"
                                        onClick={handleAddData}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="itemsData border-t border-black " style={{ backgroundColor: '#F3E6FE' }}> */}
                <div className="itemsData border-t border-black " >
                    <div className="w-full ">
                        <div className="flex font-semibold text-sm px-2">
                            <div className="font-bold w-1/12 text-sm p-2 px-0">Tkn</div>
                            <div className="font-bold addressWidth text-sm p-2 px-0">Address</div>
                            <div className="font-bold w-1/6 text-sm py-2 text-end">Bill Amt.</div>
                            <div className="font-bold w-1/6 text-sm py-2 px-1 text-end">Change</div>
                            <div className="font-bold w-1/6 text-sm py-2  text-end">Desired</div>
                        </div>
                        <div className="overflow-y-auto" style={{ height: '180px' }}>
                            {itemList && itemList.map((bill, index) => (
                                <div key={index} className={`flex items-center border-b border-gray-300 px-2 ${bill.billPayType === 'Cancel' ? 'bg-red-100' : bill.billPayType === 'online' ? 'bg-green-100' : bill.billPayType === 'due' ? 'bg-blue-100' : bill.billPayType === 'debit' ? 'bg-indigo-200' : bill.billPayType === 'complimentary' ? 'bg-fuchsia-200' : ''}`}>
                                    <div className="w-1/12 font-semibold text-start  text-sm p-1 px-0">{bill.token}</div>
                                    <Tooltip title={bill.billAddress} arrow>
                                        <div className="addressWidth font-semibold text-sm text-start pl-1 p-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {bill.billAddress ? bill.billAddress.slice(0, 24) : bill.Comment ? bill.Comment : ''}
                                        </div>
                                    </Tooltip>
                                    <div className="w-1/6 font-semibold text-end  text-sm p-1">{bill.billAmt}</div>
                                    <div className="w-1/6 font-semibold text-end  text-sm p-1 pr-0 pl-1">{bill.billChange || '0'}</div>
                                    <div className="w-1/5 font-semibold text-sm text-end pr-2 pl-0 p-2">{bill.desiredAmt || '0'}</div>
                                    <div className="w-fit font-semibold text-sm text-end px-0">
                                        <div className="">
                                            <IconButton
                                                aria-label="more"
                                                id={`long-button-${index}`}
                                                aria-controls={openIndex === index ? 'long-menu' : undefined}
                                                aria-expanded={openIndex === index ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={(event) => handleClick(event, index, bill)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            {openIndex === index && (
                                                <Menu
                                                    id="long-menu"
                                                    MenuListProps={{
                                                        'aria-labelledby': `long-button-${index}`,
                                                    }}
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleClose}
                                                    PaperProps={{
                                                        style: {
                                                            maxHeight: ITEM_HEIGHT * 4.5,
                                                            width: '20ch',
                                                        },
                                                    }}
                                                >
                                                    <div>
                                                        {selectedBill.deliveryType === 'other' && (
                                                            <MenuItem onClick={handleDeleteItem}>
                                                                Delete
                                                            </MenuItem>
                                                        )}
                                                        {selectedBill.deliveryType === 'Due Bill' && (
                                                            <>
                                                                {/* <MenuItem onClick={() => updateMarkingOfDelivery(bill, 'cancel')}>
                                                                    Cancel
                                                                </MenuItem> */}
                                                                <MenuItem onClick={handleDeleteItem}>
                                                                    Delete
                                                                </MenuItem>
                                                            </>
                                                        )}
                                                        {selectedBill.deliveryType === 'Hotel' && (
                                                            <>
                                                                <MenuItem onClick={() => updateMarkingOfDelivery(bill, 'Cancel')}>
                                                                    Cancel
                                                                </MenuItem>
                                                                <MenuItem onClick={handleDeleteItem}>
                                                                    Delete
                                                                </MenuItem>
                                                            </>
                                                        )}
                                                        {(selectedBill.deliveryType === 'Delivery' || selectedBill.deliveryType === 'Pick Up') && (
                                                            <>
                                                                {selectedBill.billPayType === 'cash' && (
                                                                    <div>
                                                                        <MenuItem onClick={() => setUpiIdPopUp(true)}>
                                                                            Online
                                                                        </MenuItem>
                                                                        <MenuItem onClick={() => handleDue(selectedBill, 'due')}>
                                                                            Due
                                                                        </MenuItem>
                                                                        <MenuItem onClick={() => updateMarkingOfDelivery(selectedBill, 'Cancel')}>
                                                                            Cancel
                                                                        </MenuItem>
                                                                    </div>
                                                                )}
                                                                {selectedBill.billPayType === 'online' && (
                                                                    <div>
                                                                        <MenuItem onClick={() => updateMarkingOfDelivery(selectedBill, 'cash')}>
                                                                            Cash
                                                                        </MenuItem>
                                                                        <MenuItem onClick={() => handleDue(selectedBill, 'due')}>
                                                                            Due
                                                                        </MenuItem>
                                                                        <MenuItem onClick={() => updateMarkingOfDelivery(selectedBill, 'Cancel')}>
                                                                            Cancel
                                                                        </MenuItem>
                                                                    </div>
                                                                )}
                                                                {selectedBill.billPayType === 'due' && (
                                                                    <div>
                                                                        <MenuItem onClick={() => updateMarkingOfDelivery(selectedBill, 'cash')}>
                                                                            Cash
                                                                        </MenuItem>
                                                                        <MenuItem onClick={() => setUpiIdPopUp(true)}>
                                                                            Online
                                                                        </MenuItem>
                                                                        <MenuItem onClick={() => updateMarkingOfDelivery(selectedBill, 'Cancel')}>
                                                                            Cancel
                                                                        </MenuItem>
                                                                    </div>
                                                                )}
                                                                <MenuItem onClick={handleDeleteItem}>
                                                                    Delete
                                                                </MenuItem>
                                                            </>
                                                        )}
                                                    </div>
                                                </Menu>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* <div className="flex font-semibold text-sm border-t border-black">
                            <div className="w-48 customTotal p-2 font-bold ">Total {'(' + itemList.length + ')'}</div>
                            <div className="font-bold addressWidth text-sm text-start pl-3 p-2">{""}</div>
                            <div className="font-bold w-1/6 text-sm py-2 text-end p-2">{parseFloat(totalValues.amount).toLocaleString('en-IN')}</div>
                            <div className="font-bold w-1/6 text-sm py-2 px-1 text-end p-2">{parseFloat(totalValues.change).toLocaleString('en-IN')}</div>
                            <div className="font-bold w-1/6 text-sm py-2  text-end p-1">{parseFloat(totalValues.desiredAmount).toLocaleString('en-IN')}</div>
                        </div> */}
                        <div className="flex text-base text-gray-700 border-t border-black">
                            {/* Left-aligned Total */}
                            <div className="w-48 p-2 font-bold">Total ({itemList.length})</div>

                            {/* Right-aligned values container */}
                            <div className="flex w-full justify-end space-x-7 mr-6">
                                <div className="w-1/6 p-2 text-end font-bold">{parseFloat(totalValues.amount).toLocaleString('en-IN')}</div>
                                <div className="w-1/6 p-2 text-end font-bold">{parseFloat(totalValues.change).toLocaleString('en-IN')}</div>
                                <div className="w-1/6 p-2 text-end font-bold">{parseFloat(totalValues.desiredAmount).toLocaleString('en-IN')}</div>
                            </div>
                        </div>

                    </div>
                    <div className="p-2 text-end w-full justify-between flex border-gray-300 ">
                        <div className='text-lg text-green-700 pt-1 tracking-normal font-semibold cursor-pointer transform hover:scale-[1.05] duration-300 ease-in-out hover:text-gray-600'>
                            {data?.mobileNo && <><LocalPhoneIcon className='mb-0.5' fontSize='small' /> {data?.mobileNo}</>}
                        </div>
                        <button
                            className='p-1 px-4 text-white bg-red-600  text-semibold text-lg rounded-xl transform transition-transform hover:-translate-y-0.5 duration-300 ease-in-out hover:bg-red-500'
                            onClick={deleteCards}
                        >
                            <DoDisturbAltIcon className='mb-0.5 mr-0.5' fontSize='small' /> Stop Delivery
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                open={upiIdPopUp}
                onClose={() => setUpiIdPopUp(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='p-4 rounded-md'>
                    <div className="bg-white w-full">
                        <div className="w-full mb-4 popHeading">
                            Set UPI Id
                        </div>
                        <hr className='mb-4' />
                        <div className="flex gap-4">
                            <div className="w-2/5">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">UPI Id</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="UPI Id"
                                        value={selectedUpiData}
                                        onChange={handleChangeUPI}
                                    >
                                        {upiId && upiId?.map((val, index) => (
                                            <MenuItem key={index} value={val.upiId} >{val.upiId}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="w-1/4">
                                <button onClick={handleSaveUpiId} className="addCategorySaveBtn ml-4">Save</button>
                            </div>
                            <div className="w-1/4">
                                <button onClick={() => setUpiIdPopUp(false)} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={updateDeliveryPopUp}
                onClose={() => setUpdatDeliveryPopUp(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='rounded-md border-none'>
                    <div className="p-2">
                        <div className="flex border-b justify-between">
                            <div className=" p-2">
                                Are You Sure You Want to Stop This Delivery ?
                            </div>
                            {/* <div className="p-2">
                                {elapsedTime}
                            </div> */}
                        </div>
                        <div className="overflow-hidden w-full bg-white rounded-lg  ">
                            <div className="cardHeader">
                                <div className="topHeader">
                                    <div className={`deliveryManInfo items-center px-3 py-2 flex w-full justify-between pl-2`}>
                                        <div className="name flex items-center w-2/5">
                                            <div className="cursor-pointer">
                                                {/* {selectedDeliveryManName?.personName} */}
                                                {updateDeliveryPopUpData?.personName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="itemsData border-t border-gray-300 ">
                                <div className="w-full  px-2">
                                    <div className="flex font-semibold text-sm border-b">
                                        <div className="w-1/12 text-sm p-2">Tkn</div>
                                        <div className="addressWidth text-sm text-start pl-3 p-2">Address</div>
                                        <div className="w-1/6 text-sm py-2 text-end">Pay Type</div>
                                        <div className="w-1/6 text-sm py-2 text-end">Bill Amt.</div>
                                        <div className="w-1/6 text-sm py-2 px-1 text-end">Change</div>
                                        <div className="w-1/6 text-sm py-2  text-end">Desired</div>
                                    </div>
                                    <div className="overflow-y-auto " style={{ height: '180px' }}>
                                        {updateDeliveryPopUpData?.deliveryData && updateDeliveryPopUpData?.deliveryData.map((bill, index) => (
                                            <div key={index} className={`flex items-center  border-b border-gray-300 ${bill.billPayType === 'Cancel' ? 'bg-red-100' : bill.billPayType === 'online' ? 'bg-green-100' : bill.billPayType === 'due' ? 'bg-blue-100' : bill.billPayType === 'debit' ? 'bg-indigo-200' : bill.billPayType === 'complimentary' ? 'bg-fuchsia-200' : ''}`}>
                                                <div className="w-1/12 font-semibold text-start  text-sm  px-2">{bill.token ? bill.token : (index + 1)}</div>
                                                <Tooltip title={bill.billAddress} arrow >
                                                    <div className="addressWidth cursor-pointer font-semibold text-sm text-start pl-1 p-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {bill.billAddress ? bill.billAddress.slice(0, 24) : ''}
                                                    </div>
                                                </Tooltip>
                                                <div className="w-1/6 font-semibold text-end  text-sm p-1">{bill.billPayType}</div>
                                                <div className="w-1/6 font-semibold text-end  text-sm p-1">{bill.billAmt}</div>
                                                <div className="w-1/6 font-semibold text-end  text-sm p-1 pr-0 pl-1">{bill.billChange || '0'}</div>
                                                <div className="w-1/5 font-semibold text-sm text-end pr-2 pl-0 p-2">{bill.desiredAmt || '0'}</div>
                                                <div className="w-fit font-semibold text-sm text-end  px-0">
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='border-t border-black flex items-center justify-end'>
                                        <div className="w-1/6 font-bold customTotal  text-start pl-2">Total</div>
                                        <div className="w-1/6 font-semibold customTotal text-md  text-start "></div>
                                        <div className="w-1/6 font-semibold customTotal text-start p-1"></div>
                                        <div className="w-1/6 font-semibold customTotal text-end  text-sm ">
                                            {parseFloat(totalValues?.amount).toLocaleString('en-IN')}
                                        </div>
                                        <div className="w-1/6 font-semibold customTotal text-end pr-2 text-sm">
                                            {/* {itemList.reduce((acc, bill) => acc + parseFloat(bill.change || 0), 0)} */}
                                            {parseFloat(totalValues?.change).toLocaleString('en-IN')}
                                        </div>
                                        <div className="w-1/6 font-semibold customTotal text-sm text-end pr-2 p-2">
                                            {/* {itemList.reduce((acc, bill) => acc + parseFloat(bill.desiredAmount || 0), 0)} */}
                                            {parseFloat(totalValues?.desiredAmount).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end px-2 pb-2 gap-3 ">
                                    {/* <div
                                                className=" cursor-pointer  bg-blue-500 flex items-center py-3 px-3 justify-center BackArroIconDiv  w-20 gap-2 rounded-lg border"
                                                // onClick={() => setInfoPopUpOpen(false)}
                                                onClick={() => {
                                                    updateDelivery();
                                                }}
                                            >
                                                Yes */}
                                    {/* </div> */}
                                    <div className="flex gap-6 mt-6 w-3/6 ">
                                        <div className="w-full">
                                            <button
                                                className="addCategorySaveBtn CustoButtonPopUp "
                                                onClick={() => {
                                                    stopDelivery();
                                                }}
                                            >Yes</button>
                                        </div>
                                        <div className="w-full">
                                            <button onClick={() => {
                                                setUpdatDeliveryPopUp(false);
                                                setUpdateDeliveryPopUpData('')
                                                setFormData({
                                                    change: 0,
                                                    desiredAmount: 0,
                                                    price: '',
                                                    token: ''
                                                });
                                            }} className="addCategoryCancleBtn CustoButtonPopUp bg-gray-700">Cancel</button>
                                        </div>
                                    </div>
                                    {/* <div
                                                className=" bg-white cursor-pointer border-black flex items-center justify-center BackArroIconDiv  w-20 gap-2 rounded-lg border"
                                                onClick={() => {
                                                    setUpdatDeliveryPopUp(false);
                                                    setUpdateDeliveryPopUpData('')
                                                    setFormData({
                                                        change: 0,
                                                        desiredAmount: 0,
                                                        price: '',
                                                        token: ''
                                                    });
                                                    setItemList([])
                                                    setDeliveryManName('')
                                                }}
                                            >
                                                Cancel
                                            </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openDue}
                onClose={handleCloseDue}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleDue}>
                    <Typography id="modal-modal-title" className="flex justify-between" variant="h6" component="h2">
                        <div>Select Account</div><div className="flex" style={{ marginTop: '-2px', cursor: 'pointer' }} onClick={() => handleCloseDue()}><Close className="self-center" /></div>
                    </Typography>
                    <div className="gap-4 grid mt-6 mb-4">
                        {addAccount ?
                            <>
                                <div>
                                    <TextField
                                        // className="sarchTextTEST"
                                        value={accountFormData.customerName}
                                        name="customerName"
                                        id="customerName"
                                        placeholder='Enter Customer Name'
                                        variant="outlined"
                                        onChange={(e) => {
                                            setAccountFormData((prev) => ({
                                                ...prev,
                                                customerName: e.target.value
                                            }))
                                        }}
                                        fullWidth
                                    />
                                </div>
                                <div>
                                    <TextField
                                        // className="sarchTextTEST"
                                        value={accountFormData.customerNumber}
                                        name="customerNumber"
                                        id="customerNumber"
                                        placeholder='Enter Customer Number'
                                        variant="outlined"
                                        onChange={(e) => {
                                            if ((regexMobile.test(e.target.value) || e.target.value == '') && e.target.value.length < 11) {
                                                setAccountFormData((prev) => ({
                                                    ...prev,
                                                    customerNumber: e.target.value
                                                }))
                                            }
                                        }}
                                        fullWidth
                                    />
                                </div>
                                <div className="flex gap-4 justify-end">
                                    <div>
                                        <button
                                            className="text-base button px-2 py-1 rounded-md text-white"
                                            onClick={() => handleSaveAccount()}
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                            onClick={() => {
                                                setAccountFormData({
                                                    customerName: "",
                                                    customerNumber: ""
                                                });
                                                setAddAccount(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className="flex gap-4 justify-end">
                                    <div>
                                        <button
                                            className="text-base addAcBtn px-2 py-1 rounded-md text-white"
                                            onClick={() => clickAddAccount()}
                                        >
                                            Add Account
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Autocomplete
                                        options={accountList ? accountList : []}
                                        defaultValue={null}
                                        getOptionLabel={(options) =>
                                            options.customerName ? options.customerName : ""
                                        }
                                        value={dueFormData.selectedAccount}
                                        onChange={handleAccountChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Accounts"
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        // className="sarchTextTEST"
                                        value={dueFormData.dueNote}
                                        name="dueNote"
                                        id="dueNote"
                                        placeholder='Enter Note'
                                        variant="outlined"
                                        onChange={(e) => {
                                            setDueFormData((prev) => ({
                                                ...prev,
                                                dueNote: e.target.value
                                            }))
                                        }}
                                        // InputLabelProps={{ style: { fontSize: 16 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className="flex gap-4 justify-end">
                                    {/* <div>
                                        <button
                                            className="text-base button px-2 py-1 rounded-md text-white"
                                            onClick={() => justDue()}
                                        >
                                            Just Due
                                        </button>
                                    </div> */}
                                    <div>
                                        <button
                                            className="text-base button px-2 py-1 rounded-md text-white"
                                            onClick={() => saveDue()}
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="another_2 button text-base px-2 py-1 rounded-md text-white"
                                            onClick={() => {
                                                handleCloseDue();
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default Cards;

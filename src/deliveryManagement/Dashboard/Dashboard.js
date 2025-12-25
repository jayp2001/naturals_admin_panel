import React, { useState, useRef, useEffect, useMemo } from 'react';
import './css/Dashboard.css';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Cards from './Cards';
import { Box, Checkbox, IconButton, Menu, MenuItem, Modal, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { BACKEND_BASE_URL } from './../../url';
import { ToastContainer, toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import {
    InputAdornment, TextField
} from '@mui/material';

const Dashboard = () => {
    const [isEdit, setIsEdit] = useState(false);
    const desiredAmountRef = useRef(null);
    const [billData, setBillData] = useState([]);
    const [deliveryManData, setDeliveryManData] = useState([]);
    const [formData, setFormData] = useState({
        token: '',
        change: '',
        desiredAmount: '',
        price: ''
    });
    const [itemList, setItemList] = useState([]);
    const [cardList, setCardList] = useState([]);
    const [selectedToken, setSelectedToken] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [deliveryManId, setDeliveryManId] = useState('');
    const [isTokenError, setIsTokenError] = useState(false);
    const regex = /^\d*\.?\d*$/;
    const [totalValues, setTotalValues] = useState({
        amount: '',
        change: '',
        desiredAmount: ''
    });
    const [isOther, setIsOther] = useState(false);
    const [searchWord, setSearchWord] = useState('');
    const [filteredTokenData, setFilteredTokenData] = useState([]);
    const [isBill, setIsBill] = useState(false);
    const [deliveryStaticCard, setDeliveyStaticCard] = useState(false)
    const changeRef = useRef(null);
    const open = Boolean(anchorEl);
    const tokenRef = useRef(null);
    const commentRef = useRef(null)
    const priceRef = useRef(null)
    const ITEM_HEIGHT = 48;


    const updateBillStatus = async (tknNo) => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/updateTokenToDisplay?tokenNo=${tknNo}`, config)
            .then((res) => {
                setSuccess("done")
            })
            .catch((error) => {
                console.log('Error =>', error);
                setError(error?.response?.data || 'Network Error!');
                setSearchWord('');
            });
    };
    useEffect(() => {
        getDeliveryManData();
        getDeliverCardData();
    }, []);
    const onSearchChange = (e) => {
        setSearchWord(e.target.value);
    };
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [updateDeliveryPopUp, setUpdatDeliveryPopUp] = useState(false)
    const [updateDeliveryPopUpData, setUpdateDeliveryPopUpData] = useState()
    const [deliveryManName, setDeliveryManName] = useState('')
    const [isPriceError, setIsPriceError] = useState(false)
    const [openIndex, setOpenIndex] = useState(null);



    const clearDispay = async () => {
        const userConfirmed = window.confirm('Are You Sure You Want to Clear Display');
        if (!userConfirmed) {
            return;
        }

        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/clearAllDisplayToken`, config)
            .then((res) => {
                console.log('res', res.data);
            })
            .catch((error) => {
                console.log('Error ==> ', error);
            });
    };

    const handleClick = (event, token, bill) => {
        setAnchorEl(event.currentTarget);
        setSelectedToken(token);
        console.log('Bill', bill)
        setOpenIndex(token)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'm') {
                setDeliveyStaticCard((prevState) => !prevState);
                handleClose();
                handleReset();
                // if (tokenRef && tokenRef.current) {
                //     tokenRef.current.focus();
                // }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);



    const handleDesiredAmountChange = (e) => {
        const changeValue = e.target.value;
        if (regex.test(changeValue)) {
            const billAmountValue = parseInt(formData.price);

            if (isOther) {
                setFormData((prev) => ({
                    ...prev,
                    price: e.target.value
                }))
            }
            else {
                setFormData((prev) => ({
                    ...prev,
                    desiredAmount: e.target.value,
                    change: changeValue - billAmountValue
                }));
            }
        }
    };

    const handleBillNoChange = (e) => {
        const token = e.target.value.toUpperCase();
        setFormData((prev) => ({
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

    const handleBillNoKeyDown = async (e) => {
        if (!loading && !success) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!formData.token) {
                    return setIsTokenError(true)
                }
                if (isOther) {
                    commentRef?.current?.focus();
                    setFormData((prev) => ({
                        ...prev,
                        billPayType: 'other',
                        billType: 'other',
                        tokenNo: 'O'
                    }))
                }
                else if (isBill) {
                    commentRef.current.focus();
                    setFormData((prev) => ({
                        ...prev,
                        billPayType: 'Due Bill',
                        billType: 'Due Bill',
                        tokenNo: 'B'
                    }))
                }
                else {
                    console.log('token Name', formData.token)
                    setIsOther(false)
                    setLoading(true)
                    await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDeliveryDataByToken?tknNo=${formData.token}`, config)
                        .then((res) => {
                            setLoading(false)
                            toast.dismiss('loading');
                            if (res.data.billPayType === 'due') {
                                handleDirectAdd(res.data);
                            }
                            else if (res.data.billPayType === 'debit') {
                                handleDirectAdd(res.data);

                            }
                            else if (res.data.billPayType === 'complimentary') {
                                handleDirectAdd(res.data);
                            }
                            else if (res.data.billPayType === 'online') {
                                handleDirectAdd(res.data);
                            }
                            else {
                                setFormData((prev) => ({
                                    ...prev,
                                    price: res.data.settledAmount,
                                    address: res.data.billAddress,
                                    billId: res.data.billId,
                                    billPayType: res.data.billPayType,
                                    billType: res.data.billType,
                                    deliveryType: res.data.billType,
                                    desiredAmount: formData.change ? res.data.settledAmount + parseFloat(formData.change ? formData.change : 0) : res.data.settledAmount,
                                    tokenNo: res.data.tokenNo
                                }));
                                console.log('Data', res.data)
                                changeRef.current.focus();
                            }
                        })
                        .catch((error) => {
                            console.log('Error', error);
                            if (error.response.data === "Token Number Not Found") {
                                tokenRef.current.focus();
                                tokenRef.current.setSelectionRange(0, formData.token.length);
                            }
                            setError(error?.response?.data || 'Token Not Found!!..')
                            setFormData({
                                price: '',
                                token: '',
                                Comment: '',
                                desiredAmount: '',
                                change: ''
                            })
                            setLoading(false)
                            toast.dismiss('loading');
                        });
                }
            }
        }
    };
    const handleDirectAdd = (resData) => {
        const newItemData = {
            billId: resData.billId,
            token: resData.tokenNo,
            price: resData.settledAmount,
            address: resData.billAddress,
            billPayType: resData.billPayType,
            billType: resData.billType,
            deliveryType: resData.billType,
            desiredAmount: 0,
            tokenNo: resData.tokenNo,
            change: 0
        };
        const tokenExists = itemList.some(item => item.token === newItemData.token);
        const tokenNoExists = itemList.some(item => item.tokenNo === newItemData.tokenNo);

        if (tokenExists || tokenNoExists) {
            alert(`Token number ${newItemData.token} is already added.`);
            setFormData({
                token: '',
                price: '',
                desiredAmount: '',
                change: ''
            })
            return;
        }
        setItemList(prevItems => [...prevItems, newItemData]);
        console.log('NewItem Data >>>>>>>>>', newItemData);
        setIsOther(false);
        setFormData({
            change: 0,
            desiredAmount: 0,
            price: '',
            token: ''
        });

        setTotalValues((prev) => ({
            ...prev,
            amount: parseFloat(prev.amount || 0) + parseFloat(resData.settledAmount || 0),
            change: parseFloat(prev.change || 0) + parseFloat(resData.change || 0),
            desiredAmount: parseFloat(prev.desiredAmount || 0) + parseFloat(resData.desiredAmount || 0)
        }));

        handleClose();
        setIsBill(false);
        setIsTokenError(false);
    };

    const getDeliveryManData = async () => {
        try {
            await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/ddlPersonData`, config)
                .then((res) => {
                    setDeliveryManData(res.data);
                })
                .catch((error) => {
                    console.log('Error', error);
                    setError(error?.response?.data || 'Network Error')
                });
        } catch (error) {
            console.log(error.response.data || 'Network Error!!..');
            setError(error?.response?.data || 'Network Error!!..')
        }
    };
    const handleAddData = () => {
        if (formData.token) {
            if (formData.token === 'B') {
                if (!formData.price) {
                    return setIsPriceError(true)
                }
            }
            if (formData.token === 'O' || formData.token === 'B') {
                setItemList(prevItems => [...prevItems, formData]);
                setIsOther(false);
                setFormData({
                    change: '',
                    desiredAmount: '',
                    price: '',
                    token: ''
                });
                if (formData.token === 'B') {
                    setTotalValues((prev) => ({
                        ...prev,
                        desiredAmount: parseFloat(prev.desiredAmount || 0) + parseFloat(formData.desiredAmount || formData.price || 0),
                        change: parseFloat(prev.change || 0) + parseFloat(formData.change || 0),
                        amount: parseFloat(prev.amount || 0) + parseFloat(formData.price || 0)
                    }))
                }
                handleClose();
                setIsBill(false);
                setIsTokenError(false);
                tokenRef.current.focus();
                console.log('Added item:', formData);
                return;
            }

            const tokenExists = itemList.some(item => item.token === formData.token);
            const tokenExisted = itemList.some(item => item.tokenNo === formData.token);
            if (tokenExists || tokenExisted) {
                alert(`Token number ${formData.tokenNo} is already added.`);
                handleClose();
                setFormData({
                    change: '',
                    desiredAmount: '',
                    price: '',
                    token: ''
                });
                tokenRef.current.focus();
            } else {
                let totalBillAmt;
                let totalChange;
                let totalDesiredAmount;
                let updatedTotalValues = { ...totalValues };
                handleClose();
                if (formData.billPayType === 'online' || formData.billPayType === 'debit' || formData.billPayType === 'due') {
                    updatedTotalValues.desiredAmount = parseFloat(totalValues.desiredAmount || 0) + parseFloat(formData.change || 0);
                    updatedTotalValues.amount = parseFloat(formData.price || 0);
                    updatedTotalValues.change = parseFloat(formData.change || 0);
                } else {
                    updatedTotalValues.desiredAmount = parseFloat(totalValues.desiredAmount || 0) + parseFloat(formData.desiredAmount || 0);
                    updatedTotalValues.amount = parseFloat(totalValues.amount || 0) + parseFloat(formData.price || 0);
                    updatedTotalValues.change = parseFloat(totalValues.change || 0) + parseFloat(formData.change || 0);
                }
                setTotalValues(updatedTotalValues);
                setItemList(prevItems => [...prevItems, formData]);
                setIsOther(false);
                setFormData({
                    change: '',
                    desiredAmount: '',
                    price: '',
                    token: ''
                });
                setIsBill(false);
                setIsTokenError(false);
                tokenRef.current.focus();
                console.log('Added item:', formData);
            }
        } else {
            setIsTokenError(true);
        }
    };

    const handleAddCards = async () => {
        if (loading || success) {

        } else {
            setLoading(true)
            const data = {
                personId: deliveryManId,
                totalBillAmt: totalValues.amount,
                totalChange: totalValues.change,
                totalDesiredAmt: totalValues.desiredAmount,
                durationTime: "00:00:00",
                deliveryBillData: itemList.map(item => ({
                    billId: item.billId || '',
                    billAddress: item.address || item.Comment || '',
                    deliveryType: item.billType || '',
                    billPayType: item.billPayType || '',
                    billAmt: parseFloat(item.price) || 0,
                    billChange: parseFloat(item.change) || 0,
                    desiredAmt: parseFloat(item.desiredAmount) || 0
                }))
            };
            // const data = {
            //     "personId": "person_1719777904918",
            //     "totalBillAmt": 200,
            //     "totalChange": 0,
            //     "totalDesiredAmt": 200,
            //     "durationTime": "00:00:00",
            //     "deliveryBillData": [
            //         {
            //             "billId": "",
            //             "billAddress": "Cow Bill",
            //             "deliveryType": "Other",
            //             "billPayType": "cash",
            //             "billAmt": 1000,
            //             "billChange": 0,
            //             "desiredAmt": 1000
            //         },
            //         {
            //             "billId": "bill_1719757042089_2",
            //             "billAddress": "Kevdawadi",
            //             "deliveryType": "delivery",
            //             "billPayType": "cash",
            //             "billAmt": 100,
            //             "billChange": 0,
            //             "desiredAmt": 100
            //         }
            //     ]
            // }
            console.log('Final Data', data)
            await axios.post(`${BACKEND_BASE_URL}deliveryAndPickUprouter/addDeliveryData`, data, config)
                .then((res) => {
                    console.log('Response Data', res)
                    setUpdatDeliveryPopUp(false)
                    // setSuccess(true)
                    setLoading(false);
                    toast.dismiss('loading');
                    getDeliverCardData();
                    setDeliveryManName('')
                    setDeliveryManId("")
                    setIsTokenError(false)
                    handleClose();
                    handleReset();
                    setDeliveyStaticCard(false)
                })
                .catch((error) => {
                    console.log('Error=>', error)
                    if (error.response.status === 402) {
                        setUpdatDeliveryPopUp(true)
                        setUpdateDeliveryPopUpData(error.response.data)
                    }
                    else {
                        setDeliveryManName('')
                        setError(error?.response?.data || 'Network Error!!..')
                    }
                    setLoading(false)
                    toast.dismiss('loading');
                })
        }
    };
    const numRegex = /^\d+$/;
    const getDeliverCardData = async () => {
        try {
            await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getOnDeliveryData`, config)
                .then((res) => {
                    setCardList(res.data || [])
                    // setFormData({
                    //     change: 0,
                    //     desiredAmount: 0,
                    //     price: '',
                    //     token: ''
                    // });
                    // setItemList([])
                    // setDeliveryManId('')
                })
                .catch((error) => {
                    console.log('Error', error)
                    setCardList([])
                })
        } catch (error) {
            console.log('error', error)
        }
    }
    // useEffect(() => {
    //     const filteredItems = itemList.filter(bill => bill.billPayType !== 'other');

    //     const totalAmount = filteredItems.reduce((acc, bill) => acc + parseFloat(bill.price || 0), 0);
    //     const totalChange = filteredItems.reduce((acc, bill) => acc + parseFloat(bill.change || 0), 0);
    //     const totalDesiredAmount = filteredItems.reduce((acc, bill) => acc + parseFloat(bill.desiredAmount || 0), 0);

    //     setTotalValues({
    //         amount: totalAmount,
    //         change: totalChange,
    //         desiredAmount: totalDesiredAmount
    //     });
    // }, [itemList]);



    const handleDeleteItem = () => {
        if (itemList[selectedToken].billPayType === 'online') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].change || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'due') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].change || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'debit') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].change || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'Due Bill') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].desiredAmount || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'cash') {
            console.log('Cash He')
            const totalAmunt = parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].amount || 0);
            console.log('Cash', totalValues.amount)
            console.log('Cash', itemList[selectedToken])
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].desiredAmount || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'complimentary') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].change || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        console.log('KLIO', itemList)
        const filteredData = itemList.filter((_, index) => index !== selectedToken)
        setItemList(filteredData);
        handleClose();
    };
    const handleEditItem = () => {
        if (itemList[selectedToken].billPayType === 'online') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].change || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'due') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].change || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'debit') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].change || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'Due Bill') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].desiredAmount || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'cash') {
            console.log('Cash He')
            const totalAmunt = parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].amount || 0);
            console.log('Cash', totalValues.amount)
            console.log('Cash', itemList[selectedToken])
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].desiredAmount || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        else if (itemList[selectedToken].billPayType === 'complimentary') {
            setTotalValues((prev) => ({
                ...prev,
                desiredAmount: parseFloat(totalValues.desiredAmount || 0) - parseFloat(itemList[selectedToken].change || 0),
                amount: parseFloat(totalValues.amount || 0) - parseFloat(itemList[selectedToken].price || 0),
                change: parseFloat(totalValues.change || 0) - parseFloat(itemList[selectedToken].change || 0),
            }))
        }
        setFormData((prev) => ({
            ...prev,
            token: itemList[selectedToken].token,
            change: itemList[selectedToken].change,
            desiredAmount: itemList[selectedToken].desiredAmount,
            price: itemList[selectedToken].price,
            tokenNo: itemList[selectedToken].tokenNo,
            address: itemList[selectedToken].address,
            billPayType: itemList[selectedToken].billPayType,
            billId: itemList[selectedToken].billId,
            deliveryType: itemList[selectedToken].deliveryType,
            billType: itemList[selectedToken].billType

        }))
        // formData
        setIsOther(false);
        setIsBill(false);
        const filteredData = itemList.filter((_, index) => index !== selectedToken)
        setItemList(filteredData);
        handleClose();
        setIsTokenError(false);
        setTimeout(() => {
            changeRef.current.focus()
        }, 50)

    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
    };
    const updateDelivery = async () => {
        try {
            await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/stopDeliveryData?deliveryId=${updateDeliveryPopUpData.deliveryId}`, config)
                .then((res) => {
                    console.log('stoppen', res)
                    getDeliverCardData();
                    handleAddCards();
                    setUpdatDeliveryPopUp(false)
                })
                .catch((error) => {
                    console.log('Error', error)
                })
        } catch (error) {
            console.log('Error', error)
        }
    }
    const handleReset = () => {
        setItemList([]);
        setFormData({
            price: '',
            change: '',
            desiredAmount: '',
            token: '',
            Comment: '',
        })
        setDeliveryManName('')
        setIsTokenError(false)
        setTotalValues({
            desiredAmount: '0',
            amount: '0',
            change: '0'
        })
    }

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
        setTimeout(() => {
            setSuccess(false);
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
    console.log({ loading })
    return (
        <div>
            <div className="dashBoardHeader py-2">
                <div className="px-3 my-2 ">
                    <div className="bg-white rounded-md shadow-md">
                        <div className="flex justify-between pl-2">
                            <div className="font-semibold cancelColor flex items-center gap-2">
                                <button
                                    className="bg-blue-500 rounded-md text-white w-full px-4 p-1"
                                    onClick={() => { setDeliveyStaticCard(true); }}
                                >
                                    Add
                                </button>
                            </div>
                            <div className='gap-2 flex'>
                                <TextField
                                    type='text'
                                    onChange={onSearchChange}
                                    value={searchWord}
                                    name="searchWord"
                                    id="standard-basic"
                                    variant="standard"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            updateBillStatus(searchWord);
                                            setSearchWord('');
                                        }
                                    }}
                                    autoComplete='off'
                                    label="Enter Token"
                                    className='w-2/4'
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                                        style: { fontSize: 14 },
                                    }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                                <button
                                    // className='cursor-pointer w-2/5 CompleteDelivery py-1 px-3 rounded-md text-center text-white'
                                    className='addProductBtn clearallbtn self-center ml-4'
                                    onClick={() => {
                                        clearDispay();
                                    }}
                                >
                                    Clear Display
                                </button>
                            </div>
                            <div className="w-4/12 flex justify-end gap-4 px-4  items-center p-3 ">
                                <div className="font-semibold dueColor flex items-center gap-2"> <div></div> Due</div>
                                <div className="font-semibold onlineColoe flex items-center gap-2"> <div></div> Online</div>
                                <div className="font-semibold delibtColor flex items-center gap-2"> <div></div> Debit</div>
                                <div className="font-semibold cancelColor flex items-center gap-2"> <div></div> Cancel</div>
                                <div className="font-semibold complimentaryColor flex items-center gap-2"> <div></div> Complimentary</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="deliveryCards">
                    <div className="cardContainer">
                        <div className="flex w-full flex-wrap gap-4 p-3">
                            {deliveryStaticCard && (
                                <div className="mainCard">
                                    <div className=" w-full  bg-white rounded-lg shadow-md border ">
                                        <div className="cardHeader">
                                            <div className="topHeader">
                                                <div className="deliveryManInfo px-3 py-2 flex w-full justify-between items-center pl-2">
                                                    <div className="name flex items-center w-2/5">
                                                        <select
                                                            name="deliverMan"
                                                            className='custom-select'
                                                            value={deliveryManName}
                                                            onChange={(e) => {
                                                                const selectedPerson = deliveryManData.find(val => val.personName === e.target.value);
                                                                setDeliveryManId(selectedPerson?.personId || '');
                                                                setDeliveryManName(selectedPerson?.personName || '')
                                                            }}
                                                        >
                                                            <option value="" disabled>Delivery Man</option>
                                                            {deliveryManData && deliveryManData.map((val, index) => (
                                                                <option value={val.personName} key={index}>{val.personName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {/* <div className="timer text-start pl-2 mr-24">
                                                     <p className="w-fit p-1 px-2 rounded-2xl bg-white border border-black">00:00</p>
                                                 </div> */}
                                                    <div className="cursor-pointer"
                                                        onClick={() => {
                                                            handleReset();
                                                            setDeliveyStaticCard(false)
                                                        }}
                                                    >
                                                        <ClearIcon />
                                                    </div>
                                                </div>
                                                <div className="bottomHeader border-t border-gray-300">
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
                                                                        value={formData.price || ''}
                                                                        onChange={handleDesiredAmountChange}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                e.preventDefault();
                                                                                handleAddData();
                                                                            }
                                                                        }}
                                                                        onFocus={(e) => {
                                                                            e.target.select();
                                                                        }}
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
                                                                            className={`popoverSearch w-full p-1 rounded-md border  ${isPriceError ? 'input-error' : 'border-black'}`}
                                                                            value={formData.price || ''}
                                                                            readOnly={!isBill ? true : false}
                                                                            ref={priceRef}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                if (regex.test(value)) {
                                                                                    setFormData((prev) => ({
                                                                                        ...prev,
                                                                                        price: value,
                                                                                        desiredAmount: value
                                                                                    }));
                                                                                }
                                                                                setIsPriceError(false)
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    e.preventDefault();
                                                                                    if (!e.target.value) {
                                                                                        setIsPriceError(true)
                                                                                        priceRef.current.focus();
                                                                                    }
                                                                                    else {
                                                                                        changeRef.current.focus();
                                                                                    }
                                                                                }
                                                                            }}
                                                                            disabled={!formData.token ? true : false}
                                                                        />
                                                                        {isPriceError && (
                                                                            <p className="helper-text">Enter Price</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="bottomHeaderBillNo col-span-2 mr-5">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Change"
                                                                            className="popoverSearch w-full p-1 rounded-md border border-black"
                                                                            ref={changeRef}
                                                                            value={formData.change || ''}
                                                                            onChange={(e) => {
                                                                                console.log('Price', e.target.value)
                                                                                if (regex.test(e.target.value)) {
                                                                                    setFormData((prev) => ({
                                                                                        ...prev,
                                                                                        change: e.target.value || 0,
                                                                                        desiredAmount: parseInt(e.target.value || 0) + parseInt(formData.price || 0)
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
                                                                                value={formData.price || ''}
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
                                                                                value={formData.change || ''}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    const regex = /^\d*\.?\d*$/;
                                                                                    if (regex.test(value)) {
                                                                                        setFormData((prev) => ({
                                                                                            ...prev,
                                                                                            change: e.target.value,
                                                                                            desiredAmount: parseInt(e.target.value || 0) + parseInt(formData.price || 0)
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
                                                                                value={formData.desiredAmount || ''}
                                                                                onChange={handleDesiredAmountChange}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter') {
                                                                                        e.preventDefault();
                                                                                        handleAddData();
                                                                                    }
                                                                                }}
                                                                                onFocus={(e) => {
                                                                                    e.target.select();
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
                                        <div className="itemsData border-t border-gray-300 px-2">
                                            <div className="w-full">
                                                <div className="flex font-semibold text-sm border-b">
                                                    <div className="w-1/12 text-sm p-2">Tkn</div>
                                                    <div className="addressWidth text-sm text-start pl-3 p-2">Address</div>
                                                    <div className="w-1/6 text-sm py-2 text-end">Bill Amt.</div>
                                                    <div className="w-1/6 text-sm py-2 px-1 text-end">Change</div>
                                                    <div className="w-1/6 text-sm py-2  text-end">Desired</div>
                                                </div>
                                                <div className="overflow-y-auto" style={{ height: '180px' }}>
                                                    {itemList && itemList.map((bill, index) => (
                                                        <div key={index} className={`flex items-center px-2 borderb border-gray-300 ${bill.billPayType === 'cancel' ? 'bg-red-100' : bill.billPayType === 'online' ? 'bg-green-100' : bill.billPayType === 'due' ? 'bg-blue-100' : bill.billPayType === 'debit' ? 'bg-indigo-200' : bill.billPayType === 'complimentary' ? 'bg-fuchsia-200' : ''}`}>
                                                            <div className="w-1/12 font-semibold text-start text-sm p-1 px-0">{bill.tokenNo}</div>
                                                            {/* <Tooltip title={bill.address ? bill.address : bill.Comment} arrow={true}> */}
                                                            <Tooltip title={bill.address ? bill.address : bill.Comment} arrow>
                                                                <div className="addressWidth font-semibold text-sm text-start pl-1 p-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    {bill.address ? bill.address.slice(0, 24) : bill.Comment ? bill.Comment : ''}
                                                                </div>
                                                            </Tooltip>
                                                            <div className="w-1/6 font-semibold text-end text-sm p-1">{bill.price || '0'}</div>
                                                            <div className="w-1/6 font-semibold text-end text-sm p-1 pr-0 pl-1">{bill.change || '0'}</div>
                                                            <div className="w-1/5 font-semibold text-sm text-end pr-2 pl-0 p-2">{bill.billPayType === 'complimentary' ? '0' : bill.desiredAmount || '0'}</div>
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
                                                                            {bill.billPayType == 'cash' &&
                                                                                <MenuItem onClick={handleEditItem}>
                                                                                    Edit
                                                                                </MenuItem>
                                                                            }
                                                                            <MenuItem onClick={handleDeleteItem}>
                                                                                Delete
                                                                            </MenuItem>
                                                                        </Menu>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}


                                                </div>
                                                <div className="flex font-semibold text-sm border-t">
                                                    <div className="w-1/12 text-sm p-2">Total</div>
                                                    <div className="addressWidth text-sm text-start pl-3 p-2"></div>
                                                    <div className="w-1/6 text-sm py-2 text-end">{parseFloat(totalValues?.amount || 0).toLocaleString('en-IN')}</div>
                                                    <div className="w-1/6 text-sm py-2 px-1 text-end">{parseFloat(totalValues.change || 0).toLocaleString('en-IN')}</div>
                                                    <div className="w-1/6 text-sm py-2  text-end">{parseFloat(totalValues.desiredAmount || 0).toLocaleString('en-IN')}</div>
                                                </div>
                                            </div>
                                            <div className="p-2 text-end w-full border-t border-gray-300">
                                                <button
                                                    className='p-1 px-4 text-white bg-green-600 text-semibold text-lg rounded-xl transform hover:scale-[1.05] duration-300 ease-in-out hover:bg-green-700'
                                                    onClick={handleAddCards}
                                                >
                                                    Start Delivery
                                                </button>
                                                <button
                                                    className='p-1 px-4 text-white bg-gray-500 ml-3 text-semibold text-lg rounded-xl transform hover:scale-[1.05] duration-300 ease-in-out hover:bg-slate-700'
                                                    onClick={() => {
                                                        setItemList([]);
                                                        setFormData({
                                                            price: '',
                                                            change: '',
                                                            desiredAmount: '',
                                                            token: '',
                                                            Comment: '',
                                                        })
                                                        setDeliveryManName('')
                                                        setDeliveryManId("")
                                                        setIsTokenError(false)
                                                        setTotalValues({
                                                            desiredAmount: '0',
                                                            amount: '0',
                                                            change: '0'
                                                        })
                                                    }}
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {cardList.length > 0 ? cardList.map((card, index) => (
                                <div className="mainCard" key={card.deliveryId + '_' + index}>
                                    <Cards data={card} getDeliverCardData={getDeliverCardData} />
                                </div>
                            )) : (
                                <div className="fixedHeightsForNodDelivery">
                                    <div className='text-center'>
                                        <div>
                                            <DeliveryDiningIcon className='NoDeliveriesIcon' />
                                        </div>
                                        <div className='text-4xl noDeliveriesText'>
                                            No Deliveries Found
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <Modal
                        open={updateDeliveryPopUp}
                        onClose={() => setUpdatDeliveryPopUp(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} className='rounded-md border-none'>
                            <div className="p-2">
                                <div className="flex justify-between border-b items-center">
                                    <div className=" p-2">
                                        Are You Sure You Want to Add Delivery??
                                    </div>
                                    <div className="timer p-2">
                                        {updateDeliveryPopUpData?.timeDifference}
                                    </div>
                                </div>
                                <div className="overflow-hidden w-full bg-white rounded-lg  ">
                                    <div className="cardHeader">
                                        <div className="topHeader">
                                            <div className={`deliveryManInfo items-center px-3 py-2 flex w-full justify-between pl-2`}>
                                                <div className="name flex items-center justify-between w-2/5">
                                                    <div className="cursor-pointer" onClick={() => setIsEdit(true)}>
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
                                                    <div key={index} className={`flex items-center px-2 borderb border-gray-300 ${bill.billPayType === 'cancel' ? 'bg-red-100' : bill.billPayType === 'online' ? 'bg-green-100' : bill.billPayType === 'due' ? 'bg-blue-100' : bill.billPayType === 'debit' ? 'bg-indigo-200' : bill.billPayType === 'complimentary' ? 'bg-fuchsia-200' : ''}`}>
                                                        <div className="w-1/12 font-semibold text-start  text-sm p-1 px-0">{bill.token ? bill.token : (index + 1)}</div>
                                                        <Tooltip title={bill.billAddress} arrow>
                                                            <div className="addressWidth cursor-pointer font-semibold text-sm text-start pl-1 p-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {bill.billAddress ? bill.billAddress.slice(0, 24) : ''}
                                                            </div>
                                                        </Tooltip>
                                                        <div className="w-1/6 font-semibold text-end  text-sm p-1">{bill.billPayType}</div>
                                                        <div className="w-1/6 font-semibold text-end  text-sm p-1">{bill.billAmt || '0'}</div>
                                                        <div className="w-1/6 font-semibold text-end  text-sm p-1 pr-0 pl-1">{bill.billChange || '0'}</div>
                                                        <div className="w-1/5 font-semibold text-sm text-end pr-2 pl-0 p-2">{bill.desiredAmt || '0'}</div>
                                                        <div className="w-fit font-semibold text-sm text-end  px-0">
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='border-t border-gray-300 flex items-center justify-end'>
                                                <div className="w-1/6 font-semibold text-sm p-1"></div>
                                                <div className="w-1/6 font-semibold text-sm text-end ">Total {'(' + itemList.length + ')'}</div>
                                                <div className="w-1/6 font-semibold text-end pr-2 text-sm p-1">
                                                    {parseFloat(updateDeliveryPopUpData?.totalBillAmt).toLocaleString('en-IN')}
                                                </div>
                                                <div className="w-1/6 font-semibold text-end pr-2 text-sm p-1">
                                                    {/* {itemList.reduce((acc, bill) => acc + parseFloat(bill.change || 0), 0)} */}
                                                    {parseFloat(updateDeliveryPopUpData?.totalChange).toLocaleString('en-IN')}
                                                </div>
                                                <div className="w-1/6 font-semibold text-sm text-end pr-2 p-2">
                                                    {/* {itemList.reduce((acc, bill) => acc + parseFloat(bill.desiredAmount || 0), 0)} */}
                                                    {parseFloat(updateDeliveryPopUpData?.totalDesiredAmt).toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end p-2 gap-3">
                                            {/* <div
                                                className=" cursor-pointer  bg-blue-500 flex items-center py-3 px-3 justify-center BackArroIconDiv  w-20 gap-2 rounded-lg border"
                                                // onClick={() => setInfoPopUpOpen(false)}
                                                onClick={() => {
                                                    updateDelivery();
                                                }}
                                            >
                                                Yes */}
                                            {/* </div> */}
                                            <div className="flex gap-6 mt-6 w-full ">
                                                <div className="w-full">
                                                    <button onClick={() => {
                                                        updateDelivery();
                                                    }} className="addCategorySaveBtn CustoButtonPopUp ">Yes</button>
                                                </div>
                                                <div className="w-full">
                                                    <button onClick={() => {
                                                        setUpdatDeliveryPopUp(false);
                                                        // setUpdateDeliveryPopUpData('')
                                                        // setFormData({
                                                        //     change: 0,
                                                        //     desiredAmount: 0,
                                                        //     price: '',
                                                        //     token: ''
                                                        // });
                                                        // setItemList([])
                                                        // setDeliveryManName('')
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
                </div>
            </div >
            <ToastContainer />
        </div >
    );
};

export default Dashboard;

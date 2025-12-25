import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css';
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import jwt_decode from 'jwt-decode'
import CryptoJS from 'crypto-js';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import BankCard from "../bankCard/bankCard";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BankMenu from "./menu/menuBank";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import dayjs from 'dayjs';
import ExportMenu from '../exportMenu/exportMenu';
import BankTransactionMenu from "./menu/bankTransactionMenu";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
const styleIncome = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
function BankDashboard() {
    const regex = /^-?\d*(?:\.\d*)?$/;
    const emailRegx = /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const textFieldRef = useRef(null);
    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const [editBank, setEditBank] = React.useState({
        bankName: '',
        bankIconName: '',
        bankShortForm: '',
        bankDisplayName: '',
        bankAccountNumber: '',
        ifscCode: '',
        bankId: '',
        isViewMonthlyTransaction: false,
        isActive: true
    })
    const [bankFields, setBankFields] = useState([
        'bankName',
        'bankIconName',
        'bankDisplayName',
    ])
    const [bankError, setBankError] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [sourceFormData, setSourceFormData] = React.useState({
        sourceName: ''
    });
    const [sourceFormDataError, setSourceFormDataError] = React.useState({
        sourceName: false
    });
    const [expanded, setExpanded] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsIncome, setTotalRowsIncome] = React.useState(0);
    const [totalRowsTransaction, setTotalRowsTransaction] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [rights, setRights] = useState();
    const [isEdit, setIsEdit] = React.useState(false);
    const [formData, setFormData] = useState({
        fromId: "",
        toId: "",
        transactionAmount: 0,
        comment: "",
        transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
        transactionStatus: ''
    });
    const [data, setData] = React.useState();
    const [bankTransaction, setBankTranaction] = React.useState();
    const [banks, setBanks] = React.useState();
    const [incomeSources, setIncomeSources] = React.useState();
    const [formDataError, setFormDataError] = useState({
        source: false,
        destination: false,
        transactionAmount: false,
        transactionDate: false,
    })
    const [formDataErrorFields, setFormDataErrorFields] = useState([
        "source",
        "destination",
        "transactionAmount",
        "transactionDate",
    ])
    const [formDataEditErrorFields, setFormDataEditErrorFields] = useState([
        "transactionAmount",
        "transactionDate",
    ])
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [filter, setFilter] = React.useState(false);
    const id = open ? 'simple-popover' : undefined;
    const [sourceList, setSourceList] = React.useState();
    const [destinationList, setDestinationList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [subCategories, setSubCategories] = React.useState();
    const [tab, setTab] = React.useState(1);
    const [openModal, setOpen] = React.useState(false);
    const [bank, setBank] = React.useState({
        bankName: '',
        bankIconName: '',
        bankShortForm: '',
        bankDisplayName: '',
        bankAccountNumber: '',
        ifscCode: '',
        isViewMonthlyTransaction: false,
        isActive: true
    });
    const navigate = useNavigate();
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return (data);
    };
    useEffect(() => {
        getBanks();
    }, [])
    const user = JSON.parse(localStorage.getItem('userInfo'))
    let location = useLocation();
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }
    const role = user.userRights ? decryptData(user.userRights) : '';
    const decoded = jwt_decode(user.token);
    const expirationTime = (decoded.exp * 1000) - 60000

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleOpen = () => setOpen(true);
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const navigateToDetail = (name, id) => {
        navigate(`/stockOutByBank/${name}/${id}`);
    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete Bank?")) {
            deleteData(id);
        }
    }
    const handleDeleteTransaction = (id) => {
        if (window.confirm("Are you sure you want to delete Bank Transaction?")) {
            deleteTranaction(id);
        }
    }
    const handleDeleteSource = (id) => {
        if (window.confirm("Are you sure you want to delete Bank?")) {
            deleteSourceData(id);
            setTimeout(() => {
                setPage(0);
                setRowsPerPage(5);
                filter ? getIncomeSourceDataByFilter() : getIncomeSourceData();
            }, 50)
        }
    }
    const deleteSourceData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeIncomeSource?sourceId=${id}`, config)
            .then((res) => {
                setSuccess(true)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeBankData?bankId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                getData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteTranaction = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeTransactionData?transactionId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                filter ? getBankTransactionByFilter() : getBankTransaction();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleEdit = (data) => {
        setBankError(false);
        setIsEdit(true);
        setEditBank((perv) => ({
            ...perv,
            bankId: data.bankId,
            bankName: data.bankName,
            bankIconName: data.bankIconName,
            bankShortForm: data.bankShortForm,
            bankDisplayName: data.bankDisplayName,
            bankAccountNumber: data.bankAccountNumber,
            ifscCode: data.ifscCode,
            isViewMonthlyTransaction: data.isViewMonthlyTransaction ? true : false,
            isActive: data.isActive ? true : false
        }))
        setOpen(true)
    }
    const handleEditTransaction = (data) => {
        setFormDataError({
            source: false,
            destination: false,
            transactionAmount: false,
            transactionDate: false,
        })
        setIsEdit(true);
        setFormData({
            transactionId: data.transactionId,
            transactionAmount: data.amount,
            comment: data.comment,
            transactionDate: dayjs(data.dateCredit),
            fromId: data.fromId,
            toID: data.toID
        })
        setExpanded(true);
    }
    const handleEditSource = (data) => {
        setSourceFormDataError({
            sourceName: false
        });
        setIsEdit(true);
        setSourceFormData((perv) => ({
            ...perv,
            sourceId: data.sourceId,
            sourceName: data.sourceName
        }))
        setOpen(true)
    }
    const getSourceDDL = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/ddlFromData`, config)
            .then((res) => {
                setSourceList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDestinationDDL = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/ddlToData`, config)
            .then((res) => {
                setDestinationList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getData = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankList?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getBankTransaction = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankCreditTransaction?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setBankTranaction(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getBankTransactionByFilter = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankCreditTransaction?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setBankTranaction(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getBanks = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankDashboardData`, config)
            .then((res) => {
                setBanks(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataByFilter = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankList?page=${page + 1}&numPerPage=${rowsPerPage}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getIncomeSourceData = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getIncomeSourceList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setIncomeSources(res.data.rows);
                setTotalRowsIncome(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getIncomeSourceDataByFilter = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getIncomeSourceList?page=${page + 1}&numPerPage=${rowsPerPage}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setIncomeSources(res.data.rows);
                setTotalRowsIncome(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getIncomeSourceDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getIncomeSourceList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setIncomeSources(res.data.rows);
                setTotalRowsIncome(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getIncomeSourceDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getIncomeSourceList?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setIncomeSources(res.data.rows);
                setTotalRowsIncome(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const excelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForFundTransfer?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForFundTransfer?page=${1}&numPerPage=${5}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Expense_List_' + new Date().toLocaleDateString() + '.xlsx'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const pdfExport = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForFundTransfer?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForFundTransfer?page=${1}&numPerPage=${5}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Expense_List_' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const excelExportIncome = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForIncomeData?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForIncomeData?page=${1}&numPerPage=${5}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'IncomeCategory_List_' + new Date().toLocaleDateString() + '.xlsx'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const pdfExportIncome = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForIncomeData?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForIncomeData?page=${1}&numPerPage=${5}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'IncomeCategory_List_' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const handleCloseModal = () => {
        // setOpen(false);
        // setBank('');
        // setBankError(false);
        // setEditBank({
        //     bankName: '',
        //     bankId: ''
        // });
        setIsEdit(false);
        setOpen(false)
    }
    const gotToBankDetail = (id) => {
        navigate(`/bank/detail/${id}`)
    }
    const handleTransactionDate = (date) => {
        console.log('edit Date', date && date['$d'] ? 'false' : 'true')
        setFormData((prevState) => ({
            ...prevState,
            ["transactionDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleSourceNameAutoComplete = (event, value) => {
        setFormData((prevState) => ({
            ...prevState,
            ['source']: value,
            fromId: value && value.fromId ? value.fromId : '',
            transactionStatus: value && value.status ? value.status : 0,
        }))
        setFormDataError((perv) => ({
            ...perv,
            source: false
        }))
        // getSuppilerList(value && value.productId ? value.productId : '')
        // console.log('formddds', stockInFormData)
    }
    const handleDestinationNameAutoComplete = (event, value) => {
        setFormData((prevState) => ({
            ...prevState,
            ['destination']: value,
            toId: value && value.toId ? value.toId : '',
        }))
        setFormDataError((perv) => ({
            ...perv,
            destination: false
        }))
        // getSuppilerList(value && value.productId ? value.productId : '')
        // console.log('formddds', stockInFormData)
    }
    const handleValueChange = (newValue) => {
        setValue(newValue);
    }
    const goToAddUSer = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/addUser')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToUserList = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/userTable')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToExpense = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/expense/dashboard')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToStaff = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/staff/staffList')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const resetAddFund = () => {
        setFormData({
            fromId: "",
            source: null,
            destination: null,
            toId: "",
            transactionAmount: 0,
            comment: "",
            transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
            transactionStatus: ''
        })
        setFormDataError({
            source: false,
            destination: false,
            transactionAmount: false,
            transactionDate: false,
        })
        setIsEdit(false)
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankList?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getBankTransactionOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankCreditTransaction?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setBankTranaction(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getBankTransactionOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankCreditTransaction?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setBankTranaction(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if ((tab === 4 || tab === '4')) {
            if (filter) {
                getDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        if ((tab === 2 || tab === '2')) {
            if (filter) {
                getBankTransactionOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getBankTransactionOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else {
            if (filter) {
                getIncomeSourceDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getIncomeSourceDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }


    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if ((tab === 4 || tab === '4')) {
            if (filter) {
                getDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        if ((tab === 2 || tab === '2')) {
            if (filter) {
                getBankTransactionOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getBankTransactionOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else {
            if (filter) {
                getIncomeSourceDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getIncomeSourceDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }


    };
    const editBankFnc = async () => {
        if (loading || success) {

        } else {
            const isValidate = bankFields.filter(element => {
                if (bankError[element] == true || editBank[element] == '' || editBank[element] == 0) {
                    setBankError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log("edit bank", isValidate)
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateBankData`, editBank, config)
                    .then((res) => {
                        setLoading(false);
                        setSuccess(true)
                        filter ? getDataByFilter() : getData();
                        setPage(0);
                        setIsEdit(false)
                        setRowsPerPage(5)
                        handleCloseModal()
                    })
                    .catch((error) => {
                        setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    })
            }
        }
    }
    const editSourceFnc = async () => {
        if (loading || success) {

        } else {
            if (!sourceFormData.sourceName || sourceFormData.sourceName.length < 2) {
                setError(
                    "Please Fill bank"
                )
                setSourceFormDataError(
                    {
                        sourceName: true
                    }
                );
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateInComeSource`, sourceFormData, config)
                    .then((res) => {
                        setLoading(false);
                        setSuccess(true)
                        filter ? getIncomeSourceDataByFilter() : getIncomeSourceData();
                        setPage(0);
                        setIsEdit(false)
                        setRowsPerPage(5)
                        handleCloseModal()
                    })
                    .catch((error) => {
                        setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    })
            }
        }
    }
    const handleReset = () => {
        setBank({
            bankName: '',
            bankIconName: '',
            bankShortForm: '',
            bankDisplayName: '',
            bankAccountNumber: '',
            ifscCode: '',
            bankId: '',
            isViewMonthlyTransaction: false,
            isActive: true
        });
        setBankError(false);
        setEditBank({
            bankName: '',
            bankIconName: '',
            bankShortForm: '',
            bankDisplayName: '',
            bankAccountNumber: '',
            ifscCode: '',
            bankId: '',
            isViewMonthlyTransaction: false,
            isActive: true
        });
        setIsEdit(false);
    }
    const handleResetSource = () => {
        setSourceFormData({
            sourceName: ''
        })
        setSourceFormDataError({
            sourceName: false
        })
        setIsEdit(false);
    }
    const addBank = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/addBankData`, bank, config)
            .then((res) => {
                setSuccess(true)
                filter ? getDataByFilter() : getData();
                setPage(0);
                setRowsPerPage(5);
                setLoading(false);
                handleReset();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addFund = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/addTransactionData`, formData, config)
            .then((res) => {
                setSuccess(true)
                // filter ? getDataByFilter() : getData();
                getBankTransaction()
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setPage(0);
                setRowsPerPage(5);
                setFilter(false);
                setLoading(false);
                resetAddFund();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editFund = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateBankTransaction`, formData, config)
            .then((res) => {
                setSuccess(true)
                // filter ? getDataByFilter() : getData();
                getBankTransaction()
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setPage(0);
                setRowsPerPage(5);
                setFilter(false);
                setLoading(false);
                resetAddFund();
                focus();
                setIsEdit(false)
                resetAddFund();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addIncomeSource = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/addIncomeSource`, sourceFormData, config)
            .then((res) => {
                setSuccess(true)
                filter ? getIncomeSourceDataByFilter() : getIncomeSourceData();
                setPage(0);
                setRowsPerPage(5);
                setLoading(false);
                handleResetSource();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submit = () => {
        if (loading || success) {

        } else {
            const isValidate = bankFields.filter(element => {
                if (bankError[element] === true || bank[element] === '' || bank[element] === 0) {
                    setBankError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                addBank()
            }
        }
    }
    const submitEditFund = () => {
        if (loading || success) {

        } else {

            const isValidate = formDataEditErrorFields.filter(element => {
                if (formDataError[element] === true || formData[element] === '' || formData[element] === 0 || !formData[element]) {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            if (isValidate.length > 0) {
                console.log(">>??>>", formData, formDataError, isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                console.log(">>??>>", formData, formDataError)
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                // addBank()
                editFund()
                // console.log('submit add funds')
            }
        }
    }
    const submitAddFund = () => {
        if (loading || success) {

        } else {

            const isValidate = formDataErrorFields.filter(element => {
                console.log('submit dta', element, formDataError[element], formData[element])
                if (formDataError[element] === true || formData[element] === '' || formData[element] === null || formData[element] === 0 || !formData[element]) {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            if (isValidate.length > 0) {
                console.log(">>??>>", formData, formDataError, isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                console.log(">>??>>", formData, formDataError)
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                // addBank()
                addFund()
                // console.log('submit add funds')
            }
        }
    }
    const submitSource = () => {
        if (loading || success) {

        } else {
            if (!sourceFormData.sourceName || sourceFormData.sourceName.length < 2) {
                setError(
                    "Please Fill all Fields"
                )
                setSourceFormDataError({
                    sourceName: true
                });
            } else {
                addIncomeSource()
            }
        }
    }
    const goToBank = (id) => {
        navigate('/productList')
    }
    if (loading) {
        console.log('>>>>??')
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        toast.dismiss('loading');
        toast('success',
            {
                type: 'success',
                toastId: 'success',
                position: "top-right",
                toastId: 'error',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        setTimeout(() => {
            setSuccess(false)
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false)
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "top-right",
            toastId: 'error',
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
    return (
        <div className='mainBody'>
            <div className='productListContainer'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='productTableSubContainer'>
                            <div className='h-full grid grid-cols-12'>
                                <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                    <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                        <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                            setTab(1);
                                            getBanks();
                                        }}>
                                            <div className='statusTabtext'>Dashboard</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                            setTab(2);
                                            getSourceDDL();
                                            getDestinationDDL();
                                            getBankTransaction();
                                            setPage(0);
                                            resetAddFund();
                                            setFilter(false);
                                            setRowsPerPage(5);
                                            setState([
                                                {
                                                    startDate: new Date(),
                                                    endDate: new Date(),
                                                    key: 'selection'
                                                }
                                            ])
                                        }}>
                                            <div className='statusTabtext'>Add Funds</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabOut' : 'productTab'}`} onClick={() => {
                                            setTab(3);
                                            setPage(0);
                                            setFilter(false)
                                            setRowsPerPage(5);
                                            setState([
                                                {
                                                    startDate: new Date(),
                                                    endDate: new Date(),
                                                    key: 'selection'
                                                }
                                            ])
                                            getIncomeSourceData();
                                        }}>
                                            <div className='statusTabtext'>Income Source</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 4 || tab === '4' ? 'products' : 'productTab'}`} onClick={() => {
                                            setTab(4); setPage(0); setRowsPerPage(5); filter ? getDataByFilter() : getData();
                                            setFilter(false); setState([
                                                {
                                                    startDate: new Date(),
                                                    endDate: new Date(),
                                                    key: 'selection'
                                                }
                                            ]);
                                        }}>
                                            <div className='statusTabtext'>Bank Table</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                (tab === 1 || tab === '1') &&
                <div className="cardWrp">
                    <div className="grid lg:grid-cols-3 mobile:grid-cols-1 tablet1:grid-cols-2 tablet:grid-cols-2 cardTablet:grid-cols-3 laptop:grid-cols-3 laptopDesk:grid-cols-4 desktop1:grid-cols-4 desktop2:grid-cols-5 desktop2:grid-cols-5 gap-6">
                        {
                            banks && banks.map((data, index) => (
                                <BankCard goToBank={gotToBankDetail} data={data} name={data.bankDisplayName} imgName={data.bankIconName} />
                            ))
                        }
                        {/* <ConsoleCard goToAddUSer={goToAddUSer} name={"Add User"} imgName={'userAdd'} />
                        <ConsoleCard goToAddUSer={goToUserList} name={"User List"} imgName={'userList'} />
                        <ConsoleCard goToAddUSer={goToExpense} name={"Expense"} imgName={'expense'} /> */}
                    </div>
                </div>
            }
            {
                (tab === 2 || tab === '2') &&
                <div className="grid grid-cols-12 productListContainer">
                    <div className="col-span-12">
                        <Accordion expanded={expanded} square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}>
                            <AccordionSummary
                                sx={{ height: '60px', borderRadius: '0.75rem' }}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                onClick={() => { setExpanded(!expanded); resetAddFund(); }}
                            >
                                <div className='stockAccordinHeader'>Add Funds</div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="stockInOutContainer">
                                    <div className=''>
                                        <div className='grid grid-rows-2 gap-6'>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className="col-span-3">
                                                    {
                                                        isEdit ? <TextField
                                                            value={formData.fromId}
                                                            disabled
                                                            name="transactionAmount"
                                                            id="outlined-required"
                                                            label="Source"
                                                            InputProps={{ style: { fontSize: 14 } }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            fullWidth
                                                        />
                                                            : <FormControl fullWidth>
                                                                <Autocomplete
                                                                    defaultValue={null}
                                                                    id='source'
                                                                    disablePortal
                                                                    sx={{ width: '100%' }}
                                                                    // disabled={isEdit}
                                                                    value={formData.source ? formData.source : null}
                                                                    onChange={handleSourceNameAutoComplete}
                                                                    options={sourceList ? sourceList : []}
                                                                    getOptionLabel={(options) => options.fromName}
                                                                    renderInput={(params) => <TextField
                                                                        inputRef={textFieldRef} {...params}
                                                                        error={formDataError.source}
                                                                        helperText={formDataError.source ? "Please Select" : ''}
                                                                        label="From Bank" />}
                                                                />
                                                            </FormControl>
                                                    }
                                                </div>
                                                <div className="col-span-3">
                                                    {isEdit ? <TextField
                                                        value={formData.toID}
                                                        disabled
                                                        name="transactionAmount"
                                                        id="outlined-required"
                                                        label="Destination"
                                                        InputProps={{ style: { fontSize: 14 } }}
                                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                                        fullWidth
                                                    /> :
                                                        <FormControl fullWidth>
                                                            <Autocomplete
                                                                defaultValue={null}
                                                                id='bank'
                                                                disablePortal
                                                                sx={{ width: '100%' }}
                                                                // disabled={isEdit}
                                                                value={formData.destination ? formData.destination : null}
                                                                onChange={handleDestinationNameAutoComplete}
                                                                options={destinationList ? destinationList : []}
                                                                getOptionLabel={(options) => options.toName}
                                                                renderInput={(params) => <TextField
                                                                    {...params}
                                                                    error={formDataError.destination}
                                                                    helperText={formDataError.destination ? "Please Select" : ''}
                                                                    label="To Bank" />}
                                                            />
                                                        </FormControl>
                                                    }
                                                </div>
                                                <div className="col-span-3">
                                                    <TextField
                                                        onBlur={(e) => {
                                                            if (!e.target.value || e.target.value < 1) {
                                                                setFormDataError((perv) => ({
                                                                    ...perv,
                                                                    transactionAmount: true
                                                                }))
                                                            }
                                                            else {
                                                                setFormDataError((perv) => ({
                                                                    ...perv,
                                                                    transactionAmount: false
                                                                }))
                                                            }
                                                        }}
                                                        error={formDataError.transactionAmount}
                                                        helperText={formDataError.transactionAmount ? "Please Enter Amount" : ''}
                                                        onChange={(e) => {
                                                            if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                                onChange(e)
                                                            }
                                                        }}
                                                        value={formData.transactionAmount}
                                                        name="transactionAmount"
                                                        id="outlined-required"
                                                        label="Amount"
                                                        InputProps={{ style: { fontSize: 14 } }}
                                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                                        fullWidth
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DesktopDatePicker
                                                            textFieldStyle={{ width: '100%' }}
                                                            InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                                            label="Transaction Date"
                                                            format="DD/MM/YYYY"
                                                            required
                                                            error={formDataError.transactionDate}
                                                            value={formData.transactionDate}
                                                            onChange={handleTransactionDate}
                                                            name="transactionDate"
                                                            slotProps={{ textField: { fullWidth: true } }}
                                                            renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className="col-span-6">
                                                    <TextField
                                                        onChange={onChange}
                                                        value={formData.comment}
                                                        name="comment"
                                                        id="outlined-required"
                                                        label="Comment"
                                                        InputProps={{ style: { fontSize: 14 } }}
                                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                                        fullWidth
                                                    />
                                                </div>
                                                <div className="col-span-6">
                                                    <div className='grid grid-cols-12 gap-6'>
                                                        <div className='col-span-6'>
                                                            <button onClick={() => { isEdit ? submitEditFund() : submitAddFund() }} className='saveBtn' >Save</button>
                                                        </div>
                                                        <div className='col-span-6'>
                                                            <button onClick={() => { resetAddFund() }} className='resetBtn'>reset</button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='addUserBtnContainer grid grid-rows-1'>

                                </div>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className="col-span-12">
                        <div className='grid grid-cols-12 mt-6'>
                            <div className='col-span-12'>
                                <div className='userTableSubContainer pt-4'>
                                    <div className='grid grid-cols-12'>
                                        <div className='ml-4 col-span-6' >
                                            <div className='flex'>
                                                <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                                </div>
                                                <div className='resetBtnWrap col-span-3'>
                                                    <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                        setFilter(false);
                                                        // getData();
                                                        getBankTransaction();
                                                        setPage(0)
                                                        setRowsPerPage(5)
                                                        setState([
                                                            {
                                                                startDate: new Date(),
                                                                endDate: new Date(),
                                                                key: 'selection'
                                                            }
                                                        ])
                                                    }}><CloseIcon /></button>
                                                </div>
                                            </div>
                                            <Popover
                                                id={id}
                                                open={open}
                                                style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                            >
                                                <Box sx={{ bgcolor: 'background.paper', padding: '20px', width: 'auto', height: 'auto', borderRadius: '10px' }}>
                                                    <DateRangePicker
                                                        ranges={state}
                                                        onChange={item => { setState([item.selection]); console.log([item.selection]) }}
                                                        direction="horizontal"
                                                        months={2}
                                                        showSelectionPreview={true}
                                                        moveRangeOnFirstSelection={false}
                                                    />
                                                    <div className='mt-8 grid gap-4 grid-cols-12'>
                                                        <div className='col-span-3 col-start-7'>
                                                            <button className='stockInBtn' onClick={() => {
                                                                getBankTransactionByFilter();
                                                                setFilter(true); setPage(0); setRowsPerPage(5); handleClose()
                                                            }
                                                            }>Apply</button>
                                                        </div>
                                                        <div className='col-span-3'>
                                                            <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </Popover>
                                        </div>
                                        <div className='col-span-2 col-start-11 pr-5 flex justify-end'>
                                            <ExportMenu exportExcel={excelExport} exportPdf={pdfExport} />
                                        </div>
                                    </div>
                                    <div className='tableContainerWrapper'>
                                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>No.</TableCell>
                                                        <TableCell>Entered By</TableCell>
                                                        <TableCell>Source</TableCell>
                                                        <TableCell>Destination</TableCell>
                                                        <TableCell>Amount</TableCell>
                                                        <TableCell>Comment</TableCell>
                                                        <TableCell align="left">Date</TableCell>
                                                        <TableCell align="left">Time</TableCell>
                                                        {/* <TableCell align="right">Percentage</TableCell> */}
                                                        <TableCell align="right"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {bankTransaction?.map((row, index) => (
                                                        totalRowsTransaction !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.transactionId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <Tooltip title={row.userName} arrow>
                                                                    <TableCell component="th" scope="row" >
                                                                        {row.enterBy}
                                                                    </TableCell>
                                                                </Tooltip>
                                                                <TableCell align="left" >{row.fromId}</TableCell>
                                                                <TableCell align="left" >{row.toID}</TableCell>
                                                                <TableCell align="left" >{parseFloat(row.amount).toLocaleString("en-IN")}</TableCell>
                                                                <TableCell align="left" >{row.comment}</TableCell>
                                                                {/* <TableCell align="right" onClick={() => navigateToDetail(row.bankName, row.bankId)}>{parseFloat(row.outPrice ? row.outPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                                <TableCell align="left" >{row.transactionDate}</TableCell>
                                                                <TableCell align="left" >{row.transactionDateTime}</TableCell>
                                                                {/* <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.bankId, row.bankName, row.bankIconName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.bankId)}>Delete</button></div></TableCell> */}
                                                                <TableCell align="left" ><BankTransactionMenu data={row} handleDelete={handleDeleteTransaction} handleEdit={handleEditTransaction} setError={setError} /></TableCell>
                                                            </TableRow> :
                                                            <TableRow
                                                                key={row.userId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                            </TableRow>

                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                component="div"
                                                count={totalRowsTransaction}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                            />
                                        </TableContainer>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
            }
            {
                (tab === 4 || tab === '4') &&
                <div className='grid grid-cols-12 mt-6'>
                    <div className='col-span-12 tableCardMargin'>
                        <div className='userTableSubContainer pt-4'>
                            <div className='grid grid-cols-12'>
                                <div className='ml-4 col-span-6' >
                                    <div className='flex'>
                                        <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                            <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                        </div>
                                        <div className='resetBtnWrap col-span-3'>
                                            <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                setFilter(false);
                                                // getData();
                                                setState([
                                                    {
                                                        startDate: new Date(),
                                                        endDate: new Date(),
                                                        key: 'selection'
                                                    }
                                                ])
                                            }}><CloseIcon /></button>
                                        </div>
                                    </div>
                                    <Popover
                                        id={id}
                                        open={open}
                                        style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <Box sx={{ bgcolor: 'background.paper', padding: '20px', width: 'auto', height: 'auto', borderRadius: '10px' }}>
                                            <DateRangePicker
                                                ranges={state}
                                                onChange={item => { setState([item.selection]); console.log([item.selection]) }}
                                                direction="horizontal"
                                                months={2}
                                                showSelectionPreview={true}
                                                moveRangeOnFirstSelection={false}
                                            />
                                            <div className='mt-8 grid gap-4 grid-cols-12'>
                                                <div className='col-span-3 col-start-7'>
                                                    <button className='stockInBtn' onClick={() => { }
                                                        // { getDataByFilter(); setFilter(true); setPage(0); handleClose() }
                                                    }>Apply</button>
                                                </div>
                                                <div className='col-span-3'>
                                                    <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                </div>
                                            </div>
                                        </Box>
                                    </Popover>
                                </div>
                                <div className='col-span-2 col-start-11 mr-6'>
                                    <div className='flex justify-end'>
                                        <button className='addCategoryBtn' onClick={handleOpen}>Add Bank</button>
                                    </div>
                                </div>
                            </div>
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Bank Name</TableCell>
                                                <TableCell>Bank Display Name</TableCell>
                                                <TableCell>Bank Short Form</TableCell>
                                                <TableCell>Bank Account Number</TableCell>
                                                <TableCell>IFSC Code</TableCell>
                                                <TableCell align="left">Icon Name</TableCell>
                                                <TableCell align="left">Status</TableCell>
                                                {/* <TableCell align="right">Percentage</TableCell> */}
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.bankId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row" onClick={() => gotToBankDetail(row.bankId)}>
                                                            {row.bankName}
                                                        </TableCell>
                                                        <TableCell align="left" onClick={() => gotToBankDetail(row.bankId)}>{row.bankDisplayName}</TableCell>
                                                        <TableCell align="left" onClick={() => gotToBankDetail(row.bankId)}>{row.bankShortForm}</TableCell>
                                                        <TableCell align="left" onClick={() => gotToBankDetail(row.bankId)}>{row.bankAccountNumber}</TableCell>
                                                        <TableCell align="left" onClick={() => gotToBankDetail(row.bankId)}>{row.ifscCode}</TableCell>
                                                        {/* <TableCell align="right" onClick={() => navigateToDetail(row.bankName, row.bankId)}>{parseFloat(row.outPrice ? row.outPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        <TableCell align="left" onClick={() => gotToBankDetail(row.bankId)}>{row.bankIconName}</TableCell>
                                                        <TableCell align="left" onClick={() => gotToBankDetail(row.bankId)}>{row.isActive ? <span className={'text-green-600 font-semibold'}>Active</span> : <span className="text-red-600 font-semibold">Inactive</span>}</TableCell>
                                                        {/* <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.bankId, row.bankName, row.bankIconName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.bankId)}>Delete</button></div></TableCell> */}
                                                        <TableCell align="left" ><BankMenu data={row} handleDelete={handleDelete} handleEdit={handleEdit} setError={setError} /></TableCell>
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRows}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {isEdit ? 'Edit Bank' : 'Add Bank'}
                            </Typography>
                            <div className='mt-6 grid grid-cols-12 gap-6'>
                                <div className='col-span-4'>
                                    <TextField
                                        onBlur={(e) => {
                                            if (e.target.value.length < 2) {
                                                setBankError((perv) => ({
                                                    ...perv,
                                                    bankName: true
                                                }));
                                            }
                                            else {
                                                setBankError((perv) => ({
                                                    ...perv,
                                                    bankName: false
                                                }))
                                            }
                                        }}
                                        onChange={(e) => {
                                            isEdit ? setEditBank((perv) => ({
                                                ...perv,
                                                bankName: e.target.value
                                            })) : setBank((perv) => ({
                                                ...perv,
                                                bankName: e.target.value
                                            }))
                                        }}
                                        value={isEdit ? editBank.bankName ? editBank.bankName : '' : bank.bankName ? bank.bankName : ''}
                                        error={bankError.bankName ? true : false}
                                        inputRef={textFieldRef}
                                        helperText={bankError.bankName ? "Please Enter Bank" : ''}
                                        name="bankName"
                                        id="outlined-required"
                                        label="Bank Name"
                                        InputProps={{ style: { fontSize: 17 } }}
                                        InputLabelProps={{ style: { fontSize: 17 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-4'>
                                    <TextField
                                        onChange={(e) => {
                                            isEdit ? setEditBank((perv) => ({
                                                ...perv,
                                                bankShortForm: e.target.value
                                            })) : setBank((perv) => ({
                                                ...perv,
                                                bankShortForm: e.target.value
                                            }))
                                        }}
                                        value={isEdit ? editBank.bankShortForm ? editBank.bankShortForm : '' : bank.bankShortForm ? bank.bankShortForm : ''}
                                        name="bankShortForm"
                                        id="outlined-required"
                                        label="Bank Short Form"
                                        InputProps={{ style: { fontSize: 17 } }}
                                        InputLabelProps={{ style: { fontSize: 17 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-4'>
                                    <TextField
                                        onBlur={(e) => {
                                            if (e.target.value.length < 2) {
                                                setBankError((perv) => ({
                                                    ...perv,
                                                    bankDisplayName: true
                                                }));
                                            }
                                            else {
                                                setBankError((perv) => ({
                                                    ...perv,
                                                    bankDisplayName: false
                                                }))
                                            }
                                        }}
                                        onChange={(e) => {
                                            isEdit ? setEditBank((perv) => ({
                                                ...perv,
                                                bankDisplayName: e.target.value
                                            })) : setBank((perv) => ({
                                                ...perv,
                                                bankDisplayName: e.target.value
                                            }))
                                        }}
                                        value={isEdit ? editBank.bankDisplayName ? editBank.bankDisplayName : '' : bank.bankDisplayName ? bank.bankDisplayName : ''}
                                        error={bankError.bankDisplayName ? true : false}
                                        helperText={bankError.bankDisplayName ? "Please Enter Bank" : ''}
                                        name="bankDisplayName"
                                        id="outlined-required"
                                        label="Bank Display Name"
                                        InputProps={{ style: { fontSize: 17 } }}
                                        InputLabelProps={{ style: { fontSize: 17 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-4'>
                                    <TextField
                                        onChange={(e) => {
                                            isEdit ? setEditBank((perv) => ({
                                                ...perv,
                                                bankAccountNumber: e.target.value
                                            })) : setBank((perv) => ({
                                                ...perv,
                                                bankAccountNumber: e.target.value
                                            }))
                                        }}
                                        value={isEdit ? editBank.bankAccountNumber ? editBank.bankAccountNumber : '' : bank.bankAccountNumber ? bank.bankAccountNumber : ''}
                                        name="bankAccountNumber"
                                        id="outlined-required"
                                        label="Bank Account Number"
                                        InputProps={{ style: { fontSize: 17 } }}
                                        InputLabelProps={{ style: { fontSize: 17 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-4'>
                                    <TextField
                                        onChange={(e) => {
                                            isEdit ? setEditBank((perv) => ({
                                                ...perv,
                                                ifscCode: e.target.value
                                            })) : setBank((perv) => ({
                                                ...perv,
                                                ifscCode: e.target.value
                                            }))
                                        }}
                                        value={isEdit ? editBank.ifscCode ? editBank.ifscCode : '' : bank.ifscCode ? bank.ifscCode : ''}
                                        name="ifscCode"
                                        id="outlined-required"
                                        label="IFSC Code"
                                        InputProps={{ style: { fontSize: 17 } }}
                                        InputLabelProps={{ style: { fontSize: 17 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className="col-span-4">
                                    <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                        <InputLabel id="demo-simple-select-label" error={setBankError.bankIconName}>Icon Name</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={isEdit ? editBank.bankIconName ? editBank.bankIconName : '' : bank.bankIconName ? bank.bankIconName : ''}
                                            error={bankError.bankIconName ? true : false}
                                            name="stockInPaymentMethod"
                                            label="Icon Name"
                                            onBlur={(e) => {
                                                if (!e.target.value) {
                                                    setBankError((perv) => ({
                                                        ...perv,
                                                        bankIconName: true
                                                    }))
                                                }
                                                else {
                                                    setBankError((perv) => ({
                                                        ...perv,
                                                        bankIconName: false
                                                    }))
                                                }
                                            }}
                                            onChange={(e) => isEdit ? setEditBank((perv) => ({
                                                ...perv,
                                                bankIconName: e.target.value
                                            })) : setBank((perv) => ({
                                                ...perv,
                                                bankIconName: e.target.value
                                            }))}
                                        >
                                            <MenuItem key={'Wallet'} value={'Wallet'}>{'Wallet'}</MenuItem>
                                            <MenuItem key={'HomeBank'} value={'HomeBank'}>{'Home Bank'}</MenuItem>
                                            <MenuItem key={'BOB'} value={'BOB'}>{'Bank Of Baroda'}</MenuItem>
                                            <MenuItem key={'Centrel'} value={'Centrel'}>{'Centrel Bank'}</MenuItem>
                                            <MenuItem key={'Dena'} value={'Dena'}>{'Dena Bank'}</MenuItem>
                                            <MenuItem key={'SBI'} value={'SBI'}>{'State Bank Of India'}</MenuItem>
                                            <MenuItem key={'HDFC'} value={'HDFC'}>{'HDFC Bank'}</MenuItem>
                                            <MenuItem key={'ICICI'} value={'ICICI'}>{'ICICI Bank'}</MenuItem>
                                            <MenuItem key={'Nagrik'} value={'Nagrik'}>{'Nagrik Bank'}</MenuItem>
                                            <MenuItem key={'POST'} value={'POST'}>{'POST Bank'}</MenuItem>
                                            <MenuItem key={'Other'} value={'Other'}>{'Other Bank'}</MenuItem>
                                            <MenuItem key={'caterers'} value={'caterers'}>{'Caterers'}</MenuItem>
                                            <MenuItem key={'School'} value={'School'}>{'School'}</MenuItem>
                                            <MenuItem key={'spareBalnce'} value={'spareBalnce'}>{'Spare Balnce'}</MenuItem>
                                            <MenuItem key={'exchange'} value={'exchange'}>{'Exchange'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='col-span-4'>
                                    <FormControlLabel control={<Checkbox checked={isEdit ? editBank.isActive : bank.isActive} onChange={() => {
                                        isEdit ? setEditBank((prev) => ({
                                            ...prev,
                                            isActive: !editBank.isActive
                                        })) : setBank((prev) => ({
                                            ...prev,
                                            isActive: !bank.isActive
                                        }))
                                    }} />} label="Is Active" />
                                </div>
                                <div className="col-span-4">
                                    <FormControlLabel control={<Checkbox checked={isEdit ? editBank.isViewMonthlyTransaction : bank.isViewMonthlyTransaction}
                                        onChange={() => {
                                            isEdit ? setEditBank((prev) => ({
                                                ...prev,
                                                isViewMonthlyTransaction: !editBank.isViewMonthlyTransaction
                                            })) : setBank((prev) => ({
                                                ...prev,
                                                isViewMonthlyTransaction: !bank.isViewMonthlyTransaction
                                            }))
                                        }}
                                    />} label="View Monthly Transaction" />
                                </div>
                                <div className='col-start-9 col-span-2'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        isEdit ? editBankFnc() : submit()
                                    }}>{isEdit ? 'Save' : 'Add'}</button>
                                </div>
                                <div className='col-span-2'>
                                    <button className='addCategoryCancleBtn' onClick={() => {
                                        handleCloseModal(); setEditBank((perv) => ({
                                            ...perv,
                                            bankName: '',
                                            bankIconName: '',
                                            bankShortForm: '',
                                            bankDisplayName: '',
                                            bankAccountNumber: '',
                                            ifscCode: '',
                                            bankId: '',
                                            isViewMonthlyTransaction: false,
                                            isActive: true
                                        }));
                                        setBank({
                                            bankName: '',
                                            bankIconName: '',
                                            bankShortForm: '',
                                            bankDisplayName: '',
                                            bankAccountNumber: '',
                                            ifscCode: '',
                                            bankId: '',
                                            isViewMonthlyTransaction: false,
                                            isActive: true
                                        })
                                        setBankError({
                                            bankName: false,
                                            bankIconName: false,
                                            bankDisplayName: false,
                                        })
                                        setIsEdit(false)
                                    }}>Cancle</button>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                    <ToastContainer />
                </div >
            }
            {
                (tab === 3 || tab === '3') &&
                <div className='grid grid-cols-12 mt-6'>
                    <div className='col-span-12 tableCardMargin'>
                        <div className='userTableSubContainer pt-4'>
                            <div className='grid grid-cols-12'>
                                <div className='ml-4 col-span-6' >
                                    <div className='flex'>
                                        <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                            <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                        </div>
                                        <div className='resetBtnWrap col-span-3'>
                                            <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                setFilter(false);
                                                getIncomeSourceData();
                                                setPage(0);
                                                setRowsPerPage(5);
                                                setState([
                                                    {
                                                        startDate: new Date(),
                                                        endDate: new Date(),
                                                        key: 'selection'
                                                    }
                                                ])
                                            }}><CloseIcon /></button>
                                        </div>
                                    </div>
                                    <Popover
                                        id={id}
                                        open={open}
                                        style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <Box sx={{ bgcolor: 'background.paper', padding: '20px', width: 'auto', height: 'auto', borderRadius: '10px' }}>
                                            <DateRangePicker
                                                ranges={state}
                                                onChange={item => { setState([item.selection]); console.log([item.selection]) }}
                                                direction="horizontal"
                                                months={2}
                                                showSelectionPreview={true}
                                                moveRangeOnFirstSelection={false}
                                            />
                                            <div className='mt-8 grid gap-4 grid-cols-12'>
                                                <div className='col-span-3 col-start-7'>
                                                    <button className='stockInBtn' onClick={() => { getIncomeSourceDataByFilter(); setFilter(true); setPage(0); setRowsPerPage(5); handleClose() }
                                                    }>Apply</button>
                                                </div>
                                                <div className='col-span-3'>
                                                    <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                </div>
                                            </div>
                                        </Box>
                                    </Popover>
                                </div>
                                <div className='col-span-2 col-start-9 pr-5 flex justify-end'>
                                    <ExportMenu exportExcel={excelExportIncome} exportPdf={pdfExportIncome} />
                                </div>
                                <div className='col-span-2 col-start-11 mr-6'>
                                    <div className='flex justify-end'>
                                        <button className='addCategoryBtn' onClick={handleOpen}>Add Source</button>
                                    </div>
                                </div>
                            </div>
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Income Source</TableCell>
                                                <TableCell align="right">Income</TableCell>
                                                {/* <TableCell align="right">Percentage</TableCell> */}
                                                <TableCell align="right"></TableCell>
                                                {/* <TableCell align="right"></TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {incomeSources?.map((row, index) => (
                                                totalRowsIncome !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.sourceId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row" >
                                                            {row.sourceName}
                                                        </TableCell>
                                                        <TableCell align="right" scope="row" >
                                                            {parseFloat(row.creditAmt ? row.creditAmt : 0).toLocaleString('en-IN')}
                                                        </TableCell>
                                                        <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEditSource(row)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDeleteSource(row.sourceId)}>Delete</button></div></TableCell>
                                                        {/* <TableCell align="left" ><BankMenu data={row} handleDelete={handleDelete} handleEdit={handleEdit} setError={setError} /></TableCell> */}
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRowsIncome}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        </div>
                    </div>
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={styleIncome}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {isEdit ? 'Edit Income Source' : 'Add Income Source'}
                            </Typography>
                            <div className='mt-6 grid grid-cols-12 gap-6'>
                                <div className='col-span-6'>
                                    <TextField
                                        onBlur={(e) => {
                                            if (e.target.value.length < 2) {
                                                setSourceFormDataError((perv) => ({
                                                    ...perv,
                                                    sourceName: true
                                                }));
                                            }
                                            else {
                                                setSourceFormDataError((perv) => ({
                                                    ...perv,
                                                    sourceName: false
                                                }))
                                            }
                                        }}
                                        onChange={(e) => {
                                            setSourceFormData((perv) => ({
                                                ...perv,
                                                sourceName: e.target.value
                                            }))
                                        }}
                                        value={sourceFormData.sourceName ? sourceFormData.sourceName : ''}
                                        error={sourceFormDataError.sourceName ? true : false}
                                        inputRef={textFieldRef}
                                        helperText={bankError.sourceName ? "Please Enter Bank" : ''}
                                        name="sourceName"
                                        id="outlined-required"
                                        label="Income Source Name"
                                        InputProps={{ style: { fontSize: 17 } }}
                                        InputLabelProps={{ style: { fontSize: 17 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-3'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        isEdit ? editSourceFnc() : submitSource()
                                    }}>{isEdit ? 'Save' : 'Add'}</button>
                                </div>
                                <div className='col-span-3'>
                                    <button className='addCategoryCancleBtn' onClick={() => {
                                        handleCloseModal();
                                        setSourceFormData({
                                            sourceName: ''
                                        });
                                        setSourceFormDataError(
                                            {
                                                sourceName: false
                                            }
                                        )
                                        setIsEdit(false)
                                    }}>Cancle</button>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                    <ToastContainer />
                </div >
            }
            <ToastContainer />
        </div>
    )
}

export default BankDashboard;
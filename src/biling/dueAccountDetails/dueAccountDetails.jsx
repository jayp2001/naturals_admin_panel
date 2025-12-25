import './dueAccountDetails.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
import CountCard from './countCard/countCard';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Menutemp from '../../pages/inventory/transactionTable/menu';
import MenuStockInOut from './menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';


const styleStockIn = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
const styleGave = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
const style = {
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
    paddingBottom: '10px'
};

function DueAccountDetail() {
    let { id } = useParams();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [formData, setFormData] = React.useState({
        accountId: '',
        givenBy: '',
        paidAmount: '',
        transactionNote: '',
        transactionDate: dayjs()
    });
    const [formDataError, setFormDataError] = React.useState({
        givenBy: false,
        paidAmount: false,
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'givenBy',
        'paidAmount',
    ]);
    const [formDataDue, setFormDataDue] = React.useState({
        accountId: '',
        accountName: '',
        billAmount: '',
        dueNote: '',
        dueDate: dayjs()
    });
    const onChangeDue = (e) => {
        if (e.target.name === 'billAmount') {
            setFormDataDue((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        } else {
            setFormDataDue((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const [formDataErrorDue, setFormDataErrorDue] = React.useState({
        billAmount: false,
    });
    const [formDataErrorFeildDue, setFormDataErrorFeildDue] = React.useState([
        'billAmount',
    ]);
    const [open0, setOpen0] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [stockInData, setStockInData] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsDebit, setTotalRowsDebit] = React.useState(0);
    const [totalRowsProduct, setTotalRowsProduct] = React.useState(0);
    const [filter, setFilter] = React.useState(false);
    const [tab, setTab] = React.useState(1);
    const [tabStockIn, setTabStockIn] = React.useState('');
    const [suppilerDetails, setSuppilerDetails] = useState();
    const [statisticsCount, setStatisticsCounts] = useState();
    const [productQtyCount, setProductQty] = useState();
    const [debitTransaction, setDebitTransaction] = React.useState();
    const [productTable, setProductTable] = React.useState();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const handleClose0 = () => {
        setFormData({
            accountId: '',
            givenBy: '',
            paidAmount: '',
            transactionNote: '',
            remainingAmount: '',
            supplierName: '',
            transactionDate: dayjs()
        })
        setFormDataError({
            givenBy: false,
            paidAmount: false,
        })
        setOpen0(false);
    }
    const handleClose1 = () => {
        setFormDataDue({
            accountId: '',
            accountName: '',
            billAmount: '',
            dueNote: '',
            dueDate: dayjs()
        })
        setFormDataErrorDue({
            billAmount: false,
        })
        setOpen1(false);
    }
    const handlTransactionDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["transactionDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const getSuppilerDetails = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueCustomerDataById?accountId=${id}`, config)
            .then((res) => {
                console.log(">>>", res.data);
                setSuppilerDetails(res.data);
                setFormData((perv) => ({
                    ...perv,
                    givenBy: res.data.customerName,
                    accountId: id,
                    transactionDate: dayjs()
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStatistics = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueStaticsById?accountId=${id}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
                setFormData((perv) => ({
                    ...perv,
                    remainingAmount: res.data.remainingAmount,
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInData = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueBillDataById?&page=${page + 1}&numPerPage=${rowsPerPage}&accountId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByTab = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueBillDataById?&page=${1}&numPerPage=${5}&accountId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByTabByFilter = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueBillDataById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&accountId=${id}&payType=${tab}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getPaidBillsByTab = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueDebitTransactionListById?&page=${1}&numPerPage=${5}&accountId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getPaidBillByTebByFillter = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueDebitTransactionListById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&accountId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getMonthlyPaidBillsByTab = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getMonthWiseTransactionForDueAccount?&page=${1}&numPerPage=${5}&accountId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    // const getStockInDataonRemoveFilter = async (tab) => {
    //     await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueBillDataById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${page + 1}&numPerPage=${rowsPerPage}&accountId=${id}&payType=${tabStockIn}`, config)
    //         .then((res) => {
    //             setStockInData(res.data.rows);
    //             setTotalRows(res.data.numRows);
    //         })
    //         .catch((error) => {
    //              setError(error.response ? error.response.data : "Network Error ...!!!")
    //         })
    // }
    const getStockInDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueBillDataById?page=${pageNum}&numPerPage=${rowPerPageNum}&accountId=${id}&payType=${tabStockIn}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getMonthlyDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getMonthWiseTransactionForDueAccount?page=${pageNum}&numPerPage=${rowPerPageNum}&accountId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueBillDataById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&accountId=${id}&payType=${tabStockIn}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueBillDataById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}&accountId=${id}&payType=${tabStockIn}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStatisticsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueStaticsById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&accountId=${id}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    // const getProductCount = async () => {
    //     await axios.get(`${BACKEND_BASE_URL}billingrouter/getDueStaticsById?accountId=${id}`, config)
    //         .then((res) => {
    //             setProductQty(res.data);
    //         })
    //         .catch((error) => {
    //             setError(error.response ? error.response.data : "Network Error ...!!!")
    //         })
    // }
    const getProductCountByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getProductDetailsBySupplierId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&accountId=${id}`, config)
            .then((res) => {
                setProductQty(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (tabStockIn == 'Monthly') {
            getMonthlyDataOnPageChange(newPage + 1, rowsPerPage)
        }
        else if (tabStockIn !== 'transaction' && tabStockIn !== 'products') {
            if (filter) {
                getStockInDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockInDataOnPageChange(newPage + 1, rowsPerPage)
            }
        } else if (tabStockIn === 'products') {
            if (filter) {
                getProductDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getProductDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else {
            if (filter) {
                getDebitDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getDebitDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tabStockIn == 'Monthly') {
            getMonthlyDataOnPageChange(1, parseInt(event.target.value, 10))
        }
        else if (tabStockIn !== 'transaction' && tabStockIn !== 'products') {
            if (filter) {
                getStockInDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockInDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabStockIn === 'products') {
            if (filter) {
                getProductDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getProductDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else {
            if (filter) {
                getDebitDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDebitDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;

    const getDebitData = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDebitTransactionList?&page=${page + 1}&numPerPage=${rowsPerPage}&accountId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDebitDataByTab = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDebitTransactionList?&page=${1}&numPerPage=${5}&accountId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getProductDataByTab = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getAllProductDetailsBySupplierId?&page=${1}&numPerPage=${5}&accountId=${id}`, config)
            .then((res) => {
                setProductTable(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getDebitDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDebitTransactionList?page=${pageNum}&numPerPage=${rowPerPageNum}&accountId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getProductDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getAllProductDetailsBySupplierId?page=${pageNum}&numPerPage=${rowPerPageNum}&accountId=${id}`, config)
            .then((res) => {
                setProductTable(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getDebitDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&accountId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getProductDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getAllProductDetailsBySupplierId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&accountId=${id}`, config)
            .then((res) => {
                setProductTable(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getDebitDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&accountId=${id}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getProductDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getAllProductDetailsBySupplierId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&accountId=${id}`, config)
            .then((res) => {
                setProductTable(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    useEffect(() => {
        // getProductCount();
        getStatistics();
        getSuppilerDetails();
        getStockInData()
    }, [])
    const handlDueDate = (date) => {
        setFormDataDue((prevState) => ({
            ...prevState,
            ["dueDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const addDue = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}billingrouter/addDueBillData`, formDataDue, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setFilter(false);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setPage(0);
                setRowsPerPage(5);
                getStockInDataByTab('');
                setTabStockIn('')
                handleClose1();
                getStatistics();
                // getPaidBillsByTab('');
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submitPaymentDue = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFeildDue.filter(element => {
                if (formDataErrorDue[element] === true || formDataDue[element] === '' || formDataDue[element] === 0) {
                    setFormDataErrorDue((perv) => ({
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
                addDue()
            }
        }
    }
    const onChange = (e) => {
        if (e.target.name === 'paidAmount') {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const makePayment = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}billingrouter/addDebitDueTransactionData`, formData, config)
            .then((res) => {
                setSuccess(true)
                setLoading(false)
                setFilter(false);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getStatistics();
                setPage(0);
                setRowsPerPage(5);
                getPaidBillsByTab('');
                setTabStockIn('Transactions');
                handleClose0();

            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submitPayment = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFeild.filter(element => {
                if (formDataError[element] === true || formData[element] === '' || formData[element] === 0) {
                    setFormDataError((perv) => ({
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
                makePayment()
            }
        }
    }
    const deleteStockIn = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}billingrouter/removeDueBillDataById?dabId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                getStockInDataByTab('');
                getStatistics();
                // getStockInData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleOpen = () => {
        // getCategoryList();
        setFormData((perv) => ({
            ...perv,
            accountId: suppilerDetails.accountId,
            givenBy: suppilerDetails.customerName,
        }))
        setOpen0(true);
    }
    const handleOpen1 = () => {
        setFormDataDue((perv) => ({
            ...perv,
            accountId: suppilerDetails.accountId,
            accountName: suppilerDetails.customerName,
        }))
        setOpen1(true);
    }
    const handleDeleteStockIn = (id) => {
        if (window.confirm("Are you sure you want to delete Due?")) {
            deleteStockIn(id);
        }
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}billingrouter/removeDueDebitTransactionById?transactionId=${id}`, config)
            .then((res) => {
                setSuccess(true);
                getStatistics();
                setPage(0);
                setRowsPerPage(5);
                getPaidBillsByTab('');
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteTransaction = (id) => {
        if (window.confirm("Are you sure you want to delete transaction?")) {
            deleteData(id);
            // setTimeout(() => {
            //     getDebitData();
            // }, 1000)
        }
    }
    const getInvoice = async (tId) => {
        if (window.confirm('Are you sure you want to Download Invoice ... ?')) {
            await axios({
                url: `${BACKEND_BASE_URL}billingrouter/exportDueTransactionInvoice?transactionId=${tId}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = suppilerDetails.customerName + '_' + new Date().toLocaleDateString() + '.pdf'
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

    const stockInExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}billingrouter/exportExcelSheetForStockin?startDate=${state[0].startDate}&endDate=${state[0].endDate}&accountId=${id}&payType=${tabStockIn}` : `${BACKEND_BASE_URL}billingrouter/exportExcelSheetForStockin?startDate=${''}&endDate=${''}&accountId=${id}&payType=${tabStockIn}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'StockIn_' + new Date().toLocaleDateString() + '.xlsx'
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

    const allProductExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}billingrouter/exportExcelSheetForAllProductBySupplierId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&accountId=${id}&payType=${tabStockIn}` : `${BACKEND_BASE_URL}billingrouter/exportExcelSheetForAllProductBySupplierId?startDate=${''}&endDate=${''}&accountId=${id}&payType=${tabStockIn}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'AllProducts_' + new Date().toLocaleDateString() + '.xlsx'
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

    const transactionExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}billingrouter/exportExcelSheetForDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&accountId=${id}` : `${BACKEND_BASE_URL}billingrouter/exportExcelSheetForDebitTransactionList?startDate=${''}&endDate=${''}&accountId=${id}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = filter ? 'Transactions_' + new Date(state[0].startDate).toLocaleDateString() + ' - ' + new Date(state[0].endDate).toLocaleDateString() + '.xlsx' : 'Transactions_' + new Date().toLocaleDateString();
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

    if (!suppilerDetails) {
        return null;
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
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        setTimeout(() => {
            setSuccess(false)
        }, 50)
    }
    if (error) {
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
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-5 mt-6 grid gap-2 dueAccountDetailContainer'>
                    <div className='suppilerHeader'>
                        Account Details
                    </div>
                    {/* <div> */}
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.customerName}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Number :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.customerNumber}
                        </div>
                    </div>
                    {/* </div> */}
                    <div>

                    </div>
                    <div>

                    </div>
                    <div>

                    </div>
                </div>
                <div className='col-span-7 mt-6'>
                    <div className='datePickerWrp mb-4'>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='productTableSubContainer'>
                                    <div className='h-full grid grid-cols-12'>
                                        <div className='h-full col-span-5'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <div className={`flex col-span-6 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(1);
                                                    }} >
                                                    <div className='statusTabtext'>Statistics</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-7 flex justify-end pr-4'>
                                            <div className='dateRange text-center self-center' aria-describedby={ids} onClick={handleClick}>
                                                <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                            </div>
                                            <div className='resetBtnWrap col-span-3 self-center'>
                                                <button
                                                    className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                                    onClick={() => {
                                                        setFilter(false);
                                                        setState([
                                                            {
                                                                startDate: new Date(),
                                                                endDate: new Date(),
                                                                key: 'selection'
                                                            }
                                                        ])
                                                        getStatistics();
                                                        setTabStockIn(''); setPage(0); setRowsPerPage(5); getStockInDataByTab('')
                                                    }}><CloseIcon /></button>
                                            </div>
                                            <Popover
                                                id={ids}
                                                open={open}
                                                style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
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
                                                                setFilter(true); handleClose(); getStatisticsByFilter(); setTabStockIn(''); setPage(0); setRowsPerPage(5); getStockInDataByTabByFilter(''); getProductCountByFilter();
                                                            }}>Apply</button>
                                                        </div>
                                                        <div className='col-span-3'>
                                                            <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid gap-4 mt-12'>
                        <div className='grid grid-cols-6 gap-6'>
                            <div className='col-span-3'>
                                <CountCard color={'blue'} count={statisticsCount && statisticsCount.totalDue ? statisticsCount.totalDue : 0} desc={'Total Due'} />
                            </div>
                            <div className='col-span-3'>
                                <CountCard color={'orange'} count={statisticsCount && statisticsCount.totalPaidAmount ? statisticsCount.totalPaidAmount : 0} desc={'Total Paid'} />
                            </div>
                        </div>
                        <div className='grid grid-cols-6 gap-6'>
                            <div className='col-span-6'>
                                <CountCard color={'pink'} count={statisticsCount && statisticsCount.dueBalance ? statisticsCount.dueBalance : 0} desc={statisticsCount?.balanceHeading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='mt-6'>
                <Accordion square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}>
                    <AccordionSummary
                        sx={{ height: '60px', borderRadius: '0.75rem' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        onClick={() => {
                            setFormData((perv) => ({
                                ...perv,
                                paidAmount: null,
                                transactionNote: '',
                            }))
                            setFormDataError((perv) => ({
                                ...perv,
                                receivedBy: false,
                                paidAmount: false,
                            }))
                        }}
                    >
                        <div className='stockAccordinHeader'>Make Payment to {formData.supplierName}</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='stockInOutContainer'>
                            <div className='mt-6 grid grid-cols-12 gap-6'>
                                <div className='col-span-3'>
                                    <TextField
                                        disabled={formData.remainingAmount === 0 ? true : false}
                                        onBlur={(e) => {
                                            if (e.target.value < 2) {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    receivedBy: true
                                                }))
                                            }
                                            else {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    receivedBy: false
                                                }))
                                            }
                                        }}
                                        value={formData.receivedBy}
                                        error={formDataError.receivedBy}
                                        helperText={formDataError.receivedBy ? 'Enter Reciver Name' : ''}
                                        name="receivedBy"
                                        id="outlined-required"
                                        label="Received By"
                                        onChange={onChange}
                                        InputProps={{ style: { fontSize: 14 } }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className='col-span-3'>
                                    <TextField
                                        disabled={formData.remainingAmount === 0 ? true : false}
                                        onBlur={(e) => {
                                            if (e.target.value < 0) {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    paidAmount: true
                                                }))
                                            }
                                            else {
                                                setFormDataError((perv) => ({
                                                    ...perv,
                                                    paidAmount: false
                                                }))
                                            }
                                        }}
                                        type="number"
                                        label="Paid Amount"
                                        fullWidth
                                        onChange={onChange}
                                        value={formData.paidAmount ? formData.paidAmount : 0}
                                        error={formDataError.paidAmount}
                                        // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                        helperText={`Remaining Payment ${formData.remainingAmount}`}
                                        name="paidAmount"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                        }}
                                    />
                                </div>
                                <div className='col-span-2'>
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
                                            onChange={handlTransactionDate}
                                            name="transactionDate"
                                            renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className='col-span-4'>
                                    <TextField
                                        disabled={formData.remainingAmount === 0 ? true : false}
                                        onChange={onChange}
                                        value={formData.transactionNote}
                                        name="transactionNote"
                                        id="outlined-required"
                                        label="Comment"
                                        InputProps={{ style: { fontSize: 14 } }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        fullWidth
                                    />
                                </div>
                            </div>
                            <div className='mt-4 grid grid-cols-12 gap-6'>
                                <div className='col-start-7 col-span-3'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        !formData.remainingAmount == 0 && submitPayment();
                                    }}>Make Payment</button>
                                </div>
                                <div className='col-span-3'>
                                    <button className='addCategoryCancleBtn' onClick={() => {
                                        setFormData((perv) => ({
                                            ...perv,
                                            paidAmount: '',
                                            transactionNote: '',
                                            transactionDate: dayjs()
                                        }))
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            receivedBy: false,
                                            paidAmount: false,
                                        }))
                                    }}>Cancle</button>
                                </div>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div> */}
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-9'>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tabStockIn === null || tabStockIn === '' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTabStockIn(''); setPage(0); setRowsPerPage(5); filter ? getStockInDataByTabByFilter('') : getStockInDataByTab('');
                                    }}>
                                        <div className='statusTabtext'>Due Bills</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tabStockIn === 'Transactions' ? 'tabDebit' : 'productTab'}`} onClick={() => {
                                        setTabStockIn('Transactions'); setPage(0); filter ? getPaidBillByTebByFillter() : getPaidBillsByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Paid Bills</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tabStockIn === 'Monthly' ? 'tabCash' : 'productTab'}`} onClick={() => {
                                        setTabStockIn('Monthly'); setPage(0); getMonthlyPaidBillsByTab('cash'); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Monthly Transactions</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 pr-3  h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='gotBtn' onClick={handleOpen}>You &nbsp;Got</button>
                                </div>
                            </div>
                            <div className=' grid col-span-1 pr-3  h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='gaveBtn' onClick={handleOpen1}>You Gave</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='userTableSubContainer mt-6'>
                <div className='grid grid-cols-12 pt-6'>
                    {/* <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                        <button className='exportExcelBtn'
                            onClick={() => { tabStockIn !== 'transaction' && tabStockIn !== 'products' ? stockInExportExcel() : tabStockIn === 'products' ? allProductExportExcel() : transactionExportExcel() }}
                        ><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>
                    </div> */}
                </div>
                <div className='tableContainerWrapper'>
                    {
                        tabStockIn == 'Transactions' ?
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Invoice Number</TableCell>
                                            <TableCell>Given By</TableCell>
                                            <TableCell align="left">Received By</TableCell>
                                            <TableCell align="left">Pending Amount</TableCell>
                                            <TableCell align="left">Paid Amount</TableCell>
                                            <TableCell align="left">Comment</TableCell>
                                            <TableCell align="left">Date</TableCell>
                                            <TableCell align="left">Time</TableCell>
                                            <TableCell align="left"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stockInData?.map((row, index) => (
                                            totalRows !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.transactionId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    style={{ cursor: "pointer" }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell align="left" >{row.invoiceNumber}</TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.givenBy}
                                                    </TableCell>
                                                    <TableCell align="left" >{row.receivedBy}</TableCell>
                                                    <TableCell align="left" >{parseFloat(row.pendingAmount ? row.pendingAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell align="left" >{parseFloat(row.paidAmount ? row.paidAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                    <Tooltip title={row.transactionNote} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.transactionNote}</div></TableCell></Tooltip>
                                                    <TableCell align="left" >{row.displayDate}</TableCell>
                                                    <TableCell align="left" >{row.diplayTime}</TableCell>
                                                    <TableCell align="right">
                                                        <Menutemp transactionId={row.transactionId} getInvoice={getInvoice} data={row} deleteTransaction={handleDeleteTransaction} />
                                                    </TableCell>
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
                            :
                            tabStockIn === 'Monthly' ?
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Month</TableCell>
                                                <TableCell align="left">Due Ammount</TableCell>
                                                <TableCell align="left">Remaining Amount</TableCell>
                                                <TableCell align="left">Paid Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stockInData?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.supplierTransactionId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {row.date}
                                                        </TableCell>
                                                        <TableCell align="left" >{parseFloat(row.amount ? row.amount : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left" >{parseFloat(row.amt ? row.amt : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left" >{parseFloat((row.amount ? row.amount : 0) - (row.amt ? row.amt : 0)).toLocaleString('en-IN')}</TableCell>
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
                                </TableContainer> :
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Entered By</TableCell>
                                                <TableCell align="left">Due Amount</TableCell>
                                                <TableCell align="left">Note</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stockInData?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.dabId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row">
                                                                {row.enterBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{parseFloat(row.billAmount ? row.billAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                        {/* <TableCell align="left" >{row.dueNote}</TableCell> */}
                                                        <Tooltip title={row.dueNote} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.dueNote}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.displayDate}</TableCell>
                                                        <TableCell align="left" >{row.diplayTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuStockInOut stockInOutId={row.dabId} data={row} deleteStockInOut={handleDeleteStockIn} />
                                                        </TableCell>
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
                    }
                </div>
            </div>
            <Modal
                open={open0}
                onClose={handleClose0}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        <span className='makePaymentHeader'>You Got From </span><span className='makePaymentName'>{formData.givenBy}</span>
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 2) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            givenBy: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            givenBy: false
                                        }))
                                    }
                                }}
                                value={formData.givenBy}
                                error={formDataError.givenBy}
                                helperText={formDataError.givenBy ? 'Enter Sender Name' : ''}
                                name="givenBy"
                                id="outlined-required"
                                label="Given By"
                                onChange={onChange}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            paidAmount: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            paidAmount: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={onChange}
                                value={formData.paidAmount}
                                error={formDataError.paidAmount}
                                // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                // helperText={`Remaining Payment ${formData.remainingAmount}`}
                                name="paidAmount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                }}
                            />
                        </div>
                        <div className='col-span-4'>
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
                                    onChange={handlTransactionDate}
                                    name="transactionDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onChange={onChange}
                                value={formData.transactionNote}
                                name="transactionNote"
                                id="outlined-required"
                                label="Comment"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitPayment()
                            }}>Receive Payment</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleClose0();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={open1}
                onClose={handleClose1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleGave}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        <span className='makePaymentHeader'>You Give to </span><span className='makePaymentName'>{formDataDue.accountName}</span>
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setFormDataErrorDue((perv) => ({
                                            ...perv,
                                            billAmount: true
                                        }))
                                    }
                                    else {
                                        setFormDataErrorDue((perv) => ({
                                            ...perv,
                                            billAmount: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={onChangeDue}
                                value={formDataDue.billAmount}
                                error={formDataErrorDue.billAmount}
                                // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                // helperText={`Remaining Payment ${formData.remainingAmount}`}
                                name="billAmount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                }}
                            />
                        </div>
                        <div className='col-span-6'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Due Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={formDataErrorDue.dueDate}
                                    value={formDataDue.dueDate}
                                    onChange={handlDueDate}
                                    name="dueDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onChange={onChangeDue}
                                value={formDataDue.dueNote}
                                name="dueNote"
                                id="outlined-required"
                                label="Due Note"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitPaymentDue()
                            }}>Add Due</button>
                        </div>
                        <div className='col-span-6'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleClose1();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default DueAccountDetail;
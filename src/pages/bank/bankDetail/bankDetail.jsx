import './bankDetail.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
import CountCard from './countCard/countCard';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import TuneIcon from '@mui/icons-material/Tune';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CreditIcon from '@mui/icons-material/AddCircle';
import DebitIcon from '@mui/icons-material/RemoveCircle';
// import ProductQtyCountCard from '../productQtyCard/productQtyCard';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Table from '@mui/material/Table';
import Autocomplete from '@mui/material/Autocomplete';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import Menutemp from '../transactionTable/menu';
// import MenuStockInOut from './menu';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BankTransactionMenu from './bankTransactionMenu';
import { getDate } from 'date-fns';
import ExportMenu from '../exportMenu/exportMenu';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};


function BankDetail() {
    const regex = /^-?\d*(?:\.\d*)?$/;

    let { id } = useParams();
    const [tab, setTab] = React.useState(1);
    const [tabT, setTabT] = React.useState(1);
    const [statisticsCount, setStatisticsCounts] = useState();
    const [bankList, setBankList] = useState();
    const [subCategories, setSubCategories] = React.useState();
    const [expenseCategoryList, setExpenseCategoryList] = useState();
    const [filter, setFilter] = React.useState(false);
    const [filterNoDate, setFilterNoDate] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [categories, setCategories] = React.useState();
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [monthlyData, setMonthlyData] = useState([]);
    const [data, setData] = React.useState();
    const [isEdit, setIsEdit] = React.useState();
    const [bankDetails, setBankDetails] = React.useState();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openExpense, setOpenExpense] = React.useState(false);
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);
    const [openModal, setOpen] = React.useState(false);
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
    const textFieldRef = React.useRef(null);
    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const [source, setSource] = React.useState();
    const open = Boolean(anchorEl);
    const openFilter = Boolean(anchorElFilter);
    const ids = open ? 'simple-popover' : undefined;
    const filterId = openFilter ? 'simple-popover' : undefined;
    const [filterFormData, setFilterFormData] = React.useState({
        transactionType: "",
        bankId2: "",
        expenseId: ""
    });

    const [formData, setFormData] = useState({
        transactionAmount: 0,
        transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
    });
    const [formDataError, setFormDataError] = useState({
        transactionAmount: false,
        transactionDate: false,
    })
    const [formDataEditErrorFields, setFormDataEditErrorFields] = useState([
        "transactionAmount",
        "transactionDate",
    ])

    const [formDataExpense, setFormDataExpense] = useState({
        moneySourceId: '',
        sourceName: '',
        categoryId: '',
        subcategoryId: '',
        transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
        transactionAmount: '',
        comment: '',
    });
    const [formDataErrorExpense, setFormDataErrorExpense] = useState({
        source: false,
        categories: false,
        subCategory: false,
        transactionAmount: false,
        transactionDate: false
    })
    const [formDataErrorFieldsExpense, setFormDataErrorFieldsExpense] = useState([
        "source",
        "categories",
        "subCategory",
        "transactionAmount",
        "transactionDate",
    ])

    const submitAddExpense = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFieldsExpense.filter(element => {
                if (formDataErrorExpense[element] === true || formDataExpense[element] === '' || formDataExpense[element] === 0) {
                    setFormDataErrorExpense((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            if (isValidate.length > 0) {
                console.log('error fields', isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                // addBank()
                addExpense();
                // console.log('submit add funds')
            }
        }
    }
    const handleSubCategoryAutoComplete = (event, value) => {
        setFormDataExpense((prevState) => ({
            ...prevState,
            ['subCategory']: value,
            subcategoryId: value && value.subCategoryId ? value.subCategoryId : '',
        }))
        // if (value && value.subcategoryId ? true : false)
        //     getSubCategoryDDL(value.subcategoryId)
        // getSuppilerList(value && value.productId ? value.productId : '')
        // console.log('formddds', stockInFormData)
    }
    const getCategoryDDL = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/ddlMainCategoryData`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const editExpense = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateExpenseData`, formDataExpense, config)
            .then((res) => {
                setSuccess(true)
                setLoading(false);
                resetAddExpense();
                setPage(0);
                setRowsPerPage(5)
                filter ? getTransactionDataByDateFilter() : getTransactionData();
                filter ? getStatisticsByFilter() : getStatistics();
                setOpenExpense(false)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleSourceNameAutoComplete = (event, value) => {
        setFormDataExpense((prevState) => ({
            ...prevState,
            ['source']: value,
            moneySourceId: value && value.toId ? value.toId : '',
        }))
        // getSuppilerList(value && value.productId ? value.productId : '')
        // console.log('formddds', stockInFormData)
    }
    const submitEditExpense = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFieldsExpense.filter(element => {
                if (formDataErrorExpense[element] === true || formDataExpense[element] === '' || formDataExpense[element] === 0) {
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
                editExpense();
            }
        }
    }
    const addExpense = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/addExpenseData`, formDataExpense, config)
            .then((res) => {
                setSuccess(true)
                setLoading(false);
                resetAddExpense();
                setPage(0);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setFilter(false);
                setRowsPerPage(5);
                getTransactionData();
                getStatistics()
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleClickFilter = (event) => {
        setAnchorElFilter(event.currentTarget);
    };
    const handleCloseFilter = () => {
        setAnchorElFilter(null);
    };
    const handleTransactionDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["transactionDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleTransactionDateExpense = (date) => {
        setFormDataExpense((prevState) => ({
            ...prevState,
            ["transactionDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const onChangeExpense = (e) => {
        setFormDataExpense((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const resetFilter = () => {
        setFilterFormData({
            transactionType: "",
            bankId2: "",
            expenseId: ""
        })
    }
    const handleChangeFilter = (e) => {
        setFilterFormData((pervState) => ({
            ...pervState,
            [e.target.name]: e.target.value,
        }));
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseModal = () => {
        resetAddFund();
        setOpen(false)
    }
    const handleCloseModalExpense = () => {
        resetAddExpense();
        setOpenExpense(false)
    }
    const handleBankAutoComplete = (event, value) => {
        setFilterFormData((prevState) => ({
            ...prevState,
            ['bank']: value,
            bankId2: value && value.Id ? value.Id : '',
        }))
        // getSuppilerList(value && value.productId ? value.productId : '')
        // console.log('formddds', stockInFormData)
    }
    const handleExpenseAutoComplete = (event, value) => {
        setFilterFormData((prevState) => ({
            ...prevState,
            ['expenseCategory']: value,
            expenseId: value && value.categoryId ? value.categoryId : '',
        }))
        // getSuppilerList(value && value.productId ? value.productId : '')
        // console.log('formddds', stockInFormData)
    }
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'F5') {
                setOpenExpense(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setOpenExpense]);

    useEffect(() => {
        getTransactionData();
        getBankList(id);
        getExpenseCategoryList(id)
        getBankDetails(id);
        getStatistics(id);
        getCategoryDDL();
        getSourceDDL();
    }, [])
    const getTransactionDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankTransactionById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${rowPerPageNum}&bankId=${id}&expenseId=${filterFormData.expenseId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getTransactionDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankTransactionById?page=${pageNum}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${rowPerPageNum}&bankId=${id}&expenseId=${filterFormData.expenseId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getMonthlyTransactionDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getMonthWiseTransactionForBankById?page=${pageNum}&numPerPage=${rowPerPageNum}&bankId=${id}`, config)
            .then((res) => {
                setMonthlyData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (tabT == 2) {
            getMonthlyTransactionDataOnPageChange(newPage + 1, rowsPerPage)
        } else {
            if (filter) {
                getTransactionDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getTransactionDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tabT == 2) {
            getMonthlyTransactionDataOnPageChange(1, parseInt(event.target.value, 10))
        } else {
            if (filter) {
                getTransactionDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getTransactionDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };
    const getTransactionData = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankTransactionById?page=${page + 1}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${rowsPerPage}&bankId=${id}&expenseId=${filterFormData.expenseId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getMonthlyTransactionData = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getMonthWiseTransactionForBankById?page=${1}&numPerPage=${5}&bankId=${id}`, config)
            .then((res) => {
                setMonthlyData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getSubCategoryDDL = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/ddlSubCategoryData?categoryId=${id}`, config)
            .then((res) => {
                setSubCategories(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleCategoryAutoComplete = (event, value) => {
        setFormDataExpense((prevState) => ({
            ...prevState,
            ['category']: value,
            subcategoryId: '',
            subCategory: null,
            categoryId: value && value.categoryId ? value.categoryId : '',
        }));
        (value && value.categoryId) && getSubCategoryDDL(value.categoryId);
        // getSuppilerList(value && value.productId ? value.productId : '')
        // console.log('formddds', stockInFormData)
    }
    const getBankDetails = async (ids) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankDetailsById?bankId=${ids}`, config)
            .then((res) => {
                setBankDetails(res.data);
                setFormDataExpense((perv) => ({
                    ...perv,
                    sourceName: res.data.bankName,
                    moneySourceId: id
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStatistics = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankStaticsById?bankId=${id}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const excelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForBankTransactionById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${page + 1}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${rowsPerPage}&bankId=${id}&expenseId=${filterFormData.expenseId}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForBankTransactionById?page=${page + 1}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${rowsPerPage}&bankId=${id}&expenseId=${filterFormData.expenseId}`,
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
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForBankTransactionById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${page + 1}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${rowsPerPage}&bankId=${id}&expenseId=${filterFormData.expenseId}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForBankTransactionById?page=${page + 1}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${rowsPerPage}&bankId=${id}&expenseId=${filterFormData.expenseId}`,
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
    const getStatisticsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankStaticsById?bankId=${id}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getBankList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/ddlFilterBankData?bankId=${id}`, config)
            .then((res) => {
                setBankList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getExpenseCategoryList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/ddlMainCategoryData?bankId=${id}`, config)
            .then((res) => {
                setExpenseCategoryList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getTransactionDataByFilter = async () => {
        await axios.get(filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/getBankTransactionById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${5}&bankId=${id}&expenseId=${filterFormData.expenseId}` : `${BACKEND_BASE_URL}expenseAndBankrouter/getBankTransactionById?page=${1}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${5}&bankId=${id}&expenseId=${filterFormData.expenseId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getTransactionDataByFilterOnReset = async () => {
        await axios.get(filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/getBankTransactionById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&transactionType=${''}&bankId2=${''}&numPerPage=${5}&bankId=${id}&expenseId=${''}` : `${BACKEND_BASE_URL}expenseAndBankrouter/getBankTransactionById?page=${1}&transactionType=${''}&bankId2=${''}&numPerPage=${5}&bankId=${id}&expenseId=${''}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getTransactionDataByDateFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankTransactionById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${5}&bankId=${id}&expenseId=${filterFormData.expenseId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getTransactionDataByDateFilterOnReset = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBankTransactionById?page=${1}&transactionType=${filterFormData.transactionType}&bankId2=${filterFormData.bankId2}&numPerPage=${5}&bankId=${id}&expenseId=${filterFormData.expenseId}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async (ids) => {
        await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeTransactionData?transactionId=${ids}`, config)
            .then((res) => {
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                filter ? getStatisticsByFilter() : getStatistics()
                filter ? getTransactionDataByDateFilter() : getTransactionData();
                getTransactionData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteBank = (id) => {
        if (window.confirm("Are you sure you want to delete Bank Transaction?")) {
            deleteData(id);
        }
    }
    const handleDeleteExpense = async (id) => {
        if (window.confirm("Are you sure you want to delete Expense?")) {
            await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeExpenseData?transactionId=${id}`, config)
                .then((res) => {
                    setSuccess(true)
                    setPage(0);
                    setRowsPerPage(5);
                    filter ? getStatisticsByFilter() : getStatistics();
                    filter ? getTransactionDataByDateFilter() : getTransactionData();
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
    }
    const resetAddFund = () => {
        setFormData({
            transactionAmount: 0,
            comment: "",
            transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
        })
        setFormDataError({
            transactionAmount: false,
            transactionDate: false,
        })
    }
    const getSourceDDL = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/ddlToData`, config)
            .then((res) => {
                setSource(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const resetAddExpense = () => {
        getSourceDDL();
        setFormDataExpense({
            categoryId: '',
            moneySourceId: id,
            sourceName: bankDetails.bankName,
            subcategoryId: '',
            transactionAmount: '',
            comment: '',
            transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
        })
        setFormDataErrorExpense({
            moneySourceId: false,
            categoryId: false,
            subcategoryId: false,
            transactionAmount: false,
            transactionDate: false
        })
        setIsEdit(false)
    }
    const handleEditTransaction = (data) => {
        setFormDataError({
            transactionAmount: false,
            transactionDate: false,
        })
        setFormData({
            transactionId: data.transactionId,
            transactionAmount: data.amount,
            comment: data.comment,
            transactionDate: dayjs(data.transactionDate),
            fromId: data.fromId,
            toID: data.toId
        })
        setOpen(true);
    }
    const handleEditExpense = async (data) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/fillExpenseDataById?transactionId=${data.transactionId}`, config)
            .then((res) => {
                getSubCategoryDDL(res.data.mainCategory.categoryId);
                setFormDataErrorExpense({
                    moneySourceId: false,
                    categoryId: false,
                    subcategoryId: false,
                    transactionAmount: false,
                    transactionDate: false
                })
                setOpenExpense(true);
                setIsEdit(true);
                getSourceDDL();
                setFormDataExpense({
                    transactionId: data.transactionId,
                    moneySourceId: res.data && res.data.moneySource ? res.data.moneySource.toId : '',
                    categoryId: res.data && res.data.mainCategory ? res.data.mainCategory.categoryId : '',
                    subcategoryId: res.data && res.data.subCategory ? res.data.subCategory.subcategoryId : '',
                    source: res.data && res.data.moneySource ? res.data.moneySource : null,
                    category: res.data && res.data.mainCategory ? res.data.mainCategory : null,
                    subCategory: res.data && res.data.subCategory ? res.data.subCategory : null,
                    transactionAmount: res.data && res.data.mainCategory ? res.data.expenseAmount : null,
                    comment: res.data && res.data.mainCategory ? res.data.expenseComment : null,
                    transactionDate: dayjs(res.data && res.data.moneySource ? res.data.expenseDate : null),
                })
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const editFund = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateBankTransaction`, formData, config)
            .then((res) => {
                setSuccess(true)
                // filter ? getDataByFilter() : getData();
                // getData()
                setLoading(false);
                resetAddFund();
                setOpen(false);
                filter ? getTransactionDataByDateFilter() : getTransactionData(id);
                filter ? getStatisticsByFilter() : getStatistics();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submitEditFund = () => {
        if (loading || success) {

        } else {

            const isValidate = formDataEditErrorFields.filter(element => {
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
                editFund()
                // console.log('submit add funds')
            }
        }
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
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-5 mt-6 grid gap-2 bankDetailContainer'>
                    <div className='suppilerHeader'>
                        Bank Details
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Bank Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {bankDetails && bankDetails.bankName ? bankDetails.bankName : ''}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Bank Display Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {bankDetails && bankDetails.bankDisplayName ? bankDetails.bankDisplayName : ''}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Short Form :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {bankDetails && bankDetails.bankShortForm ? bankDetails.bankShortForm : ''}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Account Numebr :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {bankDetails && bankDetails.bankAccountNumber ? bankDetails.bankAccountNumber : ''}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            IFSC Code :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {bankDetails && bankDetails.ifscCode ? bankDetails.ifscCode : ''}
                        </div>
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
                                                        // getProductCount();
                                                        // getStatistics();
                                                        // setTabStockIn(''); 
                                                        setPage(0); setRowsPerPage(5);
                                                        getStatistics(id);
                                                        getTransactionDataByDateFilterOnReset();
                                                        // getStockInDataByTab('')
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
                                                                // setFilter(true); handleClose(); getStatisticsByFilter(); setTabStockIn(''); setPage(0); setRowsPerPage(5); getStockInDataByTabByFilter(''); getProductCountByFilter();
                                                                setFilter(true); handleClose(); setPage(0); setRowsPerPage(5); getTransactionDataByDateFilter(); getStatisticsByFilter();
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
                                <CountCard color={'black'} count={statisticsCount && statisticsCount.availableBalance ? statisticsCount.availableBalance : 0} desc={'Available Balance'} />
                            </div>

                            <div className='col-span-3'>
                                <CountCard color={'green'} count={statisticsCount && statisticsCount.creditAmt ? statisticsCount.creditAmt : 0} desc={'Credit Amount'} />
                            </div>
                        </div>
                        <div className='grid grid-cols-6 gap-6'>
                            <div className='col-span-3'>
                                <CountCard color={'pink'} count={statisticsCount && statisticsCount.expenseAmt ? statisticsCount.expenseAmt : 0} desc={'Expense Amount'} />
                            </div>

                            <div className='col-span-3'>
                                <CountCard color={'orange'} count={statisticsCount && statisticsCount.debitAmt ? statisticsCount.debitAmt : 0} desc={'Debit Amount'} />
                            </div>
                        </div>
                        {/* <div className='grid grid-cols-6 gap-6'>
                            <div className='col-span-3'>
                                <CountCard color={'green'} count={statisticsCount && statisticsCount.totalBusinessOfCash ? statisticsCount.totalBusinessOfCash : 0} desc={'Total Cash'} />
                            </div>
                            <div className='col-span-3'>
                                <CountCard color={'yellow'} count={statisticsCount && statisticsCount.totalProduct ? statisticsCount.totalProduct : 0} desc={'Total Product'} />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-12'>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tabT === 1 || tabT === '1' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTabT(1);
                                        getSourceDDL();
                                        // getDestinationDDL();
                                        getTransactionData();
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
                                        <div className='statusTabtext'>Transactions</div>
                                    </div>
                                    {bankDetails?.isViewMonthlyTransaction ?
                                        <div className={`flex col-span-3 justify-center ${tabT === 2 || tabT === '2' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                            setTabT(2);
                                            getSourceDDL();
                                            // getDestinationDDL();
                                            // getBankTransaction();
                                            getMonthlyTransactionData();
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
                                            <div className='statusTabtext'>Monthly Transaction</div>
                                        </div> : <></>
                                    }
                                    {(((state[0].startDate.toLocaleDateString() == state[0].endDate.toLocaleDateString()) && state[0].startDate.toLocaleDateString() == new Date().toLocaleDateString()) || (state[0].startDate.toLocaleDateString() == new Date().toLocaleDateString() && state[0].endDate > new Date()) || state[0].startDate > new Date()) && (statisticsCount && statisticsCount.futureDebitAmt > 0) ?
                                        <div className='flex justify-center col-span-6 futureDue col-start-4'>
                                            <div className='statusTabtext'>{`₹ ${parseFloat(statisticsCount && statisticsCount.availableBalance ? statisticsCount.availableBalance : 0).toLocaleString('en-IN')}`} - {`₹ ${parseFloat(statisticsCount && statisticsCount.futureDebitAmt ? statisticsCount.futureDebitAmt : 0).toLocaleString('en-IN')}`} = &nbsp;&nbsp;&nbsp;&nbsp; </div> <div className={statisticsCount && (statisticsCount.availableBalance - statisticsCount.futureDebitAmt) >= 0 ? 'futureDueTxtG' : 'futureDueTxt'}>
                                                {`₹ ${parseFloat(statisticsCount ? statisticsCount.availableBalance - statisticsCount.futureDebitAmt : 0).toLocaleString('en-IN')}`}
                                            </div>
                                        </div> : <></>
                                    }
                                    <div className='col-span-2 col-start-11 flex justify-end pr-4'>
                                        <button className='addExpense self-center'
                                            onClick={() => setOpenExpense(true)}
                                        >Add Expenses</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='userTableSubContainer mt-6'>
                <div className='grid grid-cols-12 pt-6'>
                    {tabT == 1 ?
                        <>
                            <div className='col-span-3 flex justify-end pr-4'>
                                <div className='dateRange text-center self-center' aria-describedby={ids} onClick={handleClickFilter}>
                                    &nbsp;&nbsp;<TuneIcon />&nbsp; Filters
                                </div>
                                <Popper id={filterId} open={openFilter} style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }} placement={'bottom-end'} anchorEl={anchorElFilter}>
                                    <Box sx={{ bgcolor: 'background.paper', width: '700px', height: '180px', borderRadius: '10px' }}>
                                        <div className='filterWrp grid gap-6'>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className='col-span-4'>
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            defaultValue={null}
                                                            id='bank'
                                                            disablePortal
                                                            sx={{ width: '100%' }}
                                                            disabled={filterFormData.expenseCategory ? true : false}
                                                            value={filterFormData.bank ? filterFormData.bank : null}
                                                            onChange={handleBankAutoComplete}
                                                            options={bankList ? bankList : []}
                                                            getOptionLabel={(options) => options.Name}
                                                            renderInput={(params) => <TextField
                                                                {...params}
                                                                label="Bank" />}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <div className='col-span-4'>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label" disabled={filterFormData.expenseCategory ? true : false}>Credit/Debit</InputLabel>
                                                        <Select
                                                            labelId="Search"
                                                            id="Search"
                                                            name='transactionType'
                                                            value={filterFormData.transactionType}
                                                            label="Credit/Debit"
                                                            disabled={filterFormData.expenseCategory ? true : false}
                                                            onChange={handleChangeFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            <MenuItem value={''}>Clear</MenuItem>
                                                            <MenuItem value={'Debit'}>Debit</MenuItem>
                                                            <MenuItem value={'Credit'}>Credit</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className='col-span-4'>
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            defaultValue={null}
                                                            id='source'
                                                            disablePortal
                                                            sx={{ width: '100%' }}
                                                            disabled={filterFormData.bank || filterFormData.transactionType ? true : false}
                                                            value={filterFormData.expenseCategory ? filterFormData.expenseCategory : null}
                                                            onChange={handleExpenseAutoComplete}
                                                            options={expenseCategoryList ? expenseCategoryList : []}
                                                            getOptionLabel={(options) => options.categoryName}
                                                            renderInput={(params) => <TextField
                                                                {...params}
                                                                label="Expense Category" />}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className='col-span-4'>
                                                    <button className='btn-reset' onClick={() => resetFilter()}>
                                                        Reset All
                                                    </button>
                                                </div>
                                                <div className='col-span-4'>
                                                    <button className='btn-apply' onClick={() => { handleCloseFilter(); setFilterNoDate(true); setPage(0); setRowsPerPage(5); getTransactionDataByFilter(); }}>
                                                        Apply
                                                    </button>
                                                </div>
                                                <div className='col-span-4'>
                                                    <button className='btn-cancle' onClick={() => { handleCloseFilter(); resetFilter() }}>
                                                        Cancle
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </Popper>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button
                                        className={`${!filterNoDate ? 'reSetBtn' : 'reSetBtnActive'}`}
                                        onClick={() => {
                                            resetFilter()
                                            setFilterNoDate(false);
                                            getTransactionDataByFilterOnReset();
                                            setPage(0); setRowsPerPage(5);
                                        }}><CloseIcon /></button>
                                </div>
                            </div>
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                <ExportMenu exportExcel={excelExport} exportPdf={pdfExport} />
                            </div>
                        </> : <></>
                    }
                </div>
                <div className='tableContainerWrapper'>
                    {tabT == 1 ?
                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                            <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Entered By</TableCell>
                                        <TableCell align="left">Source</TableCell>
                                        <TableCell align="left">Destination</TableCell>
                                        <TableCell align="center">Amount</TableCell>
                                        <TableCell align="left">Comment</TableCell>
                                        <TableCell align="left">Date</TableCell>
                                        <TableCell align="left">Time</TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left">Balance</TableCell>
                                        <TableCell align="left"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.map((row, index) => (
                                        totalRows !== 0 ?
                                            <TableRow
                                                hover
                                                key={row.stockInId}
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
                                                <TableCell align="left" >{row.fromId}</TableCell>
                                                <TableCell align="left" >{row.toId}</TableCell>
                                                <TableCell align="center" className={row.transactionType == 'CREDIT' ? 'greenText' : 'redText'} >₹ {parseFloat(row.amount ? row.amount : 0).toLocaleString('en-IN')}</TableCell>
                                                <Tooltip title={row.comment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.comment}</div></TableCell></Tooltip>
                                                <TableCell align="left" >{row.displayTransactionDate}</TableCell>
                                                <TableCell align="left" >{row.displayTransactionDateTime}</TableCell>
                                                <Tooltip title={row.transactionType} placement="top-start" arrow>
                                                    <TableCell align="left" >{row.transactionType == 'CREDIT' ? <CreditIcon sx={{ color: 'green' }} /> : <DebitIcon sx={{ color: 'red' }} />}</TableCell>
                                                </Tooltip>
                                                <TableCell align="left"  >₹ {parseFloat(row.balance ? row.balance : 0).toLocaleString('en-IN')}</TableCell>
                                                {/* {row.transactionType} */}
                                                <TableCell align="right">
                                                    <BankTransactionMenu data={row} handleEditExpense={handleEditExpense} handleDeleteBank={handleDeleteBank} handleEditTransaction={handleEditTransaction} handleDeleteExpense={handleDeleteExpense} />
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
                        </TableContainer> :
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
                                    {monthlyData?.map((row, index) => (
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
                        </TableContainer>
                    }
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
                        Edit Bank
                    </Typography>
                    <div className='grid grid-rows-2 mt-4 gap-6'>
                        <div className='grid grid-cols-12 gap-6'>
                            <div className="col-span-3">
                                <TextField
                                    value={formData.fromId}
                                    disabled
                                    name="transactionAmount"
                                    id="outlined-required"
                                    label="Source"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                            <div className="col-span-3">
                                <TextField
                                    value={formData.toID}
                                    disabled
                                    name="transactionAmount"
                                    id="outlined-required"
                                    label="Destination"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
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
                                    onChange={onChange}
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
                                        <button onClick={() => submitEditFund()} className='saveBtn' >Save</button>
                                    </div>
                                    <div className='col-span-6'>
                                        <button onClick={() => { handleCloseModal(); }} className='resetBtn'>Cancle</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openExpense}
                onClose={handleCloseModalExpense}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {isEdit ? 'Edit Expense' : 'Add Expense'}
                        </Typography>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {isEdit ? '' : `Available Balance : ₹ ${parseFloat(statisticsCount && statisticsCount.availableBalance ? statisticsCount.availableBalance : 0).toLocaleString('en-IN')}`}
                        </Typography>
                    </div>
                    <div className='grid grid-rows-2 mt-4 gap-6'>
                        <div className='grid grid-cols-12 gap-6'>
                            <div className="col-span-3">
                                {isEdit ?
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            defaultValue={null}
                                            id='source'
                                            disablePortal
                                            sx={{ width: '100%' }}
                                            // disabled={isEdit}
                                            value={formDataExpense.source ? formDataExpense.source : null}
                                            onChange={handleSourceNameAutoComplete}
                                            options={source ? source : []}
                                            getOptionLabel={(options) => options.toName}
                                            renderInput={(params) => <TextField
                                                {...params}
                                                error={formDataErrorExpense.source}
                                                helperText={formDataErrorExpense.source ? "Please Select" : formDataExpense.source ? `Availabel Balance is ${formDataExpense.source ? formDataExpense.source.availableBalance : 0}` : ''}
                                                label="Money Source" />}
                                        />
                                    </FormControl>
                                    : <TextField
                                        label="Product Name"
                                        fullWidth
                                        disabled
                                        value={formDataExpense.sourceName ? formDataExpense.sourceName : ''}
                                        name="productName"
                                    />}
                            </div>
                            <div className="col-span-3">
                                <FormControl fullWidth>
                                    <Autocomplete
                                        defaultValue={null}
                                        id='category'
                                        disablePortal
                                        sx={{ width: '100%' }}
                                        // disabled={isEdit}
                                        value={formDataExpense.category ? formDataExpense.category : null}
                                        onChange={handleCategoryAutoComplete}
                                        options={categories ? categories : []}
                                        getOptionLabel={(options) => options.categoryName}
                                        renderInput={(params) => <TextField inputRef={textFieldRef}
                                            {...params}
                                            error={formDataErrorExpense.categories}
                                            helperText={formDataErrorExpense.categories ? "Please Select" : ''}
                                            label="Category" />}
                                    />
                                </FormControl>
                            </div>
                            <div className="col-span-3">
                                <FormControl fullWidth>
                                    <Autocomplete
                                        defaultValue={null}
                                        id='subCategory'
                                        disablePortal
                                        sx={{ width: '100%' }}
                                        disabled={!formDataExpense.category}
                                        value={formDataExpense.subCategory ? formDataExpense.subCategory : null}
                                        onChange={handleSubCategoryAutoComplete}
                                        options={subCategories ? subCategories : []}
                                        getOptionLabel={(options) => options.subCategoryName}
                                        renderInput={(params) => <TextField {...params}
                                            error={formDataErrorExpense.subCategory}
                                            helperText={formDataErrorExpense.subCategory ? "Please Select" : ''}
                                            label="Sub Category" />}
                                    />
                                </FormControl>
                            </div>
                            <div className="col-span-3">
                                <TextField
                                    onBlur={(e) => {
                                        if (!e.target.value || e.target.value < 1) {
                                            setFormDataErrorExpense((perv) => ({
                                                ...perv,
                                                transactionAmount: true
                                            }))
                                        }
                                        else {
                                            setFormDataErrorExpense((perv) => ({
                                                ...perv,
                                                transactionAmount: false
                                            }))
                                        }
                                    }}
                                    error={formDataErrorExpense.transactionAmount}
                                    helperText={formDataErrorExpense.transactionAmount ? "Please Enter Amount" : ''}
                                    onChange={(e) => {
                                        if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                            onChangeExpense(e)
                                        }
                                    }}
                                    value={formDataExpense.transactionAmount}
                                    name="transactionAmount"
                                    id="outlined-required"
                                    label="Amount"
                                    InputProps={{ style: { fontSize: 14 } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-12 gap-6'>
                            <div className="col-span-3">
                                <TextField
                                    onChange={onChangeExpense}
                                    value={formDataExpense.comment}
                                    name="comment"
                                    id="outlined-required"
                                    label="Comment"
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
                                        error={formDataErrorExpense.transactionDate}
                                        value={formDataExpense.transactionDate}
                                        onChange={handleTransactionDateExpense}
                                        name="transactionDate"
                                        slotProps={{ textField: { fullWidth: true } }}
                                        renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="col-span-6">
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className='col-span-6'>
                                        <button onClick={() => { isEdit ? submitEditExpense() : submitAddExpense() }} className='saveBtn' >Save</button>
                                    </div>
                                    <div className='col-span-6'>
                                        <button onClick={() => { handleCloseModalExpense() }} className='resetBtn'>Cancle</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default BankDetail
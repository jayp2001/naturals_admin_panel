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
import CategoryCard from "../categoryCard/categoryCard";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BankMenu from '../../bank/dashboard/menu/menuBank';
import dayjs from 'dayjs';
import ExpenseMenu from "./menu/menuExpense";
import ExportMenu from '../exportMenu/exportMenu';
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
function ExpenseDashboard() {
    const regex = /^-?\d*(?:\.\d*)?$/;
    const emailRegx = /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [expanded, setExpanded] = React.useState(false);
    const textFieldRef = useRef(null);
    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const [editCateory, setEditCategory] = React.useState({
        categoryName: '',
        categoryIconName: '',
        categoryId: ''
    })
    const [categoryError, setCategoryError] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [rights, setRights] = useState();
    const [isEdit, setIsEdit] = React.useState(false);
    const [incomeSourceFilter, setIncomeSourceFilter] = React.useState('');
    const [formData, setFormData] = useState({
        moneySourceId: '',
        categoryId: '',
        subcategoryId: '',
        transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
        transactionAmount: '',
        comment: '',
    });
    const [data, setData] = React.useState();
    const [dashboardCategory, setDashboardCategory] = React.useState();
    const [expenseData, setExpenseData] = React.useState();
    const [totalRowsExpense, setTotalRowsExpense] = React.useState();
    const [formDataError, setFormDataError] = useState({
        source: false,
        categories: false,
        subCategory: false,
        transactionAmount: false,
        transactionDate: false
    })
    const [formDataErrorFields, setFormDataErrorFields] = useState([
        "source",
        "categories",
        "subCategory",
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
    const [fields, setFields] = useState([
        'userFirstName',
        'userLastName',
        'userGender',
        'userName',
        'password',
        'emailId',
        'userRights',
    ])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [filter, setFilter] = React.useState(false);
    const id = open ? 'simple-popover' : undefined;
    const [sourceList, setSourceList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [source, setSource] = React.useState();
    const [subCategories, setSubCategories] = React.useState();
    const [tab, setTab] = React.useState(1);
    const [openModal, setOpen] = React.useState(false);
    const [category, setCategory] = React.useState('');
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
        getCategoryDDL();
        getSourceDDL();
        getMainCategoies();
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
    const resetAddExpense = () => {
        getSourceDDL();
        setFormData({
            moneySourceId: '',
            categoryId: '',
            subcategoryId: '',
            transactionAmount: '',
            comment: '',
            transactionDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
        })
        setFormDataError({
            moneySourceId: false,
            categoryId: false,
            subcategoryId: false,
            transactionAmount: false,
            transactionDate: false
        })
        setIsEdit(false)
    }
    const handleOpen = () => setOpen(true);
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const navigateToDetail = (name, id) => {
        navigate(`/expense/mainCategory/${name}/${id}`);
    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete Category?")) {
            deleteData(id);
        }
    }
    const handleDeleteExpense = (id) => {
        if (window.confirm("Are you sure you want to delete Expense?")) {
            deleteExpenseData(id);
        }
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeMainCategory?mainCategoryId=${id}`, config)
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
    const deleteExpenseData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeExpenseData?transactionId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                getExpenseData();
                getSourceDDL();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleEdit = (id, name, icon) => {
        setCategoryError(false);
        setIsEdit(true);
        setEditCategory((perv) => ({
            ...perv,
            mainCategoryId: id,
            categoryName: name,
            categoryIconName: icon
        }))
        setOpen(true)
    }
    const handleEditExpense = async (data) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/fillExpenseDataById?transactionId=${data.transactionId}`, config)
            .then((res) => {
                getSubCategoryDDL(res.data.mainCategory.categoryId);
                setFormDataError({
                    moneySourceId: false,
                    categoryId: false,
                    subcategoryId: false,
                    transactionAmount: false,
                    transactionDate: false
                })
                setIsEdit(true);
                getSourceDDL();
                setExpanded(true);
                setFormData({
                    transactionId: data.transactionId,
                    moneySourceId: res.data && res.data.moneySource ? res.data.moneySource.toId : '',
                    categoryId: res.data && res.data.mainCategory ? res.data.mainCategory.categoryId : '',
                    subcategoryId: res.data && res.data.subCategory ? res.data.subCategory.subcategoryId : '',
                    source: res.data && res.data.moneySource ? res.data.moneySource : null,
                    category: res.data && res.data.mainCategory ? res.data.mainCategory : null,
                    subCategory: res.data && res.data.subCategory ? res.data.subCategory : null,
                    transactionAmount: data.expenseAmount,
                    comment: data.expenseComment,
                    transactionDate: dayjs(data.dateExpense)
                })
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })

    }
    const getData = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getMainCategoryList?page=${page + 1}&numPerPage=${rowsPerPage}&moneySourceId=${incomeSourceFilter}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnIncome = async (id) => {
        await axios.get(filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/getMainCategoryList?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&moneySourceId=${id}` : `${BACKEND_BASE_URL}expenseAndBankrouter/getMainCategoryList?page=${page + 1}&numPerPage=${rowsPerPage}&moneySourceId=${id}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getMainCategoies = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getMainCategoryDashboard`, config)
            .then((res) => {
                setDashboardCategory(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getMainCategoiesByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getMainCategoryDashboard?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setDashboardCategory(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getMainCategoryList?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&moneySourceId=${incomeSourceFilter}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getExpenseDataOnTab = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getExpenseTransactionData?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setExpenseData(res.data.rows);
                setTotalRowsExpense(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getExpenseData = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getExpenseTransactionData?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setExpenseData(res.data.rows);
                setTotalRowsExpense(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getExpenseDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getExpenseTransactionData?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setExpenseData(res.data.rows);
                setTotalRowsExpense(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getExpenseDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getExpenseTransactionData?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setExpenseData(res.data.rows);
                setTotalRowsExpense(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getExpenseDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getExpenseTransactionData?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setExpenseData(res.data.rows);
                setTotalRowsExpense(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleCloseModal = () => {
        // setOpen(false);
        // setCategory('');
        // setCategoryError(false);
        // setEditCategory({
        //     categoryName: '',
        //     categoryId: ''
        // });
        // setIsEdit(false);
        setOpen(false)
    }
    const excelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelSheetForExpenseData?startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelSheetForExpenseData`,
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
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForExpenseData?startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForExpenseData`,
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
    const excelExportCategory = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForMainCategoryData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&moneySourceId=${incomeSourceFilter}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForMainCategoryData?moneySourceId=${incomeSourceFilter}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'MainCategory_List_' + new Date().toLocaleDateString() + '.xlsx'
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
    const pdfExportCategory = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForMainCategoryData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&moneySourceId=${incomeSourceFilter}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForMainCategoryData?moneySourceId=${incomeSourceFilter}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'MainCategory_List_' + new Date().toLocaleDateString() + '.pdf'
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
    const handleExpenseDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["expenseDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleSourceNameAutoComplete = (event, value) => {
        console.log('source>>', value)
        setFormData((prevState) => ({
            ...prevState,
            ['source']: value,
            moneySourceId: value && value.toId ? value.toId : '',
        }))
        // getSuppilerList(value && value.productId ? value.productId : '')
        // console.log('formddds', stockInFormData)
    }
    const handleCategoryAutoComplete = (event, value) => {
        setFormData((prevState) => ({
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
    const handleSubCategoryAutoComplete = (event, value) => {
        setFormData((prevState) => ({
            ...prevState,
            ['subCategory']: value,
            subcategoryId: value && value.subCategoryId ? value.subCategoryId : '',
        }))
        // if (value && value.subcategoryId ? true : false)
        //     getSubCategoryDDL(value.subcategoryId)
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
    const handleTransactionDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["transactionDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getMainCategoryList?page=${pageNum}&numPerPage=${rowPerPageNum}&moneySourceId=${incomeSourceFilter}`, config)
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
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getMainCategoryList?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}&moneySourceId=${incomeSourceFilter}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (tab === 2 || tab === '2') {
            if (filter) {
                getExpenseDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getExpenseDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else {
            if (filter) {
                getDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }


    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === 2 || tab === '2') {
            if (filter) {
                getExpenseDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getExpenseDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else {
            if (filter) {
                getDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }


    };
    const editCategory = async () => {
        if (loading || success) {
        } else {
            if (editCateory.categoryName.length < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateMainCategory`, editCateory, config)
                    .then((res) => {
                        setLoading(false);
                        setSuccess(true)
                        getData();
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
    const addExpense = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/addExpenseData`, formData, config)
            .then((res) => {
                setSuccess(true)
                setLoading(false);
                resetAddExpense();
                setPage(0);
                setRowsPerPage(5)
                getExpenseData();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editExpense = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateExpenseData`, formData, config)
            .then((res) => {
                setSuccess(true)
                setLoading(false);
                resetAddExpense();
                setPage(0);
                setRowsPerPage(5)
                getExpenseData();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submitAddExpense = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFields.filter(element => {
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
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                // addBank()
                addExpense();
                // console.log('submit add funds')
            }
        }
    }
    const submitEditExpense = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFields.filter(element => {
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
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                // addBank()
                editExpense();
                // console.log('submit add funds')
            }
        }
    }
    const handleReset = () => {
        setCategory('');
        setCategoryError(false);
        setEditCategory({
            categoryName: '',
            categoryIconName: '',
            categoryId: ''
        });
        setIsEdit(false);
    }
    const addCategory = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/addMainCategory`, category, config)
            .then((res) => {
                setSuccess(true)
                getData();
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
    const submit = () => {
        if (loading || success) {

        } else {
            if (category.length < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            } else {
                addCategory()
            }
        }
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
    const getCategoryDDL = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/ddlMainCategoryData`, config)
            .then((res) => {
                setCategories(res.data);
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
    const goToProductList = () => {
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
                                            filter ? getMainCategoiesByFilter() : getMainCategoies();
                                        }}>
                                            <div className='statusTabtext'>Dashboard</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                            setTab(2);
                                            getExpenseDataOnTab();
                                            setPage(0);
                                            setRowsPerPage(5);
                                            setFilter(false);
                                            setState([
                                                {
                                                    startDate: new Date(),
                                                    endDate: new Date(),
                                                    key: 'selection'
                                                }
                                            ])
                                        }}>
                                            <div className='statusTabtext'>Add Expenses</div>
                                        </div>
                                        <div className={`flex col-span-3 justify-center ${tab === 4 || tab === '4' ? 'products' : 'productTab'}`} onClick={() => {
                                            setTab(4); setState([
                                                {
                                                    startDate: new Date(),
                                                    endDate: new Date(),
                                                    key: 'selection'
                                                }
                                            ]); setPage(0); setFilter(false); setRowsPerPage(5); getData();
                                        }}>
                                            <div className='statusTabtext'>Category Table</div>
                                        </div>
                                    </div>
                                </div>
                                {(tab === 1 || tab === '1') &&
                                    <div className='col-span-4 col-start-9 flex justify-end pr-4'>
                                        <div className='dateRange text-center self-center' aria-describedby={id} onClick={handleClick}>
                                            <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                        </div>
                                        <div className='resetBtnWrap col-span-3 self-center'>
                                            <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                setFilter(false);
                                                getMainCategoies();
                                                setState([
                                                    {
                                                        startDate: new Date(),
                                                        endDate: new Date(),
                                                        key: 'selection'
                                                    }
                                                ])
                                            }}><CloseIcon /></button>
                                        </div>

                                        <Popover
                                            id={id}
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
                                                            getMainCategoiesByFilter();
                                                            setFilter(true); handleClose()
                                                        }}>Apply</button>
                                                    </div>
                                                    <div className='col-span-3'>
                                                        <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                    </div>
                                                </div>
                                            </Box>
                                        </Popover>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                (tab === 1 || tab === '1') &&
                <div className="cardWrp">
                    <div className="grid lg:grid-cols-3 mobile:grid-cols-1 tablet1:grid-cols-2 tablet:grid-cols-2 cardTablet:grid-cols-3 laptop:grid-cols-3 laptopDesk:grid-cols-4 desktop1:grid-cols-4 desktop2:grid-cols-5 desktop2:grid-cols-5 gap-6">
                        {dashboardCategory ? dashboardCategory.map((data, index) => (
                            <CategoryCard goToAddUSer={navigateToDetail} data={data} filter={filter} expense={data.expenseAmt} name={data.categoryName} imgName={data.categoryIconName} />
                        )) : null}
                        {/* <CategoryCard goToAddUSer={goToProductList} name={"Home"} imgName={'img11'} />
                        <CategoryCard goToAddUSer={goToStaff} name={"Restaurant"} imgName={'img11'} />
                        <CategoryCard goToAddUSer={goToProductList} name={"Other"} imgName={'img11'} />
                        <CategoryCard goToAddUSer={goToStaff} name={"Debit"} imgName={'img11'} /> */}
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
                                onClick={() => { setExpanded(!expanded); resetAddExpense(); }}
                            >
                                <div className='stockAccordinHeader'>{isEdit ? 'Edit Expenses' : 'Add Expenses'}</div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className="stockInOutContainer">
                                    <div className=''>
                                        <div className='grid grid-rows-2 gap-6'>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className="col-span-3">
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            defaultValue={null}
                                                            id='source'
                                                            disablePortal
                                                            sx={{ width: '100%' }}
                                                            // disabled={isEdit}
                                                            value={formData.source ? formData.source : null}
                                                            onChange={handleSourceNameAutoComplete}
                                                            options={source ? source : []}
                                                            getOptionLabel={(options) => options.toName}
                                                            renderInput={(params) => <TextField inputRef={textFieldRef}
                                                                {...params}
                                                                error={formDataError.source}
                                                                helperText={formDataError.source ? "Please Select" : formData.source ? `Availabel Balance is ${formData.source ? formData.source.availableBalance : 0}` : ''}
                                                                label="Money Source" />}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <div className="col-span-3">
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            defaultValue={null}
                                                            id='category'
                                                            disablePortal
                                                            sx={{ width: '100%' }}
                                                            // disabled={isEdit}
                                                            value={formData.category ? formData.category : null}
                                                            onChange={handleCategoryAutoComplete}
                                                            options={categories ? categories : []}
                                                            getOptionLabel={(options) => options.categoryName}
                                                            renderInput={(params) => <TextField {...params}
                                                                error={formDataError.categories}
                                                                helperText={formDataError.categories ? "Please Select" : ''}
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
                                                            disabled={!formData.category}
                                                            value={formData.subCategory ? formData.subCategory : null}
                                                            onChange={handleSubCategoryAutoComplete}
                                                            options={subCategories ? subCategories : []}
                                                            getOptionLabel={(options) => options.subCategoryName}
                                                            renderInput={(params) => <TextField {...params}
                                                                error={formDataError.subCategory}
                                                                helperText={formDataError.subCategory ? "Please Select" : ''}
                                                                label="Sub Category" />}
                                                        />
                                                    </FormControl>
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
                                            </div>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className="col-span-3">
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
                                                <div className="col-span-6">
                                                    <div className='grid grid-cols-12 gap-6'>
                                                        <div className='col-span-6'>
                                                            <button onClick={() => { isEdit ? submitEditExpense() : submitAddExpense() }} className='saveBtn' >Save</button>
                                                        </div>
                                                        <div className='col-span-6'>
                                                            <button onClick={() => { resetAddExpense(); isEdit ? setExpanded(false) : resetAddExpense(); }} className='resetBtn'>{isEdit ? "Cancle" : "Reset"}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                                        setPage(0);
                                                        setRowsPerPage(5)
                                                        getExpenseDataOnTab()
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
                                                                getExpenseDataByFilter(); setFilter(true); setPage(0); setRowsPerPage(5); handleClose()
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
                                        <div className='col-start-9 col-span-2  pr-5 flex justify-end'>
                                            {/* <button className='exportExcelBtn' onClick={() => { }
                                            }><FileDownloadIcon />&nbsp;&nbsp;Product Wise</button> */}
                                        </div>
                                        <div className='col-span-2 pr-5 flex justify-end'>
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
                                                        <TableCell>Category</TableCell>
                                                        <TableCell>Sub-Category</TableCell>
                                                        <TableCell>Amount</TableCell>
                                                        <TableCell align="left">Comment</TableCell>
                                                        {/* <TableCell align="right">Percentage</TableCell> */}
                                                        <TableCell align="left">Date</TableCell>
                                                        <TableCell align="left">Time</TableCell>
                                                        <TableCell ></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {expenseData?.map((row, index) => (
                                                        totalRowsExpense !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.transactionId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <Tooltip title={row.userName}>
                                                                    <TableCell component="th" scope="row" >
                                                                        {row.enterBy}
                                                                    </TableCell>
                                                                </Tooltip>
                                                                <TableCell align="left" >{row.moneySource}</TableCell>
                                                                <TableCell align="left" >{row.mainCategory}</TableCell>
                                                                <TableCell align="left" >{row.subCategory}</TableCell>
                                                                <TableCell align="left" >{parseFloat(row.expenseAmount).toLocaleString('en-IN')}</TableCell>
                                                                {/* <TableCell align="right" onClick={() => navigateToDetail(row.bankName, row.bankId)}>{parseFloat(row.outPrice ? row.outPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                                <TableCell align="left" >{row.expenseComment}</TableCell>
                                                                <TableCell align="left" >{row.expenseDate}</TableCell>
                                                                <TableCell align="left" >{row.expenseTime}</TableCell>
                                                                {/* <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.bankId, row.bankName, row.bankIconName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.bankId)}>Delete</button></div></TableCell> */}
                                                                <TableCell align="left" ><ExpenseMenu data={row} handleDelete={handleDeleteExpense} handleEdit={handleEditExpense} setError={setError} /></TableCell>
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
                                                count={totalRowsExpense}
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
                                <div className='ml-4 col-span-6 mt-2' >
                                    <div className='flex'>
                                        <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                            <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                        </div>
                                        <div className='resetBtnWrap col-span-3'>
                                            <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                setFilter(false);
                                                getData();
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
                                                    <button className='stockInBtn' onClick={() => { getDataByFilter(); setFilter(true); setPage(0); setRowsPerPage(5); handleClose() }
                                                    }>Apply</button>
                                                </div>
                                                <div className='col-span-3'>
                                                    <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                </div>
                                            </div>
                                        </Box>
                                    </Popover>
                                </div>
                                <div className=' col-span-2  pr-5 flex justify-end'>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Income Source</InputLabel>
                                        <Select
                                            id="Seah"
                                            name='incomeSourceFilter'
                                            value={incomeSourceFilter}
                                            label="Income Source"
                                            onChange={(e) => { setIncomeSourceFilter(e.target.value); setPage(0); setRowsPerPage(5); getDataOnIncome(e.target.value) }}
                                            MenuProps={{
                                                style: { zIndex: 35001 }
                                            }}
                                        >
                                            <MenuItem value={''}>Clear</MenuItem>
                                            {
                                                source?.map((data, index) => (
                                                    <MenuItem value={data.toId} key={data.toId}>{data.toName}</MenuItem>
                                                ))
                                            }
                                            {/* <MenuItem value={'Debit'}>Debit</MenuItem>
                                                <MenuItem value={'Credit'}>Credit</MenuItem> */}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='col-span-2 col-start-9 pr-5 mt-2 flex justify-end'>
                                    <ExportMenu exportExcel={excelExportCategory} exportPdf={pdfExportCategory} />
                                </div>
                                <div className='col-span-2 col-start-11 mt-2 mr-6'>
                                    <div className='flex justify-end'>
                                        <button className='addCategoryBtn' onClick={handleOpen}>Add Category</button>
                                    </div>
                                </div>
                            </div>
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Category Name</TableCell>
                                                <TableCell align="left">Icon Name</TableCell>
                                                <TableCell align="right">Expense Amount</TableCell>
                                                <TableCell align="right">Percentage</TableCell>
                                                <TableCell align="right"></TableCell>
                                                {/* <TableCell align="right"></TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data?.map((row, index) => (
                                                totalRows !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.categoryId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row" onClick={() => navigateToDetail(row.categoryName, row.categoryId)}>
                                                            {row.categoryName}
                                                        </TableCell>
                                                        {/* <TableCell align="right" onClick={() => navigateToDetail(row.categoryName, row.categoryId)}>{parseFloat(row.outPrice ? row.outPrice : 0).toLocaleString('en-IN')}</TableCell> */}
                                                        <TableCell align="left" onClick={() => navigateToDetail(row.categoryName, row.categoryId)} >{row.categoryIconName}</TableCell>
                                                        <TableCell align="right" scope="row" onClick={() => navigateToDetail(row.categoryName, row.categoryId)}>
                                                            {parseFloat(row.expenseAmt ? row.expenseAmt : 0).toLocaleString('en-IN')}
                                                        </TableCell>
                                                        <TableCell align="right" scope="row" onClick={() => navigateToDetail(row.categoryName, row.categoryId)}>
                                                            {row.categoryPercentage}
                                                        </TableCell>
                                                        <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.categoryId, row.categoryName, row.categoryIconName)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.categoryId)}>Delete</button></div></TableCell>
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
                                {isEdit ? 'Edit Category' : 'Add Category'}
                            </Typography>
                            <div className='mt-6 grid grid-cols-12 gap-6'>
                                <div className='col-span-4'>
                                    <TextField
                                        onBlur={(e) => {
                                            if (e.target.value.length < 2) {
                                                setCategoryError((perv) => ({
                                                    ...perv,
                                                    categoryName: true
                                                }));
                                            }
                                            else {
                                                setCategoryError((perv) => ({
                                                    ...perv,
                                                    categoryName: false
                                                }))
                                            }
                                        }}
                                        onChange={(e) => {
                                            isEdit ? setEditCategory((perv) => ({
                                                ...perv,
                                                categoryName: e.target.value
                                            })) : setCategory((perv) => ({
                                                ...perv,
                                                categoryName: e.target.value
                                            }))
                                        }}
                                        value={isEdit ? editCateory.categoryName ? editCateory.categoryName : '' : category.categoryName ? category.categoryName : ''}
                                        error={categoryError.categoryName ? true : false}
                                        inputRef={textFieldRef}
                                        helperText={categoryError.categoryName ? "Please Enter Category" : ''}
                                        name="category"
                                        id="outlined-required"
                                        label="Category"
                                        InputProps={{ style: { fontSize: 17 } }}
                                        InputLabelProps={{ style: { fontSize: 17 } }}
                                        fullWidth
                                    />
                                </div>
                                <div className="col-span-4">
                                    <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                        <InputLabel id="demo-simple-select-label" error={setCategoryError.categoryIconName}>Icon Name</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={isEdit ? editCateory.categoryIconName ? editCateory.categoryIconName : '' : category.categoryIconName ? category.categoryIconName : ''}
                                            error={categoryError.categoryIconName ? true : false}
                                            name="stockInPaymentMethod"
                                            label="Icon Name"
                                            onBlur={(e) => {
                                                if (!e.target.value) {
                                                    setCategoryError((perv) => ({
                                                        ...perv,
                                                        categoryIconName: true
                                                    }))
                                                }
                                                else {
                                                    setCategoryError((perv) => ({
                                                        ...perv,
                                                        categoryIconName: false
                                                    }))
                                                }
                                            }}
                                            onChange={(e) => isEdit ? setEditCategory((perv) => ({
                                                ...perv,
                                                categoryIconName: e.target.value
                                            })) : setCategory((perv) => ({
                                                ...perv,
                                                categoryIconName: e.target.value
                                            }))}
                                        >
                                            <MenuItem key={'caterers'} value={'caterers'}>{'caterers'}</MenuItem>
                                            <MenuItem key={'house'} value={'house'}>{'house'}</MenuItem>
                                            <MenuItem key={'other1'} value={'other1'}>{'other1'}</MenuItem>
                                            <MenuItem key={'other2'} value={'other2'}>{'other2'}</MenuItem>
                                            <MenuItem key={'debt'} value={'debt'}>{'debt'}</MenuItem>
                                            <MenuItem key={'employee'} value={'employee'}>{'employee'}</MenuItem>
                                            <MenuItem key={'inventory'} value={'inventory'}>{'inventory'}</MenuItem>
                                            <MenuItem key={'renovate'} value={'renovate'}>{'renovate'}</MenuItem>
                                            <MenuItem key={'mistake'} value={'mistake'}>{'mistake'}</MenuItem>
                                            <MenuItem key={'restaurant'} value={'restaurant'}>{'restaurant'}</MenuItem>
                                            <MenuItem key={'tag'} value={'tag'}>{'tag'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='col-span-2'>
                                    <button className='addCategorySaveBtn' onClick={() => {
                                        isEdit ? editCategory() : submit()
                                    }}>{isEdit ? 'Save' : 'Add'}</button>
                                </div>
                                <div className='col-span-2'>
                                    <button className='addCategoryCancleBtn' onClick={() => {
                                        handleCloseModal(); setEditCategory((perv) => ({
                                            ...perv,
                                            categoryId: '',
                                            categoryName: '',
                                            categoryIconName: ''
                                        }));
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
        </div >
    )
}

export default ExpenseDashboard;
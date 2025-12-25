import './businessReport.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
import { useRef } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
import Switch from '@mui/material/Switch';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
// import CountCard from '../countCard/countCard';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Collapse from '@mui/material/Collapse';
import Tune from '@mui/icons-material/Tune';
import ExportMenu from '../bank/exportMenu/exportMenu.jsx';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};


function BusinessReport() {
    const regex = /^-?\d*(?:\.\d*)?$/;
    const [tab, setTab] = React.useState(1);
    const [categoryList, setCategoryList] = React.useState([
    ]);
    const [expenseList, setExpenseList] = React.useState([
    ]);
    const [filter, setFilter] = React.useState(false);
    const [formData, setFormData] = React.useState();
    const [formDataOther, setFormDataOther] = React.useState({
        openingBalanceAmt: '',
        openingBalanceComment: "",
        closingBalance: '',
        reportDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
    });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [data, setData] = useState();
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [openModal, setOpen] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalExpense, setTotalExpense] = React.useState('');
    const [categoryError, setCategoryError] = React.useState({
        businessName: false
    });
    const [editCateory, setEditCategory] = React.useState({
        businessName: '',
        subCategoryId: '',
        businessType: 'CASH'
    })
    const [category, setCategory] = React.useState({
        businessName: '',
        businessType: 'CASH'
    });
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
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [formDataOtherError, setFormDataOtherError] = useState({
        openingBalanceAmt: false,
        closingBalance: false,
        reportDate: false
    })
    const [formDataOtherErrorFields, setFormDataOtherErrorFields] = useState([
        'openingBalanceAmt',
        'closingBalance',
        'reportDate',
    ])




    const resetReport = () => {
        setFormData()
        setFormDataOtherError({
            reportDate: false
        })
        setFormDataOther({
            openingBalanceAmt: '',
            openingBalanceComment: "",
            closingBalance: '',
            reportDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
        });
        setIsEdit(false)
    }
    const handleEditReport = () => {
        setFormData({});
        setIsEdit(true);
        filter ? getReportByFilterOnEdit() : getReportOnEdit();
        // categoryList?.map((data) => {
        //     setFormData((perv) => ({
        //         ...perv,
        //         [data.businessCategoryId]: data.businessAmt
        //     }))
        // })
        // setFormDataOther((perv) => ({
        //     ...perv,
        //     reportDate: filter && (state[0].startDate.toDateString() == state[0].startDate.toDateString()) ? dayjs(state[0].startDate) : dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
        // }))
    }
    const addReport = async () => {
        if (window.confirm('Are you sure you want to submit report')) {
            setLoading(true);
            const finalData = {
                businessReport: formData ? formData : [],
                ...formDataOther
            }
            console.log('final data', finalData)
            await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/addBusinessReport`, finalData, config)
                .then((res) => {
                    setSuccess(true)
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
                    filter ? getReportByFilter() : getReport()
                    resetReport();
                    setTab(1)
                })
                .catch((error) => {
                    setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                })
        }
    }
    const cancle = async () => {
        setTab(1);
        setIsEdit(false);
        filter ? getReportByFilter() : getReport();
    }
    const editReport = async () => {
        if (window.confirm('Are you sure you want to edit report')) {
            setLoading(true);
            const finalData = {
                businessReport: formData ? formData : [],
                ...formDataOther
            }
            console.log('final data', finalData)
            await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateBusinessReport`, finalData, config)
                .then((res) => {
                    setSuccess(true)
                    setIsEdit(false)
                    setRowsPerPage(5);
                    setLoading(false);
                    filter ? getReportByFilter() : getReport();
                    resetReport();
                    setTab(1)
                })
                .catch((error) => {
                    setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                })
        }
    }
    const editCategory = async () => {
        if (loading || success) {

        } else {
            if (editCateory.businessName.length < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/updateBusinessCategory`, editCateory, config)
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
    const handleReset = () => {
        setCategory('');
        setCategoryError(false);
        setEditCategory({
            businessName: '',
            subCategoryId: '',
            businessType: 'CASH'
        });
        setIsEdit(false);
    }
    const addCategory = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}expenseAndBankrouter/addBusinessCategory`, category, config)
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
    const textFieldRef = useRef(null);
    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete Category?")) {
            deleteData(id);
            setTimeout(() => {
                setPage(0);
                setRowsPerPage(5);
                filter ? getDataByFilter() : getData();
            }, 50)
        }
    }
    const handleCloseModal = () => {
        setOpen(false)
    }
    const handleTransactionDate = (date) => {
        setFormDataOther((prevState) => ({
            ...prevState,
            ["reportDate"]: date && date['$d'] ? date['$d'] : null,
        }))
        getExpenseList(date && date['$d'] ? dayjs(date['$d'] ? date['$d'] : null) : null);
    };
    const deleteData = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeBusinessCategory?businessCategoryId=${id}`, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteReport = async (date) => {
        if (window.confirm("Are you sure you want to delete Report ...?")) {
            setLoading(true)
            await axios.delete(`${BACKEND_BASE_URL}expenseAndBankrouter/removeBusinessReport?brDate=${date}`, config)
                .then((res) => {
                    setLoading(false);
                    setSuccess(true);
                    filter ? getReportByFilter() : getReport()
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessCategoryList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
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
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessCategoryList?page=${pageNum}&numPerPage=${rowPerPageNum}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
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
        if (filter) {
            getDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
        }
        else {
            getDataOnPageChange(newPage + 1, rowsPerPage)
        }

    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (filter) {
            getDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
        }
        else {
            getDataOnPageChange(1, parseInt(event.target.value, 10))
        }

    };
    const getDataByFilter = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessCategoryList?page=${1}&numPerPage=${5}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const excelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForBusinessReport?startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForBusinessReport`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Report_' + new Date().toLocaleDateString() + '.xlsx'
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
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForBusinessReport?startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForBusinessReport`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Report_' + new Date().toLocaleDateString() + '.pdf'
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
    const excelExportNet = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForBusinessReportNet?startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportExcelForBusinessReportNet`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Net_Report_' + new Date().toLocaleDateString() + '.xlsx'
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
    const pdfExportNet = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForBusinessReportNet?startDate=${state[0].startDate}&endDate=${state[0].endDate}`
                    : `${BACKEND_BASE_URL}expenseAndBankrouter/exportPdfForBusinessReportNet`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Net_Report_' + new Date().toLocaleDateString() + '.pdf'
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
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessCategoryList?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalExpense(res.data.totalExpense)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getReport = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessReportDashBoard?startDate=${''}&endDate=${''}`, config)
            .then((res) => {
                setCategoryList(res.data.incomeSourceData);
                setExpenseList(res.data.expenseData);
                setFormDataOther(res.data)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getReportByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessReportDashBoard?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setCategoryList(res.data.incomeSourceData);
                setExpenseList(res.data.expenseData);
                setFormDataOther(res.data)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getReportOnEdit = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessReportDashBoard?startDate=${''}&endDate=${''}`, config)
            .then((res) => {
                setCategoryList(res.data.incomeSourceData);
                setExpenseList(res.data.expenseData);
                setFormDataOther(res.data);
                res.data && res.data.incomeSourceData?.map((data) => {
                    setFormData((perv) => ({
                        ...perv,
                        [data.businessCategoryId]: data.businessAmt
                    }))
                })
                setFormDataOther((perv) => ({
                    ...perv,
                    reportDate: filter && (state[0].startDate.toDateString() == state[0].startDate.toDateString()) ? dayjs(state[0].startDate) : dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getReportByFilterOnEdit = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessReportDashBoard?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setCategoryList(res.data.incomeSourceData);
                setExpenseList(res.data.expenseData);
                setFormDataOther(res.data)
                res.data && res.data.incomeSourceData?.map((data) => {
                    setFormData((perv) => ({
                        ...perv,
                        [data.businessCategoryId]: data.businessAmt
                    }))
                })
                setFormDataOther((perv) => ({
                    ...perv,
                    reportDate: filter && (state[0].startDate.toDateString() == state[0].startDate.toDateString()) ? dayjs(state[0].startDate) : dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getReportNet = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessReportDashBoardwithNetProfit?startDate=${''}&endDate=${''}`, config)
            .then((res) => {
                setCategoryList(res.data.incomeSourceData);
                setExpenseList(res.data.expenseData);
                setFormDataOther(res.data)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getReportNetByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessReportDashBoardwithNetProfit?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setCategoryList(res.data.incomeSourceData);
                setExpenseList(res.data.expenseData);
                setFormDataOther(res.data)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getIncomeSource = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getBusinessCategory`, config)
            .then((res) => {
                setCategoryList(res.data);
                res.data ? res.data.map((data) => (
                    setFormData((perv) => ({
                        ...perv,
                        [data.businessCategoryId]: 0
                    }))
                )) : <></>;
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getExpenseList = async (date) => {
        await axios.get(`${BACKEND_BASE_URL}expenseAndBankrouter/getExpenseAndClosingBalanceByDate?brDate=${date}`, config)
            .then((res) => {
                setExpenseList(res.data.expenseData);
                setFormDataOther((perv) => ({
                    ...perv,
                    closingBalance: res.data.closingBalance
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))

    }
    useEffect(() => {
        getReport();
    }, [])
    const onChangeOther = (e) => {
        console.log('>>><<', formDataOther)
        setFormDataOther((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))

    }
    const handleEdit = (id, name, type) => {
        setCategoryError(false);
        setIsEdit(true);
        setEditCategory((perv) => ({
            ...perv,
            businessCategoryId: id,
            businessName: name,
            businessType: type
        }))
        setOpen(true)
    }
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
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
                <div className='col-span-12 '>
                    <div className='datePickerWrp mb-4'>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='productTableSubContainer'>
                                    <div className='h-full grid grid-cols-12'>
                                        <div className='h-full col-span-8'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(1);
                                                        !isEdit && (filter ? getReportByFilter() : getReport());
                                                    }} >
                                                    <div className='statusTabtext'>{isEdit ? 'Edit Report' : 'Business Report'}</div>
                                                </div>
                                                <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`}
                                                    onClick={() => {
                                                        if (!isEdit) {
                                                            setTab(2);
                                                            getIncomeSource();
                                                            setFormDataOther({
                                                                openingBalanceAmt: '',
                                                                openingBalanceComment: "",
                                                                closingBalance: '',
                                                                reportDate: dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs(),
                                                            })
                                                            getExpenseList(dayjs().hour() < 4 ? dayjs().subtract(1, 'day') : dayjs())
                                                        }
                                                    }}>
                                                    <div className='statusTabtext'>Add Business Report</div>
                                                </div>
                                                <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabUnder' : 'productTab'}`}
                                                    onClick={() => {
                                                        if (!isEdit) {
                                                            setTab(3);
                                                            setPage(0);
                                                            setRowsPerPage(5);
                                                            filter ? getDataByFilter() : getData();
                                                        }
                                                    }}>
                                                    <div className='statusTabtext'>Add Income Category</div>
                                                </div>
                                                <div className={`flex col-span-3 justify-center ${tab === 4 || tab === '4' ? 'tabDebit' : 'productTab'}`}
                                                    onClick={() => {
                                                        if (!isEdit) {
                                                            setTab(4);
                                                            filter ? getReportNetByFilter() : getReportNet()
                                                            // filter ? getDataByFilter() : getData();
                                                        }
                                                    }}>
                                                    <div className='statusTabtext'>Net Business</div>
                                                </div>
                                            </div>
                                        </div>
                                        {(tab === 1 || tab === '1' || tab === '4' || tab === 4) &&
                                            <div className='col-span-4 flex justify-end pr-4'>
                                                <div className='dateRange text-center self-center' aria-describedby={ids} onClick={(e) => { if (!isEdit) { handleClick(e) } }}>
                                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                                </div>
                                                <div className='resetBtnWrap col-span-3 self-center'>
                                                    <button
                                                        className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                                        onClick={() => {
                                                            if (!isEdit) {
                                                                setFilter(false);
                                                                setState([
                                                                    {
                                                                        startDate: new Date(),
                                                                        endDate: new Date(),
                                                                        key: 'selection'
                                                                    }
                                                                ]);
                                                                // setPage(0); setRowsPerPage(5);
                                                                // getStatistics(id);
                                                                // getTransactionDataByDateFilterOnReset();
                                                                (tab === '1' || tab === 1) && getReport();
                                                                (tab === '4' || tab === 4) && getReportNet();
                                                            }
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
                                                                <button className='editBtnReport' onClick={() => {
                                                                    // setFilter(true); handleClose(); getStatisticsByFilter(); setTabStockIn(''); setPage(0); setRowsPerPage(5); getStockInDataByTabByFilter(''); getProductCountByFilter();
                                                                    // setFilter(true); handleClose(); setPage(0); setRowsPerPage(5); getTransactionDataByDateFilter(); getStatisticsByFilter(id);
                                                                    (tab === '1' || tab === 1) && getReportByFilter(); handleClose();
                                                                    (tab === '4' || tab === 4) && getReportNetByFilter(); handleClose();
                                                                    setFilter(true);
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
                    {(tab === 2 || tab === '2' || tab === 1 || tab === '1' || tab === 4 || tab === '4') &&
                        <div className='reportCard'>
                            {state[0].startDate.toDateString() == state[0].endDate.toDateString() ?
                                !formDataOther.isData ?
                                    tab == 1 || tab == 4 ?
                                        <div className='grid grid-cols-12 gap-6 pr-4'>
                                            <div className='mt-3 incomeSourceHeader col-span-4' style={{ color: "red" }}>No Data for : {state[0].startDate.toDateString()} </div>
                                        </div> : <></>
                                    :
                                    !isEdit ?
                                        <>
                                            <div className='grid grid-cols-12 mb-5 gap-6 pr-4'>
                                                <div className='col-span-2 mt-3 flex justify-end'>
                                                    {(tab === '1' || tab === 1) ? <ExportMenu exportExcel={excelExport} exportPdf={pdfExport} /> : <ExportMenu exportExcel={excelExportNet} exportPdf={pdfExportNet} />}
                                                </div>
                                                {(tab === 4 || tab === '4') ? <></> : <>
                                                    <div className='mt-3 col-start-9 col-span-2'>
                                                        <button className='editBtnReport' onClick={() => {
                                                            handleEditReport();
                                                        }}><EditIcon /> Edit</button>
                                                    </div>
                                                    <div className='mt-3 col-span-2'>
                                                        <button className='deleteBtnReport' onClick={() => {
                                                            deleteReport(filter ? state[0].startDate : dayjs());
                                                        }}><DeleteOutlineIcon /> Delete</button>
                                                    </div>
                                                </>
                                                }
                                            </div>
                                            <hr />
                                        </> : <></> :
                                tab == 1 || tab == 4 ?
                                    <>
                                        <div className='grid grid-cols-12 gap-6 pr-4 mb-5'>
                                            <div className='mt-3 incomeSourceHeader col-span-6' >Data for Date Range : {state[0].startDate.toDateString() + ' to ' + state[0].endDate.toDateString()} </div>
                                            <div className='col-span-2 col-start-11 mt-3 flex justify-end'>
                                                {(tab === '1' || tab === 1) ? <ExportMenu exportExcel={excelExport} exportPdf={pdfExport} /> : <ExportMenu exportExcel={excelExportNet} exportPdf={pdfExportNet} />}
                                            </div>
                                        </div>
                                        <hr />
                                    </>
                                    : <></>
                            }
                            <div className='grid grid-cols-12 gap-6 pr-4'>
                                <div className='mt-3 incomeSourceHeader col-span-4'>Income Source </div>
                                <div className='mt-3 incomeSourceHeader col-span-4'>Expense </div>
                                {(tab === 4 || tab === '4') ? <div className='mt-3 incomeSourceHeader col-span-4'>Net Business </div> : <div className='mt-3 incomeSourceHeader col-span-4'>Opening/Closing </div>}
                            </div>
                            <div className='grid grid-cols-12 gap-6 pr-4'>
                                <div className='mt-3 col-span-4 addIncomeContainer'>
                                    {
                                        categoryList?.map((data, index) => (
                                            <div className={`grid grid-cols-12 gap-3 soureceHeader ${index == 0 ? '' : 'mt-8'}`}>
                                                <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                    {data.businessName} :
                                                </div>
                                                <div className='col-span-7'>
                                                    {
                                                        (tab === 2 || tab === '2') || isEdit ?
                                                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                                                <Input
                                                                    value={formData && formData[data.businessCategoryId] ? formData[data.businessCategoryId] : ''}
                                                                    onChange={(e) => {
                                                                        if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                                            onChange(e)
                                                                        }
                                                                    }}
                                                                    autoComplete='off'
                                                                    id={data.businessCategoryId}
                                                                    name={data && data.businessCategoryId ? data.businessCategoryId : ''}
                                                                    InputProps={{ style: { fontSize: 14 } }}
                                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                                    fullWidth
                                                                    startAdornment={<InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>}
                                                                />
                                                            </FormControl>

                                                            :
                                                            (tab === 1 || tab === '1' || tab === 4 || tab === '4') &&
                                                            <div className='amountDisplay mt-2'>
                                                                <CurrencyRupeeIcon /> {parseFloat(data.businessAmt ? data.businessAmt : 0).toLocaleString('en-IN')}
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {((tab === 1 && tab === '1' || tab === 4 && tab === '4') || !isEdit) &&
                                        <div className={`grid grid-cols-12 gap-3 soureceHeader mt-8`}>
                                            <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                Mistake Income:
                                            </div>
                                            <div className='col-span-7'>
                                                <div className='amountDisplay mt-2'>
                                                    <CurrencyRupeeIcon /> {parseFloat(formDataOther.mistakeCredit ? formDataOther.mistakeCredit : 0).toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className='mt-3 col-span-4 addIncomeContainer'>
                                    {
                                        expenseList?.map((data, index) => (
                                            <div className={`grid grid-cols-12 gap-3 soureceHeader ${index == 0 ? '' : 'mt-8'}`}>
                                                <div className='col-span-6 mt-2 suppilerDetailFeildHeader'>
                                                    {data.categoryName} :
                                                </div>
                                                <div className='col-span-6'>
                                                    <div className='amountDisplay mt-2'>
                                                        <CurrencyRupeeIcon /> {parseFloat(data.expenseAmt ? data.expenseAmt : 0).toLocaleString('en-IN')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='mt-3 col-span-4 addOpeningBalanceContainer'>
                                    {
                                        // categoryList?.map((data, index) => (
                                        <>
                                            {((tab === 2 || tab === '2') || isEdit) &&
                                                <div className='grid grid-cols-12 gap-3 soureceHeader '>
                                                    <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                        Report Date :
                                                    </div>
                                                    <div className='col-span-7'>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DesktopDatePicker
                                                                textFieldStyle={{ width: '100%' }}
                                                                InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                                format="DD/MM/YYYY"
                                                                required
                                                                disabled={isEdit}
                                                                error={formDataOtherError.reportDate}
                                                                value={formDataOther && formDataOther.reportDate ? formDataOther.reportDate : null}
                                                                onChange={handleTransactionDate}
                                                                name="reportDate"
                                                                slotProps={{ textField: { fullWidth: true } }}
                                                                renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>
                                                </div>
                                            }
                                            {(tab === 4 || tab === '4') ? <></> : <>
                                                <div className={`grid grid-cols-12 gap-3 soureceHeader ${(tab === 2 || tab === '2') ? 'mt-8' : (tab === 1 || tab === '1') && isEdit ? 'mt-8' : ''}`}>
                                                    <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                        Opening Balance :
                                                    </div>
                                                    <div className='col-span-7'>
                                                        {(tab === 2 || tab === '2') || isEdit ?
                                                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                                                <Input
                                                                    value={formDataOther && formDataOther.openingBalanceAmt ? formDataOther.openingBalanceAmt : 0}
                                                                    onChange={(e) => {
                                                                        if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                                            onChangeOther(e)
                                                                        }
                                                                    }}
                                                                    autoComplete='off'
                                                                    name='openingBalanceAmt'
                                                                    InputProps={{ style: { fontSize: 14 } }}
                                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                                    fullWidth
                                                                    startAdornment={<InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>}
                                                                />
                                                            </FormControl>
                                                            :
                                                            (tab === 1 || tab === '1') &&
                                                            <div className='amountDisplay mt-2'>
                                                                <CurrencyRupeeIcon /> {parseFloat(formDataOther && formDataOther.openingBalanceAmt ? formDataOther.openingBalanceAmt : 0).toLocaleString('en-IN')}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>

                                                <div className={`grid grid-cols-12 gap-3 soureceHeader ${(tab === 2 || tab === '2') ? 'mt-12' : 'mt-6'}`}>
                                                    <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                        Comment :
                                                    </div>
                                                    <div className='col-span-7'>
                                                        {(tab === 2 || tab === '2') || isEdit ?
                                                            <TextField
                                                                value={formDataOther && formDataOther.openingBalanceComment ? formDataOther.openingBalanceComment : null}
                                                                onChange={onChangeOther}
                                                                name='openingBalanceComment'
                                                                fullWidth
                                                                InputProps={{ style: { fontSize: 14 } }}
                                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                                id="outlined-multiline-static"
                                                                // label="Multiline"
                                                                multiline
                                                                rows={4}
                                                            />
                                                            :
                                                            (tab === 1 || tab === '1') &&
                                                            <div className='commentDisplay mt-2'>
                                                                {formDataOther && formDataOther.openingBalanceComment ? formDataOther.openingBalanceComment : 'No Comment'}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                            }
                                            {(tab === 1 || tab === '1') &&
                                                <div className='grid grid-cols-12 gap-3 soureceHeader mt-8'>
                                                    <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                        Total Business :
                                                    </div>
                                                    <div className='col-span-7'>
                                                        {
                                                            <div className='amountDisplay mt-2'>
                                                                <CurrencyRupeeIcon /> {parseFloat(formDataOther && formDataOther.totalBusiness ? formDataOther.totalBusiness : 0).toLocaleString('en-IN')}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            {(tab === 1 || tab === '1' || tab === 4 || tab === '4') &&
                                                <div className='grid grid-cols-12 gap-3 soureceHeader mt-8'>
                                                    <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                        Cash Business :
                                                    </div>
                                                    <div className='col-span-7'>
                                                        {
                                                            <div className='amountDisplay mt-2'>
                                                                <CurrencyRupeeIcon /> {parseFloat(formDataOther && formDataOther.totalCash ? formDataOther.totalCash : 0).toLocaleString('en-IN')}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            {(tab === 1 || tab === '1' || tab === 4 || tab === '4') &&
                                                <div className='grid grid-cols-12 gap-3 soureceHeader mt-8'>
                                                    <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                        Online Business :
                                                    </div>
                                                    <div className='col-span-7'>
                                                        {
                                                            <div className='amountDisplay mt-2'>
                                                                <CurrencyRupeeIcon /> {parseFloat(formDataOther && formDataOther.totalOnline ? formDataOther.totalOnline : 0).toLocaleString('en-IN')}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            {(tab === 1 || tab === '1' || tab === 4 || tab === '4') &&
                                                <div className='grid grid-cols-12 gap-3 soureceHeader mt-8'>
                                                    <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                        Debit Business :
                                                    </div>
                                                    <div className='col-span-7'>
                                                        {
                                                            <div className='amountDisplay mt-2'>
                                                                <CurrencyRupeeIcon /> {parseFloat(formDataOther && formDataOther.totalDebit ? formDataOther.totalDebit : 0).toLocaleString('en-IN')}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            {(tab === 4 || tab === '4') &&
                                                <>
                                                    <hr className='mt-5' style={{ border: '1px solid' }} />
                                                    <div className='grid grid-cols-12 gap-3 soureceHeader mt-3'>
                                                        <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                            Total Business :
                                                        </div>
                                                        <div className='col-span-7'>
                                                            {
                                                                <div className='amountDisplay mt-2'>
                                                                    <CurrencyRupeeIcon /> {parseFloat(formDataOther && formDataOther.totalBusiness ? formDataOther.totalBusiness : 0).toLocaleString('en-IN')}
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='grid grid-cols-12 gap-3 soureceHeader mt-8'>
                                                        <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                            Total Expense :
                                                        </div>
                                                        <div className='col-span-7'>
                                                            {
                                                                <div className='amountDisplay mt-2'>
                                                                    <CurrencyRupeeIcon /> {parseFloat(formDataOther && formDataOther.totalExpense ? formDataOther.totalExpense : 0).toLocaleString('en-IN')}
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <hr className='mt-5' style={{ border: '1px solid' }} />
                                                    <div className='grid grid-cols-12 gap-3 soureceHeader mt-3'>
                                                        <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                            Net Profit :
                                                        </div>
                                                        <div className='col-span-7'>
                                                            {
                                                                <div className={`amountDisplay mt-2 ${formDataOther && formDataOther.NetProfit > 0 ? 'futureDueTxtG' : 'futureDueTxt'}`}>
                                                                    <CurrencyRupeeIcon /> {parseFloat(formDataOther && formDataOther.NetProfit ? formDataOther.NetProfit : 0).toLocaleString('en-IN')}
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            {(tab === 4 || tab === '4') ? <></> :
                                                <div className='grid grid-cols-12 gap-3 soureceHeader mt-8'>
                                                    <div className='col-span-5 mt-2 suppilerDetailFeildHeader'>
                                                        Closing Balance :
                                                    </div>
                                                    <div className='col-span-7'>
                                                        {(tab === 2 || tab === '2') || isEdit ?
                                                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                                                <Input
                                                                    value={formDataOther && formDataOther.closingBalance ? formDataOther.closingBalance : ''}
                                                                    onChange={(e) => {
                                                                        if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                                            onChangeOther(e)
                                                                        }
                                                                    }}
                                                                    name='closingBalance'
                                                                    InputProps={{ style: { fontSize: 14 } }}
                                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                                    fullWidth
                                                                    disabled
                                                                    startAdornment={<InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>}
                                                                />
                                                            </FormControl>
                                                            :
                                                            (tab === 1 || tab === '1') &&
                                                            <div className='amountDisplay mt-2'>
                                                                <CurrencyRupeeIcon /> {parseFloat(formDataOther && formDataOther.closingBalance ? formDataOther.closingBalance : 0).toLocaleString('en-IN')}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>}
                                        </>
                                        // ))
                                    }
                                </div>
                                {/* <div className='mt-3 col-span-4 detailContainer'>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Current Salary :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            ₹ {parseFloat(data.salary ? data.salary : 0).toLocaleString('en-IN')} /-
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Max Leave :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.maxLeave} Day
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Employee Joining :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeStaticJoiningDate}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Calculation Date :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeJoiningDate}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Last Payment Date :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeLastPaymentDate}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Account Holder :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.accountHolderName}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Account Number:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.accountNumber}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            IFSC Code:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.ifscCode}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Bank Name:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.bankName}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Branch Name:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.branchName}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Available Leave:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.availableLeave} Day
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            {((tab === 2 || tab === '2') || isEdit) &&
                                <div className='mt-6 grid grid-cols-12 gap-6'>
                                    <div className='col-start-10'>
                                        <button className='editBtnReport' onClick={() => {
                                            isEdit ? editReport() : addReport();
                                        }}>{isEdit ? 'Save' : 'Apply'}</button>
                                    </div>
                                    <div className=''>
                                        <button className='cancleBtnReport' onClick={() => {
                                            // isEdit ? { setIsEdit(false) } : {};
                                            cancle()
                                        }}>Cancle</button>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                    {
                        (tab === 3 || tab === '3') &&
                        <div className='grid grid-cols-12 mt-10'>
                            <div className='col-span-12'>
                                <div className='userTableSubContainer pt-4'>
                                    <div className='grid grid-cols-12'>
                                        {/* <div className='ml-4 col-span-2  pr-5 flex justify-end'>
                                            <button className='exportExcelBtn' onClick={() => { }
                                                // excelExportProductWise()
                                            }><FileDownloadIcon />&nbsp;&nbsp;Product Wise</button>
                                        </div>
                                        <div className='col-span-2 pr-5 flex justify-end'>
                                            <button className='exportExcelBtn' onClick={() => { }
                                                // pdfExportCategoryWise()
                                            }><FileDownloadIcon />&nbsp;&nbsp;Category Wise</button>
                                        </div> */}
                                        <div className='col-span-2 col-start-11 mr-6'>
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
                                                        <TableCell align="right">Type</TableCell>
                                                        <TableCell align="right"></TableCell>
                                                        <TableCell align="right"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data?.map((row, index) => (
                                                        totalRows !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.businessCategoryId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <TableCell component="th" scope="row" >
                                                                    {row.businessName}
                                                                </TableCell>
                                                                <TableCell align="right" >{row.businessType}</TableCell>
                                                                <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.businessCategoryId, row.businessName, row.businessType)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.businessCategoryId)}>Delete</button></div></TableCell>
                                                                <TableCell align="right">
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
                                                        setCategoryError(true);
                                                    }
                                                    else {
                                                        setCategoryError(false)
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    isEdit ? setEditCategory((perv) => ({
                                                        ...perv,
                                                        businessName: e.target.value
                                                    })) : setCategory((perv) => ({
                                                        ...perv,
                                                        businessName: e.target.value
                                                    }))
                                                }}
                                                value={isEdit ? editCateory.businessName ? editCateory.businessName : '' : category.businessName ? category.businessName : ''}
                                                error={categoryError.businessName ? true : false}
                                                inputRef={textFieldRef}
                                                helperText={categoryError.businessName ? "Please Enter Category" : ''}
                                                name="businessName"
                                                id="outlined-required"
                                                label="Category"
                                                InputProps={{ style: { fontSize: 17 } }}
                                                InputLabelProps={{ style: { fontSize: 17 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-4'>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Business Type</InputLabel>
                                                <Select
                                                    labelId="Search"
                                                    id="Search"
                                                    name='transactionType'
                                                    value={isEdit ? editCateory.businessType ? editCateory.businessType : '' : category.businessType ? category.businessType : ''}
                                                    label="Business Type"
                                                    onChange={(e) => {
                                                        isEdit ? setEditCategory((perv) => ({
                                                            ...perv,
                                                            businessType: e.target.value
                                                        })) : setCategory((perv) => ({
                                                            ...perv,
                                                            businessType: e.target.value
                                                        }))
                                                    }}
                                                    MenuProps={{
                                                        style: { zIndex: 35001 }
                                                    }}
                                                >
                                                    <MenuItem value={'CASH'}>CASH</MenuItem>
                                                    <MenuItem value={'DEBIT'}>DEBIT</MenuItem>
                                                    <MenuItem value={'ONLINE'}>ONLINE</MenuItem>
                                                    <MenuItem value={'DUE'}>DUE</MenuItem>
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
                                                    subCategoryId: '',
                                                    businessName: '',
                                                    businessType: 'CASH'
                                                }));
                                                setCategory({
                                                    businessName: '',
                                                    businessType: 'CASH'
                                                })
                                                setIsEdit(false)
                                            }}>Cancle</button>
                                        </div>
                                    </div>
                                </Box>
                            </Modal>
                        </div >
                    }
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default BusinessReport;
import './productDetailsManager.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import dayjs from 'dayjs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
import CountCard from '../countCard/countCard';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import ProductQtyCountCard from './productQtyCard';
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
import MenuStockInOut from '../stockManagement/menu';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem';
import { ToastContainer, toast } from 'react-toastify';

function ProductDetailsManager() {
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    let { id, name, unit } = useParams();
    const [isEdit, setIsEdit] = React.useState(false);
    const [stockOutData, setStockOutData] = React.useState();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [suppiler, setSuppilerList] = React.useState();
    const [stockInData, setStockInData] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsDebit, setTotalRowsDebit] = React.useState(0);
    const [filter, setFilter] = React.useState(false);
    const [tab, setTab] = React.useState(1);
    const [tabStockInOut, setTabStockInOut] = React.useState(1);
    const [statisticsCount, setStatisticsCounts] = useState();
    const [suppilerNameAndCount, setSuppilerNameAndCount] = useState();
    const [categoryNameAndCount, setCategoryNameAndCount] = useState();
    const [categories, setCategories] = React.useState();
    const [debitTransaction, setDebitTransaction] = React.useState();
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const regex = /^\d*(?:\.\d*)?$/;
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
    const [stockInFormData, setStockInFormData] = React.useState({
        productId: id,
        productName: name,
        productQty: 0,
        productUnit: unit,
        productPrice: 0,
        totalPrice: 0,
        billNumber: "",
        supplierId: "",
        stockInPaymentMethod: 'cash',
        stockInComment: "",
        stockInDate: dayjs()
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        productPrice: false,
        totalPrice: false,
        supplierId: false,
        stockInPaymentMethod: false,
        stockInDate: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'productPrice',
        'totalPrice',
        'supplierId',
        'stockInPaymentMethod',
        'stockInDate'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
        productId: id,
        productQty: 0,
        productUnit: unit,
        stockOutCategory: 0,
        stockOutComment: "",
        reason: "",
        stockOutDate: dayjs()
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        productQty: false,
        reason: false,
        stockOutCategory: false,
        stockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'productQty',
        'reason',
        'stockOutCategory',
        'stockOutDate',
    ])
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onChangeStockIn = (e) => {
        if (e.target.name === 'productPrice' && stockInFormData.productQty > 0) {
            setStockInFormData((prevState) => ({
                ...prevState,
                productPrice: e.target.value,
                totalPrice: (parseFloat(e.target.value) * parseFloat(stockInFormData.productQty)).toFixed(2).toString()

            }))
            if (parseFloat(e.target.value) > 0) {
                setStockInFormDataError((perv) => ({
                    ...perv,
                    totalPrice: false,
                    productPrice: false
                }))
            }
        } else if (e.target.name === 'totalPrice' && stockInFormData.productQty > 0) {
            setStockInFormData((prevState) => ({
                ...prevState,
                totalPrice: e.target.value,
                productPrice: (parseFloat(e.target.value) / parseFloat(stockInFormData.productQty)).toFixed(2).toString()

            }))
            if (parseFloat(e.target.value) > 0) {
                setStockInFormDataError((perv) => ({
                    ...perv,
                    totalPrice: false,
                    productPrice: false
                }))
            }
        }
        else if (e.target.name === 'productQty' && stockInFormData.productPrice > 0) {
            setStockInFormData((prevState) => ({
                ...prevState,
                productQty: e.target.value,
                totalPrice: (parseFloat(e.target.value) * parseFloat(stockInFormData.productPrice)).toString()

            }))
        }
        else {
            setStockInFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const handleResetStockIn = () => {
        setStockInFormData({
            productId: id,
            productName: null,
            productQty: 0,
            productUnit: "",
            productPrice: 0,
            totalPrice: 0,
            billNumber: "",
            supplierId: "",
            stockInPaymentMethod: 'cash',
            stockInComment: "",
            stockInDate: dayjs()
        })
        setStockInFormDataError({
            productQty: false,
            productUnit: false,
            productPrice: false,
            totalPrice: false,
            supplierId: false,
            stockInPaymentMethod: false,
            stockInDate: false
        })
    }
    const handleResetStockOut = () => {
        setStockOutFormData({
            productId: id,
            reason: '',
            productQty: 0,
            productUnit: "",
            stockOutCategory: null,
            stockOutComment: "",
            stockOutDate: dayjs()
        })
        setStockOutFormDataError({
            productQty: false,
            productUnit: false,
            stockOutCategory: false,
            stockInDate: false,
            reason: false
        })
    }
    const getSuppilerList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/productWiseSupplierDDL?productId=${id}`, config)
            .then((res) => {
                setSuppilerList(res.data);
            })
            .catch((error) => {
                setSuppilerList(['No Data'])
            })
    }
    const handleStockInDate = (date) => {
        console.log("stockIn", date, date && date['$d'] ? date['$d'] : null)
        setStockInFormData((prevState) => ({
            ...prevState,
            ["stockInDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["stockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const onChangeStockOut = (e) => {
        if (e.target.name === 'productQty') {
            if (e.target.value > (isEdit ? stockOutFormData.stockRemaining : statisticsCount?.remainingStock)) {
                setStockOutFormDataError((perv) => ({
                    ...perv,
                    [e.target.name]: true
                }))
            }
            else {
                setStockOutFormDataError((perv) => ({
                    ...perv,
                    [e.target.name]: false
                }))
            }
            setStockOutFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        } else {
            setStockOutFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const submitStockIn = () => {
        console.log('submitStockIn')
        if (loading || success) {

        } else {
            const isValidate = stockInErrorFields.filter(element => {
                if (element === 'reason') {
                    if (isEdit && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormDataError['reason'] === true) {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            reason: true
                        }))
                        return element;
                    }
                }
                else if (element === 'stockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.stockInDate == 'Invalid Date') {
                    setStockInFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (stockInFormDataError[element] === true || stockInFormData[element] === '' || stockInFormData[element] === 0) {
                    setStockInFormDataError((perv) => ({
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
                stockIn()
            }
        }
    }
    const stockOut = async () => {
        setLoading(true)
        const formdata = {
            productId: id,
            productQty: stockOutFormData.productQty,
            productUnit: unit,
            stockOutCategory: stockOutFormData.stockOutCategory,
            stockOutComment: stockOutFormData.stockOutComment,
            stockOutDate: stockOutFormData.stockOutDate,
        }
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addStockOutDetails`, formdata, config)
            .then((res) => {
                setSuccess(true)
                // getData();
                setLoading(false)
                // setTab(null)
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getStatistics();
                getCategoryNameAndCount();
                getSuppilerNameAndCount();
                setFilter(false);
                getStockOutData();
                handleResetStockOut();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submitStockOut = () => {
        if (loading || success) {

        } else {
            console.log('submitStockOut')
            const isValidate = stockOutErrorFields.filter(element => {
                if (element === 'reason') {
                    if (isEdit && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormDataError['reason'] === true) {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            reason: true
                        }))
                        return element;
                    }
                }
                else
                    if (element === 'stockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.stockOutDate == 'Invalid Date') {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    }
                    else if (stockOutFormDataError[element] === true || stockOutFormData[element] === '' || stockOutFormData[element] === 0) {
                        setStockOutFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    }
            })
            if (isValidate.length > 0) {
                console.log('velidate', isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                // console.log(">>", stockInFormData, stockInFormData.stockInDate, stockInFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                stockOut()
            }
        }
    }
    const getStockInDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInList?page=${pageNum}&numPerPage=${rowPerPageNum}&productId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&productId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInList?&page=${1}&numPerPage=${5}&productId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&productId=${id}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?page=${pageNum}&numPerPage=${rowPerPageNum}&productId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&productId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?page=${page + 1}&numPerPage=${rowsPerPage}&productId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}&productId=${id}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change", tab)
        if (tabStockInOut === 2 || tabStockInOut === '2') {
            console.log("page change>>")
            if (filter) {
                getStockOutDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockOutDataOnPageChange(newPage + 1, rowsPerPage)
            }
        } else {
            if (filter) {
                getStockInDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockInDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    };
    const stockIn = async () => {
        setLoading(true)
        const formdata = {
            productId: id,
            productQty: stockInFormData.productQty,
            productUnit: unit,
            productPrice: stockInFormData.productPrice,
            totalPrice: stockInFormData.totalPrice,
            billNumber: stockInFormData.billNumber,
            supplierId: stockInFormData.supplierId,
            stockInPaymentMethod: stockInFormData.stockInPaymentMethod,
            stockInComment: stockInFormData.stockInComment,
            stockInDate: stockInFormData.stockInDate,
        }
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addStockInDetails`, formdata, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                // getData();
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getStatistics();
                getCategoryNameAndCount();
                getSuppilerNameAndCount();
                setFilter(false)
                getStockInData()
                handleResetStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tabStockInOut === '1' || tabStockInOut === 1) {
            if (filter) {
                getStockInDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockInDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        } else {
            if (filter) {
                getStockOutDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockOutDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };
    const deleteStockIn = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeStockInTransaction?stockInId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                getStatistics();
                getStockInData();
                getSuppilerNameAndCount();
                getCategoryNameAndCount();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteStockIn = (id) => {
        if (window.confirm("Are you sure you want to delete Stock In?")) {
            deleteStockIn(id);
            setTimeout(() => {
                getStockInData();
            }, 1000)
        }
    }
    const deleteStockOut = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeStockOutTransaction?stockOutId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                getStatistics();
                getStockOutData();
                getCategoryNameAndCount();
                getSuppilerNameAndCount();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteStockOut = (id) => {
        if (window.confirm("Are you sure you want to delete Stock Out?")) {
            deleteStockOut(id);
            setTimeout(() => {
                getStockOutData();
            }, 1000)
        }
    }
    const stockOutExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockout?startDate=${state[0].startDate}&endDate=${state[0].endDate}&productId=${id}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockout?startDate=${''}&endDate=${''}&productId=${id}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'StockOut_' + new Date().toLocaleDateString() + '.xlsx'
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
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${state[0].startDate}&endDate=${state[0].endDate}&productId=${id}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${''}&endDate=${''}&productId=${id}`,
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
    const getCategoryList = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockOutCategory`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const getStatistics = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductCountDetailsById?productId=${id}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStatisticsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductCountDetailsById?startDate=${state[0].startDate}&endDate=${state[0].endDate}&productId=${id}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getSuppilerNameAndCount = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierByProductId?productId=${id}`, config)
            .then((res) => {
                setSuppilerNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getSuppilerNameAndCountByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierByProductId?startDate=${state[0].startDate}&endDate=${state[0].endDate}&productId=${id}`, config)
            .then((res) => {
                setSuppilerNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCategoryNameAndCount = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCategoryWiseUsedByProduct?productId=${id}`, config)
            .then((res) => {
                setCategoryNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCategoryNameAndCountByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCategoryWiseUsedByProduct?startDate=${state[0].startDate}&endDate=${state[0].endDate}&productId=${id}`, config)
            .then((res) => {
                setCategoryNameAndCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const resetStockInEdit = () => {
        setStockInFormData({
            productQty: 0,
            productPrice: 0,
            totalPrice: 0,
            billNumber: "",
            supplierId: "",
            stockInPaymentMethod: 'cash',
            stockInComment: "",
            stockInDate: dayjs()
        });
        setStockInFormDataError({
            productQty: false,
            productPrice: false,
            totalPrice: false,
            supplierId: false,
            stockInPaymentMethod: false,
            stockInDate: false
        })
        setIsEdit(false)
    }
    const resetStockOutEdit = () => {
        setStockOutFormData({
            productId: "",
            productQty: 0,
            productUnit: "",
            stockOutCategory: 0,
            stockOutComment: "",
            stockOutDate: dayjs()
        });
        setStockOutFormDataError({
            productQty: false,
            productUnit: false,
            stockOutCategory: false,
            stockOutDate: false
        })
        setIsEdit(false)
    }

    const fillStockInEdit = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/fillStockInTransaction?stockInId=${id}`, config)
            .then((res) => {
                setStockInFormData((perv) => ({
                    ...perv,
                    stockInId: id,
                    productId: res.data.productId,
                    productName: res.data,
                    productQty: parseFloat(res.data.productQty),
                    productUnit: res.data.productUnit,
                    productPrice: res.data.productPrice,
                    totalPrice: res.data.totalPrice,
                    billNumber: res.data.billNumber,
                    supplierId: res.data.supplierId,
                    stockInPaymentMethod: res.data.stockInPaymentMethod,
                    stockInComment: res.data.stockInComment,
                    stockInDate: dayjs(res.data.stockInDate)
                }))
                getSuppilerList(res.data.productId)
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const fillStockOutEdit = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/fillStockOutTransaction?stockOutId=${id}`, config)
            .then((res) => {
                setStockOutFormData((perv) => ({
                    ...perv,
                    stockOutId: id,
                    productName: res.data,
                    productId: res.data.productId,
                    productQty: res.data.productQty,
                    productUnit: res.data.productUnit,
                    stockOutCategory: res.data.stockOutCategory,
                    stockOutComment: res.data.stockOutComment,
                    stockRemaining: statisticsCount.remainingStock + res.data.productQty,
                    stockOutDate: dayjs(res.data.stockOutDate)
                }))
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const handleAccordionOpenOnEdit = (data) => {
        if (tabStockInOut === 1 || tabStockInOut === '1') {
            fillStockInEdit(data);
        }
        else {
            fillStockOutEdit(data)
        }
        setIsEdit(true)
        setExpanded(true)
    }
    const stockInEdit = async () => {
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/updateStockInTransaction`, stockInFormData, config)
            .then((res) => {
                setSuccess(true)
                // getData();
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setFilter(false)
                setExpanded(false)
                getStockInData();
                getStatistics();
                getCategoryNameAndCount();
                getSuppilerNameAndCount();
                handleResetStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const stockOutEdit = async () => {
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/updateStockOutTransaction`, stockOutFormData, config)
            .then((res) => {
                setSuccess(true)
                // getData();
                // setTab(null)
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setFilter(false);
                setExpanded(false);
                getStatistics();
                getCategoryNameAndCount();
                getSuppilerNameAndCount();
                getStockOutData();
                handleResetStockOut();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editSubmitStockOut = () => {
        if (loading || success) {

        } else {
            console.log('editSubmitStockOut')
            const isValidate = stockOutErrorFields.filter(element => {
                if (element === 'stockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.stockOutDate == 'Invalid Date') {
                    setStockOutFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (stockOutFormDataError[element] === true || stockOutFormData[element] === '' || stockOutFormData[element] === 0) {
                    setStockOutFormDataError((perv) => ({
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
                stockOutEdit()
            }
        }
    }
    const editStockIn = () => {
        console.log('editStockIn');
        const isValidate = stockInErrorFields.filter(element => {
            if (element === 'stockInDate' && stockInFormData[element] === '' || stockInFormData[element] === null || stockInFormData.stockInDate == 'Invalid Date') {
                setStockInFormDataError((perv) => ({
                    ...perv,
                    [element]: true
                }))
                return element;
            }
            else if (stockInFormDataError[element] === true || stockInFormData[element] === '' || stockInFormData[element] === 0) {
                setStockInFormDataError((perv) => ({
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
            stockInEdit()
        }
    }
    useEffect(() => {
        getSuppilerList(id)
        getCategoryList();
        getStockInData();
        getStatistics();
        getCategoryNameAndCount();
        getSuppilerNameAndCount();
        // getCountData();
    }, [])

    if (loading) {
        console.log('>>>>??')
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        // setLoading(false);
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
            setSuccess(false);
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false);
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
                <div className='col-span-12 mt-6'>
                    <div className='datePickerWrp mb-4'>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='productTableSubContainer'>
                                    <div className='h-full grid grid-cols-12'>
                                        <div className='h-full col-span-3'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <Tooltip title={name + '  ' + (statisticsCount && statisticsCount.minProductQty ? statisticsCount?.remainingStock < statisticsCount.minProductQty ? statisticsCount?.remainingStock != 0 ? 'Low Stock' : 'Out Of Stock' : '' : '')} placement="top-start" arrow>
                                                    <div className={`flex col-span-12 justify-between productTab`}>
                                                        <div className='productNameHeader'>{name}</div>
                                                        <div className='status' style={{ color: `${statisticsCount && statisticsCount.minProductQty ? statisticsCount?.remainingStock < statisticsCount.minProductQty ? statisticsCount?.remainingStock != 0 ? 'orange' : 'red' : 'black' : 'black'}` }}>{statisticsCount && statisticsCount.minProductQty ? statisticsCount?.remainingStock < statisticsCount.minProductQty ? statisticsCount?.remainingStock != 0 ? 'Low Stock' : 'Out Of Stock' : '' : ''}</div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div className='h-full col-span-4'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <div className={`flex col-span-4 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(1);
                                                    }} >
                                                    <div className='statusTabtext'>Statistics</div>
                                                </div>
                                                <div className={`flex col-span-4 justify-center ${tab === 3 || tab === '3' ? 'productTabOut' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(3);
                                                    }}>
                                                    <div className='statusTabtext'>Category</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-5 flex justify-end pr-4'>
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
                                                        getStatistics()
                                                        setTabStockInOut(1);
                                                        getStockInData(); setPage(0); setRowsPerPage(5); getSuppilerNameAndCount(); getCategoryNameAndCount()
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
                                                                setFilter(true); handleClose();
                                                                // getStatisticsByFilter();
                                                                setTabStockInOut(1);
                                                                setPage(0);
                                                                setRowsPerPage(5);
                                                                getStockInDataByFilter();
                                                                getStatisticsByFilter();
                                                                getSuppilerNameAndCountByFilter();
                                                                getCategoryNameAndCountByFilter();
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
                    {tab === 1 || tab === '1' ?
                        <div className='grid gap-4 mt-12'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-3'>
                                    <CountCard color={'black'} count={statisticsCount && statisticsCount.totalPurchase ? statisticsCount.totalPurchase : 0} desc={'Total Purchase'} productDetail={true} unitDesc={unit} />
                                </div>
                                <div className='col-span-3'>
                                    <CountCard color={'blue'} count={statisticsCount && statisticsCount.totalUsed ? statisticsCount.totalUsed : 0} desc={'Total Used'} productDetail={true} unitDesc={unit} />
                                </div>
                                <div className='col-span-3'>
                                    <CountCard color={'orange'} count={statisticsCount && statisticsCount.remainingStock ? statisticsCount.remainingStock : 0} desc={'Remaining Stock'} productDetail={true} unitDesc={unit} />
                                </div>
                            </div>
                        </div>
                        :
                        <div className='grid gap-4 mt-12' style={{ minHeight: '216px', maxHeight: '332px', overflowY: 'scroll' }}>
                            <div className='grid grid-cols-3 gap-6 pb-3'>
                                {
                                    categoryNameAndCount && categoryNameAndCount?.map((row, index) => (
                                        <ProductQtyCountCard productQtyUnit={unit} productQty={row.usedQty} productPrice={row.usedPrice} productName={row.stockOutCategoryName} index={index} />
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='datePickerWrp mt-6'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='productTableSubContainer'>
                            <div className='h-full grid grid-cols-12'>
                                <div className='h-full col-span-5'>
                                    <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                        <div className={`flex col-span-6 justify-center ${tabStockInOut === 1 || tabStockInOut === '1' ? 'productTabAll' : 'productTab'}`}
                                            onClick={() => {
                                                setTabStockInOut(1);
                                                resetStockOutEdit();
                                                setPage(0); setRowsPerPage(5);
                                                filter ? getStockInDataByFilter() : getStockInData();
                                            }} >
                                            <div className='statusTabtext'>Stock In</div>
                                        </div>
                                        <div className={`flex col-span-6 justify-center ${tabStockInOut === 2 || tabStockInOut === '2' ? 'productTabIn' : 'productTab'}`}
                                            onClick={() => {
                                                setTabStockInOut(2);
                                                resetStockInEdit();
                                                setPage(0); setRowsPerPage(5);
                                                filter ? getStockOutDataByFilter() : getStockOutData();
                                            }}>
                                            <div className='statusTabtext'>Stock Out</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            < div className='mt-10 grid grid-col-12'>
                {(tabStockInOut && tabStockInOut === '2' || tabStockInOut === 2) &&
                    <Accordion expanded={expanded} square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}>
                        <AccordionSummary
                            sx={{ height: '60px', borderRadius: '0.75rem' }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            onClick={() => { setExpanded(!expanded); resetStockInEdit(); resetStockOutEdit(); }}
                        >
                            <div className='stockAccordinHeader'>{"Stock Out"}</div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='stockInOutContainer'>
                                <div className='mt-6 grid grid-cols-12 gap-6'>
                                    <div className='col-span-3'>
                                        <FormControl fullWidth>
                                            <TextField
                                                value={name}
                                                name="productName"
                                                id="outlined-required"
                                                label="Product Name"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </FormControl>
                                    </div>
                                    <div className='col-span-3'>
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value < 0 || (isEdit ? e.target.value > stockOutFormData.stockRemaining : e.target.value > statisticsCount?.remainingStock)) {
                                                    setStockOutFormDataError((perv) => ({
                                                        ...perv,
                                                        productQty: true
                                                    }))
                                                }
                                                else {
                                                    setStockOutFormDataError((perv) => ({
                                                        ...perv,
                                                        productQty: false
                                                    }))
                                                }
                                            }}
                                            type="number"
                                            label="Qty"
                                            fullWidth
                                            onChange={onChangeStockOut}
                                            value={stockOutFormData.productQty}
                                            error={stockOutFormDataError.productQty}
                                            helperText={name && !stockOutFormDataError.productQty ? `Remaining Stock:-  ${isEdit ? stockOutFormData.stockRemaining : statisticsCount?.remainingStock}  ${stockOutFormData.productUnit}` : stockOutFormDataError.productQty ? stockOutFormDataError.productQty && stockOutFormData.productQty > (isEdit ? stockOutFormData.stockRemaining : statisticsCount?.remainingStock) ? `StockOut qty can't be more than ${isEdit ? stockOutFormData.stockRemaining : statisticsCount?.remainingStock}  ${stockOutFormData.productUnit}` : "Please Enter Qty" : ''}
                                            name="productQty"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
                                            }}
                                        />
                                    </div>
                                    <div className='col-span-4'>
                                        <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.stockOutCategory}>Category</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={stockOutFormData.stockOutCategory}
                                                error={stockOutFormDataError.stockOutCategory}
                                                name="stockOutCategory"
                                                label="Category"
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        setStockOutFormDataError((perv) => ({
                                                            ...perv,
                                                            stockOutCategory: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockOutFormDataError((perv) => ({
                                                            ...perv,
                                                            stockOutCategory: false
                                                        }))
                                                    }
                                                }}
                                                onChange={onChangeStockOut}
                                            >
                                                {
                                                    categories ? categories.map((category) => (
                                                        <MenuItem key={category.stockOutCategoryId} value={category.stockOutCategoryId}>{category.stockOutCategoryName}</MenuItem>
                                                    )) : null
                                                }

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='col-span-2'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                textFieldStyle={{ width: '100%' }}
                                                InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                label="Stock Out Date"
                                                format="DD/MM/YYYY"
                                                required
                                                error={stockOutFormDataError.stockOutDate}
                                                value={stockOutFormData.stockOutDate}
                                                onChange={handleStockOutDate}
                                                name="stockOutDate"
                                                renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className='col-span-6'>
                                        <TextField
                                            onChange={onChangeStockOut}
                                            value={stockOutFormData.stockOutComment}
                                            name="stockOutComment"
                                            id="outlined-required"
                                            label="Comment"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    {isEdit &&
                                        <div className='col-span-6'>
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value.length < 4) {
                                                        setStockOutFormDataError((perv) => ({
                                                            ...perv,
                                                            reason: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockOutFormDataError((perv) => ({
                                                            ...perv,
                                                            reason: false
                                                        }))
                                                    }
                                                }}
                                                onChange={onChangeStockOut}
                                                error={stockOutFormDataError.reason}
                                                value={stockOutFormData.reason}
                                                name="reason"
                                                helperText={stockOutFormDataError.reason ? 'Edit Reason is must ...' : ''}
                                                id="outlined-required"
                                                label="Edit Reason"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>}
                                    <div className='col-span-2 col-start-9'>
                                        <button className='addCategorySaveBtn' onClick={() => {
                                            isEdit ? editSubmitStockOut() : submitStockOut()
                                        }}>{isEdit ? "Save" : "Stock Out"}</button>
                                    </div>
                                    <div className='col-span-2'>
                                        <button className='addCategoryCancleBtn' onClick={() => {
                                            handleResetStockOut();
                                            setIsEdit(false);
                                            isEdit ? setExpanded(false) : setExpanded(true);
                                        }}>{isEdit ? "cancle" : "reset"}</button>
                                    </div>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                }
            </div>

            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                <button className='exportExcelBtn' onClick={() => { tabStockInOut === 1 || tabStockInOut === '1' ? stockInExportExcel() : stockOutExportExcel() }}><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>
                            </div>
                        </div>
                        {tabStockInOut === 1 || tabStockInOut === '1' ?
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Entered By</TableCell>
                                                <TableCell align="left">Product Name</TableCell>
                                                <TableCell align="left">Qty</TableCell>
                                                <TableCell align="left">Supplier</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stockInData?.map((row, index) => (
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
                                                                {row.enteredBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.productName}</TableCell>
                                                        <TableCell align="left" >{row.Quantity}</TableCell>
                                                        <TableCell align="left" >{row.supplier}</TableCell>
                                                        <TableCell align="left" >{row.stockInDate}</TableCell>
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
                            </div> :
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Out By</TableCell>
                                                <TableCell align="left">Product Name</TableCell>
                                                <TableCell align="left">Quantity</TableCell>
                                                <TableCell align="left">Category</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stockOutData?.map((row, index) => (
                                                totalRowsOut !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.stockOutId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row">
                                                                {row.outBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.productName}</TableCell>
                                                        <TableCell align="left" >{row.Quantity}</TableCell>
                                                        <TableCell align="left" >{row.stockOutCategoryName}</TableCell>
                                                        <Tooltip title={row.stockOutComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.stockOutComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.stockOutDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} stockInOutId={row.stockOutId} data={row} deleteStockInOut={handleDeleteStockOut} />
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
                                        count={totalRowsOut}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default ProductDetailsManager;
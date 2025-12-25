import './stockInOut.css';
import * as React from "react";
import { useRef } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MenuStockInOut from './menu';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const qtyUnit = [
    'Kg',
    'Gm',
    'Ltr',
    'Mtr',
    'Pkts',
    'BOX',
    'ML',
    'Qty',
    'Piece',
    'Num'
]

function StockInOut() {
    const regex = /^\d*(?:\.\d*)?$/;
    const navigate = useNavigate();
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    const [expanded, setExpanded] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [suppiler, setSuppilerList] = React.useState();
    const [filter, setFilter] = React.useState(false);
    const [stockInData, setStockInData] = React.useState();
    const [stockOutData, setStockOutData] = React.useState();
    const [categories, setCategories] = React.useState();
    const [productList, setProductList] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [tab, setTab] = React.useState(1);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const textFieldRef = useRef(null);

    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const resetStockInEdit = () => {
        setStockInFormData({
            productId: "",
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
        });
        setStockInFormDataError({
            productQty: false,
            productName: false,
            productUnit: false,
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

    const fillStockInEdit = async (id, isFullEdit) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/fillStockInTransaction?stockInId=${id}`, config)
            .then((res) => {
                setStockInFormData((perv) => ({
                    ...perv,
                    stockInId: id,
                    productId: res.data.productId,
                    productName: res.data.productName,
                    productQty: parseFloat(res.data.productQty),
                    productUnit: res.data.productUnit,
                    productPrice: res.data.productPrice,
                    totalPrice: res.data.totalPrice,
                    billNumber: res.data.billNumber,
                    supplierId: res.data.supplierId,
                    stockInPaymentMethod: res.data.stockInPaymentMethod,
                    stockInComment: res.data.stockInComment,
                    stockInDate: dayjs(res.data.stockInDate),
                    isFullEdit: isFullEdit
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
                    productName: res.data.productName,
                    productId: res.data.productId,
                    remainingStock: res.data.remainingStock,
                    productQty: res.data.productQty,
                    productUnit: res.data.productUnit,
                    stockOutCategory: res.data.stockOutCategory,
                    stockOutComment: res.data.stockOutComment,
                    stockOutDate: dayjs(res.data.stockOutDate)
                }))
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const handleAccordionOpenOnEdit = (data, isFullEdit) => {
        console.log('edit', data)
        if (tab === 1 || tab === '1') {
            fillStockInEdit(data, isFullEdit);
        }
        else {
            fillStockOutEdit(data)
        }
        setIsEdit(true)
        setExpanded(true)
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [stockInFormData, setStockInFormData] = React.useState({
        productId: "",
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
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        productQty: false,
        productName: false,
        productUnit: false,
        productPrice: false,
        totalPrice: false,
        supplierId: false,
        stockInPaymentMethod: false,
        stockInDate: false
    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'productQty',
        'productName',
        'productUnit',
        'productPrice',
        'totalPrice',
        'supplierId',
        'stockInPaymentMethod',
        'stockInDate'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
        productId: "",
        productQty: 0,
        productUnit: "",
        stockOutCategory: 0,
        stockOutComment: "",
        reason: "",
        stockOutDate: dayjs()
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        productQty: false,
        productUnit: false,
        stockOutCategory: false,
        reason: false,
        stockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'productQty',
        'productUnit',
        'stockOutCategory',
        'stockOutDate',
        'reason'
    ])
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const getCategoryList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlStockOutCategory`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const getProductList = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlProduct`, config)
            .then((res) => {
                setProductList(res.data);
            })
            .catch((error) => {
                //  setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setProductList(null)
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
    const stockIn = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addStockInDetails`, stockInFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                // getData();
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                setFilter(false)
                getProductList();
                getStockInData()
                handleResetStockIn();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const stockInEdit = async () => {
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/updateStockInTransaction`, stockInFormData, config)
            .then((res) => {
                setSuccess(true);
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
                getStockInData()
                handleResetStockIn();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

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
        console.log('formddds', stockInFormData)
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
    const submitStockIn = () => {
        if (loading || success) {

        } else {
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
                stockIn()
            }
        }
    }
    const editStockIn = () => {
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
    const handleProductNameAutoComplete = (event, value) => {
        setStockInFormData((prevState) => ({
            ...prevState,
            ['productName']: value,
            productId: value && value.productId ? value.productId : '',
            supplierId: '',
            productUnit: value && value.productUnit ? value.productUnit : ''
        }))
        setStockInFormDataError((prevState) => ({
            ...prevState,
            productName: value && value.productUnit ? false : true
        }))
        value && value.productId && getSuppilerList(value.productId)
        // console.log('formddds', stockInFormData)
    }
    const handleProductNameAutoCompleteOut = (event, value) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ['productName']: value,
            productId: value && value.productId ? value.productId : '',
            productUnit: value && value.productUnit ? value.productUnit : '',
            remainingStock: value && value.remainingStock ? value.remainingStock : 0
        }))
        setStockOutFormDataError((prevState) => ({
            ...prevState,
            productName: value && value.productUnit ? false : true
        }))
    }
    const handleResetStockIn = () => {
        setStockInFormData({
            productName: null,
            productId: "",
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
            productName: false,
            productPrice: false,
            totalPrice: false,
            supplierId: false,
            stockInPaymentMethod: false,
            stockInDate: false
        })
    }
    const handleResetStockOut = () => {
        setStockOutFormData({
            productId: "",
            productName: null,
            productQty: 0,
            productUnit: "",
            stockOutCategory: null,
            stockOutComment: "",
            stockOutDate: dayjs(),
            reason: ''
        })
        setStockOutFormDataError({
            productQty: false,
            productName: false,
            productUnit: false,
            stockOutCategory: false,
            stockInDate: false,
            reason: false
        })
    }
    const onChangeStockOut = (e) => {
        if (e.target.name === 'productQty') {
            if (e.target.value > stockOutFormData?.remainingStock) {
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
    const stockOut = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addStockOutDetails`, stockOutFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
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
                getProductList();
                getStockOutData();
                handleResetStockOut();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const stockOutEdit = async () => {
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/updateStockOutTransaction`, stockOutFormData, config)
            .then((res) => {
                setSuccess(true);
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
                else if (element === 'stockOutDate' && stockOutFormData[element] === '' || stockOutFormData[element] === null || stockOutFormData.stockOutDate == 'Invalid Date') {
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
                stockOut()
            }
        }
    }

    const editSubmitStockOut = () => {
        if (loading || success) {

        } else {
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

    const getStockInDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInList?&page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockInDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockInList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockInData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutEditDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getUpdateStockOutList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutEditdData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getUpdateStockOutList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}`, config)
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
        console.log("page change")
        if (tab === 2 || tab === '2') {
            if (filter) {
                getStockOutDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockOutDataOnPageChange(newPage + 1, rowsPerPage)
            }
        } else if (tab === 3 || tab === '3') {
            getStockOutEditDataOnPageChange(newPage + 1, rowsPerPage)
        } else {
            if (filter) {
                getStockInDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getStockInDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === '1' || tab === 1) {
            if (filter) {
                getStockInDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockInDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        } else if (tab === 3 || tab === '3') {
            getStockOutEditDataOnPageChange(1, parseInt(event.target.value, 10))
        } else {
            if (filter) {
                getStockOutDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getStockOutDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };
    const stockInExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${''}&endDate=${''}`,
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
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const stockOutExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockout?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockout?startDate=${''}&endDate=${''}`,
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

    const deleteStockIn = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeStockInTransaction?stockInId=${id}`, config)
            .then((res) => {
                setSuccess(true);
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
                setSuccess(true);
                getProductList();
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
    const deleteData = async () => {
        if (window.confirm('Are you sure you want to delete all edit history ....!')) {
            await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/emptyModifiedHistoryOfStockOut`, config)
                .then((res) => {
                    setPage(0);
                    setSuccess(true)
                    setRowsPerPage(5);
                    getStockOutEditdData();
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
    }
    const gotohistory = (id) => {
        navigate(`/editHistory/${id}`)
    }
    useEffect(() => {
        getCategoryList();
        getProductList();
        getStockInData();
        // getCountData();
    }, [])
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
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabIn' : 'productTab'}`} onClick={() => {
                                        setTab(1); setPage(0); setRowsPerPage(5); getStockInData(); setFilter(false);
                                        resetStockOutEdit();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Stock-In</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabOut' : 'productTab'}`} onClick={() => {
                                        setTab(2); setPage(0); setRowsPerPage(5); getStockOutData(); setFilter(false);
                                        resetStockInEdit();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Stock-Out</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTab(3); setStockOutData(); setPage(0); setRowsPerPage(5); setFilter(false);
                                        setExpanded(false);
                                        getStockOutEditdData();
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Edited Stock-Out</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {tab === 3 ?
                null : <div className='mt-6 grid grid-col-12'>
                    <Accordion expanded={expanded} square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}>
                        <AccordionSummary
                            sx={{ height: '60px', borderRadius: '0.75rem' }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            onClick={() => { setExpanded(!expanded); resetStockInEdit(); resetStockOutEdit(); }}
                        >
                            <div className='stockAccordinHeader'>{tab && tab === '1' || tab === 1 ? "Stock In" : "Stock Out"}</div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='stockInOutContainer'>
                                {tab === '1' || tab === 1 ?
                                    <div className='mt-6 grid grid-cols-12 gap-6'>
                                        <div className='col-span-3'>
                                            {!isEdit ?
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        defaultValue={null}
                                                        id='stockIn'
                                                        disablePortal
                                                        sx={{ width: '100%' }}
                                                        disabled={isEdit}
                                                        value={stockInFormData.productName ? stockInFormData.productName : null}
                                                        onChange={handleProductNameAutoComplete}
                                                        options={productList ? productList : []}
                                                        getOptionLabel={(options) => options.productName}
                                                        renderInput={(params) => <TextField inputRef={textFieldRef} {...params} label="Product Name" />}
                                                    />
                                                </FormControl>
                                                :
                                                <TextField
                                                    label="Product Name"
                                                    fullWidth
                                                    disabled
                                                    value={stockInFormData.productName ? stockInFormData.productName : ''}
                                                    name="productName"
                                                />}
                                        </div>
                                        <div className='col-span-2'>
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value < 0) {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            productQty: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            productQty: false
                                                        }))
                                                    }
                                                }}
                                                type="number"
                                                label="Qty"
                                                fullWidth
                                                onChange={(e) => {
                                                    if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                        onChangeStockIn(e)
                                                    }
                                                }}
                                                disabled={isEdit ? stockInFormData.isFullEdit ? false : true : false}
                                                value={stockInFormData.productQty}
                                                error={stockInFormDataError.productQty}
                                                helperText={stockInFormDataError.productQty ? "Enter Qty" : ''}
                                                name="productQty"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">{stockInFormData.productUnit}</InputAdornment>,
                                                }}
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value < 0) {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            productPrice: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            productPrice: false
                                                        }))
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                        onChangeStockIn(e)
                                                    }
                                                }}
                                                value={stockInFormData.productPrice === 'NaN' ? 0 : stockInFormData.productPrice}
                                                error={stockInFormDataError.productPrice}
                                                helperText={stockInFormDataError.productPrice ? "Enter Price" : ''}
                                                name="productPrice"
                                                id="outlined-required"
                                                label="Product Price"
                                                disabled={isEdit ? stockInFormData.isFullEdit ? false : true : false}
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value < 0) {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            totalPrice: true
                                                        }))
                                                    }
                                                    else {
                                                        setStockInFormDataError((perv) => ({
                                                            ...perv,
                                                            totalPrice: false
                                                        }))
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    // console.log('regex', regex, e.target.value, regex.test(e.target.value))
                                                    if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                        onChangeStockIn(e)
                                                    }
                                                }}
                                                value={stockInFormData.totalPrice === 'NaN' ? 0 : stockInFormData.totalPrice}
                                                error={stockInFormDataError.totalPrice}
                                                helperText={stockInFormDataError.totalPrice ? "Total Price" : ''}
                                                name="totalPrice"
                                                id="outlined-required"
                                                label="Total Price"
                                                disabled={isEdit ? stockInFormData.isFullEdit ? false : true : false}
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-3'>
                                            <TextField
                                                onChange={onChangeStockIn}
                                                value={stockInFormData.billNumber}
                                                name="billNumber"
                                                id="outlined-required"
                                                label="Bill Number"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-3'>
                                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" required error={stockInFormDataError.supplierId}>Suppiler</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={stockInFormData.supplierId}
                                                    error={stockInFormDataError.supplierId}
                                                    disabled={stockInFormData.productId ? false : true}
                                                    name="supplierId"
                                                    label="Suppiler"
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                supplierId: true
                                                            }))
                                                        }
                                                        else {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                supplierId: false
                                                            }))
                                                        }
                                                    }}
                                                    onChange={onChangeStockIn}
                                                >
                                                    {
                                                        suppiler ? suppiler.map((suppilerData) => (
                                                            <MenuItem key={suppilerData.supplierId} value={suppilerData.supplierId}>{suppilerData.supplierNickName}</MenuItem>
                                                        )) : null
                                                    }

                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className='col-span-2'>
                                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" error={stockInFormDataError.stockInPaymentMethod}>Payment</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={stockInFormData.stockInPaymentMethod}
                                                    error={stockInFormDataError.stockInPaymentMethod}
                                                    name="stockInPaymentMethod"
                                                    label="Payment"
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                stockInPaymentMethod: true
                                                            }))
                                                        }
                                                        else {
                                                            setStockInFormDataError((perv) => ({
                                                                ...perv,
                                                                stockInPaymentMethod: false
                                                            }))
                                                        }
                                                    }}
                                                    onChange={onChangeStockIn}
                                                >
                                                    <MenuItem key={'cash'} value={'cash'}>{'Cash'}</MenuItem>
                                                    <MenuItem key={'debit'} value={'debit'}>{'Debit'}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className='col-span-2'>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    textFieldStyle={{ width: '100%' }}
                                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                                    label="Stock In Date"
                                                    format="DD/MM/YYYY"
                                                    required
                                                    error={stockInFormDataError.stockInDate}
                                                    value={stockInFormData.stockInDate}
                                                    onChange={handleStockInDate}
                                                    name="stockInDate"
                                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        <div className='col-span-5'>
                                            <TextField
                                                onChange={onChangeStockIn}
                                                value={stockInFormData.stockInComment}
                                                name="stockInComment"
                                                id="outlined-required"
                                                label="Comment"
                                                InputProps={{ style: { fontSize: 14 } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                fullWidth
                                            />
                                        </div>
                                        <div className='col-span-2 col-start-9'>
                                            <button className='addCategorySaveBtn' onClick={() => {
                                                isEdit ? editStockIn() : submitStockIn()
                                            }}>{isEdit ? "Save" : "Stock In"}</button>
                                        </div>
                                        <div className='col-span-2'>
                                            <button className='addCategoryCancleBtn' onClick={() => {
                                                handleResetStockIn();
                                                setIsEdit(false);
                                                { isEdit && setExpanded(false); }
                                            }}>{isEdit ? 'Cancle' : 'Reset'}</button>
                                        </div>
                                    </div>
                                    :
                                    <div className='mt-6 grid grid-cols-12 gap-6'>
                                        <div className='col-span-3'>
                                            {!isEdit ?
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        disablePortal
                                                        defaultValue={null}
                                                        id='stockOut'
                                                        disabled={isEdit}
                                                        sx={{ width: '100%' }}
                                                        value={stockOutFormData.productName ? stockOutFormData.productName : null}
                                                        onChange={handleProductNameAutoCompleteOut}
                                                        options={productList ? productList : []}
                                                        getOptionLabel={(options) => options.productName}
                                                        renderInput={(params) => <TextField {...params} inputRef={textFieldRef} label="Product Name" />}
                                                    />
                                                </FormControl>
                                                :
                                                <TextField
                                                    label="Product Name"
                                                    fullWidth
                                                    disabled
                                                    value={stockOutFormData.productName ? stockOutFormData.productName : ''}
                                                    name="productName"
                                                />
                                            }
                                        </div>
                                        <div className='col-span-3'>
                                            <TextField
                                                onBlur={(e) => {
                                                    if (e.target.value < 0 || e.target.value > stockOutFormData?.remainingStock) {
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
                                                disabled={!stockOutFormData.productName}
                                                onChange={onChangeStockOut}
                                                value={stockOutFormData.productQty}
                                                error={stockOutFormDataError.productQty}
                                                helperText={stockOutFormData.productName && !stockOutFormDataError.productQty ? `Remaining Stock:-  ${stockOutFormData?.remainingStock}  ${stockOutFormData.productUnit}` : stockOutFormDataError.productQty ? stockOutFormDataError.productQty && stockOutFormData.productQty > stockOutFormData?.remainingStock ? `StockOut qty can't be more than ${stockOutFormData?.remainingStock}  ${stockOutFormData.productUnit}` : "Please Enter Qty" : ''}
                                                name="productQty"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">{stockOutFormData.productUnit}</InputAdornment>,
                                                }}
                                            />
                                        </div>
                                        <div className='col-span-4'>
                                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-label" required error={stockOutFormDataError.stockOutCategory}>Category</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    defaultValue={null}
                                                    value={stockOutFormData.stockOutCategory ? stockOutFormData.stockOutCategory : ''}
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
                                                    label="Stock In Date"
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
                                                value={stockOutFormData.stockOutComment ? stockOutFormData.stockOutComment : ''}
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
                                                {
                                                    isEdit && setExpanded(false);
                                                }
                                            }}>{isEdit ? "cancle" : "reset"}</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            }

            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='ml-6 col-span-6' >
                                {tab != 3 &&
                                    <>
                                        <div className='flex'>
                                            <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                                <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                            </div>
                                            <div className='resetBtnWrap col-span-3'>
                                                <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                    setFilter(false);
                                                    tab === 1 || tab === '1' ?
                                                        getStockInData() : getStockOutData();
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
                                                        <button className='stockInBtn' onClick={() => { tab === 1 || tab === '1' ? getStockInDataByFilter() : getStockOutDataByFilter(); setFilter(true); setPage(0); handleClose() }}>Apply</button>
                                                    </div>
                                                    <div className='col-span-3'>
                                                        <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                    </div>
                                                </div>
                                            </Box>
                                        </Popover>
                                    </>
                                }
                            </div>
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                {tab != 3 ?
                                    <button className='exportExcelBtn' onClick={() => { tab === 1 || tab === '1' ? stockInExportExcel() : stockOutExportExcel() }}><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>
                                    :
                                    <button className='exportExcelBtn' onClick={deleteData}><CloseIcon />&nbsp;&nbsp;Delete All Updated</button>
                                }</div>
                        </div>
                        {tab === 1 || tab === '1' ?
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Entered By</TableCell>
                                                <TableCell align="left">Product Name</TableCell>
                                                <TableCell align="left">Qty</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Total Price</TableCell>
                                                <TableCell align="left">Bill No.</TableCell>
                                                <TableCell align="left">Supplier</TableCell>
                                                <TableCell align="left">Pay Mode</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left"></TableCell>
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
                                                        <TableCell align="right" >{parseFloat(row.productPrice ? row.productPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="right" >{parseFloat(row.totalPrice ? row.totalPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left" >{row.billNumber}</TableCell>
                                                        <TableCell align="left" >{row.supplier}</TableCell>
                                                        <TableCell align="left" >{row.stockInPaymentMethod}</TableCell>
                                                        <Tooltip title={row.stockInComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.stockInComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.stockInDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} stockInOutId={row.stockInId} data={row} deleteStockInOut={handleDeleteStockIn} setError={setError} />
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
                            </div> :
                            tab === 2 || tab === '2' ?
                                <div className='tableContainerWrapper'>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>No.</TableCell>
                                                    <TableCell>Out By</TableCell>
                                                    <TableCell align="left">Product Name</TableCell>
                                                    <TableCell align="left">Quantity</TableCell>
                                                    <TableCell align="left">Stock OutPrice</TableCell>
                                                    <TableCell align="left">Category</TableCell>
                                                    <TableCell align="left">Comment</TableCell>
                                                    <TableCell align="left">Date</TableCell>
                                                    <TableCell align="left"></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    stockOutData?.map((row, index) => (
                                                        totalRowsOut !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.stockOutId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left"  >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <Tooltip title={row.userName} placement="top-start" arrow>
                                                                    <TableCell component="th" scope="row"  >
                                                                        {row.outBy}
                                                                    </TableCell>
                                                                </Tooltip>
                                                                <TableCell align="left"  >{row.productName}</TableCell>
                                                                <TableCell align="left"  >{row.Quantity}</TableCell>
                                                                <TableCell align="left" >{parseFloat(row.stockOutPrice ? row.stockOutPrice : 0).toLocaleString('en-IN')}</TableCell>
                                                                <TableCell align="left"  >{row.stockOutCategoryName}</TableCell>
                                                                <Tooltip title={row.stockOutComment} placement="top-start" arrow><TableCell align="left"  ><div className='Comment'>{row.stockOutComment}</div></TableCell></Tooltip>
                                                                <TableCell align="left"   >{row.stockOutDate}</TableCell>
                                                                {tab != 3 &&
                                                                    <TableCell align="right">
                                                                        <MenuStockInOut handleAccordionOpenOnEdit={handleAccordionOpenOnEdit} stockInOutId={row.stockOutId} data={row} deleteStockInOut={handleDeleteStockOut} />
                                                                    </TableCell>}
                                                            </TableRow> :
                                                            <TableRow
                                                                key={row.userId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                            </TableRow>

                                                    ))
                                                }
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
                                                {
                                                    stockOutData?.map((row, index) => (
                                                        totalRowsOut !== 0 ?
                                                            <TableRow
                                                                hover
                                                                key={row.stockOutId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                style={{ cursor: "pointer" }}
                                                                className='tableRow'
                                                            >
                                                                <TableCell align="left" onClick={() => { gotohistory(row.stockOutId) }}>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                                <Tooltip title={row.userName} placement="top-start" arrow>
                                                                    <TableCell component="th" scope="row" onClick={() => { gotohistory(row.stockOutId) }}>
                                                                        {row.outBy}
                                                                    </TableCell>
                                                                </Tooltip>
                                                                <TableCell align="left" onClick={() => { gotohistory(row.stockOutId) }}>{row.productName}</TableCell>
                                                                <TableCell align="left" onClick={() => { gotohistory(row.stockOutId) }}>{row.Quantity}</TableCell>
                                                                <TableCell align="left" onClick={() => { gotohistory(row.stockOutId) }}>{row.stockOutCategoryName}</TableCell>
                                                                <Tooltip title={row.stockOutComment} placement="top-start" arrow><TableCell align="left" onClick={() => { gotohistory(row.stockOutId) }}><div className='Comment'>{row.stockOutComment}</div></TableCell></Tooltip>
                                                                <TableCell align="left" onClick={() => { gotohistory(row.stockOutId) }} >{row.stockOutDate}</TableCell>
                                                            </TableRow> :
                                                            <TableRow
                                                                key={row.userId}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                            </TableRow>

                                                    ))
                                                }
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

export default StockInOut;
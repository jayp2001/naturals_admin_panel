import './stockOut.css';
import * as React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useRef } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
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
import MenuStockInOut from './menu';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';

function StockOut() {
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
    const [totalRowsProduct, setTotalRowsProduct] = React.useState(0);
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
    const [allData, setAllData] = React.useState();
    const [status, setStatus] = React.useState('');
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const [searchWord, setSearchWord] = React.useState('');
    const resetStockOutEdit = () => {
        setStockOutFormData({
            productId: "",
            productQty: 0,
            productName: null,
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

    const handleAccordionOpenOnEdit = (data) => {
        console.log('edit', data)
        fillStockOutEdit(data)
        setIsEdit(true)
        setExpanded(true)
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
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
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["stockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleProductNameAutoCompleteOut = (event, value) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ['productName']: value,
            productId: value && value.productId ? value.productId : '',
            productUnit: value && value.productUnit ? value.productUnit : '',
            remainingStock: value && value.remainingStock ? value.remainingStock : ''
        }))
    }
    const handleResetStockOut = () => {
        setStockOutFormData({
            productName: null,
            reason: "",
            productId: "",
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
                setFilter(false);
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
                stockOut()
            }
        }
    }

    const editSubmitStockOut = () => {
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
                stockOutEdit()
            }
        }
    }
    const getAllDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?page=${pageNum}&numPerPage=${rowPerPageNum}&productStatus=${status}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRowsProduct(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutDataOnPageChange = async (pageNum, rowPerPageNum) => {
        let startDAte = new Date()
        startDAte.setDate(new Date().getDate() - 7)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?startDate=${startDAte}&endDate=${new Date()}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setStockOutData(res.data.rows);
                setTotalRowsOut(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStockOutData = async () => {
        let startDAte = new Date()
        startDAte.setDate(new Date().getDate() - 7)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getStockOutList?startDate=${startDAte}&endDate=${new Date()}&page=${page + 1}&numPerPage=${rowsPerPage}`, config)
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
        if (tab === 1 || tab === '1') {
            getStockOutDataOnPageChange(newPage + 1, rowsPerPage)
        }
        else {
            getAllDataOnPageChange(newPage + 1, rowsPerPage)
        }
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === 1 || tab === '1') {
            getStockOutDataOnPageChange(1, parseInt(event.target.value, 10))
        }
        else {
            getAllDataOnPageChange(1, parseInt(event.target.value, 10))
        }
    };
    const onChangeStatus = (e) => {
        setSearchWord('')
        setStatus(e.target.value);
        setPage(0);
        setRowsPerPage(5)
        getAllDataByStatus(e.target.value)
    }
    const deleteStockOut = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeStockOutTransaction?stockOutId=${id}`, config)
            .then((res) => {
                setSuccess(true);
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
    };
    const getAllData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?&page=${1}&numPerPage=${10}&productStatus=${status}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRowsProduct(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
    }
    const getAllDataByStatus = async (status) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?&page=${1}&numPerPage=${10}&productStatus=${status}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRowsProduct(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
    }
    useEffect(() => {
        getCategoryList();
        getProductList();
        getStockOutData();
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
    const search = async (searchWord) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getProductDetailsTable?page=${1}&numPerPage=${10}&searchProduct=${searchWord}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRowsProduct(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
    }
    const onSearchChange = (e) => {
        setStatus('')
        setSearchWord(e.target.value);
    }
    const debounce = (func) => {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args)
            }, 700)
        }

    }

    // const handleViewDetail = (id) => {
    //     navigate(`/stockManager/productDetail/${id}`)
    // }
    const handleViewDetail = (id, name, unit, remainingQty) => {
        navigate(`/stockManager/productDetail/${id}/${name}/${unit}/${remainingQty}`)
    }

    const handleSearch = () => {
        console.log(':::???:::', document.getElementById('searchWord').value)
        search(document.getElementById('searchWord').value)
    }

    const debounceFunction = React.useCallback(debounce(handleSearch), [])
    return (
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-12  tablet1:col-span-4  tablet:col-span-3  laptop:col-span-3  desktop1:col-span-5  desktop2:col-span-5  desktop2:col-span-5. '>
                                <div className='grid grid-cols-12 pl-6 pr-6 gap-3 h-full'>
                                    <div className={`flex col-span-6 justify-center ${tab === 1 || tab === '1' ? 'productTabAll' : 'productTab'} `} onClick={() => {
                                        setTab(1);
                                        setPage(0);
                                        getStockOutData();
                                        setRowsPerPage(10);
                                        setSearchWord('');
                                        setStatus('')
                                    }}>
                                        Stock-Out
                                    </div>
                                    <div className={`flex col-span-6 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'} `} onClick={() => {
                                        setTab(2);
                                        getAllData();
                                        setPage(0);
                                        setStatus('')
                                        setRowsPerPage(10);
                                        setSearchWord('')
                                    }}>
                                        Product List
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {tab === 1 || tab === '1' ?
                <div className='mt-6 grid grid-col-12'>
                    <Accordion expanded={expanded} square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}>
                        <AccordionSummary
                            sx={{ height: '60px', borderRadius: '0.75rem' }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            onClick={() => { setExpanded(!expanded); resetStockOutEdit(); }}
                        >
                            <div className='stockAccordinHeader'>Stock Out</div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='stockInOutContainer'>
                                <div className='mt-6 grid grid-cols-12 gap-6'>
                                    <div className='col-span-3'>
                                        {!isEdit ?
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    disablePortal
                                                    id='stockOut'
                                                    defaultValue={null}
                                                    disabled={isEdit}
                                                    sx={{ width: '100%' }}
                                                    value={stockOutFormData.productName ? stockOutFormData.productName : null}
                                                    onChange={handleProductNameAutoCompleteOut}
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
                                                sx={{ width: '100%' }}
                                                InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                label="Stock In Date"
                                                format="DD/MM/YYYY"
                                                required
                                                fullWidth
                                                error={stockOutFormDataError.stockOutDate}
                                                value={stockOutFormData.stockOutDate}
                                                onChange={handleStockOutDate}
                                                name="stockOutDate"
                                                renderInput={(params) => <TextField {...params} fullWidth sx={{ width: '100%' }} />}
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
                                            { isEdit && setExpanded(false); }
                                        }}>{isEdit ? "cancle" : "reset"}</button>
                                    </div>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div> : null
            }
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    {tab === 1 || tab === '1' ?
                        <div className='userTableSubContainer'>
                            <div className='grid grid-cols-12 pt-6'>
                                <div className='ml-6 col-span-6' >
                                </div>
                                <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                </div>
                            </div>
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Out By</TableCell>
                                                <TableCell align="left">Product Name</TableCell>
                                                <TableCell align="left">Quantity</TableCell>
                                                <TableCell align="left">stockOutPrice</TableCell>
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
                                                            <TableCell align="left" >{row.stockOutPrice}</TableCell>
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
                            </div>
                        </div>
                        :
                        <div className='userTableSubContainer'>
                            <div className='grid grid-cols-12 gap-6 pt-6'>
                                <div className='ml-6 col-span-6 ' >
                                    {status != 1 && status != 2 && status != 3 ?
                                        <TextField
                                            className='sarchText'
                                            onChange={(e) => { onSearchChange(e); debounceFunction() }}
                                            value={searchWord}
                                            name="searchWord"
                                            id="searchWord"
                                            variant="standard"
                                            label="Search"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                                                style: { fontSize: 14 }
                                            }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        /> : null
                                    }

                                </div>
                                <div className='col-span-6 pr-4'>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Stock Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={status}
                                            label="Service Authority"
                                            name="serviceAuthority"
                                            onChange={onChangeStatus}
                                        >
                                            <MenuItem value={''}>Clear</MenuItem>
                                            <MenuItem value={1}>In-Stock</MenuItem>
                                            <MenuItem value={2}>Low-Stock</MenuItem>
                                            <MenuItem value={3}>Out-Stock</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell align="left">Remaining Stock</TableCell>
                                                <TableCell align="left">Min ProductQty</TableCell>
                                                <TableCell align="left">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allData?.map((row, index) => (
                                                totalRowsProduct !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.productId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                        onClick={() => handleViewDetail(row.productId, row.productName, row.minProductUnit, row.remainingStock)}
                                                    >
                                                        <TableCell align="left"  >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell component="th" scope="row"  >
                                                            {row.productName}
                                                        </TableCell>
                                                        <TableCell align="left"  >{row.remainingStock} {row.minProductUnit}</TableCell>
                                                        <TableCell align="left"  >{row.minProductQty} {row.minProductUnit}</TableCell>
                                                        <TableCell align="center"  ><div className={row.remainingStock >= row.minProductQty ? 'greenStatus' : row.remainingStock < row.minProductQty && row.remainingStock !== 0 ? 'orangeStatus' : 'redStatus'}>{row.stockStatus}</div></TableCell>
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
                                        rowsPerPageOptions={[10, 25, 50]}
                                        component="div"
                                        count={totalRowsProduct}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default StockOut;
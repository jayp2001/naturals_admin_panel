import './hotelTable.css';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
// import ProductCard from './component/productCard/productCard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from "react-router-dom";
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
import Tooltip from '@mui/material/Tooltip';
import Menutemp from './menu';
import { ToastContainer, toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import PercentIcon from '@mui/icons-material/Percent';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const style = {
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

function HotelTable() {
    // const regex = /^\d*(?:\.\d*)?$/;
    const regex = /^[0-9\b]+$/;
    const textFieldRef = useRef(null);

    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'F10') {
                handleOpen()
                console.log('Enter key pressed');
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [searchWord, setSearchWord] = React.useState('');
    const [filter, setFilter] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsOut, setTotalRowsOut] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [formData, setFormData] = React.useState({
        productName: '',
        productId: '',
        minProductQty: 0,
        minProductUnit: ''
    })
    const [addHotelFormData, setAddHotelFormData] = React.useState({
        hotelName: '',
        hotelAddress: '',
        hotelLocality: '',
        hotelPincode: '',
        hotelMobileNo: '',
        otherMobileNo: '',
        payType: 'cash',
        discountType: 'none',
        discount: '',
    })
    const [stockInFormDataError, setStockInFormDataError] = React.useState({
        hotelName: false,
        hotelMobileNo: false,

    })
    const [stockInErrorFields, setStockInErrorFields] = React.useState([
        'hotelName',
        'hotelMobileNo',
        'discount'
    ])
    const [stockOutFormData, setStockOutFormData] = React.useState({
        productId: "",
        productQty: 0,
        productUnit: "",
        stockOutCategory: 0,
        stockOutComment: "",
        stockOutDate: dayjs()
    })
    const [stockOutFormDataError, setStockOutFormDataError] = React.useState({
        productQty: false,
        productUnit: false,
        stockOutCategory: false,
        stockOutDate: false
    })
    const [stockOutErrorFields, setStockOutErrorFields] = React.useState([
        'productQty',
        'productUnit',
        'stockOutCategory',
        'stockOutDate',
    ])
    const [tab, setTab] = React.useState(null);
    const [isEdit, setIsEdit] = React.useState(false);
    const [formDataError, setFormDataError] = useState({
        productName: false,
        minProductQty: false,
        minProductUnit: false,
    })
    const [fields, setFields] = useState([
        'productName',
        'minProductQty',
        'minProductUnit',
    ])

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [openM, setOpenM] = React.useState(false);
    const [openAddHotel, setOpenAddHotel] = React.useState(false);
    const [openStockOut, setOpenStockOut] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [allData, setAllData] = React.useState();
    const [suppiler, setSuppilerList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [countData, setCountData] = React.useState();
    const getSuppilerList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/productWiseSupplierDDL?productId=${id}`, config)
            .then((res) => {
                setSuppilerList(res.data);
            })
            .catch((error) => {
                setSuppilerList(['No Data'])
            })
    }
    const getCategoryList = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/ddlStockOutCategory`, config)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                setCategories(['No Data'])
            })
    }
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const onChangeStockIn = (e) => {
        if (e.target.name === 'productPrice' && addHotelFormData.productQty > 0) {
            setAddHotelFormData((prevState) => ({
                ...prevState,
                productPrice: e.target.value,
                totalPrice: (parseFloat(e.target.value) * parseFloat(addHotelFormData.productQty)).toFixed(2).toString()

            }))
        } else if (e.target.name === 'totalPrice' && addHotelFormData.productQty > 0) {
            setAddHotelFormData((prevState) => ({
                ...prevState,
                totalPrice: e.target.value,
                productPrice: (parseFloat(e.target.value) / parseFloat(addHotelFormData.productQty)).toFixed(2).toString()

            }))
        }
        else if (e.target.name === 'productQty' && addHotelFormData.productPrice > 0) {
            setAddHotelFormData((prevState) => ({
                ...prevState,
                productQty: e.target.value,
                totalPrice: (parseFloat(e.target.value) * parseFloat(addHotelFormData.productPrice)).toString()

            }))
        }
        else {
            setAddHotelFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
        console.log('formddds', addHotelFormData)
    }
    const onChangeStockOut = (e) => {
        if (e.target.name === 'productQty') {
            if (e.target.value > stockOutFormData.remainingStock) {
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
    const handleOpen = () => setOpenM(true);
    const openHotelAdd = () => {
        setOpenAddHotel(true);
    }
    const handleOpenStockOut = (row) => {
        getCategoryList();
        setStockOutFormData((perv) => ({
            ...perv,
            productId: row.productId,
            productName: row.productName,
            productUnit: row.minProductUnit,
            remainingStock: row.remainingStock
        }))
        setOpenStockOut(true);
    }
    const handleCloseDate = () => {
        setAnchorEl(null);
    };
    const handleReset = () => {
        setFormData({
            stockOutCategoryName: '',
            stockOutCategoryId: ''
        });
        setIsEdit(false);
    }
    const handleClose = () => {
        setOpenM(false);
        // setCategory('');
        // setCategoryError(false);
        setFormData({
            stockOutCategoryName: '',
            stockOutCategoryId: ''
        });
        setIsEdit(false);
    }
    const handleCloseAddHotel = () => {
        setIsEdit(false);
        setAddHotelFormData({
            hotelName: '',
            hotelAddress: '',
            hotelLocality: '',
            hotelPincode: '',
            hotelMobileNo: '',
            otherMobileNo: '',
            payType: 'cash',
            discountType: 'none',
            discount: '',
        })
        setStockInFormDataError({
            hotelName: false,
            hotelAddress: false,
            hotelLocality: false,
            hotelMobileNo: false,
        })
        setOpenAddHotel(false);
    }
    const handleStockInDate = (date) => {
        setAddHotelFormData((prevState) => ({
            ...prevState,
            ["stockInDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };

    const handleCloseStockOut = () => {
        setStockOutFormData({
            productId: "",
            productQty: 0,
            productUnit: "",
            stockOutCategory: 0,
            stockOutComment: "",
            stockOutDate: dayjs()
        })
        setStockOutFormDataError({
            productQty: false,
            productUnit: false,
            stockOutCategory: false,
            stockInDate: false
        })
        setOpenStockOut(false);
    }
    const handleStockOutDate = (date) => {
        setStockOutFormData((prevState) => ({
            ...prevState,
            ["stockOutDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const getAllData = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getHotelList?page=${1}&numPerPage=${10}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
    }
    // const getCountData = async () => {
    //     await axios.get(`${BACKEND_BASE_URL}billingrouter/getProductListCounter`, config)
    //         .then((res) => {
    //             setCountData(res.data);
    //         })
    //         .catch((error) => {
    //             setError(error.response ? error.response.data : "Network Error ...!!!")
    //         })
    // }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}billingrouter/removeHotelData?hotelId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                setPage(0);
                setTab('')
                setRowsPerPage(10);
                setFilter(false);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                // getCountData();
                getAllData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    useEffect(() => {
        getAllData();
        // getCountData();
    }, [])
    const handleDeleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete Hotel?")) {
            deleteData(id);
        }
    }
    const editCategory = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}billingrouter/updateProduct`, formData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                setTab('')
                setPage(0);
                setRowsPerPage(10);
                setFilter(false);
                setState([
                    {
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection'
                    }
                ])
                getAllData();
                // getCountData();
                handleClose()
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })

    }
    const addProduct = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}billingrouter/addProduct`, formData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false)
                getAllData();
                setTab(null)
                // getCountData();
                handleReset();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addHotel = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}billingrouter/addHotelData`, addHotelFormData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setTab('')
                setPage(0);
                setRowsPerPage(10);
                // setFilter(false);
                // setState([
                //     {
                //         startDate: new Date(),
                //         endDate: new Date(),
                //         key: 'selection'
                //     }
                // ])
                // getCountData();
                getAllData();
                setIsEdit(false);
                setAddHotelFormData({
                    hotelName: '',
                    hotelAddress: '',
                    hotelLocality: '',
                    hotelPincode: '',
                    hotelMobileNo: '',
                    otherMobileNo: '',
                    payType: 'cash',
                    discountType: 'none',
                    discount: '',
                })
                setStockInFormDataError({
                    hotelName: false,
                    hotelAddress: false,
                    hotelLocality: false,
                    hotelMobileNo: false,
                })
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editHotel = async () => {
        setLoading(true)
        await axios.post(`${BACKEND_BASE_URL}billingrouter/updateHotelData`, addHotelFormData, config)
            .then((res) => {
                setSuccess(true);
                setLoading(false);
                setTab('')
                setPage(0);
                setRowsPerPage(10);
                // setFilter(false);
                // setState([
                //     {
                //         startDate: new Date(),
                //         endDate: new Date(),
                //         key: 'selection'
                //     }
                // ])
                // getCountData();
                getAllData();
                handleCloseAddHotel();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const onSearchChange = (e) => {
        setSearchWord(e.target.value);
    }

    const submitAddHotel = () => {
        if (loading || success) {

        } else {
            const isValidate = stockInErrorFields.filter(element => {
                if (element === 'discount' && (addHotelFormData.discountType != 'none' && (addHotelFormData[element] === '' || addHotelFormData[element] === null))) {
                    if (addHotelFormData.discount <= 0) {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    } else {
                        setStockInFormDataError((perv) => ({
                            ...perv,
                            [element]: false
                        }))
                    }
                }
                else if (stockInFormDataError[element] === true || addHotelFormData[element] === '' || addHotelFormData[element] === 0) {
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
                // console.log(">>", addHotelFormData, addHotelFormData.stockInDate, addHotelFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                addHotel()
            }
        }
    }
    const submitEditHotel = () => {
        if (loading || success) {

        } else {
            const isValidate = stockInErrorFields.filter(element => {
                if (element === 'stockInDate' && addHotelFormData[element] === '' || addHotelFormData[element] === null || addHotelFormData.stockInDate == 'Invalid Date') {
                    setStockInFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
                else if (stockInFormDataError[element] === true || addHotelFormData[element] === '' || addHotelFormData[element] === 0) {
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
                // console.log(">>", addHotelFormData, addHotelFormData.stockInDate, addHotelFormData.stockInDate != 'Invalid Date' ? 'ue' : 'false')
                editHotel()
            }
        }
    }

    const handleEditClick = (row) => {
        setOpenAddHotel(true);
        setIsEdit(true)
        setAddHotelFormData(row)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const getAllDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getHotelList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        getAllDataOnPageChange(newPage + 1, rowsPerPage)
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getAllDataOnPageChange(1, parseInt(event.target.value, 10))
    };
    const productExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}billingrouter/exportExcelSheetForProductTable?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}billingrouter/exportExcelSheetForProductTable?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Products_' + new Date().toLocaleDateString() + '.xlsx'
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
    const search = async (searchWord) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getHotelList?page=${1}&numPerPage=${10}&searchWord=${searchWord}`, config)
            .then((res) => {
                setAllData(res.data.rows);
                setTotalRows(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setAllData(null)
            })
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
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === null || tab === '' || !tab ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTab('');
                                        setPage(0);
                                        setRowsPerPage(10);
                                        setSearchWord('')
                                        setFilter(false);
                                        getAllData()
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Hotels</div>
                                    </div>
                                    {/* <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabIn' : 'productTab'} `} onClick={() => {
                                        setTab(1);
                                        setFilter(false);
                                        setPage(0);
                                        setRowsPerPage(10);
                                        setSearchWord('')
                                        getAllDataByTab(1);
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>In-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 1 || tab === '1' ? 'greenCount' : ''} `}>{countData && countData.instockProduct ? countData.instockProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabUnder' : 'productTab'} `} onClick={() => {
                                        setTab(2);
                                        setFilter(false);
                                        setPage(0);
                                        setRowsPerPage(10);
                                        setSearchWord('')
                                        getAllDataByTab(2);
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Low-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 2 || tab === '2' ? 'orangeCount' : ''} `}>{countData && countData.underStockedProduct ? countData.underStockedProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabOut' : 'productTab'} `} onClick={() => {
                                        setTab(3);
                                        setFilter(false);
                                        setPage(0);
                                        setRowsPerPage(10);
                                        setSearchWord('')
                                        getAllDataByTab(3);
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}>
                                        <div className='statusTabtext'>Out-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 3 || tab === '3' ? 'redCount' : ''} `}>{countData && countData.outOfStock ? countData.outOfStock : 0}</div>
                                    </div> */}
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3 flex h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={openHotelAdd}>Add Hotel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='productCardContainer mt-8 gap-6 grid mobile:grid-cols-2 tablet1:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 desktop1:grid-cols-6 desktop2:grid-cols-7 desktop2:grid-cols-8'>
                {
                    data ? data.map((product) => (
                        <ProductCard productData={product} handleViewDetail={handleViewDetail} handleOpenStockOut={handleOpenStockOut} openHotelAdd={openHotelAdd} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} />
                    ))
                        :
                        <div className='grid col-span-5 content-center'>
                            <div className='text-center noDataFoundText'>
                                {error ? error : 'No Data Found'}
                            </div>
                        </div>
                }
            </div> */}
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='col-span-3 ml-6'>
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
                                />
                            </div>
                            {/* <div className='col-span-4 col-start-9 pr-5 flex justify-end'>
                                {tab === 1 || tab === '1' || tab === 2 || tab === '2' || tab === 3 || tab === '3' ? null : <button className='exportExcelBtn' onClick={productExportExcel}><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>}
                            </div> */}
                        </div>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell >No.</TableCell>
                                            <TableCell>Hotel Name</TableCell>
                                            <TableCell align="left">Hotel Address</TableCell>
                                            <TableCell align="left">Hotel Locality</TableCell>
                                            <TableCell align="left">Hotel Pincode</TableCell>
                                            <TableCell align="left">Mobile No.</TableCell>
                                            <TableCell align="left">Other Mobile No.</TableCell>
                                            <TableCell align="left">Payment Type</TableCell>
                                            <TableCell align="left">Discount Type</TableCell>
                                            <TableCell align="left">Discount</TableCell>
                                            <TableCell align="left"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allData?.map((row, index) => (
                                            totalRows !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.hotelId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    style={{ cursor: "pointer" }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                    <TableCell component="th" scope="row" onClick={() => navigate(`/hotel/hotelDetails/${row.hotelId}`)}>
                                                        {row.hotelName}
                                                    </TableCell>
                                                    {/* </Tooltip> */}
                                                    <TableCell align="left" onClick={() => navigate(`/hotel/hotelDetails/${row.hotelId}`)}>{row.hotelAddress}</TableCell>
                                                    <TableCell align="left" onClick={() => navigate(`/hotel/hotelDetails/${row.hotelId}`)}>{row.hotelLocality}</TableCell>
                                                    <TableCell align="left" onClick={() => navigate(`/hotel/hotelDetails/${row.hotelId}`)}>{row.hotelPincode}</TableCell>
                                                    <TableCell align="left" onClick={() => navigate(`/hotel/hotelDetails/${row.hotelId}`)}>{row.hotelMobileNo}</TableCell>
                                                    <TableCell align="left" onClick={() => navigate(`/hotel/hotelDetails/${row.hotelId}`)}>{row.otherMobileNo}</TableCell>
                                                    <TableCell align="left" onClick={() => navigate(`/hotel/hotelDetails/${row.hotelId}`)}>{row.payType}</TableCell>
                                                    <TableCell align="left" onClick={() => navigate(`/hotel/hotelDetails/${row.hotelId}`)}>{row.discountType}</TableCell>
                                                    <TableCell align="left" onClick={() => navigate(`/hotel/hotelDetails/${row.hotelId}`)}>{row.discountView}</TableCell>
                                                    <TableCell align="right">
                                                        <Menutemp productId={row.productId} data={row} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} />
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
                                    rowsPerPageOptions={[10, 25, 50]}
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
            </div>
            <Modal
                open={openAddHotel}
                onClose={handleCloseAddHotel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        {isEdit ? 'Add Hotel' : 'Edit Hotel'}
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value || e.target.value == '') {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            hotelName: true
                                        }))
                                    }
                                    else {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            hotelName: false
                                        }))
                                    }
                                }}
                                value={addHotelFormData.hotelName}
                                error={stockInFormDataError.hotelName}
                                helperText={stockInFormDataError.hotelName ? "Enter Hotel Name" : ''}
                                name="hotelName"
                                id="outlined-required"
                                inputRef={textFieldRef}
                                label="Hotel Name"
                                onChange={onChangeStockIn}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value || e.target.value == '') {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            hotelMobileNo: true
                                        }))
                                    }
                                    else {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            hotelMobileNo: false
                                        }))
                                    }
                                }}
                                value={addHotelFormData.hotelMobileNo}
                                error={stockInFormDataError.hotelMobileNo}
                                helperText={stockInFormDataError.hotelMobileNo ? "Enter Hotel Number" : ''}
                                name="hotelMobileNo"
                                id="outlined-required"
                                label="Hotel Mobile No"
                                onChange={
                                    (e) => {
                                        if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                            onChangeStockIn(e)
                                        }
                                    }
                                }
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-4'>
                            <TextField
                                value={addHotelFormData.otherMobileNo}
                                name="otherMobileNo"
                                id="outlined-required"
                                label="Other Mobile No"
                                onChange={
                                    (e) => {
                                        if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                            onChangeStockIn(e)
                                        }
                                    }
                                }
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-8'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value || e.target.value == '') {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            hotelAddress: true
                                        }))
                                    }
                                    else {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            hotelAddress: false
                                        }))
                                    }
                                }}
                                value={addHotelFormData.hotelAddress}
                                // error={stockInFormDataError.hotelAddress}
                                // helperText={stockInFormDataError.hotelAddress ? "Enter Hotel Address" : ''}
                                name="hotelAddress"
                                id="outlined-required"
                                label="Hotel Address"
                                onChange={onChangeStockIn}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value || e.target.value == '') {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            hotelLocality: true
                                        }))
                                    }
                                    else {
                                        setStockInFormDataError((perv) => ({
                                            ...perv,
                                            hotelLocality: false
                                        }))
                                    }
                                }}
                                value={addHotelFormData.hotelLocality}
                                // error={stockInFormDataError.hotelLocality}
                                // helperText={stockInFormDataError.hotelLocality ? "Enter Hotel Locality" : ''}
                                name="hotelLocality"
                                id="outlined-required"
                                label="Hotel Locality"
                                onChange={onChangeStockIn}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-2'>
                            <TextField
                                value={addHotelFormData.hotelPincode}
                                // error={stockInFormDataError.hotelPincode}
                                // helperText={stockInFormDataError.hotelPincode ? "Enter Hotel Pincode" : ''}
                                name="hotelPincode"
                                id="outlined-required"
                                label="Pincode"
                                onChange={onChangeStockIn}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required >Payment Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={addHotelFormData.payType}
                                    name="payType"
                                    label="Payment Type"
                                    onChange={onChangeStockIn}
                                >
                                    <MenuItem key={'CASH'} value={'cash'}>{'CASH'}</MenuItem>
                                    <MenuItem key={'DEBIT'} value={'debit'}>{'DEBIT'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-3'>
                            <FormControl style={{ minWidth: '100%', maxWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required >Payment Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={addHotelFormData.discountType}
                                    name="discountType"
                                    label="Discount Type"
                                    onChange={onChangeStockIn}
                                >
                                    <MenuItem key={'NONE'} value={'none'}>{'NONE'}</MenuItem>
                                    <MenuItem key={'Fixed'} value={'fixed'}>{'Fixed'}</MenuItem>
                                    <MenuItem key={'Percentage'} value={'percentage'}>{'Percentage'}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        {addHotelFormData.discountType != 'none' &&
                            <div className='col-span-4'>
                                <TextField
                                    value={addHotelFormData.discount}
                                    error={stockInFormDataError.discount}
                                    helperText={stockInFormDataError.discount ? "Enter Discount" : ''}
                                    name="discount"
                                    id="outlined-required"
                                    label="Discount"
                                    onChange={(e) => {
                                        onChangeStockIn(e);
                                        if (e.target.value > 0) {
                                            setStockInFormDataError((prev) => (
                                                {
                                                    ...prev,
                                                    discount: false
                                                }
                                            ))
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">{addHotelFormData.discountType == 'fixed' ? <CurrencyRupeeIcon /> : <PercentIcon />}</InputAdornment>,
                                        style: { fontSize: 14 }
                                    }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    fullWidth
                                />
                            </div>
                        }
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                { isEdit ? submitEditHotel() : submitAddHotel() }
                            }}>{isEdit ? 'Edit Hotel' : 'Add Hotel'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseAddHotel();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />

        </div >
    )
}
export default HotelTable;

import './staffList.css';
import CountCard from '../countCard/countCard'
import EmployeeCard from '../employeeCard/employeeCard';
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import SearchIcon from '@mui/icons-material/Search';

const styleStockIn = {
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
function StaffList() {
    const monthIndex = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const monthIndexInt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const monthValue = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    const yearList = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030",
        "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040",
        "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050",
        "2051", "2052", "2053", "2054", "2055", "2056", "2057", "2058", "2059", "2060",
        "2061", "2062", "2063", "2064", "2065", "2066", "2067", "2068", "2069", "2070"
    ]
    const [state, setState] = useState(
        {
            startMonth: new Date().getMonth(),
            startYear: new Date().getFullYear(),
            endMonth: new Date().getMonth(),
            endYear: new Date().getFullYear()
        }
    );
    const [filter, setFilter] = React.useState(false);
    const [category, setCategory] = useState('');
    const [tab, setTab] = React.useState(1);
    const [searchWord, setSearchWord] = React.useState();
    const [isInActive, setIsInActive] = useState('');
    const [openModal, setOpen] = React.useState(false);
    const [openAddLeave, setOpenAddLeave] = React.useState(false);
    const [activeCategory, setActiveCategory] = useState('');
    const [employeeList, setEmployeeList] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [countData, setCountData] = React.useState();
    const [dataSearch, setDataSearch] = React.useState();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [addLeaveFormData, setAddLeaveFormData] = React.useState({
        employeeId: '',
        numLeave: '',
        leaveReason: '',
        leaveDate: dayjs(),
    });
    const [addLeaveFormDataError, setAddLeaveFormDataError] = React.useState({
        numLeave: false,
        leaveReason: false,
        leaveDate: false
    });
    const [addLeaveFormDataErrorFeild, setAddLeaveFormDataErrorFeild] = React.useState([
        'numLeave',
        'leaveReason',
        'leaveDate',
    ]);

    const [formData, setFormData] = React.useState({
        employeeId: '',
        payAmount: '',
        amountType: 1,
        comment: '',
        amountDate: dayjs(),
    });
    const [formDataError, setFormDataError] = React.useState({
        payAmount: false,
        amountType: false,
        amountDate: false,
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'payAmount',
        'amountType',
        'amountDate',
    ]);
    const handleCloseModal = () => {
        setFormData({
            employeeId: '',
            payAmount: '',
            amountType: 1,
            comment: '',
            amountDate: dayjs(),
        })
        setFormDataError({
            payAmount: false,
            amountType: false,
            amountDate: false,
        })
        setIsInActive(false)
        setOpen(false);
    }
    const handleOpen = (row) => {
        setFormData((perv) => ({
            ...perv,
            employeeId: row.employeeId,
            nickName: row.nickName,
            paymentDue: row.paymentDue,
            totalSalary: row.totalSalary,
            advanceAmount: row.advanceAmount,
            fineAmount: row.fineAmount,
            paymentDue: row.paymentDue,
            dateOfPayment: row.dateOfPayment
        }))
        setOpen(true);
    }

    const handleCloseAddLeave = () => {
        setAddLeaveFormData({
            employeeId: '',
            numLeave: '',
            leaveReason: '',
            leaveDate: dayjs(),
        })
        setAddLeaveFormDataError({
            payAmount: false,
            amountType: false,
            amountDate: false,
        })
        setOpenAddLeave(false);
    }
    const handleOpenAddLeave = (row) => {
        setAddLeaveFormData((perv) => ({
            ...perv,
            employeeId: row.employeeId,
            availableLeave: row.availableLeave,
            maxLeave: row.maxLeave,
            nickName: row.nickName,
        }))
        setOpenAddLeave(true);
    }

    const handlePaymentData = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["amountDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleLeaveDate = (date) => {
        setAddLeaveFormData((prevState) => ({
            ...prevState,
            ["leaveDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const deleteData = async (id) => {
        setLoading(true);
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeEmployeeDetails?employeeId=${id}`, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                getEmployeeListWithoutTab();
                getCategory()
                filter ? getCountDataByFilter() : getCountData()
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteEmployee = (id) => {
        if (window.prompt("Are you sure you want to delete Employee?") == 1234) {
            deleteData(id);
            // alert('heyy')
        }
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const addPayment = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addAmountOfSFA`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleCloseModal();
                setSearchWord('');
                setTimeout(() => {
                    activeCategory == 9999 ? getEmployeeListInactive('') : getEmployeeList(activeCategory);
                }, 50)

            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addLeave = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addEmployeeLeave`, addLeaveFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleCloseAddLeave();
                setSearchWord('');
                activeCategory == 9999 ? getEmployeeListInactive('') : getEmployeeList(activeCategory);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleOpenInactive = async (row, index) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getMidMonthInActiveSalaryOfEmployee?employeeId=${row.employeeId}`, config)
            .then((res) => {
                setFormData((perv) => ({
                    ...perv,
                    employeeId: row.employeeId,
                    nickName: row.nickName,
                    paymentDue: row.paymentDue,
                    totalSalary: row.totalSalary + res.data.proratedSalary,
                    advanceAmount: row.advanceAmount,
                    fineAmount: row.fineAmount,
                    paymentDue: row.paymentDue,
                    proratedSalary: res.data.proratedSalary
                }))
                setOpen(true);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleActiveInactive = (row, index) => {
        // alert("Jay")
        let employeeData = employeeList;
        if (employeeData[index].employeeStatus) {
            setIsInActive(true);
            employeeData[index].employeeStatus = false
            setEmployeeList(employeeData);
            console.log('inactiveAfter', employeeList[index])
        }
        else {
            employeeData[index].employeeStatus = true
            setEmployeeList(employeeData);
            console.log('activeAfter', employeeList[index])
        }
    }
    const submit = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFeild.filter(element => {
                if (formDataError[element] === true || formData[element] === '') {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                addPayment()
            }
        }
    }


    const getCountData = async (id) => {
        await axios.get(filter ? `${BACKEND_BASE_URL}staffrouter/getEmployeeStatisticsByCategoryId?categoryId=${id}&startMonth=${state.startYear + '-' + monthIndex[state.startMonth]}&endMonth=${state.endYear + '-' + monthIndex[state.endMonth]}&employeeStatus=1`
            : `${BACKEND_BASE_URL}staffrouter/getEmployeeStatisticsByCategoryId?categoryId=${id}&startDate=${''}&endDate=${''}&employeeStatus=1`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getCountDataByFilter = async (id, filter) => {
        await axios.get(filter ? `${BACKEND_BASE_URL}staffrouter/getEmployeeStatisticsByCategoryId?categoryId=${id}&startMonth=${state.startYear + '-' + monthIndex[state.startMonth]}&endMonth=${state.endYear + '-' + monthIndex[state.endMonth]}&employeeStatus=1`
            : `${BACKEND_BASE_URL}staffrouter/getEmployeeStatisticsByCategoryId?categoryId=${id}&startDate=${''}&endDate=${''}&employeeStatus=1`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getCountDataInactive = async () => {
        await axios.get(filter ? `${BACKEND_BASE_URL}staffrouter/getEmployeeStatisticsByCategoryId?categoryId=${''}&startMonth=${state.startYear + '-' + monthIndex[state.startMonth]}&endMonth=${state.endYear + '-' + monthIndex[state.endMonth]}&employeeStatus=0`
            : `${BACKEND_BASE_URL}staffrouter/getEmployeeStatisticsByCategoryId?categoryId=${''}&startDate=${''}&endDate=${''}&employeeStatus=0`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getCountDataInactiveByFilter = async (filter) => {
        await axios.get(filter ? `${BACKEND_BASE_URL}staffrouter/getEmployeeStatisticsByCategoryId?categoryId=${''}&startMonth=${state.startYear + '-' + monthIndex[state.startMonth]}&endMonth=${state.endYear + '-' + monthIndex[state.endMonth]}&employeeStatus=0`
            : `${BACKEND_BASE_URL}staffrouter/getEmployeeStatisticsByCategoryId?categoryId=${''}&startDate=${''}&endDate=${''}&employeeStatus=0`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const onChangeMonthFilter = (e) => {
        if (e.target.name == 'startYear') {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
                endYear: e.target.value,
            }))
        } else if (e.target.name == 'startMonth') {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
                endMonth: e.target.value
            }))
        }
        else {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const submitLeave = () => {
        if (loading || success) {

        } else {
            const isValidate = addLeaveFormDataErrorFeild.filter(element => {
                if (addLeaveFormDataError[element] === true || addLeaveFormData[element] === '') {
                    setAddLeaveFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                addLeave()
            }
        }
    }

    const onChange = (e) => {

        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))

    }
    const onChangeLeave = (e) => {
        setAddLeaveFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const handleEditEmployee = (id) => {
        navigate(`/staff/editStaff/${id}`)
    }
    const getCategory = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getStaffCategoryWithEmployeeNumber`, config)
            .then((res) => {
                setCategory(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getEmployeeList = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeData?categoryId=${tab}&employeeStatus=1`, config)
            .then((res) => {
                setEmployeeList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getEmployeeListInactive = async (tab) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeData?categoryId=${tab}&employeeStatus=0`, config)
            .then((res) => {
                // setTimeout(() => {
                setEmployeeList(res.data);
                // },50)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getEmployeeListWithoutTab = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeData?categoryId=${activeCategory}`, config)
            .then((res) => {
                setEmployeeList(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
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
            setLoading(false)
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
        setLoading(false)
        setError(false);
    }
    function removeDuplicatesById(arr) {
        const seenIds = new Set();
        return arr.filter(item => {
            if (seenIds.has(item.employeeId)) {
                return false; // This object has a duplicate id, so remove it
            } else {
                seenIds.add(item.employeeId);
                return true; // This is the first occurrence of this id, so keep it
            }
        });
    }
    function combineArrays(arr1, arr2) {
        return arr1.concat(arr2);
    }
    const onSearchChange = (e) => {
        setSearchWord(e.target.value);
        const filteredDataByName = employeeList.filter((item) => {
            return item.employeeName.toLowerCase().includes(e.target.value.toLowerCase())
        });
        const filteredDataByNickName = employeeList.filter((item) => {
            return item.nickName.toLowerCase().includes(e.target.value.toLowerCase())
        })
        const filteredData = combineArrays(filteredDataByName, filteredDataByNickName);
        const cleanedData = removeDuplicatesById(filteredData)
        setDataSearch(cleanedData);
        console.log("search", filteredData, cleanedData);
    }

    useEffect(() => {
        console.log('>>>LLL')
        getEmployeeList('');
        getCategory();
        getCountData('');
    }, [])
    // if (!employeeList) {
    //     return null;
    // }
    return (
        <div className='mainBody flex gap-4 pr-4 pl-4'>
            <div className='categoryListContainer'>
                <div className='categoryHeader'>
                    Categories
                    <hr className="hr"></hr>
                </div>
                <div className='categoryListWrp'>
                    {/* <div className={activeCategory === '' ? 'active' : 'navLink'} onClick={() => { setActiveCategory(''); getEmployeeList('') }}>
                        All
                    </div> */}
                    {
                        category ? category.map((data, index) => (
                            <div key={data.staffCategoryId} className={`${activeCategory === data.staffCategoryId ? 'active' : 'navLink'} flex justify-between pl-2`} onClick={() => { setSearchWord(''); setEmployeeList(); setActiveCategory(data.staffCategoryId); index == (category.length - 1) ? getCountDataInactive() : getCountData(data.staffCategoryId); index == (category.length - 1) ? getEmployeeListInactive('') : getEmployeeList(data.staffCategoryId) }}>
                                {data.staffCategoryName} &nbsp;<div className={'countOfEmployee pr-2'}> &nbsp; {data.numberOfEmployee}</div>
                            </div>
                        )) : <></>
                    }
                </div>
            </div>
            <div className='employeeListContainer'>
                <div className='searchBarAndCardWrp'>
                    {/* <div className='searchBarWrp'>

                    </div> */}
                    {/* <div className='grid grid-cols-4 gap-6'>
                        <CountCard color={'black'} count={0} desc={'Total Purchase'} productDetail={true} unitDesc={'gm'} />
                        <CountCard color={'black'} count={0} desc={'Total Purchase'} productDetail={true} unitDesc={'gm'} />
                        <CountCard color={'black'} count={0} desc={'Total Purchase'} productDetail={true} unitDesc={'gm'} />
                        <CountCard color={'black'} count={0} desc={'Total Purchase'} productDetail={true} unitDesc={'gm'} />
                    </div> */}
                    <div className='productTableSubContainer'>
                        <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                            <div className={`flex col-span-2 justify-center ${tab === 1 || tab === '1' ? 'tabDebit' : 'productTab'}`} onClick={() => {
                                setTab(1);
                                // getEmployeeListWithoutTab();
                                activeCategory == 9999 ? getEmployeeListInactive('') : getEmployeeList(activeCategory);
                                setState({
                                    startMonth: new Date().getMonth(),
                                    startYear: new Date().getFullYear(),
                                    endMonth: new Date().getMonth(),
                                    endYear: new Date().getFullYear()
                                })
                                setFilter(false)
                                // setPageLeaves(0); setRowsPerPageLeaves(5);
                                // setPage(0); filter ? getStockInDataByTabByFilter('debit') : getStockInDataByTab('debit'); setRowsPerPage(5);
                            }}>
                                <div className='statusTabtext'>Employes</div>
                            </div>
                            <div className={`flex col-span-2 justify-center ${tab === 2 || tab === '2' ? 'tabCash' : 'productTab'}`} onClick={() => {
                                setTab(2);
                                // activeCategory == 9999 ? getCountDataInactive() : getCountData(activeCategory);
                                // filter ? getHoliDataByFilter() : getHolidayData();
                                // setPageLeaves(0); setRowsPerPageLeaves(5);
                                // setPage(0); filter ? getStockInDataByTabByFilter('cash') : getStockInDataByTab('cash'); setRowsPerPage(5);
                            }}>
                                <div className='statusTabtext'>Statics</div>
                            </div>
                            {
                                (tab === 1 || tab === '1') &&
                                <div className='col-span-3 col-start-6 flex pr-4'>
                                    <TextField
                                        onChange={onSearchChange}
                                        value={searchWord}
                                        name="searchWord"
                                        disabled={employeeList && employeeList.length == 0}
                                        id="standard-basic"
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
                            }
                            {
                                (tab === 2 || tab === '2') &&
                                <div className='col-span-6 col-start-7 flex justify-end pr-4'>
                                    <div className='dateRange text-center self-center' aria-describedby={ids} onClick={handleClick}>
                                        <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state.startMonth && filter ? '( ' + monthValue[state.startMonth] + ' / ' + state.startYear + ' )' : 'Select Date')} -- {(state.endMonth && filter ? '( ' + monthValue[state.endMonth] + ' / ' + state.endYear + ' )' : 'Select Date')}
                                    </div>
                                    <div className='resetBtnWrap col-span-3 self-center'>
                                        <button
                                            className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                            onClick={() => {
                                                setFilter(false);
                                                activeCategory == 9999 ? getCountDataInactiveByFilter(false) : getCountData(activeCategory, false)
                                                setState({
                                                    startMonth: new Date().getMonth(),
                                                    startYear: new Date().getFullYear(),
                                                    endMonth: new Date().getMonth(),
                                                    endYear: new Date().getFullYear()
                                                })
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
                                        <Box sx={{ bgcolor: 'background.paper', padding: '20px', width: '600px', height: '175px', borderRadius: '10px', paddingTop: '30px' }}>
                                            {/* <DateRangePicker
                                                        ranges={state}
                                                        onChange={item => { setState([item.selection]); console.log([item.selection]) }}
                                                        direction="horizontal"
                                                        months={2}
                                                        showSelectionPreview={true}
                                                        moveRangeOnFirstSelection={false}
                                                    /> */}
                                            <div className='mounthRangeSelect grid grid-cols-12 gap-6'>
                                                <div className="col-span-3">
                                                    <FormControl style={{ minWidth: '100%' }}>
                                                        <InputLabel id="demo-simple-select-label">Start Month</InputLabel>
                                                        <Select
                                                            // disabled={isEdit}
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={state.startMonth}
                                                            name="startMonth"
                                                            label="Start Month"
                                                            onChange={onChangeMonthFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            {
                                                                monthValue.map((data, index) => (
                                                                    <MenuItem key={data} value={index}>{data}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col-span-3">
                                                    <FormControl style={{ minWidth: '100%' }}>
                                                        <InputLabel id="demo-simple-select-label">Start Year</InputLabel>
                                                        <Select
                                                            // disabled={isEdit}
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={state.startYear}
                                                            name="startYear"
                                                            label="Start Year"
                                                            onChange={onChangeMonthFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            {
                                                                yearList.map((data, index) => (
                                                                    <MenuItem key={data} value={data}>{data}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col-span-3">
                                                    <FormControl style={{ minWidth: '100%' }}>
                                                        <InputLabel id="demo-simple-select-label">End Month</InputLabel>
                                                        <Select
                                                            // disabled={isEdit}
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={state.endMonth}
                                                            name="endMonth"
                                                            label="End Month"
                                                            onChange={onChangeMonthFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            {
                                                                monthIndexInt.map((data, index) => (
                                                                    state.endYear == state.startYear ? data >= state.startMonth ? <MenuItem key={data} value={data}>{monthValue[data]}</MenuItem> : null : <MenuItem key={data} value={data}>{monthValue[data]}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col-span-3">
                                                    <FormControl style={{ minWidth: '100%' }}>
                                                        <InputLabel id="demo-simple-select-label">End Year</InputLabel>
                                                        <Select
                                                            // disabled={isEdit}
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={state.endYear}
                                                            name="endYear"
                                                            label="End Year"
                                                            onChange={onChangeMonthFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            {

                                                                yearList.map((data, index) => (
                                                                    data >= state.startYear ? <MenuItem key={data} value={data}>{data}</MenuItem> : null
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className='mt-8 grid gap-4 grid-cols-12'>
                                                <div className='col-span-3 col-start-7'>
                                                    <button className='stockInBtn' onClick={() => {
                                                        setFilter(true)
                                                        handleClose();
                                                        activeCategory == 9999 ? getCountDataInactiveByFilter(true) : getCountDataByFilter(activeCategory, true)
                                                        // getLeaveDataByFilter()
                                                        // setFilter(true); handleClose(); getStatisticsByFilter(); setTabTable(''); setPage(0); setRowsPerPage(5); getStockInDataByTabByFilter(''); getProductCountByFilter();
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
                            {
                                (tab === 1 || tab === '1') &&
                                <div className='col-span-2 col-start-11 flex justify-end pr-4'>
                                    <button className='addSalary self-center'
                                        onClick={() => navigate('/staff/addStaff')}
                                    >Add Employee</button>
                                </div>
                            }

                        </div>
                    </div>
                </div>
                <div className='employeeListWrp mt-6 pb-6'>
                    {
                        (tab === 1 || tab === '1') &&
                        <div className='grid grid-cols-2 gap-6'>
                            {searchWord && searchWord.length > 0 ?
                                dataSearch && dataSearch.length > 0 ? dataSearch.map((employeeData, index) => (
                                    <EmployeeCard handleActiveInactive={handleActiveInactive} getEmployeeListInactive={getEmployeeListInactive} getCategory={getCategory} formDataErrorFeild={formDataErrorFeild} getEmployeeList={getEmployeeList} setLoading={setLoading} loading={loading} activeCategory={activeCategory} setSuccess={setSuccess} success={success} handleClose={handleCloseModal} formData={formData} formDataError={formDataError} setFormDataError={setFormDataError} onChange={onChange} setFormData={setFormData} switch={employeeData.employeeStatus} setOpen={setOpen} setError={setError} index={index} data={employeeData} handleOpen={handleOpen} handleOpenAddLeave={handleOpenAddLeave} handleDeleteEmployee={handleDeleteEmployee} handleEditEmployee={handleEditEmployee} />
                                ))
                                    :
                                    <div className='grid mt-24 col-span-5 content-center'>
                                        <div className='text-center noDataFoundText'>
                                            {error ? error : 'No Data Found'}
                                        </div>
                                    </div>
                                :
                                employeeList && employeeList.length > 0 ? employeeList.map((employeeData, index) => (
                                    <EmployeeCard handleActiveInactive={handleActiveInactive} getEmployeeListInactive={getEmployeeListInactive} getCategory={getCategory} formDataErrorFeild={formDataErrorFeild} getEmployeeList={getEmployeeList} setLoading={setLoading} loading={loading} activeCategory={activeCategory} setSuccess={setSuccess} success={success} handleClose={handleCloseModal} formData={formData} formDataError={formDataError} setFormDataError={setFormDataError} onChange={onChange} setFormData={setFormData} switch={employeeData.employeeStatus} setOpen={setOpen} setError={setError} index={index} data={employeeData} handleOpen={handleOpen} handleOpenAddLeave={handleOpenAddLeave} handleDeleteEmployee={handleDeleteEmployee} handleEditEmployee={handleEditEmployee} />
                                ))
                                    :
                                    <div className='grid mt-24 col-span-5 content-center'>
                                        <div className='text-center noDataFoundText'>
                                            {error ? error : 'No Data Found'}
                                        </div>
                                    </div>
                            }
                        </div>
                    }
                    {(tab === 2 || tab === '2') &&
                        <div className='grid gap-4 mt-12' >
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-4'>
                                    <CountCard color={'black'} count={countData && countData.totalSalary ? countData.totalSalary : 0} desc={'Total Salary'} productDetail={true} unitDesc={0} />
                                </div>
                                <div className='col-span-4'>
                                    <CountCard color={'black'} count={countData && countData.totalDueSalary ? countData.totalDueSalary : 0} desc={'Total Due Salary'} productDetail={true} unitDesc={0} />
                                </div>
                                <div className='col-span-4'>
                                    <CountCard color={'green'} count={countData && countData.remainPaySalary ? countData.remainPaySalary : 0} desc={'To be Pay'} productDetail={true} unitDesc={0} />
                                </div>
                            </div>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-4'>
                                    <CountCard color={'black'} count={countData && countData.remainSalary ? countData.remainSalary : 0} desc={'Remaining Salary'} productDetail={true} unitDesc={0} />
                                </div>
                                <div className='col-span-4'>
                                    <CountCard color={'pink'} count={countData && countData.remainAdvance ? countData.remainAdvance : 0} desc={'Remaining Advance'} productDetail={true} unitDesc={0} />
                                </div>
                                <div className='col-span-4'>
                                    <CountCard color={'blue'} count={countData && countData.remainFine ? countData.remainFine : 0} desc={'Remaining Fine'} productDetail={true} unitDesc={0} />
                                </div>
                            </div>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-4'>
                                    <CountCard color={'black'} count={countData && countData.advanceAmount ? countData.advanceAmount : 0} desc={'Total Advance'} productDetail={true} unitDesc={0} />
                                </div>
                                <div className='col-span-4'>
                                    <CountCard color={'pink'} count={countData && countData.fineAmount ? countData.fineAmount : 0} desc={'Total Fine'} productDetail={true} unitDesc={0} />
                                </div>
                            </div>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-4'>
                                    <CountCard color={'black'} count={countData && countData.totalConsiderFine ? countData.totalConsiderFine : 0} desc={'Considered Fine'} productDetail={true} unitDesc={0} />
                                </div>
                                <div className='col-span-4'>
                                    <CountCard color={'pink'} count={countData && countData.totalIgnoreFine ? countData.totalIgnoreFine : 0} desc={'Ignored Fine'} productDetail={true} unitDesc={0} />
                                </div>
                                <div className='col-span-4'>
                                    <CountCard color={'pink'} count={countData && countData.bonusAmount ? countData.bonusAmount : 0} desc={'Bonus'} productDetail={true} unitDesc={0} />
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>Make Payment to : </span><span className='makePaymentName'>{formData.nickName}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Payment Due :'}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{parseFloat(formData.paymentDue).toLocaleString('en-IN')}</span>
                        </Typography>
                    </div>
                    <div className='flex justify-between mt-3 mb-2'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Salary (From - To) :'} </span><span className='makePaymentName'>{formData.dateOfPayment}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Total Salary(With Leave) :'}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{parseFloat(formData.totalSalary).toLocaleString('en-IN')}</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            payAmount: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            payAmount: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={onChange}
                                value={formData.payAmount}
                                error={formDataError.payAmount}
                                // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                // helperText={formData.amountType == 1 ? formData.payAmount ? formData.payAmount > formData.totalSalary ? `Amount can't be more than ${formData.totalSalary}` : `Remaining Payment ${formData.paymentDue}` : formDataError.totalSalary ? "Please Enter Amount" : `Remaining Payment ${formData.paymentDue}` : ''}
                                name="payAmount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                }}
                            />
                        </div>
                        <div className="col-span-4">
                            <FormControl style={{ minWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={formDataError.amountType}>Payment Type</InputLabel>
                                <Select
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                amountType: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                amountType: false
                                            }))
                                        }
                                    }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.amountType}
                                    error={formDataError.amountType}
                                    name="amountType"
                                    label="Payment Type"
                                    onChange={onChange}
                                >
                                    <MenuItem key={1} value={1}>{"Salary"}</MenuItem>
                                    <MenuItem key={2} value={2}>{"Advanced"}</MenuItem>
                                    <MenuItem key={3} value={3}>{"Fine"}</MenuItem>
                                    <MenuItem key={4} value={4}>{"Credit Advance"}</MenuItem>
                                    <MenuItem key={5} value={5}>{"Credit Fine"}</MenuItem>
                                    <MenuItem key={6} value={6}>{"Bonus"}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-4'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Payment Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={formDataError.amountDate}
                                    value={dayjs(formData.amountDate)}
                                    onChange={handlePaymentData}
                                    name="amountDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                disabled={formData.remainingAmount == 0}
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
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3 col-start-7'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submit();
                            }}>Make Payment</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseModal();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openAddLeave}
                onClose={handleCloseAddLeave}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'> Add Leave for : </span><span className='makePaymentName'>{addLeaveFormData.nickName}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{`Available Leave(${'Max leave:' + addLeaveFormData.maxLeave}) :`}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{addLeaveFormData.availableLeave}</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            numLeave: true
                                        }))
                                    }
                                    else {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            numLeave: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Add Leave"
                                fullWidth
                                onChange={onChangeLeave}
                                value={addLeaveFormData.numLeave}
                                error={addLeaveFormDataError.numLeave}
                                helperText={addLeaveFormDataError.numLeave ? 'Please enter leave' : ''}
                                name="numLeave"
                            />
                        </div>
                        <div className='col-span-6'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Leave Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={addLeaveFormDataError.leaveDate}
                                    value={dayjs(addLeaveFormData.leaveDate)}
                                    onChange={handleLeaveDate}
                                    name="leaveDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 4) {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            leaveReason: true
                                        }))
                                    }
                                    else {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            leaveReason: false
                                        }))
                                    }
                                }}
                                onChange={onChangeLeave}
                                value={formData.leaveReason}
                                name="leaveReason"
                                id="outlined-required"
                                label="Reason"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                error={addLeaveFormDataError.leaveReason}
                                helperText={addLeaveFormDataError.leaveReason ? 'Please enter Reason' : ''}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3 col-start-7'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitLeave()
                            }}>Add Leave</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseAddLeave();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default StaffList;
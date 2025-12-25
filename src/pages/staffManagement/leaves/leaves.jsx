import './leaves.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
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
import Switch from '@mui/material/Switch';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import MenuLeaves from '../employeeDetail/menus/menuLeaves';
import ExportMenu from '../exportMenu';
import MenuHoliday from '../employeeDetail/menus/menuHoliday';
// import MenuMonthly from './menus/menuMonthlySalary';
// import MenuAdvance from './menus/menuAdvance';
// import MenuFine from './menus/menuFine';
// import MenuBonus from './menus/menuBonus';
// import MenuCredit from './menus/menuCredit';
// import MenuLeaves from './menus/menuLeaves';
// import MenuTransaction from './menus/menuTransaction';
function getStartAndEndDateOfMonth(dateString) {
    console.log(dateString);
    // Split the input date string into day, month, and year components
    const [day, month, year] = dateString.split('-').map(Number);

    // Create a Date object for the first day of the month
    const startDate = new Date(year, month - 1, 1); // Note: Month is 0-based, so subtract 1

    // Calculate the last day of the month
    // To do this, set the day to 0 of the next month (which is the last day of the current month)
    const endDate = new Date(year, month, 0);

    return {
        startDate,
        endDate,
    };
}
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
function getDateLeave(dateString) {
    console.log('newww', dateString);
    // Split the input date string into day, month, and year components
    const [day, month, year] = dateString.split('-').map(Number);

    // Create a Date object for the first day of the month

    // Calculate the last day of the month
    // To do this, set the day to 0 of the next month (which is the last day of the current month)
    const dateNew = new Date(year, month - 1, day);

    return {
        dateNew,
    };
}
function Leaves() {
    const [filter, setFilter] = React.useState(false);
    let { id } = useParams();
    const [addLeaveFormDataErrorFeild, setAddLeaveFormDataErrorFeild] = React.useState([
        'numLeave',
        'leaveReason',
        'leaveDate',
        'employeeId'
    ]);
    const textFieldRef = useRef(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [editLeave, setEditLeave] = React.useState(false);
    const [openAddLeave, setOpenAddLeave] = React.useState(false);
    const [openAddHoliday, setOpenAddHoliday] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [tab, setTab] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [employeeList, setEmployeeList] = React.useState();
    const [addLeaveFormDataError, setAddLeaveFormDataError] = React.useState({
        numLeave: false,
        leaveReason: false,
        leaveDate: false
    });
    const [addLeaveFormData, setAddLeaveFormData] = React.useState({
        employeeId: '',
        numLeave: '',
        leaveReason: '',
        leaveDate: dayjs(),
    });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const editLeaveApi = async () => {
        console.log('leave dadsd', addLeaveFormData)
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeLeave`, addLeaveFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleCloseAddLeave();
                setPageLeaves(0);
                setRowsPerPageLeaves(5);
                setAddLeaveFormData({
                    employeeId: '',
                    numLeave: '',
                    leaveReason: '',
                    leaveDate: dayjs(),
                })
                setAddLeaveFormDataError({
                    numLeave: false,
                    leaveReason: false,
                    leaveDate: false
                })
                filter ? getLeaveDataByFilter() : getLeaveData()
                setEditLeave(false)
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const [pageLeaves, setPageLeaves] = React.useState(0);
    const [totalRowsLeaves, setTotalRowsLeaves] = React.useState(0);
    const [totalRowsHoliday, setTotalRowsHoliday] = React.useState(0);
    const [rowsPerPageLeaves, setRowsPerPageLeaves] = React.useState(5);
    const [leaveData, setLeaveData] = React.useState();
    const [holidayData, setHolidayData] = React.useState();
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);




    const addLeave = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addEmployeeLeave`, addLeaveFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleCloseAddLeave();
                setPageLeaves(0);
                setRowsPerPageLeaves(5)
                setAddLeaveFormData({
                    employeeId: '',
                    numLeave: '',
                    leaveReason: '',
                    leaveDate: dayjs(),
                })
                setAddLeaveFormDataError({
                    numLeave: false,
                    leaveReason: false,
                    leaveDate: false
                })
                getLeaveData()
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addHoliday = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addLeaveForAllEployee`, addLeaveFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                setPageLeaves(0);
                setRowsPerPageLeaves(5)
                handleCloseAddHoliDay();
                setAddLeaveFormData({
                    employeeId: '',
                    numLeave: '',
                    leaveReason: '',
                    leaveDate: dayjs(),
                })
                setAddLeaveFormDataError({
                    numLeave: false,
                    leaveReason: false,
                    leaveDate: false
                })
                getHolidayData()
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const onChangeLeave = (e) => {
        setAddLeaveFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const handleLeaveDate = (date) => {
        const currentDate = dayjs(date);
        const endOfMonth = currentDate.endOf('month');
        const maxLeave = endOfMonth.diff(currentDate, 'day');
        setAddLeaveFormData((prevState) => ({
            ...prevState,
            ["leaveDate"]: date && date['$d'] ? date['$d'] : null,
            ["maxLeave"]: maxLeave
        }))
    };
    const handleCloseAddLeave = () => {
        setEditLeave(false)
        setAddLeaveFormData({
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
    const handleCloseAddHoliDay = () => {
        setEditLeave(false)
        setAddLeaveFormData({
            numLeave: '',
            leaveReason: '',
            leaveDate: dayjs(),
        })
        setAddLeaveFormDataError({
            payAmount: false,
            amountType: false,
            amountDate: false,
        })
        setOpenAddHoliday(false);
    }
    const submitLeave = () => {
        console.log('edit leave', addLeaveFormData)
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
    const submitHoliday = () => {
        console.log('edit leave', addLeaveFormData)
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
                addHoliday()
            }
        }
    }
    const submitEditLeave = () => {
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
                editLeaveApi()
            }
        }
    }
    const getLeaveData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeLeaveData?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setLeaveData(res.data.rows);
                setTotalRowsLeaves(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getLeaveDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeLeaveData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setLeaveData(res.data.rows);
                setTotalRowsLeaves(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getLeaveDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeLeaveData?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setLeaveData(res.data.rows);
                setTotalRowsLeaves(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getLeaveDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeLeaveData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setLeaveData(res.data.rows);
                setTotalRowsLeaves(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getHolidayData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeHolidayData?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setHolidayData(res.data.rows);
                setTotalRowsHoliday(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getHoliDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeHolidayData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setHolidayData(res.data.rows);
                setTotalRowsHoliday(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getHoliDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeHolidayData?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setHolidayData(res.data.rows);
                setTotalRowsHoliday(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getHoliDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeHolidayData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setHolidayData(res.data.rows);
                setTotalRowsHoliday(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const deleteLeave = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeEmployeeLeave?leaveId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPageLeaves(0);
                setRowsPerPageLeaves(5);
                filter ? getLeaveDataByFilter() : getLeaveData()
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteHoliday = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeEmployeeHoliday?holidayId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPageLeaves(0);
                setRowsPerPageLeaves(5);
                filter ? getHoliDataByFilter() : getHolidayData()
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteLeave = (id) => {
        if (window.confirm("Are you sure you want to delete Leaves?")) {
            deleteLeave(id);
        }
    }
    const handleDeleteHoliday = (id) => {
        if (window.confirm("Are you sure you want to delete Leaves?")) {
            deleteHoliday(id);
        }
    }
    const getEmployeeJson = (id) => {
        // console.log('temp', employeeList.find(item => { console.log(item.id); return item.employeeId == id }), id, employeeList)
        return employeeList.find(item => item.employeeId === id);
    }
    const handleEditLeaves = async (data, date) => {

        setEditLeave(true)
        const { startDate, endDate } = getStartAndEndDateOfMonth(date)
        const { dateNew } = getDateLeave(date)
        const currentDate = dayjs(dateNew);
        const endOfMonth = currentDate.endOf('month');
        const maxLeave = endOfMonth.diff(currentDate, 'day');
        const jsonData = await getEmployeeJson(data.employeeId);
        setAddLeaveFormData((perv) => ({
            ...perv,
            employeeId: data.employeeId,
            employeeNickName: jsonData,
            leaveId: data.leaveId,
            minDate: startDate,
            maxDate: endDate,
            numLeave: data.numLeave,
            leaveReason: data.leaveReason,
            leaveDate: dateNew,
            maxLeaveMonth: jsonData && jsonData.maxLeaveMonth ? jsonData.maxLeaveMonth : 0,
            availableLeave: jsonData && jsonData.availableLeave ? jsonData.availableLeave : 0,
            // availableLeave: data.totalMaxLeave - data.totalLeave,
            // totalMaxLeave: data.totalMaxLeave,
            nickName: data.employeeName,
        }))
        setOpenAddLeave(true);
        // console.log("LeaveDate", editFormData.newLeaveDate)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProductNameAutoComplete = (event, value) => {
        setAddLeaveFormData((prevState) => ({
            ...prevState,
            ['employeeNickName']: value,
            employeeId: value && value.employeeId ? value.employeeId : '',
            nickName: value && value.employeeNickName ? value.employeeNickName : '',
            maxLeaveMonth: value && value.maxLeaveMonth ? value.maxLeaveMonth : 0,
            availableLeave: value && value.availableLeave ? value.availableLeave : 0,
        }))
        // console.log('formddds', addLeaveFormData)
    }

    const leaveExcelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllLeaveData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllLeaveData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Leave_Data_' + new Date().toLocaleDateString() + '.xlsx'
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
    const leavePdfExport = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportPdfForAllLeaveData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}staffrouter/exportPdfForAllLeaveData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Leave_Data_' + new Date().toLocaleDateString() + '.pdf'
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

    const handleChangePageLeaves = (event, newPage) => {
        setPageLeaves(newPage);
        if (tab === 1 || tab === '1') {
            if (filter) {
                getLeaveDataOnPageChangeByFilter(newPage + 1, rowsPerPageLeaves)
            }
            else {
                getLeaveDataOnPageChange(newPage + 1, rowsPerPageLeaves)
            }
        } else if (tab === 2 || tab === '2') {
            if (filter) {
                getHoliDataOnPageChangeByFilter(newPage + 1, rowsPerPageLeaves)
            }
            else {
                getHoliDataOnPageChange(newPage + 1, rowsPerPageLeaves)
            }
        }

    };
    const handleChangeRowsPerPageLeaves = (event) => {
        setRowsPerPageLeaves(parseInt(event.target.value, 10));
        setPageLeaves(0);
        if (tab === 1 || tab === '1') {
            if (filter) {
                getLeaveDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getLeaveDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        } else if (tab === 2 || tab === '2') {
            if (filter) {
                getHoliDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getHoliDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };

    const handleOpenAddLeave = (row) => {
        const currentDateNew = new Date();

        const day = String(currentDateNew.getDate()).padStart(2, '0');
        const month = String(currentDateNew.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1
        const year = String(currentDateNew.getFullYear());

        const formattedDate = `${day}-${month}-${year}`;
        const { startDate, endDate } = getStartAndEndDateOfMonth(formattedDate)
        const { dateNew } = getDateLeave(formattedDate)
        const currentDate = dayjs(dateNew);
        const endOfMonth = currentDate.endOf('month');
        const maxLeave = endOfMonth.diff(currentDate, 'day');

        setAddLeaveFormData((perv) => ({
            ...perv,
            employeeId: row.employeeId,
            availableLeave: row.totalMaxLeave - row.totalLeave,
            totalMaxLeave: row.totalMaxLeave,
            nickName: row.nickName,
            maxLeave: maxLeave,
            minDate: startDate,
            maxDate: endDate
        }))
        setOpenAddLeave(true);
    }
    const handleOpenAddHoliday = () => {
        const currentDateNew = new Date();

        const day = String(currentDateNew.getDate()).padStart(2, '0');
        const month = String(currentDateNew.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1
        const year = String(currentDateNew.getFullYear());

        const formattedDate = `${day}-${month}-${year}`;
        const { startDate, endDate } = getStartAndEndDateOfMonth(formattedDate)
        const { dateNew } = getDateLeave(formattedDate)
        const currentDate = dayjs(dateNew);
        const endOfMonth = currentDate.endOf('month');
        const maxLeave = endOfMonth.diff(currentDate, 'day');

        setAddLeaveFormData((perv) => ({
            ...perv,
            employeeId: 'Xyss',
            maxLeave: maxLeave,
            minDate: startDate,
            maxDate: endDate
        }))
        setOpenAddHoliday(true);
    }
    const getEmployeeList = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/ddlForEmployeeList`, config)
            .then((res) => {
                setEmployeeList(res.data);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                setEmployeeList(null)
            })
    }

    useEffect(() => {
        // getData();
        getEmployeeList();
        getLeaveData()
        // getMonthlySalaryData();
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
                <div className='col-span-12 '>
                    <div className='datePickerWrp mb-4'>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='productTableSubContainer'>
                                    <div className='h-full grid grid-cols-12'>
                                        <div className='h-full col-span-8'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <div className={`flex col-span-2 justify-center ${tab === 1 || tab === '1' ? 'tabDebit' : 'productTab'}`} onClick={() => {
                                                    setTab(1);
                                                    filter ? getLeaveDataByFilter() : getLeaveData();
                                                    setPageLeaves(0); setRowsPerPageLeaves(5);
                                                    // setPage(0); filter ? getStockInDataByTabByFilter('debit') : getStockInDataByTab('debit'); setRowsPerPage(5);
                                                }}>
                                                    <div className='statusTabtext'>Leaves</div>
                                                </div>
                                                <div className={`flex col-span-2 justify-center ${tab === 2 || tab === '2' ? 'tabCash' : 'productTab'}`} onClick={() => {
                                                    setTab(2);
                                                    filter ? getHoliDataByFilter() : getHolidayData();
                                                    setPageLeaves(0); setRowsPerPageLeaves(5);
                                                    // setPage(0); filter ? getStockInDataByTabByFilter('cash') : getStockInDataByTab('cash'); setRowsPerPage(5);
                                                }}>
                                                    <div className='statusTabtext'>Holidays</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-4 flex justify-end pr-4'>
                                            <div className='dateRange text-center self-center' aria-describedby={ids} onClick={handleClick}>
                                                <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                            </div>
                                            <div className='resetBtnWrap col-span-3 self-center'>
                                                <button
                                                    className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                                    onClick={() => {
                                                        setFilter(false);
                                                        setPageLeaves(0);
                                                        setRowsPerPageLeaves(5)
                                                        setState([
                                                            {
                                                                startDate: new Date(),
                                                                endDate: new Date(),
                                                                key: 'selection'
                                                            }
                                                        ])
                                                        tab === 1 || tab === '1' ? getLeaveData() : getHolidayData();
                                                    }}
                                                ><CloseIcon /></button>
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
                                                                // tab === 2 || tab === '2' ? getDebitDataByFilter() : tab === 3 || tab === '3' ? getCashDataByFilter() : getDebitByFilter();
                                                                tab === 1 || tab === '1' ? getLeaveDataByFilter() : getHoliDataByFilter();
                                                                // tab === 2 || tab === '2' ? getDebitCountsByFilter() : tab === 3 || tab === '3' ? getCashCountsByFilter() : getDebitCountsByFilter();
                                                                setRowsPerPageLeaves(5)
                                                                setFilter(true); setPageLeaves(0); handleClose()
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
                    <div className='tableSubContainer pt-2 mt-10'>
                        <div className='grid grid-cols-12 pt-6'>
                            {
                                (tab === 1 || tab === '1') && <div className='col-span-2 pl-4 pr-4'>
                                    <button className='addLeave' onClick={() => handleOpenAddLeave({})}>Add Leave</button>
                                </div>
                            }
                            {(tab === 2 || tab === '2') &&
                                <div className='col-span-2 pl-4 pr-4'>
                                    <button className='addLeave' onClick={() => handleOpenAddHoliday()}>Add Holiday</button>
                                </div>
                            }
                            {(tab === 1 || tab === '1') &&
                                <div className='col-span-3 col-start-10 pr-5 flex justify-end'>
                                    <ExportMenu exportExcel={
                                        () => {
                                            leaveExcelExport()
                                        }
                                    } exportPdf={
                                        () => {
                                            leavePdfExport()
                                        }
                                    }
                                        isDisable={totalRowsLeaves == 0 ? true : false}
                                    />
                                </div>
                            }
                        </div>
                        {
                            (tab === 1 || tab === '1') &&
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell>Employee Name</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell align="left">Leave Count</TableCell>
                                                <TableCell align="left">Reason</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {leaveData?.map((row, index) => (
                                                totalRowsLeaves !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.leaveId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (pageLeaves * rowsPerPageLeaves)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.givenBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <Tooltip title={row.employeeName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.employeeName}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.employeeCategory} Day</TableCell>
                                                        <TableCell align="left" >{row.numLeave} Day</TableCell>
                                                        <Tooltip title={row.leaveReason} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.leaveReason}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.leaveDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuLeaves data={row} handleDeleteLeave={handleDeleteLeave} handleEditLeaves={handleEditLeaves} setError={setError} />
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
                                        count={totalRowsLeaves}
                                        rowsPerPage={rowsPerPageLeaves}
                                        page={pageLeaves}
                                        onPageChange={handleChangePageLeaves}
                                        onRowsPerPageChange={handleChangeRowsPerPageLeaves}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tab === 2 || tab === '2') &&
                            <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell align="left">Leave Count</TableCell>
                                                <TableCell align="left">Reason</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {holidayData?.map((row, index) => (
                                                totalRowsHoliday !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.holidayId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (pageLeaves * rowsPerPageLeaves)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.givenBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.numLeave} Day</TableCell>
                                                        <Tooltip title={row.holidayReason} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.holidayReason}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.holidayDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuHoliday data={row} handleDeleteHoliday={handleDeleteHoliday} setError={setError} />
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
                                        count={totalRowsHoliday}
                                        rowsPerPage={rowsPerPageLeaves}
                                        page={pageLeaves}
                                        onPageChange={handleChangePageLeaves}
                                        onRowsPerPageChange={handleChangeRowsPerPageLeaves}
                                    />
                                </TableContainer>
                            </div>
                        }

                    </div>
                </div>
            </div>
            <Modal
                open={openAddLeave}
                onClose={handleCloseAddLeave}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'> {editLeave ? 'Edit Leave for : ' : 'Add Leave for : '} </span><span className='makePaymentName'>{addLeaveFormData.employeeId ? addLeaveFormData.nickName : 'Select Employee'}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{`Available Leave(${'Max leave:' + (addLeaveFormData.employeeId ? addLeaveFormData.maxLeaveMonth : 'select')}) :`}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{addLeaveFormData.employeeId ? addLeaveFormData.availableLeave : 'select'}</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <FormControl fullWidth>
                                <Autocomplete
                                    defaultValue={null}
                                    id='stockIn'
                                    disabled={editLeave}
                                    disablePortal
                                    sx={{ width: '100%' }}
                                    value={addLeaveFormData.employeeNickName ? addLeaveFormData.employeeNickName : null}
                                    onChange={handleProductNameAutoComplete}
                                    options={employeeList ? employeeList : []}
                                    getOptionLabel={(options) => options.employeeNickName}
                                    renderInput={(params) => <TextField inputRef={textFieldRef} {...params} label="Employee Name" />}
                                />
                            </FormControl>
                        </div>
                        <div className='col-span-4'>
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
                                disabled={addLeaveFormData.employeeId == '' || !addLeaveFormData.employeeId}
                                onChange={onChangeLeave}
                                value={addLeaveFormData.numLeave}
                                error={addLeaveFormDataError.numLeave}
                                helperText={addLeaveFormDataError.numLeave ? "Pls add leave" : ""}
                                name="numLeave"
                            />
                        </div>
                        <div className='col-span-4'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Leave Date"
                                    format="DD/MM/YYYY"
                                    required
                                    disabled={addLeaveFormData.employeeId == '' || !addLeaveFormData.employeeId}
                                    // maxDate={dayjs(addLeaveFormData.maxDate)}
                                    // minDate={dayjs(addLeaveFormData.minDate)}
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
                                value={addLeaveFormData.leaveReason ? addLeaveFormData.leaveReason : ''}
                                name="leaveReason"
                                id="outlined-required"
                                disabled={addLeaveFormData.employeeId == '' || !addLeaveFormData.employeeId}
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
                                editLeave ? submitEditLeave() : submitLeave()
                            }}>{editLeave ? 'Edit Leave' : 'Add Leave'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseAddLeave();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openAddHoliday}
                onClose={handleCloseAddHoliDay}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>Add Holiday</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
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
                                helperText={addLeaveFormDataError.numLeave ? "Pls add leave" : ""}
                                name="numLeave"
                            />
                        </div>
                        <div className='col-span-4'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Leave Date"
                                    format="DD/MM/YYYY"
                                    required
                                    maxDate={dayjs(addLeaveFormData.maxDate)}
                                    minDate={dayjs(addLeaveFormData.minDate)}
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
                                value={addLeaveFormData.leaveReason ? addLeaveFormData.leaveReason : ''}
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
                                submitHoliday()
                            }}>Add Holiday</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseAddHoliDay();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default Leaves;
import './allPayment.css';
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
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import MenuAdvance from './menus/menuAdvance';
import MenuFine from './menus/menuFine';
import MenuBonus from './menus/menuBonus';
import MenuCredit from './menus/menuCredit';
import MenuLeaves from './menus/menuLeaves';
import MenuTransaction from './menus/menuTransaction';
import ExportMenu from '../exportMenu';
import CountCard from '../countCard/countCard';
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
const viewCutTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '85%',
    maxHeight: '85%',
    overflow: 'hidden',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingTop: '15px',
    paddingBottom: '10px',
    borderRadius: '10px'
};
const viewCutTableCredit = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    // height: '60%',
    maxHeight: '60%',
    overflow: 'scroll',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingTop: '15px',
    paddingBottom: '10px',
    borderRadius: '10px'
};
function AllPayments() {
    let { id } = useParams();
    const [tabTable, setTabTable] = React.useState(2);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchWord, setSearchWord] = React.useState('');
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [countData, setCountData] = React.useState();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [editFormData, setEditFormData] = React.useState();
    const [calculationData, setCalculationData] = React.useState();
    const [openModalCalculation, setOpenModalCalculation] = React.useState(false);
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;
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




    const [monthlySalary, setMonthlySalary] = React.useState();
    const [advanceData, setAdvanceData] = React.useState();
    const [fineData, setFineData] = React.useState();
    const [fineStatus, setFineStatus] = React.useState('');
    const [creditData, setCreditData] = React.useState();
    const [bonusData, setBonusData] = React.useState();
    const [leaveData, setLeaveData] = React.useState();
    const [transactionData, setTransactionData] = React.useState();
    const [totalRowsMonthly, setTotalRowsMonthly] = React.useState(0);
    const [totalRowsAdvance, setTotalRowsAdvance] = React.useState(0);
    const [totalRowsFine, setTotalRowsFine] = React.useState(0);
    const [totalRowsCredit, setTotalRowsCredit] = React.useState(0);
    const [totalRowsBonus, setTotalRowsBonus] = React.useState(0);
    const [totalRowsLeaves, setTotalRowsLeaves] = React.useState(0);
    const [totalRowsTransaction, setTotalRowsTransaction] = React.useState(0);
    const [calculationDataCredit, setCalculationDataCredit] = React.useState();
    const [openModalCalculationCredit, setOpenModalCalculationCredit] = React.useState(false);




    const handleCloseModelCalculationCredit = () => {
        setEditFormData()
        setOpenModalCalculationCredit(false);
    }
    const deleteBonus = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeBonusTransaction?bonusId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getCountData();
                setPage(0);
                setRowsPerPage(5);
                filter ? getBonusDataByFilter() : getBonusData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteBonus = (id) => {
        if (window.confirm("Are you sure you want to delete Bonus?")) {
            deleteBonus(id);
        }
    }
    const deleteCredit = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeCreditTransaction?creditId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getCountData();
                setPage(0);
                setRowsPerPage(5);
                filter ? getCreditDataByFilter() : getCreditData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteCredit = (id) => {
        if (window.confirm("Are you sure you want to delete Credit?")) {
            deleteCredit(id);
        }
    }
    const deleteTransaction = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeSalaryTranction?transactionId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getCountData();
                setPage(0);
                setRowsPerPage(5);
                filter ? getTransactionDataByFilter() : getTransactionData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteTransaction = (id) => {
        if (window.confirm("Are you sure you want to delete Transaction?")) {
            deleteTransaction(id);
        }
    }
    const getInvoice = async (id, tId, employeeNickName) => {
        if (window.confirm('Are you sure you want to Download Reciept ... ?')) {
            await axios({
                url: `${BACKEND_BASE_URL}staffrouter/getEmployeeInvoice?employeeId=${id}&invoiceId=${tId}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = employeeNickName + '_' + new Date().toLocaleDateString() + '.pdf'
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
    const handleCloseModelCalculation = () => {
        setEditFormData()
        setOpenModalCalculation(false);
    }
    const getCalculationData = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getCutSalaryDataById?remainSalaryId=${id}`, config)
            .then((res) => {
                setCalculationData(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleOpenModelCalculation = (id, employeeId, salary, advance, fine, name) => {
        setEditFormData({
            salary: salary,
            advance: advance,
            fine: fine,
            employeeId: employeeId,
            transactionId: id,
            nickName: name
        })
        getCalculationData(id);
        setOpenModalCalculation(true);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onSearchChange = (e) => {
        setFilter(false)
        setState([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ])
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
    const handleChangeFineStatus = (e) => {
        setPage(0);
        setRowsPerPage(5);
        filter ? getFineDataByFilterBySorting(e.target.value) : getFineDataBySorting(e.target.value)
        setFineStatus(e.target.value)
    };
    const handleSearch = () => {
        console.log(':::???:::', document.getElementById('searchWord').value)
        search(document.getElementById('searchWord').value)
    }
    const debounceFunction = React.useCallback(debounce(handleSearch), [])




    const markAsConsider = async (fineId, employeeId) => {
        setLoading(true)
        await axios.get(`${BACKEND_BASE_URL}staffrouter/updateFineStatus?employeeId=${employeeId}&fineId=${fineId}&fineStatus=1`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getCountData();
                setPage(0);
                setRowsPerPage(5);
                filter ? getFineDataByFilter() : getFineData()
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const markAsIgnore = async (fineId, employeeId) => {
        setLoading(true)
        await axios.get(`${BACKEND_BASE_URL}staffrouter/updateFineStatus?employeeId=${employeeId}&fineId=${fineId}&fineStatus=0`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getCountData();
                setPage(0);
                setRowsPerPage(5);
                filter ? getFineDataByFilter() : getFineData()
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteFine = (id) => {
        if (window.confirm("Are you sure you want to delete Fine?")) {
            deleteFine(id);
        }
    }
    const deleteAdvance = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeAdvanceTransaction?advanceId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                getCountData();
                setRowsPerPage(5);
                filter ? getAdvanceDataByFilter() : getAdvanceData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteAdvance = (id) => {
        if (window.confirm("Are you sure you want to delete Advance?")) {
            deleteAdvance(id);
        }
    }
    const deleteFine = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeFineTransaction?fineId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                getCountData();
                filter ? getFineDataByFilter() : getFineData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCreditData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeCreditData?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setCreditData(res.data.rows);
                setTotalRowsCredit(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getCreditDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeCreditData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setCreditData(res.data.rows);
                setTotalRowsCredit(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getCreditDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeCreditData?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setCreditData(res.data.rows);
                setTotalRowsCredit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCreditDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeCreditData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setCreditData(res.data.rows);
                setTotalRowsCredit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getBonusData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeBonusData?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setBonusData(res.data.rows);
                setTotalRowsBonus(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getBonusDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeBonusData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setBonusData(res.data.rows);
                setTotalRowsBonus(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getBonusDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeBonusData?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setBonusData(res.data.rows);
                setTotalRowsBonus(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getBonusDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeBonusData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setBonusData(res.data.rows);
                setTotalRowsBonus(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getTransactionData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeTransactionData?page=${1}&numPerPage=${5}&searchNumber=${''}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getTransactionDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeTransactionData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&searchNumber=${''}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getTransactionDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeTransactionData?page=${pageNum}&numPerPage=${rowPerPageNum}&searchNumber=${''}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getTransactionDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeTransactionData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&searchNumber=${''}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getAdvanceData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeAdvanceData?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setAdvanceData(res.data.rows);
                setTotalRowsAdvance(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getAdvanceDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeAdvanceData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setAdvanceData(res.data.rows);
                setTotalRowsAdvance(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getAdvanceDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeAdvanceData?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setAdvanceData(res.data.rows);
                setTotalRowsAdvance(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getAdvanceDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeAdvanceData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setAdvanceData(res.data.rows);
                setTotalRowsAdvance(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getFineData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeFineData?page=${1}&numPerPage=${5}&fineStatus=${fineStatus}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getFineDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeFineData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&fineStatus=${fineStatus}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getFineDataBySorting = async (status) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeFineData?page=${1}&numPerPage=${5}&fineStatus=${status}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getFineDataByFilterBySorting = async (status) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeFineData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${5}&fineStatus=${status}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getFineDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeFineData?page=${pageNum}&numPerPage=${rowPerPageNum}&fineStatus=${fineStatus}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getFineDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeFineData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&fineStatus=${fineStatus}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        if (tabTable === 2 || tabTable === '2') {
            if (filter) {
                getAdvanceDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getAdvanceDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tabTable === 3 || tabTable === '3') {
            if (filter) {
                getFineDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getFineDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tabTable === 5 || tabTable === '5') {
            if (filter) {
                getCreditDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getCreditDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tabTable === 6 || tabTable === '6') {
            if (filter) {
                getBonusDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getBonusDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tabTable === 4 || tabTable === '4') {
            if (filter) {
                getTransactionDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getTransactionDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    };
    const getCalculationDataCredit = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getCutCreditDataById?cafId=${id}`, config)
            .then((res) => {
                setCalculationDataCredit(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleOpenModelCalculationCredit = (id, credit, type, name) => {
        setEditFormData({
            cafId: id,
            creditAmount: credit,
            creditType: type,
            nickName: name
        })
        getCalculationDataCredit(id);
        setOpenModalCalculationCredit(true);
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tabTable === 2 || tabTable === '2') {
            if (filter) {
                getAdvanceDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getAdvanceDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabTable === 3 || tabTable === '3') {
            if (filter) {
                getFineDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getFineDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabTable === 5 || tabTable === '5') {
            if (filter) {
                getCreditDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getCreditDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabTable === 6 || tabTable === '6') {
            if (filter) {
                getBonusDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getBonusDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabTable === 4 || tabTable === '4') {
            if (filter) {
                getTransactionDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getTransactionDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };



    const search = async (searchWord) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllEmployeeTransactionData?page=${1}&numPerPage=${5}&searchNumber=${searchWord}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const advanceExcelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllAdvanceData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllAdvanceData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Advance_Data_' + new Date().toLocaleDateString() + '.xlsx'
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
    const advancePdfExport = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportPdfForAllAdvanceData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}staffrouter/exportPdfForAllAdvanceData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Advance_Data_' + new Date().toLocaleDateString() + '.pdf'
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

    const fineExcelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllFineData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&fineStatus=${fineStatus}` : `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllFineData?startDate=${''}&endDate=${''}&fineStatus=${fineStatus}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Fine_Data_' + new Date().toLocaleDateString() + '.xlsx'
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
    const finePdfExport = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportPdfForALLFineData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&fineStatus=${fineStatus}` : `${BACKEND_BASE_URL}staffrouter/exportPdfForALLFineData?startDate=${''}&endDate=${''}&fineStatus=${fineStatus}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Fine_Data_' + new Date().toLocaleDateString() + '.pdf'
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

    const transactionExcelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllTransactionData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchNumber=${searchWord}` : `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllTransactionData?startDate=${''}&endDate=${''}&searchNumber=${searchWord}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Transaction_Data_' + new Date().toLocaleDateString() + '.xlsx'
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
    const transactionPdfExport = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportPdfForAllTransactionData?startDate=${state[0].startDate}&endDate=${state[0].endDate}&searchNumber=${searchWord}` : `${BACKEND_BASE_URL}staffrouter/exportPdfForAllTransactionData?startDate=${''}&endDate=${''}&searchNumber=${searchWord}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Transaction_Data_' + new Date().toLocaleDateString() + '.pdf'
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

    const creditExcelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllCreditData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllCreditData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Credit_Data_' + new Date().toLocaleDateString() + '.xlsx'
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
    const creditPdfExport = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportPdfForAllCreditData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}staffrouter/exportPdfForAllCreditData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Credit_Data_' + new Date().toLocaleDateString() + '.pdf'
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


    const bonusExcelExport = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllBonusData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}staffrouter/exportExcelSheetForAllBonusData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Bonus_Data_' + new Date().toLocaleDateString() + '.xlsx'
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
    const bonusPdfExport = async () => {
        if (window.confirm('Are you sure you want to export Pdf ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}staffrouter/exportPdfForAllBonusData?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}staffrouter/exportPdfForAllBonusData?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Bonus_Data_' + new Date().toLocaleDateString() + '.pdf'
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
    const getCountData = async () => {
        await axios.get(filter ? `${BACKEND_BASE_URL}staffrouter/getAllPaymentStatisticsCount?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}staffrouter/getAllPaymentStatisticsCount?startDate=${''}&endDate=${''}`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getCountDataByFliter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllPaymentStatisticsCount?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getCountDataOnCancle = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAllPaymentStatisticsCount?startDate=${''}&endDate=${''}`, config)
            .then((res) => {
                setCountData(res.data);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    useEffect(() => {
        // getData();
        getCountData();
        getAdvanceData();
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
            <div className='grid grid-cols-12 mt-6 '>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-12'>
                                <div className='grid grid-cols-12 pl-6 pr-6 gap-3 h-full'>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 2 || tabTable === '2' ? 'tabDebit' : 'productTab'}`} onClick={() => {
                                        setTabTable(2);
                                        filter ? getAdvanceDataByFilter() : getAdvanceData();
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getStockInDataByTabByFilter('debit') : getStockInDataByTab('debit'); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Advance</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 3 || tabTable === '3' ? 'tabCash' : 'productTab'}`} onClick={() => {
                                        setTabTable(3);
                                        filter ? getFineDataByFilter() : getFineData();
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getStockInDataByTabByFilter('cash') : getStockInDataByTab('cash'); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Fine</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 4 || tabTable === '4' ? 'tabTransaction' : 'productTab'}`} onClick={() => {
                                        setTabTable(4);
                                        filter ? getTransactionDataByFilter() : getTransactionData()
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getDebitDataByFilter() : getDebitDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Transactions</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 5 || tabTable === '5' ? 'products' : 'productTab'}`} onClick={() => {
                                        setTabTable(5);
                                        filter ? getCreditDataByFilter() : getCreditData()
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getProductDataByFilter() : getProductDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Credit</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 6 || tabTable === '6' ? 'bonusTab' : 'productTab'}`} onClick={() => {
                                        setTabTable(6);
                                        filter ? getBonusDataByFilter() : getBonusData()
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getProductDataByFilter() : getProductDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Bonus</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-6'>
                {
                    (tabTable === 2 || tabTable === '2') &&
                    <div className='grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <CountCard color={'black'} count={countData && countData.totalAdvance ? countData.totalAdvance : 0} desc={'Total Advance'} productDetail={true} unitDesc={0} />
                        </div>
                        <div className='col-span-3'>
                            <CountCard color={'pink'} count={countData && countData.totalRemainAdvance ? countData.totalRemainAdvance : 0} desc={'Remaining Advance'} productDetail={true} unitDesc={0} />
                        </div>
                    </div>
                }
                {
                    (tabTable === 3 || tabTable === '3') &&
                    <div className='grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <CountCard color={'black'} count={countData && countData.totalFine ? countData.totalFine : 0} desc={'Total Fine'} productDetail={true} unitDesc={0} />
                        </div>
                        <div className='col-span-3'>
                            <CountCard color={'pink'} count={countData && countData.totalConsiderFine ? countData.totalConsiderFine : 0} desc={'Considered Fine'} productDetail={true} unitDesc={0} />
                        </div>
                        <div className='col-span-3'>
                            <CountCard color={'blue'} count={countData && countData.totalIgnoreFine ? countData.totalIgnoreFine : 0} desc={'Ignored Fine'} productDetail={true} unitDesc={0} />
                        </div>
                        <div className='col-span-3'>
                            <CountCard color={'blue'} count={countData && countData.totalRemainFine ? countData.totalRemainFine : 0} desc={'Remaining Fine'} productDetail={true} unitDesc={0} />
                        </div>
                    </div>
                }
                {
                    (tabTable === 4 || tabTable === '4') &&
                    <div className='grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <CountCard color={'black'} count={countData && countData.salaryPaySum ? countData.salaryPaySum : 0} desc={'Salary Paid'} productDetail={true} unitDesc={0} />
                        </div>
                        <div className='col-span-3'>
                            <CountCard color={'pink'} count={countData && countData.advanceCutSum ? countData.advanceCutSum : 0} desc={'Advance Cut'} productDetail={true} unitDesc={0} />
                        </div>
                        <div className='col-span-3'>
                            <CountCard color={'blue'} count={countData && countData.fineCutSum ? countData.fineCutSum : 0} desc={'Fine Cut'} productDetail={true} unitDesc={0} />
                        </div>
                    </div>
                }
                {
                    (tabTable === 5 || tabTable === '5') &&
                    <div className='grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <CountCard color={'black'} count={countData && countData.totalCreditAmount ? countData.totalCreditAmount : 0} desc={'Total Credit'} productDetail={true} unitDesc={0} />
                        </div>
                    </div>
                }
                {
                    (tabTable === 6 || tabTable === '6') &&
                    <div className='grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <CountCard color={'black'} count={countData && countData.totalBonusAmount ? countData.totalBonusAmount : 0} desc={'Total Bonus'} productDetail={true} unitDesc={0} />
                        </div>
                    </div>
                }
            </div>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12 pb-6'>
                    <div className='tableSubContainer pt-2'>
                        <div className='grid grid-cols-12 pt-6'>
                            <div className='col-span-4 flex justify-start pl-4'>
                                <div className='dateRange text-center self-center' aria-describedby={id} onClick={handleClick}>
                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                </div>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                        setFilter(false);
                                        setPage(0);
                                        getCountDataOnCancle();
                                        setRowsPerPage(5)
                                        tabTable === 2 || tabTable === '2' ? getAdvanceData() : tabTable === 3 || tabTable === '3' ? getFineData() : tabTable === 6 || tabTable === '6' ? getBonusData() : tabTable === 5 || tabTable === '5' ? getCreditData() : tabTable === 4 || tabTable === '4' ? getTransactionData() : tabTable === 3 || tabTable === '3' ? getFineData() : getAdvanceData();
                                        // tab === 2 || tab === '2' ?
                                        //     getDebitCounts() : tab === 3 || tab === '3' ? getCashCounts() : getDebitCounts();
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
                                                    tabTable === 2 || tabTable === '2' ? getAdvanceDataByFilter() : tabTable === 3 || tabTable === '3' ? getFineDataByFilter() : tabTable === 6 || tabTable === '6' ? getBonusDataByFilter() : tabTable === 5 || tabTable === '5' ? getCreditDataByFilter() : tabTable === 4 || tabTable === '4' ? getTransactionDataByFilter() : tabTable === 3 || tabTable === '3' ? getFineDataByFilter() : getAdvanceDataByFilter();
                                                    // tab === 2 || tab === '2' ? getDebitCountsByFilter() : tab === 3 || tab === '3' ? getCashCountsByFilter() : getDebitCountsByFilter();
                                                    setSearchWord('');
                                                    setRowsPerPage(5)
                                                    getCountDataByFliter();
                                                    setFilter(true); setPage(0); handleClose()
                                                }}>Apply</button>
                                            </div>
                                            <div className='col-span-3'>
                                                <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                            </div>
                                        </div>
                                    </Box>
                                </Popover>
                            </div>
                            {(tabTable === '4' || tabTable === 4) &&
                                <div className='col-span-3 pl-8'>
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
                            }
                            {(tabTable === '3' || tabTable === 3) &&
                                <div className='col-span-2 pl-8'>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={fineStatus}
                                            label="status"
                                            name='fineStatus'
                                            onChange={handleChangeFineStatus}
                                        >
                                            <MenuItem key='xx' value={''}>Clear</MenuItem>
                                            <MenuItem key='1' value={1}>Considered</MenuItem>
                                            <MenuItem key='0' value={0}>Ignored</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>}
                            <div className='col-span-3 col-start-10 pr-5 flex justify-end'>
                                {/* <button className='exportExcelBtn'
                                // onClick={() => { tab === 2 || tab === '2' ? debitExportExcel() : tab === 3 || tab === '3' ? CashExportExcel() : DebitDataExportExcel() }}
                                ><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button> */}
                                <ExportMenu exportExcel={
                                    () => {
                                        tabTable === 2 || tabTable === '2' ? advanceExcelExport() : tabTable === 3 || tabTable === '3' ? fineExcelExport() : tabTable === 6 || tabTable === '6' ? bonusExcelExport() : tabTable === 5 || tabTable === '5' ? creditExcelExport() : tabTable === 4 || tabTable === '4' ? transactionExcelExport() : tabTable === 3 || tabTable === '3' ? fineExcelExport() : advanceExcelExport();
                                    }
                                } exportPdf={
                                    () => {
                                        tabTable === 2 || tabTable === '2' ? advancePdfExport() : tabTable === 3 || tabTable === '3' ? finePdfExport() : tabTable === 6 || tabTable === '6' ? bonusPdfExport() : tabTable === 5 || tabTable === '5' ? creditPdfExport() : tabTable === 4 || tabTable === '4' ? transactionPdfExport() : tabTable === 3 || tabTable === '3' ? finePdfExport() : advancePdfExport();
                                    }
                                }
                                    isDisable={tabTable === 2 || tabTable === '2' ? totalRowsAdvance == 0 ? true : false : tabTable === 3 || tabTable === '3' ? totalRowsFine == 0 ? true : false : tabTable === 6 || tabTable === '6' ? totalRowsBonus == 0 ? true : false : tabTable === 5 || tabTable === '5' ? totalRowsCredit == 0 ? true : false : tabTable === 4 || tabTable === '4' ? totalRowsTransaction == 0 ? true : false : tabTable === 3 || tabTable === '3' ? totalRowsFine == 0 ? true : false : false}
                                />
                            </div>
                        </div>
                        {
                            (tabTable === '2' || tabTable === 2) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell>Employee Name</TableCell>
                                                <TableCell align="left">Advance Amount</TableCell>
                                                <TableCell align="left">Remaining Advance</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {advanceData?.map((row, index) => (
                                                totalRowsAdvance !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.advanceId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
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
                                                        <TableCell align="left" >₹ {parseFloat(row.advanceAmount).toLocaleString('en-IN')} /-</TableCell>
                                                        <TableCell align="left" >₹ {parseFloat(row.remainAdvanceAmount).toLocaleString('en-IN')} /-</TableCell>
                                                        <Tooltip title={row.advanceComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'><marquee scrollamount="3">{row.advanceComment}</marquee></div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.advanceDate}</TableCell>
                                                        <TableCell align="left" >{row.givenTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuAdvance data={row} handleDeleteAdvance={handleDeleteAdvance} setError={setError} />
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
                                        count={totalRowsAdvance}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tabTable === '3' || tabTable === 3) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell>Employee Name</TableCell>
                                                <TableCell align="left">Fine Amount</TableCell>
                                                <TableCell align="left">Remaining Fine</TableCell>
                                                <TableCell align="left">Reason</TableCell>
                                                <TableCell align="left">Fine Status</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fineData?.map((row, index) => (
                                                totalRowsFine !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.fineId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
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
                                                        <TableCell align="left" >₹ {parseFloat(row.fineAmount ? row.fineAmount : 0).toLocaleString('en-IN')} /-</TableCell>
                                                        <TableCell align="left" >₹ {parseFloat(row.remainFineAmount ? row.remainFineAmount : 0).toLocaleString('en-IN')} /-</TableCell>
                                                        {console.log(row.reduceFineReson != null)}
                                                        <Tooltip title={row.reason + `${row.reduceFineReson != null ? ' / ' + row.reduceFineReson : ''}`} placement="top-start" arrow><TableCell align="left" ><div className='fineReducedComment'><marquee scrollamount='3'>{row.reason + `${row.reduceFineReson != null ? ' / ' + row.reduceFineReson : ''}`}</marquee></div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.fineStatusName}</TableCell>
                                                        <TableCell align="left" >{row.fineDate}</TableCell>
                                                        <TableCell align="left" >{row.givenTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuFine data={row} handleDeleteFine={handleDeleteFine} markAsIgnore={markAsIgnore} setError={setError} markAsConsider={markAsConsider} />
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
                                        count={totalRowsFine}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tabTable === '4' || tabTable === 4) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Trasaction Id</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell>Employee Name</TableCell>
                                                <TableCell align="left">Salary Pay</TableCell>
                                                <TableCell align="left">Advance Cut</TableCell>
                                                <TableCell align="left">Fine Cut</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {transactionData?.map((row, index) => (
                                                totalRowsTransaction !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.trasactionId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell align="left" >{row.trasactionId}</TableCell>
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
                                                        <TableCell align="left" >₹ {parseFloat(row.salaryPay ? row.salaryPay : 0).toLocaleString('en-IN')} /-</TableCell>
                                                        <TableCell align="left" >₹ {parseFloat(row.advanceCut ? row.advanceCut : 0).toLocaleString('en-IN')} /-</TableCell>
                                                        <TableCell align="left" >₹ {parseFloat(row.fineCut ? row.fineCut : 0).toLocaleString('en-IN')} /-</TableCell>
                                                        <Tooltip title={row.salaryComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'><marquee scrollamount='3'>{row.salaryComment}</marquee></div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.salaryDate}</TableCell>
                                                        <TableCell align="left" >{row.salaryTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuTransaction data={row} handleDeleteTransaction={handleDeleteTransaction} getInvoice={getInvoice} handleOpenModelCalculation={handleOpenModelCalculation} />
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
                                        count={totalRowsTransaction}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tabTable === '5' || tabTable === 5) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell>Employee Name</TableCell>
                                                <TableCell align="left">Credit Amount</TableCell>
                                                <TableCell align="left">Credit Type</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {creditData?.map((row, index) => (
                                                totalRowsCredit !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.fineId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
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
                                                        <TableCell align="left" >₹ {parseFloat(row.creditAmount ? row.creditAmount : 0).toLocaleString('en-IN')} /-</TableCell>
                                                        <TableCell align="left" >{row.creditType}</TableCell>
                                                        <Tooltip title={row.creditComent} placement="top-start" arrow><TableCell align="left" ><div className='Comment'><marquee scrollamount='3'>{row.creditComent}</marquee></div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.creditDate}</TableCell>
                                                        <TableCell align="left" >{row.givenTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuCredit data={row} handleDeleteCredit={handleDeleteCredit} handleOpenModelCalculationCredit={handleOpenModelCalculationCredit} />
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
                                        count={totalRowsCredit}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tabTable === '6' || tabTable === 6) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell>Employee Name</TableCell>
                                                <TableCell align="left">Bonus Amount</TableCell>
                                                <TableCell align="left">Reason</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {bonusData?.map((row, index) => (
                                                totalRowsBonus !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.fineId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
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
                                                        <TableCell align="left" >₹ {parseFloat(row.bonusAmount ? row.bonusAmount : 0).toLocaleString('en-IN')} /-</TableCell>
                                                        <Tooltip title={row.bonusComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'><marquee scrollamount='3'>{row.bonusComment}</marquee></div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.bonusDate}</TableCell>
                                                        <TableCell align="left" >{row.givenTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuBonus data={row} handleDeleteBonus={handleDeleteBonus} />
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
                                        count={totalRowsBonus}
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
            <Modal
                open={openModalCalculation}
                onClose={handleCloseModelCalculation}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={viewCutTable}>
                    <div className='flex justify-between'>
                        <div className='pt-1 pl-2'>
                            <Typography id="modal-modal" variant="h6" component="h2">
                                <span className='makePaymentHeader'>Paid Salary Calculation for {editFormData && editFormData.nickName}</span>
                            </Typography>
                        </div>
                        <div>
                            <IconButton aria-label="delete" onClick={handleCloseModelCalculation}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='pt-1 pl-2'>
                            <Typography id="modal-modal" variant="h6" component="h2">
                                <span className='makePaymentHeader'>Total Payment : </span><span className='makePaymentName'>{"10000"}</span>
                            </Typography>
                        </div>
                    </div>
                    <div className='displayTable' style={{ maxHeight: '85%', overflow: "scroll" }}>
                        {/* <div className='mt-4 pb-2 displayTable mb-4' style={{ maxHeight: '320px', overflow: 'hidden' }}> */}
                        {/* <Paper sx={{ width: '100%', overflow: 'hidden' }}> */}
                        {/* </Paper> */}
                        <div className='mt-6'>
                            <Accordion square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem', padding: '0px' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Salary Cut Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead >
                                                <TableRow>
                                                    <TableCell >No.</TableCell>
                                                    <TableCell>Month</TableCell>
                                                    <TableCell>Total Salary</TableCell>
                                                    <TableCell align="left">Remaining Salary</TableCell>
                                                    <TableCell align="left">Salary Cut</TableCell>
                                                    <TableCell align="left">Advance Cut</TableCell>
                                                    <TableCell align="left">Fine Cut</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {calculationData && calculationData.monthlySalaryCut.length > 0 ? calculationData.monthlySalaryCut.map((row, index) => (
                                                    <TableRow
                                                        hover
                                                        key={row.monthlySalaryId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1)}</TableCell>
                                                        <TableCell align="left" >{row.monthYear}</TableCell>
                                                        {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" >
                                                            {parseFloat(row.originalTotalSalary ? row.originalTotalSalary : 0).toLocaleString('en-IN')}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left">{parseFloat(row.totalSalary ? row.totalSalary : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left">{parseFloat(row.salary ? row.salary : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left">{parseFloat(row.cutAdvance).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left">{parseFloat(row.cutFine).toLocaleString('en-IN')}</TableCell>
                                                    </TableRow>

                                                ))
                                                    : <TableRow
                                                        key={"salary"}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data"}</TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className='mt-6'>
                            <Accordion square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem', padding: '0px' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Advance Cut Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead >
                                                <TableRow>
                                                    <TableCell >No.</TableCell>
                                                    <TableCell>Advance Amount</TableCell>
                                                    <TableCell>Advance Remaining</TableCell>
                                                    <TableCell align="left">Advance Cut</TableCell>
                                                    <TableCell align="left">Advance Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {calculationData && calculationData.advanceSalaryCut.length > 0 ? calculationData.advanceSalaryCut.map((row, index) => (
                                                    <TableRow
                                                        hover
                                                        key={row.advanceId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1)}</TableCell>
                                                        <TableCell align="left" >{parseFloat(row.advanceAmount ? row.advanceAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                        {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" >
                                                            {parseFloat(row.remainAdvanceAmount ? row.remainAdvanceAmount : 0).toLocaleString('en-IN')}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left">{parseFloat(row.cutAdvanceAmount ? row.cutAdvanceAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left">{row.advanceDate}</TableCell>
                                                    </TableRow>
                                                ))
                                                    : <TableRow
                                                        key={'advance'}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data"}</TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className='mt-6'>
                            <Accordion square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem', padding: '0px' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Fine Cut Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead >
                                                <TableRow>
                                                    <TableCell >No.</TableCell>
                                                    <TableCell>Fine Amount</TableCell>
                                                    <TableCell>Fine Remaining</TableCell>
                                                    <TableCell align="left">Fine Cut</TableCell>
                                                    <TableCell align="left">Fine Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {calculationData && calculationData.fineSalaryCut.length > 0 ? calculationData.fineSalaryCut.map((row, index) => (
                                                    <TableRow
                                                        hover
                                                        key={row.fineId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1)}</TableCell>
                                                        <TableCell align="left" >{parseFloat(row.fineAmount ? row.fineAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                        {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" >
                                                            {parseFloat(row.remainFineAmount ? row.remainFineAmount : 0).toLocaleString('en-IN')}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left">{parseFloat(row.cutFineAmount ? row.cutFineAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                        <TableCell align="left">{row.fineDate}</TableCell>
                                                    </TableRow>
                                                ))
                                                    : <TableRow
                                                        key={'advance'}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data"}</TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className='mt-10'>
                            <div className='calculationWrp'>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3'>
                                        Total Salary
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 '>
                                        {calculationData ? parseFloat(calculationData.remainSalaryAmount).toLocaleString('en-IN') : "~"}
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Total Advance
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3'>
                                        {calculationData ? parseFloat(calculationData.remainAdvanceAmount).toLocaleString('en-IN') : "~"}
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Total Fine
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 calculationFont'>
                                        {calculationData ? parseFloat(calculationData.remainFineAmount).toLocaleString('en-IN') : "~"}
                                    </div>
                                </div>
                                <div className='lineBreak mt-4 mb-4'>
                                    <hr className='lineBreakHr'></hr>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3'>
                                        Salary Pay
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 '>
                                        {parseFloat(editFormData && editFormData.salary).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Advance Cut
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3'>
                                        {parseFloat(editFormData && editFormData.advance).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Fine Cut
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 calculationFont'>
                                        {parseFloat(editFormData && editFormData.fine).toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className='lineBreak mt-4 mb-4'>
                                    <hr className='lineBreakHr'></hr>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3'>
                                        Remaining Salary
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 '>
                                        {calculationData && editFormData ? parseFloat(calculationData.remainSalaryAmount - editFormData.salary - editFormData.advance - editFormData.fine).toLocaleString('en-IN') : "~"}
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Remaining Advance
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3'>
                                        {calculationData && editFormData ? parseFloat(calculationData.remainAdvanceAmount - editFormData.advance).toLocaleString('en-IN') : "~"}
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Remaining Fine
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 calculationFont'>
                                        {calculationData && editFormData ? parseFloat(calculationData.remainFineAmount - editFormData.fine).toLocaleString('en-IN') : "~"}
                                    </div>
                                    <div className='col-span-5  flex justify-end'>
                                        <button className='exportExcelBtn'
                                            onClick={() => getInvoice(editFormData.employeeId, editFormData.transactionId, editFormData.nickName)}
                                        ><FileDownloadIcon />&nbsp;&nbsp;Print Salary Slip</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openModalCalculationCredit}
                onClose={handleCloseModelCalculationCredit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={viewCutTableCredit}>
                    <div className='flex justify-between'>
                        <div className='pt-1 pl-2'>
                            <Typography id="modal-modal" variant="h6" component="h2">
                                <span className='makePaymentHeader'>Credit Cut From {editFormData && editFormData.creditType} for {editFormData && editFormData.nickName}</span>
                            </Typography>
                        </div>
                        <div>
                            <IconButton aria-label="delete" onClick={handleCloseModelCalculationCredit}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='pt-1 pl-2'>
                            <Typography id="modal-modal" variant="h6" component="h2">
                                <span className='makePaymentHeader'>Credit : </span><span className='makePaymentName'>{editFormData && editFormData.creditAmount}</span>
                            </Typography>
                        </div>
                    </div>
                    <div className='displayTable' style={{ maxHeight: '90%', overflow: "scroll" }}>
                        <div className='mt-6'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell >No.</TableCell>
                                            <TableCell>{editFormData && editFormData.creditType} Amount</TableCell>
                                            <TableCell>Cut Credit Amount</TableCell>
                                            <TableCell align="left">Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {calculationDataCredit && calculationDataCredit.length > 0 ? calculationDataCredit.map((row, index) => (
                                            <TableRow
                                                hover
                                                key={row.monthlySalaryId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                style={{ cursor: "pointer" }}
                                                className='tableRow'
                                            >
                                                <TableCell align="left" >{(index + 1)}</TableCell>
                                                <TableCell align="left" >{row.Amount}</TableCell>
                                                {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                <TableCell component="th" scope="row" >
                                                    {row.cutCreditAmount}
                                                </TableCell>
                                                {/* </Tooltip> */}
                                                <TableCell align="left">{row.Date}</TableCell>
                                            </TableRow>

                                        ))
                                            : <TableRow
                                                key={"salary"}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data"}</TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default AllPayments;
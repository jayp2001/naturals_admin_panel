import './firmDetail.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CountCard from '../inventory/countCard/countCard';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { Select, MenuItem, FormControl, InputLabel, Button, Modal, IconButton, Divider } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import Popper from '@mui/material/Popper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import TableBarIcon from '@mui/icons-material/TableBar';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    maxHeight: '88vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column'
};

function FirmDetail() {
    let { id } = useParams();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [formData, setFormData] = React.useState({
        supplierName: '',
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    // Table tabs state (Bills/Cancel/Month View) - independent from statistics
    const [tableTab, setTableTab] = React.useState(1);
    const [suppilerDetails, setSuppilerDetails] = useState();
    const [statisticsCount, setStatisticsCounts] = useState();

    // Table state variables
    const [billData, setBillData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [billPayType, setBillPayType] = useState('');
    const [billType, setBillType] = useState('');

    // Cancel tab state variables
    const [cancelBillData, setCancelBillData] = useState([]);
    const [cancelTotalRows, setCancelTotalRows] = useState(0);
    const [cancelPage, setCancelPage] = useState(0);
    const [cancelRowsPerPage, setCancelRowsPerPage] = useState(5);
    const [cancelBillType, setCancelBillType] = useState('');

    // Complimentary tab state variables
    const [complimentaryBillData, setComplimentaryBillData] = useState([]);
    const [complimentaryTotalRows, setComplimentaryTotalRows] = useState(0);
    const [complimentaryPage, setComplimentaryPage] = useState(0);
    const [complimentaryRowsPerPage, setComplimentaryRowsPerPage] = useState(5);
    const [complimentaryBillPayType, setComplimentaryBillPayType] = useState('');
    const [complimentaryBillType, setComplimentaryBillType] = useState('');

    // Month View tab state variables
    const [monthViewData, setMonthViewData] = useState([]);
    const [monthViewTotalRows, setMonthViewTotalRows] = useState(0);
    const [monthViewPage, setMonthViewPage] = useState(0);
    const [monthViewRowsPerPage, setMonthViewRowsPerPage] = useState(5);

    // Bill Info Modal state
    const [infoPopUpOpen, setInfoPopUpOpen] = useState(false);
    const [infoPopUpData, setInfoPopUpData] = useState(null);

    // Filter modal state
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);
    const [filterFormData, setFilterFormData] = React.useState({
        billPayType: "",
        billType: ""
    });

    // Cancel tab filter state
    const [anchorElCancelFilter, setAnchorElCancelFilter] = React.useState(null);
    const [cancelFilterFormData, setCancelFilterFormData] = React.useState({
        billType: ""
    });

    // Complimentary tab filter state
    const [anchorElComplimentaryFilter, setAnchorElComplimentaryFilter] = React.useState(null);
    const [complimentaryFilterFormData, setComplimentaryFilterFormData] = React.useState({
        billPayType: "",
        billType: ""
    });
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
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

    useEffect(() => { }, [state]);
    const handlTransactionDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["transactionDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const getFirmDetails = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getFirmDataById?firmId=${id}`, config)
            .then((res) => {
                setSuppilerDetails(res.data);
                setFormData((perv) => ({
                    ...perv,
                    supplierName: res.data.firmName,
                }))
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getStatistics = async (startDate = '', endDate = '') => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getStaticsDataByFirmId?firmId=${id}&startDate=${startDate}&endDate=${endDate}`, config)
            .then((res) => {
                setStatisticsCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getStatisticsByFilter = async () => {
        const startDate = state[0].startDate ? state[0].startDate : '';
        const endDate = state[0].endDate ? state[0].endDate : '';
        await getStatistics(startDate, endDate);
    }

    // Removed legacy fetch variants; using unified fetchBills below
    // Unified fetch: decides which params to attach based on current date selection and dropdown filters
    const fetchBills = async (
        pageNum = 1,
        numPerPage = 5,
        includeDateOverride,
        payTypeOverride,
        billTypeOverride
    ) => {
        const includeDate = includeDateOverride !== undefined
            ? includeDateOverride
            : !!(filter && state[0]?.startDate && state[0]?.endDate);
        const startDate = includeDate ? state[0].startDate.toDateString() : '';
        const endDate = includeDate ? state[0].endDate.toDateString() : '';
        const payType = payTypeOverride !== undefined ? payTypeOverride : filterFormData.billPayType;
        const bType = billTypeOverride !== undefined ? billTypeOverride : filterFormData.billType;

        let url = `${BACKEND_BASE_URL}billingrouter/getBillDataByFirmId?firmId=${id}&page=${pageNum}&numPerPage=${numPerPage}`;
        if (payType) url += `&billPayType=${payType}`;
        if (bType) url += `&billType=${bType}`;
        if (startDate && endDate) {
            url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }

        await axios.get(url, config)
            .then((res) => {
                setBillData(res.data.rows || []);
                setTotalRows(res.data.numRows || 0);
            })
            .catch((error) => {
                setBillData([]);
                setTotalRows(0);
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    // Fetch Cancel Bills - uses getCancelBillDataByFirmId endpoint
    const fetchCancelBills = async (
        pageNum = 1,
        numPerPage = 5,
        includeDateOverride,
        billTypeOverride
    ) => {
        const includeDate = includeDateOverride !== undefined
            ? includeDateOverride
            : !!(filter && state[0]?.startDate && state[0]?.endDate);
        const startDate = includeDate ? state[0].startDate.toDateString() : '';
        const endDate = includeDate ? state[0].endDate.toDateString() : '';
        const bType = billTypeOverride !== undefined ? billTypeOverride : cancelFilterFormData.billType;

        let url = `${BACKEND_BASE_URL}billingrouter/getCancelBillDataByFirmId?firmId=${id}&page=${pageNum}&numPerPage=${numPerPage}&searchWord=`;
        if (bType) url += `&billType=${bType}`;
        if (startDate && endDate) {
            url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        } else {
            // Add empty date parameters if no date range is selected
            url += `&startDate=&endDate=`;
        }

        await axios.get(url, config)
            .then((res) => {
                const rows = res.data.rows || [];
                setCancelBillData(rows);
                setCancelTotalRows(res.data.numRows || 0);
            })
            .catch((error) => {
                setCancelBillData([]);
                setCancelTotalRows(0);
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    // Fetch Complimentary Bills - uses getComplimentaryBillDataByFirmId endpoint
    const fetchComplimentaryBills = async (
        pageNum = 1,
        numPerPage = 5,
        includeDateOverride,
        payTypeOverride,
        billTypeOverride
    ) => {
        const includeDate = includeDateOverride !== undefined
            ? includeDateOverride
            : !!(filter && state[0]?.startDate && state[0]?.endDate);
        const startDate = includeDate ? state[0].startDate.toDateString() : '';
        const endDate = includeDate ? state[0].endDate.toDateString() : '';
        const payType = payTypeOverride !== undefined ? payTypeOverride : complimentaryFilterFormData.billPayType;
        const bType = billTypeOverride !== undefined ? billTypeOverride : complimentaryFilterFormData.billType;

        let url = `${BACKEND_BASE_URL}billingrouter/getComplimentaryBillDataByFirmId?firmId=${id}&page=${pageNum}&numPerPage=${numPerPage}&searchWord=`;
        if (payType) url += `&billPayType=${payType}`;
        if (bType) url += `&billType=${bType}`;
        if (startDate && endDate) {
            url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        } else {
            // Add empty date parameters if no date range is selected
            url += `&startDate=&endDate=`;
        }

        await axios.get(url, config)
            .then((res) => {
                const rows = res.data.rows || [];
                setComplimentaryBillData(rows);
                setComplimentaryTotalRows(res.data.numRows || 0);
            })
            .catch((error) => {
                setComplimentaryBillData([]);
                setComplimentaryTotalRows(0);
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    // Fetch Month View Data - uses getMonthWiseBillDataByFirmId endpoint
    const fetchMonthViewData = async (
        pageNum = 1,
        numPerPage = 5
    ) => {
        let url = `${BACKEND_BASE_URL}billingrouter/getMonthWiseBillDataByFirmId?firmId=${id}&page=${pageNum}&numPerPage=${numPerPage}`;

        await axios.get(url, config)
            .then((res) => {
                // API returns array directly or object with rows
                const data = Array.isArray(res.data) ? res.data : (res.data.rows || []);
                const total = res.data.numRows !== undefined ? res.data.numRows : data.length;
                setMonthViewData(data || []);
                setMonthViewTotalRows(total || 0);
            })
            .catch((error) => {
                setMonthViewData([]);
                setMonthViewTotalRows(0);
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    // Handle View Bill - Fetch bill details and open modal
    const handleViewBill = async (billId) => {
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/getBillDataById?billId=${billId}`,
                config
            );
            setInfoPopUpData(response.data);
            setInfoPopUpOpen(true);
        } catch (error) {
            setError(error.response ? error.response.data : "Network Error ...!!!");
        }
    };

    // Handle Print Bill - Call API and close modal
    const handlePrintBill = async () => {
        if (!infoPopUpData?.billId) {
            setError("Bill ID not found");
            return;
        }

        try {
            await axios.get(
                `${BACKEND_BASE_URL}billingrouter/printBillInAdminSystem?billId=${infoPopUpData.billId}`,
                config
            );
            // Close modal after successful API call
            setInfoPopUpOpen(false);
            setInfoPopUpData(null);
        } catch (error) {
            setError(error.response ? error.response.data : "Network Error ...!!!");
        }
    };

    // Handle Export PDF for Month View
    const handleExportPDF = async (startDate, endDate, monthYear, paymentType = '') => {
        try {
            let url = `${BACKEND_BASE_URL}billingrouter/getTaxReportByFirmId?firmId=${id}&startDate=${startDate}&endDate=${endDate}`;
            if (paymentType) {
                url += `&billPayType=${paymentType}`;
            }

            const response = await axios.get(url, {
                ...config,
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            const fileName = paymentType
                ? `${paymentType}_${monthYear}.pdf`
                : `All_${monthYear}.pdf`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            // Handle 404 "No Data Found" response specifically
            if (error.response?.status === 404) {
                // Read the blob as text to check for "No Data Found" message
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result === "No Data Found") {
                        setError("No Data Found");
                    } else {
                        setError(error.response ? error.response.data : "Network Error ...!!!");
                    }
                };
                if (error.response?.data) {
                    reader.readAsText(error.response.data);
                } else {
                    setError("No Data Found");
                }
            } else {
                setError(error.response ? error.response.data : "Network Error ...!!!");
            }
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Filter modal functions
    const handleClickFilter = (event) => {
        setAnchorElFilter(event.currentTarget);
    };
    const handleCloseFilter = () => {
        setAnchorElFilter(null);
    };
    const handleChangeFilter = (e) => {
        setFilterFormData((pervState) => ({
            ...pervState,
            [e.target.name]: e.target.value,
        }));
    };
    const resetFilter = () => {
        setFilterFormData({
            billPayType: "",
            billType: ""
        });
        setBillPayType('');
        setBillType('');
    };

    // Cancel tab filter modal functions
    const handleClickCancelFilter = (event) => {
        setAnchorElCancelFilter(event.currentTarget);
    };
    const handleCloseCancelFilter = () => {
        setAnchorElCancelFilter(null);
    };
    const handleChangeCancelFilter = (e) => {
        setCancelFilterFormData((pervState) => ({
            ...pervState,
            [e.target.name]: e.target.value,
        }));
    };
    const resetCancelFilter = () => {
        setCancelFilterFormData({
            billType: ""
        });
        setCancelBillType('');
    };

    // Complimentary tab filter modal functions
    const handleClickComplimentaryFilter = (event) => {
        setAnchorElComplimentaryFilter(event.currentTarget);
    };
    const handleCloseComplimentaryFilter = () => {
        setAnchorElComplimentaryFilter(null);
    };
    const handleChangeComplimentaryFilter = (e) => {
        setComplimentaryFilterFormData((pervState) => ({
            ...pervState,
            [e.target.name]: e.target.value,
        }));
    };
    const resetComplimentaryFilter = () => {
        setComplimentaryFilterFormData({
            billPayType: "",
            billType: ""
        });
        setComplimentaryBillPayType('');
        setComplimentaryBillType('');
    };
    const open = Boolean(anchorEl);
    const openFilter = Boolean(anchorElFilter);
    const openCancelFilter = Boolean(anchorElCancelFilter);
    const openComplimentaryFilter = Boolean(anchorElComplimentaryFilter);
    const ids = open ? 'simple-popover' : undefined;
    const filterId = openFilter ? 'simple-popover' : undefined;
    const cancelFilterId = openCancelFilter ? 'cancel-filter-popover' : undefined;
    const complimentaryFilterId = openComplimentaryFilter ? 'complimentary-filter-popover' : undefined;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        fetchBills(newPage + 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const per = parseInt(event.target.value, 10);
        setRowsPerPage(per);
        setPage(0);
        fetchBills(1, per);
    };

    const handleFilterChange = () => {
        setPage(0);
        fetchBills(1, rowsPerPage);
    };

    const clearFilters = () => {
        setBillPayType('');
        setBillType('');
        setFilterFormData({
            billPayType: "",
            billType: ""
        });
        setPage(0);
        // Clear dropdowns; keep date if active
        fetchBills(1, rowsPerPage, filter, '', '');
    };

    // Cancel tab pagination handlers
    const handleChangeCancelPage = (event, newPage) => {
        setCancelPage(newPage);
        fetchCancelBills(newPage + 1, cancelRowsPerPage);
    };

    const handleChangeCancelRowsPerPage = (event) => {
        const per = parseInt(event.target.value, 10);
        setCancelRowsPerPage(per);
        setCancelPage(0);
        fetchCancelBills(1, per);
    };

    const clearCancelFilters = () => {
        setCancelBillType('');
        setCancelFilterFormData({
            billType: ""
        });
        setCancelPage(0);
        // Clear dropdowns; keep date if active
        fetchCancelBills(1, cancelRowsPerPage, filter, '');
    };

    // Complimentary tab pagination handlers
    const handleChangeComplimentaryPage = (event, newPage) => {
        setComplimentaryPage(newPage);
        fetchComplimentaryBills(newPage + 1, complimentaryRowsPerPage);
    };

    const handleChangeComplimentaryRowsPerPage = (event) => {
        const per = parseInt(event.target.value, 10);
        setComplimentaryRowsPerPage(per);
        setComplimentaryPage(0);
        fetchComplimentaryBills(1, per);
    };

    const clearComplimentaryFilters = () => {
        setComplimentaryBillPayType('');
        setComplimentaryBillType('');
        setComplimentaryFilterFormData({
            billPayType: "",
            billType: ""
        });
        setComplimentaryPage(0);
        // Clear dropdowns; keep date if active
        fetchComplimentaryBills(1, complimentaryRowsPerPage, filter, '', '');
    };

    // Month View tab pagination handlers
    const handleChangeMonthViewPage = (event, newPage) => {
        setMonthViewPage(newPage);
        fetchMonthViewData(newPage + 1, monthViewRowsPerPage);
    };

    const handleChangeMonthViewRowsPerPage = (event) => {
        const per = parseInt(event.target.value, 10);
        setMonthViewRowsPerPage(per);
        setMonthViewPage(0);
        fetchMonthViewData(1, per);
    };

    useEffect(() => {
        getFirmDetails();
        getStatistics();
        fetchBills();
    }, [])

    if (!suppilerDetails) {
        return null;
    }

    if (loading) {
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
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-5 mt-6 grid gap-2 suppilerDetailContainer'>
                    <div className='suppilerHeader'>
                        Firm Details
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Firm Name :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.firmName}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            GST Number :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.gstNumber}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Address :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.firmAddress}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Pincode :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.pincode}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 hrLine'>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Mobile No :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.firmMobileNo}
                        </div>
                    </div>
                    <div className='grid grid-cols-12 gap-3 '>
                        <div className='col-span-5 suppilerDetailFeildHeader'>
                            Other Mobile No :
                        </div>
                        <div className='col-span-7 suppilerDetailFeild'>
                            {suppilerDetails.otherMobileNo}
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
                                                <div className={`flex col-span-12 justify-center ${true ? 'productTabAll' : 'productTab'}`}
                                                    onClick={() => {
                                                        // Statistics is static; no-op on click
                                                    }} >
                                                    <div className='statusTabtext'>Statistics</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-7 flex justify-end pr-4'>
                                            <div className={`dateRange text-center self-center ${filter ? 'filterActive' : ''}`} aria-describedby={ids} onClick={handleClick}>
                                                <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                            </div>
                                            <div className='resetBtnWrap col-span-3 self-center'>
                                                <button
                                                    className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                                    onClick={() => {
                                                        setFilter(false);
                                                        setPage(0);
                                                        setRowsPerPage(5);
                                                        setCancelPage(0);
                                                        setCancelRowsPerPage(5);
                                                        setComplimentaryPage(0);
                                                        setComplimentaryRowsPerPage(5);
                                                        getStatistics(); // Reset statistics without date filter

                                                        // Reset date state
                                                        setState([
                                                            {
                                                                startDate: new Date(),
                                                                endDate: new Date(),
                                                                key: 'selection'
                                                            }
                                                        ]);

                                                        // Reset table with only dropdown filters (no date). Force exclude date
                                                        if (tableTab === 1) {
                                                            fetchBills(1, 5, false);
                                                        } else if (tableTab === 2) {
                                                            fetchCancelBills(1, 5, false);
                                                        } else if (tableTab === 3) {
                                                            fetchComplimentaryBills(1, 5, false);
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
                                                        onChange={item => {
                                                            console.log('DateRangePicker onChange:', item.selection);
                                                            setState([item.selection]);
                                                        }}
                                                        direction="horizontal"
                                                        months={2}
                                                        showSelectionPreview={true}
                                                        moveRangeOnFirstSelection={false}
                                                    />
                                                    <div className='mt-8 grid gap-4 grid-cols-12'>
                                                        <div className='col-span-3 col-start-7'>
                                                            <button className='stockInBtn' onClick={() => {
                                                                setFilter(true);
                                                                getStatisticsByFilter();
                                                                // Force include date immediately to avoid async state delay
                                                                if (tableTab === 1) {
                                                                    fetchBills(page + 1, rowsPerPage, true);
                                                                } else if (tableTab === 2) {
                                                                    fetchCancelBills(cancelPage + 1, cancelRowsPerPage, true);
                                                                } else if (tableTab === 3) {
                                                                    fetchComplimentaryBills(complimentaryPage + 1, complimentaryRowsPerPage, true);
                                                                }
                                                                handleClose();
                                                            }}>Apply</button>
                                                        </div>
                                                        <div className='col-span-3'>
                                                            <button className='stockOutBtn' onClick={handleClose}>Cancel</button>
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
                                <CountCard color={'black'} count={statisticsCount && statisticsCount.totalBusiness ? statisticsCount.totalBusiness : 0} desc={'Total Business'} />
                            </div>
                            <div className='col-span-3'>
                                <CountCard color={'orange'} count={statisticsCount && statisticsCount.totalCancel ? statisticsCount.totalCancel : 0} desc={'Total Cancel'} />
                            </div>
                        </div>
                        <div className='grid grid-cols-6 gap-6'>
                            <div className='col-span-3'>
                                <CountCard color={'blue'} count={statisticsCount && statisticsCount.totalCashBusiness ? statisticsCount.totalCashBusiness : 0} desc={'Cash Business'} />
                            </div>
                            <div className='col-span-3'>
                                <CountCard color={'green'} count={statisticsCount && statisticsCount.totalOnlineBusiness ? statisticsCount.totalOnlineBusiness : 0} desc={'Online Business'} />
                            </div>
                        </div>
                        <div className='grid grid-cols-6 gap-6'>
                            <div className='col-span-3'>
                                <CountCard color={'pink'} count={statisticsCount && statisticsCount.totalDebitBusiness ? statisticsCount.totalDebitBusiness : 0} desc={'Debit Business'} />
                            </div>
                            <div className='col-span-3'>
                                <CountCard color={'yellow'} count={statisticsCount && statisticsCount.totalDueBusiness ? statisticsCount.totalDueBusiness : 0} desc={'Due Business'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section with Tabs */}
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-12'>
                                <div className='grid grid-cols-12 pl-2 gap-1 h-full'>
                                    <div className={`flex col-span-3 justify-center ${tableTab === 1 || tableTab === '1' || !tableTab ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        handleCloseFilter(); // ensure filter popper closes when switching tabs
                                        setTableTab(1); setPage(0); setRowsPerPage(5); fetchBills(1, 5);
                                    }}>
                                        <div className='statusTabtext'>Bills</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tableTab === 2 || tableTab === '2' ? 'tabCancelActive' : 'productTab'}`} onClick={() => {
                                        handleCloseFilter(); // ensure filter popper closes when switching tabs
                                        handleCloseCancelFilter(); // ensure cancel filter popper closes
                                        setTableTab(2);
                                        setCancelPage(0);
                                        setCancelRowsPerPage(5);
                                        fetchCancelBills(1, 5);
                                    }}>
                                        <div className='statusTabtext'>Cancel</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tableTab === 3 || tableTab === '3' ? 'tabComplimentaryActive' : 'productTab'}`} onClick={() => {
                                        handleCloseFilter(); // ensure filter popper closes when switching tabs
                                        handleCloseCancelFilter(); // ensure cancel filter popper closes
                                        handleCloseComplimentaryFilter(); // ensure complimentary filter popper closes
                                        setTableTab(3);
                                        setComplimentaryPage(0);
                                        setComplimentaryRowsPerPage(5);
                                        fetchComplimentaryBills(1, 5);
                                    }}>
                                        <div className='statusTabtext'>Complimentary</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tableTab === 4 || tableTab === '4' ? 'tabMonthActive' : 'productTab'}`} onClick={() => {
                                        handleCloseFilter(); // ensure filter popper closes when switching tabs
                                        handleCloseCancelFilter(); // ensure cancel filter popper closes
                                        handleCloseComplimentaryFilter(); // ensure complimentary filter popper closes
                                        setTableTab(4);
                                        setMonthViewPage(0);
                                        setMonthViewRowsPerPage(5);
                                        fetchMonthViewData(1, 5);
                                    }}>
                                        <div className='statusTabtext'>Month View</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className='userTableSubContainer mt-6'>
                <div className='grid grid-cols-12 pt-6'>
                    {tableTab === 1 ?
                        <>
                            <div className='col-span-3 flex justify-end pr-4'>
                                <div className='dateRange text-center self-center' aria-describedby={ids} onClick={handleClickFilter}>
                                    &nbsp;&nbsp;<TuneIcon />&nbsp; Filters
                                </div>
                                <Popper id={filterId} open={openFilter} style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }} placement={'bottom-end'} anchorEl={anchorElFilter}>
                                    <Box sx={{ bgcolor: 'background.paper', width: '420px', height: '150px', borderRadius: '10px' }}>
                                        <div className='filterWrp grid gap-6'>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className='col-span-6'>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel id="billPayType-label">Payment Type</InputLabel>
                                                        <Select
                                                            labelId="billPayType-label"
                                                            id="billPayType"
                                                            name='billPayType'
                                                            value={filterFormData.billPayType}
                                                            label="Payment Type"
                                                            onChange={handleChangeFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            <MenuItem value={''}>All</MenuItem>
                                                            <MenuItem value={'cash'}>Cash</MenuItem>
                                                            <MenuItem value={'due'}>Due</MenuItem>
                                                            <MenuItem value={'debit'}>Debit</MenuItem>
                                                            <MenuItem value={'online'}>Online</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className='col-span-6'>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel id="billType-label">Bill Type</InputLabel>
                                                        <Select
                                                            labelId="billType-label"
                                                            id="billType"
                                                            name='billType'
                                                            value={filterFormData.billType}
                                                            label="Bill Type"
                                                            onChange={handleChangeFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            <MenuItem value={''}>All</MenuItem>
                                                            <MenuItem value={'Pick Up'}>Pick Up</MenuItem>
                                                            <MenuItem value={'Delivery'}>Delivery</MenuItem>
                                                            <MenuItem value={'Dine In'}>Dine In</MenuItem>
                                                            <MenuItem value={'Hotel'}>Hotel</MenuItem>
                                                        </Select>
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
                                                    <button className='btn-apply' onClick={() => {
                                                        handleCloseFilter();
                                                        setBillPayType(filterFormData.billPayType);
                                                        setBillType(filterFormData.billType);
                                                        setPage(0);
                                                        setRowsPerPage(5);
                                                        fetchBills(1, 5);
                                                    }}>
                                                        Apply
                                                    </button>
                                                </div>
                                                <div className='col-span-4'>
                                                    <button className='btn-cancle' onClick={() => { handleCloseFilter(); resetFilter() }}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </Popper>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button
                                        className={`${!billPayType && !billType ? 'reSetBtn' : 'reSetBtnActive'}`}
                                        onClick={() => {
                                            // Reset dropdown filters
                                            resetFilter();
                                            setPage(0);
                                            setRowsPerPage(5);
                                            // Preserve date flag and force-clear dropdowns by override
                                            fetchBills(1, 5, filter, '', '');
                                        }}><CloseIcon /></button>
                                </div>
                            </div>
                        </> : <></>
                    }
                    {tableTab === 2 ?
                        <>
                            <div className='col-span-3 flex justify-end pr-4'>
                                <div className='dateRange text-center self-center' aria-describedby={cancelFilterId} onClick={handleClickCancelFilter}>
                                    &nbsp;&nbsp;<TuneIcon />&nbsp; Filters
                                </div>
                                <Popper id={cancelFilterId} open={openCancelFilter} style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }} placement={'bottom-end'} anchorEl={anchorElCancelFilter}>
                                    <Box sx={{ bgcolor: 'background.paper', width: '320px', height: '150px', borderRadius: '10px' }}>
                                        <div className='filterWrp grid gap-6'>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className='col-span-12'>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel id="cancelBillType-label">Bill Type</InputLabel>
                                                        <Select
                                                            labelId="cancelBillType-label"
                                                            id="cancelBillType"
                                                            name='billType'
                                                            value={cancelFilterFormData.billType}
                                                            label="Bill Type"
                                                            onChange={handleChangeCancelFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            <MenuItem value={''}>All</MenuItem>
                                                            <MenuItem value={'Pick Up'}>Pick Up</MenuItem>
                                                            <MenuItem value={'Delivery'}>Delivery</MenuItem>
                                                            <MenuItem value={'Dine In'}>Dine In</MenuItem>
                                                            <MenuItem value={'Hotel'}>Hotel</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className='col-span-4'>
                                                    <button className='btn-reset' onClick={() => resetCancelFilter()}>
                                                        Reset All
                                                    </button>
                                                </div>
                                                <div className='col-span-4'>
                                                    <button className='btn-apply' onClick={() => {
                                                        handleCloseCancelFilter();
                                                        setCancelBillType(cancelFilterFormData.billType);
                                                        setCancelPage(0);
                                                        setCancelRowsPerPage(5);
                                                        fetchCancelBills(1, 5);
                                                    }}>
                                                        Apply
                                                    </button>
                                                </div>
                                                <div className='col-span-4'>
                                                    <button className='btn-cancle' onClick={() => { handleCloseCancelFilter(); resetCancelFilter() }}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </Popper>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button
                                        className={`${!cancelBillType ? 'reSetBtn' : 'reSetBtnActive'}`}
                                        onClick={() => {
                                            // Reset dropdown filters
                                            resetCancelFilter();
                                            setCancelPage(0);
                                            setCancelRowsPerPage(5);
                                            // Preserve date flag and force-clear dropdowns by override
                                            fetchCancelBills(1, 5, filter, '');
                                        }}><CloseIcon /></button>
                                </div>
                            </div>
                        </> : <></>
                    }
                    {tableTab === 3 ?
                        <>
                            <div className='col-span-3 flex justify-end pr-4'>
                                <div className='dateRange text-center self-center' aria-describedby={complimentaryFilterId} onClick={handleClickComplimentaryFilter}>
                                    &nbsp;&nbsp;<TuneIcon />&nbsp; Filters
                                </div>
                                <Popper id={complimentaryFilterId} open={openComplimentaryFilter} style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }} placement={'bottom-end'} anchorEl={anchorElComplimentaryFilter}>
                                    <Box sx={{ bgcolor: 'background.paper', width: '420px', height: '150px', borderRadius: '10px' }}>
                                        <div className='filterWrp grid gap-6'>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className='col-span-6'>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel id="complimentaryBillPayType-label">Payment Type</InputLabel>
                                                        <Select
                                                            labelId="complimentaryBillPayType-label"
                                                            id="complimentaryBillPayType"
                                                            name='billPayType'
                                                            value={complimentaryFilterFormData.billPayType}
                                                            label="Payment Type"
                                                            onChange={handleChangeComplimentaryFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            <MenuItem value={''}>All</MenuItem>
                                                            <MenuItem value={'cash'}>Cash</MenuItem>
                                                            <MenuItem value={'due'}>Due</MenuItem>
                                                            <MenuItem value={'debit'}>Debit</MenuItem>
                                                            <MenuItem value={'online'}>Online</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className='col-span-6'>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel id="complimentaryBillType-label">Bill Type</InputLabel>
                                                        <Select
                                                            labelId="complimentaryBillType-label"
                                                            id="complimentaryBillType"
                                                            name='billType'
                                                            value={complimentaryFilterFormData.billType}
                                                            label="Bill Type"
                                                            onChange={handleChangeComplimentaryFilter}
                                                            MenuProps={{
                                                                style: { zIndex: 35001 }
                                                            }}
                                                        >
                                                            <MenuItem value={''}>All</MenuItem>
                                                            <MenuItem value={'Pick Up'}>Pick Up</MenuItem>
                                                            <MenuItem value={'Delivery'}>Delivery</MenuItem>
                                                            <MenuItem value={'Dine In'}>Dine In</MenuItem>
                                                            <MenuItem value={'Hotel'}>Hotel</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-12 gap-6'>
                                                <div className='col-span-4'>
                                                    <button className='btn-reset' onClick={() => resetComplimentaryFilter()}>
                                                        Reset All
                                                    </button>
                                                </div>
                                                <div className='col-span-4'>
                                                    <button className='btn-apply' onClick={() => {
                                                        handleCloseComplimentaryFilter();
                                                        setComplimentaryBillPayType(complimentaryFilterFormData.billPayType);
                                                        setComplimentaryBillType(complimentaryFilterFormData.billType);
                                                        setComplimentaryPage(0);
                                                        setComplimentaryRowsPerPage(5);
                                                        fetchComplimentaryBills(1, 5);
                                                    }}>
                                                        Apply
                                                    </button>
                                                </div>
                                                <div className='col-span-4'>
                                                    <button className='btn-cancle' onClick={() => { handleCloseComplimentaryFilter(); resetComplimentaryFilter() }}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </Popper>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button
                                        className={`${!complimentaryBillPayType && !complimentaryBillType ? 'reSetBtn' : 'reSetBtnActive'}`}
                                        onClick={() => {
                                            // Reset dropdown filters
                                            resetComplimentaryFilter();
                                            setComplimentaryPage(0);
                                            setComplimentaryRowsPerPage(5);
                                            // Preserve date flag and force-clear dropdowns by override
                                            fetchComplimentaryBills(1, 5, filter, '', '');
                                        }}><CloseIcon /></button>
                                </div>
                            </div>
                        </> : <></>
                    }
                </div>
                <div className='tableContainerWrapper'>
                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                {tableTab === 4 ? (
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Month / Year</TableCell>
                                        <TableCell align="center">Total Bill Amount</TableCell>
                                        <TableCell align="center">Total Settled Amount</TableCell>
                                        <TableCell align="center">Export PDF</TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Bill Number</TableCell>
                                        <TableCell>Cashier</TableCell>
                                        <TableCell>Bill Type</TableCell>
                                        <TableCell>Payment Type</TableCell>
                                        <TableCell align="center">Total Amount</TableCell>
                                        <TableCell align="center">Settled Amount</TableCell>
                                        <TableCell align="left">Bill Date</TableCell>
                                        <TableCell align="left">Time</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                )}
                            </TableHead>
                            <TableBody>
                                {tableTab === 1 && billData?.map((row, index) => (
                                    totalRows !== 0 ?
                                        <TableRow
                                            hover
                                            key={row.billId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            className='tableRow'
                                        >
                                            <TableCell align="left">{(index + 1) + (page * rowsPerPage)}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.billNumber}
                                            </TableCell>
                                            <TableCell align="left">{row.cashier}</TableCell>
                                            <TableCell align="left">{row.billType}</TableCell>
                                            <TableCell align="left" style={{ textTransform: 'capitalize' }}>{row.billPayType}</TableCell>
                                            <TableCell align="center" className="greenText">₹{parseFloat(row.totalAmount).toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="center" className="greenText">₹{parseFloat(row.settledAmount).toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="left">{row.billDate}</TableCell>
                                            <TableCell align="left">{row.billCreationDate}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewBill(row.billId);
                                                    }}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: '#1976d2',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: '#1565c0',
                                                        },
                                                    }}
                                                >
                                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow> :
                                        <TableRow
                                            key="no-data-bills"
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" style={{ fontSize: "18px", fontWeight: "500", padding: "40px" }} colSpan={10}>
                                                No Data Found...!
                                            </TableCell>
                                        </TableRow>
                                ))}
                                {tableTab === 2 && cancelBillData?.map((row, index) => (
                                    cancelTotalRows !== 0 ?
                                        <TableRow
                                            hover
                                            key={row.billId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            className='tableRow'
                                        >
                                            <TableCell align="left">{(index + 1) + (cancelPage * cancelRowsPerPage)}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.billNumber}
                                            </TableCell>
                                            <TableCell align="left">{row.cashier}</TableCell>
                                            <TableCell align="left">{row.billType}</TableCell>
                                            <TableCell align="left" style={{ textTransform: 'capitalize' }}>{row.billPayType}</TableCell>
                                            <TableCell align="center" className="greenText">₹{parseFloat(row.totalAmount).toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="center" className="greenText">₹{parseFloat(row.settledAmount).toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="left">{row.billDate}</TableCell>
                                            <TableCell align="left">{row.billCreationDate}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewBill(row.billId);
                                                    }}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: '#1976d2',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: '#1565c0',
                                                        },
                                                    }}
                                                >
                                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow> :
                                        <TableRow
                                            key="no-data-cancel"
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" style={{ fontSize: "18px", fontWeight: "500", padding: "40px" }} colSpan={10}>
                                                No Data Found...!
                                            </TableCell>
                                        </TableRow>
                                ))}
                                {tableTab === 3 && complimentaryBillData?.map((row, index) => (
                                    complimentaryTotalRows !== 0 ?
                                        <TableRow
                                            hover
                                            key={row.billId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            className='tableRow'
                                        >
                                            <TableCell align="left">{(index + 1) + (complimentaryPage * complimentaryRowsPerPage)}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.billNumber}
                                            </TableCell>
                                            <TableCell align="left">{row.cashier}</TableCell>
                                            <TableCell align="left">{row.billType}</TableCell>
                                            <TableCell align="left" style={{ textTransform: 'capitalize' }}>{row.billPayType}</TableCell>
                                            <TableCell align="center" className="greenText">₹{parseFloat(row.totalAmount).toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="center" className="greenText">₹{parseFloat(row.settledAmount).toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="left">{row.billDate}</TableCell>
                                            <TableCell align="left">{row.billCreationDate}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewBill(row.billId);
                                                    }}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: '#1976d2',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: '#1565c0',
                                                        },
                                                    }}
                                                >
                                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow> :
                                        <TableRow
                                            key="no-data-complimentary"
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" style={{ fontSize: "18px", fontWeight: "500", padding: "40px" }} colSpan={10}>
                                                No Data Found...!
                                            </TableCell>
                                        </TableRow>
                                ))}
                                {tableTab === 4 && monthViewData?.map((row, index) => (
                                    monthViewTotalRows !== 0 ?
                                        <TableRow
                                            hover
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            className='tableRow'
                                        >
                                            <TableCell align="left">{(index + 1) + (monthViewPage * monthViewRowsPerPage)}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.monthYear}
                                            </TableCell>
                                            <TableCell align="center" className="greenText">₹{parseFloat(row.totalBillAmount).toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="center" className="greenText">₹{parseFloat(row.totalSettledAmount).toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="center">
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleExportPDF(row.firstDate, row.lastDate, row.monthYear, 'cash');
                                                        }}
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            backgroundColor: '#16a34a',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#15803d',
                                                            },
                                                        }}
                                                        title="Export Cash PDF"
                                                    >
                                                        <PictureAsPdfIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleExportPDF(row.firstDate, row.lastDate, row.monthYear, 'debit');
                                                        }}
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            backgroundColor: '#2563eb',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#1d4ed8',
                                                            },
                                                        }}
                                                        title="Export Debit PDF"
                                                    >
                                                        <PictureAsPdfIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleExportPDF(row.firstDate, row.lastDate, row.monthYear);
                                                        }}
                                                        sx={{
                                                            width: 28,
                                                            height: 28,
                                                            backgroundColor: '#7c3aed',
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: '#6d28d9',
                                                            },
                                                        }}
                                                        title="Export All Payments PDF"
                                                    >
                                                        <PictureAsPdfIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow> :
                                        <TableRow
                                            key="no-data-month-view"
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center" style={{ fontSize: "18px", fontWeight: "500", padding: "40px" }} colSpan={5}>
                                                No Data Found...!
                                            </TableCell>
                                        </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {tableTab === 1 && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={totalRows}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        )}
                        {tableTab === 2 && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={cancelTotalRows}
                                rowsPerPage={cancelRowsPerPage}
                                page={cancelPage}
                                onPageChange={handleChangeCancelPage}
                                onRowsPerPageChange={handleChangeCancelRowsPerPage}
                            />
                        )}
                        {tableTab === 3 && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={complimentaryTotalRows}
                                rowsPerPage={complimentaryRowsPerPage}
                                page={complimentaryPage}
                                onPageChange={handleChangeComplimentaryPage}
                                onRowsPerPageChange={handleChangeComplimentaryRowsPerPage}
                            />
                        )}
                        {tableTab === 4 && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={monthViewTotalRows}
                                rowsPerPage={monthViewRowsPerPage}
                                page={monthViewPage}
                                onPageChange={handleChangeMonthViewPage}
                                onRowsPerPageChange={handleChangeMonthViewRowsPerPage}
                            />
                        )}
                    </TableContainer>
                </div>
            </div>

            {/* Bill Details Modal */}
            <Modal
                open={infoPopUpOpen}
                onClose={() => setInfoPopUpOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableAutoFocus
            >
                <Box sx={style} className='rounded-md border-none'>
                    {/* Fixed Header - Compact Firm Details with Close Icon */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-5 rounded-t-lg flex-shrink-0 relative">
                        <IconButton
                            onClick={() => setInfoPopUpOpen(false)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                width: 28,
                                height: 28
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <div className="text-center text-base font-bold">
                            {infoPopUpData?.firmData?.firmName || 'Bill Details'}
                        </div>
                        <div className="text-center text-xs mt-1 opacity-90">
                            {infoPopUpData?.firmData?.firmAddress}
                        </div>
                        <div className="text-center text-xs mt-0.5 opacity-85">
                            {infoPopUpData?.firmData?.firmMobileNo}
                            {infoPopUpData?.firmData?.gstNumber && ` | GST: ${infoPopUpData?.firmData?.gstNumber}`}
                        </div>
                    </div>

                    {/* Fixed Bill Info Bar - All Inline */}
                    <div className="px-4 py-2 bg-gray-100 flex-shrink-0 border-b border-gray-300">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-gray-900">#{infoPopUpData?.billNumber}</span>
                                <span className="text-gray-400">•</span>
                                <span className="font-bold text-gray-900">Tkn : {infoPopUpData?.tokenNo}</span>
                                <span className="text-gray-400">•</span>
                                <span className="font-semibold text-gray-700">{infoPopUpData?.billType}</span>
                                <span className="text-gray-400">•</span>
                                <PersonIcon sx={{ fontSize: 14 }} />
                                <span className="font-medium text-gray-700">{infoPopUpData?.cashier}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600">{infoPopUpData?.billDate} {infoPopUpData?.billTime}</span>
                            </div>
                            <div>
                                <span className={`px-2 py-0.5 rounded text-xs text-white font-semibold uppercase ${infoPopUpData?.billPayType === 'Cancel' ? 'bg-red-600' :
                                    infoPopUpData?.billPayType === 'cash' ? 'bg-green-600' :
                                        infoPopUpData?.billPayType === 'online' ? 'bg-blue-600' :
                                            infoPopUpData?.billPayType === 'due' ? 'bg-orange-600' :
                                                infoPopUpData?.billPayType === 'debit' ? 'bg-purple-600' :
                                                    'bg-gray-600'
                                    }`}>
                                    {infoPopUpData?.billPayType}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Scrollable Wrapper - Contains Customer, Hotel, and Items */}
                    <div style={{ overflowY: 'auto', flexGrow: 1, minHeight: 0 }}>
                        {/* Customer Details */}
                        {infoPopUpData?.customerDetails && infoPopUpData?.customerDetails?.customerName && (
                            <div className="px-4 py-2 bg-blue-50 border-y border-gray-200">
                                <div className="space-y-0.5">
                                    {infoPopUpData?.customerDetails?.customerName && (
                                        <div className="text-xs">
                                            <span className="text-gray-600">Customer: </span>
                                            <span className="font-semibold text-gray-900">{infoPopUpData?.customerDetails?.customerName}</span>
                                        </div>
                                    )}
                                    {infoPopUpData?.customerDetails?.mobileNo && (
                                        <div className="text-xs">
                                            <span className="text-gray-600">Mobile: </span>
                                            <span className="font-semibold text-gray-900">{infoPopUpData?.customerDetails?.mobileNo}</span>
                                        </div>
                                    )}
                                    {infoPopUpData?.customerDetails?.address && (
                                        <div className="text-xs">
                                            <span className="text-gray-600">Address: </span>
                                            <span className="font-medium text-gray-900">{infoPopUpData?.customerDetails?.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Hotel Details */}
                        {infoPopUpData?.hotelDetails && infoPopUpData?.hotelDetails?.hotelName && (
                            <div className="px-4 py-2 bg-blue-50 border-b border-gray-200">
                                <div className="space-y-0.5">
                                    {infoPopUpData?.hotelDetails?.hotelName && (
                                        <div className="text-xs">
                                            <span className="text-gray-600">Hotel: </span>
                                            <span className="font-semibold text-gray-900">
                                                {infoPopUpData?.hotelDetails?.hotelName}
                                                {infoPopUpData?.hotelDetails?.roomNo ? ' - Rm ' + infoPopUpData?.hotelDetails?.roomNo : ''}
                                            </span>
                                        </div>
                                    )}
                                    {infoPopUpData?.hotelDetails?.customerName && (
                                        <div className="text-xs">
                                            <span className="text-gray-600">Guest: </span>
                                            <span className="font-semibold text-gray-900">{infoPopUpData?.hotelDetails?.customerName}</span>
                                        </div>
                                    )}
                                    {infoPopUpData?.hotelDetails?.phoneNumber && (
                                        <div className="text-xs">
                                            <span className="text-gray-600">Phone: </span>
                                            <span className="font-semibold text-gray-900">{infoPopUpData?.hotelDetails?.phoneNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Item Details - Fixed Height with Internal Scroll */}
                        <div className="bg-white">
                            <div
                                className="overflow-y-auto border-y border-gray-200"
                                style={{ height: '240px' }}
                            >
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-100 sticky top-0 z-10">
                                        <tr>
                                            <th className="text-left py-2.5 pl-4 pr-2 font-semibold border-b-2 border-gray-300" style={{ width: '40px' }}>Sr.</th>
                                            <th className="text-left py-2.5 px-2 font-semibold border-b-2 border-gray-300">Item</th>
                                            <th className="text-center py-2.5 px-3 font-semibold border-b-2 border-gray-300">Qty</th>
                                            <th className="text-right py-2.5 px-3 font-semibold border-b-2 border-gray-300">Price</th>
                                            <th className="text-right py-2.5 pl-3 pr-4 font-semibold border-b-2 border-gray-300">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {infoPopUpData?.itemData?.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-blue-50">
                                                <td className="py-2 pl-4 pr-2 font-medium text-gray-600">{index + 1}</td>
                                                <td className="py-2 px-2 font-semibold text-gray-800">{item.itemName}</td>
                                                <td className="py-2 px-3 text-center font-medium text-gray-700">{item.qty} {item.unit}</td>
                                                <td className="py-2 px-3 text-right text-gray-700">₹{parseFloat(item.itemPrice).toLocaleString('en-IN')}</td>
                                                <td className="py-2 pl-3 pr-4 text-right font-bold text-green-700">₹{parseFloat(item.price).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Bottom - Compact Bill Summary */}
                    <div className="flex-shrink-0 border-t-2 border-gray-300 bg-gray-50">
                        <div className="px-4 py-3">
                            {/* Discount */}
                            {infoPopUpData?.discountType && infoPopUpData?.discountType !== 'none' && (
                                <div className="flex justify-between items-center mb-1.5 pb-1.5 border-b border-gray-300 text-xs">
                                    <span className="font-medium text-gray-700">
                                        Discount ({infoPopUpData?.discountType === 'percentage' ? infoPopUpData?.discountValue + '%' : '₹' + infoPopUpData?.discountValue})
                                    </span>
                                    <span className="font-bold text-red-600">
                                        - ₹{parseFloat(infoPopUpData?.totalDiscount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}

                            {/* Total Amount */}
                            <div className="flex justify-between items-center mb-2 pb-1.5 border-b-2 border-gray-400 text-sm">
                                <span className="font-bold text-gray-800">Total Amount</span>
                                <span className="font-bold text-green-700">
                                    ₹{parseFloat(infoPopUpData?.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>

                            {/* Settled Amount - Highlighted */}
                            <div className="flex justify-between items-center py-2 px-3 bg-blue-100 rounded border-2 border-blue-400 mb-2">
                                <span className="text-base font-bold text-blue-900">Grand Total</span>
                                <span className="text-lg font-bold text-blue-900">
                                    ₹{parseFloat(infoPopUpData?.settledAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>

                            {/* Bill Comment */}
                            {infoPopUpData?.billComment && (
                                <div className="p-2 bg-yellow-100 border-l-4 border-yellow-500 rounded text-xs">
                                    <span className="font-semibold text-yellow-800">Comment: </span>
                                    <span className="font-medium text-gray-800">{infoPopUpData?.billComment}</span>
                                </div>
                            )}
                        </div>

                        {/* Print Button */}
                        <div className="px-4 py-3 bg-white border-t border-gray-200 flex justify-center rounded-b-lg">
                            <button
                                className="px-8 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 shadow-md"
                                onClick={handlePrintBill}
                            >
                                <PrintIcon sx={{ fontSize: 18 }} />
                                Print Bill
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>

            <ToastContainer />
        </div >
    )
}

export default FirmDetail;
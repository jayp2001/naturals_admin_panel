import './customerDetails.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SimpleCountCard from '../../pages/inventory/countCard/simpleCountCard';
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
import { Select, MenuItem, FormControl, InputLabel, Modal, IconButton } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import Popper from '@mui/material/Popper';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';

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

function CustomerDetails() {
    let { id } = useParams();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [statisticsCount, setStatisticsCounts] = useState();
    const [detailTab, setDetailTab] = React.useState(1); // Tab for customer details section (1: Info, 2: Statistics)

    // Table state variables
    const [billData, setBillData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [billPayType, setBillPayType] = useState('');
    const [billType, setBillType] = useState('');

    // Bill Info Modal state
    const [infoPopUpOpen, setInfoPopUpOpen] = useState(false);
    const [infoPopUpData, setInfoPopUpData] = useState(null);

    // Filter modal state
    const [anchorElFilter, setAnchorElFilter] = React.useState(null);
    const [filterFormData, setFilterFormData] = React.useState({
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

    // Get Customer Details
    const getCustomerDetails = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getCustomerDetailsById?customerId=${id}`, config)
            .then((res) => {
                setCustomerDetails(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    // Get Customer Statistics
    const getStatistics = async (startDate = '', endDate = '') => {
        let url = `${BACKEND_BASE_URL}billingrouter/getStaticsByCustomer?customerId=${id}`;
        if (startDate && endDate) {
            url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }
        await axios.get(url, config)
            .then((res) => {
                setStatisticsCounts(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getStatisticsByFilter = async () => {
        const startDate = state[0].startDate ? state[0].startDate.toDateString() : '';
        const endDate = state[0].endDate ? state[0].endDate.toDateString() : '';
        await getStatistics(startDate, endDate);
    }

    // Fetch Bills for Customer
    const fetchBills = async (
        pageNum = 1,
        numPerPage = 15,
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

        let url = `${BACKEND_BASE_URL}billingrouter/getBillDataBycustomerId?customerId=${id}&page=${pageNum}&numPerPage=${numPerPage}`;
        if (startDate && endDate) {
            url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        }

        await axios.get(url, config)
            .then((res) => {
                let rows = res.data.rows || [];
                // Filter by payment type and bill type if provided (client-side filtering)
                if (payType) {
                    rows = rows.filter(row => row.billPayType && row.billPayType.toLowerCase() === payType.toLowerCase());
                }
                if (bType) {
                    rows = rows.filter(row => row.billType === bType);
                }
                setBillData(rows);
                // Use filtered count for totalRows if filters are applied
                setTotalRows((payType || bType) ? rows.length : (res.data.numRows || 0));
            })
            .catch((error) => {
                setBillData([]);
                setTotalRows(0);
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

    const open = Boolean(anchorEl);
    const openFilter = Boolean(anchorElFilter);
    const ids = open ? 'simple-popover' : undefined;
    const filterId = openFilter ? 'simple-popover' : undefined;

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


    useEffect(() => {
        getCustomerDetails();
        getStatistics();
        fetchBills(1, 15);
    }, [])

    if (!customerDetails) {
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
    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Function to format label from key
    const formatLabel = (key) => {
        // Return the key as-is since API now provides properly formatted keys
        return key;
    };

    // Color mapping for different stat types
    const getColorForKey = (key) => {
        const colorMap = {
            'Pickup Summary': 'purple',
            'Delivery Summary': 'teal',
            'DineIn Summary': 'indigo',
            'Cash Summary': 'blue',
            'Due Summary': 'pink',
            'Online Summary': 'green',
            'Complimentary Summary': 'purple',
            'Cancel Summary': 'orange',
            'Total Discount': 'cyan',
            'Visit': 'yellow',
            'Total Business': 'black',
            'Average Visit Per Month': 'yellow',
            'Average Business Per Year': 'red'
        };
        return colorMap[key] || 'blue';
    };

    // Get statistics keys to display (exclude date/time fields)
    const getStatisticsKeys = () => {
        if (!statisticsCount) return [];
        const excludeKeys = ['Last Visited', 'Last Visited Time'];
        return Object.keys(statisticsCount).filter(key => !excludeKeys.includes(key));
    };

    return (
        <div className='suppilerListContainer'>
            {/* Customer Details & Statistics Section with Tabs */}
            <div className='grid grid-cols-12 gap-6 mt-6'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-12'>
                                <div className='grid grid-cols-12 pl-2 gap-1 h-full'>
                                    <div
                                        className={`flex col-span-2 justify-center ${detailTab === 1 ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => setDetailTab(1)}
                                    >
                                        <div className='statusTabtext'>Customer Info</div>
                                    </div>
                                    <div
                                        className={`flex col-span-2 justify-center ${detailTab === 2 ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => setDetailTab(2)}
                                    >
                                        <div className='statusTabtext'>Statistics</div>
                                    </div>
                                    <div
                                        className={`flex col-span-2 justify-center ${detailTab === 3 ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => setDetailTab(3)}
                                    >
                                        <div className='statusTabtext'>Bills</div>
                                    </div>
                                    <div className='col-span-6 flex justify-end pr-4'>
                                        <div className={`dateRange text-center self-center ${filter ? 'filterActive' : ''}`} aria-describedby={ids} onClick={handleClick}>
                                            <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                        </div>
                                        <div className='col-span-3 self-center'>
                                            <button
                                                className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                                onClick={() => {
                                                    setFilter(false);
                                                    setPage(0);
                                                    setRowsPerPage(15);
                                                    getStatistics();
                                                    setState([
                                                        {
                                                            startDate: new Date(),
                                                            endDate: new Date(),
                                                            key: 'selection'
                                                        }
                                                    ]);
                                                    fetchBills(1, 15, false);
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
                                                            fetchBills(page + 1, rowsPerPage, true);
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
            </div>

            {/* Tab Content */}
            <div className='mt-3'>
                {detailTab === 1 && (
                    <div className='customerInfoContainer'>
                        <div className='grid grid-cols-12 gap-4'>
                            {/* Left Column - Basic Info Cards */}
                            <div className='col-span-12 lg:col-span-6'>
                                <div className='grid grid-cols-2 gap-3'>
                                    {/* Customer Name Card */}
                                    <div className='infoCard'>
                                        <div className='infoCardLabel'>Customer Name</div>
                                        <div className='infoCardValue'>{customerDetails.customerName || '-'}</div>
                                    </div>
                                    {/* Mobile Number Card */}
                                    <div className='infoCard'>
                                        <div className='infoCardLabel'>Mobile Number</div>
                                        <div className='infoCardValue'>{customerDetails.mobileNumber || '-'}</div>
                                    </div>
                                    {/* Birth Date Card */}
                                    <div className='infoCard'>
                                        <div className='infoCardLabel'>Birth Date</div>
                                        <div className='infoCardValue'>{formatDate(customerDetails.birthDate) || '-'}</div>
                                    </div>
                                    {/* Anniversary Date Card */}
                                    <div className='infoCard'>
                                        <div className='infoCardLabel'>Anniversary Date</div>
                                        <div className='infoCardValue'>{formatDate(customerDetails.anniversaryDate) || '-'}</div>
                                    </div>
                                </div>
                            </div>
                            {/* Right Column - Addresses */}
                            <div className='col-span-12 lg:col-span-6'>
                                <div className='addressSectionContainer'>
                                    <div className='addressSectionHeader'>
                                        <span className='addressSectionTitle'>Addresses</span>
                                        <span className='addressCountBadge'>{customerDetails.addressDetails?.length || 0}</span>
                                    </div>
                                    <div className='addressScrollContainer'>
                                        {customerDetails.addressDetails && customerDetails.addressDetails.length > 0 ? (
                                            customerDetails.addressDetails.map((addr, index) => (
                                                <div key={index} className='addressCard'>
                                                    <div className='addressCardNumber'>{index + 1}</div>
                                                    <div className='addressCardContent'>
                                                        <div className='addressField'>
                                                            <span className='addressFieldLabel'>Address:</span>
                                                            <span className='addressFieldValue'>{addr.address || '-'}</span>
                                                        </div>
                                                        <div className='addressField'>
                                                            <span className='addressFieldLabel'>Locality:</span>
                                                            <span className='addressFieldValue'>{addr.locality || '-'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className='noAddressMessage'>No addresses found</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {detailTab === 2 && (
                    <div className='statisticsContainer'>
                        <div className='grid gap-2'>
                            {/* Dynamically render CountCards for all statistics keys */}
                            {getStatisticsKeys().length > 0 ? (
                                (() => {
                                    const keys = getStatisticsKeys();
                                    const rows = [];
                                    for (let i = 0; i < keys.length; i += 4) {
                                        rows.push(
                                            <div key={i} className='grid grid-cols-4 gap-2'>
                                                {keys.slice(i, i + 4).map((key) => (
                                                    <SimpleCountCard
                                                        key={key}
                                                        color={getColorForKey(key)}
                                                        count={statisticsCount[key]}
                                                        desc={formatLabel(key)}
                                                    />
                                                ))}
                                            </div>
                                        );
                                    }
                                    return rows;
                                })()
                            ) : (
                                <div className='text-center py-8 text-gray-500'>No statistics available</div>
                            )}
                            {/* Additional Stats Row - Date/Time */}
                            {(statisticsCount?.['Last Visited'] || statisticsCount?.['Last Visited Time']) && (
                                <div className='grid grid-cols-2 gap-2 mt-1'>
                                    <div className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
                                        <div className='text-xs text-gray-600 mb-1'>Last Visited</div>
                                        <div className='text-sm font-semibold text-gray-800'>{statisticsCount['Last Visited'] || '-'}</div>
                                    </div>
                                    <div className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
                                        <div className='text-xs text-gray-600 mb-1'>Last Visited Time</div>
                                        <div className='text-sm font-semibold text-gray-800'>{statisticsCount['Last Visited Time'] || '-'}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {detailTab === 3 && (
                    <div className='billsContainer'>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                    <TableHead>
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
                                    </TableHead>
                                    <TableBody>
                                        {billData && billData.length > 0 && totalRows > 0 ? (
                                            billData.map((row, index) => (
                                                <TableRow
                                                    hover
                                                    key={row.billId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left">{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.billNumber || row.tokenNo}
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
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow
                                                key="no-data-bills"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" style={{ fontSize: "18px", fontWeight: "500", padding: "40px" }} colSpan={10}>
                                                    No Data Found...!
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[15, 50, 100]}
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
                )}
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

export default CustomerDetails;
import React, { useState, useEffect } from 'react';
import { BACKEND_BASE_URL } from '../../../src/url';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useParams } from 'react-router-dom';
import CountCard from '../expense/countCard/countCard';

function UpiDetailPage() {
    const { onlineId, holderName } = useParams()
    const [tab, setTab] = useState(1);
    const [upiTransactionData, setUpiTransactionData] = useState();
    const [totalRowsUpi, setTotalRowsUpi] = useState();
    const [upiHolderName, setUpiHolderName] = useState('');
    const [statisticsCount, setStatisticsCount] = useState();
    const [cardColor] = useState([
        { color: 'black', desc: '1' },
        { color: 'blue', desc: '2' },
        { color: 'pink', desc: '3' }
    ]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [filter, setFilter] = useState(false);
    const id = open ? 'simple-popover' : undefined;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getUpiTransactionData = async (pageNum = 1, numPerPage = 5) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getUPITransactionById?page=${pageNum}&numPerPage=${numPerPage}&upiId=${onlineId}`, config)
            .then((res) => {
                setUpiTransactionData(res.data.rows);
                setTotalRowsUpi(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getUpiTransactionDataByFilter = async (pageNum = 1, numPerPage = 5) => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getUPITransactionById?page=${pageNum}&numPerPage=${numPerPage}&upiId=${onlineId}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setUpiTransactionData(res.data.rows);
                setTotalRowsUpi(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    // Helper function to get current and previous month labels
    const getMonthLabels = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const previousMonth = previousDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        return { currentMonth, previousMonth };
    }

    const getStatistics = async (startDate = '', endDate = '') => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getUPIStaticsById?onlineId=${onlineId}&startDate=${startDate}&endDate=${endDate}`, config)
            .then((res) => {
                const { currentMonth, previousMonth } = getMonthLabels();

                // Transform to match CountCard expected format
                const statsArray = [
                    { expenseAmt: res.data.customRangeOnline || 0, label: "Custom Range" },
                    { expenseAmt: res.data.currentMonthOnline || 0, label: `${currentMonth}` },
                    { expenseAmt: res.data.previousMonthOnline || 0, label: `${previousMonth}` }
                ];

                setStatisticsCount(statsArray);
            })
            .catch((error) => {
                console.log('Error fetching statistics:', error);
                const { currentMonth, previousMonth } = getMonthLabels();

                // Fallback to empty stats if API fails
                const fallbackStats = [
                    { expenseAmt: 0, label: "Custom Range" },
                    { expenseAmt: 0, label: `${currentMonth}` },
                    { expenseAmt: 0, label: `${previousMonth}` }
                ];
                setStatisticsCount(fallbackStats);
            })
    }

    const getStatisticsByFilter = async () => {
        const startDate = state[0].startDate ? state[0].startDate : '';
        const endDate = state[0].endDate ? state[0].endDate : '';
        await getStatistics(startDate, endDate);
    }


    useEffect(() => {
        if (holderName) {
            setUpiHolderName(decodeURIComponent(holderName));
        }
        getStatistics(); // Call without date parameters for initial load
        getUpiTransactionData();
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (filter) {
            getUpiTransactionDataByFilter(newPage + 1, rowsPerPage);
        }
        else {
            getUpiTransactionData(newPage + 1, rowsPerPage);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (filter) {
            getUpiTransactionDataByFilter(1, parseInt(event.target.value, 10));
        }
        else {
            getUpiTransactionData(1, parseInt(event.target.value, 10));
        }
    };

    if (loading) {
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        toast.dismiss('loading');
        toast('success', {
            type: 'success',
            toastId: 'success',
            position: "top-right",
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
        <div className='mainBody'>
            <div className='productListContainer'>
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='productTableSubContainer'>
                            <div className='h-full flex items-center justify-between px-6'>
                                <div className='flex items-center justify-start w-full'>
                                    <div className='statusTabtext text-left font-bold text-blue-700 no-underline'>UPI Transactions {upiHolderName ? `: ${upiHolderName}` : 'Details'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid gap-4 mt-6 pl-8 pr-8'>
                <div className='grid grid-cols-12 gap-6'>
                    {statisticsCount && statisticsCount.map((data, index) => (
                        <div key={index} className='col-span-4'>
                            <CountCard
                                color={cardColor[index].color}
                                count={data && data.expenseAmt ? data.expenseAmt : 0}
                                desc={cardColor[index].desc}
                                label={data && data.label ? data.label : ''}
                                productDetail={true}
                                unitDesc={0}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-12 productListContainer">
                <div className="col-span-12">
                    <div className='grid grid-cols-12 mt-6'>
                        <div className='col-span-12'>
                            <div className='userTableSubContainer pt-4'>
                                <div className='grid grid-cols-12'>
                                    <div className='ml-4 col-span-6 mt-2' >
                                        <div className='flex'>
                                            <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                                <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                            </div>
                                            <div className='resetBtnWrap col-span-3'>
                                                <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                    setFilter(false);
                                                    setPage(0);
                                                    setRowsPerPage(5)
                                                    getUpiTransactionData(1, 5);
                                                    getStatistics(); // Reset statistics without date filter
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
                                                    onChange={item => setState([item.selection])}
                                                    direction="horizontal"
                                                    months={2}
                                                    showSelectionPreview={true}
                                                    moveRangeOnFirstSelection={false}
                                                />
                                                <div className='mt-8 grid gap-4 grid-cols-12'>
                                                    <div className='col-span-3 col-start-7'>
                                                        <button className='stockInBtn' onClick={() => {
                                                            setFilter(true);
                                                            setPage(0);
                                                            setRowsPerPage(5);
                                                            getUpiTransactionDataByFilter(1, 5);
                                                            getStatisticsByFilter();
                                                            handleClose();
                                                        }
                                                        }>Apply</button>
                                                    </div>
                                                    <div className='col-span-3'>
                                                        <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                    </div>
                                                </div>
                                            </Box>
                                        </Popover>
                                    </div>
                                </div>
                                <div className='tableContainerWrapper'>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>No.</TableCell>
                                                    <TableCell>Transaction ID</TableCell>
                                                    <TableCell>Online By</TableCell>
                                                    <TableCell>Amount</TableCell>
                                                    <TableCell>Bill Type</TableCell>
                                                    <TableCell align="left">Date</TableCell>
                                                    <TableCell align="left">Day</TableCell>
                                                    <TableCell align="left">Time</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {upiTransactionData?.map((row, index) => (
                                                    totalRowsUpi !== 0 ?
                                                        <TableRow
                                                            hover
                                                            key={row.transactionId}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            className='tableRow'
                                                        >
                                                            <TableCell align="left">{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                            <TableCell component="th" scope="row">
                                                                {row.transactionId}
                                                            </TableCell>
                                                            <TableCell align="left">{row.casheir}</TableCell>
                                                            <TableCell align="left">₹{parseFloat(row.amount).toLocaleString('en-IN')}</TableCell>
                                                            <TableCell align="left">{row.billType || 'N/A'}</TableCell>
                                                            <TableCell align="left">{row.onlineDate}</TableCell>
                                                            <TableCell align="left">{row.onlineDay}</TableCell>
                                                            <TableCell align="left">{row.onlineTime}</TableCell>
                                                        </TableRow> :
                                                        <TableRow
                                                            key="no-data"
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell align="left" style={{ fontSize: "18px" }} colSpan={6}>{"No Data Found...!"}</TableCell>
                                                        </TableRow>

                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={totalRowsUpi}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div >
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default UpiDetailPage;
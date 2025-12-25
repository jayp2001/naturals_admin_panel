import * as React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
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
import { ToastContainer, toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import { BACKEND_BASE_URL } from "../../url";
import CountCard from "../../pages/inventory/countCard/countCard";
import Menutemp from "../../pages/users/userTable/menu";
import { useParams } from "react-router-dom";
import { Modal } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
function DeliveryManDataTable() {
    const [tab, setTab] = React.useState(2);
    const [searchWord, setSearchWord] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [cashCount, setCashCount] = React.useState();
    const [debitCount, setDebitCount] = React.useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalRowsCash, setTotalRowsCash] = React.useState(0);
    const [totalRowsDebit, setTotalRowsDebit] = React.useState(0);
    const [debitTransaction, setDebitTransaction] = React.useState();
    const [cashTransaction, setCashTransaction] = React.useState();
    const [updateDeliveryPopUpData, setUpdateDeliveryPopUpData] = useState()
    const [debitData, setDebitData] = React.useState();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filter, setFilter] = React.useState(false);
    const [persontstasticData, setPersonstasticData] = useState()
    const [updateDeliveryPopUp, setUpdatDeliveryPopUp] = useState(false)
    const { deliveryManId, name } = useParams();


    React.useEffect(() => {
        console.log('deliveryManId:', deliveryManId);
    }, [deliveryManId]);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
    };
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const getDebitData = async () => {
        // await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDeliveryDataByPerson?&page=${1}&numPerPage=${rowsPerPage}`, config)
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDeliveryDataByPerson?personId=${deliveryManId}&page=${1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getStatasticsForPerson = async () => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getStaticsForPerson?personId=${deliveryManId}`, config)
            .then((res) => {
                setPersonstasticData(res.data)
            })
            .catch((error) => {
                console.log('Error', error)
            })
    }
    const getStatasticsForPersonByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getStaticsForPerson?personId=${deliveryManId}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setPersonstasticData(res.data)
            })
            .catch((error) => {
                console.log('Error', error)
            })
    }

    const getDebitDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDeliveryDataByPerson?page=${pageNum}&numPerPage=${rowPerPageNum}&personId=${deliveryManId}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getDebitDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDeliveryDataByPerson?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&personId=${deliveryManId}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getDebitDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDeliveryDataByPerson?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}&personId=${deliveryManId}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCashDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}&payMode=cash`, config)
            .then((res) => {
                setCashTransaction(res.data.rows);
                setTotalRowsCash(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getCashData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?&page=${page + 1}&numPerPage=${rowsPerPage}&payMode=cash`, config)
            .then((res) => {
                setCashTransaction(res.data.rows);
                setTotalRowsCash(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDebit = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?&page=${page + 1}&numPerPage=${rowsPerPage}&payMode=debit`, config)
            .then((res) => {
                setDebitData(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDebitByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${1}&numPerPage=${rowsPerPage}&payMode=debit`, config)
            .then((res) => {
                setDebitData(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCashCounts = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionCounter?`, config)
            .then((res) => {
                setCashCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCashCountsByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionCounter?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setCashCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDebitCounts = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getDebitTransactionCounter?`, config)
            .then((res) => {
                setDebitCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getCashDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?page=${pageNum}&numPerPage=${rowPerPageNum}&payMode=cash`, config)
            .then((res) => {
                setCashTransaction(res.data.rows);
                setTotalRowsCash(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDebitOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?page=${pageNum}&numPerPage=${rowPerPageNum}&payMode=debit`, config)
            .then((res) => {
                setDebitData(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    const getCashDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&payMode=cash`, config)
            .then((res) => {
                setCashTransaction(res.data.rows);
                setTotalRowsCash(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDebitOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getCashTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}&page=${pageNum}&numPerPage=${rowPerPageNum}&payMode=debit`, config)
            .then((res) => {
                setDebitData(res.data.rows);
                setTotalRowsDebit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tab === '2' || tab === 2) {
            if (filter) {
                getDebitDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDebitDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        } else if (tab === '3' || tab === 3) {
            if (filter) {
                getCashDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getCashDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else {
            if (filter) {
                getDebitOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getDebitOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        if (tab === 2 || tab === '2') {
            if (filter) {
                getDebitDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getDebitDataOnPageChange(newPage + 1, rowsPerPage)
            }
        } else if (tab === '3' || tab === 3) {
            if (filter) {
                getCashDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getCashDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else {
            if (filter) {
                getDebitOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getDebitOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    };

    const debitExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForDebitTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = filter ? 'Debit_' + new Date(state[0].startDate).toLocaleDateString() + ' - ' + new Date(state[0].endDate).toLocaleDateString() + '.xlsx' : 'Debit_' + new Date().toLocaleDateString();
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


    const CashExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForCashTransactionList?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForStockin?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = filter ? 'Cash_' + new Date(state[0].startDate).toLocaleDateString() + ' - ' + new Date(state[0].endDate).toLocaleDateString() + '.xlsx' : 'Cash_' + new Date().toLocaleDateString();
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
    const DebitDataExportExcel = async () => {
        if (window.confirm('Are you sure you want to export Excel ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForDeditTransaction?startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}inventoryrouter/exportExcelSheetForDeditTransaction?startDate=${''}&endDate=${''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = filter ? 'Cash_' + new Date(state[0].startDate).toLocaleDateString() + ' - ' + new Date(state[0].endDate).toLocaleDateString() + '.xlsx' : 'Cash_' + new Date().toLocaleDateString();
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
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeSupplierTransactionDetails?supplierTransactionId=${id}`, config)
            .then((res) => {
                setSuccess(true)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteTransaction = (id) => {
        if (window.confirm("Are you sure you want to delete transaction?")) {
            deleteData(id);
            setTimeout(() => {
                getDebitDataByFilter();
                getDebitCounts();
            }, 1000)
        }
    }
    const getInvoice = async (tId, suppilerName) => {
        if (window.confirm('Are you sure you want to Download Invoice ... ?')) {
            await axios({
                url: `${BACKEND_BASE_URL}inventoryrouter/exportTransactionInvoice?transactionId=${tId}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = suppilerName + '_' + new Date().toLocaleDateString() + '.pdf'
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
                position: "bottom-right",
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
            position: "bottom-right",
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
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDeliveryDataByPerson?&page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setDebitTransaction(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
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

    const handleSearch = () => {
        console.log(':::???:::', document.getElementById('searchWord').value)
        search(document.getElementById('searchWord').value)
    }
    const debounceFunction = React.useCallback(debounce(handleSearch), [])
    useEffect(() => {
        // getCategoryList();
        // getProductList();
        getDebitCounts()
        getDebitData();
        getStatasticsForPerson();
        // getCountData();
    }, [])
    return (
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    {/* <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => {
                                            setTab(1); setPage(0); setRowsPerPage(5); setFilter(false);
                                            setState([
                                                {
                                                    startDate: new Date(),
                                                    endDate: new Date(),
                                                    key: 'selection'
                                                }
                                            ])
                                        }} >
                                        <div className='statusTabtext'>All</div>
                                    </div> */}
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => {
                                            setTab(2); setSearchWord(''); setPage(0); setRowsPerPage(5); filter ? getDebitDataByFilter() : getDebitData(); filter ? getStatasticsForPersonByFilter() : getStatasticsForPerson();
                                        }}>
                                        <div className='statusTabtext'>Deliveries of {name}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-4 col-start-9 flex justify-end pr-4'>
                                <div className='dateRange text-center self-center' aria-describedby={id} onClick={handleClick}>
                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                </div>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                        setFilter(false);
                                        getDebitData();
                                        getStatasticsForPerson();
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
                                                    getDebitDataByFilter();
                                                    getStatasticsForPersonByFilter();
                                                    setSearchWord('');
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
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-6 grid grid-cols-5 gap-6'>
                <CountCard color={'blue'} count={persontstasticData && persontstasticData.deliveryRound ? persontstasticData.deliveryRound : 0} desc={'Delivery Round'} unitDesc={0} />
                <CountCard color={'green'} count={persontstasticData && persontstasticData.numberOfOtherWork ? persontstasticData.numberOfOtherWork : 0} desc={'No. Of Other Work'} unitDesc={0} />
                <CountCard color={'yellow'} count={persontstasticData && persontstasticData.totalNoOfParcel ? persontstasticData.totalNoOfParcel : 0} desc={'No. Of Parcel'} unitDesc={0} />
                <CountCard color={'pink'} count={persontstasticData && persontstasticData.totalWorkTime ? persontstasticData.totalWorkTime : 0} desc={'Work Time'} unitDesc={0} />
                <CountCard color={'blue'} count={persontstasticData && persontstasticData.totalParcelAmt ? persontstasticData.totalParcelAmt : 0} desc={'Parcel Ammount'} unitDesc={0} />
            </div>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='grid grid-cols-12 pt-6'>
                            {/* {tab === 2 || tab === '2' ?
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
                                :
                                null}
                            <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                <button className='exportExcelBtn' onClick={() => { tab === 2 || tab === '2' ? debitExportExcel() : tab === 3 || tab === '3' ? CashExportExcel() : DebitDataExportExcel() }}><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>
                            </div> */}
                        </div>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Enterd By</TableCell>
                                            <TableCell align="right">Duration Time</TableCell>
                                            <TableCell align="right">Bill Ammount</TableCell>
                                            <TableCell align="right">Change Ammount</TableCell>
                                            <TableCell align="right">Desired Ammount</TableCell>
                                            <TableCell align="right">Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {debitTransaction?.map((row, index) => (
                                            totalRows !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.supplierTransactionId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => { setUpdatDeliveryPopUp(true); setUpdateDeliveryPopUpData(row) }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell align="left" >{row.enterBy}</TableCell>
                                                    <TableCell align="right" >{row.durationTime}</TableCell>
                                                    <TableCell align="right" >{row.totalBillAmt}</TableCell>
                                                    <TableCell align="right" >{row.totalChange}</TableCell>
                                                    <TableCell align="right" >{row.totalDesiredAmt}</TableCell>
                                                    <TableCell align="right" >{row.timePeriod}</TableCell>
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
                        </div>
                    </div>
                    <Modal
                        open={updateDeliveryPopUp}
                        onClose={() => setUpdatDeliveryPopUp(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        disableAutoFocus
                    >
                        <Box sx={style} className='rounded-md overflow-hidden border-none'>
                            <div className="">
                                <div className={`flex border-b px-2 justify-between items-center ${updateDeliveryPopUpData?.durationTime <= '00:20:00' ? 'customBgGreen' : updateDeliveryPopUpData?.durationTime <= '00:45:00' ? 'customBgYellow' : 'customBgRed'}`}>
                                    <div className=" p-2">
                                        {updateDeliveryPopUpData?.durationTime}
                                    </div>
                                    <div className="p-2 cursor-pointer" onClick={() => setUpdatDeliveryPopUp(false)}>
                                        <ClearIcon />
                                    </div>
                                </div>
                                <div className="overflow-hidden px-2 w-full bg-white rounded-lg  ">
                                    <div className="cardHeader">
                                        <div className="topHeader">
                                            <div className={`deliveryManInfo items-center px-3 py-2 flex w-full justify-between pl-2`}>
                                                <div className="name flex items-center w-2/5">
                                                    <div className="cursor-pointer" >
                                                        {/* {selectedDeliveryManName?.personName} */}
                                                        {updateDeliveryPopUpData?.personName}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="itemsData border-t border-gray-300 ">
                                        <div className="w-full  ">
                                            <div className="flex font-semibold text-sm border-b">
                                                <div className="w-1/12 text-sm p-2">Tkn</div>
                                                <div className="addressWidth text-sm text-start pl-3 p-2">Address</div>
                                                <div className="w-1/6 text-sm py-2 text-end">Pay Type</div>
                                                <div className="w-1/6 text-sm py-2 text-end">Bill Amt.</div>
                                                <div className="w-1/6 text-sm py-2 px-1 text-end">Change</div>
                                                <div className="w-1/6 text-sm py-2  text-end">Desired</div>
                                            </div>
                                            <div className="overflow-y-auto " style={{ height: '180px' }}>
                                                {updateDeliveryPopUpData?.deliveryData && updateDeliveryPopUpData?.deliveryData.map((bill, index) => (
                                                    <div key={index} className={`flex items-center border-t ${bill.billPayType === 'Cancel' ? 'bg-red-100' : bill.billPayType === 'online' ? 'bg-green-100' : bill.billPayType === 'due' ? 'bg-blue-100' : bill.billPayType === 'debit' ? 'bg-indigo-200' : ''}`}>
                                                        <div className="w-1/12 font-semibold text-center  text-sm p-1 px-0">{bill.token ? bill.token : (index + 1)}</div>
                                                        <Tooltip title={bill.billAddress}>
                                                            <div className="addressWidth cursor-pointer font-semibold text-sm text-start pl-1 p-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {bill.billAddress ? bill.billAddress.slice(0, 24) : ''}
                                                            </div>
                                                        </Tooltip>
                                                        <div className="w-1/6 font-semibold text-end  text-sm p-1">{bill.billPayType}</div>
                                                        <div className="w-1/6 font-semibold text-end  text-sm p-1">{bill.billAmt}</div>
                                                        <div className="w-1/6 font-semibold text-end  text-sm p-1 pr-0 pl-1">{bill.billChange || '0'}</div>
                                                        <div className="w-1/5 font-semibold text-sm text-end pr-2 pl-0 p-2">{bill.desiredAmt || '0'}</div>
                                                        <div className="w-fit font-semibold text-sm text-end  px-0">
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='border-t border-black flex items-center justify-end'>
                                                <div className="w-1/6 font-semibold text-start p-1"></div>
                                                <div className="w-1/6 font-semibold text-sm text-center p-1">Total</div>
                                                <div className="w-1/6 font-semibold text-end  text-sm ">
                                                    {updateDeliveryPopUpData?.totalBillAmt}
                                                </div>
                                                <div className="w-1/6 font-semibold text-end pr-2 text-sm p-1">
                                                    {/* {itemList.reduce((acc, bill) => acc + parseFloat(bill.change || 0), 0)} */}
                                                    {updateDeliveryPopUpData?.totalChange}
                                                </div>
                                                <div className="w-1/6 font-semibold text-sm text-end pr-2 p-2">
                                                    {/* {itemList.reduce((acc, bill) => acc + parseFloat(bill.desiredAmount || 0), 0)} */}
                                                    {updateDeliveryPopUpData?.totalDesiredAmt}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default DeliveryManDataTable;

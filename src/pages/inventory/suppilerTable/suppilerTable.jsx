import './suppilerTable.css'
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Menutemp from './menu';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

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

function SuppilerTable() {
    const [searchWord, setSearchWord] = React.useState('');
    const [debitCount, setDebitCount] = React.useState();
    const navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [formData, setFormData] = React.useState({
        supplierId: '',
        receivedBy: '',
        paidAmount: '',
        transactionNote: '',
        remainingAmount: '',
        supplierName: '',
        transactionDate: dayjs()
    });
    const [formDataError, setFormDataError] = React.useState({
        receivedBy: false,
        paidAmount: false,
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'receivedBy',
        'paidAmount',
    ]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [data, setData] = React.useState();
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierdata?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleClose = () => {
        setFormData({
            supplierId: '',
            receivedBy: '',
            paidAmount: '',
            transactionNote: '',
            remainingAmount: '',
            supplierName: '',
            transactionDate: dayjs()
        })
        setFormDataError({
            receivedBy: false,
            paidAmount: false,
        })
        setOpen(false);
    }
    const onChange = (e) => {
        if (e.target.name === 'paidAmount') {
            // if (e.target.value > formData.remainingAmount) {
            //     setFormDataError((perv) => ({
            //         ...perv,
            //         [e.target.name]: true
            //     }))
            // }
            // else {
            //     setFormDataError((perv) => ({
            //         ...perv,
            //         [e.target.name]: false
            //     }))
            // }
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const handleSuppilerOnClick = (id) => {
        navigate(`/suppilerDetails/${id}`)
    }
    const handleOpen = (row) => {
        // getCategoryList();
        setFormData((perv) => ({
            ...perv,
            supplierId: row.supplierId,
            receivedBy: row.supplierNickName,
            supplierFirmName: row.supplierFirmName,
            remainingAmount: row.remainingAmount ? row.remainingAmount : 0,
        }))
        setOpen(true);
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierdata?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/removeSupplierDetails?supplierId=${id}`, config)
            .then((res) => {
                setPage(0);
                setSuccess(true)
                setRowsPerPage(5);
                getData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    useEffect(() => {
        getData();
        getDebitCounts();
    }, [])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        getDataOnPageChange(newPage + 1, rowsPerPage)
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getDataOnPageChange(1, parseInt(event.target.value, 10))
    };
    const handleDeleteSuppiler = (id) => {
        if (window.confirm("Are you sure you want to delete User?")) {
            deleteData(id);
            setTimeout(() => {
                getData()
            }, 1000)
        }
    }
    const makePayment = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/addSupplierTransactionDetails`, formData, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getData();
                handleClose();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handlTransactionDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["transactionDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const getDebitCounts = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getDebitTransactionCounter?`, config)
            .then((res) => {
                setDebitCount(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const submitPayment = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFeild.filter(element => {
                if (formDataError[element] === true || formData[element] === '' || formData[element] === 0) {
                    setFormDataError((perv) => ({
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
                makePayment()
            }
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
            setLoading(false)
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
        setLoading(false)
    }
    const search = async (searchWord) => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getSupplierdata?page=${1}&numPerPage=${5}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const onSearchChange = (e) => {
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
    return (
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 userTableContainer'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='flex justify-center w-full'>
                            <div className='tableHeader flex justify-between'>
                                <div>
                                    Suppiler List
                                </div>
                                <div>
                                    Total Remaining Payment : {debitCount && debitCount.remainingAmount ? parseInt(debitCount.remainingAmount).toLocaleString('en-IN') : 0}
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-3 col-start-1 pl-8'>
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
                            <div className='col-span-4 col-start-9 pr-8 flex justify-end'>
                                <button className='exportExcelBtn' onClick={() => { navigate(`/addSuppiler`) }}>Add Suppiler</button>
                            </div>
                        </div>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="left">Firm</TableCell>
                                            <TableCell align="left">Suppiler Name</TableCell>
                                            <TableCell align="left">Phone Number</TableCell>
                                            {/* <TableCell align="left">Role</TableCell> */}
                                            <TableCell align="left">Remaining Payment</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.map((row, index) => (
                                            totalRows !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.supplierId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    style={{ cursor: "pointer" }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" onClick={() => handleSuppilerOnClick(row.supplierId)} >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} component="th" scope="row">
                                                        {row.supplierNickName}
                                                    </TableCell>
                                                    <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} align="left" >{row.supplierFirmName}</TableCell>
                                                    <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} align="left" >{row.supplierName}</TableCell>
                                                    <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} align="left" >{row.supplierPhoneNumber}</TableCell>
                                                    {/* <TableCell align="left" >{row.rightsName}</TableCell> */}
                                                    <TableCell onClick={() => handleSuppilerOnClick(row.supplierId)} align="left" >{parseFloat(row.remainingAmount ? row.remainingAmount : 0).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell align="right">
                                                        <Menutemp supplierId={row.supplierId} handleOpen={handleOpen} data={row} deleteSuppiler={handleDeleteSuppiler} />
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
                        </div>
                    </div>
                </div>

            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        <span className='makePaymentHeader'>Make Payment to : </span><span className='makePaymentName'>{formData.supplierFirmName}</span>
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 2) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            receivedBy: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            receivedBy: false
                                        }))
                                    }
                                }}
                                disabled={formData.remainingAmount == 0}
                                value={formData.receivedBy}
                                error={formDataError.receivedBy}
                                helperText={formDataError.receivedBy ? 'Enter Reciver Name' : ''}
                                name="receivedBy"
                                id="outlined-required"
                                label="Received By"
                                onChange={onChange}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            paidAmount: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            paidAmount: false
                                        }))
                                    }
                                }}
                                disabled={formData.remainingAmount == 0}
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={onChange}
                                value={formData.paidAmount}
                                error={formDataError.paidAmount}
                                // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                helperText={`Remaining Payment ${formData.remainingAmount}`}
                                name="paidAmount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                }}
                            />
                        </div>
                        <div className='col-span-4'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Transaction Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={formDataError.transactionDate}
                                    value={formData.transactionDate}
                                    onChange={handlTransactionDate}
                                    name="transactionDate"
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
                                value={formData.transactionNote}
                                name="transactionNote"
                                id="outlined-required"
                                label="Comment"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitPayment()
                            }}>Make Payment</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleClose();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default SuppilerTable;
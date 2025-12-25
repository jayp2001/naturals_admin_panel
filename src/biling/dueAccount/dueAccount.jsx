import './dueAccount.css'
import { useState, useEffect, useRef } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Close from "@mui/icons-material/Close";
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
import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { setISODay } from 'date-fns';

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
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    paddingTop: '15px',
    paddingRight: '15px',
    paddingLeft: '15px',
    paddingBottom: '10px'
};
const styleGave = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};

function DueAccounts() {
    const [searchWord, setSearchWord] = React.useState('');
    const [accountList, setAccountList] = useState([]);
    const [totalDue, setTotalDue] = useState(0);
    const regexMobile = /^[0-9\b]+$/;
    const [debitCount, setDebitCount] = React.useState();
    const navigate = useNavigate();
    const [dueFormData, setDueFormData] = useState({
        accountId: '',
        dueNote: '',
        selectedAccount: ''
    })
    const [page, setPage] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [addAccount, setAddAccount] = useState(false);
    const [accountFormData, setAccountFormData] = useState({
        customerName: "",
        customerNumber: ""
    })
    const [formData, setFormData] = React.useState({
        accountId: '',
        givenBy: '',
        paidAmount: '',
        transactionNote: '',
        transactionDate: dayjs()
    });
    const [formDataError, setFormDataError] = React.useState({
        givenBy: false,
        paidAmount: false,
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'givenBy',
        'paidAmount',
    ]);
    const [formDataDue, setFormDataDue] = React.useState({
        accountId: '',
        accountName: '',
        billAmount: '',
        dueNote: '',
        dueDate: dayjs()
    });
    const [formDataErrorDue, setFormDataErrorDue] = React.useState({
        billAmount: false,
    });
    const [formDataErrorFeildDue, setFormDataErrorFeildDue] = React.useState([
        'billAmount',
    ]);
    const [openDue, setOpenDue] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const first = useRef(null);
    const [data, setData] = React.useState();
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getCustomerAccountList?page=${1}&numPerPage=${5}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalDue(res.data.totalDueAmt);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleClose = () => {
        setFormData({
            accountId: '',
            givenBy: '',
            paidAmount: '',
            transactionNote: '',
            remainingAmount: '',
            supplierName: '',
            transactionDate: dayjs()
        })
        setFormDataError({
            givenBy: false,
            paidAmount: false,
        })
        setOpen(false);
    }
    const handleClose1 = () => {
        setFormDataDue({
            accountId: '',
            accountName: '',
            billAmount: '',
            dueNote: '',
            dueDate: dayjs()
        })
        setFormDataErrorDue({
            billAmount: false,
        })
        setOpen1(false);
    }
    const handleAccountChange = (e, value) => {
        if (value) {
            setDueFormData((prevState) => ({
                ...prevState,
                selectedAccount: value,
                accountId: value.accountId
            }));
        } else {
            setDueFormData((prevState) => ({
                ...prevState,
                selectedAccount: '',
                accountId: ''
            }));
        }
    };
    const clickAddAccount = () => {
        setAddAccount(true);
    }
    const handleSaveAccount = async () => {
        if (!accountFormData.customerName) {
            setError('Please add customer name')
        } else if (!accountFormData.customerNumber) {
            setError('Please add customer number')
        }
        else {
            setLoading(true);
            await axios
                .post(
                    `${BACKEND_BASE_URL}billingrouter/addCustomerAccount`,
                    accountFormData,
                    config
                )
                .then((res) => {
                    setSuccess(true);
                    setLoading(false);
                    setPage(0);
                    setRowsPerPage(5)
                    getData();
                    first.current.focus();
                    setAccountFormData({
                        customerName: "",
                        customerNumber: ""
                    })
                    setAddAccount(false);
                    setDueFormData((prev) => ({
                        ...prev,
                        accountId: res.data.accountId,
                        selectedAccount: res.data,
                    }))
                })
                .catch((error) => {
                    setError(
                        error.response && error.response.data
                            ? error.response.data
                            : "Network Error ...!!!"
                    );
                });
        }
    };
    const handleEditAccount = async () => {
        if (!accountFormData.customerName) {
            setError('Please add customer name')
        } else if (!accountFormData.customerNumber) {
            setError('Please add customer number')
        }
        else {
            setLoading(true);
            await axios
                .post(
                    `${BACKEND_BASE_URL}billingrouter/updateCustomerAccount`,
                    accountFormData,
                    config
                )
                .then((res) => {
                    setSuccess(true);
                    setLoading(false);
                    setOpenDue(false);
                    setIsEdit(false)
                    getData();
                    setPage(0);
                    setRowsPerPage(5)
                    setAccountFormData({
                        customerName: "",
                        customerNumber: ""
                    })
                    setAddAccount(false);
                    setDueFormData((prev) => ({
                        ...prev,
                        accountId: res.data.accountId,
                        selectedAccount: res.data,
                    }))
                })
                .catch((error) => {
                    setError(
                        error.response && error.response.data
                            ? error.response.data
                            : "Network Error ...!!!"
                    );
                });
        }
    };
    const handleCloseDue = () => {
        setOpenDue(false);
        setIsEdit(false);
        setAccountFormData({
            customerName: "",
            customerNumber: ""
        });
        setAddAccount(false);
    }
    const onChange = (e) => {
        if (e.target.name === 'paidAmount') {
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
    const onChangeDue = (e) => {
        if (e.target.name === 'billAmount') {
            setFormDataDue((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        } else {
            setFormDataDue((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const handleSuppilerOnClick = (id) => {
        navigate(`/due/accountDetails/${id}`)
    }
    const handleOpen = (row) => {
        // getCategoryList();
        setFormData((perv) => ({
            ...perv,
            accountId: row.accountId,
            givenBy: row.customerName,
        }))
        setOpen(true);
    }
    const handleOpen1 = (row) => {
        setFormDataDue((perv) => ({
            ...perv,
            accountId: row.accountId,
            accountName: row.customerName,
        }))
        setOpen1(true);
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getCustomerAccountList?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalDue(res.data.totalDueAmt);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}billingrouter/removeCustomerAccount?accountId=${id}`, config)
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
    const handleEdit = (data) => {
        setAccountFormData({
            customerName: data.customerName,
            customerNumber: data.customerNumber,
            accountId: data.accountId
        })
        setIsEdit(true);
        setOpenDue(true);
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
    const handleAddAccount = () => {

    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getDataOnPageChange(1, parseInt(event.target.value, 10))
    };
    const handleDeleteSuppiler = (id) => {
        if (window.confirm("Are you sure you want to delete User?")) {
            deleteData(id);
        }
    }
    const makePayment = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}billingrouter/addDebitDueTransactionData`, formData, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getData();
                setPage(0);
                setRowsPerPage(5)
                handleClose();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addDue = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}billingrouter/addDueBillData`, formDataDue, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5)
                getData();
                handleClose1();
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
    const handlDueDate = (date) => {
        setFormDataDue((prevState) => ({
            ...prevState,
            ["dueDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const getDebitCounts = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getDebitTransactionCounter?`, config)
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
                makePayment()
            }
        }
    }
    const submitPaymentDue = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFeildDue.filter(element => {
                if (formDataErrorDue[element] === true || formDataDue[element] === '' || formDataDue[element] === 0) {
                    setFormDataErrorDue((perv) => ({
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
                addDue()
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
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getCustomerAccountList?page=${1}&numPerPage=${5}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
                setTotalDue(res.data.totalDueAmt);
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
                                    Due Accounts List
                                </div>
                                <div>
                                    Total Remaining Payment : {parseInt(totalDue ? totalDue : 0).toLocaleString('en-IN')}
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
                                <button className='exportExcelBtn' onClick={() => {
                                    setOpenDue(true);
                                }}>Add Account</button>
                            </div>
                        </div>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="left">Phone Number</TableCell>
                                            <TableCell align="left">Remaining Payment</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.map((row, index) => (
                                            totalRows !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.accountId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    style={{ cursor: "pointer" }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" onClick={() => handleSuppilerOnClick(row.accountId)} >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell onClick={() => handleSuppilerOnClick(row.accountId)} component="th" scope="row">
                                                        {row.customerName}
                                                    </TableCell>
                                                    <TableCell onClick={() => handleSuppilerOnClick(row.accountId)} align="left" >{row.customerNumber}</TableCell>
                                                    {/* <TableCell align="left" >{row.rightsName}</TableCell> */}
                                                    <TableCell onClick={() => handleSuppilerOnClick(row.accountId)} align="left" >{parseFloat(row.dueBalace ? row.dueBalace : 0).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell align="right">
                                                        <Menutemp accountId={row.accountId} handleOpen={handleOpen} handleOpen1={handleOpen1} handleEdit={handleEdit} data={row} deleteSuppiler={handleDeleteSuppiler} />
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
                        <span className='makePaymentHeader'>You Got From </span><span className='makePaymentName'>{formData.givenBy}</span>
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 2) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            givenBy: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            givenBy: false
                                        }))
                                    }
                                }}
                                value={formData.givenBy}
                                error={formDataError.givenBy}
                                helperText={formDataError.givenBy ? 'Enter Sender Name' : ''}
                                name="givenBy"
                                id="outlined-required"
                                label="Given By"
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
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={onChange}
                                value={formData.paidAmount}
                                error={formDataError.paidAmount}
                                // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                // helperText={`Remaining Payment ${formData.remainingAmount}`}
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
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitPayment()
                            }}>Receive Payment</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleClose();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={open1}
                onClose={handleClose1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleGave}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        <span className='makePaymentHeader'>You Give to </span><span className='makePaymentName'>{formDataDue.accountName}</span>
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setFormDataErrorDue((perv) => ({
                                            ...perv,
                                            billAmount: true
                                        }))
                                    }
                                    else {
                                        setFormDataErrorDue((perv) => ({
                                            ...perv,
                                            billAmount: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={onChangeDue}
                                value={formDataDue.billAmount}
                                error={formDataErrorDue.billAmount}
                                // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                // helperText={`Remaining Payment ${formData.remainingAmount}`}
                                name="billAmount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                }}
                            />
                        </div>
                        <div className='col-span-6'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Due Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={formDataErrorDue.dueDate}
                                    value={formDataDue.dueDate}
                                    onChange={handlDueDate}
                                    name="dueDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onChange={onChangeDue}
                                value={formDataDue.dueNote}
                                name="dueNote"
                                id="outlined-required"
                                label="Due Note"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                submitPaymentDue()
                            }}>Add Due</button>
                        </div>
                        <div className='col-span-6'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleClose1();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openDue}
                onClose={handleCloseDue}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" className="flex justify-between" variant="h6" component="h2">
                        <div>{!isEdit ? 'Add' : 'Edit'} Account</div><div className="flex" style={{ marginTop: '-2px', cursor: 'pointer' }} onClick={() => handleCloseDue()}><Close className="self-center" /></div>
                    </Typography>
                    <div className="gap-4 grid mt-6 mb-4">
                        <>
                            <div>
                                <TextField
                                    // className="sarchTextTEST"
                                    value={accountFormData.customerName}
                                    name="customerName"
                                    id="customerName"
                                    inputRef={first}
                                    placeholder='Enter Customer Name'
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAccountFormData((prev) => ({
                                            ...prev,
                                            customerName: e.target.value
                                        }))
                                    }}
                                    fullWidth
                                />
                            </div>
                            <div>
                                <TextField
                                    // className="sarchTextTEST"
                                    value={accountFormData.customerNumber}
                                    name="customerNumber"
                                    id="customerNumber"
                                    placeholder='Enter Customer Number'
                                    variant="outlined"
                                    onChange={(e) => {
                                        if ((regexMobile.test(e.target.value) || e.target.value == '') && e.target.value.length < 11) {
                                            setAccountFormData((prev) => ({
                                                ...prev,
                                                customerNumber: e.target.value
                                            }))
                                        }
                                    }}
                                    fullWidth
                                />
                            </div>
                            <div className="flex gap-4 justify-end">
                                <div>
                                    <button
                                        className="text-base button px-3 rounded-md text-white"
                                        onClick={() => isEdit ? handleEditAccount() : handleSaveAccount()}
                                    >
                                        Save
                                    </button>
                                </div>
                                <div>
                                    <button
                                        className="another_2 button text-base px-3 rounded-md text-white"
                                        onClick={() => {
                                            setAccountFormData({
                                                customerName: "",
                                                customerNumber: ""
                                            });
                                            setIsEdit(false)
                                            setAddAccount(false);
                                            setOpenDue(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default DueAccounts;
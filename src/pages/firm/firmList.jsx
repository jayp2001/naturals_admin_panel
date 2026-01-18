import './firm.css'
import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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

function FirmListTable() {
    const navigate = useNavigate();
    const [searchWord, setSearchWord] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
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
        firmId: '',
        firmName: '',
        gstNumber: '',
        firmAddress: '',
        pincode: '',
        firmMobileNo: '',
        otherMobileNo: '',
        resetMonth: '',
        resetDay: ''
    });
    const [formDataError, setFormDataError] = React.useState({
        firmName: false,
        gstNumber: false,
        firmAddress: false,
        pincode: false,
        firmMobileNo: false,
        resetMonth: false,
        resetDay: false
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'firmName',
        'gstNumber',
        'firmAddress',
        'pincode',
        'firmMobileNo',
        'resetMonth',
        'resetDay'
    ]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [data, setData] = React.useState();
    const regex = /^[0-9\b]+$/;
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getFirmData?page=${1}&numPerPage=${5}&searchWord=`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleModalClose = () => {
        setFormData({
            firmId: '',
            firmName: '',
            gstNumber: '',
            firmAddress: '',
            pincode: '',
            firmMobileNo: '',
            otherMobileNo: '',
            resetMonth: '',
            resetDay: ''
        })
        setFormDataError({
            firmName: false,
            gstNumber: false,
            firmAddress: false,
            pincode: false,
            firmMobileNo: false,
            resetMonth: false,
            resetDay: false
        })
        setIsEditMode(false);
        setModalOpen(false);
    }
    const handleAddFirmOpen = () => {
        setFormData({
            firmId: '',
            firmName: '',
            gstNumber: '',
            firmAddress: '',
            pincode: '',
            firmMobileNo: '',
            otherMobileNo: '',
            resetMonth: '',
            resetDay: ''
        })
        setIsEditMode(false);
        setModalOpen(true);
    }
    const handleEditFirmOpen = (row) => {
        // Parse resetDate from "mm-dd" format
        let month = '';
        let day = '';
        if (row.resetDate) {
            const [monthPart, dayPart] = row.resetDate.split('-');
            month = monthPart;
            day = dayPart;
        }

        setFormData({
            firmId: row.firmId,
            firmName: row.firmName,
            gstNumber: row.gstNumber,
            firmAddress: row.firmAddress,
            pincode: row.pincode,
            firmMobileNo: row.firmMobileNo,
            otherMobileNo: row.otherMobileNo,
            resetMonth: month,
            resetDay: day
        })
        setIsEditMode(true);
        setModalOpen(true);
    }
    const onFormChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    // Unified function to handle field validation
    const handleFieldValidation = (fieldName, value, event) => {
        if (event === 'onBlur') {
            // onBlur validation - show error if field is empty or invalid
            if (fieldName === 'firmName' || fieldName === 'gstNumber' || fieldName === 'firmAddress') {
                // Simple required field validation
                setFormDataError((perv) => ({
                    ...perv,
                    [fieldName]: value.length < 1
                }))
            } else if (fieldName === 'pincode') {
                // Pincode validation - 6 digits
                setFormDataError((perv) => ({
                    ...perv,
                    pincode: value.length === 0 || !regex.test(value) || value.length !== 6
                }))
            } else if (fieldName === 'firmMobileNo') {
                // Mobile validation - 10 digits
                setFormDataError((perv) => ({
                    ...perv,
                    firmMobileNo: value.length === 0 || !regex.test(value) || value.length !== 10
                }))
            } else if (fieldName === 'resetMonth' || fieldName === 'resetDay') {
                // Reset month/day validation - required
                setFormDataError((perv) => ({
                    ...perv,
                    [fieldName]: value === '' || !value
                }))
            }
        } else if (event === 'onFocus') {
            // onFocus - clear error when user starts interacting with field
            setFormDataError((perv) => ({
                ...perv,
                [fieldName]: false
            }))
        }
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getFirmData?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    useEffect(() => {
        getData();
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
    const addFirm = async () => {
        setLoading(true);

        // Format resetDate to "mm-dd" format
        const resetDateFormatted = formData.resetMonth && formData.resetDay
            ? `${formData.resetMonth.padStart(2, '0')}-${formData.resetDay.padStart(2, '0')}`
            : null;

        await axios.post(`${BACKEND_BASE_URL}billingrouter/addFirmData`, {
            firmName: formData.firmName,
            gstNumber: formData.gstNumber,
            firmAddress: formData.firmAddress,
            pincode: parseInt(formData.pincode),
            firmMobileNo: formData.firmMobileNo,
            otherMobileNo: formData.otherMobileNo,
            resetDate: resetDateFormatted
        }, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getData();
                // Close modal after successful add
                setTimeout(() => {
                    handleModalClose();
                }, 100);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const updateFirm = async () => {
        setLoading(true);

        // Format resetDate to "mm-dd" format
        const resetDateFormatted = formData.resetMonth && formData.resetDay
            ? `${formData.resetMonth.padStart(2, '0')}-${formData.resetDay.padStart(2, '0')}`
            : null;

        await axios.post(`${BACKEND_BASE_URL}billingrouter/updateFirmData`, {
            firmId: formData.firmId,
            firmName: formData.firmName,
            gstNumber: formData.gstNumber,
            firmAddress: formData.firmAddress,
            pincode: parseInt(formData.pincode),
            firmMobileNo: formData.firmMobileNo,
            otherMobileNo: formData.otherMobileNo,
            resetDate: resetDateFormatted
        }, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getDataOnPageChange(page + 1, rowsPerPage);
                // Close modal immediately after successful update
                setTimeout(() => {
                    handleModalClose();
                }, 100);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const deleteFirm = async (firmId) => {
        setLoading(true);
        await axios.delete(`${BACKEND_BASE_URL}billingrouter/removeFirmData?firmId=${firmId}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0); // Reset to page 1
                getData();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleDeleteFirm = (firmId, firmName) => {
        if (window.confirm(`Are you sure you want to delete the firm "${firmName}"?`)) {
            deleteFirm(firmId);
        }
    }
    const handleRowClick = (firmId, firmName) => {
        navigate(`/firmList/firmDetail/${firmId}`);
    }
    const submitForm = () => {
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
                if (isEditMode) {
                    updateFirm()
                } else {
                    addFirm()
                }
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
                position: "top-right",
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
        setPage(0); // Reset to first page when searching
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getFirmData?page=${1}&numPerPage=${rowsPerPage}&searchWord=${searchWord}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearchWord(value);

        // If search is cleared, go to first page and reset data
        if (value === '') {
            setPage(0);
            getData();
        }
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
        search(document.getElementById('searchWord').value)
    }

    const debounceFunction = React.useCallback(debounce(handleSearch), [])

    // Get number of days in a month
    const getDaysInMonth = (month) => {
        if (!month) return 31;
        const monthInt = parseInt(month);
        const daysInMonth = {
            1: 31,  // January
            2: 29,  // February (using 29 to be safe)
            3: 31,  // March
            4: 30,  // April
            5: 31,  // May
            6: 30,  // June
            7: 31,  // July
            8: 31,  // August
            9: 30,  // September
            10: 31, // October
            11: 30, // November
            12: 31  // December
        };
        return daysInMonth[monthInt] || 31;
    }

    // Handle month change and validate day
    const handleMonthChange = (newMonth) => {
        const maxDays = getDaysInMonth(newMonth);
        const currentDay = parseInt(formData.resetDay);

        setFormData((prevState) => ({
            ...prevState,
            resetMonth: newMonth,
            // Reset day if it's greater than max days in the new month
            resetDay: currentDay > maxDays ? '' : prevState.resetDay
        }));
    }
    return (
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 userTableContainer'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='flex justify-center w-full'>
                            <div className='tableHeader flex justify-between'>
                                <div>
                                    Firm List
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-3 col-start-1 pl-8'>
                                <TextField
                                    className='sarchText'
                                    autoComplete='off'
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
                                <button className='exportExcelBtn' onClick={handleAddFirmOpen}>Add Firm</button>
                            </div>
                        </div>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" sx={{ width: '80px' }}>No.</TableCell>
                                            <TableCell align="left" sx={{ width: 'auto' }}>Firm Name</TableCell>
                                            <TableCell align="left" sx={{ width: 'auto' }}>GST Number</TableCell>
                                            <TableCell align="left" sx={{ width: 'auto' }}>Address</TableCell>
                                            <TableCell align="left" sx={{ width: 'auto' }}>Pincode</TableCell>
                                            <TableCell align="left" sx={{ width: 'auto' }}>Mobile No</TableCell>
                                            <TableCell align="left" sx={{ width: 'auto' }}>Other Mobile No</TableCell>
                                            <TableCell align="center" sx={{ width: '120px' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.map((row, index) => (
                                            totalRows !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.firmId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    className='tableRow'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleRowClick(row.firmId, row.firmName)}
                                                >
                                                    <TableCell align="left" sx={{ width: '80px' }}>
                                                        {searchWord ? (index + 1) : (index + 1) + (page * rowsPerPage)}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: 'auto' }}>
                                                        {row.firmName}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: 'auto' }}>
                                                        {row.gstNumber}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: 'auto' }}>
                                                        {row.firmAddress}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: 'auto' }}>
                                                        {row.pincode}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: 'auto' }}>
                                                        {row.firmMobileNo}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: 'auto' }}>
                                                        {row.otherMobileNo}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: '120px' }}>
                                                        <div style={{ display: 'flex', gap: '25px', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditFirmOpen(row);
                                                                }}
                                                                size="small"
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    minWidth: 32,
                                                                    borderRadius: '4px',
                                                                    backgroundColor: '#1976d2',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                    '&:hover': {
                                                                        backgroundColor: '#1565c0',
                                                                        boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                                                                    },
                                                                    '& .MuiSvgIcon-root': {
                                                                        color: 'white',
                                                                        fontSize: '18px',
                                                                    }
                                                                }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteFirm(row.firmId, row.firmName);
                                                                }}
                                                                size="small"
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    minWidth: 32,
                                                                    borderRadius: '4px',
                                                                    backgroundColor: '#d32f2f',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                    '&:hover': {
                                                                        backgroundColor: '#c62828',
                                                                        boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                                                                    },
                                                                    '& .MuiSvgIcon-root': {
                                                                        color: 'white',
                                                                        fontSize: '18px',
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </div>
                                                    </TableCell>
                                                </TableRow> :
                                                <TableRow
                                                    key={row.userId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell colSpan={8} align="left" style={{ fontSize: "18px", whiteSpace: "nowrap" }}>
                                                        No Data Found...!
                                                    </TableCell>
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
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        <span className='makePaymentHeader'>
                            {isEditMode ? 'Edit Firm' : 'Add Firm'}
                        </span>
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onFocus={(e) => handleFieldValidation('firmName', e.target.value, 'onFocus')}
                                onBlur={(e) => handleFieldValidation('firmName', e.target.value, 'onBlur')}
                                value={formData.firmName}
                                autoComplete='off'
                                autoFocus
                                error={formDataError.firmName}
                                helperText={formDataError.firmName ? 'Enter Firm Name' : ''}
                                name="firmName"
                                id="outlined-required"
                                label="Firm Name"
                                onChange={onFormChange}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-6'>
                            <TextField
                                onFocus={(e) => handleFieldValidation('gstNumber', e.target.value, 'onFocus')}
                                onBlur={(e) => handleFieldValidation('gstNumber', e.target.value, 'onBlur')}
                                value={formData.gstNumber}
                                autoComplete='off'
                                error={formDataError.gstNumber}
                                helperText={formDataError.gstNumber ? 'Enter GST Number' : ''}
                                name="gstNumber"
                                id="outlined-required"
                                label="GST Number"
                                onChange={onFormChange}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onFocus={(e) => handleFieldValidation('firmAddress', e.target.value, 'onFocus')}
                                onBlur={(e) => handleFieldValidation('firmAddress', e.target.value, 'onBlur')}
                                value={formData.firmAddress}
                                autoComplete='off'
                                error={formDataError.firmAddress}
                                helperText={formDataError.firmAddress ? 'Enter Firm Address' : ''}
                                name="firmAddress"
                                id="outlined-required"
                                label="Firm Address"
                                onChange={onFormChange}
                                rows={2}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onFocus={(e) => handleFieldValidation('pincode', e.target.value, 'onFocus')}
                                onBlur={(e) => handleFieldValidation('pincode', e.target.value, 'onBlur')}
                                value={formData.pincode}
                                autoComplete='off'
                                error={formDataError.pincode}
                                helperText={formDataError.pincode ? 'Enter 6 digit pincode' : ''}
                                name="pincode"
                                id="outlined-required"
                                label="Pincode"
                                onChange={(e) => {
                                    if (e.target.value === '' || regex.test(e.target.value)) {
                                        if (e.target.value.length <= 6) {
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                pincode: e.target.value,
                                            }))
                                        }
                                    }
                                }}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-6'>
                            <TextField
                                onFocus={(e) => handleFieldValidation('firmMobileNo', e.target.value, 'onFocus')}
                                onBlur={(e) => handleFieldValidation('firmMobileNo', e.target.value, 'onBlur')}
                                value={formData.firmMobileNo}
                                autoComplete='off'
                                error={formDataError.firmMobileNo}
                                helperText={formDataError.firmMobileNo ? 'Enter 10 digit mobile number' : ''}
                                name="firmMobileNo"
                                id="outlined-required"
                                label="Mobile Number"
                                onChange={(e) => {
                                    if (e.target.value === '' || regex.test(e.target.value)) {
                                        if (e.target.value.length <= 10) {
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                firmMobileNo: e.target.value,
                                            }))
                                        }
                                    }
                                }}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                value={formData.otherMobileNo}
                                autoComplete='off'
                                name="otherMobileNo"
                                id="outlined-required"
                                label="Other Mobile Number"
                                onChange={(e) => {
                                    if (e.target.value === '' || regex.test(e.target.value)) {
                                        if (e.target.value.length <= 10) {
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                otherMobileNo: e.target.value,
                                            }))
                                        }
                                    }
                                }}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <FormControl fullWidth error={formDataError.resetMonth}>
                                <InputLabel style={{ fontSize: 14 }}>Reset Month</InputLabel>
                                <Select
                                    value={formData.resetMonth}
                                    label="Reset Month"
                                    onChange={(e) => handleMonthChange(e.target.value)}
                                    onFocus={() => handleFieldValidation('resetMonth', formData.resetMonth, 'onFocus')}
                                    onBlur={() => handleFieldValidation('resetMonth', formData.resetMonth, 'onBlur')}
                                    style={{ fontSize: 14 }}
                                >
                                    <MenuItem value="01">January</MenuItem>
                                    <MenuItem value="02">February</MenuItem>
                                    <MenuItem value="03">March</MenuItem>
                                    <MenuItem value="04">April</MenuItem>
                                    <MenuItem value="05">May</MenuItem>
                                    <MenuItem value="06">June</MenuItem>
                                    <MenuItem value="07">July</MenuItem>
                                    <MenuItem value="08">August</MenuItem>
                                    <MenuItem value="09">September</MenuItem>
                                    <MenuItem value="10">October</MenuItem>
                                    <MenuItem value="11">November</MenuItem>
                                    <MenuItem value="12">December</MenuItem>
                                </Select>
                                {formDataError.resetMonth && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, fontSize: 12 }}>
                                        Select reset month
                                    </Typography>
                                )}
                            </FormControl>
                        </div>
                        <div className='col-span-6'>
                            <FormControl fullWidth error={formDataError.resetDay}>
                                <InputLabel style={{ fontSize: 14 }}>Reset Day</InputLabel>
                                <Select
                                    value={formData.resetDay}
                                    label="Reset Day"
                                    onChange={(e) => {
                                        setFormData((prevState) => ({
                                            ...prevState,
                                            resetDay: e.target.value
                                        }))
                                    }}
                                    onFocus={() => handleFieldValidation('resetDay', formData.resetDay, 'onFocus')}
                                    onBlur={() => handleFieldValidation('resetDay', formData.resetDay, 'onBlur')}
                                    style={{ fontSize: 14 }}
                                    disabled={!formData.resetMonth}
                                >
                                    {Array.from({ length: getDaysInMonth(formData.resetMonth) }, (_, i) => i + 1).map((day) => (
                                        <MenuItem key={day} value={day.toString().padStart(2, '0')}>
                                            {day}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formDataError.resetDay && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, fontSize: 12 }}>
                                        Select reset day
                                    </Typography>
                                )}
                            </FormControl>
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={submitForm}>
                                {isEditMode ? 'Update' : 'Add Firm'}
                            </button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={handleModalClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default FirmListTable;
import './upiDashboard.css'
import React, { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from '../../../src/url';
import axios from 'axios';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { ToastContainer, toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

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

function UPIListTable() {
    const navigate = useNavigate();
    const [searchWord, setSearchWord] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const regex = /^[0-9\b]+$/;
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [formData, setFormData] = React.useState({
        onlineId: '',
        holderName: '',
        holderNumber: '',
        upiId: '',
        isOfficial: false
    });
    const [formDataError, setFormDataError] = React.useState({
        holderName: false,
        holderNumber: false,
        upiId: false,
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'holderName',
        'holderNumber',
        'upiId',
    ]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [data, setData] = React.useState();
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getUPIList?page=${1}&numPerPage=${5}`, config)
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
            onlineId: '',
            holderName: '',
            holderNumber: '',
            upiId: '',
            isOfficial: false
        })
        setFormDataError({
            holderName: false,
            holderNumber: false,
            upiId: false,
        })
        setIsEditMode(false);
        setModalOpen(false);
    }
    const handleAddUpiOpen = () => {
        setFormData({
            onlineId: '',
            holderName: '',
            holderNumber: '',
            upiId: '',
            isOfficial: false
        })
        setIsEditMode(false);
        setModalOpen(true);
    }
    const handleEditUpiOpen = (row) => {
        setFormData({
            onlineId: row.onlineId,
            holderName: row.holderName,
            holderNumber: row.holderNumber,
            upiId: row.upiId,
            isOfficial: row.isOfficial === 1 || row.isOfficial === true
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
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getUPIList?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
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
    const addUpiDetails = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}billingrouter/addUPI`, formData, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getData();
                handleModalClose();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const updateUpiDetails = async () => {
        setLoading(true);
        const updateData = {
            ...formData,
            isOfficial: formData.isOfficial ? 1 : 0
        };
        await axios.post(`${BACKEND_BASE_URL}billingrouter/updateUPI`, updateData, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getDataOnPageChange(page + 1, rowsPerPage);
                handleModalClose();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const deleteUpiDetails = async (onlineId) => {
        setLoading(true);
        await axios.delete(`${BACKEND_BASE_URL}billingrouter/removeUPI?onlineId=${onlineId}`, config)
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
    const setDefaultUPI = async (onlineId) => {
        setLoading(true);
        await axios.get(`${BACKEND_BASE_URL}billingrouter/setDefaultUPI?onlineId=${onlineId}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getDataOnPageChange(page + 1, rowsPerPage);
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleDeleteUpi = (onlineId, holderName) => {
        if (window.confirm(`Are you sure you want to delete UPI for "${holderName}"?`)) {
            deleteUpiDetails(onlineId);
        }
    }
    const handleSetDefault = (onlineId, holderName) => {
        if (window.confirm(`Are you sure you want to set "${holderName}" as default UPI?`)) {
            setDefaultUPI(onlineId);
        }
    }
    const handleRowClick = (onlineId, holderName) => {
        const encodedHolderName = encodeURIComponent(holderName);
        navigate(`/upi/detail/${onlineId}/${encodedHolderName}`);
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
                    updateUpiDetails()
                } else {
                    addUpiDetails()
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
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getUPIList?page=${1}&numPerPage=${rowsPerPage}&searchWord=${searchWord}`, config)
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
    return (
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 userTableContainer'>
                <div className='col-span-12'>
                    <div className='userTableSubContainer'>
                        <div className='flex justify-center w-full'>
                            <div className='tableHeader flex justify-between'>
                                <div>
                                    UPI List
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
                                <button className='exportExcelBtn' onClick={handleAddUpiOpen}>Add UPI</button>
                            </div>
                        </div>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Holder Name</TableCell>
                                            <TableCell align="left">Holder Number</TableCell>
                                            <TableCell align="left">UPI ID</TableCell>
                                            <TableCell align="left">Is Official</TableCell>
                                            <TableCell align="left"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.map((row, index) => (
                                            totalRows !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.onlineId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    className='tableRow'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleRowClick(row.onlineId, row.holderName)}
                                                >
                                                    <TableCell align="left">
                                                        {searchWord ? (index + 1) : (index + 1) + (page * rowsPerPage)}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {row.holderName}
                                                    </TableCell>
                                                    <TableCell align="left">{row.holderNumber}</TableCell>
                                                    <TableCell align="left">{row.upiId}</TableCell>
                                                    <TableCell align="left">{row.isOfficial ? 'Yes' : 'No'}</TableCell>
                                                    <TableCell align="right">
                                                        <div style={{ display: 'flex', gap: '25px', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSetDefault(row.onlineId, row.holderName);
                                                                }}
                                                                size="small"
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    minWidth: 32,
                                                                    borderRadius: '4px',
                                                                    backgroundColor: 'white',
                                                                    border: row.isDefault ? '1px solid #ff9800' : '1px solid #d0d0d0',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                    '&:hover': {
                                                                        backgroundColor: row.isDefault ? '#fff3e0' : '#f9f9f9',
                                                                        boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                                                                    },
                                                                    '& .MuiSvgIcon-root': {
                                                                        color: '#ff9800',
                                                                        fontSize: '18px',
                                                                    }
                                                                }}
                                                            >
                                                                {row.isDefault ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditUpiOpen(row);
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
                                                                    handleDeleteUpi(row.onlineId, row.holderName);
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
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <Typography id="modal-modal" variant="h6" component="h2">
                        <span className='makePaymentHeader'>
                            {isEditMode ? 'Edit UPI Details' : 'Add UPI Details'}
                        </span>
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value.length < 2) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            holderName: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            holderName: false
                                        }))
                                    }
                                }}
                                value={formData.holderName}
                                autoComplete='off'
                                autoFocus
                                error={formDataError.holderName}
                                helperText={formDataError.holderName ? 'Enter Holder Name' : ''}
                                name="holderName"
                                id="outlined-required"
                                label="Holder Name"
                                onChange={onFormChange}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-4'>
                            <TextField
                                id="holderNumber"
                                label="Holder Number"
                                variant="outlined"
                                autoComplete='off'
                                className='w-full'
                                value={formData.holderNumber}
                                onChange={(e) => {
                                    if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            holderNumber: e.target.value
                                        }));
                                        setFormDataError(prevErrors => ({
                                            ...prevErrors,
                                            holderNumber: e.target.value.length == 0 ? false : e.target.value.length > 0 && e.target.value.length < 10 ? true : false
                                        }));
                                    }
                                    else {
                                        setFormDataError(prevErrors => ({
                                            ...prevErrors,
                                            holderNumber: false
                                        }));
                                    }
                                }}
                                error={formDataError.holderNumber}
                                helperText={formDataError.holderNumber ? 'Enter Valid Phone Number' : ''}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value.length < 5) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            upiId: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            upiId: false
                                        }))
                                    }
                                }}
                                value={formData.upiId}
                                autoComplete='off'
                                error={formDataError.upiId}
                                helperText={formDataError.upiId ? 'Enter Valid UPI ID' : ''}
                                name="upiId"
                                id="outlined-required"
                                label="UPI ID"
                                onChange={onFormChange}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.isOfficial}
                                        onChange={(e) => {
                                            setFormData((prevState) => ({
                                                ...prevState,
                                                isOfficial: e.target.checked
                                            }))
                                        }}
                                        name="isOfficial"
                                    />
                                }
                                label="Is Official"
                                sx={{ fontSize: 14 }}
                            />
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={submitForm}>
                                {isEditMode ? 'Update' : 'Add'}
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

export default UPIListTable;
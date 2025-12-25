import './comment.css'
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
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';

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

function CommentListTable() {
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
        commentId: '',
        comment: ''
    });
    const [formDataError, setFormDataError] = React.useState({
        comment: false
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'comment'
    ]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [data, setData] = React.useState();
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getCommentData?page=${1}&numPerPage=${5}`, config)
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
            commentId: '',
            comment: ''
        })
        setFormDataError({
            comment: false
        })
        setIsEditMode(false);
        setModalOpen(false);
    }
    const handleAddCommentOpen = () => {
        setFormData({
            commentId: '',
            comment: ''
        })
        setIsEditMode(false);
        setModalOpen(true);
    }
    const handleEditCommentOpen = (row) => {
        setFormData({
            commentId: row.commentId,
            comment: row.comment
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
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getCommentData?page=${pageNum}&numPerPage=${rowPerPageNum}&searchWord=${searchWord}`, config)
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
    const addComment = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}billingrouter/addComment`, {
            comment: formData.comment
        }, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                getData();
                // Keep modal open and clear form
                setFormData({
                    commentId: '',
                    comment: ''
                });
                setFormDataError({
                    comment: false
                });
                // Focus will be maintained by autoFocus prop
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const updateComment = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}billingrouter/updateComment`, {
            commentId: formData.commentId,
            comment: formData.comment
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
    const deleteComment = async (commentId) => {
        setLoading(true);
        await axios.delete(`${BACKEND_BASE_URL}billingrouter/removeComment?commentId=${commentId}`, config)
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
    const handleDeleteComment = (commentId, commentText) => {
        if (window.confirm(`Are you sure you want to delete the comment "${commentText}"?`)) {
            deleteComment(commentId);
        }
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
                    updateComment()
                } else {
                    addComment()
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
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getCommentData?page=${1}&numPerPage=${rowsPerPage}&searchWord=${searchWord}`, config)
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
                                    Comment List
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
                                <button className='exportExcelBtn' onClick={handleAddCommentOpen}>Add Comment</button>
                            </div>
                        </div>
                        <div className='tableContainerWrapper'>
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" sx={{ width: '80px' }}>No.</TableCell>
                                            <TableCell align="left" sx={{ width: 'auto' }}>Comment</TableCell>
                                            <TableCell align="center" sx={{ width: '120px' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.map((row, index) => (
                                            totalRows !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.commentId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" sx={{ width: '80px' }}>
                                                        {searchWord ? (index + 1) : (index + 1) + (page * rowsPerPage)}
                                                    </TableCell>
                                                    <TableCell align="left" sx={{ width: 'auto' }}>
                                                        {row.comment}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: '120px' }}>
                                                        <div style={{ display: 'flex', gap: '25px', justifyContent: 'flex-end' }}>
                                                            <IconButton
                                                                onClick={() => handleEditCommentOpen(row)}
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
                                                                onClick={() => handleDeleteComment(row.commentId, row.comment)}
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
                                                    <TableCell colSpan={3} align="left" style={{ fontSize: "18px", whiteSpace: "nowrap" }}>
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
                            {isEditMode ? 'Edit Comment' : 'Add Comment'}
                        </span>
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value.length < 1) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            comment: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            comment: false
                                        }))
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        submitForm();
                                    }
                                }}
                                value={formData.comment}
                                autoComplete='off'
                                autoFocus
                                error={formDataError.comment}
                                helperText={formDataError.comment ? 'Enter Comment' : ''}
                                name="comment"
                                id="outlined-required"
                                label="Comment"
                                onChange={onFormChange}
                                multiline
                                rows={3}
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-start-7 col-span-3'>
                            <button className='addCategorySaveBtn' onClick={submitForm}>
                                {isEditMode ? 'Update' : 'Add Comment'}
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

export default CommentListTable;
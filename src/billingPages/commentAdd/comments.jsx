import './comments.css'
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
import { BACKEND_BASE_URL } from '../../url';
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
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import { useNavigate } from "react-router-dom";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};

function CommentTable() {
    const [editCateory, setEditCategory] = React.useState({
        comment: '',
        commentId: ''
    })
    const navigate = useNavigate();
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'F10') {
                handleOpen()
                console.log('Enter key pressed');
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    var date = new Date(), y = date.getFullYear(), m = (date.getMonth());
    var firstDay = new Date(y, m, 1).toString().slice(4, 15);
    var lastDay = new Date(y, m + 1, 0).toString().slice(4, 15);
    const textFieldRef = useRef(null);

    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };

    const [isEdit, setIsEdit] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [category, setCategory] = React.useState('');
    const [categoryError, setCategoryError] = React.useState('');
    const [openModal, setOpen] = React.useState(false);
    const [filter, setFilter] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [totalStockOutPrice, setTotalStockOutPrice] = React.useState();
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setCategory('');
        setCategoryError(false);
        setEditCategory({
            comment: '',
            commentId: ''
        });
        setIsEdit(false);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const handleReset = () => {
        setCategory('');
        setCategoryError(false);
        setEditCategory({
            comment: '',
            commentId: ''
        });
        setIsEdit(false);
    }
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [data, setData] = React.useState();




    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getComment`, config)
            .then((res) => {
                setData(res.data);
                // setTotalRows(res.data.numRows);
                // setTotalStockOutPrice(res.data.totalCategoryStockOutPrice)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}billingrouter/removeComment?commentId=${id}`, config)
            .then((res) => {
                setSuccess(true)
                getData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    useEffect(() => {
        getData();
    }, [])
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete Category?")) {
            deleteData(id);
            setTimeout(() => {
                getData();
            }, 1000)
        }
    }
    const handleEdit = (id, name) => {
        setCategoryError(false);
        setIsEdit(true);
        setEditCategory((perv) => ({
            ...perv,
            commentId: id,
            comment: name
        }))
        setOpen(true)
    }
    const editCategory = async () => {
        if (loading || success) {

        } else {
            if (editCateory.comment.length < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            }
            else {
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}billingrouter/updateComment`, editCateory, config)
                    .then((res) => {
                        setLoading(false);
                        setSuccess(true)
                        getData();
                        setPage(0);
                        setRowsPerPage(5)
                        setIsEdit(false)
                        handleCloseModal()
                    })
                    .catch((error) => {
                        setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    })
            }
        }
    }
    const addCategory = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}billingrouter/addComment`, { comment: category }, config)
            .then((res) => {
                setSuccess(true)
                getData();
                setLoading(false);
                handleReset();
                focus();
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submit = () => {
        if (loading || success) {

        } else {
            if (category.length < 2) {
                setError(
                    "Please Fill category"
                )
                setCategoryError(true);
            } else {
                addCategory()
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
                toastId: 'error',
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
        <div className='grid grid-cols-12 userTableContainer'>
            <div className='col-span-10 col-start-2'>
                <div className='userTableSubContainer'>
                    <div className='flex justify-center w-full'>
                        <div className='tableHeader flex justify-between'>
                            <div>
                                Comments List
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-12'>
                        <div className='col-span-2 col-start-11 mr-6'>
                            <div className='flex justify-end'>
                                <button className='addCategoryBtn' onClick={handleOpen}>Add Comments</button>
                            </div>

                        </div>
                    </div>
                    <div className='tableContainerWrapper'>
                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Comment Name</TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.map((row, index) => (
                                        data?.length !== 0 ?
                                            <TableRow
                                                hover
                                                key={row.commentId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                style={{ cursor: "pointer" }}
                                                className='tableRow'
                                            >
                                                <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                <TableCell component="th" scope="row" >
                                                    {row.comment}
                                                </TableCell>
                                                <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.commentId, row.comment)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.commentId)}>Delete</button></div></TableCell>
                                                <TableCell align="right">
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
                        </TableContainer>
                    </div>
                </div>
            </div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEdit ? 'Edit Comment' : 'Add Comment'}
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value.length < 2) {
                                        setCategoryError(true);
                                    }
                                    else {
                                        setCategoryError(false)
                                    }
                                }}
                                onChange={(e) => {
                                    isEdit ? setEditCategory((perv) => ({
                                        ...perv,
                                        comment: e.target.value
                                    })) : setCategory(e.target.value)
                                }}
                                value={isEdit ? editCateory.comment ? editCateory.comment : '' : category}
                                error={categoryError ? true : false}
                                inputRef={textFieldRef}
                                helperText={categoryError ? "Please Enter Comment" : ''}
                                name="Comment"
                                id="outlined-required"
                                label="Category"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isEdit ? editCategory() : submit()
                            }}>{isEdit ? 'Save' : 'Add'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseModal(); setEditCategory((perv) => ({
                                    ...perv,
                                    commentId: '',
                                    comment: ''
                                }));
                                setCategory('')
                                setIsEdit(false)
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default CommentTable;
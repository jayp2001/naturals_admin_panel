import './staffCategoriesTable.css'
import { useState, useEffect } from "react";
import React from "react";
import { useRef } from 'react';
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
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};

function StaffCategoryTable() {
    const [formData, setFormData] = React.useState({
        staffCategoryName: '',
        staffCategoryId: '',
        staffCategoryPosition: '',
    })

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

    const textFieldRef = useRef(null);

    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };

    const [isEdit, setIsEdit] = React.useState(false);
    const [staffCategoryNameError, setStaffCategoryNameError] = React.useState('');
    const [staffCategoryPositionError, setStaffCategoryPositionError] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setStaffCategoryNameError(false);
        setStaffCategoryPositionError(false);
        setFormData({
            staffCategoryName: '',
            staffCategoryId: '',
            staffCategoryPosition: '',
        });
        setIsEdit(false);
    }
    const handleReset = () => {
        setStaffCategoryNameError(false);
        setStaffCategoryPositionError(false);
        setFormData({
            staffCategoryName: '',
            staffCategoryId: '',
            staffCategoryPosition: '',
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
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getStaffCategoryList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getStaffCategoryList?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async (id) => {
        if (window.confirm('Are you sure you want to delete this category ..!!')) {
            await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeStaffCategory?staffCategoryId=${id}`, config)
                .then((res) => {
                    setSuccess(true)
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
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
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete Category?")) {
            deleteData(id);
            setTimeout(() => {
                getData();
            }, 1000)
        }
    }
    const handleEdit = (id, name, position) => {
        setStaffCategoryNameError(false);
        setStaffCategoryPositionError(false);
        setIsEdit(true);
        setFormData((perv) => ({
            ...perv,
            staffCategoryId: id,
            staffCategoryName: name,
            staffCategoryPosition: position
        }))
        setOpen(true)
    }
    const editCategory = async () => {
        if (!formData.staffCategoryName || formData.staffCategoryName < 2) {
            setError(
                "Please Fill category"
            )
            setStaffCategoryNameError(true);
            if (!formData.staffCategoryPosition || formData.staffCategoryPosition < 1) {
                setStaffCategoryPositionError(true);
            }
        }
        else if (!formData.staffCategoryPosition || formData.staffCategoryPosition < 1) {
            setStaffCategoryPositionError(true);
        }
        else {
            setLoading(true);
            await axios.post(`${BACKEND_BASE_URL}staffrouter/updateStaffCategory`, formData, config)
                .then((res) => {
                    setLoading(false);
                    setSuccess(true)
                    getData();
                    handleClose()
                })
                .catch((error) => {
                    setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                })
        }
    }
    const addCategory = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addStaffCategory`, formData, config)
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
            if (!formData.staffCategoryName || formData.staffCategoryName < 2) {
                setError(
                    "Please Fill category"
                )
                setStaffCategoryNameError(true);
                if (!formData.staffCategoryPosition || formData.staffCategoryPosition < 1) {
                    setStaffCategoryPositionError(true);
                }
            }
            else if (!formData.staffCategoryPosition || formData.staffCategoryPosition < 1) {
                setStaffCategoryPositionError(true);
            }
            else {
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
                                Categories List
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-12'>
                        <div className='col-span-2 col-start-11'>
                            <button className='addCategoryBtn' onClick={handleOpen}>Add Category</button>
                        </div>
                    </div>
                    <div className='tableContainerWrapper'>
                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Category Name</TableCell>
                                        <TableCell>Active Employee</TableCell>
                                        <TableCell>Total Salary</TableCell>
                                        <TableCell>salary persentage</TableCell>
                                        <TableCell>Inactive Employee</TableCell>
                                        <TableCell align="left">Position</TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.map((row, index) => (
                                        totalRows !== 0 ?
                                            <TableRow
                                                hover
                                                key={row.staffCategoryId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                style={{ cursor: "pointer" }}
                                                className='tableRow'
                                            >
                                                <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.staffCategoryName}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.numberOfActiveEmployee}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {parseFloat(row.totalSalary ? row.totalSalary : 0).toLocaleString('en-IN')}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.percentageOfTotalSalary}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.numberOfInActiveEmployee}
                                                </TableCell>
                                                <TableCell align="left" >{row.staffCategoryPosition}</TableCell>
                                                <TableCell align="right" ><div className=''><button className='editCategoryBtn mr-6' onClick={() => handleEdit(row.staffCategoryId, row.staffCategoryName, row.staffCategoryPosition)}>Edit</button><button className='deleteCategoryBtn' onClick={() => handleDelete(row.staffCategoryId)}>Delete</button></div></TableCell>
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
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {isEdit ? 'Edit Category' : 'Add Category'}
                    </Typography>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-5'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value.length < 2) {
                                        setStaffCategoryNameError(true);
                                    }
                                    else {
                                        setStaffCategoryNameError(false)
                                    }
                                }}
                                onChange={(e) => {
                                    setFormData((perv) => ({
                                        ...perv,
                                        staffCategoryName: e.target.value
                                    }))
                                }}
                                value={formData.staffCategoryName}
                                error={staffCategoryNameError ? true : false}
                                inputRef={textFieldRef}
                                helperText={staffCategoryNameError ? "Please Enter Category" : ''}
                                name="staffCategoryName"
                                id="outlined-required"
                                label="Category"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-3'>
                            <TextField
                                onBlur={(e) => {
                                    if (!e.target.value || e.target.value < 0) {
                                        setStaffCategoryPositionError(true);
                                    }
                                    else {
                                        setStaffCategoryPositionError(false)
                                    }
                                }}
                                onChange={(e) => {
                                    setFormData((perv) => ({
                                        ...perv,
                                        staffCategoryPosition: e.target.value
                                    }))
                                }}
                                value={formData.staffCategoryPosition}
                                error={staffCategoryPositionError ? true : false}
                                helperText={staffCategoryPositionError ? "Please Position" : ''}
                                name="staffCategoryPosition"
                                id="outlined-required"
                                label="Category Position"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                        <div className='col-span-2'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isEdit ? editCategory() : submit()
                            }}>{isEdit ? 'Save' : 'Add'}</button>
                        </div>
                        <div className='col-span-2'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleClose(); setFormData((perv) => ({
                                    ...perv,
                                    staffCategoryId: '',
                                    staffCategoryName: ''
                                }));
                                setIsEdit(false)
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default StaffCategoryTable;
/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useSpring, animated } from '@react-spring/web';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import './css/AddCategory.css'

const Fade = React.forwardRef(function Fade(props, ref) {
    const {
        children,
        in: open,
        onClick,
        onEnter,
        onExited,
        ownerState,
        ...other
    } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null, true);
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </animated.div>
    );
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
function AddCategory() {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = React.useState(null);
    const [countData, setCountData] = React.useState();
    const [searchWord, setSearchWord] = React.useState();
    const [dataSearch, setDataSearch] = React.useState();
    const [editIndex, setEditIndex] = React.useState(-1);
    const [categoryName, setCategoryName] = useState('');
    const [reloadData, setReloadData] = useState(Date.now());
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [feildError, setFeildError] = useState(false)
    const autFocus = useRef(null)
    const [catgoryUpdateData, setCategoryUpdateData] = useState();
    const [categoryUpdatePopUp, setCategoryUpdatePopUp] = useState(false)
    const [categoryUpdateName, setCategoryUpdateName] = useState();
    const [hoveredRow, setHoveredRow] = useState(null);
    const [subCategoryNavigate, setSubCategoryNavigate] = useState('')

    const handleMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    useEffect(() => {
        getAllCategory();
    }, []);
    const getAllCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getMainCategory`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            setError(error.response.data)
        }
    }

    const handleClose = () => {
        setOpen(false);
        setCategoryName('');
        setError(false)
        setCategoryUpdatePopUp(false);
        setFeildError(false)
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
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false);
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

    const handleOpen = () => setOpen(true);
    const handleCreateCategory = async () => {
        if (!categoryName.trim()) {
            setFeildError(true)
            setError('Category Have to Be Filled')
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BACKEND_BASE_URL}menuItemrouter/addMainCategory`, {
                categoryName: categoryName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data === 'Category Added Successfully') {
                setCategoryName('')
                getAllCategory();
                setSuccess('Category Added Successfully')
                autFocus.current && autFocus.current.focus();
            }
        } catch (error) {
            if (error.response.data === 'Category is Already In Use') {
                setError('Category is Already In Use')
                autFocus.current && autFocus.current.focus();
            }
            setError(error.response.data)
        }
    }
    const handleUpdateUnit = async (index) => {
        if (!categoryUpdateName.trim()) {
            setFeildError(true)
            setError('Category Have to Be Filled')
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const category = categories[index];
            const response = await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/updateMainCategory`,
                {
                    categoryId: catgoryUpdateData.categoryId,
                    categoryName: categoryUpdateName
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data === 'Category Updated Successfully') {
                setEditIndex(-1);
                getAllCategory();
                setSuccess('Category Updated Successfully')
                handleClose();
            }
        } catch (error) {
            setError(error.response.data)
        }
    };
    const handleDeleteCategory = async (category) => {
        const token = localStorage.getItem('token')
        const password = '123'
        const enteredPassword = prompt('Please Enter The Password');
        if (enteredPassword !== password) {
            alert('Incorrect password. Operation aborted.');
            return;
        }
        if (enteredPassword === password) {
            try {
                const id = category.categoryId
                const response = await axios.delete(
                    `${BACKEND_BASE_URL}menuItemrouter/removeMainCategory?categoryId=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                )
                if (response.data === 'Category Deleted Successfully') {
                    setSuccess('Category Deleted Successfully')
                    getAllCategory();
                }
            } catch (error) {
                setError(error.response.data)
            }
        }

    }

    return (
        <div className='BilingDashboardContainer mx-4 p-3'>
            <div className='grid grid-cols-12 mt-3'>
                <div className='col-span-12 '>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  '>
                                <div className='grid grid-cols-12 pl-6 g h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === null || tab === '' || !tab ? 'productTabAll' : 'productTab'}`} onClick={() => { setTab(null); setSearchWord(''); setDataSearch([]) }}>
                                        <div className='statusTabtext'>All Categories</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3  h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={handleOpen}>Add Category</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            {categories.length > 0 ? (
                <div className='tableContainerWrapper'>
                    <TableContainer className='bg-white px-4 pt-6 border-none rounded-xl mt-7'>
                        <Table aria-label="simple table" component={Paper} >
                            <TableHead >
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell align='right' className='pr-9' style={{ paddingRight: '36px' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((category, index) => (
                                    <TableRow
                                        key={index}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}
                                        style={{ backgroundColor: hoveredRow === index ? '#f5f5f5' : 'transparent', cursor: 'pointer' }}
                                        onClick={() => {
                                            setSubCategoryNavigate(category.categoryId)
                                        }}
                                    >
                                        <TableCell component="th" scope="row" style={{ maxWidth: '15px', width: '15px' }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {category.categoryName}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex w-100 justify-end">
                                                <div onClick={() => { setCategoryUpdatePopUp(true); setCategoryUpdateData(category); setCategoryUpdateName(category.categoryName) }} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 border hover:bg-blue-600'>
                                                    <BorderColorIcon className='text-gray-600 table_icon2' />
                                                </div>
                                                <div onClick={() => handleDeleteCategory(category)} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600 border'>
                                                    <DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ) : (
                <div className="w-full flex justify-center">
                    <div className='text-center'>
                        <RestaurantMenuIcon className='restaurantMenu' />
                        <br />
                        <div className="text-2xl text-gray">
                            No Data Found
                        </div>
                    </div>
                </div>
            )
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <div className="bg-white w-full">
                            <div className="w-full mb-4 popHeading">Add Category</div>
                            <hr className='mb-4' />
                            <div className="flex mt-2 gap-4">
                                <div className="w-2/5">
                                    <TextField
                                        onChange={(e) => {
                                            setCategoryName(e.target.value);
                                            setFeildError(false);
                                        }}
                                        id="categoryName"
                                        label="Category Name"
                                        variant="outlined"
                                        autoComplete="off"
                                        value={categoryName}
                                        className="w-full col-span-3 mb-6"
                                        error={feildError ? true : false}
                                        helperText={feildError ? 'Category name cannot be empty' : ''}
                                        inputRef={autFocus}
                                    />
                                </div>
                                <div className="w-1/4">
                                    <button onClick={() => handleCreateCategory()} className="addCategorySaveBtn ml-4">Save</button>
                                </div>
                                <div className="w-1/4">
                                    <button onClick={() => { handleClose(); setCategoryName(''); setFeildError(false); }} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={categoryUpdatePopUp}
                onClose={handleClose}
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                closeAfterTransition
            >
                <Fade in={categoryUpdatePopUp}>
                    <Box sx={style}>
                        <div className="bg-white w-full">
                            <div className="w-full mb-4 popHeading">Edit Category</div>
                            <hr className='mb-4' />
                            <div className="flex mt-2 gap-4">
                                <div className="w-2/5">
                                    <TextField
                                        onChange={(e) => {
                                            setCategoryUpdateName(e.target.value);
                                            setFeildError(false);
                                        }}
                                        id="categoryName"
                                        label="Category Name"
                                        variant="outlined"
                                        autoComplete="off"
                                        value={categoryUpdateName}
                                        className="w-full col-span-3 mb-6"
                                        error={feildError ? true : false}
                                        helperText={feildError ? 'Category name cannot be empty' : ''}
                                        inputRef={autFocus}
                                    />
                                </div>
                                <div className="w-1/4">
                                    <button onClick={() => handleUpdateUnit()} className="addCategorySaveBtn ml-4">Save</button>
                                </div>
                                <div className="w-1/4">
                                    <button onClick={() => handleClose()} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default AddCategory;
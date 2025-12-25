/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
// import './css/Dashboard.css';
import { useState, useEffect, useRef } from "react";
import React from 'react';
import './css/FirmData.css'
import { BACKEND_BASE_URL } from '../../../url';
import { ToastContainer, toast } from 'react-toastify';
import Table from '@mui/material/Table';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
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

Fade.propTypes = {
    children: PropTypes.element.isRequired,
    in: PropTypes.bool,
    onClick: PropTypes.any,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
    ownerState: PropTypes.any,
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
    p: 4,
};
function FirmData() {
    useEffect(() => {
        getAllCategory();
    }, []);
    const getAllCategory = async () => {
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}billingrouter/getFirmData`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGetAllUnit(response.data)
        } catch (error) {
            setError(error?.response?.data || 'Network Error !!!...')
        }
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [tab, setTab] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false)
        setAddFirmData({
            firmName: '',
            gstNumber: '',
            address: '',
            pincode: '',
            mobileNo: '',
            otherMobileNo: ''
        })
        setIsEdit(false)
        setFromError(false)
    };
    const [getAllunit, setGetAllUnit] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [addFirmData, setAddFirmData] = useState({
        firmName: '',
        gstNumber: '',
        address: '',
        pincode: '',
        mobileNo: '',
        otherMobileNo: ''
    })
    const [formError, setFromError] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [firmId, setFirmId] = useState('')
    const autFocus = useRef(null)

    const handleOpen = () => { setOpen(true) };
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
    const token = localStorage.getItem('token')

    const [hoveredRow, setHoveredRow] = useState(null);
    const handleMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    const handleAddFirm = async () => {
        const formValidation = {
            firmName: typeof addFirmData.firmName === 'string' && addFirmData.firmName.trim().length === 0,
            address: typeof addFirmData.address === 'string' && addFirmData.address.trim().length === 0,
            pincode: typeof addFirmData.pincode === 'string' && addFirmData.pincode.trim().length === 0,
            mobileNo: typeof addFirmData.mobileNo === 'string' && addFirmData.mobileNo.trim().length === 0,
            gstNumber: typeof addFirmData.gstNumber === 'string' && addFirmData.gstNumber.trim().length === 0
        };

        setFromError(formValidation)

        if (Object.values(formValidation).some(field => field)) {
            setError('Please Fill All Fields');
            return;
        }
        let newData;
        let url;
        if (isEdit) {
            newData = {
                "firmId":firmId,
                "firmName": addFirmData.firmName,
                "gstNumber": addFirmData.gstNumber,
                "firmAddress": addFirmData.address,
                "pincode": addFirmData.pincode,
                "firmMobileNo": addFirmData.mobileNo,
                "otherMobileNo": addFirmData.otherMobileNo ? addFirmData.otherMobileNo : null
            }
            url =` ${BACKEND_BASE_URL}billingrouter/updateFirmData`
        }
        else {
            newData = {
                "firmName": addFirmData.firmName,
                "gstNumber": addFirmData.gstNumber,
                "firmAddress": addFirmData.address,
                "pincode": addFirmData.pincode,
                "firmMobileNo": addFirmData.mobileNo,
                "otherMobileNo": addFirmData.otherMobileNo ? addFirmData.otherMobileNo : null
            }
            url =` ${BACKEND_BASE_URL}billingrouter/addFirmData`
        }
        try {
            await axios.post(url, newData, config)
                .then((res) => {
                    console.log('Response', res.data)
                    setSuccess(res.data || true)
                    getAllCategory();
                    setAddFirmData({
                        firmName: '',
                        gstNumber: '',
                        address: '',
                        pincode: '',
                        mobileNo: '',
                        otherMobileNo: ''
                    })
                    setFromError(false)
                    if(isEdit){
                        setIsEdit(false)
                        handleClose();
                    }
                })
                .catch((error) => {
                    console.log('Error =>', error)
                    setError(true)
                })
        } catch (error) {
            console.log('Error', error)
            setError(error.response.data || 'Network Error')
        }
    }
    const handleEditItem = (data) => {
        setIsEdit(true)
        setOpen(true)
        setFirmId(data.firmId)
        setAddFirmData({
            firmName: data.firmName,
            gstNumber: data.gstNumber,
            address: data.firmAddress,
            pincode: data.pincode,
            mobileNo: data?.firmMobileNo,
            otherMobileNo: data?.otherMobileNo ? data.otherMobileNo : ''
        })
    }
    const handleDeleteFirm = async (id) => {
        try {
            await axios.delete(`${BACKEND_BASE_URL}billingrouter/removeFirmData?firmId=${id}`,config)
            .then((res) => {
                console.log(res.data)
                setSuccess(true)
                getAllCategory();
            })
            .catch((error) => {
                console.log('Error',error)
                setError(error.response.data || true)
            })
        } catch (error) {
            console.log('Error',error)
            setError(true)
        }
    }


    return (
        <div className='BilingDashboardContainer mx-4 p-3 '>
            <div className='grid grid-cols-12 mt-5'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  '>
                                <div className='grid grid-cols-12 pl-6 g h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === null || tab === '' || !tab ? 'productTabAll' : 'productTab'}`} >
                                        <div className='statusTabtext'>Firm Data</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3  h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={() => handleOpen()}>Add Firm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            {!getAllunit == [] ? (
                <TableContainer className='bg-white px-4 pt-6 border-none rounded-xl mt-7'>
                    <Table component={Paper}>
                        <TableHead>
                            <TableRow>
                                <TableCell className=''>No.</TableCell>
                                <TableCell >Name</TableCell>
                                <TableCell >Gst Number</TableCell>
                                <TableCell >Address</TableCell>
                                <TableCell >Pincode</TableCell>
                                <TableCell >Mobile No</TableCell>
                                <TableCell > OtherMobile No</TableCell>
                                <TableCell className='pr-9' align='right' style={{ paddingRight: '36px' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getAllunit && getAllunit.map((categoryName, index) => (
                                <TableRow
                                    key={index}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ backgroundColor: hoveredRow === index ? '#f5f5f5' : 'transparent', cursor: 'pointer' }}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" style={{ maxWidth: '15px', width: '15px' }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell component="th" scope="row"  >
                                        {categoryName.firmName}
                                    </TableCell>
                                    <TableCell component="th" scope="row"  >
                                        {categoryName.gstNumber}
                                    </TableCell>
                                    <TableCell component="th" scope="row"  >
                                        {categoryName.firmAddress}
                                    </TableCell>
                                    <TableCell component="th" scope="row"  >
                                        {categoryName.pincode}
                                    </TableCell>
                                    <TableCell component="th" scope="row"  >
                                        {categoryName.firmMobileNo}
                                    </TableCell>
                                    <TableCell component="th" scope="row"  >
                                        {categoryName.otherMobileNo}
                                    </TableCell>
                                    <TableCell component="th" scope="row" >
                                        <div className="flex w-100 justify-end">
                                            <div onClick={() => handleEditItem(categoryName)} className='rounded-lg border bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600'>
                                                <BorderColorIcon className='text-gray-600 table_icon2' />
                                            </div>
                                            <div onClick={() => handleDeleteFirm(categoryName.firmId)}  className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600 border'>
                                                <DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
            )}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableAutoFocus
            >
                <Box sx={style} className='addProdutModal'>
                    <div className="text-xl p-1">
                        {isEdit ? 'Edit' : 'Add'} Firm Data
                    </div>
                    <hr className='my-2 mb-4' />
                    <div className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-3">
                            <TextField
                                id="customerNumber"
                                label="Firm Name"
                                variant="outlined"
                                className='w-full'
                                value={addFirmData.firmName}
                                onChange={(e) => {
                                    setAddFirmData((prev) => ({
                                        ...prev,
                                        firmName: e.target.value
                                    }));
                                    setFromError((prev) => ({
                                        ...prev,
                                        firmName: false
                                    }))
                                }}
                                error={formError.firmName ? true : false}
                                helperText={formError.firmName ? 'Firm Name is Required' : ''}
                            />
                        </div>
                        <div className="col-span-3">
                            <TextField
                                id="customerName"
                                label="GST Number"
                                value={addFirmData.gstNumber}
                                variant="outlined"
                                className='w-full'
                                onChange={(e) => {
                                    setAddFirmData((prev) => ({
                                        ...prev,
                                        gstNumber: e.target.value
                                    }))
                                    setFromError((prev) => ({
                                        ...prev,
                                        gstNumber: false
                                    }))
                                }}
                                error={formError.gstNumber ? true : false}
                                helperText={formError.gstNumber ? 'GST Number is Required' : ''}
                            />
                        </div>
                        <div className="col-span-3">
                            <TextField
                                id="customerName"
                                label="Mobile Number"
                                variant="outlined"
                                className='w-full'
                                value={addFirmData.mobileNo}
                                onChange={(e) => {
                                    setAddFirmData((prev) => ({
                                        ...prev,
                                        mobileNo: e.target.value
                                    }))
                                    setFromError((prev) => ({
                                        ...prev,
                                        mobileNo: false
                                    }))
                                }}
                                error={formError.mobileNo ? true : false}
                                helperText={formError.mobileNo ? 'Mobile Number is Required' : ''}
                            />
                        </div>
                        <div className="col-span-3">
                            <TextField
                                id="customerName"
                                label="Other Mobile Number"
                                variant="outlined"
                                className='w-full'
                                value={addFirmData.otherMobileNo}
                                onChange={(e) => {
                                    setAddFirmData((prev) => ({
                                        ...prev,
                                        otherMobileNo: e.target.value
                                    }))
                                }}
                            />
                        </div>
                        <div className="col-span-5">
                            <TextField
                                id="outlined-basic"
                                label="Firm Address"
                                variant="outlined"
                                className="w-full"
                                value={addFirmData.address}
                                onChange={(e) => {
                                    setAddFirmData((prev) => ({
                                        ...prev,
                                        address: e.target.value
                                    }))
                                    setFromError((prev) => ({
                                        ...prev,
                                        address: false
                                    }))
                                }}
                                error={formError.address ? true : false}
                                helperText={formError.address ? 'Firm Address is Required' : ''}
                            />
                        </div>
                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                label="Pin Code"
                                variant="outlined"
                                className='w-full'
                                value={addFirmData.pincode}
                                onChange={(e) => {
                                    setAddFirmData((prev) => ({
                                        ...prev,
                                        pincode: e.target.value
                                    }))
                                    setFromError((prev) => ({
                                        ...prev,
                                        pincode: false
                                    }))
                                }}
                                error={formError.pincode ? true : false}
                                helperText={formError.pincode ? 'Pin Code is Required' : ''}
                            />
                        </div>
                    </div>
                    <div className="flex gap-9 mt-6 w-full mr-7 justify-end px-4">
                        <div className="w-1/5">
                            <button onClick={handleAddFirm} className="addCategorySaveBtn ml-4">{isEdit ? 'Edit' : 'Add'}</button>
                        </div>
                        <div className="w-1/5">
                            <button onClick={handleClose} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default FirmData;
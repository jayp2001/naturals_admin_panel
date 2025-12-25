import { Box, Divider, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { ToastContainer, toast } from 'react-toastify';
import Switch from '@mui/material/Switch';

import axios from 'axios';
import { BACKEND_BASE_URL } from '../../url';
import { useNavigate } from 'react-router-dom';

function DeliveryMan() {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
    };
    const regex = /^[0-9\b]+$/;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [addDeliveryManPopUp, setAddDeliveryManPopUp] = useState(false);
    const [deliveryManData, setDeliveryManData] = useState({
        name: '',
        shortName: '',
        mobileNo: ''
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        shortName: '',
        mobileNo: false
    });
    const [deliveryMenData, setDeliveryMenData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [totalRows, setTotalRows] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [editDeliveryManId, setEditDeliveryManId] = useState('');
    const [deliveryManStatus, setDeliveryManStatus] = useState()

    if (loading) {
        toast.loading("Please wait...", {
            toastId: 'loading'
        });
    }
    if (success) {
        toast.dismiss('loading');
        toast('Success!', {
            type: 'success',
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setSuccess(false);
        setTimeout(() => {
            setLoading(false);
        }, 50);
    }
    if (error) {
        setLoading(false);
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "top-right",
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

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const getDeliveryMenDetails = async (page, rowsPerPage) => {
        try {
            await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getDeliveryPersonList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
                .then((res) => {
                    setTotalRows(res.data.numRows);
                    setDeliveryMenData(res.data.rows);
                })
                .catch((error) => {
                    console.log('Error =>', error);
                    setError(error.response?.data || 'Network Error!!..');
                });
        } catch (error) {
            console.log('Error', error);
            setError(error.response?.data || 'Network Error!!..');
        }
    };
    const handleDelete = async (id) => {
        try {
            if (window.confirm('are you sure you want to delete this delivery man?')) {
                await axios.delete(`${BACKEND_BASE_URL}deliveryAndPickUprouter/removeDeliveryPerson?personId=${id}`, config)
                    .then((res) => {
                        console.log(res.data)
                        setSuccess(true)
                        setRowsPerPage(25);
                        setPage(0)
                        getDeliveryMenDetails(0, 25);
                    })
                    .catch((error) => {
                        console.log('Error', error)
                        setError(error.response.data || true)
                    })
            }
        } catch (error) {
            console.log('Error', error)
            setError(true)
        }
    }

    useEffect(() => {
        getDeliveryMenDetails(page, rowsPerPage);
    }, []);

    const handleCreateDeliveryManData = async () => {
        try {

            if ((!deliveryManData.name.trim() || !deliveryManData.shortName.toString().trim())) {
                const errors = {};
                if (!deliveryManData.name.trim()) {
                    errors.name = 'Name is required';
                }
                if (!deliveryManData.shortName.toString().trim()) {
                    errors.shortName = 'Short Name is required';
                }
                if ((deliveryManData.mobileNo && formErrors.mobileNo)) {
                    errors.mobileNo = true;
                }
                setFormErrors(prevErrors => ({
                    ...prevErrors,
                    ...errors,
                }));
                return;
            }
            let newData;
            let url;
            if (isEdit) {
                newData = {
                    personId: editDeliveryManId,
                    personName: deliveryManData.name,
                    shortName: deliveryManData.shortName,
                    mobileNo: deliveryManData.mobileNo,
                    isAvailable: true
                }
                url = `${BACKEND_BASE_URL}deliveryAndPickUprouter/updateDeliveryPerson`
            }
            else {
                newData = {
                    personName: deliveryManData.name,
                    shortName: deliveryManData.shortName,
                    mobileNo: deliveryManData.mobileNo,
                    isAvailable: true
                };
                url = `${BACKEND_BASE_URL}deliveryAndPickUprouter/addDeliveryPerson`
            }

            console.log('New Data', newData);
            if (!formErrors.mobileNo) {
                setLoading(true);
                await axios.post(url, newData, config)
                    .then((res) => {
                        setFormErrors({ name: '', shortName: '', mobileNo: false });
                        setLoading(false);
                        setSuccess(true);
                        setDeliveryManData({ name: '', shortName: '', mobileNo: '' });
                        setEditDeliveryManId('');
                        setIsEdit(false);
                        setFormErrors(false);
                        getDeliveryMenDetails(page, rowsPerPage);
                        if (isEdit) {
                            setIsEdit(false);
                            handleDeliveryManPopUpClose();
                        }
                    })
                    .catch((error) => {
                        console.log('Error', error);
                        setError(error.response?.data || 'Network Error!!..');
                    });
            }
        } catch (error) {
            console.error('Error =>', error);
            setError('Error occurred while creating delivery man data.');
        }
    };

    const handleDeliveryManPopUpClose = () => {
        setAddDeliveryManPopUp(false);
        setDeliveryManData({ name: '', shortName: '', mobileNo: '' });
        setEditDeliveryManId('');
        setIsEdit(false);
        setFormErrors(false);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getDeliveryMenDetails(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        getDeliveryMenDetails(0, newRowsPerPage);
    };

    const handleGetSingleDeliveryManData = async (data) => {
        try {
            setEditDeliveryManId(data.personId);
            setIsEdit(true);
            setDeliveryManData({
                name: data.personName,
                shortName: data.shortName,
                mobileNo: data.mobileNo ? data.mobileNo : ''
            });
            setAddDeliveryManPopUp(true);
        } catch (error) {
            console.log('Error', error);
            setError(error.response?.data || 'Network Error!!..');
        }
    }
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const handleSwitchChange = async (checked, deliveryManId, shortName, personName) => {
        window.confirm("Are you Sure You Want to Update");
        try {
            const updateData = {
                personId: deliveryManId,
                isAvailable: checked,
                shortName: shortName,
                personName: personName
            };
            const response = await axios.post(`${BACKEND_BASE_URL}deliveryAndPickUprouter/updateDeliveryPerson`, updateData, config);
            console.log('response', response.data)
            // setSuccess(true)
            getDeliveryMenDetails(page, rowsPerPage);
        } catch (error) {
            console.error('Error updating delivery man status:', error);
            setError(error.response?.data || 'Network Error');
            setLoading(false);
        }

    };
    const navigate = useNavigate()

    return (
        <div className='BilingDashboardContainer p-3'>
            <div className='col-span-12'>
                <div className='productTableSubContainer static'>
                    <div className='h-full grid grid-cols-12'>
                        <div className='h-fit col-span-12'>
                            <div className='flex px-6 gap-3 overflow-x-auto h-full w-full justify-between items-center' style={{ whiteSpace: 'nowrap' }}>
                                <div className="productTabAll pb-3">
                                    <div className="statusTabText w-48">
                                        Delivery Man List
                                    </div>
                                </div>
                                <div className="text-end">
                                    <button
                                        className='exportExcelBtn'
                                        onClick={() => {
                                            setAddDeliveryManPopUp(true)
                                        }}
                                    >Add Delivery Man</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 w-full">
                <div className='userTableSubContainer'>
                    <div className=''>
                        <TableContainer
                            component={Paper}
                            sx={{
                                borderBottomLeftRadius: '10px',
                                borderBottomRightRadius: '10px',
                                paddingLeft: '12px',
                                paddingRight: '12px',
                                paddingTop: '12px',
                                overflowY: 'auto',
                            }}
                        >
                            <Table aria-label="sticky table" sx={{ minWidth: 750, overflow: 'hidden' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell align="left">Name</TableCell>
                                        <TableCell align="left">Short Name</TableCell>
                                        <TableCell align="left">Delivery Rounds</TableCell>
                                        <TableCell align="left">Total Time</TableCell>
                                        <TableCell align="left">Mobile No.</TableCell>
                                        <TableCell align="right" style={{ paddingRight: '36px' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {deliveryMenData.map((deliveryMan, index) => (
                                        <TableRow key={index} className="tableRow cursor-pointer" hover>
                                            <TableCell
                                                onClick={() => {
                                                    navigate(`/DeliveryManagement/DeliveryManData/${deliveryMan.personId}/${deliveryMan.personName}`)
                                                }}
                                                style={{ maxWidth: '50px', width: '15px' }}>{index + 1}</TableCell>
                                            <TableCell
                                                onClick={() => {
                                                    navigate(`/DeliveryManagement/DeliveryManData/${deliveryMan.personId}/${deliveryMan.personName}`)
                                                }}
                                                align="left" style={{ maxWidth: '300px', width: '170px' }}>{deliveryMan.personName}</TableCell>
                                            <TableCell
                                                onClick={() => {
                                                    navigate(`/DeliveryManagement/DeliveryManData/${deliveryMan.personId}/${deliveryMan.personName}`)
                                                }}
                                                align="left" style={{ maxWidth: '300px', width: '170px' }}>{deliveryMan.shortName}</TableCell>
                                            <TableCell
                                                onClick={() => {
                                                    navigate(`/DeliveryManagement/DeliveryManData/${deliveryMan.personId}/${deliveryMan.personName}`)
                                                }}
                                                align="left">
                                                {deliveryMan.totalRound}
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                onClick={() => {
                                                    navigate(`/DeliveryManagement/DeliveryManData/${deliveryMan.personId}/${deliveryMan.personName}`)
                                                }}
                                            >
                                                {deliveryMan.totalTime}
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                onClick={() => {
                                                    navigate(`/DeliveryManagement/DeliveryManData/${deliveryMan.personId}/${deliveryMan.personName}`)
                                                }}
                                            >
                                                {deliveryMan.mobileNo}
                                            </TableCell>
                                            <TableCell align='right'>
                                                <div className="flex w-100 justify-end">
                                                    <Switch
                                                        checked={deliveryMan.isAvailable}
                                                        onChange={(e) => handleSwitchChange(e.target.checked, deliveryMan.personId, deliveryMan.shortName, deliveryMan.personName)}
                                                    />
                                                    <div
                                                        className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600'
                                                        onClick={() => handleGetSingleDeliveryManData(deliveryMan)}
                                                    >
                                                        <BorderColorIcon
                                                            className='text-gray-600 table_icon2' />
                                                    </div>
                                                    <div className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600' onClick={() => {
                                                        handleDelete(deliveryMan.personId);
                                                    }}><DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' /></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[25, 50, 10]}
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
                open={addDeliveryManPopUp}
                onClose={handleDeliveryManPopUpClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableAutoFocus
            >
                <Box sx={style} className='addProdutModal'>
                    <div className="text-xl p-1">
                        {isEdit ? 'Edit Delivery Man' : 'Add Delivery Man'}
                    </div>
                    <hr className='my-2 mb-4' />
                    <div className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-4">
                            <TextField
                                id="deliveryManName"
                                label="Name"
                                variant="outlined"
                                className='w-full'
                                value={deliveryManData.name}
                                onChange={(e) => {
                                    setDeliveryManData((prev) => ({
                                        ...prev,
                                        name: e.target.value
                                    }));
                                    setFormErrors(prevErrors => ({
                                        ...prevErrors,
                                        name: ''
                                    }));
                                }}
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                            />
                        </div>
                        <div className="col-span-4">
                            <TextField
                                id="deliveryManShortName"
                                label="Short Name"
                                variant="outlined"
                                className='w-full'
                                value={deliveryManData.shortName}
                                onChange={(e) => {
                                    setDeliveryManData((prev) => ({
                                        ...prev,
                                        shortName: e.target.value
                                    }));
                                    setFormErrors(prevErrors => ({
                                        ...prevErrors,
                                        shortName: ''
                                    }));
                                }}
                                error={!!formErrors.shortName}
                                helperText={formErrors.shortName}
                            />
                        </div>
                        <div className="col-span-4">
                            <TextField
                                id="deliveryManSxe"
                                label="Mobile No"
                                variant="outlined"
                                className='w-full'
                                value={deliveryManData.mobileNo}
                                // onBlur={(e) => {
                                //     if (!e.target.value) {
                                //         setFormErrors(prevErrors => ({
                                //             ...prevErrors,
                                //             mobileNo: e.target.value.length < 11
                                //         }));
                                //     }
                                // }}
                                onChange={(e) => {
                                    if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                        setDeliveryManData((prev) => ({
                                            ...prev,
                                            mobileNo: e.target.value
                                        }));
                                        setFormErrors(prevErrors => ({
                                            ...prevErrors,
                                            mobileNo: e.target.value.length == 0 ? false : e.target.value.length > 0 && e.target.value.length < 10 ? true : false
                                        }));

                                    }
                                    else {
                                        setFormErrors(prevErrors => ({
                                            ...prevErrors,
                                            mobileNo: false
                                        }));
                                    }
                                }
                                }
                                error={formErrors.mobileNo}
                                helperText={formErrors.mobileNo ? 'Enter Mobile No.' : ''}
                            />
                        </div>
                        <div className='col-span-7'>

                        </div>
                        <div className="flex gap-4  w-full justify-end pr-4 col-span-5">
                            <div className="w-full">
                                <button className="addCategorySaveBtn ml-4" onClick={handleCreateDeliveryManData}>{isEdit ? 'Edit' : 'Save'}</button>
                            </div>
                            <div className="w-full">
                                <button onClick={handleDeliveryManPopUpClose} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default DeliveryMan;

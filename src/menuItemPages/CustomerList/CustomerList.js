/* eslint-disable no-dupe-keys */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import './css/CustomerList.css';
import { useState, useEffect, useRef } from "react";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_BASE_URL } from '../../url';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Paper, Switch, TablePagination, IconButton, InputAdornment } from '@mui/material';
import { ReactTransliterate } from 'react-transliterate';
import 'react-toastify/dist/ReactToastify.css';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(1000px, 95vw)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

function CustomerList() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : undefined,
        },
    };

    const [customers, setCustomers] = useState([]);
    const [searchWord, setSearchWord] = useState('');
    const [page, setPage] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isGujarati, setIsGujarati] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        mobileNumber: '',
        customerName: '',
        birthDate: '',
        anniversaryDate: '',
        addressDetails: []
    });

    const [addressInput, setAddressInput] = useState({
        address: '',
        locality: ''
    });

    const [formValidation, setFormValidation] = useState({
        mobileNumber: false,
        customerName: false,
    });

    const autoFocus = useRef(null);

    useEffect(() => {
        fetchCustomers();
    }, [page, rowsPerPage]);

    useEffect(() => {
        if (open && autoFocus.current) {
            setTimeout(() => {
                autoFocus.current.focus();
            }, 100);
        }
    }, [open]);

    useEffect(() => {
        if (!loading) {
            toast.dismiss('loading');
        }
    }, [loading]);

    if (loading) {
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        toast.dismiss('loading');
        toast('success', {
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

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/getCustomerList?searchWord=&page=${page + 1}&numPerPage=${rowsPerPage}`,
                config
            );
            if (response.data) {
                const rows = response.data.rows || [];
                // Check if response contains "No Data Found" message
                if (rows.length > 0 && rows[0].msg === "No Data Found") {
                    setCustomers([]);
                    setTotalRows(0);
                } else {
                    setCustomers(rows);
                    setTotalRows(response.data.numRows || 0);
                }
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to fetch customers');
        }
    };

    const searchCustomers = async (searchTerm) => {
        setPage(0);
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/getCustomerList?searchWord=${searchTerm}&page=1&numPerPage=${rowsPerPage}`,
                config
            );
            if (response.data) {
                const rows = response.data.rows || [];
                // Check if response contains "No Data Found" message
                if (rows.length > 0 && rows[0].msg === "No Data Found") {
                    setCustomers([]);
                    setTotalRows(0);
                } else {
                    setCustomers(rows);
                    setTotalRows(response.data.numRows || 0);
                }
            }
        } catch (error) {
            console.error('Error searching customers:', error);
            setError('Failed to search customers');
        }
    };

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearchWord(value);

        // If search is cleared, reset data
        if (value === '') {
            setPage(0);
            fetchCustomers();
        }
    };

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
    };

    const handleSearch = () => {
        searchCustomers(document.getElementById('searchWord').value)
    };

    const debounceFunction = React.useCallback(debounce(handleSearch), []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpen = () => {
        setOpen(true);
        setEditData(null);
        setFormData({
            mobileNumber: '',
            customerName: '',
            birthDate: '',
            anniversaryDate: '',
            addressDetails: []
        });
        setAddressInput({
            address: '',
            locality: ''
        });
        setIsGujarati(false);
        setFormValidation({
            mobileNumber: false,
            customerName: false,
        });
    };

    const handleClose = () => {
        setOpen(false);
        setEditData(null);
        setFormData({
            mobileNumber: '',
            customerName: '',
            birthDate: '',
            anniversaryDate: '',
            addressDetails: []
        });
        setAddressInput({
            address: '',
            locality: ''
        });
        setIsGujarati(false);
    };

    const fetchCustomerDetails = async (customerId) => {
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/getCustomerDetailsById?customerId=${customerId}`,
                config
            );
            if (response.data) {
                const customerData = response.data;
                const formatDate = (isoDate) => {
                    if (!isoDate) return '';
                    const date = new Date(isoDate);
                    return date.toISOString().split('T')[0];
                };
                setEditData(customerData);
                setFormData({
                    mobileNumber: customerData.mobileNumber || '',
                    customerName: customerData.customerName || '',
                    birthDate: formatDate(customerData.birthDate),
                    anniversaryDate: formatDate(customerData.anniversaryDate),
                    addressDetails: customerData.addressDetails || []
                });
                setOpen(true);
            }
        } catch (error) {
            console.error('Error fetching customer details:', error);
            setError('Failed to fetch customer details');
        }
    };

    const handleEdit = (customer) => {
        fetchCustomerDetails(customer.customerId);
    };

    const handleAddAddress = () => {
        if (!addressInput.address.trim() && !addressInput.locality.trim()) {
            setError('Please enter address or locality');
            return;
        }

        const newAddress = {
            address: addressInput.address,
            locality: addressInput.locality
        };

        if (editData) {
            setEditData(prev => ({
                ...prev,
                addressDetails: [...(prev.addressDetails || []), newAddress]
            }));
            setFormData(prev => ({
                ...prev,
                addressDetails: [...(prev.addressDetails || []), newAddress]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                addressDetails: [...prev.addressDetails, newAddress]
            }));
        }

        setAddressInput({
            address: '',
            locality: ''
        });
    };

    const handleRemoveAddress = (index) => {
        if (editData) {
            setEditData(prev => ({
                ...prev,
                addressDetails: prev.addressDetails.filter((_, i) => i !== index)
            }));
            setFormData(prev => ({
                ...prev,
                addressDetails: prev.addressDetails.filter((_, i) => i !== index)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                addressDetails: prev.addressDetails.filter((_, i) => i !== index)
            }));
        }
    };

    const handleUpdateAddress = (index, field, value) => {
        const updatedAddresses = [...(editData ? editData.addressDetails : formData.addressDetails)];
        updatedAddresses[index] = {
            ...updatedAddresses[index],
            [field]: value
        };

        if (editData) {
            setEditData(prev => ({
                ...prev,
                addressDetails: updatedAddresses
            }));
            setFormData(prev => ({
                ...prev,
                addressDetails: updatedAddresses
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                addressDetails: updatedAddresses
            }));
        }
    };

    const validateForm = () => {
        const errors = {
            mobileNumber: !formData.mobileNumber.trim(),
            customerName: !formData.customerName.trim(),
        };

        setFormValidation(errors);
        return !Object.values(errors).some(error => error);
    };

    const formatDateForAPI = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setError('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                mobileNumber: formData.mobileNumber,
                customerName: formData.customerName,
                birthDate: formatDateForAPI(formData.birthDate),
                anniversaryDate: formatDateForAPI(formData.anniversaryDate),
                addressDetails: formData.addressDetails
            };

            if (editData) {
                payload.customerId = editData.customerId;
                // Format addresses: keep addressId for existing addresses, remove for new ones
                payload.addressDetails = formData.addressDetails.map(addr => {
                    if (addr.addressId) {
                        // Existing address - keep addressId even if edited
                        return {
                            addressId: addr.addressId,
                            address: addr.address,
                            locality: addr.locality
                        };
                    } else {
                        // New address - no addressId
                        return {
                            address: addr.address,
                            locality: addr.locality
                        };
                    }
                });
                await axios.post(
                    `${BACKEND_BASE_URL}billingrouter/updateCustomerData`,
                    payload,
                    config
                );
                setSuccess(true);
            } else {
                await axios.post(
                    `${BACKEND_BASE_URL}billingrouter/addCustomerData`,
                    payload,
                    config
                );
                setSuccess(true);
            }

            setTimeout(() => {
                handleClose();
                fetchCustomers();
            }, 800);
        } catch (error) {
            setLoading(false);
            console.error('Error saving customer:', error);
            setError(editData ? 'Failed to update customer' : 'Failed to add customer');
        }
    };

    const handleDeleteCustomer = async (customerId, customerName) => {
        if (window.confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
            try {
                setLoading(true);
                await axios.delete(
                    `${BACKEND_BASE_URL}billingrouter/removeCustomeData?customerId=${customerId}`,
                    config
                );
                setSuccess(true);
                setTimeout(() => {
                    setPage(0);
                    fetchCustomers();
                }, 800);
            } catch (error) {
                setLoading(false);
                console.error('Error deleting customer:', error);
                setError('Failed to delete customer');
            }
        }
    };

    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    return (
        <div className='BilingDashboardContainer mx-4 p-3'>
            <ToastContainer />
            <div className='grid grid-cols-12 mt-5'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7'>
                                <div className='grid grid-cols-12 pl-6 h-full'>
                                    <div className='flex col-span-3 justify-center productTabAll'>
                                        <div className='statusTabtext'>Customer List</div>
                                    </div>
                                </div>
                            </div>
                            <div className='grid col-span-2 col-start-11 pr-3 h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={handleOpen}>Add Customer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Table in White Card */}
            <div className='col-span-12 mt-4'>
                <div className='userTableSubContainerCustomerList'>
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
                                placeholder="Search by name or mobile..."
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                                    style: { fontSize: 14 }
                                }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='tableContainerWrapper'>
                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Customer Name</TableCell>
                                        <TableCell>Mobile Number</TableCell>
                                        <TableCell>Birth Date</TableCell>
                                        <TableCell>Anniversary Date</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {totalRows > 0 && customers.length > 0 ? (
                                        customers.map((customer, index) => (
                                            <TableRow
                                                key={customer.customerId}
                                                hover
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => navigate(`/customerList/customerDetail/${customer.customerId}`)}
                                            >
                                                <TableCell>
                                                    {searchWord ? (index + 1) : (index + 1) + (page * rowsPerPage)}
                                                </TableCell>
                                                <TableCell>{customer.customerName}</TableCell>
                                                <TableCell>{customer.customerMobileNumber}</TableCell>
                                                <TableCell>
                                                    {customer.birthDate
                                                        ? new Date(customer.birthDate).toLocaleDateString('en-GB')
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {customer.anniversaryDate
                                                        ? new Date(customer.anniversaryDate).toLocaleDateString('en-GB')
                                                        : '-'}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(customer);
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
                                                            <BorderColorIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteCustomer(customer.customerId, customer.customerName);
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
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" style={{ fontSize: "18px" }}>
                                                No Data Found...!
                                            </TableCell>
                                        </TableRow>
                                    )}
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

            {/* Add/Edit Customer Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle} className='addProdutModal'>
                    <div className='flex justify-between items-center mb-3'>
                        <div className='text-xl p-1 font-semibold'>
                            {editData ? 'Edit Customer' : 'Add Customer'}
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className={`text-sm ${!isGujarati ? 'font-bold text-blue-600' : 'text-gray-400'}`}>EN</span>
                            <Switch
                                checked={isGujarati}
                                onChange={(e) => setIsGujarati(e.target.checked)}
                                size="small"
                            />
                            <span className={`text-sm ${isGujarati ? 'font-bold text-blue-600' : 'text-gray-400'}`}>ગુજ</span>
                        </div>
                    </div>

                    {/* Customer Details Section */}
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <TextField
                                size='small'
                                label="Mobile Number"
                                variant="outlined"
                                className='w-full'
                                error={formValidation.mobileNumber}
                                helperText={formValidation.mobileNumber ? 'Mobile number is required' : ''}
                                value={formData.mobileNumber}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{0,10}$/.test(value)) {
                                        setFormData({ ...formData, mobileNumber: value });
                                        setFormValidation({ ...formValidation, mobileNumber: false });
                                    }
                                }}
                                autoComplete="off"
                                inputRef={autoFocus}
                            />
                        </div>

                        <div className="col-span-6">
                            {isGujarati ? (
                                <div className="relative">
                                    <ReactTransliterate
                                        value={formData.customerName}
                                        onChangeText={(text) => {
                                            setFormData({ ...formData, customerName: text });
                                            setFormValidation({ ...formValidation, customerName: false });
                                        }}
                                        className='ao-rtl-input'
                                        placeholder='ગ્રાહક નામ'
                                        lang='gu'
                                    />
                                    {formValidation.customerName && (
                                        <div className="text-red-500 text-xs mt-1">Customer name is required</div>
                                    )}
                                </div>
                            ) : (
                                <TextField
                                    size='small'
                                    label="Customer Name"
                                    variant="outlined"
                                    className='w-full'
                                    error={formValidation.customerName}
                                    helperText={formValidation.customerName ? 'Customer name is required' : ''}
                                    value={formData.customerName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, customerName: e.target.value });
                                        setFormValidation({ ...formValidation, customerName: false });
                                    }}
                                    autoComplete="off"
                                />
                            )}
                        </div>

                        <div className="col-span-6">
                            <TextField
                                size='small'
                                label="Birth Date"
                                type="date"
                                variant="outlined"
                                className='w-full'
                                InputLabelProps={{ shrink: true }}
                                value={formData.birthDate}
                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            />
                        </div>

                        <div className="col-span-6">
                            <TextField
                                size='small'
                                label="Anniversary Date"
                                type="date"
                                variant="outlined"
                                className='w-full'
                                InputLabelProps={{ shrink: true }}
                                value={formData.anniversaryDate}
                                onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="text-lg p-1 mt-5 font-semibold mb-3">Add Address</div>

                    <div className='grid grid-cols-12 gap-4 mt-1'>
                        <div className='col-span-5'>
                            {isGujarati ? (
                                <ReactTransliterate
                                    value={addressInput.address}
                                    onChangeText={(text) => setAddressInput({ ...addressInput, address: text })}
                                    className='ao-rtl-input'
                                    placeholder='સરનામું'
                                    lang='gu'
                                />
                            ) : (
                                <TextField
                                    size='small'
                                    label="Address"
                                    variant="outlined"
                                    className='w-full'
                                    value={addressInput.address}
                                    onChange={(e) => setAddressInput({ ...addressInput, address: e.target.value })}
                                    autoComplete="off"
                                />
                            )}
                        </div>

                        <div className='col-span-5'>
                            {isGujarati ? (
                                <ReactTransliterate
                                    value={addressInput.locality}
                                    onChangeText={(text) => setAddressInput({ ...addressInput, locality: text })}
                                    className='ao-rtl-input'
                                    placeholder='વિસ્તાર'
                                    lang='gu'
                                />
                            ) : (
                                <TextField
                                    size='small'
                                    label="Locality"
                                    variant="outlined"
                                    className='w-full'
                                    value={addressInput.locality}
                                    onChange={(e) => setAddressInput({ ...addressInput, locality: e.target.value })}
                                    autoComplete="off"
                                />
                            )}
                        </div>

                        <div className='col-span-2 flex items-center'>
                            <button onClick={handleAddAddress} className='addCategorySaveBtn ao-compact-btn w-full'>Add</button>
                        </div>
                    </div>

                    {/* Address List */}
                    {(editData ? editData.addressDetails : formData.addressDetails)?.length > 0 && (
                        <div className='mt-6'>
                            <div className='text-lg font-semibold p-1 mb-2'>Saved Addresses</div>

                            <div style={{
                                maxHeight: '45vh',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                border: '1px solid #e5e7eb',
                                borderRadius: 8,
                            }}>
                                <div
                                    className='px-3 py-2 sticky top-0 bg-white'
                                    style={{
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'grid',
                                        gridTemplateColumns: '40px 4fr 3fr 2fr',
                                        columnGap: '12px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div className='text-xs font-semibold text-gray-600 text-center'>#</div>
                                    <div className='text-xs font-semibold text-gray-600'>Address</div>
                                    <div className='text-xs font-semibold text-gray-600'>Locality</div>
                                    <div className='text-xs font-semibold text-gray-600 text-center'>Remove</div>
                                </div>

                                {(editData ? editData.addressDetails : formData.addressDetails).map((addr, index) => (
                                    <div
                                        key={index}
                                        className='px-3 py-3'
                                        style={{
                                            borderBottom: '1px solid #f3f4f6',
                                            display: 'grid',
                                            gridTemplateColumns: '40px 4fr 3fr 2fr',
                                            columnGap: '12px',
                                            alignItems: 'center',
                                            minWidth: 0
                                        }}
                                    >
                                        <div className='text-center'>{index + 1}</div>
                                        <div style={{ minWidth: 0 }}>
                                            {isGujarati ? (
                                                <ReactTransliterate
                                                    value={addr.address || ''}
                                                    onChangeText={(text) => handleUpdateAddress(index, 'address', text)}
                                                    className='ao-rtl-input'
                                                    placeholder='સરનામું'
                                                    lang='gu'
                                                />
                                            ) : (
                                                <TextField
                                                    size='small'
                                                    label=''
                                                    placeholder='Address'
                                                    variant='outlined'
                                                    className='w-full'
                                                    value={addr.address || ''}
                                                    onChange={(e) => handleUpdateAddress(index, 'address', e.target.value)}
                                                    inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                                />
                                            )}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            {isGujarati ? (
                                                <ReactTransliterate
                                                    value={addr.locality || ''}
                                                    onChangeText={(text) => handleUpdateAddress(index, 'locality', text)}
                                                    className='ao-rtl-input'
                                                    placeholder='વિસ્તાર'
                                                    lang='gu'
                                                />
                                            ) : (
                                                <TextField
                                                    size='small'
                                                    label=''
                                                    placeholder='Locality'
                                                    variant='outlined'
                                                    className='w-full'
                                                    value={addr.locality || ''}
                                                    onChange={(e) => handleUpdateAddress(index, 'locality', e.target.value)}
                                                    inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                                />
                                            )}
                                        </div>
                                        <div className='flex items-center justify-center'>
                                            <button className='rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-red-600 hover:text-white' onClick={() => handleRemoveAddress(index)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='flex gap-9 mt-6 w-full mr-7 justify-end px-4'>
                        <div className='w-1/5'>
                            <button onClick={handleSubmit} className='addCategorySaveBtn ao-compact-btn ml-4 w-full'>Save</button>
                        </div>
                        <div className='w-1/5'>
                            <button onClick={handleClose} className='addCategoryCancleBtn ao-compact-btn ml-4 bg-gray-700 w-full'>Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default CustomerList;


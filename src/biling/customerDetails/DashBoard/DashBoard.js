import { Box, Divider, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import './css/DashBoard.css';
import React, { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_BASE_URL } from '../../../url';

dayjs.extend(customParseFormat);

function Dashboard() {
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
  var customParseFormat = require('dayjs/plugin/customParseFormat')
  dayjs.extend(customParseFormat)
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [addCustomerPopUp, setAddCustomerPopUp] = useState(false)
  const [tempAddressDetails, setTempAddressDetails] = useState({
    address: '',
    locality: ''
  })
  const [addressFeilds, setAddressFeilds] = useState([])
  const [customerData, setCustomerData] = useState({
    customerNumber: '',
    customerName: '',
    anyVersaryDate: '',
    birthDate: '',
    addressList: []
  })
  const [formErrors, setFormErrors] = useState({
    customerNumber: '',
    customerName: ''
  });
  const [customersData, setCustomersData] = useState([])
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRows, setTotalRows] = useState(0);
  const [isEdit, setIsEdit] = useState(false)
  const [editCustomerId, setEditCustomerId] = useState('')

  const numberRegex = /^[0-9]*$/;
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
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  useEffect(() => {
    getCustomerDetails(page, rowsPerPage);
  }, [])
  const getCustomerDetails = async (page, rowsPerPage) => {
    try {
      await axios.get(`${BACKEND_BASE_URL}billingrouter/getCustomerList?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
        .then((res) => {
          setTotalRows(res.data.numRows)
          setCustomersData(res.data.rows)
        })
        .catch((error) => {
          console.log('Error =>', error)
          setError(error.respose.data || 'Network Error!!..')
        })
    } catch (error) {
      console.log('Error', error);
      setError(error.respose.data || 'Network Error!!..')
    }
  };

  const addAddressFeilds = () => {
    setFormErrors({ tempAddress: null, tempLocality: null });
    if (!tempAddressDetails.address?.trim() || !tempAddressDetails.locality?.trim()) {
      const errors = {};
      if (!tempAddressDetails.address?.trim()) {
        errors.tempAddress = 'Customer Address is required';
      }
      if (!tempAddressDetails.locality?.trim()) {
        errors.tempLocality = 'Locality is required';
      }
      setFormErrors(prevErrors => ({
        ...prevErrors,
        ...errors
      }));
      return;
    }
    const tempAddress = tempAddressDetails?.address;
    const tempLocality = tempAddressDetails?.locality
    const newAddressField = {
      address: tempAddress,
      locality: tempLocality
    };
    setAddressFeilds(prevAddressFields => [...prevAddressFields, newAddressField]);
    setTempAddressDetails({ address: '', locality: '' })
  }

  const handleDeleteAddressFeilds = (index) => {
    const filteredData = addressFeilds.filter((_, i) => i !== index);
    console.log('After Deleting Data', filteredData)
    setAddressFeilds(filteredData)
  }
  const handleBirthDateChange = (date) => {
    console.log("Birth Date", date && date['$d'] ? date['$d'] : null)
    setCustomerData((prev) => ({
      ...prev,
      birthDate: date && date['$d'] ? date['$d'] : null
    }))
  };
  const handleAniversaryDateChange = (date) => {
    console.log("Aniversary Date", date && date['$d'] ? date['$d'] : null)
    setCustomerData((prev) => ({
      ...prev,
      anyVersaryDate: date && date['$d'] ? date['$d'] : null
    }))
  };
  const handleCreateCustomerData = async () => {
    try {
      setFormErrors({ customerNumber: '', customerName: '' });
      if (!customerData.customerName.trim() || !customerData.customerNumber.toString().trim()) {
        const errors = {};
        if (!customerData.customerName.trim()) {
          errors.customerName = 'Customer Name is required';
        }
        if (!customerData.customerNumber.toString().trim()) {
          errors.customerNumber = 'Customer Number is required';
        }
        setFormErrors(prevErrors => ({
          ...prevErrors,
          ...errors
        }));
        return;
      }
      const birthDateFormatted = customerData.birthDate ? dayjs(customerData.birthDate).format('MMM DD YYYY') : null;
      const anniversaryDateFormatted = customerData.anyVersaryDate ? dayjs(customerData.anyVersaryDate).format('MMM DD YYYY') : null;
      let newData;
      let url;
      if (isEdit) {
        newData = {
          customerId: editCustomerId,
          customerName: customerData.customerName,
          mobileNumber: customerData.customerNumber,
          birthDate: birthDateFormatted,
          anniversaryDate: anniversaryDateFormatted,
          addressDetails: addressFeilds
        }
        url = `${BACKEND_BASE_URL}billingrouter/updateCustomerData`
      }
      else {
        newData = {
          customerName: customerData.customerName,
          mobileNumber: customerData.customerNumber,
          birthDate: birthDateFormatted,
          anniversaryDate: anniversaryDateFormatted,
          addressDetails: addressFeilds
        };
        url = `${BACKEND_BASE_URL}billingrouter/addCustomerData`
      }

      console.log('New Data', newData);
      setLoading(true)

      await axios.post(url, newData, config)
        .then((res) => {
          setLoading(false)
          setSuccess(true)
          console.log('Response', res.data);
          setAddressFeilds([])
          setTempAddressDetails({ address: null, locality: null })
          setCustomerData({
            customerNumber: '',
            customerName: '',
            anyVersaryDate: '',
            birthDate: '',
            addressList: []
          })
          setEditCustomerId('')
          setIsEdit(false)
          setFormErrors(false)
          getCustomerDetails(page, rowsPerPage)
          if (isEdit) {
            setIsEdit(false)
            handleCuastomerDataAddingPopUpClose();
          }
        })
        .catch((error) => {
          console.log('Error', error);
          setError(error.respose.data || 'Network Error!!..')
        });
    } catch (error) {
      console.error('Error =>', error);
      setError('Error occurred while creating customer data.');
    }
  };

  const handleCuastomerDataAddingPopUpClose = () => {
    setAddCustomerPopUp(false)
    setAddressFeilds([])
    setTempAddressDetails({ address: null, locality: null })
    setCustomerData({
      customerNumber: '',
      customerName: '',
      anyVersaryDate: '',
      birthDate: '',
      addressList: []
    })
    setEditCustomerId('')
    setIsEdit(false)
    setFormErrors(false)
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getCustomerDetails(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    getCustomerDetails(0, newRowsPerPage);
  };

  const handleGetSingleCustomerData = async (id) => {
    try {
      setEditCustomerId(id)
      setIsEdit(true)
      console.log('Customer Id', id);
      await axios.get(`${BACKEND_BASE_URL}billingrouter/getCustomerDetailsById?customerId=${id}`, config)
        .then((res) => {
          setAddCustomerPopUp(true);
          const customer = res.data;
          setCustomerData({
            customerNumber: customer.customerMobileNumber,
            customerName: customer.customerName,
            anyVersaryDate: customer.anniversaryDate === null ? '' : dayjs(customer.anniversaryDate),
            birthDate: customer.birthDate === null ? '' : dayjs(customer.birthDate),
            addressList: customer.addressDetails
          });
          setAddressFeilds(customer.addressDetails || []);
          console.log('Single CustomerData', customer);
        })
        .catch((error) => {
          console.log('Error', error);
          setError(error.response?.data || 'Network Error!!..');
        });
    } catch (error) {
      console.log('Error', error);
      setError(error.response?.data || 'Network Error!!..');
    }
  }
  const handleChangeAddress = (index, value) => {
    setAddressFeilds(prev => {
      const updatedFields = [...prev];
      updatedFields[index] = { ...updatedFields[index], address: value };
      return updatedFields;
    });
  };
  const handleChangeLocality = (index, value) => {
    setAddressFeilds(prev => {
      const updatedFields = [...prev];
      updatedFields[index] = { ...updatedFields[index], locality: value };
      return updatedFields;
    });
  };


  return (
    <div className='BilingDashboardContainer p-3'>
      <div className='col-span-12'>
        <div className='productTableSubContainer static'>
          <div className='h-full grid grid-cols-12'>
            <div className='h-fit col-span-12'>
              <div className='flex px-6 gap-3 overflow-x-auto h-full w-full justify-between items-center' style={{ whiteSpace: 'nowrap' }}>
                <div className="productTabAll pb-3">
                  <div className="statusTabText w-48">
                    Customer's List
                  </div>
                </div>
                <div className="text-end">
                  <button
                    className='exportExcelBtn'
                    onClick={() => {
                      setAddCustomerPopUp(true)
                    }}
                  >Add Customer</button>
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
                    <TableCell align="left">Customer Number</TableCell>
                    <TableCell align="left">Customer Name</TableCell>
                    <TableCell align="right" style={{ paddingRight: '36px' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customersData.map((customer, index) => (
                    <TableRow key={index} className="tableRow" hover>
                      <TableCell style={{ maxWidth: '50px', width: '15px' }}>{index + 1}</TableCell>
                      <TableCell align="left" style={{ maxWidth: '300px', width: '170px' }}>{customer.customerMobileNumber}</TableCell>
                      <TableCell align="left">{customer.customerName}</TableCell>
                      <TableCell align='right'>
                        <div className="flex w-100 justify-end">
                          <div
                            className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600'
                            onClick={() => handleGetSingleCustomerData(customer.customerId)}
                          >
                            <BorderColorIcon
                              className='text-gray-600 table_icon2' />
                          </div>
                          {/* <div className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600'><DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' /></div> */}
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
        open={addCustomerPopUp}
        onClose={handleCuastomerDataAddingPopUpClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus
      >
        <Box sx={style} className='addProdutModal'>
          <div className="text-xl p-1">
            {isEdit ? 'Edit Customer Details' : 'Add Customer Details'}
          </div>
          <hr className='my-2 mb-4' />
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-2">
              <TextField
                id="customerNumber"
                label="Customer Number"
                variant="outlined"
                className='w-full'
                value={customerData.customerNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!numberRegex.test(value)) {
                    return;
                  }

                  setCustomerData((prev) => ({
                    ...prev,
                    customerNumber: value
                  }));
                  setFormErrors(prevErrors => ({
                    ...prevErrors,
                    customerNumber: ''
                  }));
                }}
                error={!!formErrors.customerNumber}
                helperText={formErrors.customerNumber ? formErrors.customerNumber : ''}
              />
            </div>
            <div className="col-span-4">
              <TextField
                id="customerName"
                label="Customer Name"
                variant="outlined"
                className='w-full'
                value={customerData.customerName}
                onChange={(e) => {
                  setCustomerData((prev) => ({
                    ...prev,
                    customerName: e.target.value
                  }));
                  setFormErrors(prevErrors => ({
                    ...prevErrors,
                    customerName: ''
                  }));
                }}
                error={!!formErrors.customerName}
                helperText={formErrors.customerName}
              />
            </div>
            <div className="col-span-3">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
              >
                <DesktopDatePicker
                  textFieldStyle={{ width: '100%' }}
                  className='w-full'
                  InputProps={{ style: { fontSize: 14, width: '100%' } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                  label="Birth Date"
                  format="DD/MM/YYYY"
                  required
                  value={customerData?.birthDate ? customerData?.birthDate : null}
                  onChange={handleBirthDateChange}
                  name="stockInDate"
                  renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                />
              </LocalizationProvider>
            </div>
            <div className="col-span-3">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
              >
                <DesktopDatePicker
                  textFieldStyle={{ width: '100%' }}
                  className='w-full'
                  InputProps={{ style: { fontSize: 14, width: '100%' } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                  label="Aniversary Date"
                  format="DD/MM/YYYY"
                  required
                  value={customerData?.anyVersaryDate ? customerData?.anyVersaryDate : null}
                  onChange={handleAniversaryDateChange}
                  name="stockInDate"
                  renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="text-xl p-1 my-3">
            Add Customer Address
          </div>
          <hr className='my-2 mb-4' />
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 grid gap-6 grid-cols-12 items-start">
              <div className="col-span-5">
                <TextField
                  id="outlined-basic"
                  label="Customer Address"
                  variant="outlined"
                  value={tempAddressDetails.address}
                  className='w-full'
                  onChange={(e) => {
                    setTempAddressDetails((prev) => ({
                      ...prev,
                      address: e.target.value
                    }));
                    setFormErrors({
                      ...formErrors,
                      tempAddress: ''
                    })
                  }}
                  error={formErrors.tempAddress ? true : false}
                  helperText={formErrors.tempAddress ? 'Address is Needed' : ''}
                />
              </div>
              <div className="col-span-5">
                <TextField
                  id="outlined-basic"
                  label="Locality"
                  variant="outlined"
                  className='w-full'
                  value={tempAddressDetails.locality}
                  onChange={(e) => {
                    setTempAddressDetails((prev) => ({
                      ...prev,
                      locality: e.target.value
                    }))
                  }}
                />
              </div>
              <div className="col-span-1">
                <div className="w-full">
                  <button className="addCategorySaveBtn " onClick={addAddressFeilds}><AddIcon /></button>
                </div>
              </div>
            </div>
            {addressFeilds && addressFeilds.length > 0 ? (
              <>
                {addressFeilds && addressFeilds.map((val, index) => (
                  <div className="col-span-12 grid gap-6 grid-cols-12 items-center">
                    <div className="col-span-5">
                      <TextField
                        id="outlined-basic"
                        label="Customer Address"
                        variant="outlined"
                        className='w-full'
                        value={val?.address}
                        onChange={(e) => {
                          handleChangeAddress(index, e.target.value)
                        }}
                      />
                    </div>
                    <div className="col-span-5">
                      <TextField
                        id="outlined-basic"
                        label="Locality"
                        variant="outlined"
                        className='w-full'
                        value={val?.locality}
                        onChange={(e) => {
                          handleChangeLocality(index, e.target.value)
                        }}
                      />
                    </div>

                    <div className="col-span-1">
                      <button className="addCategorySaveBtn DeleteButton " onClick={() => handleDeleteAddressFeilds(index)}><DeleteOutlineOutlinedIcon /></button>
                    </div>
                  </div>
                ))}
              </>
            ) :
              (<></>)
            }
          </div>
          <div className="flex gap-9 mt-6 w-full mr-7 justify-end px-4">
            <div className="w-1/5">
              <button className="addCategorySaveBtn ml-4" onClick={handleCreateCustomerData}>{isEdit ? 'Edit' : 'Save'}</button>
            </div>
            <div className="w-1/5">
              <button onClick={handleCuastomerDataAddingPopUpClose} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
            </div>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
    </div >
  );
}

export default Dashboard;

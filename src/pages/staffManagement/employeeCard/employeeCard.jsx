import { Tooltip } from '@mui/material';
import './employeeCard.css';
import Menutemp from './menu';
import { BACKEND_BASE_URL } from '../../../url';
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from "react-router-dom";
const styleStockIn = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
function EmployeeCard(props) {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [open, setOpen] = useState(false);
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const handlePaymentData = (date) => {
        props.setFormData((prevState) => ({
            ...prevState,
            ["amountDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    console.log('>>LLKK', props.data.employeeStatus == 1 ? true : false)
    const [toggel, setToggel] = useState(props.data.employeeStatus == 1 ? true : false)
    const handleEdit = () => {
        props.handleEditEmployee(props.data.employeeId)
    }
    const handleDelete = () => {
        props.handleDeleteEmployee(props.data.employeeId);
    }
    const handleViewDetail = () => {
        navigate(`/staff/employeeDetail/${props.data.employeeId}`)
    }
    const handleOpenInactive = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getMidMonthInActiveSalaryOfEmployee?employeeId=${props.data.employeeId}`, config)
            .then((res) => {
                props.setFormData((perv) => ({
                    ...perv,
                    employeeId: props.data.employeeId,
                    nickName: props.data.nickName,
                    paymentDue: props.data.paymentDue + res.data.proratedSalary,
                    totalSalary: props.data.totalSalary + res.data.proratedSalary,
                    advanceAmount: props.data.advanceAmount,
                    fineAmount: props.data.fineAmount,
                    proratedSalary: res.data.proratedSalary,
                    dateOfPayment: res.data.dateOfPayment
                }))
                setOpen(true);
            })
            .catch((error) => {
                props.setLoading(false);
                props.setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleToggel = async () => {
        let data = props.formData;
        console.log('statsusss', toggel)
        // props.handleActiveInactive(props.data, props.index)
        if (toggel) {
            // setToggel(false)
            handleOpenInactive()
        } else {
            if (window.confirm('Are you sure you want to Active employee ...?')) {
                data = {
                    employeeId: props.data.employeeId,
                    employeeStatus: true,
                    payStatus: false
                }
                props.setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeStatus`, data, config)
                    .then((res) => {
                        props.setLoading(false);
                        props.setSuccess(true);
                        setOpen(false)
                        // setToggel(true)
                        props.handleClose();
                        setTimeout(() => {
                            props.getCategory();
                            props.activeCategory == 9999 ? props.getEmployeeListInactive('') : props.getEmployeeList(props.activeCategory);
                        }, 50)

                    })
                    .catch((error) => {
                        props.setLoading(false);
                        props.setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    })
            }
        }
    }
    const makeInActive = async (mode) => {
        if (window.confirm('Are you sure you want to Inactive employee ...?')) {
            let data = props.formData;
            if (props.loading || props.success) {

            } else {
                if (mode) {
                    const isValidate = props.formDataErrorFeild.filter(element => {
                        if (props.formDataError[element] === true || props.formData[element] === '') {
                            props.setFormDataError((perv) => ({
                                ...perv,
                                [element]: true
                            }))
                            return element;
                        }
                    })
                    console.log('????', isValidate);
                    if (isValidate.length > 0) {
                        props.setError(
                            "Please Fill All Field"
                        )
                    } else {
                        data = {
                            ...data,
                            payStatus: true,
                            employeeStatus: false
                        }
                        props.setLoading(true);
                        await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeStatus`, data, config)
                            .then((res) => {
                                props.setLoading(false);
                                props.setSuccess(true);
                                props.handleClose();
                                setOpen(false)
                                // setToggel(false)
                                setTimeout(() => {
                                    props.getCategory();
                                    props.activeCategory == 9999 ? props.getEmployeeListInactive('') : props.getEmployeeList(props.activeCategory);
                                }, 50)

                            })
                            .catch((error) => {
                                props.setLoading(false);
                                props.setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                            })
                    }
                }
                else {
                    data = {
                        ...data,
                        payStatus: false,
                        employeeStatus: false
                    }
                    props.setLoading(true);
                    await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeStatus`, data, config)
                        .then((res) => {
                            props.setLoading(false);
                            props.setSuccess(true);
                            setOpen(false)
                            // setToggel(false)
                            props.handleClose();
                            setTimeout(() => {
                                props.getCategory();
                                props.activeCategory == 9999 ? props.getEmployeeListInactive('') : props.getEmployeeList(props.activeCategory);
                            }, 50)

                        })
                        .catch((error) => {
                            props.setLoading(false);
                            props.setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                        })
                }
            }
        }
    }
    console.log(">>>", parseFloat(''))
    const label = { inputProps: { 'aria-label': 'Size switch demo' } };
    return (
        <div className='employeeCard' key={props.data.category + props.data.employeeId + 'employeeCard'}>
            <div className='flex h-full'>
                <div className='imgNameWrp'>
                    <div className='imgWrpCard'>
                        <img src={BACKEND_BASE_URL + props.data.imageLink} />
                    </div>
                    <div className='nameAndCategoryWrp'>
                        <Tooltip title={props.data.employeeName} placement="top-start" arrow>
                            <div className='nameWrp' onClick={() => handleViewDetail()}>
                                {props.data.employeeName}
                            </div>
                        </Tooltip>
                        <Tooltip title={props.data.category} placement="top-start" arrow>
                            <div className='categoryWrp'>
                                {props.data.category}
                            </div>
                        </Tooltip>
                        <Tooltip title={('₹' + props.data.salary).toLocaleString('en-IN')} placement="top-start" arrow>
                            <div className='categoryWrp'>
                                <b>Salary</b> : ₹ {parseFloat(props.data.salary ? props.data.salary : 0).toLocaleString('en-IN')}
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <div className='salaryDetailContainer w-full'>
                    <div className='flex editBtnWrp justify-between'>
                        <div>
                            <Switch
                                {...label}
                                defaultChecked
                                checked={toggel}
                                onChange={() => handleToggel()}
                            />
                            {/* <span>{toggel ? 'Active' : 'Inactive'}</span> */}
                        </div>
                        <Menutemp handleDelete={handleDelete} handleEdit={handleEdit} handleViewDetail={handleViewDetail} />
                    </div>
                    <div className='salaryDetailWrp grid grid-cols-3 gap-4'>
                        <div>
                            <div className='salaryHeader'>
                                Mo. Salary
                            </div>
                            <div className='salaryNum mt-1'>
                                {parseFloat(props.data.totalSalary ? props.data.totalSalary : 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                        <div>
                            <div className='salaryHeader'>
                                Advanced
                            </div>
                            <div className='salaryNum mt-1'>
                                {parseFloat(props.data.advanceAmount).toLocaleString('en-IN')}
                            </div>
                        </div>
                        <div>
                            <div className='salaryHeader'>
                                Fine/Penalty
                            </div>
                            <div className='salaryNum mt-1'>
                                {parseFloat(props.data.fineAmount).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>
                    <div className='salaryDetailWrp grid grid-cols-3 mt-3 gap-4'>
                        <div>
                            <div className='salaryHeader'>
                                Max-Leave
                            </div>
                            <div className='salaryNum mt-1'>
                                {props.data.maxLeave}
                            </div>
                        </div>
                        <div className=''>
                            <div className='salaryHeader'>
                                Avail Leave
                            </div>
                            <div className='salaryNum mt-1'>
                                {props.data.availableLeave}
                            </div>
                        </div>
                        <div className=''>
                            <div className='salaryHeader'>
                                Daily Salary
                            </div>
                            <div className='salaryNum mt-1'>
                                {parseFloat(props.data.perDaySalary ? props.data.perDaySalary : 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 pl-6 pr-4 '>
                        <div className='salaryHeader'>
                            Due Salary
                        </div>
                    </div>
                    <div className={`${props.data.paymentDue > 0 ? 'dueSalaryWrpGreen' : props.data.paymentDue == 0 ? 'dueSalaryWrpBlack' : ''} dueSalaryWrp mt-3 ml-6 mr-6`}>
                        {'₹ ' + parseFloat(props.data.paymentDue ? props.data.paymentDue : 0).toLocaleString('en-IN')}
                    </div>
                    <div className='mt-3 ml-6 mr-6 grid grid-cols-2 gap-6'>
                        <button className='addSalary' onClick={() => props.handleOpen(props.data)}>Give Salary</button>
                        <button className='addLeave' onClick={() => props.handleOpenAddLeave(props.data)}>Add Leave</button>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={() => { props.handleClose(); setOpen(false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>Make Payment to : </span><span className='makePaymentName'>{props.formData.nickName}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Payment Due :'}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{parseFloat(props.formData.paymentDue).toLocaleString('en-IN')}</span>
                        </Typography>
                    </div>
                    <div className='flex justify-between mt-3 mb-2'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Salary (From - To) :'} </span><span className='makePaymentName'>{props.formData.dateOfPayment}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Total Salary(With Leave) :'}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{parseFloat(props.formData.totalSalary).toLocaleString('en-IN')}</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        props.setFormDataError((perv) => ({
                                            ...perv,
                                            payAmount: true
                                        }))
                                    }
                                    else {
                                        props.setFormDataError((perv) => ({
                                            ...perv,
                                            payAmount: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={(e) => props.onChange(e)}
                                value={props.formData.payAmount}
                                error={props.formDataError.payAmount}
                                // helperText={props.formData.supplierName && !props.formDataError.productQty ? `Remain Payment  ${props.formData.remainingAmount}` : props.formDataError.paidAmount ? props.formData.paidAmount > props.formData.remainingAmount ? `Payment Amount can't be more than ${props.formData.remainingAmount}` : "Please Enter Amount" : ''}
                                // helperText={props.formData.amountType == 1 ? props.formData.payAmount ? props.formData.payAmount > props.formData.totalSalary ? `Amount can't be more than ${props.formData.totalSalary}` : `Remaining Payment ${props.formData.paymentDue}` : props.formDataError.totalSalary ? "Please Enter Amount" : `Remaining Payment ${props.formData.paymentDue}` : ''}
                                name="payAmount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                }}
                            />
                        </div>
                        <div className="col-span-4">
                            <FormControl style={{ minWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={props.formDataError.amountType}>Payment Type</InputLabel>
                                <Select
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            props.setFormDataError((perv) => ({
                                                ...perv,
                                                amountType: true
                                            }))
                                        }
                                        else {
                                            props.setFormDataError((perv) => ({
                                                ...perv,
                                                amountType: false
                                            }))
                                        }
                                    }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={props.formData.amountType}
                                    error={props.formDataError.amountType}
                                    name="amountType"
                                    label="Payment Type"
                                    onChange={(e) => props.onChange(e)}
                                >
                                    <MenuItem key={1} value={1}>{"Salary"}</MenuItem>
                                    <MenuItem key={2} value={2}>{"Advanced"}</MenuItem>
                                    <MenuItem key={3} value={3}>{"Fine"}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-4'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Payment Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={props.formDataError.amountDate}
                                    value={dayjs(props.formData.amountDate)}
                                    onChange={handlePaymentData}
                                    name="amountDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                disabled={props.formData.remainingAmount == 0}
                                onChange={(e) => props.onChange(e)}
                                value={props.formData.comment}
                                name="comment"
                                id="outlined-required"
                                label="Comment"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3'>
                            <button className='keepItAsItIsBtn' onClick={() => {
                                makeInActive(false)
                            }}>Just InActive</button>
                        </div>
                        <div className='col-span-3 col-start-7'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                makeInActive(true)
                            }}>Make Payment</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                props.handleClose(); setOpen(false)
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div >
    )
}

export default EmployeeCard;
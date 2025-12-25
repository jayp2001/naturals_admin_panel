import './addStaff.css'
import { useState, useEffect } from "react";
import React from "react";
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { ToastContainer, toast } from 'react-toastify';
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useRef } from 'react';
import dayjs from 'dayjs';
function AddEditStaff() {
    const textFieldRef = useRef(null);
    const focus = () => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    };
    var customParseFormat = require('dayjs/plugin/customParseFormat')
    dayjs.extend(customParseFormat)
    const location = useLocation();
    const navigate = useNavigate();
    let { id } = useParams();
    const isEdit = location.pathname.split('/').at(-2) === 'editStaff' ? true : false;
    const regex = /^[0-9\b]+$/;
    const emailRegx = /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [category, setCategory] = React.useState([]);
    const [designation, setDesignation] = React.useState([
        {
            id: 'Manager',
            value: "Manager"
        },
        {
            id: 'Assistant Manager',
            value: "Assistant Manager"
        },
        {
            id: 'Office Boy',
            value: "Office Boy"
        },
        {
            id: 'Billing Man',
            value: "Billing Man"
        },
        {
            id: 'Delivery Man',
            value: "Delivery Man"
        },
        {
            id: 'Chef',
            value: "Chef"
        },
        {
            id: 'Assistant Chef',
            value: "Assistant Chef"
        },
        {
            id: 'Captain',
            value: "Captain"
        },
        {
            id: 'Waiter',
            value: "Waiter"
        },
        {
            id: 'Helper',
            value: "Helper"
        },
        {
            id: 'Fatka',
            value: "Fatka"
        },
        {
            id: 'Store Supervisor',
            value: "Store Supervisor"
        },
        {
            id: 'Kitchen Supervisor',
            value: "Kitchen Supervisor"
        },
        {
            id: 'Mori Wala',
            value: "Mori Wala"
        },
        {
            id: 'Security Guard',
            value: "Security Guard"
        },
        {
            id: 'Cleaner',
            value: "Cleaner"
        },
        {
            id: 'Pantry',
            value: "Pantry"
        },
    ]);
    const [fileName, setFileName] = React.useState(null);
    const [file, setFile] = React.useState('');
    const [filePreview, setFilePreview] = React.useState();
    const [formData, setFormData] = useState({
        employeeFirstName: '',
        employeeLastName: '',
        employeeGender: '',
        employeeMobileNumber: '',
        employeeOtherMobileNumber: '',
        employeeStatus: true,
        presentAddress: '',
        homeAddress: '',
        adharCardNum: '',
        category: '',
        designation: '',
        salary: '',
        maxLeave: '',
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
        employeeNickName: '',
        files: null,
        joiningDate: dayjs()
    });
    const [formDataError, setFormDataError] = useState({
        employeeFirstName: false,
        employeeLastName: false,
        employeeGender: false,
        employeeMobileNumber: false,
        presentAddress: false,
        homeAddress: false,
        adharCardNum: false,
        category: false,
        designation: false,
        employeeNickName: false,
        salary: false,
        maxLeave: false,
        files: false,
        joiningDate: false
    })
    const handleFileUpload = (event) => {
        console.log("FILE", event.target.files)
        setFilePreview(URL.createObjectURL(event.target.files[0]))
        setFile(event.target.files)
        setFormData((perv) => ({
            ...perv,
            files: event.target.files
        }))
        setFileName(event.target.files[0].name)
        if (event.target.files[0].name) {
            setFormDataError((perv) => ({
                ...perv,
                files: false,
            }))
        }
        else {
            setFormDataError((perv) => ({
                ...perv,
                files: true,
            }))
        }
    }
    const navigateToList = () => {
        navigate('/staff/staffList')
    }
    const reset = () => {
        setFormData(
            {
                employeeFirstName: '',
                employeeLastName: '',
                employeeGender: '',
                employeeMobileNumber: '',
                employeeNickName: '',
                employeeOtherMobileNumber: '',
                employeeStatus: true,
                presentAddress: '',
                homeAddress: '',
                adharCardNum: '',
                category: '',
                designation: '',
                salary: '',
                maxLeave: '',
                accountHolderName: '',
                accountNumber: '',
                ifscCode: '',
                bankName: '',
                branchName: '',
                files: null,
                joiningDate: dayjs()
            }
        )
        setFormDataError({
            employeeFirstName: false,
            employeeLastName: false,
            employeeGender: false,
            employeeMobileNumber: false,
            presentAddress: false,
            homeAddress: false,
            category: false,
            designation: false,
            salary: false,
            maxLeave: false,
            files: false,
            employeeNickName: false,
            joiningDate: false
        })
        setFileName('')
        setFilePreview();
    }
    const [fields, setFields] = useState([
        'employeeFirstName',
        'employeeLastName',
        'employeeGender',
        'employeeMobileNumber',
        'presentAddress',
        'homeAddress',
        'category',
        'designation',
        'salary',
        'maxLeave',
        'files',
        'employeeNickName',
        'joiningDate'
    ])
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const handleJoiningDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["joiningDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const getCategory = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/ddlStaffCategory`, config)
            .then((res) => {
                setCategory(res.data);
            })
    }
    const getDesignation = async () => {
        // await axios.get(`${BACKEND_BASE_URL}userrouter/ddlRights`, config)
        //     .then((res) => {
        //         setDesignation(res.data);
        //     })
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
        setTimeout(() => {
            setLoading(false)
            setSuccess(false)
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
        setLoading(false)
        setError(false);
    }
    const getEmployeeDetail = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/fillEmployeeDetails?employeeId=${id}`, config)
            .then((res) => {
                setFormData({ ...res.data, previousSalary: res.data.salary, previousMaxLeave: res.data.maxLeave });
                console.log('KLKO', { ...res.data, previousSalary: res.data.salary })
                setFilePreview(BACKEND_BASE_URL + res.data.imageLink);
                setFileName(res.data.imageFilePath)
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const addEmployee = async () => {
        setLoading(true);
        console.log(file[0]);
        var data = {
            ...formData,
            files: file
        }
        console.log('data', data)
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addEmployeedetails`, data, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                reset();
                focus()
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const goToDetail = (id) => {
        navigate(`/staff/employeeDetail/${id}`);
    }
    const editEmployee = async () => {
        if (window.confirm('Are you sure you want to edit...?')) {
            console.log("edit")
            setLoading(true);
            console.log(file[0]);
            var data = {
                ...formData,
                files: file
            }
            console.log('data', data)
            await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeDetails`, data, config)
                .then((res) => {
                    setLoading(false);
                    setSuccess(true);
                    reset();
                    setTimeout(() => {
                        goToDetail(data.employeeId)
                    }, 1000)
                })
                .catch((error) => {
                    setLoading(false);
                    console.log('>>', error)
                    setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                })
        }
    }
    const submit = () => {
        if (loading || success) {

        } else {
            console.log('>>>>>>>>>>', formData)

            const isValidate = fields.filter(element => {
                if (element === 'files') {
                    if (fileName === '' || fileName === null || !fileName) {
                        setFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    }
                }
                else if (formDataError[element] === true || formData[element] === '') {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                isEdit ? editEmployee() : addEmployee()
            }
        }
    }
    useEffect(() => {
        getCategory();
        focus();
        // getDesignation();
        if (location.pathname.split('/').at(-2) === 'editStaff' ? true : false) {
            getEmployeeDetail(location.pathname.split('/').at(-1))
        }
    }, [])
    return (
        <div className='mainBodyAddStaff grid content-center'>

            <div className="grid grid-cols-12">
                <div className="col-span-8 col-start-3">
                    <div className="addStaffCard">
                        <div className="header flex items-center ">
                            <div className="grid justify-items-center w-full">
                                <div className="header_text">
                                    Add employee
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 formHeader">
                            Personal Details
                        </div>
                        <div className='addUserTextFieldWrp'>
                            <div className='grid grid-rows-3 gap-6'>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        employeeFirstName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        employeeFirstName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            inputRef={textFieldRef}
                                            value={formData.employeeFirstName}
                                            error={formDataError.employeeFirstName}
                                            helperText={formDataError.employeeFirstName ? "Please Enter First Name" : ''}
                                            name="employeeFirstName"
                                            id="outlined-required"
                                            label="First Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        employeeLastName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        employeeLastName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.employeeLastName}
                                            error={formDataError.employeeLastName}
                                            helperText={formDataError.employeeLastName ? "Please Enter Last Name" : ''}
                                            name="employeeLastName"
                                            id="outlined-required"
                                            label="Last Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className='col-span-4'>
                                        <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label" required error={formDataError.employeeGender}>Gender</FormLabel>
                                            <RadioGroup
                                                row
                                                required
                                                onChange={(e) => {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        employeeGender: false
                                                    }))
                                                    onChange(e)
                                                }}
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                value={formData.employeeGender}
                                                error={formDataError.employeeGender}
                                                name="employeeGender"
                                            >
                                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 10) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        employeeMobileNumber: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        employeeMobileNumber: false
                                                    }))
                                                }
                                            }}
                                            onChange={(e) => {
                                                if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                    onChange(e)
                                                }
                                            }}
                                            value={formData.employeeMobileNumber}
                                            error={formDataError.employeeMobileNumber}
                                            helperText={formDataError.employeeMobileNumber ? "Please Enter mobile number " : ''}
                                            name="employeeMobileNumber"
                                            id="outlined-required"
                                            label="Mobile Number"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={(e) => {
                                                if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 21) {
                                                    onChange(e)
                                                }
                                            }}
                                            value={formData.employeeOtherMobileNumber}
                                            name="employeeOtherMobileNumber"
                                            id="outlined-required"
                                            label="International Number"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <FormControl style={{ minWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" required error={formDataError.employeeStatus}>employee Status</InputLabel>
                                            <Select
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            employeeStatus: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            employeeStatus: false
                                                        }))
                                                    }
                                                }}
                                                disabled={isEdit}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={formData.employeeStatus ? true : false}
                                                error={formDataError.employeeStatus}
                                                name="employeeStatus"
                                                label="employee Status"
                                                onChange={onChange}
                                            >
                                                <MenuItem key={'active'} value={true}>{"Active"}</MenuItem>
                                                <MenuItem key={'inactive'} value={false}>{"Inactive"}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        employeeNickName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        employeeNickName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.employeeNickName}
                                            error={formDataError.employeeNickName}
                                            helperText={formDataError.employeeNickName ? "Please Enter Nick Name" : ''}
                                            name="employeeNickName"
                                            id="outlined-required"
                                            label="Nick Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={onChange}
                                            value={formData.adharCardNum}
                                            name="adharCardNum"
                                            id="outlined-required"
                                            label="Adhar card Number"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className='col-span-4'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DesktopDatePicker
                                                textFieldStyle={{ width: '100%' }}
                                                InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                                InputLabelProps={{ style: { fontSize: 14 } }}
                                                label="Joining Date"
                                                format="DD/MM/YYYY"
                                                required
                                                error={formDataError.joiningDate}
                                                value={dayjs(formData.joiningDate)}
                                                onChange={handleJoiningDate}
                                                name="joiningDate"
                                                renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-6">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        presentAddress: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        presentAddress: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.presentAddress}
                                            error={formDataError.presentAddress}
                                            helperText={formDataError.presentAddress ? "Please Enter rajkot address" : ''}
                                            name="presentAddress"
                                            id="outlined-required"
                                            label="Present Address"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-6">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        homeAddress: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        homeAddress: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.homeAddress}
                                            error={formDataError.homeAddress}
                                            helperText={formDataError.homeAddress ? "Please Enter Staff Home Address" : ''}
                                            name="homeAddress"
                                            id="outlined-required"
                                            label="Staff Home Address"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 formHeader">
                            professional Detail
                        </div>
                        <div className='addUserTextFieldWrp'>
                            <div className='grid grid-rows-1 gap-6'>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-2">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        salary: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        salary: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.salary}
                                            error={formDataError.salary}
                                            helperText={formDataError.salary ? "Enter salary" : ''}
                                            name="salary"
                                            id="outlined-required"
                                            label="Salary"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value < 0) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        maxLeave: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        maxLeave: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.maxLeave}
                                            error={formDataError.maxLeave}
                                            helperText={formDataError.maxLeave ? "Enter leave" : ''}
                                            name="maxLeave"
                                            id="outlined-required"
                                            label="Max Leave"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <FormControl style={{ minWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" required error={formDataError.category}>Category</InputLabel>
                                            <Select
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            category: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            category: false
                                                        }))
                                                    }
                                                }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={formData.category}
                                                error={formDataError.category}
                                                name="category"
                                                label="Category"
                                                onChange={onChange}
                                            >
                                                {
                                                    category ? category.map((right) => (
                                                        <MenuItem key={right.staffCategoryId} value={right.staffCategoryId}>{right.staffCategoryName}</MenuItem>
                                                    )) : null
                                                }

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-span-4">
                                        <FormControl style={{ minWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" required error={formDataError.designation}>Designation</InputLabel>
                                            <Select
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            designation: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            designation: false
                                                        }))
                                                    }
                                                }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={formData.designation}
                                                error={formDataError.designation}
                                                name="designation"
                                                label="Designation"
                                                onChange={onChange}
                                            >
                                                {
                                                    designation ? designation.map((right) => (
                                                        <MenuItem key={right.id} value={right.id}>{right.value}</MenuItem>
                                                    )) : null
                                                }

                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 formHeader">
                            Bank Detail
                        </div>
                        <div className='addUserTextFieldWrp'>
                            <div className='grid grid-rows-2 gap-6'>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={onChange}
                                            value={formData.accountHolderName}
                                            name="accountHolderName"
                                            id="outlined-required"
                                            label="Account Holder Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={onChange}
                                            value={formData.accountNumber}
                                            name="accountNumber"
                                            id="outlined-required"
                                            label="Account Number"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={onChange}
                                            value={formData.ifscCode}
                                            name="ifscCode"
                                            id="outlined-required"
                                            label="IFSC Code"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={onChange}
                                            value={formData.bankName}
                                            name="bankName"
                                            id="outlined-required"
                                            label="Bank Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={onChange}
                                            value={formData.branchName}
                                            name="branchName"
                                            id="outlined-required"
                                            label="Branch Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 formHeader">
                            Profile Image
                        </div>
                        <div className='addUserTextFieldWrp'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-span-6'>
                                    <div className={formDataError.files ? 'fileUploadContainerError' : 'fileUploadContainer'}>
                                        <div className='grid grid-cols-12 fileName'>
                                            {fileName && <div className='fileNameWrp col-start-2 col-span-10 grid content-center'>
                                                <div className='w-full overflow-hidden flex justify-between'>
                                                    <div className='fileN'>
                                                        {fileName}
                                                    </div>
                                                    <div>
                                                        <IconButton onClick={() => {
                                                            document.getElementById("fileUpload").value = "";
                                                            setFile(null)
                                                            setFileName('')
                                                            setFilePreview();
                                                        }} fontSize='large' sx={{ minHeight: 0, minWidth: 0, padding: 0 }}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                        </div>
                                        <div className='uploadBtnWrp w-full flex justify-center'>
                                            <div className='col-start-4 col-span-5'>
                                                <Button variant="contained" component="label">
                                                    Upload reciept
                                                    <input hidden accept="application/image/*" id='fileUpload' onChange={handleFileUpload} type="file" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-6 flex justify-center'>
                                    <div className='profileImgWrp'>
                                        <img className='profileImg' src={filePreview} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='addUserBtnContainer grid grid-rows-1'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-start-4 col-span-3'>
                                    <button className='saveBtn' onClick={submit}>Save</button>
                                </div>
                                <div className='col-span-3'>
                                    <button className='resetBtn' onClick={() => isEdit ? navigateToList() : reset()}>{isEdit ? 'Cancle' : 'Reset'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddEditStaff;
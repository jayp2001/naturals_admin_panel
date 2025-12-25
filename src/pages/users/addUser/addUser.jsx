import './addUser.css'
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
function AddUser() {
    const regex = /^[0-9\b]+$/;
    const emailRegx = /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
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
    const [rights, setRights] = useState();
    const [formData, setFormData] = useState({
        userFirstName: '',
        userLastName: '',
        userGender: '',
        userName: '',
        password: '',
        emailId: '',
        userRights: ''
    });
    const [formDataError, setFormDataError] = useState({
        userFirstName: false,
        userLastName: false,
        userGender: false,
        userName: false,
        password: false,
        emailId: false,
        userRights: false
    })

    const [fields, setFields] = useState([
        'userFirstName',
        'userLastName',
        'userGender',
        'userName',
        'password',
        'emailId',
        'userRights',
    ])

    const getRights = async () => {
        await axios.get(`${BACKEND_BASE_URL}userrouter/ddlRights`, config)
            .then((res) => {
                setRights(res.data);
            })
    }

    useEffect(() => {
        getRights();
    }, [])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const reset = () => {
        setFormData({
            userFirstName: '',
            userLastName: '',
            userGender: '',
            userName: '',
            password: '',
            emailId: '',
            userRights: ''
        });
    }
    const addUser = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}userrouter/addUser`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                reset();
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submit = () => {
        if (loading || success) {

        } else {
            console.log('>>>>>>>>>>', formData)

            const isValidate = fields.filter(element => {
                if (element === 'emailId') {
                    return null
                } else if (formDataError[element] === true || formData[element] === '') {
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
                addUser()
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
        setError(false);
    }
    return (
        <div className='mainBody grid content-center'>
            <div className="grid grid-cols-12">
                <div className="col-span-8 col-start-3">
                    <div className="addUserCard">
                        <div className="header flex items-center ">
                            <div className="grid justify-items-center w-full">
                                <div className="header_text">
                                    Add User
                                </div>
                            </div>
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
                                                        userFirstName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        userFirstName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.userFirstName}
                                            error={formDataError.userFirstName}
                                            helperText={formDataError.userFirstName ? "Please Enter First Name" : ''}
                                            name="userFirstName"
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
                                                        userLastName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        userLastName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.userLastName}
                                            error={formDataError.userLastName}
                                            helperText={formDataError.userLastName ? "Please Enter Last Name" : ''}
                                            name="userLastName"
                                            id="outlined-required"
                                            label="Last Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className='col-span-4'>
                                        <FormControl>
                                            <FormLabel id="demo-row-radio-buttons-group-label" required error={formDataError.userGender}>Gender</FormLabel>
                                            <RadioGroup
                                                onBlur={(e) => {
                                                    if (e.target.value.length < 2) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userGender: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userGender: false
                                                        }))
                                                    }
                                                }}
                                                row
                                                required
                                                onChange={(e) => {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        userGender: false
                                                    }))
                                                    onChange(e)
                                                }}
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                value={formData.userGender}
                                                error={formDataError.userGender}
                                                name="userGender"
                                            >
                                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (emailRegx.test(e.target.value) || e.target.value === '') {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        emailId: false
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        emailId: true
                                                    }))
                                                }
                                            }}
                                            error={formDataError.emailId}
                                            helperText={formDataError.emailId ? "Please Enter valid Email" : ''}
                                            onChange={onChange}
                                            value={formData.emailId}
                                            name="emailId"
                                            id="outlined-required"
                                            label="Email Id"
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
                                                        userName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        userName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.userName}
                                            error={formDataError.userName}
                                            helperText={formDataError.userName ? "Please Enter First Name" : ''}
                                            name="userName"
                                            id="outlined-required"
                                            label="User Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 4) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        password: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        password: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.password}
                                            error={formDataError.password}
                                            helperText={formDataError.password ? "Enter valid password (min 4 character)" : ''}
                                            name="password"
                                            id="outlined-required"
                                            label="Password"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <FormControl style={{ minWidth: '100%' }}>
                                            <InputLabel id="demo-simple-select-label" required error={formDataError.userRights}>User Role</InputLabel>
                                            <Select
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userRights: true
                                                        }))
                                                    }
                                                    else {
                                                        setFormDataError((perv) => ({
                                                            ...perv,
                                                            userRights: false
                                                        }))
                                                    }
                                                }}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={formData.userRights}
                                                error={formDataError.userRights}
                                                name="userRights"
                                                label="User Role"
                                                onChange={onChange}
                                            >
                                                {
                                                    rights ? rights.map((right) => (
                                                        <MenuItem key={right.rightsId} value={right.rightsId}>{right.rightsName}</MenuItem>
                                                    )) : null
                                                }

                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='addUserBtnContainer grid grid-rows-1'>
                            <div className='grid grid-cols-12 gap-6'>
                                <div className='col-start-4 col-span-3'>
                                    <button onClick={() => submit()} className='saveBtn' >Save</button>
                                </div>
                                <div className='col-span-3'>
                                    <button onClick={() => reset()} className='resetBtn'>reset</button>
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

export default AddUser;
import './editSuppiler.css'
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
import OutlinedInput from '@mui/material/OutlinedInput';
import { BACKEND_BASE_URL } from '../../../url';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}
function EditSuppiler() {
    let { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const regex = /^[0-9\b]+$/;
    const emailRegx = /^[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [productName, setProductName] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [productList, setProductList] = useState();
    const [formData, setFormData] = useState({
        supplierFirstName: '',
        supplierNickName: '',
        supplierLastName: '',
        supplierFirmName: '',
        supplierFirmAddress: '',
        supplierPhoneNumber: '',
        supplierEmailId: '',
        productId: []
    });
    const [formDataError, setFormDataError] = useState({
        supplierNickName: false,
        supplierFirmName: false,
        supplierFirmAddress: false,
        supplierPhoneNumber: false,
        productId: false
    })
    const handleChange = (event, value) => {
        const products = value?.map((obj) => {
            return obj.productId
        });
        var res = products.filter(elements => {
            return (elements != null && elements !== undefined && elements !== "");
        });
        if (!value.length > 0) {
            setFormDataError((perv) => ({
                ...perv,
                productId: true
            }))
        } else {
            setFormDataError((perv) => ({
                ...perv,
                productId: false
            }))
        }
        setProductName(value);
        setFormData((pervState) => ({
            ...pervState,
            productId: value.length > 0 ? res : [],
        }))
    };
    const [fields, setFields] = useState([
        'supplierNickName',
        'supplierFirmName',
        'supplierEmailId',
        'supplierFirmAddress',
        'supplierPhoneNumber',
        'productId',
    ])

    const getProductList = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlProduct`, config)
            .then((res) => {
                setProductList(res.data);
            })
            .catch((error) => {
                // setLoading(false);
                // alert(error.response.data);
            })
    }
    const getData = async () => {
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/ddlProduct`, config)
            .then(async (response) => {
                setProductList(response.data);
                await axios.get(`${BACKEND_BASE_URL}inventoryrouter/fillSupplierDetails?supplierId=${id}`, config)
                    .then((res) => {
                        setFormData(res.data);
                        setProductName(res.data.supplierProductData)
                        console.log(res.data.supplierProductData)
                    })
                    .catch((error) => {
                        alert("jay")
                    })
            })
            .catch((error) => {
                // setLoading(false);
                // alert(error.response.data);
            })
    }
    useEffect(() => {
        getData();
    }, [])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const reset = () => {
        navigate(`/suppilerTable`)
    }
    const editSuppiler = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}inventoryrouter/updateSupplierDetails`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const submit = () => {
        console.log('>>>>>>>>>>', formData)
        if (loading || success) {

        } else {
            const isValidate = fields.filter(element => {
                if (element === 'supplierEmailId') {
                    return null
                } else if (element === 'productId') {
                    if (formDataError[element] === true || formData[element] === []) {
                        setFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    }
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
                editSuppiler()
                // console.log('submit', formData);
            }
        }
    }

    if (loading) {
        console.log('>>>>??')
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
        // window.alert()
    }
    if (success) {
        toast.dismiss('loading');
        toast('success',
            {
                type: 'success',
                toastId: 'success',
                position: "bottom-right",
                toastId: 'error',
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        setTimeout(() => {
            setSuccess(false)
            reset()
        }, 2000)
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
    if (!formData) {
        return null
    }
    return (
        <div className='mainBodyAddSuppiler grid content-center'>
            <div className="grid grid-cols-12">
                <div className="col-span-8 col-start-3">
                    <div className="addSuppilerCard">
                        <div className="header flex items-center ">
                            <div className="grid justify-items-center w-full">
                                <div className="header_text">
                                    Edit Suppiler
                                </div>
                            </div>
                        </div>
                        <div className='addUserTextFieldWrp'>
                            <div className='grid grid-rows-3 gap-6'>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={onChange}
                                            value={formData.supplierFirstName}
                                            error={formDataError.supplierFirstName}
                                            helperText={formDataError.supplierFirstName ? "Please Enter First Name" : ''}
                                            name="supplierFirstName"
                                            id="outlined-required"
                                            label="Suppiler First Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onChange={onChange}
                                            value={formData.supplierLastName}
                                            error={formDataError.supplierLastName}
                                            helperText={formDataError.supplierLastName ? "Please Enter Last Name" : ''}
                                            name="supplierLastName"
                                            id="outlined-required"
                                            label="Supplier Last Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className='col-span-4'>
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirmName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirmName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.supplierFirmName}
                                            error={formDataError.supplierFirmName}
                                            helperText={formDataError.supplierFirmName ? "Please Enter Supplier Firm Name" : ''}
                                            name="supplierFirmName"
                                            id="outlined-required"
                                            label="Supplier Firm Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierNickName: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierNickName: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.supplierNickName}
                                            // error={formDataError.supplierNickName}
                                            // helperText={formDataError.supplierNickName ? "Please Enter Last Name" : ''}
                                            name="supplierNickName"
                                            id="outlined-required"
                                            label="Supplier Nick Name"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (emailRegx.test(e.target.value) || e.target.value === '') {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierEmailId: false
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierEmailId: true
                                                    }))
                                                }
                                            }}
                                            error={formDataError.supplierEmailId}
                                            helperText={formDataError.supplierEmailId ? "Please Enter valid Email" : ''}
                                            onChange={onChange}
                                            value={formData.supplierEmailId}
                                            name="supplierEmailId"
                                            id="outlined-required"
                                            label="Supplier Email Id"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 10) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierPhoneNumber: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierPhoneNumber: false
                                                    }))
                                                }
                                            }}
                                            onChange={(e) => {
                                                if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                                    onChange(e)
                                                }
                                            }}
                                            value={formData.supplierPhoneNumber}
                                            error={formDataError.supplierPhoneNumber}
                                            helperText={formDataError.supplierPhoneNumber ? "Please Enter WhatsApp Number" : ''}
                                            name="supplierPhoneNumber"
                                            id="outlined-required"
                                            label="Mobile Number"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-12">
                                        <TextField
                                            onBlur={(e) => {
                                                if (e.target.value.length < 2) {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirmAddress: true
                                                    }))
                                                }
                                                else {
                                                    setFormDataError((perv) => ({
                                                        ...perv,
                                                        supplierFirmAddress: false
                                                    }))
                                                }
                                            }}
                                            onChange={onChange}
                                            value={formData.supplierFirmAddress}
                                            error={formDataError.supplierFirmAddress}
                                            helperText={formDataError.supplierFirmAddress ? "Please Enter Firm address" : ''}
                                            name="supplierFirmAddress"
                                            id="outlined-required"
                                            label="Supplier Firm Address"
                                            InputProps={{ style: { fontSize: 14 } }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 gap-6'>
                                    <div className="col-span-12">
                                        <Autocomplete
                                            multiple
                                            style={{ minWidth: '100%' }}
                                            limitTags={8}
                                            name='productName'
                                            defaultValue={null}
                                            value={productName ? productName : null}
                                            fullWidth
                                            id="checkboxes-tags-demo"
                                            options={productList ? productList : []}
                                            disableCloseOnSelect
                                            onChange={handleChange}
                                            error={formDataError.productId}
                                            isOptionEqualToValue={(option, value) => option.productName === value.productName}
                                            getOptionLabel={(option) => option.productName}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox
                                                        icon={icon}
                                                        checkedIcon={checkedIcon}
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.productName}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField {...params} error={formDataError.productId} label="products" placeholder="Products" />
                                            )}
                                        />
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
                                    <button onClick={() => reset()} className='resetBtn'>Cancle</button>
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

export default EditSuppiler;
import './login.css';
import React from 'react';
import bhagwatiLogo from '../../assets/NATURAL_LOGO.jpg';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from "@mui/material/FormControl";
import TextField from '@mui/material/TextField';
import { BACKEND_BASE_URL } from '../../url';
import Alert from '@mui/material/Alert';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
const decryptData = (text) => {
    const key = process.env.REACT_APP_AES_KEY;
    console.log('key', process.env.REACT_APP_AES_KEY)
    const bytes = CryptoJS.AES.decrypt(text, key);
    const data = bytes.toString(CryptoJS.enc.Utf8) ? JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) : 0;
    return (data);
};
const encryptData = (text) => {
    const key = process.env.REACT_APP_AES_KEY;
    console.log('key', process.env.REACT_APP_AES_KEY)
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(text),
        key
    ).toString();

    return (data);
};
function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [errorData, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const submit = async (e) => {
        e.preventDefault();
        console.log("login", userName, password);
        const data = {
            userName: userName,
            Password: password
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
        };
        await axios.post(`${BACKEND_BASE_URL}userrouter/authUser`, data, config)
            .then((res) => {
                setLoading(false);
                console.log('success', res.data)
                if (res && res.data ? true : false) {
                    console.log("::::")
                    setSuccess(true);
                    const rights = res.data.userRights;
                    res.data.userRights = res.data.userRights ? encryptData(res.data.userRights) : res.data.userRights;
                    localStorage.setItem("userInfo", JSON.stringify(res.data));
                    console.log("rightsLogin", rights);
                    if (rights == 6)
                        navigate('/stockOut');
                    else
                        navigate('/dashboard');
                }
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'))
        const role = user && user.userRights ? decryptData(user.userRights) : '';
        console.log('role', role)
        // const role = '1'
        // if (userInfo && role == '1') {
        //     navigate('/list');
        // }
        // else if (userInfo && role == '0') {
        //     navigate('/dashboard');
        // }
    }, []);
    return (
        <div className="grid grid-rows-1 tablet:h-screen tablet:pb-0 tablet:pt-0 tablet1:h-screen tablet1:pb-0  tablet1:pt-0 mobile:h-screen mobile:pb-20">
            <div className="grid grid-cols-12 h-full content-center">
                <div className="tablet:col-span-6 tablet1:col-span-6 grid content-center mobile:col-span-12">
                    <div className='grid grid-cols-12'>
                        <div className='tablet1:col-span-8 mobile:col-start-4 mobile:col-span-6 tablet1:col-start-3'>
                            <div className="logoMobile">
                                <img src={bhagwatiLogo} alt="bhagwati logo" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tablet1:col-span-6 mobile:col-span-12 tablet:h-full tablet1:h-fit tablet1:pb-6 tablet1:pt-6 grid content-center">
                    <div className="grid grid-cols-12">
                        <div className="tablet1:col-span-8 mobile:col-span-10 mobile:col-start-2 tablet1:col-start-3">
                            <div className="loginCard">
                                <div className='loginHeader'>
                                    Login
                                </div>
                                <div className='textFieldWrp grid gap-6'>
                                    {errorData &&
                                        <div>
                                            <Alert severity="error">{errorData}</Alert>
                                        </div>
                                    }
                                    <TextField
                                        required
                                        onChange={(e) => setUserName(e.target.value)}
                                        // onChange={onChange}
                                        value={userName}
                                        autoComplete='off'
                                        name="agentFirstName"
                                        id="outlined-required"
                                        label="User Name"
                                        InputProps={{ style: { fontSize: 18 } }}
                                        InputLabelProps={{ style: { fontSize: 18 } }}
                                        fullWidth
                                    />
                                    <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">
                                            Password
                                        </InputLabel>
                                        <OutlinedInput
                                            name="agentFirstName"
                                            autoComplete='off'
                                            label="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            InputProps={{ style: { fontSize: 18 } }}
                                            InputLabelProps={{ style: { fontSize: 18 } }}
                                            fullWidth
                                            onKeyDown={(e) => {
                                                e.key === 'Enter' ? submit(e) : <></>
                                            }}
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </div>
                                <div className="buttonWrapper flex justify-around">
                                    <button className="loginBtn" type="submit" onClick={(e) => submit(e)}>
                                        Login In
                                    </button>
                                </div>
                                <div className='forgetPwd'>
                                    Forget Password ? <button className='forgetPwdBtn'>reset it ..!</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
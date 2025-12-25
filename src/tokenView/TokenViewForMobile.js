import {
    Box, InputAdornment, Modal, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, useMediaQuery
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BACKEND_BASE_URL, SOCKET_URL } from '../url';
import { toast, ToastContainer } from 'react-toastify';
import Timer from './Timer';
import io from 'socket.io-client';
import SearchIcon from '@mui/icons-material/Search';
import './css/TokenViewForMobile.css';

const TokenViewForMobile = () => {
    const [tokenData, setTokenData] = useState([]);
    const [filteredTokenData, setFilteredTokenData] = useState([]);
    const [tokenDataPopUp, setTokenDataPopUp] = useState(false);
    const [tokenValues, setTokenValues] = useState({});
    const [searchWord, setSearchWord] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const isWideScreen = useMediaQuery('(min-width:820px)');
    useEffect(() => {
        getAllTokenList();
    }, []);
    useEffect(() => {
        if (loading) {
            toast.loading("Please wait...", { toastId: 'loading' });
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
            setTimeout(() => {
                setSuccess(false);
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
    }, [loading, success, error]);
    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("getTokenList", (message) => {
            console.log('message', message);
            setTokenData(message);
            setFilteredTokenData(message);
        });

        return () => {
            socket.disconnect();
        };
    }, []);
    const getAllTokenList = async () => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/getTokenList`, config)
            .then((res) => {
                setTokenData(res.data);
                setFilteredTokenData(res.data);
            })
            .catch((error) => {
                console.log('Error', error);
                setError(error?.response?.data || 'Network Error!');
            });
    };
    const updateBillStatus = async (tknNo) => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/updateTokenToDisplay?tokenNo=${tknNo}`, config)
            .then((res) => {
                console.log('Response Data', res.data);
                getAllTokenList();
                setTokenDataPopUp(false);
            })
            .catch((error) => {
                console.log('Error =>', error);
                setError(error?.response?.data || 'Network Error!');
                setSearchWord('');
                setFilteredTokenData(tokenData);
            });
    };

    const handleRevertStatus = async (billId) => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/revertTokenStatus?billId=${billId}`, config)
            .then((res) => {
                console.log('Response', res.data);
                getAllTokenList();
                setTokenDataPopUp(false);
            })
            .catch((error) => {
                console.log('Error==>', error);
                setError(error?.response?.data || 'Network Error!');
            });
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '5px',
    };

    const speakTokenNumber = async (tknNo) => {
        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/speakTokenNumber?tokenNo=${tknNo}`, config)
            .then((res) => {
                console.log('Response', res.data);
                setTokenDataPopUp(false);
            })
            .catch((error) => {
                console.log('Error ==>', error);
            });
    };

    const onSearchChange = (e) => {
        setSearchWord(e.target.value);
        const filteredData = tokenData.filter((val) => {
            return val?.tokenNo.toString().includes(e.target.value);
        });
        setFilteredTokenData(filteredData);
    };

    const clearDispay = async () => {
        const userConfirmed = window.confirm('Are You Sure You Want to Clear Display');
        if (!userConfirmed) {
            return;
        }

        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/clearAllDisplayToken`, config)
            .then((res) => {
                console.log('res', res.data);
                getAllTokenList();
            })
            .catch((error) => {
                console.log('Error ==> ', error);
            });
    };


    const AllTokenCompelete = async () => {
        const userConfirmed = window.confirm(`Are You Sure You Want to Clear All Token's List`)
        if (!userConfirmed) {
            return;
        }

        await axios.get(`${BACKEND_BASE_URL}deliveryAndPickUprouter/setAllTokenComplete`, config)
            .then((res) => {
                console.log('Res', res.data);
                getAllTokenList();
            })
            .catch((error) => {
                console.log('Error ==>', error);
            });
    };

    return (
        <div className='p-4 fixedHeightForTokenViewMobile'>
            <div className="bg-white rounded-md ">
                <div className="mb-2 flex items-end justify-between gap-14 p-2">
                    <TextField
                        type='number'
                        onChange={onSearchChange}
                        value={searchWord}
                        name="searchWord"
                        id="standard-basic"
                        variant="standard"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                updateBillStatus(searchWord);
                                setSearchWord('');
                            }
                        }}
                        label="Search"
                        className='w-2/4'
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                            style: { fontSize: 14 },
                        }}
                        InputLabelProps={{ style: { fontSize: 14 } }}
                        fullWidth
                    />
                    {isWideScreen ? (
                        <div className="flex justify-end w-full gap-4">
                            <button
                                className='cursor-pointer w-2/5 ResetButton py-1 px-3 rounded-md text-center text-white transform transition-transform hover:-translate-y-0.5 duration-300 ease-in-out'
                                onClick={() => {
                                    setSearchWord('');
                                    setFilteredTokenData(tokenData);
                                }}
                            >
                                Reset
                            </button>
                            <button
                                className='cursor-pointer w-2/5 CompleteDelivery py-1 px-3 rounded-md text-center text-white transform transition-transform hover:-translate-y-0.5 duration-300 ease-in-out'
                                onClick={() => {
                                    clearDispay();
                                }}
                            >
                                Clear Display
                            </button>
                            <button
                                className='cursor-pointer w-2/5  bg-slate-500 py-1 px-3 rounded-md text-center text-white transform transition-transform hover:-translate-y-0.5 duration-300 ease-in-out'
                                onClick={() => {
                                    AllTokenCompelete();
                                }}
                            >
                                Clear All
                            </button>
                        </div>
                    ) : (
                        <button
                            className='cursor-pointer w-2/5 ResetButton py-1 px-3 rounded-md text-center text-white'
                            onClick={() => {
                                setSearchWord('');
                                setFilteredTokenData(tokenData);
                            }}
                        >
                            Reset
                        </button>
                    )}
                </div>
                <TableContainer component={Paper} style={{ width: '100%' }} className='FixedNewTableHeight p-2'>
                    <Table sx={{ width: '100%' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">No.</TableCell>
                                <TableCell align="center" className='CustomePaddingFormTime'>Time</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                {isWideScreen && <TableCell align="right">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTokenData && filteredTokenData.length > 0 ? (
                                filteredTokenData.map((val, index) => (
                                    <TableRow

                                        key={index}
                                        className={`${val.billStatus === 'Food Ready' ? 'bg-green-100' : ''}`}
                                    >
                                        <TableCell
                                            align='left'
                                            onClick={() => {
                                                setTokenDataPopUp(true);
                                                setTokenValues(val);
                                            }}
                                        >{val.tokenNo}</TableCell>
                                        <TableCell
                                            align='center'
                                            className='CustomePaddingFormTime'
                                            onClick={() => {
                                                setTokenDataPopUp(true);
                                                setTokenValues(val);
                                            }}
                                        >
                                            <Timer startTime={val.timeDifference} />
                                        </TableCell>
                                        <TableCell
                                            align='right'
                                            onClick={() => {
                                                setTokenDataPopUp(true);
                                                setTokenValues(val);
                                            }}
                                        >{parseFloat(val.settledAmount).toLocaleString('en-IN')}</TableCell>
                                        {isWideScreen && (
                                            <TableCell align='right'>
                                                <div className="flex gap-2 justify-end">
                                                    {val.billStatus === 'Print' ? (
                                                        <button className="StartDelivery px-2 py-2 rounded-md text-white" onClick={() => { updateBillStatus(val.tokenNo); setTokenDataPopUp(false); }}>
                                                            Food Ready
                                                        </button>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button className='cursor-pointer CompleteDelivery px-2 py-2 rounded-md text-white' onClick={() => { updateBillStatus(val.tokenNo); setTokenDataPopUp(false); }}>
                                                                Complete
                                                            </button>
                                                            <button className='cursor-pointer StopDelivery px-2 py-2 rounded-md text-white' onClick={() => { speakTokenNumber(val.tokenNo); setTokenDataPopUp(false); }}>
                                                                Token Speak
                                                            </button>
                                                            <button className='cursor-pointer ResetButton px-2 py-2 rounded-md text-white' onClick={() => { handleRevertStatus(val.billId); setTokenDataPopUp(false); }}>
                                                                Revert
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={isWideScreen ? 4 : 3} align="center">No data found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {!isWideScreen && (
                    <div className="flex gap-3 items-center my-2">
                        <button
                            className='cursor-pointer w-full CompleteDelivery py-2 px-3 rounded-md text-center text-white'
                            onClick={() => {
                                clearDispay();
                            }}
                        >
                            Clear Display
                        </button>
                        <button
                            className='cursor-pointer w-full StartDelivery py-2 px-3 rounded-md text-center text-white'
                            onClick={() => {
                                AllTokenCompelete();
                            }}
                        >
                            Complete All
                        </button>
                    </div>
                )}
            </div>
            {!isWideScreen && (
                <Modal
                    open={tokenDataPopUp}
                    onClose={() => setTokenDataPopUp(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    disableAutoFocus
                >
                    <Box sx={style}>
                        <div className="PopUpToenNo font-semibold text-center text-ms p-2 px-4 border-b border-gray-300">Token No:- {tokenValues.tokenNo}</div>
                        <div>
                            <div className="FoodReadyButton my-2 px-4">
                                {tokenValues.billStatus === 'Print' ? (
                                    <>
                                        <button className='cursor-pointer StartDelivery py-2 px-3 rounded-md w-full text-center text-lg text-white' onClick={() => { updateBillStatus(tokenValues.tokenNo); setTokenDataPopUp(false); }}>
                                            Food Ready
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className='cursor-pointer CompleteDelivery py-2 px-3 my-1 rounded-md w-full text-center text-lg text-white' onClick={() => { updateBillStatus(tokenValues.tokenNo); setTokenDataPopUp(false); }}>
                                            Complete
                                        </button>
                                        <button className='cursor-pointer py-2 px-3 my-1 StopDelivery rounded-md w-full text-center text-lg text-white' onClick={() => { speakTokenNumber(tokenValues.tokenNo); setTokenDataPopUp(false); }}>
                                            Token Speak
                                        </button>
                                        <button className='cursor-pointer ResetButton py-2 px-3 my-1 rounded-md w-full text-center text-lg text-white' onClick={() => { handleRevertStatus(tokenValues.billId); setTokenDataPopUp(false); }}>
                                            Revert
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Box>
                </Modal>
            )}
            <ToastContainer />
        </div>
    );
};

export default TokenViewForMobile;

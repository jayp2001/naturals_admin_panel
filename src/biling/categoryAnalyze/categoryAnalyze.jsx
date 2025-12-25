import './categoryAnalyze.css';
import * as React from "react";
import { useState, useEffect } from "react";
import { BACKEND_BASE_URL } from '../../url';
import axios from 'axios';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { ToastContainer, toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
function CategoryAnalyze() {



    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [data1, setData1] = React.useState([]);
    const [data2, setData2] = React.useState([]);
    const [data3, setData3] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filter, setFilter] = React.useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    const getData = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getThreeCategorDashBoardData`, config)
            .then((res) => {
                setData1(res.data.inventoryCategory)
                setData2(res.data.staffCategory)
                setData3(res.data.businessCategory)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/getThreeCategorDashBoardData?startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
            .then((res) => {
                setData1(res.data.inventoryCategory)
                setData2(res.data.staffCategory)
                setData3(res.data.businessCategory)
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }

    useEffect(() => {
        getData()
    }, [])
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
        <div className='productListContainer'>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12 pl-3'>
                            <div className={`flex col-span-3 justify-center productTabAll`}>
                                <div className='statusTabtext'>Category Analyzes</div>
                            </div>
                            <div className='col-span-4 col-start-9 flex justify-end pr-4'>
                                <div className='dateRange text-center self-center' aria-describedby={id} onClick={handleClick}>
                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                </div>
                                <div className='resetBtnWrap col-span-3 self-center'>
                                    <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                        setFilter(false);
                                        getData()
                                        setState([
                                            {
                                                startDate: new Date(),
                                                endDate: new Date(),
                                                key: 'selection'
                                            }
                                        ])
                                    }}><CloseIcon /></button>
                                </div>

                                <Popover
                                    id={id}
                                    open={open}
                                    style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                >
                                    <Box sx={{ bgcolor: 'background.paper', padding: '20px', width: 'auto', height: 'auto', borderRadius: '10px' }}>
                                        <DateRangePicker
                                            ranges={state}
                                            onChange={item => { setState([item.selection]); console.log([item.selection]) }}
                                            direction="horizontal"
                                            months={2}
                                            showSelectionPreview={true}
                                            moveRangeOnFirstSelection={false}
                                        />
                                        <div className='mt-8 grid gap-4 grid-cols-12'>
                                            <div className='col-span-3 col-start-7'>
                                                <button className='stockInBtn' onClick={() => {
                                                    setFilter(true); getDataByFilter(); handleClose()
                                                }}>Apply</button>
                                            </div>
                                            <div className='col-span-3'>
                                                <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                            </div>
                                        </div>
                                    </Box>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-12 mt-4'>
                    <div className='grid grid-cols-3 gap-6'>
                        <div className='mt-6 analyzeContainer'>
                            <div className='analyzeHeaderBlue flex justify-between px-4 justify-self-center'>
                                <div>
                                    Inventory
                                </div>
                                <div>
                                    ₹ {parseFloat(data1.categorySum ? data1.categorySum : 0).toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className='listContainer'>
                                {data1?.categoryList?.map((data, index) => (
                                    <>
                                        <div className='flex justify-between py-2'>
                                            <div className='categoryTxt'>
                                                {data.categoryName}
                                            </div>
                                            <div className='categoryTxt'>
                                                ₹ {parseFloat(data.totalRs ? data.totalRs : 0).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        {(index + 1 != data1?.categoryList?.length) &&
                                            < hr />
                                        }
                                    </>

                                ))
                                }
                            </div>
                        </div>
                        <div className='mt-6 analyzeContainer'>
                            <div className='analyzeHeaderRed flex justify-between px-4 justify-self-center'>
                                <div>
                                    Staff
                                </div>
                                <div>
                                    ₹ {parseFloat(data2.categorySum ? data2.categorySum : 0).toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className='listContainer'>
                                {data2?.categoryList?.map((data, index) => (
                                    <>
                                        <div className='flex justify-between py-2'>
                                            <div className='categoryTxt'>
                                                {data.categoryName}
                                            </div>
                                            <div className='categoryTxt'>
                                                ₹ {parseFloat(data.totalRs ? data.totalRs : 0).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        {(index + 1 != data2?.categoryList?.length) &&
                                            < hr />
                                        }
                                    </>

                                ))
                                }
                            </div>
                        </div>
                        <div className='mt-6 analyzeContainer'>
                            <div className='analyzeHeaderGreen flex justify-between px-4 justify-self-center'>
                                <div>
                                    Business
                                </div>
                                <div>
                                    ₹ {parseFloat(data3.categorySum ? data3.categorySum : 0).toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div className='listContainer'>
                                {data3?.categoryList?.map((data, index) => (
                                    <>
                                        <div className='flex justify-between py-2'>
                                            <div className='categoryTxt'>
                                                {data.categoryName}
                                            </div>
                                            <div className='categoryTxt'>
                                                ₹ {parseFloat(data.totalRs ? data.totalRs : 0).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        {(index + 1 != data3?.categoryList?.length) &&
                                            < hr />
                                        }
                                    </>

                                ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default CategoryAnalyze;
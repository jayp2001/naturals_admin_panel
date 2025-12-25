import './editHistory.css';
import * as React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CountCard from '../countCard/countCard';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

function EditHistory() {
    const navigate = useNavigate();
    let { id } = useParams();
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
    const ids = open ? 'simple-popover' : undefined;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [data, setData] = React.useState();

    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getUpdateStockOutListById?page=${1}&numPerPage=${5}&stockOutId=${id}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    useEffect(() => {
        getData();
    }, [])
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}inventoryrouter/getUpdateStockOutListById?page=${pageNum}&numPerPage=${rowPerPageNum}&stockOutId=${id}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const deleteData = async () => {
        if (window.confirm('Are you sure you want to delete all edit history ....!')) {
            await axios.delete(`${BACKEND_BASE_URL}inventoryrouter/emptyModifiedHistoryOfStockOutById?stockOutId=${id}`, config)
                .then((res) => {
                    setPage(0);
                    setSuccess(true)
                    setRowsPerPage(5);
                    getData();
                })
                .catch((error) => {
                    setError(error.response ? error.response.data : "Network Error ...!!!")
                })
        }
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        getDataOnPageChange(newPage + 1, rowsPerPage)
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getDataOnPageChange(1, parseInt(event.target.value, 10))
    };
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
            setSuccess(false);
            navigate(`/stockInOut`)
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
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  desktop2:col-span-7 '>
                                <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                    <div className={`flex col-span-3 justify-center productTabAll`}>
                                        <div className='statusTabtext'>Edit History</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='userTableSubContainer mt-8'>
                <div className='grid grid-cols-12 pt-6'>
                    <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                        <button className='exportExcelBtn' onClick={deleteData}><CloseIcon />&nbsp;&nbsp;Delete All History</button>
                    </div>
                </div>
                <div className='tableContainerWrapper'>
                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Edited By</TableCell>
                                    <TableCell align="left">Product Name</TableCell>
                                    <TableCell align="left">Previous Data</TableCell>
                                    <TableCell align="left">Updated Data</TableCell>
                                    <TableCell align="left">Reason</TableCell>
                                    <TableCell align="left">Last Modified Date</TableCell>
                                    <TableCell align="left">Modified Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.map((row, index) => (
                                    totalRows !== 0 ?
                                        <TableRow
                                            hover
                                            key={row.stockOutId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            style={{ cursor: "pointer" }}
                                            className='tableRow'
                                        >
                                            <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                            <Tooltip title={row.userFullName} placement="top-start" arrow>
                                                <TableCell component="th" scope="row">
                                                    {row.userName}
                                                </TableCell>
                                            </Tooltip>
                                            <TableCell align="left" >{row.productName}</TableCell>
                                            <TableCell align="left" >{row.previous}</TableCell>
                                            <TableCell align="left" >{row.updated}</TableCell>
                                            <Tooltip title={row.modifiedReason} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.modifiedReason}</div></TableCell></Tooltip>
                                            <TableCell align="left" >{row.previousDateTime}</TableCell>
                                            <TableCell align="left" >{row.updatedDateTime}</TableCell>
                                        </TableRow> :
                                        <TableRow
                                            key={row.userId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                        </TableRow>

                                ))}
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
            <ToastContainer />
        </div>
    )
}

export default EditHistory;

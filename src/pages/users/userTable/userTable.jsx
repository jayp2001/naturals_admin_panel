import './userTable.css'
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Menutemp from './menu';

function UserTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalRows, setTotalRows] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [data, setData] = React.useState();
    const getData = async () => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}userrouter/getUserDetails?page=${page + 1}&numPerPage=${rowsPerPage}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const getDataOnPageChange = async (pageNum, rowPerPageNum) => {
        console.log("page get", page, rowsPerPage)
        await axios.get(`${BACKEND_BASE_URL}userrouter/getUserDetails?page=${pageNum}&numPerPage=${rowPerPageNum}`, config)
            .then((res) => {
                setData(res.data.rows);
                setTotalRows(res.data.numRows);
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    const deleteData = async (id) => {
        await axios.delete(`${BACKEND_BASE_URL}userrouter/removeUser?userId=${id}`, config)
            .then((res) => {
                alert("data deleted")
            })
            .catch((error) => {
                alert(error.response.data)
            })
    }
    useEffect(() => {
        getData();
    }, [])
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
    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete User?")) {
            deleteData(id);
            setTimeout(() => {
                getData()
            }, 1000)
        }
    }

    return (
        <div className='grid grid-cols-12 userTableContainer'>
            <div className='col-span-10 col-start-2'>
                <div className='userTableSubContainer'>
                    <div className='flex justify-center w-full'>
                        <div className='tableHeader flex justify-between'>
                            <div>
                                User List
                            </div>
                        </div>
                    </div>
                    <div className='tableContainerWrapper'>
                        <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="left">Gender</TableCell>
                                        <TableCell align="left">User Name</TableCell>
                                        <TableCell align="left">Password</TableCell>
                                        <TableCell align="left">Role</TableCell>
                                        <TableCell align="left">email</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.map((row, index) => (
                                        totalRows !== 0 ?
                                            <TableRow
                                                hover
                                                key={row.userId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                style={{ cursor: "pointer" }}
                                                className='tableRow'
                                            >
                                                <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.userFullName}
                                                </TableCell>
                                                <TableCell align="left" >{row.userGender}</TableCell>
                                                <TableCell align="left" >{row.userName}</TableCell>
                                                <TableCell align="left" >{row.password}</TableCell>
                                                <TableCell align="left" >{row.rightsName}</TableCell>
                                                <TableCell align="left" >{row.emailAddress}</TableCell>
                                                <TableCell align="right">
                                                    <Menutemp bookId={row.userId} deleteBook={handleDeleteUser} />
                                                </TableCell>
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
            </div>

        </div>
    )
}

export default UserTable;
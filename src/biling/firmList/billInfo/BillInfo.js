import React, { useState } from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import { Box, InputAdornment, Paper, Popover, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import CountCard from '../../../pages/inventory/countCard/countCard';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import TableContainer from '@mui/material/TableContainer';

const BillInfo = () => {
    const [tab, setTab] = useState('All');
    const [searchWord, setSearchWord] = React.useState();
    const [dataSearch, setDataSearch] = React.useState();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [filter, setFilter] = React.useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    return (
        <div>
            <div className='grid grid-cols-12 mt-3'>
                <div className='col-span-12 px-8 py-4 '>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  '>
                                <div className='grid grid-cols-12 pl-6 g h-full'>
                                    <div className={`flex col-span-2 justify-center ${tab === 'All' || tab === '' || !tab ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => { setTab('All'); setSearchWord(''); setDataSearch([]) }}
                                    >
                                        <div className='statusTabtext'>All</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tab === 'Dine In' || tab === '' || !tab ? 'productTabUnder text-red-600' : 'productTab'}`}
                                        onClick={() => { setTab('Dine In'); setSearchWord(''); setDataSearch([]) }}
                                    >
                                        <div className='statusTabtext'>Dine In</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tab === 'Delivery' || tab === '' || !tab ? 'productTabIn' : 'productTab'}`}
                                        onClick={() => { setTab('Delivery'); setSearchWord(''); setDataSearch([]) }}
                                    >
                                        <div className='statusTabtext'>Delivery</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tab === 'Pick Up' || tab === '' || !tab ? 'productTabOut' : 'productTab'}`}
                                        onClick={() => { setTab('Pick Up'); setSearchWord(''); setDataSearch([]) }}
                                    >
                                        <div className='statusTabtext'>Pick Up</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tab === 'Online' || tab === '' || !tab ? 'productTabOutdated' : 'productTab'}`}
                                        onClick={() => { setTab('Online'); setSearchWord(''); setDataSearch([]) }}
                                    >
                                        <div className='statusTabtext'>Online</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tab === 'Hotel' || tab === '' || !tab ? 'productTabOutdatedHotel' : 'productTab'}`}
                                        onClick={() => { setTab('Hotel'); setSearchWord(''); setDataSearch([]) }}
                                    >
                                        <div className='statusTabtext'>Hotel</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3  h-full'>
                                Slect date
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-4 gap-6'>
                        <CountCard color={'blue'} />
                        <CountCard color={'green'} />
                        <CountCard color={'yellow'} />
                        <CountCard color={'pink'} />
                    </div>
                    <div className='grid grid-cols-12 mt-6'>
                        <div className='col-span-12'>
                            <div className='userTableSubContainer'>
                                <div className='grid grid-cols-12 pt-6'>
                                    <div className='col-span-3 pl-8'>
                                        <TextField
                                            className='sarchText'
                                            // onChange={(e) => { onSearchChange(e); debounceFunction() }}
                                            value={searchWord}
                                            name="searchWord"
                                            id="searchWord"
                                            variant="standard"
                                            label="Search"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                                                style: { fontSize: 14 }
                                            }}
                                            InputLabelProps={{ style: { fontSize: 14 } }}
                                            fullWidth
                                        />
                                    </div>
                                    <div className='col-span-6 col-start-7 pr-5 flex justify-end'>
                                        <button className='exportExcelBtn'><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>
                                    </div>
                                </div>
                                <div className='tableContainerWrapper'>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '10px', paddingRight: '10px' }} component={Paper}>
                                        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>No.</TableCell>
                                                    <TableCell>Bill No</TableCell>
                                                    <TableCell>Bill Pay Type</TableCell>
                                                    <TableCell>Bill Amount</TableCell>
                                                    <TableCell align="left">Discount</TableCell>
                                                    <TableCell align="left">Sattele mount </TableCell>
                                                    {/* <TableCell align="left">Date</TableCell> */}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                            </TableBody>
                                        </Table>
                                        {/* <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={totalRows}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        /> */}
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
 
                </div >
            </div >
        </div >
    )
}
export default BillInfo
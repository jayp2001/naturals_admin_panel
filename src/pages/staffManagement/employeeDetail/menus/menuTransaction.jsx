import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";


const ITEM_HEIGHT = 48;

function MenuTransaction(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const navigate = useNavigate();
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEditClick = (id) => {
        navigate(`/editSuppiler/${id}`)
    }
    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {props.data.fineAmount == props.data.remainFineAmount &&
                    <MenuItem key={'delete'}
                        onClick={() => {
                            handleClose();
                            props.handleDeleteTransaction(props.data.remainSalaryId)
                        }}>
                        Delete
                    </MenuItem>
                }
                <MenuItem key={'Edit'}
                    onClick={() => {
                        handleClose();
                        props.getInvoice(props.data.remainSalaryId)
                    }}>
                    Print Salary Slip
                </MenuItem>
                <MenuItem key={'view'}
                    onClick={() => {
                        handleClose();
                        props.handleOpenModelCalculation(props.data.remainSalaryId, props.data.salaryPay, props.data.advanceCut, props.data.fineCut)
                    }}>
                    View Calculation
                </MenuItem>
                {/* {
                    props.data.fineStatus ?

                        <MenuItem key={'ignore'}
                            onClick={() => {
                                handleClose();
                                props.markAsIgnore(props.data.fineId)
                            }}>
                            Ignore
                        </MenuItem>
                        :
                        <MenuItem key={'consider'}
                            onClick={() => {
                                handleClose();
                                props.markAsConsider(props.data.fineId)
                            }}>
                            Consider
                        </MenuItem>
                } */}
            </Menu>
        </div >
    );
}

export default MenuTransaction;



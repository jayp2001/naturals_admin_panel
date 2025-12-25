import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";


const ITEM_HEIGHT = 48;

function MenuFine(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        if (props.data.fineAmount == props.data.remainFineAmount) {
            setAnchorEl(event.currentTarget);
        }
        else {
            props.setError('you can not edit or delete Current row')
        }
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
                {props.data.fineAmount == props.data.remainFineAmount ?
                    <>
                        <MenuItem key={'delete'}
                            onClick={() => {
                                handleClose();
                                props.handleDeleteFine(props.data.fineId)
                            }}>
                            Delete
                        </MenuItem>

                        <MenuItem key={'Edit'}
                            onClick={() => {
                                handleClose();
                                props.handleReduceFine(props.data.fineId, props.data.remainFineAmount)
                            }}>
                            Reduce Fine Amount
                        </MenuItem>

                        {props.data.fineStatus ?
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
                        }
                    </> :
                    <></>
                }
            </Menu>
        </div >
    );
}

export default MenuFine;



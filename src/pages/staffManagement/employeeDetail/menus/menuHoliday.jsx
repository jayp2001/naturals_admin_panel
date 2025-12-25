import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";


const ITEM_HEIGHT = 48;
function isDateInCurrentMonth(dateString) {
    // Parse the input date string into a Date object
    const parts = dateString.split('-');
    if (parts.length !== 3) {
        return false; // Invalid date string format
    }
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-based
    const year = parseInt(parts[2], 10);

    // Create a Date object from the parsed components
    const date = new Date(year, month, day);

    // Get the current date
    const currentDate = new Date();

    // Check if the year and month match the current year and month
    return (
        date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth()
    );
}
function MenuHoliday(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const isInCurrentMonth = isDateInCurrentMonth(props.data.holidayLeaveDate);
    const handleClick = (event) => {
        if (isInCurrentMonth) {
            setAnchorEl(event.currentTarget);
        }
        else {
            props.setError('you can only edit or delete Current month data')
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
                {isInCurrentMonth &&
                    <MenuItem key={'Edit'}
                        onClick={() => {
                            handleClose();
                            props.handleDeleteHoliday(props.data.holidayId)
                        }}>
                        Delete
                    </MenuItem>}
            </Menu>
        </div >
    );
}

export default MenuHoliday;



import './exportMenu.css';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
const ITEM_HEIGHT = 48;
function ExportMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const navigate = useNavigate();
    const handleClose = () => {
        setAnchorEl(null);
    };
    // const handleEditClick = (id) => {
    //     navigate(`/editSuppiler/${id}`)
    // }
    return (
        <div>
            {/* <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton> */}
            <button className={props.isDisable ? 'disableExport' : `exportBtn`}
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={props.isDisable ? () => { } : handleClick}
            ><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>
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
                <MenuItem key={'delete'}
                    onClick={() => {
                        handleClose();
                        props.exportExcel()
                    }}
                >
                    <DescriptionIcon /> &nbsp;&nbsp;&nbsp;&nbsp;Export As Excel
                </MenuItem>
                <MenuItem key={'Edit'}
                    onClick={() => {
                        handleClose();
                        props.exportPdf()
                    }}
                >
                    <PictureAsPdfIcon /> &nbsp;&nbsp;&nbsp;&nbsp;Export As Pdf
                </MenuItem>
            </Menu>
        </div >
    );
}

export default ExportMenu;
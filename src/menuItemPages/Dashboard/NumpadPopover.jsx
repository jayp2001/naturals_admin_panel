import React, { useEffect, useState } from 'react';
import { Popover, Box, IconButton } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import BackspaceIcon from '@mui/icons-material/Backspace';
import './NumpadPopover.css';

const NumpadPopover = ({
    open,
    anchorEl,
    onClose,
    value,
    onChange,
    onApply
}) => {
    const [anchorOrigin, setAnchorOrigin] = useState({
        vertical: 'center',
        horizontal: 'right',
    });
    const [transformOrigin, setTransformOrigin] = useState({
        vertical: 'center',
        horizontal: 'left',
    });
    const [arrowPosition, setArrowPosition] = useState('50%');

    useEffect(() => {
        if (anchorEl && open) {
            const rect = anchorEl.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const spaceRight = viewportWidth - rect.right;
            const popoverWidth = 180; // Width of the numpad
            const popoverHeight = 270; // Approximate height of the numpad
            const spaceLeft = rect.left;

            // Calculate the vertical position of the text field center
            const fieldCenterY = rect.top + (rect.height / 2);

            // Calculate where the popover will be positioned vertically
            const popoverTop = Math.max(8, Math.min(fieldCenterY - (popoverHeight / 2), viewportHeight - popoverHeight - 8));

            // Calculate arrow position relative to popover
            const arrowY = fieldCenterY - popoverTop;
            const arrowPercent = Math.max(10, Math.min((arrowY / popoverHeight) * 100, 90));

            setArrowPosition(`${arrowPercent}%`);

            // If not enough space on right and more space on left, position on left
            if (spaceRight < popoverWidth && spaceLeft > spaceRight) {
                setAnchorOrigin({
                    vertical: 'center',
                    horizontal: 'left',
                });
                setTransformOrigin({
                    vertical: 'center',
                    horizontal: 'right',
                });
            } else {
                setAnchorOrigin({
                    vertical: 'center',
                    horizontal: 'right',
                });
                setTransformOrigin({
                    vertical: 'center',
                    horizontal: 'left',
                });
            }
        }
    }, [anchorEl, open]);

    const handleNumberClick = (num) => {
        onChange(value + num);
    };

    const handleDecimalClick = () => {
        if (!value.includes('.')) {
            onChange(value + '.');
        }
    };

    const handleBackspace = () => {
        onChange(value.slice(0, -1));
    };

    const handleIncrement = () => {
        const currentValue = parseFloat(value) || 0;
        onChange(String(currentValue + 1));
    };

    const handleDecrement = () => {
        const currentValue = parseFloat(value) || 0;
        const newValue = Math.max(0, currentValue - 1);
        onChange(String(newValue));
    };

    const handleKeyPress = (num) => {
        if (num === 'backspace') {
            handleBackspace();
        } else if (num === '.') {
            handleDecimalClick();
        } else {
            handleNumberClick(num);
        }
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            disableRestoreFocus
            slotProps={{
                paper: {
                    style: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        overflow: 'visible',
                        zIndex: 1303,
                        marginLeft: anchorOrigin.horizontal === 'right' ? '15px' : '-15px',
                        marginRight: anchorOrigin.horizontal === 'left' ? '0' : '0',
                    },
                    onMouseDown: (e) => {
                        e.stopPropagation();
                    },
                    sx: {
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 0,
                            height: 0,
                            borderTop: '10px solid transparent',
                            borderBottom: '10px solid transparent',
                            ...(anchorOrigin.horizontal === 'right' ? {
                                borderRight: '10px solid #1a73e8',
                                left: '-10px',
                                top: arrowPosition,
                                transform: 'translateY(-50%)',
                                filter: 'drop-shadow(-2px 0 3px rgba(0,0,0,0.2))',
                            } : {
                                borderLeft: '10px solid #1a73e8',
                                right: '-10px',
                                top: arrowPosition,
                                transform: 'translateY(-50%)',
                                filter: 'drop-shadow(2px 0 3px rgba(0,0,0,0.2))',
                            })
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: 0,
                            height: 0,
                            borderTop: '12px solid transparent',
                            borderBottom: '12px solid transparent',
                            ...(anchorOrigin.horizontal === 'right' ? {
                                borderRight: '12px solid #1557b0',
                                left: '-11px',
                                top: arrowPosition,
                                transform: 'translateY(-50%)',
                                zIndex: -1,
                            } : {
                                borderLeft: '12px solid #1557b0',
                                right: '-11px',
                                top: arrowPosition,
                                transform: 'translateY(-50%)',
                                zIndex: -1,
                            })
                        }
                    }
                }
            }}
            sx={{ zIndex: 1303 }}
        >
            <Box className="numpad-container">
                {/* Display with increment/decrement buttons */}
                <div className="numpad-display-section">
                    <IconButton
                        className="numpad-inc-dec-btn"
                        onClick={handleDecrement}
                    >
                        <RemoveIcon />
                    </IconButton>

                    <div className="numpad-display">
                        {value || '0'}
                    </div>

                    <IconButton
                        className="numpad-inc-dec-btn"
                        onClick={handleIncrement}
                    >
                        <AddIcon />
                    </IconButton>
                </div>

                {/* Number pad grid */}
                <div className="numpad-grid">
                    {/* Row 1: 7, 8, 9 */}
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('7')}
                    >
                        7
                    </button>
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('8')}
                    >
                        8
                    </button>
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('9')}
                    >
                        9
                    </button>

                    {/* Row 2: 4, 5, 6 */}
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('4')}
                    >
                        4
                    </button>
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('5')}
                    >
                        5
                    </button>
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('6')}
                    >
                        6
                    </button>

                    {/* Row 3: 1, 2, 3 */}
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('1')}
                    >
                        1
                    </button>
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('2')}
                    >
                        2
                    </button>
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('3')}
                    >
                        3
                    </button>

                    {/* Row 4: ., 0, backspace */}
                    <button
                        className="numpad-btn numpad-decimal"
                        onClick={() => handleKeyPress('.')}
                    >
                        .
                    </button>
                    <button
                        className="numpad-btn numpad-number"
                        onClick={() => handleKeyPress('0')}
                    >
                        0
                    </button>
                    <button
                        className="numpad-btn numpad-backspace"
                        onClick={() => handleKeyPress('backspace')}
                    >
                        <BackspaceIcon />
                    </button>
                </div>
            </Box>
        </Popover>
    );
};

export default NumpadPopover;


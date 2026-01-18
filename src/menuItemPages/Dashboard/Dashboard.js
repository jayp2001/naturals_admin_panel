/* eslint-disable no-dupe-keys */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import './css/Dashboard.css';
import { useState, useEffect, useRef } from "react";
import React from 'react';
import { BACKEND_BASE_URL } from '../../url';
import Table from '@mui/material/Table';
import PropTypes from 'prop-types';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TableRow from '@mui/material/TableRow';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Modal from '@mui/material/Modal';
import { styled, alpha } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useSpring, animated } from '@react-spring/web';
import Menu from '@mui/material/Menu';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, Checkbox, Divider, FilledInput, FormControlLabel, FormHelperText, FormLabel, Input, InputAdornment, Paper, Radio, RadioGroup, Switch } from '@mui/material';
import { ReactTransliterate } from 'react-transliterate';
import { getUnit } from '@mui/material/styles/cssUtils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const Fade = React.forwardRef(function Fade(props, ref) {
    const {
        children,
        in: open,
        onClick,
        onEnter,
        onExited,
        ownerState,
        ...other
    } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null, true);
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </animated.div>
    );
});
Fade.propTypes = {
    children: PropTypes.element.isRequired,
    in: PropTypes.bool,
    onClick: PropTypes.any,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
    ownerState: PropTypes.any,
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

const variantsModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '95vw',
        sm: '90vw',
        md: '85vw',
        lg: 1000,
        xl: 1000
    },
    maxWidth: {
        xs: '95vw',
        sm: '90vw',
        md: '85vw',
        lg: '1000px',
        xl: '1000px'
    },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '10px'
};
const copyMenuStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px'
};

const addProductModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '95vw',   // 95% width on extra small screens
        sm: '90vw',   // 90% width on small screens
        md: '85vw',   // 85% width on medium screens
        lg: 1200,     // Fixed 1200px on large screens
        xl: 1200      // Fixed 1200px on extra large screens
    },
    maxWidth: {
        xs: '95vw',
        sm: '90vw',
        md: '85vw',
        lg: '1200px',
        xl: '1200px'
    },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,  // Reduced from 4 (32px) to 2 (16px)
    maxHeight: '90vh',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    zIndex: 1301
};
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));
function MenuDashboard() {
    // Add global styles for ReactTransliterate suggestions
    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .react-transliterate-suggestions,
            [class*="react-transliterate-suggestions"],
            div[class*="suggestions"],
            ul[class*="suggestions"] {
                position: fixed !important;
                z-index: 99999 !important;
                background: white !important;
                border: 1px solid #ccc !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                max-height: 200px !important;
                overflow-y: auto !important;
                pointer-events: auto !important;
            }
            .MuiModal-root {
                overflow: visible !important;
            }
            .MuiModal-backdrop {
                z-index: 1300 !important;
            }
            .MuiModal-root > .MuiBox-root,
            .addProdutModal {
                z-index: 1301 !important;
                position: relative !important;
            }
            .MuiPopover-root,
            .MuiMenu-root {
                z-index: 9999 !important;
            }
            .MuiDrawer-root {
                z-index: 10000 !important;
            }
            .MuiDrawer-root .MuiBackdrop-root {
                z-index: 10000 !important;
            }
            .MuiDrawer-root .MuiPaper-root {
                z-index: 10001 !important;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    useEffect(() => {
        getAllCategory();
        getSubCategory(menuId);
        getAllUnits();
        // getAllItems(menuId);
    }, []);

    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        getAllUnits();
        setOpen(false);
        setEditItem(false)
        setVariantFields([])
        setEditData(null)
        setCommonPreferredNameIsGujarati(true)
        setDisabled(true)
        setEditPricePopUp(false)
        setEditPriceType({
            percentage: false,
            fixed: false
        })
        setManualVariantsPopUp(false)
        setVariantMode({
            isEdit: false,
            isView: true
        })
        setCopyMenuPopUp(false)
        setFullData({
            itemName: '',
            itemGujaratiName: '',
            itemCode: '',
            itemShortKey: '',
            itemSubCategory: '',
            itemDescription: '',
            variantsList: []
        })
        setAllFormValidation({
            itemName: false,
            itemGujaratiName: false,
            itemCode: false,
            price: false,
            itemShortKey: false,
            itemSubCategory: false,
            itemDescription: false,
            variantsList: {
                unit: false,
                price: false
            }
        })
        // secondVariantData
        // setVeriantsFields()
        setSecondVariantData({
            unit: '',
            price: '',
            status: true,
            preferredName: '',
            preferredNameIsGujarati: true
        })
        setUnit({ unit: '', price: '1', status: true, preferredName: '', preferredNameIsGujarati: true });
        setPrice(null)
        setSubCategoryId('')
        setCopyMenuCheckBox(false)
        setEditPrice({
            percentage: '',
            fixed: ''
        })
    }
    const [dataSearch, setDataSearch] = React.useState();
    const [sideBarColor, setSideBarColor] = useState(false);
    const [searchWord, setSearchWord] = React.useState();
    const [suppiler, setSuppilerList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [countData, setCountData] = React.useState();
    const [addVariant, setAddVariant] = React.useState(false);
    const [variantFields, setVariantFields] = React.useState([]);
    const [categoryName, setCategoryName] = useState();
    const [variantFieldsMap, setVariantFieldsMap] = useState({});
    const [subCategories, setSubCategories] = useState([]);
    const [getAllUnit, setGetAllUnit] = useState();
    const [unit, setUnit] = React.useState({ unit: '', price: '1', status: true, preferredName: '', preferredNameIsGujarati: true });
    const [commonPreferredNameIsGujarati, setCommonPreferredNameIsGujarati] = useState(true);
    const [subCategoryId, setSubCategoryId] = useState(null);
    const priceInputRef = useRef(null);
    const [menuCategory, setMenuCategory] = useState([]);
    const [editPriceValueType, setEditPriceValueType] = useState('')
    const [menuId, setMenuId] = useState('base_2001');
    const [fullData, setFullData] = useState({
        itemName: '',
        itemGujaratiName: '',
        itemCode: '',
        itemShortKey: '',
        itemSubCategory: '',
        isJain: '',
        isPureJain: '',
        spicyLevel: '',
        itemDescription: '',
        variantsList: []
    });
    const [itemData, setItemData] = useState([]);
    const [editItem, setEditItem] = useState(false);
    const [subCategoryFirstId, setSubCategoryFirstId] = useState();
    const [editData, setEditData] = useState(null);
    const [subCategoryName, setSubCategoryName] = useState();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [toggle, setToggle] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [success, setSuccess] = React.useState(false);
    const [editPricePopUp, setEditPricePopUp] = useState(false)

    const [editPriceType, setEditPriceType] = useState({
        percentage: true,
        fixed: false
    })
    const [editPrice, setEditPrice] = useState({
        percentage: '',
        fixed: ''
    })
    const [editPriceMode, setEditPriceMode] = useState(false)
    const [clickedSubCategory, setClickedSubCategory] = useState(null);
    const [editItemPopUp, setEditItemPopup] = useState(false)
    const [unitPrice, setUnitPrice] = React.useState('');
    const [subCategoryStatus, setSubCategoryStatus] = useState('')
    const [allFormValidation, setAllFormValidation] = useState({
        itemName: false,
        itemGujaratiName: false,
        itemCode: false,
        price: false,
        itemShortKey: false,
        itemSubCategory: false,
        itemDescription: false,
        variantsList: {
            unit: false,
            price: false
        }
    });
    const [manualVariantsPopUp, setManualVariantsPopUp] = useState(false)
    const [variantEditData, setVariantEditData] = useState([]);
    const [variantMode, setVariantMode] = useState({
        isEdit: false,
        isView: true
    })
    const [variantsUpdatedData, setVariantsUpdatedData] = useState({
        unit: '',
        price: ''
    })
    const [secondVariantData, setSecondVariantData] = useState({
        unit: '',
        price: '',
        status: true,
        preferredName: '',
        preferredNameIsGujarati: true
    })
    const scrollRef = useRef(null);
    const [varinatsItemObject, setVariantsItemObject] = useState([]);
    const [itemDataNull, setItemDataNull] = useState(true);
    const [variantsFullData, setVariantsFullData] = useState({
        itemName: '',
        itemGujaratiName: '',
        itemCode: '',
        itemShortKey: '',
        itemSubCategory: '',
        itemDescription: '',
        variantsList: []
    });
    const [menuName, setMenuName] = useState('')
    const [copyMenuPopUp, setCopyMenuPopUp] = useState(false)
    const [copyMenuItems, setCopyMenuItems] = useState([])
    const [price, setPrice] = useState(null);
    const [copyMenuCheckBox, setCopyMenuCheckBox] = useState(false)
    const [updatedVarintsName, setUpdatedVariantsName] = useState([]);
    const [copySource, setCopySource] = useState('')
    const addingUnitName = useRef(null)
    const [finalSelected, setFinalSelected] = useState();
    const [copySubCategoryId, setCopySubCategoryId] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [inputError, setInputError] = useState('');
    const autoFocus = useRef(null)
    const [isDragDropMode, setIsDragDropMode] = useState(false);
    const [tempSubCategories, setTempSubCategories] = useState([]);
    if (loading) {
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
                position: "top-right",
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
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false);
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "top-right",
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
    // useEffect(() => {
    //     if (clickedSubCategory && scrollRef.current) {
    //         scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //     }
    // }, [clickedSubCategory]);

    const handleSUbmitForm = async () => {
        let formValidation;
        if (!editItem) {
            formValidation = {
                itemName: fullData.itemName.trim().length === 0,
                itemGujaratiName: fullData.itemGujaratiName.trim().length === 0,
                itemCode: fullData.itemCode.trim().length === 0,
                itemShortKey: fullData.itemShortKey.trim().length === 0,
                spicyLevel: !fullData?.spicyLevel,
                itemSubCategory: !fullData.itemSubCategory,
                variantsList: variantFields.length === 0 || variantFields.some(variant => variant.unit.trim().length === 0 || String(variant.price).trim().length === 0)
            };
            setAllFormValidation(formValidation);
        } else {
            formValidation = {
                itemName: editData.itemName.trim().length === 0,
                itemGujaratiName: editData.itemGujaratiName.trim().length === 0,
                itemCode: editData.itemCode === null,
                itemShortKey: editData.itemShortKey.trim().length === 0,
                itemSubCategory: !editData.itemSubCategory,
                variantsList: variantFields.length === 0 || variantFields.some(variant => variant.unit.trim().length === 0 || variant.price === null || String(variant.price).trim().length === 0)
            };
            setAllFormValidation(formValidation);
        }

        if (Object.values(formValidation).some(field => field)) {
            setError('Please Fill All Fields');
            return;
        }
        const token = localStorage.getItem('token');
        console.log('Full Form Data', fullData)

        if (!editItem) {
            await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/addItemData`,
                fullData,
                config
            )
                .then((res) => {
                    setSuccess(res.data);
                    setOpen(true);
                    setFullData({
                        itemName: '',
                        itemGujaratiName: '',
                        itemCode: '',
                        itemShortKey: '',
                        itemSubCategory: '',
                        itemDescription: '',
                        spicyLevel: '',
                        isJain: false,
                        isPureJain: false,
                        variantsList: []
                    });
                    autoFocus.current && autoFocus.current.focus();
                    setAllFormValidation({
                        itemName: false,
                        itemGujaratiName: false,
                        itemCode: false,
                        price: false,
                        itemShortKey: false,
                        itemSubCategory: false,
                        itemDescription: false,
                        spicyLevel: false,
                        variantsList: {
                            unit: false,
                            price: false
                        }
                    });
                    setUnit({
                        unit: '',
                        price: ''
                    })
                    setVariantFields([]);
                    getAllCategory();
                    console.log('final Selected Value ===>', finalSelected)
                    setEditItem(false)
                    // handleSubCategoryClick(finalSelected, menuId);
                    getAllUnits();
                    updatedSubCategory(menuId);
                    // getAllItems(menuId);
                    handleSubCategoryClick(fullData.itemSubCategory, menuId)
                    if (!editData) {
                        setPrice(null)
                    }
                })
                .catch((error) => {
                    setError(error?.response?.data || 'Network Error!..')
                })
        } else {
            const newData = {
                itemName: editData.itemName,
                itemDescription: editData.itemDescription,
                itemCode: editData.itemCode,
                menuCategoryId: menuId,
                spicyLevel: editData.spicyLevel,
                itemId: editData.itemId,
                isJain: editData.isJain,
                isPureJain: editData.isPureJain,
                itemGujaratiName: editData.itemGujaratiName,
                itemShortKey: editData.itemShortKey,
                itemSubCategory: editData.itemSubCategory,
                variantsList: variantFields
            };
            console.log('newData', newData)

            await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/updateItemData`,
                newData,
                config
            )
                .then((res) => {
                    setSuccess(res.data);
                    setOpen(true);
                    setFullData({
                        itemName: '',
                        itemGujaratiName: '',
                        itemCode: '',
                        itemShortKey: '',
                        itemSubCategory: '',
                        itemDescription: '',
                        spicyLevel: '',
                        variantsList: []
                    });
                    autoFocus.current && autoFocus.current.focus();
                    setAllFormValidation({
                        itemName: false,
                        itemGujaratiName: false,
                        itemCode: false,
                        price: false,
                        itemShortKey: false,
                        itemSubCategory: false,
                        spicyLevel: false,
                        itemDescription: false,
                        variantsList: {
                            unit: false,
                            price: false
                        }
                    });
                    setUnit({
                        unit: '',
                        price: ''
                    })
                    setEditData(null)
                    setVariantFields([]);
                    getAllCategory();
                    console.log('final Selected Value ===>', finalSelected)
                    // handleSubCategoryClick(finalSelected, menuId);
                    getAllUnits();
                    updatedSubCategory(menuId);
                    // getAllItems(menuId);
                    setOpen(false)
                    handleSubCategoryClick(editData.itemSubCategory, menuId)
                    setPrice(null)
                })
                .catch((error) => {
                    setError(error?.response?.data || 'Network Error!..')
                })
        }
    };

    const getAllCategory = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getMenuCategory`, config);
            setMenuCategory(response.data)
            setMenuId(response.data[0]?.menuCategoryId)
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    }
    // const getAllItems = async (menu) => {
    //     console.log('==>Menu Id Gett All Items <<==', menu)
    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             throw new Error("Token not found");
    //         }

    //         const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getItemData?menuId=${menu}`, config);
    //         setMenuId(menu)
    //     } catch (error) {
    //         setError(error?.response?.data || 'Network Error!!!...')
    //     }
    // };
    const handleItemDelete = async (id) => {
        const password = '123'
        const enteredPassword = prompt('Please Enter The Password');
        if (enteredPassword !== password) {
            alert('Incorrect password. Operation aborted.');
            return;
        }

        if (enteredPassword === password) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`${BACKEND_BASE_URL}menuItemrouter/removeItemData?itemId=${id}`, config)
                setSuccess(response.data)
                getAllUnits();
                // getAllItems(menuId);
                // getAllUnits();
                // getAllCategory();
                handleSubCategoryClick(finalSelected, menuId);
            }
            catch (error) {
                setError(error?.response?.data || 'Network Error!!!...')
            }
        }
    }
    const handleOpen = () => {
        setOpen(true);
        setDisabled(false);
        setEditItem(false);
        setEditData(null);
    };

    const addVariantFields = () => {
        const formValidation = {
            unit: unit.unit.trim().length === 0,
            unitPrice: unit.price.trim().length === 0 || unit.price === '0',
            preferredName: unit.preferredName.trim().length === 0
        };

        setAllFormValidation(formValidation);

        if (Object.values(formValidation).some(field => field)) {
            setError('Please Fill All Fields');
            return;
        }
        if (unit.price === 0) {
            return console.log('Error')
        }
        if (editData) {
            if (unit.unit === 'NO') {
                setEditData((prev) => ({
                    ...prev,
                    allVariantsList: prev.variantsList.map((variant, i) =>
                        i === 0 ? { ...variant, price: unit.price } : variant
                    ),
                }));
            }
        }

        const newVariant = { unit: unit.unit, price: unit.price, status: true, preferredName: unit.preferredName, preferredNameIsGujarati: commonPreferredNameIsGujarati, index: variantFields.length };

        setVariantFields(prevFields => [...prevFields, newVariant]);

        if (editData) {
            setEditData(prevState => ({
                ...prevState,
                variantsList: [...prevState.variantsList, { unit: unit.unit, price: unit.price, status: true, preferredName: unit.preferredName, preferredNameIsGujarati: commonPreferredNameIsGujarati }]
            }));
        } else {
            setFullData(prevState => ({
                ...prevState,
                variantsList: [...prevState.variantsList, { unit: unit.unit, price: unit.price, status: true, preferredName: unit.preferredName, preferredNameIsGujarati: commonPreferredNameIsGujarati }]
            }));
        }

        setGetAllUnit(prevUnits => prevUnits.filter(u => u !== unit.unit));
        setUnit({ unit: '', price: '1', status: true, preferredName: '', preferredNameIsGujarati: commonPreferredNameIsGujarati });
        setAddVariant(true);
        addingUnitName.current && addingUnitName.current.focus();
    };
    const addDefaultVariant = (defaultPrice) => {
        const defaultUnit = 'NO';
        let updatedVariantFields;

        if (defaultPrice.trim() === '') {
            updatedVariantFields = variantFields.filter(val => val.unit !== defaultUnit);
            // const filteredData = getAllUnit.filter(unit => !data.includes(unit));
            // setGetAllUnit(filteredData)
            setGetAllUnit(prevGetAllUnit => [...prevGetAllUnit, 'NO']);
        } else {
            let variantUpdated = false;

            updatedVariantFields = variantFields.map((val) => {
                if (val.unit === defaultUnit) {
                    variantUpdated = true;
                    return { ...val, price: defaultPrice };
                }
                return val;
            });
            setUnit({
                unit: '',
                price: ''
            })

            if (!variantUpdated) {
                updatedVariantFields.push({
                    unit: defaultUnit,
                    price: defaultPrice,
                    status: true,
                    preferredName: '',
                    preferredNameIsGujarati: commonPreferredNameIsGujarati
                });
            }

            const data = variantFields.map(variant => variant.unit);
            const filteredData = getAllUnit.filter(unit => !data.includes(unit));
            setGetAllUnit(filteredData)
        }

        setVariantFields(updatedVariantFields);
        if (editData) {
            setEditData(prevState => ({
                ...prevState,
                variantsList: defaultPrice.trim() === ''
                    ? prevState.variantsList.filter(v => v.unit !== defaultUnit)
                    : [
                        ...prevState.variantsList.filter(v => v.unit !== defaultUnit),
                        { unit: defaultUnit, price: defaultPrice, status: true, preferredName: '', preferredNameIsGujarati: commonPreferredNameIsGujarati }
                    ]
            }));
            console.log('State Management', editData)
        }
        else {
            setFullData(prevState => ({
                ...prevState,
                variantsList: defaultPrice.trim() === ''
                    ? prevState.variantsList.filter(v => v.unit !== defaultUnit)
                    : [
                        ...prevState.variantsList.filter(v => v.unit !== defaultUnit),
                        { unit: defaultUnit, price: defaultPrice, status: true, preferredName: '', preferredNameIsGujarati: commonPreferredNameIsGujarati }
                    ]
            }));
        }
    };

    const selectedcategoryName = subCategories.find(val => val.subCategoryId === finalSelected);


    const handleDelete = (index) => {
        const unitToDelete = variantFields[index].unit;
        console.log('unit', unitToDelete)


        const updatedFields = variantFields
            .filter((_, i) => i !== index)
            .map(({ index, ...rest }) => ({ ...rest, status: true }));

        setGetAllUnit(prevGetAllUnit => [...prevGetAllUnit, unitToDelete]);

        if (editData) {
            setEditData((prev) => ({
                ...prev,
                variantsList: updatedFields
            }));
        }

        setVariantFields(updatedFields);
        console.log('price -->>', updatedFields);
        setFullData((prev) => ({
            ...prev,
            variantsList: updatedFields
        }));
    };


    const getSubCategory = async (menu) => {
        console.log('sub Category MenuId ===>>', menu)
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/ddlSubCategory?menuId=${menu}`, config);
            const subCategories = response.data;
            setSubCategories(subCategories);
            setMenuId(menu)
            const firstSubCategoryId = subCategories[0].subCategoryId;
            // const status = subCategories[0].status;
            // if (status) {
            //     console.log('==>sub Category Status ==>', status)
            //     setSubCategoryStatus(status)
            // }
            // setSubCategoryStatus(true)
            // updatedSubCategory(menu);
            if (finalSelected) {
                console.log('reload', finalSelected)
                handleSubCategoryClick(finalSelected, menu);
            }
            else {
                handleSubCategoryClick(firstSubCategoryId, menu);
                setSubCategoryStatus(true)
            }
            setItemDataNull(false)
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    };
    const updatedSubCategory = async (menu) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/ddlSubCategory?menuId=${menu}`, config);
            const subCategories = response.data;
            setSubCategories(subCategories);
            const selectedSubCategory = subCategories.find(val => val.subCategoryId === finalSelected);
            console.log('Selected Sub Categoruy', selectedSubCategory)
            console.log('<<>--')
            const status = selectedSubCategory?.status;
            console.log('<<==><==>>', status)
            if (status >= 0) {
                console.log('==><==', status)
                setSubCategoryStatus(status)
            }
            else {
                console.log('==>===<==')
                const firstId = subCategories[0].status;
                setSubCategoryStatus(firstId)
            }

            setItemDataNull(false)
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    };
    const handleEditItem = (item) => {
        console.log('item', item)
        setOpen(true);
        setEditData(item);
        setVariantsItemObject(item);
        setVariantEditData(item.variantsList);
        setSubCategoryName(item.subCategoryName);
        setEditItem(true);

        // Ensure variants have the new preferredName fields with defaults
        const variantsWithDefaults = item.variantsList.map(variant => ({
            ...variant,
            preferredName: variant.preferredName || '',
            preferredNameIsGujarati: variant.preferredNameIsGujarati !== undefined ? variant.preferredNameIsGujarati : true
        }));

        // Set common switch based on first variant's preferredNameIsGujarati (or default to true)
        const firstVariantGujarati = variantsWithDefaults.length > 0
            ? (variantsWithDefaults[0].preferredNameIsGujarati !== undefined ? variantsWithDefaults[0].preferredNameIsGujarati : true)
            : true;
        setCommonPreferredNameIsGujarati(firstVariantGujarati);

        setVariantFields(variantsWithDefaults);
        setGetAllUnit(prevUnits => prevUnits.filter(u => !item.allVariantsList.some(variant => variant.unit === u)));
    };

    const getAllUnits = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_BASE_URL}userrouter/getUnit`, config);
            setGetAllUnit(response.data);
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    }

    const handleSubCategoryClick = async (subCategoryId, menuCategory) => {
        setClickedSubCategory(subCategoryId);
        setSubCategoryFirstId(subCategoryId)
        setMenuId(menuCategory)
        const findingData = subCategories.find(val => val.subCategoryId === subCategoryId)
        setFinalSelected(subCategoryId)
        const status = findingData?.status
        console.log(`status`, findingData)
        setSubCategoryStatus(status)
        // updatedSubCategory()
        // if (status === 1) {
        //     setSubCategoryStatus(true)
        // }
        // else {
        //     setSubCategoryStatus(false)
        // }
        // console.log('===>>>handle sub category ===>',subCategoryData)
        const token = localStorage.getItem('token');
        try {
            setSideBarColor(true)
            await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getItemData?menuId=${menuCategory}&subCategoryId=${subCategoryId}`, config)
                .then((res) => {
                    setItemData(res.data);
                    if (itemData.length > 0) {
                        setItemDataNull(false)
                        setFullData({
                            itemName: '',
                            itemGujaratiName: '',
                            itemCode: '',
                            itemShortKey: '',
                            itemSubCategory: '',
                            itemDescription: '',
                            variantsList: []
                        })
                    }
                })
                .catch((error) => {
                    if (error.response.data == 'No Data Found') {
                        setError('No Data Found')
                        setItemDataNull(true)
                    }
                    setError(error?.response?.data || 'Network Error!!!...')
                })
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    };
    const editPriceValue = () => {
        setEditPriceMode(true);

        const updatedItemData = itemData.map(item => {
            const updatedVariantsList = item.variantsList.map(variant => {
                let updatedPrice = parseFloat(variant.price);

                if (editPriceValueType === 'increase') {
                    if (editPriceType.percentage) {
                        const percentage = parseFloat(editPrice.percentage);
                        updatedPrice = updatedPrice * (1 + percentage / 100);
                    } else if (editPriceType.fixed) {
                        const fixedAmount = parseFloat(editPrice.fixed);
                        updatedPrice = updatedPrice + fixedAmount;
                    }
                } else if (editPriceValueType === 'decrease') {
                    if (editPriceType.percentage) {
                        const percentage = parseFloat(editPrice.percentage);
                        updatedPrice = updatedPrice * (1 - percentage / 100);
                    } else if (editPriceType.fixed) {
                        const fixedAmount = parseFloat(editPrice.fixed);
                        updatedPrice = updatedPrice - fixedAmount;
                    }
                } else if (editPriceValueType === 'manual') {
                    updatedPrice = parseFloat(variant.price);
                }

                updatedPrice = Math.round(updatedPrice);

                return { ...variant, price: updatedPrice };
            });

            return { ...item, variantsList: updatedVariantsList };
        });

        setItemData(updatedItemData);
        setEditPricePopUp(false);
    };

    const handlePriceEditMode = () => {
        setEditPriceMode(false)
        // getAllCategory();
        // getSubCategory();
        getAllUnits();
        handleSubCategoryClick(finalSelected, menuId);
    }
    const handleEditPrice = async () => {
        const token = localStorage.getItem('token');
        const isConfirm = window.confirm('Are you sure You want to Save this change')
        if (!isConfirm) {
            return
        }
        else {

            try {
                const response = await axios.post(`${BACKEND_BASE_URL}menuItemrouter/updateMultipleItemPrice`, itemData, config)
                if (response.data === 'Price Updated Successfully') {
                    setSuccess('Price Updated Successfully')
                    setEditPriceMode(false)
                    handleSubCategoryClick(finalSelected, menuId);
                    getAllUnits();
                    // getAllItems(menuId);
                    handleClose();
                }
            } catch (error) {
                setError(error?.response?.data || 'Network Error!!!...')
                handleSubCategoryClick(finalSelected, menuId);
                getAllUnits();
                // getAllItems(menuId);
            }
        }
    }
    const handleManualVariantsname = (data) => {
        console.log('Data', data)
        setVariantsItemObject(data);

        // Ensure variants have the new preferredName fields with defaults
        const variantsWithDefaults = data.allVariantsList.map(variant => ({
            ...variant,
            preferredName: variant.preferredName || '',
            preferredNameIsGujarati: variant.preferredNameIsGujarati !== undefined ? variant.preferredNameIsGujarati : true
        }));

        setVariantEditData(variantsWithDefaults);
        setManualVariantsPopUp(true);
    };

    const handleSecondAddVarinats = () => {
        if (!secondVariantData.unit || !secondVariantData.price) {
            console.error('Both unit and price must be provided');
            return;
        }
        const newVariant = {
            unit: secondVariantData.unit,
            price: secondVariantData.price,
            status: true,
            preferredName: secondVariantData.preferredName,
            preferredNameIsGujarati: secondVariantData.preferredNameIsGujarati
        };
        const updatedVariantEditData = [...variantEditData, newVariant];
        setVariantEditData(updatedVariantEditData)
        setSecondVariantData({
            unit: '',
            price: '',
            status: true,
            preferredName: '',
            preferredNameIsGujarati: true
        })
    };
    const handleDeleteVariant = (index, variant) => {
        const updatedVariants = [...variantEditData];
        updatedVariants.splice(index, 1);
        setVariantEditData(updatedVariants);
        setGetAllUnit(prevGetAllUnit => [...prevGetAllUnit]);
    };
    const handleUpdateVariantsData = async () => {
        const token = localStorage.getItem('token');
        const newData = {
            itemName: varinatsItemObject.itemName,
            itemDescription: varinatsItemObject.itemDescription,
            itemCode: varinatsItemObject.itemCode,
            itemId: varinatsItemObject.itemId,
            itemGujaratiName: varinatsItemObject.itemGujaratiName,
            menuCategoryId: menuId,
            itemShortKey: varinatsItemObject.itemShortKey,
            itemSubCategory: varinatsItemObject.itemSubCategory,
            variantsList: variantEditData
        };

        try {
            const response = await axios.post(`${BACKEND_BASE_URL}menuItemrouter/updateItemData`, newData, config)
            if (response?.data === 'Item Updated Successfully') {
                setSuccess(response.data);
                handleClose();
                handleSubCategoryClick(finalSelected, menuId);
                updatedSubCategory(menuId);
            }
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
            setManualVariantsPopUp(false)
        }
        setEditItem(false)
        setVariantMode({
            isEdit: false,
            isView: true
        })
    }
    const handleSwitchToggle = (index) => {
        const updatedVariantEditData = [...variantEditData];
        updatedVariantEditData[index].status = !updatedVariantEditData[index].status;
        setVariantEditData(updatedVariantEditData);
    };
    const handleSave = () => {
        const value = editPriceType.percentage ? editPrice.percentage : editPrice.fixed;
        const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

        if (!numberRegex.test(value)) {
            setInputError('Please enter a valid number');
            return;
        }

        setInputError('');
        editPriceValue();
    };
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const handleVariantPriceChange = (event, itemIndex, variantIndex) => {
        const { value } = event.target;
        // Regex to allow only numbers and decimals (e.g., 123, 123.45, .45)
        const regex = /^\d*\.?\d*$/;

        if (regex.test(value)) {
            const updatedItemData = [...itemData];
            updatedItemData[itemIndex].variantsList[variantIndex].price = value;
            setItemData(updatedItemData);
        }
    };
    const handlePriceChange = (event, index) => {
        const { value } = event.target;
        const updatedVariantEditData = [...variantEditData];
        updatedVariantEditData[index].price = value;
        setVariantEditData(updatedVariantEditData);
    };
    const handleChangeCopySubCategory = () => {
        setCopyMenuCheckBox(!copyMenuCheckBox)
        // console.log('finalSelected',finalSelected)

    }
    const handlePriceManualChange = (data, price) => {
        const updatedVariantFields = variantFields.map(val => {
            if (val.unit === data.unit) {
                return { ...val, price: price };
            }
            return val;
        });
        setVariantFields(updatedVariantFields);
        if (editData) {
            const variants = editData.variantsList;
            const updatedVariantFields = variants.map(val => {
                if (val.unit === data.unit) {
                    return { ...val, price: price };
                }
                return val;
            });
            setEditData((prev) => ({
                ...prev,
                variantsList: updatedVariantFields
            }))
        } else {
            setFullData((prev) => ({
                ...prev,
                variantsList: updatedVariantFields
            }))
        }
    }
    const handleItemStatusChange = async (item) => {
        const token = localStorage.getItem('token');
        const userEnteredPassword = prompt('Enter password to continue:');
        const correctPassword = '123';

        if (userEnteredPassword === correctPassword) {
            const switchValue = !item.status ? true : false;
            await axios.get(`${BACKEND_BASE_URL}menuItemrouter/updateItemStatus?menuId=${menuId}&itemId=${item?.itemId}&status=${switchValue}`, config)
                .then(response => {
                    console.log(response.data)
                    console.log(`Switch value changed to ${switchValue}`);
                    if (response.data === 'Status Updated Successfully') {
                        setSubCategoryStatus(false)
                        getAllUnits();
                        // getAllCategory();
                        updatedSubCategory(menuId);
                        handleSubCategoryClick(finalSelected, menuId);
                        getAllUnits();
                        // getAllItems(menuId);
                    }
                })
                .catch(error => {
                    console.error('Error updating item status:', error);
                });
            console.log(`Switch value changed to ${switchValue}`);
        } else {
            const switchValue = item.status ? 'checked' : 'unchecked';
            console.log('Password incorrect or operation cancelled.');
        }
    };
    const handleManualVariantsPopUp = () => {
        setVariantMode({ isEdit: true })
    }
    const handleSubCategoryStatusChange = async () => {
        const token = localStorage.getItem('token');
        const userEnteredPassword = prompt('Enter password to continue:');
        const correctPassword = '123';

        if (userEnteredPassword === correctPassword) {
            const switchValue = !subCategoryStatus ? true : false;
            await axios.get(`${BACKEND_BASE_URL}menuItemrouter/updateItemStatus?menuId=${menuId}&subCategoryId=${finalSelected}&status=${switchValue}`, config)
                .then(response => {
                    console.log(response.data)
                    console.log(`Switch value changed to ${switchValue}`);
                    if (response.data === 'Status Updated Successfully') {
                        setSubCategoryStatus(false)
                        getAllUnits();
                        // getAllCategory();
                        getAllUnits();
                        // getAllItems(menuId);
                        setSuccess(true)
                        updatedSubCategory(menuId);
                        handleSubCategoryClick(finalSelected, menuId)
                        setManualVariantsPopUp(false)
                    }
                })
                .catch(error => {
                    console.error('Error updating item status:', error);
                });
            console.log(`Switch value changed to ${switchValue}`);
        } else {
            // const switchValue = item.status ? 'checked' : 'unchecked';
            console.log('Password incorrect or operation cancelled.');
        }
    }

    const handleToggleFavourite = async (item) => {
        const token = localStorage.getItem('token');
        try {
            const newFavouriteStatus = !item.isFavourite;
            await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/addFavouritemByBranch`,
                {
                    itemId: item.itemId,
                    isFavourite: newFavouriteStatus
                },
                config
            )
                .then(response => {
                    console.log('Favourite status updated:', response.data);
                    // Refresh the item list to get updated data
                    handleSubCategoryClick(finalSelected, menuId);
                })
                .catch(error => {
                    console.error('Error updating favourite status:', error);
                    setError(error?.response?.data || 'Failed to update favourite status');
                });
        } catch (error) {
            console.error('Error updating favourite status:', error);
            setError(error?.response?.data || 'Network Error!!!...');
        }
    }

    const handleEnableDragDrop = () => {
        setIsDragDropMode(true);
        // Create a copy of subCategories with displayRank
        const categoriesWithRank = subCategories.map((cat, index) => ({
            ...cat,
            displayRank: cat.displayRank || index + 1
        }));
        setTempSubCategories(categoriesWithRank);
    };

    const handleCancelDragDrop = () => {
        setIsDragDropMode(false);
        setTempSubCategories([]);
    };

    const handleSaveDragDrop = async () => {
        try {
            setLoading(true);
            const payload = tempSubCategories.map((cat, index) => ({
                subCategoryId: cat.subCategoryId,
                subCategoryName: cat.subCategoryName,
                displayRank: index + 1,
                numberOfItem: cat.numberOfItem,
                status: cat.status
            }));

            await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/updateDisplayRankForSubCategory`,
                payload,
                config
            )
                .then(response => {
                    console.log('Display rank updated:', response.data);
                    setSuccess(true);
                    setIsDragDropMode(false);
                    setTempSubCategories([]);
                    // Refresh subcategories
                    getSubCategory(menuId);
                })
                .catch(error => {
                    console.error('Error updating display rank:', error);
                    setError(error?.response?.data || 'Failed to update display rank');
                });
        } catch (error) {
            console.error('Error updating display rank:', error);
            setError(error?.response?.data || 'Network Error!!!...');
        } finally {
            setLoading(false);
        }
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(tempSubCategories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update displayRank for all items
        const updatedItems = items.map((item, index) => ({
            ...item,
            displayRank: index + 1
        }));

        setTempSubCategories(updatedItems);
    };

    const handleCopySourceChange = (event) => {
        const selectedMenu = copyMenuItems.find(menu => menu.menuCategoryName === event.target.value);
        setCopySource(selectedMenu);
    };
    const handleCopyMenuFromOther = async () => {
        if (!copySource.menuCategoryId) {
            setError('Please select a Source Menu.');
            return;
        }
        console.log('==>Menu Name <<===', menuName);
        console.log('==>Source id <<===', copySource);
        const token = localStorage.getItem('token');
        const mainMenuId = menuName?.menuCategoryId;
        const sourceId = copySource?.menuCategoryId;
        let url = `${BACKEND_BASE_URL}menuItemrouter/copyPriceAndStatusByMenuId?sourceId=${sourceId}&targetId=${mainMenuId}`;

        if (copyMenuCheckBox) {
            console.log('==>Sub Category Id Copy Menu <<==', copySubCategoryId);
            const subCategoryId = copySubCategoryId?.subCategoryId;
            url += `&itemSubCategoryId=${subCategoryId}`;
        }

        axios.get(url, config)
            .then((res) => {
                console.log(res.data);
                setSuccess(true);
                handleClose();
                handleSubCategoryClick(finalSelected, menuId)
                setCopyMenuPopUp(false);
                setCopySource('');
            })
            .catch((error) => {
                console.log(error)
                setError(error.response.data || 'Network Error!!!...');
            });
    };
    const filteredData = itemData.filter(item => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            item?.itemName?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
            item?.itemCode?.toString().includes(lowerCaseSearchTerm) ||
            item?.itemShortKey?.toLowerCase()?.includes(lowerCaseSearchTerm)
        );
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePercentageChange = (e) => {
        const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        const inputValue = e.target.value;
        if (!inputValue || numberRegex.test(inputValue)) {
            setEditPrice({ percentage: inputValue });
            setInputError('');
        } else {
            setInputError('Please enter a valid number');
        }
    };

    const handleFixedChange = (e) => {
        const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        const inputValue = e.target.value;
        if (!inputValue || numberRegex.test(inputValue)) {
            setEditPrice({ fixed: inputValue });
            setInputError('');
        } else {
            setInputError('Please enter a valid number');
        }
    };
    const scrollContainerRef = useRef(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const updateButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowPrev(scrollLeft > 0);
            setShowNext(scrollLeft + clientWidth < scrollWidth);
        }
    };

    const handleMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    useEffect(() => {
        updateButtons();
        const container = scrollContainerRef.current;
        container.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);

        return () => {
            container.removeEventListener('scroll', updateButtons);
            window.removeEventListener('resize', updateButtons);
        };
    }, []);

    // Calculate if there are more than 6 menu items
    const menuItemsCount = menuCategory.length;
    const shouldShowButtons = menuItemsCount > 6;

    useEffect(() => {
        if (shouldShowButtons) {
            setShowPrev(true);
            setShowNext(true);
        }
    }, [shouldShowButtons]);


    return (
        <div className='BilingDashboardContainer BilingDashboardContainerForDashBoardOnly p-3 '>
            <div className='col-span-12'>
                <div className='productTableSubContainer static'>
                    <div className='h-full grid grid-cols-12'>
                        <div className={`h-full ${editPriceMode ? 'col-span-9' : isDragDropMode ? 'col-span-9' : 'col-span-9'}`}>
                            <div className='relative h-full'>
                                {showPrev && !isDragDropMode && (
                                    <button onClick={scrollLeft} className='absolute left-3 z-10 top-5'>
                                        <ChevronLeftIcon />
                                    </button>
                                )}
                                <div className={`flex ml-12 gap-3 menuCategoryScroll overflow-x-auto h-full ${editPriceMode || isDragDropMode ? 'cursor-not-allowed' : ''}`} style={{ whiteSpace: 'nowrap' }} ref={scrollContainerRef}>
                                    {menuCategory.map((menu, index) => (
                                        <div
                                            key={index}
                                            className={`col-span-1 ${tab === index ? 'productTabAll' : 'productTab'}`}
                                            onClick={() => {
                                                if (!editPriceMode && !isDragDropMode) {
                                                    const menuCategories = menu?.menuCategoryId;
                                                    setSubCategoryStatus(false);
                                                    // getAllItems(menuCategories);
                                                    setMenuId(menuCategories);
                                                    handleSubCategoryClick(finalSelected, menuCategories);
                                                    setTab(index);
                                                    setSearchWord('');
                                                    setDataSearch([]);
                                                    console.log('menuCategory', menuCategories);
                                                }
                                            }}
                                            style={{ minWidth: 'fit-content' }}
                                        >
                                            <div className='statusTabtext w-40'>{menu.menuCategoryName}</div>
                                        </div>
                                    ))}
                                </div>
                                {showNext && !isDragDropMode && (
                                    <button onClick={scrollRight} className='absolute -right-5 z-10 top-5'>
                                        <ChevronRightIcon />
                                    </button>
                                )}
                            </div>
                        </div>
                        {
                            !editPriceMode && !isDragDropMode ? (
                                <div className='flex gap-4 col-span-3 justify-self-end w-full pr-3 h-full justify-end'>
                                    <div className='self-center'>
                                        <button className='addProductBtn' onClick={handleOpen}>Add Product</button>
                                    </div>
                                    <div className='self-center'>
                                        <button className='addProductBtn' onClick={handleEnableDragDrop}>Rearrange</button>
                                    </div>
                                </div>
                            ) : isDragDropMode ? (
                                <div className='flex gap-4 col-span-3 justify-self-end w-full pr-3 h-full justify-end'>
                                    <div className='self-center'>
                                        <button className='addProductBtn w-full' onClick={handleSaveDragDrop}>Save</button>
                                    </div>
                                    <div className='self-center'>
                                        <button className='w-full cancelButtonEdiPriceMode' onClick={handleCancelDragDrop}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex gap-4 col-span-3 justify-self-end pr-3 w-4/5 h-full'>
                                    <div className='self-center w-full'>
                                        <button className='addProductBtn w-full' onClick={handleEditPrice}>Save</button>
                                    </div>
                                    <div className='self-center w-full'>
                                        <button className='w-full  cancelButtonEdiPriceMode' onClick={handlePriceEditMode}>Cancel</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />
            <div className="maina_box">
                {subCategories.length > 0 && !isDragDropMode && (
                    <div className="sidebar overflow-y-auto blackCountLogoWrp shadow-2xl py-4 my-4 mr-4 static">
                        {subCategories.map(subcategory => (
                            <div
                                key={subcategory.subCategoryId}
                                ref={clickedSubCategory === subcategory.subCategoryId ? scrollRef : null}
                                className={`sidebar_menu my-2 flex jystify-between cursor-pointer rounded-lg p-2 text-start text-lg ${editPriceMode ? 'cursor-not-allowed' : ''} ${clickedSubCategory === subcategory.subCategoryId ? 'ClickedBlueBg' : ' hover:bg-gray-700 hover:text-white'}`}
                                onClick={() => {
                                    if (!editPriceMode) {
                                        handleSubCategoryClick(subcategory.subCategoryId, menuId)
                                    }
                                }}
                            >
                                <span className='w-full'>{subcategory.subCategoryName}</span> <span className='w-6 text-end'>{subcategory.numberOfItem}</span>
                            </div>
                        ))}
                    </div>
                )}
                {isDragDropMode && tempSubCategories.length > 0 && (
                    <div className="sidebar overflow-y-auto blackCountLogoWrp shadow-2xl py-4 my-4 mr-4 static">
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="subcategories">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {tempSubCategories.map((subcategory, index) => (
                                            <Draggable
                                                key={subcategory.subCategoryId}
                                                draggableId={subcategory.subCategoryId}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`sidebar_menu my-2 flex justify-between items-center rounded-lg p-2 text-start text-lg ${snapshot.isDragging ? 'bg-blue-100 shadow-lg' : 'hover:bg-gray-700 hover:text-white'
                                                            }`}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            cursor: 'grab'
                                                        }}
                                                    >
                                                        <div className='flex items-center gap-2 w-full'>
                                                            <DragIndicatorIcon className='text-gray-400' />
                                                            <span className='w-full'>{subcategory.subCategoryName}</span>
                                                            <span className='w-6 text-end'>{subcategory.numberOfItem}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                )}
                <TableContainer className=' '>
                    <div className="mt-4">
                        {!editPriceMode && !itemDataNull && !isDragDropMode && (
                            <div>
                                <div className="patti rounded-lg shadow-md p-2 mb-2 bg-white w-full">
                                    {!editPriceMode ? (
                                        <div className="mainANotherDiv gap-4 justify-between">
                                            <div className='flex gap-4'>
                                                <Search className='border'>
                                                    <SearchIconWrapper>
                                                        <SearchIcon />
                                                    </SearchIconWrapper>
                                                    <StyledInputBase
                                                        placeholder="Search…"
                                                        inputProps={{ 'aria-label': 'search' }}
                                                        value={searchTerm}
                                                        onChange={handleSearchChange}
                                                    />
                                                </Search>
                                                {/* <button className='addProductBtn' onClick={() => { setEditPricePopUp(true); setEditPriceType({ percentage: true }) }} >Edit Price</button> */}
                                                <PopupState variant="popover" popupId="demo-popup-menu" >
                                                    {(popupState) => (
                                                        <React.Fragment>
                                                            <Button variant="contained" {...bindTrigger(popupState)} className='addProductBtn'>
                                                                Edit Price
                                                            </Button>
                                                            <Menu
                                                                {...bindMenu(popupState)}
                                                                MenuListProps={{
                                                                    style: { zIndex: 9999 }
                                                                }}
                                                                slotProps={{
                                                                    paper: {
                                                                        style: {
                                                                            zIndex: 9999
                                                                        }
                                                                    }
                                                                }}
                                                                style={{ zIndex: 9999 }}
                                                            >
                                                                <MenuItem onClick={() => { popupState.close(); setEditPriceValueType('manual'); editPriceValue(); }}>
                                                                    <BrightnessHighIcon /><div className="pl-2">Manual</div>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { popupState.close(); setEditPricePopUp(true); setEditPriceType({ percentage: true }); setEditPriceValueType('increase') }}>
                                                                    <AddCircleOutlineIcon /><div className="pl-2">Increase</div>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { popupState.close(); setEditPricePopUp(true); setEditPriceType({ percentage: true }); setEditPriceValueType('decrease') }}>
                                                                    <RemoveCircleOutlineIcon /><div className="pl-2">Decrease</div>
                                                                </MenuItem>
                                                            </Menu>
                                                        </React.Fragment>
                                                    )}
                                                </PopupState>
                                                <button className='addProductBtn' onClick={() => {
                                                    setCopyMenuPopUp(true);
                                                    const menuCateory = menuCategory.find(name => name.menuCategoryId === menuId)
                                                    setMenuName(menuCateory)
                                                    const updatedCopyMenuItems = menuCategory.filter(menu => menu.menuCategoryId !== menuId);
                                                    setCopyMenuItems(updatedCopyMenuItems)
                                                    const subCategoryName = subCategories.find(val => val.subCategoryId === finalSelected)
                                                    setCopySubCategoryId(subCategoryName)
                                                }} >Copy Price From Menu</button>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <div className="addProductButton">
                                                    <div className="font-semibold">
                                                        {selectedcategoryName?.subCategoryName} Status :
                                                        <Switch
                                                            {...label}
                                                            checked={subCategoryStatus ? true : false}
                                                            color="success"
                                                            onClick={(e) => { handleSubCategoryStatusChange() }}
                                                        // onClick={(e) => { handleItemStatusChange(item) }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        borderBottomLeftRadius: '10px',
                                        borderBottomRightRadius: '10px',
                                        paddingLeft: '12px',
                                        paddingRight: '12px',
                                        paddingTop: '12px',
                                        overflowY: 'auto',
                                    }}
                                    className='CustomDashBoardTableHeight'
                                >
                                    <Table aria-label="sticky table" sx={{ minWidth: 750, overflow: 'hidden' }} className=''>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Gujarati Name</TableCell>
                                                <TableCell>Short Code</TableCell>
                                                <TableCell>Short Name</TableCell>
                                                <TableCell>Price (NO)</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell align='center' className='pl-11' style={{ paddingLeft: '83px' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className=''>
                                            {filteredData.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    onMouseEnter={() => handleMouseEnter(index)}
                                                    onMouseLeave={handleMouseLeave}
                                                    style={{ backgroundColor: hoveredRow === index ? '#f5f5f5' : 'transparent', cursor: 'pointer' }}
                                                >
                                                    <TableCell style={{ maxWidth: '15px', width: '15px' }}>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.itemName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.itemGujaratiName}
                                                    </TableCell>
                                                    <TableCell allign='center'>
                                                        {item.itemCode}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.itemShortKey}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item?.allVariantsList[0]?.price}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Switch
                                                            {...label}
                                                            checked={item?.status ? true : false}
                                                            color="success"
                                                            onClick={() => { handleItemStatusChange(item) }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align='right'>
                                                        <div className="flex w-100 justify-end">
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleFavourite(item);
                                                                }}
                                                                size="small"
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    minWidth: 32,
                                                                    borderRadius: '4px',
                                                                    backgroundColor: 'white',
                                                                    border: item?.isFavourite ? '1px solid #eab308' : '1px solid #d0d0d0',
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                                    '&:hover': {
                                                                        backgroundColor: item?.isFavourite ? '#fef3c7' : '#f9f9f9',
                                                                        boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                                                                    },
                                                                    '& .MuiSvgIcon-root': {
                                                                        color: '#eab308',
                                                                        fontSize: '18px',
                                                                    }
                                                                }}
                                                            >
                                                                {item?.isFavourite ? <StarIcon /> : <StarBorderIcon />}
                                                            </IconButton>
                                                            {menuId === 'base_2001' && (
                                                                <>
                                                                    <div onClick={() => { handleEditItem(item); }} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600'>
                                                                        <BorderColorIcon className='text-gray-600 table_icon2' />
                                                                    </div>
                                                                    <div onClick={() => handleItemDelete(item.itemId)} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600'>
                                                                        <DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2' />
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div onClick={() => handleManualVariantsname(item)} className={`rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-green-600 ${menuId === 'base_2001' ? '' : 'mr-7'}`}>
                                                                <p className='text-gray-600 table_icon2 text-center font-bold text-base'>V</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )
                        }
                        {!itemDataNull && editPriceMode && (
                            <TableContainer
                                sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px' }}
                                component={Paper}
                                className='CustomDashBoardTableHeightPriceEdit'
                            >
                                <Table sx={{ minWidth: 650, overflow: 'auto' }} aria-label="simple table" >
                                    <TableHead >
                                        <TableRow>
                                            <TableCell className='px-0'>No.</TableCell>
                                            <TableCell className='px-0' style={{ width: '40%' }}>Name</TableCell>
                                            <TableCell style={{ width: '60%' }}>Variants</TableCell>
                                            <TableCell align="right"></TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className='bg-white'>
                                        {itemData.map((item, itemIndex) => (
                                            <TableRow
                                                key={itemIndex}
                                                onMouseEnter={() => handleMouseEnter(itemIndex)}
                                                onMouseLeave={handleMouseLeave}
                                                style={{ backgroundColor: hoveredRow === itemIndex ? '#f5f5f5' : 'transparent', cursor: 'pointer' }}
                                            >
                                                <TableCell component="th" scope="row" className='w-3' style={{ maxWidth: '15px', width: '15px' }}>
                                                    {itemIndex + 1}
                                                </TableCell>
                                                <TableCell component="th" scope="row" style={{ maxWidth: '1200px' }}>
                                                    {item.itemName}
                                                </TableCell>
                                                <TableCell component="th" scope="row" className='' style={{ maxWidth: '500px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                    <div className="flex gap-6">
                                                        {item?.variantsList.length > 0 ? (item?.variantsList.map((variant, variantIndex) => (
                                                            <FormControl sx={{ m: 1 }} variant="standard" className='editPriceFormControl ' key={variantIndex}>
                                                                <TextField
                                                                    variant='standard'
                                                                    id={`standard-adornment-weight-${itemIndex}-${variantIndex}`}
                                                                    aria-describedby={`standard-weight-helper-text-${itemIndex}-${variantIndex}`}
                                                                    InputProps={{
                                                                        endAdornment: <InputAdornment position="end">{variant.unit}</InputAdornment>,
                                                                        'aria-label': 'weight',
                                                                    }}
                                                                    value={variant.price}
                                                                    onChange={(event) => handleVariantPriceChange(event, itemIndex, variantIndex)}
                                                                    className=''
                                                                    autoComplete="off"
                                                                />
                                                            </FormControl>
                                                        ))) : (
                                                            <>Item Is Disabled</>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">
                                                </TableCell>
                                                <TableCell component="th" scope="row" className=''>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        )}
                    </div>
                    {itemDataNull && !isDragDropMode && (
                        <div className="w-full flex justify-center">
                            <div className='text-center'>
                                <RestaurantMenuIcon className='restaurantMenu' />
                                <br />
                                <div className="text-2xl text-gray">
                                    No Data Found
                                </div>
                            </div>
                        </div>
                    )}
                    {isDragDropMode && (
                        <div className="w-full flex justify-center items-center" style={{ minHeight: '400px' }}>
                            <div className='text-center'>
                                <DragIndicatorIcon style={{ fontSize: '80px', color: '#9ca3af' }} />
                                <br />
                                <div className="text-2xl text-gray-600 mt-4">
                                    Drag and Drop Mode Active
                                </div>
                                <div className="text-lg text-gray-500 mt-2">
                                    Rearrange subcategories in the sidebar and click Save
                                </div>
                            </div>
                        </div>
                    )}
                </TableContainer>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={addProductModalStyle} className='addProdutModal'>
                    <div style={{ flexShrink: 0, marginBottom: '16px' }}>
                        <div className="text-xl p-1">
                            {editData ? 'Edit Item' : 'Add Item'}
                        </div>
                        <hr className='my-2 mb-4' />
                    </div>
                    <div style={{ flex: 1, minHeight: 0, overflow: 'visible', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flexShrink: 0, overflow: 'visible', position: 'relative', zIndex: 10 }}>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-2">
                                    <TextField
                                        size='small'
                                        id="outlined-basic"
                                        className={`w-full ${allFormValidation.itemCode ? 'border-red-500' : ''}`}
                                        error={allFormValidation.itemCode}
                                        helperText={allFormValidation.itemCode ? 'Code is Required' : ''}
                                        label="Code"
                                        variant="outlined"
                                        value={editData ? editData.itemCode : fullData.itemCode}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const numberRegex = /^[0-9]*$/;

                                            if (numberRegex.test(value)) {
                                                if (editData) {
                                                    setEditData({ ...editData, itemCode: value });
                                                } else {
                                                    setFullData({ ...fullData, itemCode: value });
                                                }
                                                setAllFormValidation({ ...allFormValidation, itemCode: false });
                                            }
                                        }}
                                        autoComplete="off"
                                        inputRef={autoFocus}
                                    />

                                </div>
                                <div className="col-span-3 ">
                                    <TextField
                                        size='small'
                                        id="outlined-basic"
                                        label="Item Name"
                                        variant="outlined"
                                        className={`w-full ${allFormValidation.itemName ? 'border-red-500' : ''}`}
                                        error={allFormValidation.itemName}
                                        helperText={allFormValidation.itemName ? 'Item Name is required' : ''}
                                        value={editData ? editData.itemName : fullData.itemName}
                                        onChange={(e) => {
                                            editData
                                                ?
                                                setEditData({ ...editData, itemName: e.target.value })
                                                :
                                                setFullData({ ...fullData, itemName: e.target.value })
                                            setAllFormValidation({ ...allFormValidation, itemName: false })
                                        }}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-span-3" style={{ overflow: 'visible', position: 'relative', zIndex: 100 }}>
                                    <ReactTransliterate
                                        id="outlined-basic"
                                        value={editData ? editData.itemGujaratiName : fullData.itemGujaratiName}
                                        onChangeText={(e) => {
                                            editData
                                                ?
                                                setEditData({ ...editData, itemGujaratiName: e })
                                                :
                                                setFullData({ ...fullData, itemGujaratiName: e })
                                            setAllFormValidation({ ...allFormValidation, itemName: false })
                                        }}
                                        variant="outlined"
                                        className={`w-full border p-2.5 rounded-md border-gray-300 text-sm ${allFormValidation.itemGujaratiName ? 'border-red-500' : ''}`}
                                        style={{ fontSize: '14px', height: '40px' }}
                                        placeholder='ગુજરાતી નામ'
                                        error={allFormValidation.itemGujaratiName}
                                        helperText={allFormValidation.itemGujaratiName ? 'Gujarati Name is required' : ''}
                                        label="Item Gujarati Name"
                                        lang="gu"
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <TextField
                                        size='small'
                                        id="outlined-basic"
                                        className={`w-full ${allFormValidation.itemShortKey ? 'border-red-500' : ''}`}
                                        error={allFormValidation.itemShortKey}
                                        helperText={allFormValidation.itemShortKey ? 'Short Code required' : ''}
                                        label="Short Code"
                                        variant="outlined"
                                        autoComplete="off"
                                        value={editData ? editData.itemShortKey : fullData.itemShortKey}
                                        onChange={(e) => {
                                            const uppercaseValue = e.target.value.toUpperCase();
                                            if (editData) {
                                                setEditData({ ...editData, itemShortKey: uppercaseValue });
                                            } else {
                                                setFullData({ ...fullData, itemShortKey: uppercaseValue });
                                            }
                                            setAllFormValidation({ ...allFormValidation, itemShortKey: false });
                                        }}
                                    />

                                </div>
                                <div className="col-span-3">
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label" size='small'>Sub Category</InputLabel>
                                        <Select
                                            size='small'
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Sub Category"
                                            className={`w-full ${allFormValidation.itemSubCategory ? 'border-red-500 rela ' : ''}`}
                                            error={allFormValidation.itemSubCategory}
                                            autoComplete="off"
                                            value={editData ? editData.itemSubCategory : fullData.itemSubCategory}
                                            onChange={(e) => {
                                                editData
                                                    ?
                                                    setEditData({ ...editData, itemSubCategory: e.target.value })
                                                    :
                                                    setFullData({ ...fullData, itemSubCategory: e.target.value })
                                                setAllFormValidation({ ...allFormValidation, itemSubCategory: false })
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                        zIndex: 1302
                                                    }
                                                },
                                                style: { zIndex: 1302 }
                                            }}
                                        >
                                            {subCategories.map((category, index) => (
                                                <MenuItem key={index} value={category.subCategoryId}>{category.subCategoryName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-span-2">
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label" size='small'>Spicy Level</InputLabel>
                                        <Select
                                            size='small'
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Spicy Level"
                                            className={`w-full ${allFormValidation.spicyLevel ? 'border-red-500 rela ' : ''}`}
                                            error={allFormValidation.spicyLevel}
                                            autoComplete="off"
                                            value={editData ? editData.spicyLevel || '' : fullData.spicyLevel || ''}
                                            onChange={(e) => {
                                                editData
                                                    ?
                                                    setEditData({ ...editData, spicyLevel: e.target.value })
                                                    :
                                                    setFullData({ ...fullData, spicyLevel: e.target.value })
                                                setAllFormValidation({ ...allFormValidation, spicyLevel: false })
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                        zIndex: 1302
                                                    }
                                                },
                                                style: { zIndex: 1302 }
                                            }}
                                        >
                                            <MenuItem value={'0'}>0</MenuItem>
                                            <MenuItem value={'1'}>1</MenuItem>
                                            <MenuItem value={'2'}>2</MenuItem>
                                            <MenuItem value={'3'}>3</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-span-7">
                                    <TextField
                                        size='small'
                                        id="outlined-basic"
                                        className={`w-full ${allFormValidation.itemDescription ? 'border-red-500' : ''}`}
                                        label="Item Description"
                                        variant="outlined"
                                        value={editData ? editData.itemDescription : fullData.itemDescription}
                                        onChange={(e) => {
                                            editData
                                                ?
                                                setEditData({ ...editData, itemDescription: e.target.value })
                                                :
                                                setFullData({ ...fullData, itemDescription: e.target.value })
                                            setAllFormValidation({ ...allFormValidation, itemDescription: false })
                                        }}
                                        autoComplete="off"
                                    />
                                </div>
                                {editData && (
                                    <div className="col-span-1">
                                        <FormControlLabel control={<Checkbox onChange={() => {
                                            setEditData((prev) => ({
                                                ...prev,
                                                isJain: !prev.isJain
                                            }))
                                        }} checked={editData?.isJain ? true : false} />} label="Jain" />
                                    </div>
                                )}
                                {editData && (
                                    <div className="col-span-2">
                                        <FormControlLabel control={<Checkbox onChange={() => {
                                            setEditData((prev) => ({
                                                ...prev,
                                                isPureJain: !prev.isPureJain
                                            }))
                                        }} checked={editData?.isPureJain ? true : false} />} label="Pure Jain" />
                                    </div>
                                )}
                                {!editData && (
                                    <div className="col-span-1">
                                        <FormControlLabel control={<Checkbox checked={fullData.isJain ? true : false} onChange={() => {
                                            setFullData((prev) => ({
                                                ...prev,
                                                isJain: !prev.isJain
                                            }))
                                        }} />} label="Jain" />
                                    </div>
                                )}
                                {!editData && (
                                    <div className="col-span-2">
                                        <FormControlLabel control={<Checkbox checked={fullData.isPureJain ? true : false} onChange={() => {
                                            setFullData((prev) => ({
                                                ...prev,
                                                isPureJain: !prev.isPureJain
                                            }))
                                        }} />} label="Pure Jain" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ flexShrink: 0, overflow: 'visible' }}>
                            <div className="text-xl p-1 mt-4">
                                {editData ? 'Edit Unit' : 'Add Unit'}
                            </div>

                            <div className='grid grid-cols-12 gap-4 mt-4'>
                                <div className='col-span-2'>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label" size='small'>Unit</InputLabel>
                                        <Select
                                            size='small'
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Unit"
                                            value={unit.unit}
                                            error={allFormValidation.unit ? true : false}
                                            onChange={(e) => {
                                                setUnit({ ...unit, unit: e.target.value })
                                                setAllFormValidation({ ...allFormValidation, unit: false })
                                            }}
                                            inputRef={addingUnitName}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300,
                                                        zIndex: 1302
                                                    }
                                                },
                                                style: { zIndex: 1302 }
                                            }}
                                        >
                                            {getAllUnit && getAllUnit.map((unitOption, index) => (
                                                <MenuItem key={index} value={unitOption}>{unitOption}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='col-span-4' style={{ overflow: 'visible', position: 'relative', zIndex: 200 }}>
                                    <div className="relative" style={{ overflow: 'visible', zIndex: 200 }}>
                                        <ReactTransliterate
                                            value={unit.preferredName}
                                            onChangeText={(text) => {
                                                setUnit(prev => ({ ...prev, preferredName: text }));
                                                setAllFormValidation({ ...allFormValidation, preferredName: false });
                                            }}
                                            className={`w-full border p-2.5 rounded-md text-sm ${allFormValidation.preferredName ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder='પસંદગીનું નામ'
                                            lang='gu'
                                            style={{ fontSize: '14px', height: '40px' }}
                                        />
                                        {allFormValidation.preferredName && (
                                            <div className="text-red-500 text-xs mt-1">Preferred Name is required</div>
                                        )}
                                    </div>
                                </div>
                                <div className='col-span-2'>
                                    <TextField
                                        size='small'
                                        label='Price'
                                        variant='outlined'
                                        className='w-full'
                                        value={unit.price}
                                        error={allFormValidation.unitPrice ? true : false}
                                        helperText={allFormValidation.unitPrice ? 'Price is required' : ''}
                                        inputRef={priceInputRef}
                                        onFocus={() => {
                                            // Auto-select first available unit if none is selected
                                            if (!unit.unit && getAllUnit && getAllUnit.length > 0) {
                                                setUnit(prev => ({ ...prev, unit: getAllUnit[0] }));
                                            }
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addVariantFields();
                                            }
                                        }}
                                        onChange={(e) => {
                                            const inputPrice = e.target.value;
                                            const regex = /^\d*\.?\d*$/;
                                            if (regex.test(inputPrice)) {
                                                setUnit({ ...unit, price: inputPrice });
                                                setAllFormValidation({ ...allFormValidation, unitPrice: false });
                                            }
                                        }}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className='col-span-1 flex items-center'>
                                    <button onClick={addVariantFields} className='addCategorySaveBtnSmall ao-compact-btn w-full'>Add</button>
                                </div>
                            </div>
                        </div>
                        {variantFields.length > 0 && (
                            <div className='mt-6' style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <div className='mb-2' style={{ flexShrink: 0 }}>
                                    <div className='text-lg font-semibold p-1'>Units in Product</div>
                                </div>

                                <div style={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 8,
                                }}>
                                    <div
                                        className='px-3 py-2 sticky top-0 bg-white'
                                        style={{
                                            borderBottom: '1px solid #e5e7eb',
                                            display: 'grid',
                                            gridTemplateColumns: '40px 1.5fr 2.5fr 1.5fr 1.5fr',
                                            columnGap: '12px',
                                            alignItems: 'center',
                                            zIndex: 50,
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <div className='text-xs font-semibold text-gray-600 text-center'>#</div>
                                        <div className='text-xs font-semibold text-gray-600'>Unit</div>
                                        <div className='text-xs font-semibold text-gray-600'>Preferred Name</div>
                                        <div className='text-xs font-semibold text-gray-600'>Price</div>
                                        <div className='text-xs font-semibold text-gray-600 text-center'>Remove</div>
                                    </div>

                                    {variantFields.map((variant, index) => (
                                        <div
                                            key={index}
                                            className='px-3 py-3'
                                            style={{
                                                borderBottom: '1px solid #f3f4f6',
                                                display: 'grid',
                                                gridTemplateColumns: '40px 1.5fr 2.5fr 1.5fr 1.5fr',
                                                columnGap: '12px',
                                                alignItems: 'center',
                                                minWidth: 0
                                            }}
                                        >
                                            <div className='text-center'>{index + 1}</div>
                                            <div style={{ minWidth: 0 }}>
                                                <TextField
                                                    size='small'
                                                    label=''
                                                    placeholder='Unit'
                                                    variant='outlined'
                                                    className='w-full'
                                                    value={variant.unit}
                                                    disabled
                                                    inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                                />
                                            </div>
                                            <div style={{ minWidth: 0, overflow: 'visible' }}>
                                                <ReactTransliterate
                                                    value={variant.preferredName || ''}
                                                    onChangeText={(text) => {
                                                        const updatedVariantFields = variantFields.map((v, i) =>
                                                            i === index ? { ...v, preferredName: text } : v
                                                        );
                                                        setVariantFields(updatedVariantFields);
                                                        if (editData) {
                                                            setEditData(prev => ({
                                                                ...prev,
                                                                variantsList: updatedVariantFields
                                                            }));
                                                        } else {
                                                            setFullData(prev => ({
                                                                ...prev,
                                                                variantsList: updatedVariantFields
                                                            }));
                                                        }
                                                    }}
                                                    className='w-full border p-2 rounded-md border-gray-300 text-sm'
                                                    placeholder='પસંદગીનું નામ'
                                                    lang='gu'
                                                    style={{ fontSize: '14px', height: '40px' }}
                                                />
                                            </div>
                                            <div>
                                                <TextField
                                                    size='small'
                                                    label=''
                                                    placeholder='Price'
                                                    variant='outlined'
                                                    className='w-full'
                                                    value={variant.price}
                                                    onChange={(e) => {
                                                        const regex = /^[0-9]*\.?[0-9]*$/;
                                                        if (regex.test(e.target.value)) {
                                                            handlePriceManualChange(variant, e.target.value)
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className='flex items-center justify-center'>
                                                <button className='rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-red-600 hover:text-white' onClick={() => handleDelete(index)}>Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-9 mt-6 w-full mr-7 justify-end px-4" style={{ flexShrink: 0, paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginTop: '16px' }}>
                        <div className="w-1/5">
                            <button onClick={handleSUbmitForm} className="addCategorySaveBtnSmall ml-4">Save</button>
                        </div>
                        <div className="w-1/5">
                            <button onClick={handleClose} className="addCategoryCancelBtnSmall ml-4">Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={editPricePopUp}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='priceEdit'>
                    <FormControl>
                        <p className='text-2xl mb-5 font-semibold'>{editPriceValueType === 'increase' ? 'Increase Price' : 'Decrease Price'}</p>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                            <div className="flex">
                                <FormControlLabel
                                    checked={editPriceType.percentage ? true : false}
                                    onClick={() => { setEditPriceType({ percentage: true }); setEditPrice({ precentage: '', fixed: '' }) }}
                                    value="Percentage"
                                    control={<Radio />}
                                    label="Percentage"
                                    autoComplete="off"
                                />
                                <FormControlLabel
                                    onClick={() => { setEditPriceType({ fixed: true }); setEditPrice({ precentage: '', fixed: '' }) }}
                                    checked={editPriceType.fixed ? true : false}
                                    value="Fixed"
                                    control={<Radio />}
                                    label="Fixed"
                                    autoComplete="off"
                                />
                            </div>
                        </RadioGroup>
                    </FormControl>
                    {editPriceType.percentage && (
                        <div className='mt-2 w-full'>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard" className='w-full formControl'>
                                <TextField
                                    variant='outlined'
                                    id="percentage-input"
                                    label="Percentage"
                                    autoComplete="off"
                                    value={editPrice.percentage}
                                    onChange={handlePercentageChange}
                                    error={!!inputError}
                                    helperText={inputError}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    className='w-full'
                                />
                            </FormControl>
                        </div>
                    )}
                    {editPriceType.fixed && (
                        <div className='mt-2 w-full'>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard" className='w-full formControl'>
                                <TextField
                                    variant='outlined'
                                    id="fixed-input"
                                    label="Fixed Amount"
                                    autoComplete="off"
                                    value={editPrice.fixed}
                                    onChange={handleFixedChange}
                                    error={!!inputError}
                                    helperText={inputError}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end"><CurrencyRupeeIcon /></InputAdornment>,
                                    }}
                                    className='w-full'
                                />
                            </FormControl>
                        </div>
                    )}
                    <div className="flex gap-6 mt-6 w-full">
                        <div className="w-full">
                            <button onClick={handleSave} className="addCategorySaveBtn">Save</button>
                        </div>
                        <div className="w-full">
                            <button onClick={handleClose} className="addCategoryCancleBtn bg-gray-700">Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={manualVariantsPopUp}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={variantsModalStyle} className='variantPopUp'>
                    <div className="w-full p-2">
                        <div className='text-xl font-bold'>Edit Variants of  {varinatsItemObject.itemName}</div>
                        <hr className="my-6" />
                        {variantMode.isEdit && (
                            <div className="">
                                <div className="text-xl p-1 mt-4">
                                    Add Unit
                                </div>

                                <div className='grid grid-cols-12 gap-4 mt-4'>
                                    <div className='col-span-2'>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label" size='small'>Unit</InputLabel>
                                            <Select
                                                size='small'
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Unit"
                                                value={secondVariantData.unit}
                                                onChange={(e) => {
                                                    setSecondVariantData({ ...secondVariantData, unit: e.target.value });
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 300,
                                                            zIndex: 1302
                                                        }
                                                    },
                                                    style: { zIndex: 1302 }
                                                }}
                                            >
                                                {getAllUnit && getAllUnit
                                                    .filter(unit => !variantEditData.some(v => v.unit === unit))
                                                    .map((unit, index) => (
                                                        <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='col-span-3' style={{ overflow: 'visible', position: 'relative', zIndex: 200 }}>
                                        {secondVariantData.preferredNameIsGujarati ? (
                                            <div className="relative" style={{ overflow: 'visible', zIndex: 200 }}>
                                                <ReactTransliterate
                                                    value={secondVariantData.preferredName || ''}
                                                    onChangeText={(text) => {
                                                        setSecondVariantData(prev => ({ ...prev, preferredName: text }));
                                                    }}
                                                    className='w-full border p-2.5 rounded-md text-sm border-gray-300'
                                                    placeholder='પસંદગીનું નામ'
                                                    lang='gu'
                                                    style={{ fontSize: '14px', height: '40px' }}
                                                />
                                            </div>
                                        ) : (
                                            <TextField
                                                size='small'
                                                label='Preferred Name'
                                                variant='outlined'
                                                className='w-full'
                                                value={secondVariantData.preferredName || ''}
                                                onChange={(e) => {
                                                    setSecondVariantData(prev => ({ ...prev, preferredName: e.target.value }));
                                                }}
                                                autoComplete='off'
                                            />
                                        )}
                                    </div>
                                    <div className='col-span-1 flex flex-col items-center justify-center'>
                                        <div className="flex items-center gap-1">
                                            <span className={`text-xs ${!secondVariantData.preferredNameIsGujarati ? 'font-bold text-blue-600' : 'text-gray-400'}`}>ENG</span>
                                            <Switch
                                                checked={secondVariantData.preferredNameIsGujarati || false}
                                                onChange={(e) => setSecondVariantData(prev => ({ ...prev, preferredNameIsGujarati: e.target.checked }))}
                                                size="small"
                                            />
                                            <span className={`text-xs ${secondVariantData.preferredNameIsGujarati ? 'font-bold text-blue-600' : 'text-gray-400'}`}>ગુજ</span>
                                        </div>
                                    </div>
                                    <div className='col-span-2'>
                                        <TextField
                                            size='small'
                                            label='Price'
                                            variant='outlined'
                                            className='w-full'
                                            value={secondVariantData.price}
                                            onChange={(e) => {
                                                const inputPrice = e.target.value;
                                                const regex = /^\d*\.?\d*$/;
                                                if (regex.test(inputPrice)) {
                                                    setSecondVariantData({ ...secondVariantData, price: inputPrice });
                                                }
                                            }}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className='col-span-1 flex items-center'>
                                        <button onClick={handleSecondAddVarinats} className='addCategorySaveBtnSmall ao-compact-btn w-full'>Add</button>
                                    </div>
                                </div>
                                <hr className="my-6" />
                            </div>
                        )}
                        <div>
                            <div className='text-lg font-semibold p-1 mb-2'>Units in Product</div>

                            <div style={{
                                maxHeight: '50vh',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                border: '1px solid #e5e7eb',
                                borderRadius: 8,
                            }}>
                                <div
                                    className='px-3 py-2 sticky top-0 bg-white'
                                    style={{
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'grid',
                                        gridTemplateColumns: '40px 1.5fr 2.5fr 1fr 1.5fr 1.5fr 1fr',
                                        columnGap: '12px',
                                        alignItems: 'center',
                                        zIndex: 50,
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <div className='text-xs font-semibold text-gray-600 text-center'>#</div>
                                    <div className='text-xs font-semibold text-gray-600'>Unit</div>
                                    <div className='text-xs font-semibold text-gray-600'>Preferred Name</div>
                                    <div className='text-xs font-semibold text-gray-600 text-center'>Lang</div>
                                    <div className='text-xs font-semibold text-gray-600'>Price</div>
                                    <div className='text-xs font-semibold text-gray-600 text-center'>Status</div>
                                    <div className='text-xs font-semibold text-gray-600 text-center'>Remove</div>
                                </div>

                                {variantEditData.map((variant, index) => (
                                    <div
                                        key={index}
                                        className='px-3 py-3'
                                        style={{
                                            borderBottom: '1px solid #f3f4f6',
                                            display: 'grid',
                                            gridTemplateColumns: '40px 1.5fr 2.5fr 1fr 1.5fr 1.5fr 1fr',
                                            columnGap: '12px',
                                            alignItems: 'center',
                                            minWidth: 0
                                        }}
                                    >
                                        <div className='text-center'>{index + 1}</div>
                                        <div style={{ minWidth: 0 }}>
                                            <TextField
                                                size='small'
                                                label=''
                                                placeholder='Unit'
                                                variant='outlined'
                                                className='w-full'
                                                value={variant.unit}
                                                disabled
                                                inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                            />
                                        </div>
                                        <div style={{ minWidth: 0, overflow: 'visible' }}>
                                            {variant.preferredNameIsGujarati ? (
                                                <ReactTransliterate
                                                    value={variant.preferredName || ''}
                                                    onChangeText={(text) => {
                                                        const updatedVariantEditData = variantEditData.map((v, i) =>
                                                            i === index ? { ...v, preferredName: text } : v
                                                        );
                                                        setVariantEditData(updatedVariantEditData);
                                                    }}
                                                    className='w-full border p-2 rounded-md border-gray-300 text-sm'
                                                    placeholder='પસંદગીનું નામ'
                                                    lang='gu'
                                                    style={{ fontSize: '14px', height: '40px' }}
                                                    disabled={variantMode.isView}
                                                />
                                            ) : (
                                                <TextField
                                                    size='small'
                                                    label=''
                                                    placeholder='Preferred Name'
                                                    variant='outlined'
                                                    className='w-full'
                                                    value={variant.preferredName || ''}
                                                    disabled={variantMode.isView}
                                                    onChange={(e) => {
                                                        const updatedVariantEditData = variantEditData.map((v, i) =>
                                                            i === index ? { ...v, preferredName: e.target.value } : v
                                                        );
                                                        setVariantEditData(updatedVariantEditData);
                                                    }}
                                                    inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                                />
                                            )}
                                        </div>
                                        <div className='flex flex-col items-center justify-center'>
                                            <div className="flex items-center gap-1">
                                                <span className={`text-xs ${!variant.preferredNameIsGujarati ? 'font-bold text-blue-600' : 'text-gray-400'}`}>EN</span>
                                                <Switch
                                                    checked={variant.preferredNameIsGujarati || false}
                                                    disabled={variantMode.isView}
                                                    onChange={(e) => {
                                                        const updatedVariantEditData = variantEditData.map((v, i) =>
                                                            i === index ? { ...v, preferredNameIsGujarati: e.target.checked } : v
                                                        );
                                                        setVariantEditData(updatedVariantEditData);
                                                    }}
                                                    size="small"
                                                />
                                                <span className={`text-xs ${variant.preferredNameIsGujarati ? 'font-bold text-blue-600' : 'text-gray-400'}`}>ગુ</span>
                                            </div>
                                        </div>
                                        <div>
                                            <TextField
                                                size='small'
                                                label=''
                                                placeholder='Price'
                                                variant='outlined'
                                                className='w-full'
                                                value={variant.price}
                                                disabled={variantMode.isView}
                                                onChange={(e) => {
                                                    const regex = /^[0-9]*\.?[0-9]*$/;
                                                    if (regex.test(e.target.value)) {
                                                        handlePriceChange(e, index)
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className='flex items-center justify-center'>
                                            <Switch
                                                color="success"
                                                checked={variant.status ? true : false}
                                                disabled={variantMode.isView}
                                                onChange={() => handleSwitchToggle(index)}
                                                size="small"
                                            />
                                        </div>
                                        <div className='flex items-center justify-center'>
                                            {variantMode.isEdit && variant.unit !== 'NO' ? (
                                                <button
                                                    className='rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-red-600 hover:text-white'
                                                    onClick={() => handleDeleteVariant(index, variant.unit)}
                                                >
                                                    Remove
                                                </button>
                                            ) : variantMode.isEdit && variant.unit === 'NO' ? (
                                                <button
                                                    className='rounded-lg bg-gray-300 px-3 py-2 text-sm cursor-not-allowed'
                                                    title="Delete disabled for 'NO' unit"
                                                    disabled
                                                >
                                                    Remove
                                                </button>
                                            ) : (
                                                <span className='text-gray-400 text-sm'>-</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full">
                                {variantMode.isView && (
                                    <div className="flex gap-9 mt-6 w-full mr-7 justify-end px-4">
                                        <div className="w-1/5">
                                            <button onClick={() => handleManualVariantsPopUp()} className="addCategorySaveBtnSmall ml-4">Edit</button>
                                        </div>
                                        <div className="w-1/5">
                                            <button onClick={handleClose} className="addCategoryCancelBtnSmall ml-4">Cancel</button>
                                        </div>
                                    </div>
                                )}
                                {variantMode.isEdit && (
                                    <div className="flex gap-9 mt-6 w-full mr-7 justify-end px-4">
                                        <div className="w-1/5">
                                            <button onClick={handleUpdateVariantsData} className="addCategorySaveBtnSmall ml-4">Save</button>
                                        </div>
                                        <div className="w-1/5">
                                            <button onClick={handleClose} className="addCategoryCancelBtnSmall ml-4">Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={copyMenuPopUp}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...copyMenuStyle }} className='copyMenuPopUp'>
                    <div className="popHeading">
                        Copy Menu from {menuName.menuCategoryName}
                    </div>
                    <hr className="my-6" />
                    <div className="flex gap-4 w-full">
                        <div className='w-full'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label" size='small'>Source</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Source"
                                    value={copySource.menuCategoryName}
                                    onChange={handleCopySourceChange}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 300,
                                                zIndex: 1302
                                            }
                                        },
                                        style: { zIndex: 1302 }
                                    }}
                                >
                                    {copyMenuItems.map((menu, index) => (
                                        <MenuItem key={index} value={menu.menuCategoryName}>
                                            {menu.menuCategoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="w-full">
                            <TextField
                                id="outlined-basic"
                                label="Target"
                                variant="outlined"
                                disabled
                                className='w-full'
                                autoComplete="off"
                                value={menuName.menuCategoryName}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6 w-11/12">
                        <label htmlFor="copy-sub-category" className="flex items-center gap-2 cursor-pointer">
                            <input
                                onChange={handleChangeCopySubCategory}
                                type="checkbox"
                                id="copy-sub-category"
                                checked={copyMenuCheckBox}
                            />
                            <p>Just Copy {copySubCategoryId.subCategoryName}</p>
                        </label>
                    </div>
                    {/* {copyMenuCheckBox && (
                        <div className="my-2 w-full">
                            <FormControl className='w-full' >
                                <InputLabel id="demo-simple-select-label" size='small'>Source</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Source"
                                    value={copySubCategoryId.subCategoryName}
                                >
                                    {subCategories.map((menu, index) => (
                                        <MenuItem
                                            key={index}
                                            value={menu.subCategoryName}
                                            onClick={() => setCopySubCategoryId(menu)}
                                        >
                                            {menu.subCategoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    )} */}
                    {/* <div className="flex gap-6 mt-6 w-11/12">
                        <button onClick={handleUpdateVariantsData} className="bg-blue-500 w-1/2 text-white py-2 px-4 rounded-lg mr-2">Save</button>
                        <button onClick={handleClose} className="bg-gray-300 text-gray-800 py-2 px-4 w-1/2 rounded-lg">Cancel</button>
                    </div> */}
                    <div className="flex gap-6 mt-6 w-full">
                        <div className="w-full">
                            <button onClick={handleCopyMenuFromOther} className="addCategorySaveBtn copyMenuButton ">Save</button>
                        </div>
                        <div className="w-full">
                            <button onClick={handleClose} className="addCategoryCancleBtn  copyMenuButton  bg-gray-700">Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default MenuDashboard;
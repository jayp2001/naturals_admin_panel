/* eslint-disable no-dupe-keys */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import './categoryBusinessReport.css';
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
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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
function CategoryBusinessReport() {


    const [anchorEl, setAnchorEl] = React.useState(null);
    const openD = Boolean(anchorEl);
    const handleCloseD = () => {
        setAnchorEl(null);
    };
    const id = openD ? 'simple-popover' : undefined;
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [filter, setFilter] = React.useState(false);
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
        getFilterList();
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
            status: true
        })
        setUnit({ unit: '', price: '' });
        setPrice(null)
        setSubCategoryId('')
        setCopyMenuCheckBox(false)
        setEditPrice({
            percentage: '',
            fixed: ''
        })
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

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
    const [unit, setUnit] = React.useState({ unit: '', price: '', status: true });
    const [subCategoryId, setSubCategoryId] = useState(null);
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
    const [totalItem, setItemTotal] = useState();
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
        status: true
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
    const [filterSelect, setFilterSelect] = useState('A');
    const [filterList, setFilterList] = useState([]);
    const [finalSelectedCategory, setFinalSelectedCategory] = useState();
    const [copySubCategoryId, setCopySubCategoryId] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [inputError, setInputError] = useState('');
    const autoFocus = useRef(null)
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
    const getAllReport = async (tId) => {
        if (window.confirm('Are you sure you want to Download Report ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}menuItemrouter/exportPdfForItemSalesReport?subCategoryId=&billType=${filterSelect == 'A' ? '' : filterSelect ? filterSelect : ''}&startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}menuItemrouter/exportPdfForItemSalesReport?subCategoryId=&billType=${filterSelect == 'A' ? '' : filterSelect ? filterSelect : ''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = 'Whole_Sales_Report' + '_' + filterSelect + '_' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const getCategoryWiseReport = async (tId) => {
        if (window.confirm('Are you sure you want to Download Invoice ... ?')) {
            await axios({
                url: filter ? `${BACKEND_BASE_URL}menuItemrouter/exportPdfForItemSalesReport?subCategoryId=${tId}&billType=${filterSelect == 'A' ? '' : filterSelect ? filterSelect : ''}&startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}menuItemrouter/exportPdfForItemSalesReport?subCategoryId=${tId}&billType=${filterSelect == 'A' ? '' : filterSelect ? filterSelect : ''}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = finalSelectedCategory + '_' + filterSelect + '_' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }
    const handleSUbmitForm = async () => {
        let formValidation;
        if (!editData) {
            formValidation = {
                itemName: fullData.itemName.trim().length === 0,
                itemGujaratiName: fullData.itemGujaratiName.trim().length === 0,
                itemCode: fullData.itemCode.trim().length === 0,
                itemShortKey: fullData.itemShortKey.trim().length === 0,
                spicyLevel: !fullData?.spicyLevel,
                itemSubCategory: !fullData.itemSubCategory,
                price: price === null || price.trim().length === 0,
                variantsList: fullData.variantsList.length === 0 || fullData.variantsList.some(variant => variant.unit.trim().length === 0 || variant.price.trim().length === 0)
            };
            setAllFormValidation(formValidation);
        } else {
            formValidation = {
                itemName: editData.itemName.trim().length === 0,
                itemGujaratiName: editData.itemGujaratiName.trim().length === 0,
                itemCode: editData.itemCode === null,
                itemShortKey: editData.itemShortKey.trim().length === 0,
                itemSubCategory: !editData.itemSubCategory,
                price: editData.variantsList.length === 0 || (editData.variantsList[0]?.price === null || editData.variantsList[0]?.price?.length === 0),
                variantsList: editData.variantsList.length === 0 || editData.variantsList.some(variant => variant.unit.trim().length === 0 || variant.price === null)
            };
            setAllFormValidation(formValidation);
        }

        if (Object.values(formValidation).some(field => field)) {
            setError('Please Fill All Fields');
            return;
        }
        const token = localStorage.getItem('token');
        console.log('Full Form Data', fullData)

        if (!editData) {
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
                variantsList: editData.variantsList
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
                    // setIsEdit(false);
                    setEditData(null)
                    setVariantFields([]);
                    getAllCategory();
                    console.log('final Selected Value ===>', finalSelected)
                    // handleSubCategoryClick(finalSelected, menuId);
                    setEditItem(false)
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
    const handleOpen = () => { setOpen(true); setDisabled(false) };

    const addVariantFields = () => {
        const formValidation = {
            unit: unit.unit.trim().length === 0,
            unitPrice: unit.price.trim().length === 0 || unit.price === '0'
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

        const newVariant = { unit: unit.unit, price: unit.price, index: variantFields.length };
        if (unit.unit === 'NO') {
            setPrice(unit.price)
        }

        setVariantFields(prevFields => {
            if (unit.unit === 'NO') {
                return [newVariant, ...prevFields];
            } else {
                return [...prevFields, newVariant];
            }
        });

        if (editData) {
            setEditData(prevState => {
                if (unit.unit === 'No') {
                    return {
                        ...prevState,
                        allVariantsList: [{ unit: unit.unit, price: unit.price, status: true }, ...prevState.allVariantsList]
                    };
                } else {
                    return {
                        ...prevState,
                        allVariantsList: [...prevState.allVariantsList, { unit: unit.unit, price: unit.price, status: true }]
                    };
                }
            });
        } else {
            setFullData(prevState => {
                if (unit.unit === 'No') {
                    return {
                        ...prevState,
                        variantsList: [{ unit: unit.unit, price: unit.price, status: true }, ...prevState.variantsList]
                    };
                } else {
                    return {
                        ...prevState,
                        variantsList: [...prevState.variantsList, { unit: unit.unit, price: unit.price, status: true }]
                    };
                }
            });
        }

        setGetAllUnit(prevUnits => prevUnits.filter(u => u !== unit.unit));
        setUnit({ unit: '', price: '' });
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
                    price: defaultPrice
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
                        { unit: defaultUnit, price: defaultPrice, status: true }
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
                        { unit: defaultUnit, price: defaultPrice, status: true }
                    ]
            }));
        }
    };

    const selectedcategoryName = subCategories.find(val => val.subCategoryId === finalSelected);


    const handleDelete = (index) => {
        const unitToDelete = variantFields[index].unit;
        console.log('unit', unitToDelete)

        if (unitToDelete === 'NO') {
            setPrice('');
            if (editData) {
                setEditData((prev) => ({
                    ...prev,
                    variantsList: prev.variantsList.map((variant, i) =>
                        i === 0 ? { ...variant, price: '' } : variant
                    ),
                }));
            }
        }

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
        setVariantFields(item.variantsList);
        setGetAllUnit(prevUnits => prevUnits.filter(u => !item.allVariantsList.some(variant => variant.unit === u)));
    };

    const getAllUnits = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getUnit`, config);
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
        setFinalSelectedCategory(findingData?.subCategoryName)
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
            await axios.get(filter ? `${BACKEND_BASE_URL}menuItemrouter/getItemSalesReport?billType=${filterSelect == 'A' ? '' : filterSelect ? filterSelect : ''}&subCategoryId=${subCategoryId}&startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}menuItemrouter/getItemSalesReport?billType=${filterSelect == 'A' ? '' : filterSelect ? filterSelect : ''}&subCategoryId=${subCategoryId}`, config)
                .then((res) => {
                    setItemData(res.data.items);
                    setItemTotal(res.data);
                    console.log('LLLLP', res.data)
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
    const handleSubCategoryClickOnChange = async (subCategoryId, billType) => {
        setClickedSubCategory(subCategoryId);
        setSubCategoryFirstId(subCategoryId)
        setMenuId(menuCategory)
        const findingData = subCategories.find(val => val.subCategoryId === subCategoryId)
        setFinalSelected(subCategoryId)
        setFinalSelectedCategory(findingData?.subCategoryName)
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
            await axios.get(filter ? `${BACKEND_BASE_URL}menuItemrouter/getItemSalesReport?billType=${billType == 'A' ? '' : billType ? billType : ''}&subCategoryId=${subCategoryId}&startDate=${state[0].startDate}&endDate=${state[0].endDate}` : `${BACKEND_BASE_URL}menuItemrouter/getItemSalesReport?billType=${billType == 'A' ? '' : billType ? billType : ''}&subCategoryId=${subCategoryId}`, config)
                .then((res) => {
                    setItemData(res.data.items);
                    setItemTotal(res.data);
                    console.log('LLLLP', res.data)
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
    const handleSubCategoryClickC = async (subCategoryId, menuCategory) => {
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
            await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getItemSalesReport?billType=${filterSelect == 'A' ? '' : filterSelect ? filterSelect : ''}&subCategoryId=${subCategoryId}`, config)
                .then((res) => {
                    setItemData(res.data.items);
                    setItemTotal(res.data);
                    console.log('LLLLP', res.data)
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
    const handleSubCategoryClickByFilter = async (subCategoryId, menuCategory) => {
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
            await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getItemSalesReport?billType=${filterSelect == 'A' ? '' : filterSelect ? filterSelect : ''}&subCategoryId=${subCategoryId}&startDate=${state[0].startDate}&endDate=${state[0].endDate}`, config)
                .then((res) => {
                    setItemData(res.data.items);
                    setItemTotal(res.data);
                    console.log('LLLLP', res.data)
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
        setVariantEditData(data.allVariantsList);
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
            status: true
        };
        const updatedVariantEditData = [...variantEditData, newVariant];
        setVariantEditData(updatedVariantEditData)
        setSecondVariantData({
            unit: '',
            price: ''
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
        const updatedItemData = [...itemData];
        updatedItemData[itemIndex].variantsList[variantIndex].price = value;
        setItemData(updatedItemData);
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

    const handleCopySourceChange = (event) => {
        const selectedMenu = copyMenuItems.find(menu => menu.menuCategoryName === event.target.value);
        setCopySource(selectedMenu);
    };
    const getFilterList = async () => {
        await axios.get(`${BACKEND_BASE_URL}billingrouter/ddlBillCategory`, config)
            .then((res) => {
                setFilterList(res.data);
            })
    }
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
    // const scrollContainerRef = useRef(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);
    // const scrollLeft = () => {
    //     if (scrollContainerRef.current) {
    //         scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    //     }
    // };

    // const scrollRight = () => {
    //     if (scrollContainerRef.current) {
    //         scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    //     }
    // };

    // const updateButtons = () => {
    //     if (scrollContainerRef.current) {
    //         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    //         setShowPrev(scrollLeft > 0);
    //         setShowNext(scrollLeft + clientWidth < scrollWidth);
    //     }
    // };

    const handleMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

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
                <div className="patti rounded-lg shadow-md p-2 mb-2 bg-white w-full">
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

                            <Button variant="contained" className='addProductBtn' onClick={() => getAllReport(finalSelected)}>
                                Whole Report
                            </Button>
                            <Button variant="contained" className='addProductBtn' onClick={() => getCategoryWiseReport(finalSelected)}>
                                Category wise Report
                            </Button>
                            <div style={{ width: '200px' }}>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={filterSelect}
                                        size='small'
                                        placeholder='Filter'
                                        onChange={(e) => {
                                            setFilterSelect(e.target.value);
                                            handleSubCategoryClickOnChange(finalSelected, e.target.value);
                                        }}
                                    >
                                        <MenuItem value={'A'}>All</MenuItem>
                                        {
                                            filterList?.map((data, index) => (
                                                <MenuItem value={data}>{data}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="addProductButton">
                                <div className='ml-6 col-span-6' >
                                    {tab != 3 &&
                                        <>
                                            <div className='flex'>
                                                <div className='dateRange text-center' aria-describedby={id} onClick={handleClick}>
                                                    <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state[0].startDate && filter ? state[0].startDate.toDateString() : 'Select Date')} -- {(state[0].endDate && filter ? state[0].endDate.toDateString() : 'Select Date')}
                                                </div>
                                                <div className='resetBtnWrap col-span-3'>
                                                    <button className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`} onClick={() => {
                                                        setFilter(false);
                                                        handleSubCategoryClickC(finalSelected)
                                                        setState([
                                                            {
                                                                startDate: new Date(),
                                                                endDate: new Date(),
                                                                key: 'selection'
                                                            }
                                                        ])
                                                    }}><CloseIcon /></button>
                                                </div>
                                            </div>
                                            <Popover
                                                id={id}
                                                open={openD}
                                                style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                                anchorEl={anchorEl}
                                                onClose={handleCloseD}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
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
                                                            <button className='stockInBtn' onClick={() => { setFilter(true); handleCloseD(); handleSubCategoryClickByFilter(finalSelected) }}>Apply</button>
                                                        </div>
                                                        <div className='col-span-3'>
                                                            <button className='stockOutBtn' onClick={handleCloseD}>cancle</button>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </Popover>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="maina_box">
                {subCategories.length > 0 && (
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
                <div className='sideTable mt-4'>
                    <Paper sx={{ width: '100%' }}>
                        {/* <TableContainer className='sideUp'>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" colSpan={2}>
                                            Item Info
                                        </TableCell>
                                        <TableCell align="center" colSpan={2}>
                                            Regular
                                        </TableCell>
                                        <TableCell align="center" colSpan={2}>
                                            Complimentary
                                        </TableCell>
                                        <TableCell align="center" colSpan={2}>
                                            Cancel
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center">
                                            No.
                                        </TableCell>
                                        <TableCell align="center">
                                            Item Name
                                        </TableCell>
                                        <TableCell align="center">
                                            Qty
                                        </TableCell>
                                        <TableCell align="center">
                                            Revenue
                                        </TableCell>
                                        <TableCell align="center">
                                            Qty
                                        </TableCell>
                                        <TableCell align="center">
                                            Revenue
                                        </TableCell>
                                        <TableCell align="center">
                                            Qty
                                        </TableCell>
                                        <TableCell align="center">
                                            Revenue
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer> */}
                        <TableContainer className='sideTable'>
                            <Table >
                                <TableHead>
                                    <TableRow style={{ backgroundColor: '#f0f0f0', position: 'sticky', top: 0, zIndex: 1 }}>
                                        <TableCell align="center" style={{ fontWeight: "600" }} colSpan={2} >
                                            Item Info
                                        </TableCell>
                                        <TableCell align="center" style={{ fontWeight: "600" }} colSpan={2} >
                                            Regular
                                        </TableCell>
                                        <TableCell align="center" style={{ fontWeight: "600" }} colSpan={2} >
                                            Complimentary
                                        </TableCell>
                                        <TableCell align="center" style={{ fontWeight: "600" }} colSpan={2} >
                                            Cancel
                                        </TableCell>
                                    </TableRow>
                                    <TableRow style={{ backgroundColor: '#fff', position: 'sticky', top: 55.74, zIndex: 1 }}>
                                        <TableCell style={{ fontWeight: "600" }} align="left" >
                                            No.
                                        </TableCell>
                                        <TableCell style={{ fontWeight: "600" }} align="left">
                                            Item Name
                                        </TableCell>
                                        <TableCell style={{ fontWeight: "600" }} align="center">
                                            Qty
                                        </TableCell>
                                        <TableCell style={{ fontWeight: "600" }} align="center">
                                            Revenue
                                        </TableCell>
                                        <TableCell style={{ fontWeight: "600" }} align="center">
                                            Qty
                                        </TableCell>
                                        <TableCell style={{ fontWeight: "600" }} align="center">
                                            Revenue
                                        </TableCell>
                                        <TableCell style={{ fontWeight: "600" }} align="center">
                                            Qty
                                        </TableCell>
                                        <TableCell style={{ fontWeight: "600" }} align="center">
                                            Revenue
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className='sideDown'>
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
                                            <TableCell align='left'>
                                                {item.itemName}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {item.soldQty}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {parseFloat(item.soldRevenue ? item.soldRevenue : 0).toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {item.complimentaryQty}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {parseFloat(item.complimentaryRevenue ? item.complimentaryRevenue : 0).toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {item.cancelQty}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {parseFloat(item.cancelRevenue ? item.cancelRevenue : 0).toLocaleString("en-IN")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow
                                        onMouseEnter={() => handleMouseEnter()}
                                        onMouseLeave={handleMouseLeave}
                                        style={{ backgroundColor: '#f5f5f5', cursor: 'pointer' }}
                                    >
                                        <TableCell style={{ maxWidth: '15px', width: '15px' }}>

                                        </TableCell>
                                        <TableCell align='left' style={{ fontWeight: 600, fontSize: '16px' }}>
                                            Total
                                        </TableCell>
                                        <TableCell align='center'>
                                        </TableCell>
                                        <TableCell align='center' style={{ fontWeight: 600, fontSize: '16px' }}>
                                            {parseFloat(totalItem?.totalRevenue ? totalItem.totalRevenue : 0).toLocaleString("en-IN")}
                                        </TableCell>
                                        <TableCell align='center'>
                                        </TableCell>
                                        <TableCell align='center' style={{ fontWeight: 600, fontSize: '16px' }}>
                                            {parseFloat(totalItem?.totalComplimentaryRevenue ? totalItem.totalComplimentaryRevenue : 0).toLocaleString("en-IN")}
                                        </TableCell>
                                        <TableCell align='center'>
                                        </TableCell>
                                        <TableCell align='center' style={{ fontWeight: 600, fontSize: '16px' }}>
                                            {parseFloat(totalItem?.totalCancelRevenue ? totalItem.totalCancelRevenue : 0).toLocaleString("en-IN")}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default CategoryBusinessReport;
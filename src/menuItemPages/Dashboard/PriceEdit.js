/* eslint-disable no-dupe-keys */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import './css/Dashboard.css';
import { useState, useEffect, useRef } from "react";
import React from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import Table from '@mui/material/Table';
import PropTypes from 'prop-types';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Modal from '@mui/material/Modal';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useSpring, animated } from '@react-spring/web';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FilledInput, FormControlLabel, FormHelperText, FormLabel, Input, InputAdornment, Paper, Radio, RadioGroup, Switch } from '@mui/material';
import { ReactTransliterate } from 'react-transliterate';

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
function Dashboard() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    useEffect(() => {
        getAllCategory();
        getSubCategory();
        getAllUnits();
        getAllItems(menuId);
    }, []);

    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
        setEditItem(false)
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
        setVariantFields([]);
        setPrice(null)
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
    const [unit, setUnit] = React.useState({ unit: '', price: '', status: true });
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [menuCategory, setMenuCategory] = useState([]);
    const [menuId, setMenuId] = useState('base_2001');
    const [fullData, setFullData] = useState({
        itemName: '',
        itemGujaratiName: '',
        itemCode: '',
        itemShortKey: '',
        itemSubCategory: '',
        itemDescription: '',
        variantsList: []
    });
    const [itemData, setItemData] = useState([]);
    const [editItem, setEditItem] = useState(false);
    const [subCategoryFirstId, setSubCategoryFirstId] = useState();
    const [editData, setEditData] = useState();
    const [subCategoryName, setSubCategoryName] = useState();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [toggle, setToggle] = useState(false)
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
    const [editButtonMenu, setEditButtonMenu] = useState('menuCategory_1713785180891')
    const [menuName, setMenuName] = useState('')
    const [copyMenuPopUp, setCopyMenuPopUp] = useState(false)
    const [copyMenuItems, setCopyMenuItems] = useState([])
    const [price, setPrice] = useState();
    const [copyMenuCheckBox, setCopyMenuCheckBox] = useState(false)
    const [updatedVarintsName, setUpdatedVariantsName] = useState();
    const [finalSelected, setFinalSelected] = useState();
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
    const handleSUbmitForm = async () => {
        const formValidation = {
            itemName: fullData.itemName.trim().length === 0,
            itemGujaratiName: fullData.itemGujaratiName.trim().length === 0,
            itemCode: fullData.itemCode.trim().length === 0,
            itemShortKey: fullData.itemShortKey.trim().length === 0,
            itemSubCategory: !fullData.itemSubCategory,
            variantsList: fullData.variantsList.length === 0 || fullData.variantsList.some(variant => variant.unit.trim().length === 0 || variant.price.trim().length === 0)
        };

        setAllFormValidation(formValidation);

        if (Object.values(formValidation).some(field => field)) {
            setError('Please Fill All Fields');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/addItemData`,
                fullData,
                config
            );
            if (response.data === 'Item Added Successfully') {
                setSuccess(true);
                setOpen(true)
                setFullData({
                    itemName: '',
                    itemGujaratiName: '',
                    itemCode: '',
                    itemShortKey: '',
                    itemSubCategory: '',
                    itemDescription: '',
                    variantsList: []
                })
                setPrice(null)
                autoFocus.current && autoFocus.current.focus();
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
                setVariantFields([]);
                getAllCategory();
                handleSubCategoryClick(finalSelected)
                getAllUnits();
                getAllItems(menuId);
            }
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    };
    const getAllCategory = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getMenuCategory`, config);
            setMenuCategory(response.data)
            setMenuId(response.data[0].menuCategoryId)
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    }
    const getAllItems = async (menuId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found");
            }

            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getItemData?menuId=${menuId}`, config);
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    };
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
                getAllCategory();
                getAllUnits();
                getAllItems(menuId);
            }
            catch (error) {
                setError(error?.response?.data || 'Network Error!!!...')
            }
        }
    }
    const handleOpen = () => setOpen(true);
    const addVariantFields = () => {
        const formValidation = {
            unit: unit.unit.trim().length === 0,
            price: unit.price.trim().length === 0
        };

        setAllFormValidation(formValidation);

        if (Object.values(formValidation).some(field => field)) {
            setError('Please Fill All Fields');
            return;
        }
        setAddVariant(true);
        setVariantFields([...variantFields, { variantName: unit.unit, variantPrice: unit.price, index: variantFields.length }]);
        setFullData(prevState => ({
            ...prevState,
            variantsList: [...prevState.variantsList, { unit: unit.unit, price: unit.price, status: true }]
        }));
        setUnit({ unit: '', price: '' })
    };
    // const addDefaultVariant = (defaultPrice) => {
    //     setAddVariant(false);
    //     const defaultUnit = 'NO';
    //     let variantUpdated = false;

    //     const updatedVariantFields = variantFields.map((val) => {
    //         if (val.variantName === defaultUnit) {
    //             variantUpdated = true;
    //             return { ...val, variantPrice: defaultPrice };
    //         }
    //         return val;
    //     });

    //     if (!variantUpdated) {
    //         updatedVariantFields.push({
    //             variantName: defaultUnit,
    //             variantPrice: defaultPrice,
    //             index: variantFields.length
    //         });
    //     }

    //     setVariantFields(updatedVariantFields);

    //     setFullData(prevState => ({
    //         ...prevState,
    //         variantsList: [
    //             ...prevState.variantsList.filter(v => v.unit !== defaultUnit),
    //             { unit: defaultUnit, price: defaultPrice, status: true }
    //         ]
    //     }));

    //     setAddVariant(true);
    // };

    const addDefaultVariant = (defaultPrice) => {
        setAddVariant(false);
        const defaultUnit = 'NO';
        let updatedVariantFields;

        if (defaultPrice.trim() === '') {
            updatedVariantFields = variantFields.filter(val => val.variantName !== defaultUnit);
        } else {
            let variantUpdated = false;

            updatedVariantFields = variantFields.map((val) => {
                if (val.variantName === defaultUnit) {
                    variantUpdated = true;
                    return { ...val, variantPrice: defaultPrice };
                }
                return val;
            });

            if (!variantUpdated) {
                updatedVariantFields.push({
                    variantName: defaultUnit,
                    variantPrice: defaultPrice,
                    index: variantFields.length
                });
            }
        }

        setVariantFields(updatedVariantFields);

        setFullData(prevState => ({
            ...prevState,
            variantsList: defaultPrice.trim() === ''
                ? prevState.variantsList.filter(v => v.unit !== defaultUnit)
                : [
                    ...prevState.variantsList.filter(v => v.unit !== defaultUnit),
                    { unit: defaultUnit, price: defaultPrice, status: true }
                ]
        }));

        setAddVariant(true);
    };


    const handleDelete = (index) => {
        const updatedFields = variantFields.filter((_, i) => i !== index);
        setVariantFields(updatedFields);
    };
    const getSubCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/ddlSubCategory`, config);
            const subCategories = response.data;
            setSubCategories(subCategories);

            if (subCategories.length > 0) {
                const firstSubCategoryId = subCategories[0].subCategoryId;
                handleSubCategoryClick(firstSubCategoryId);
                setItemDataNull(false)
            }
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    };

    const handleEditItem = (id) => {
        setEditData(id);
        setVariantsItemObject(id)
        setVariantEditData(id.variantsList);
        setSubCategoryName(id.subCategoryName);
        setEditItem(true);
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

    const handleSubCategoryClick = async (subCategoryId) => {
        setClickedSubCategory(subCategoryId);
        setSubCategoryFirstId(subCategoryId)
        setFinalSelected(subCategoryId)
        const token = localStorage.getItem('token');
        try {
            setSideBarColor(true)
            await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getItemData?menuId=${menuId}&subCategoryId=${subCategoryId}`, config)
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
                    if (error.response.data === 'No Data Found') {
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
        setEditPriceMode(true)
        const updatedItemData = itemData.map(item => {
            const updatedVariantsList = item.variantsList.map(variant => {
                if (editPriceType.percentage) {
                    const currentPrice = parseFloat(variant.price);
                    const percentage = parseFloat(editPrice.percentage);
                    const newPrice = currentPrice * (1 + percentage / 100);
                    return { ...variant, price: Math.round(newPrice) };
                } else if (editPriceType.fixed) {
                    const currentPrice = parseFloat(variant.price);
                    const fixedAmount = parseFloat(editPrice.fixed);
                    const newPrice = currentPrice + fixedAmount;
                    return { ...variant, price: Math.round(newPrice) };
                } else {
                    return variant;
                }
            });
            return { ...item, variantsList: updatedVariantsList };
        });
        setItemData(updatedItemData);
        handleClose();
    };
    const handleEditPrice = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(`${BACKEND_BASE_URL}menuItemrouter/updateMultipleItemPrice`, itemData, config)
            if (response.data === 'Price Updated Successfully') {
                setSuccess('Price Updated Successfully')
                setEditPriceMode(false)
            }
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
        }
    }
    const handleManualVariantsname = (data) => {
        setVariantsItemObject(data)
        setVariantEditData(data.variantsList);
        setManualVariantsPopUp(true);
    };
    const handleSecondAddVarinats = () => {
        if (!secondVariantData.unit || !secondVariantData.price) {
            console.error('Both unit and price must be provided');
            return;
        }
        const newVariant = {
            unit: secondVariantData.unit,
            price: secondVariantData.price
        };
        const updatedVariantEditData = [...variantEditData, newVariant];
        setVariantEditData(updatedVariantEditData)
    };
    const handleDeleteVariant = (index) => {
        const updatedVariants = [...variantEditData];
        updatedVariants.splice(index, 1);
        setVariantEditData(updatedVariants);
    };
    const handleUpdateVariantsData = async () => {
        const token = localStorage.getItem('userInfo.token');
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
            if (response.data === 'Item Updated Successfully') {
                setSuccess(true)
                setManualVariantsPopUp(false)
                getAllItems(menuId);
                getAllCategory();
                getAllUnit();
            }
        } catch (error) {
            setError(error?.response?.data || 'Network Error!!!...')
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
        setCopyMenuCheckBox(true)
    }
    return (
        <div className='BilingDashboardContainer p-3 '>
            <div className='col-span-12'>
                <div className='productTableSubContainer'>
                    <div className='h-full grid grid-cols-12'>
                        <div className='h-full col-span-10'>
                            <div className='grid grid-cols-12  px-6 overflow-x-auto h-full' style={{ whiteSpace: 'nowrap' }}>
                                {menuCategory.map((menu, index) => (
                                    <div
                                        key={index}
                                        className={`col-span-1  ${tab === index ? 'productTabAll' : 'productTab'}`}
                                        onClick={() => {
                                            getAllItems(menu.menuCategoryId);
                                            setTab(index);
                                            setSearchWord('');
                                            setDataSearch([]);
                                            setMenuId(menu.menuCategoryId);
                                        }}
                                        style={{ minWidth: 'fit-content' }} // Ensures each tab has minimum width
                                    >
                                        <div className='statusTabtext'>{menu.menuCategoryName}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex gap-4 col-span-2 justify-self-end pr-3  h-full'>
                            <div className='self-center '>
                                <button className='addProductBtn' onClick={handleOpen}>Add Product</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <ToastContainer />
            <div className="maina_box">
                {subCategories.length > 0 && (
                    <div className="sidebar overflow-y-auto blackCountLogoWrp shadow-2xl py-4 my-4 mr-4">
                        {subCategories.map(subcategory => (
                            <div
                                key={subcategory.subCategoryId}
                                className={`sidebar_menu my-2  cursor-pointer rounded-lg p-2 hover:bg-blue-600 text-start text-lg ${clickedSubCategory === subcategory.subCategoryId ? 'ClickedBlueBg' : ''}`}
                                onClick={() => handleSubCategoryClick(subcategory.subCategoryId)}
                            >
                                {subcategory.subCategoryName}
                            </div>
                        ))}
                    </div>
                )}
                <TableContainer className='mt-4 '>

                    <div className="mt-4">
                        {!editPriceMode && !itemDataNull && (
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
                                                    />
                                                </Search>
                                                <button className='addProductBtn' onClick={() => { setEditPricePopUp(true); setEditPriceType({ percentage: true }) }} >Edit Price</button>
                                            </div>
                                            <div className="flex gap-4">
                                                <button className='addProductBtn' onClick={() => {
                                                    setCopyMenuPopUp(true);
                                                    const menuCateory = menuCategory.find(name => name.menuCategoryId === menuId)
                                                    setMenuName(menuCateory)
                                                    const updatedCopyMenuItems = menuCategory.filter(menu => menu.menuCategoryId !== menuId);
                                                    setCopyMenuItems(updatedCopyMenuItems)
                                                }} >Copy Price From Menu</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex justify-end w-full'>
                                            <div>
                                                <button onClick={handleEditPrice} className="bg-blue-500  text-white py-2 px-4 rounded-lg mr-2">Save</button>
                                            </div>
                                            <div>
                                                <button onClick={() => setEditPriceMode(false)} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg">Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className=''>No.</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell >Gujarati Name</TableCell>
                                                <TableCell >Short Code</TableCell>
                                                <TableCell >Short Name</TableCell>
                                                <TableCell >Variant Details</TableCell>
                                                <TableCell >Description</TableCell>
                                                <TableCell align='right' >Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className='bg-white'>
                                            {itemData.map((item, index) => (
                                                <TableRow key={index}  >
                                                    <TableCell component="th" scope="row" style={{ maxWidth: '15px', width: '15px' }}>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className='table_row'>
                                                        {item.itemName}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className='table_row'>
                                                        {item.itemGujaratiName}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className='table_row'>
                                                        {item.itemCode}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className='table_row'>
                                                        {item.itemShortKey}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className='table_row'>
                                                        {item?.variantsList[0]?.price}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className='table_row'>
                                                        {item.itemDescription}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className='table_row'>
                                                        <div className="flex w-100">
                                                            <div onClick={() => handleEditItem(item)} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600 '><BorderColorIcon className='text-gray-600 table_icon2' /></div>
                                                            <div onClick={() => handleItemDelete(item.itemId)} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600'><DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' /></div>
                                                            <div onClick={() => handleManualVariantsname(item)} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-green-600'><p className='text-gray-600 table_icon2 text-center font-bold text-base' >V</p></div>
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
                            <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '12px' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className='px-0'>No.</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell style={{ width: '100%' }}>Variants</TableCell>
                                            <TableCell align="right"></TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className='bg-white'>
                                        {itemData.map((item, itemIndex) => (
                                            <TableRow key={itemIndex}>
                                                <TableCell component="th" scope="row" className='table_row w-3'>
                                                    {itemIndex + 1}
                                                </TableCell>
                                                <TableCell component="th" scope="row" className='table_row'>
                                                    {item.itemName}
                                                </TableCell>
                                                <TableCell component="th" scope="row" className='table_row'>
                                                    <div className="flex gap-4">
                                                        {item?.variantsList.map((variant, variantIndex) => (
                                                            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard" className='w-full formControl' key={variantIndex}>
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
                                                                    className='w-full'
                                                                    autoComplete="off"
                                                                />
                                                            </FormControl>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">
                                                </TableCell>
                                                <TableCell component="th" scope="row" className='table_row'>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                    {itemDataNull && (
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
                </TableContainer>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='addProdutModal'>
                    <div className="text-2xl ">
                        Add Items
                    </div>
                    <hr className='my-6' />
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                className={`w-full ${allFormValidation.itemCode ? 'border-red-500' : ''}`}
                                error={allFormValidation.itemCode}
                                helperText={allFormValidation.itemCode ? 'Item Code is required' : ''}
                                label="Code"
                                variant="outlined"
                                value={fullData.itemCode}
                                onChange={(e) => {
                                    setFullData({ ...fullData, itemCode: e.target.value })
                                    setAllFormValidation({ ...allFormValidation, itemCode: false })
                                }}
                                autoComplete="off"
                                inputRef={autoFocus}
                            />
                        </div>
                        <div className="col-span-3 ">
                            <TextField
                                id="outlined-basic"
                                label="Item Name"
                                variant="outlined"
                                value={fullData.itemName}
                                className={`w-full ${allFormValidation.itemName ? 'border-red-500' : ''}`}
                                error={allFormValidation.itemName}
                                helperText={allFormValidation.itemName ? 'Item Name is required' : ''}
                                onChange={(e) => {
                                    setFullData({ ...fullData, itemName: e.target.value })
                                    setAllFormValidation({ ...allFormValidation, itemName: false })
                                }}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-3">
                            <ReactTransliterate
                                id="outlined-basic"
                                value={fullData.itemGujaratiName}
                                onChangeText={(e) => {
                                    setFullData({ ...fullData, itemGujaratiName: e })
                                    setAllFormValidation({ ...allFormValidation, itemGujaratiName: false })
                                }}
                                variant="outlined"
                                className={`w-full border p-4 rounded-md border-gray-300 ${allFormValidation.itemGujaratiName ? 'border-red-500' : ''}`}
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
                                id="outlined-basic"
                                className={`w-full ${allFormValidation.itemShortKey ? 'border-red-500' : ''}`}
                                error={allFormValidation.itemShortKey}
                                helperText={allFormValidation.itemShortKey ? 'Item Short is required' : ''}
                                label="Short Code"
                                variant="outlined"
                                value={fullData.itemShortKey}
                                onChange={(e) => setFullData({ ...fullData, itemShortKey: e.target.value })}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                className={`w-full ${allFormValidation.itemName ? 'border-red-500' : ''}`}
                                error={allFormValidation.itemName}
                                helperText={allFormValidation.itemName ? 'Item Price is required' : ''}
                                label="Price"
                                value={price || ''}
                                variant="outlined"
                                onChange={(e) => {
                                    setPrice(e.target.value)
                                    addDefaultVariant(e.target.value)
                                    setAllFormValidation({ ...allFormValidation, itemName: false })
                                }}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-3">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Sub Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Sub Category"
                                    value={fullData.itemSubCategory}
                                    className={`w-full ${allFormValidation.itemSubCategory ? 'border-red-500 rela ' : ''}`}
                                    error={allFormValidation.itemSubCategory}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setFullData(prevItemData => ({
                                            ...prevItemData,
                                            itemSubCategory: e.target.value
                                        }));
                                        setAllFormValidation({ ...allFormValidation, itemSubCategory: false })
                                    }}
                                >
                                    {subCategories.map((category, index) => (
                                        <MenuItem key={index} value={category.subCategoryId}>{category.subCategoryName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-span-9">
                            <TextField
                                id="outlined-basic"
                                className={`w-full ${allFormValidation.itemDescription ? 'border-red-500' : ''}`}
                                label="Item Description"
                                variant="outlined"
                                value={fullData.itemDescription}
                                onChange={(e) => {
                                    setFullData({ ...fullData, itemDescription: e.target.value })
                                    setAllFormValidation({ ...allFormValidation, itemDescription: false })
                                }}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="text-2xl my-6">
                        Add Unit
                    </div>
                    <hr className='my-6' />
                    <div className="flex w-full gap-6 ">
                        <div className='flex gap-6 w-3/6 items-center'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Age"
                                    value={unit.unit}
                                    error={allFormValidation.unit ? true : false}
                                    helperText={allFormValidation.unit ? 'Unit is required' : ''}

                                    onChange={(e) => {
                                        setUnit({ ...unit, unit: e.target.value })
                                        setAllFormValidation({ ...allFormValidation, unit: false })
                                    }}
                                >
                                    {getAllUnit && getAllUnit.map((unit, index) => (
                                        <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                id="outlined-basic"
                                className='w-full'
                                label="Unit Price"
                                value={unit.price}
                                variant="outlined"
                                error={allFormValidation.price ? true : false}
                                helperText={allFormValidation.price ? 'Price is required' : ''}
                                onChange={(e) => {
                                    setUnit({ ...unit, price: e.target.value })
                                    setAllFormValidation({ ...allFormValidation, price: false })
                                }}
                                autoComplete="off"
                            />
                            <div className="w-full">
                                <button onClick={addVariantFields} className="addCategorySaveBtn ">Add</button>
                            </div>
                            {/* <button onClick={addVariantFields} className='addProductBtn h-full w-full mt-2'>Add </button> */}
                        </div>
                        <div>
                            {variantFields.map((period, index) => (
                                <div key={index} className="flex w-full mt-2  gap-3 items-center">
                                    <div className='w-1/2'>
                                        <TextField
                                            id="outlined-basic"
                                            className='w-full'
                                            label="Unit Name"
                                            variant="outlined"
                                            disabled
                                            value={period.variantName}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className='w-1/2'>
                                        <TextField
                                            id="outlined-basic"
                                            className='w-full'
                                            label="Unit Price"
                                            variant="outlined"
                                            disabled
                                            value={period.variantPrice}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 h-11 text-center w-11 hover:bg-red-600 hover:font-white' onClick={() => handleDelete(index)}>
                                        <DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-6 mt-6 w-full justify-end px-4">
                        <div className="w-1/5">
                            <button onClick={handleSUbmitForm} className="addCategorySaveBtn ml-4">Save</button>
                        </div>
                        <div className="w-1/5">
                            <button onClick={handleClose} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={editItem}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='addProdutModal'>
                    <div className="text-2xl font-bold">
                        Edit Product
                    </div>
                    <hr className='my-6' />
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2 ">
                            <TextField
                                id="outlined-basic"
                                className='w-full'
                                label="Item Name"
                                variant="outlined"
                                value={varinatsItemObject?.itemName}
                                onChange={(e) => {
                                    setFullData({ ...fullData, itemName: e.target.value })
                                }}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                className='w-full'
                                label="Item Gujarati Name"
                                variant="outlined"
                                value={editData?.itemGujaratiName}
                                onChange={(e) => setFullData({ ...fullData, itemGujaratiName: e.target.value })}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                className='w-full'
                                label="Item Code"
                                variant="outlined"
                                value={editData?.itemCode}
                                onChange={(e) => setFullData({ ...fullData, itemCode: e.target.value })}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                className='w-full'
                                label="Item Short Code"
                                variant="outlined"
                                value={editData?.itemShortKey}
                                onChange={(e) => setFullData({ ...fullData, itemShortKey: e.target.value })}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                className='w-full'
                                label="Price"
                                variant="outlined"
                                value={editData?.variantsList[0]?.price}
                                onChange={(e) => addDefaultVariant(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-2">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Sub Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Sub Category"
                                    value={subCategoryName}
                                    onChange={(e) => {
                                        const selectedSubCategory = subCategories.find(category => category.subCategoryName === e.target.value);
                                        if (selectedSubCategory) {
                                            setFullData(prevItemData => ({
                                                ...prevItemData,
                                                itemSubCategory: selectedSubCategory.subCategoryId
                                            }));
                                        }
                                    }}
                                    autoComplete="off"
                                >
                                    {subCategories.map((category, index) => (
                                        <MenuItem key={index} value={category.subCategoryName}>{category.subCategoryName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-span-4">
                            <TextField
                                id="outlined-basic"
                                className='w-full'
                                label="Item Description"
                                variant="outlined"
                                value={editData?.itemDescription}
                                onChange={(e) => setFullData({ ...fullData, itemDescription: e.target.value })}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="text-2xl my-6 font-bold">
                        Add Unit
                    </div>
                    <hr className='my-6' />
                    <div className="flex w-full gap-6">
                        <div className="w-full">
                            <div className="flex gap-4 w-full">
                                <div className='w-full'>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Variants Name</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Variants Name"
                                            className='w-full'
                                            autoComplete="off"
                                            onChange={(e) => {
                                                setSecondVariantData({ ...secondVariantData, unit: e.target.value });
                                            }}
                                        >
                                            {getAllUnit && getAllUnit.map((unit, index) => (
                                                <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='w-full'>
                                    <TextField
                                        id="outlined-basic"
                                        label="Price"
                                        variant="outlined"
                                        onChange={(e) => { setSecondVariantData({ ...secondVariantData, price: e.target.value }) }}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className='w-full'>
                                    <button onClick={handleSecondAddVarinats} className='w-full mt-2 addProductBtn'>Add</button>
                                </div>
                            </div>
                            <hr className="my-6" />
                        </div>
                        <div className='w-full'>
                            {variantEditData.map((variant, index) => (
                                <div key={index} className="flex gap-6 my-3 justify-around">
                                    <div className='w-full'>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Variants Name"
                                            className='w-full'
                                            disabled
                                            value={variant.unit}
                                            autoComplete="off"
                                        >
                                            {getAllUnit && getAllUnit.map((unit, index) => (
                                                <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                            ))}
                                        </Select>

                                    </div>
                                    <div className='w-full'>
                                        <TextField
                                            id="outlined-basic"
                                            label="Price"
                                            variant="outlined"
                                            disabled
                                            value={variant.price}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="">
                                        <div className="flex gap-4">
                                            <div>
                                                <Switch
                                                    color="success"
                                                    defaultChecked={variant.status}
                                                />
                                            </div>
                                            <div className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600' onClick={() => handleDeleteVariant(index)}>
                                                <DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-6 mt-6 w-full justify-end">
                        <div className="w-1/5">
                            <button onClick={handleUpdateVariantsData} className="addCategorySaveBtn ml-4">Save</button>
                        </div>
                        <div className="w-1/5">
                            <button onClick={handleClose} className="addCategoryCancleBtn ml-4 bg-gray-700">Cancel</button>
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
                        <p className='text-2xl mb-5 font-semibold'>Price Change</p>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                            <div className="flex">
                                <FormControlLabel
                                    checked={editPriceType.percentage ? true : false}
                                    onClick={() => setEditPriceType({ percentage: true })}
                                    value="Percentage"
                                    control={<Radio />}
                                    label="Percentage"
                                    autoComplete="off"
                                />
                                <FormControlLabel
                                    onClick={() => setEditPriceType({ fixed: true })}
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
                                    id="standard-adornment-weight"
                                    aria-describedby="standard-weight-helper-text"
                                    autoComplete="off"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        'aria-label': 'weight',
                                    }}
                                    onChange={(e) => {
                                        setEditPrice({ percentage: e.target.value })
                                    }}
                                    className='w-full'
                                />
                            </FormControl>
                        </div>
                    )}
                    {editPriceType.fixed && (
                        <div className='mt-2'>
                            <TextField
                                id="outlined-basic"
                                label="Fixed"
                                variant="outlined"
                                autoComplete="off"
                                onChange={(e) => {
                                    setEditPrice({ fixed: e.target.value })
                                }}
                            />
                        </div>
                    )}
                    <div className="mt-5 w-full">
                        <div className="flex w-full">
                            <button onClick={editPriceValue} className="bg-blue-500 w-2/4 text-white py-2 px-4 rounded-lg mr-2">Save</button>
                            <button onClick={handleClose} className="bg-gray-300 text-gray-800 py-2 px-4 w-2/4 rounded-lg">Cancel</button>
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
                <Box sx={style} className='variantPopUp'>
                    <div className="w-full p-2">
                        <div className='text-xl font-bold'>Edit Variants of  {varinatsItemObject.itemName}</div>
                        <hr className="my-6" />
                        {variantMode.isEdit && (
                            <div className="">
                                <div className="flex gap-4">
                                    <div className='w-full'>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Variants Name</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Variants Name"
                                                className='w-full'
                                                autoComplete="off"
                                                disabled={variantMode.isView ? true : false}
                                                onChange={(e) => {
                                                    setSecondVariantData({ ...secondVariantData, unit: e.target.value });
                                                }}
                                            >
                                                {getAllUnit && getAllUnit.map((unit, index) => (
                                                    <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='w-full'>
                                        <TextField
                                            id="outlined-basic"
                                            label="Price"
                                            variant="outlined"
                                            autoComplete="off"
                                            disabled={variantMode.isView ? true : false}
                                            onChange={(e) => { setSecondVariantData({ ...secondVariantData, price: e.target.value }) }}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <button onClick={handleSecondAddVarinats} className='w-full mt-2 addProductBtn'>Add</button>
                                    </div>
                                </div>
                                <hr className="my-6" />
                            </div>
                        )}
                        <div >
                            {variantEditData.map((variant, index) => (
                                <div key={index} className="flex gap-6 my-3 justify-around">
                                    <div className='w-full'>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Variants Name"
                                            className='w-full'
                                            autoComplete="off"
                                            disabled
                                            value={variant.unit}
                                        >
                                            {getAllUnit && getAllUnit.map((unit, index) => (
                                                <MenuItem key={index} value={unit}>{unit}</MenuItem>
                                            ))}
                                        </Select>

                                    </div>
                                    <div className='w-full'>
                                        <TextField
                                            id="outlined-basic"
                                            label="Price"
                                            variant="outlined"
                                            disabled={variantMode.isEdit ? false : true}
                                            value={variant.price}
                                            autoComplete="off"
                                            onChange={(e) => handlePriceChange(e, index)}
                                        />
                                    </div>
                                    <div className="">
                                        <div className="flex gap-4">
                                            <div>
                                                <Switch
                                                    color="success"
                                                    checked={variant.status ? true : false}
                                                    disabled={variantMode.isView}
                                                    onChange={() => handleSwitchToggle(index)}
                                                    autoComplete="off"
                                                />
                                            </div>
                                            {variantMode.isEdit && (
                                                <div className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600' onClick={() => handleDeleteVariant(index)}>
                                                    <DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {variantMode.isView && (
                            <div className="flex gap-6 mt-6 w-full">
                                <button onClick={() => setVariantMode({ isEdit: true })} className="bg-blue-500 w-2/4 text-white py-2 px-4 rounded-lg mr-2">Edit</button>
                                <button onClick={handleClose} className="bg-gray-300 text-gray-800 py-2 px-4 w-2/4 rounded-lg">Cancel</button>
                            </div>
                        )}
                        {variantMode.isEdit && (
                            <div className="flex gap-6 mt-6 w-full">
                                <button onClick={handleUpdateVariantsData} className="bg-blue-500 w-1/2 text-white py-2 px-4 rounded-lg mr-2">Save</button>
                                <button onClick={handleClose} className="bg-gray-300 text-gray-800 py-2 px-4 w-1/2 rounded-lg">Cancel</button>
                            </div>
                        )}
                    </div>
                </Box>
            </Modal>
            <Modal
                open={copyMenuPopUp}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }} className='copyMenuPopUp'>
                    Copy Menu from {menuName.menuCategoryName}
                    <hr className="my-6" />
                    <div className="flex gap-4 w-full">
                        <div className='w-full'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">From</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="From"
                                >
                                    {copyMenuItems.map((menu, index) => (
                                        <MenuItem key={index}>{menu.menuCategoryName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="w-full">
                            <TextField
                                id="outlined-basic"
                                label="Outlined"
                                variant="outlined"
                                disabled
                                autoComplete="off"
                                value={menuName.menuCategoryName}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6 w-11/12">
                        <input onChange={handleChangeCopySubCategory} type="checkbox" name="" id="" />Just Copy sub category
                    </div>
                    <div className="flex gap-6 mt-6 w-11/12">
                        <button onClick={handleUpdateVariantsData} className="bg-blue-500 w-1/2 text-white py-2 px-4 rounded-lg mr-2">Save</button>
                        <button onClick={handleClose} className="bg-gray-300 text-gray-800 py-2 px-4 w-1/2 rounded-lg">Cancel</button>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    )
}

export default Dashboard;
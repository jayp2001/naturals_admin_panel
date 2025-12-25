/* eslint-disable no-dupe-keys */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import "./css/AssignAddonGroup.css";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { BACKEND_BASE_URL } from "../../url";
import Table from "@mui/material/Table";
import PropTypes from "prop-types";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import TableRow from "@mui/material/TableRow";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import TextField from "@mui/material/TextField";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Modal from "@mui/material/Modal";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useSpring, animated } from "@react-spring/web";
import Menu from "@mui/material/Menu";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
    Button,
    Checkbox,
    Divider,
    FilledInput,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Input,
    InputAdornment,
    Paper,
    Radio,
    RadioGroup,
    Switch,
} from "@mui/material";
import { ReactTransliterate } from "react-transliterate";
import { getUnit } from "@mui/material/styles/cssUtils";
import { useParams, useNavigate } from "react-router-dom";

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
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};
const copyMenuStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
};
const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
}));
function AssignAddonGroup() {
    const { groupId, groupName } = useParams();
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
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
        setEditItem(false);
        setVariantFields([]);
        setEditData(null);
        setDisabled(true);
        setEditPricePopUp(false);
        setEditPriceType({
            percentage: false,
            fixed: false,
        });
        setManualVariantsPopUp(false);
        setVariantMode({
            isEdit: false,
            isView: true,
        });
        setCopyMenuPopUp(false);
        setFullData({
            itemName: "",
            itemGujaratiName: "",
            itemCode: "",
            itemShortKey: "",
            itemSubCategory: "",
            itemDescription: "",
            variantsList: [],
        });
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
                price: false,
            },
        });
        // secondVariantData
        // setVeriantsFields()
        setSecondVariantData({
            unit: "",
            price: "",
            status: true,
        });
        setUnit({ unit: "", price: "" });
        setPrice(null);
        setSubCategoryId("");
        setCopyMenuCheckBox(false);
        setEditPrice({
            percentage: "",
            fixed: "",
        });
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
    const [unit, setUnit] = React.useState({ unit: "", price: "", status: true });
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [menuCategory, setMenuCategory] = useState([]);
    const [editPriceValueType, setEditPriceValueType] = useState("");
    const [menuId, setMenuId] = useState("base_2001");
    const [fullData, setFullData] = useState({
        itemName: "",
        itemGujaratiName: "",
        itemCode: "",
        itemShortKey: "",
        itemSubCategory: "",
        isJain: "",
        isPureJain: "",
        spicyLevel: "",
        itemDescription: "",
        variantsList: [],
    });
    const [itemData, setItemData] = useState([]);
    const [editItem, setEditItem] = useState(false);
    const [subCategoryFirstId, setSubCategoryFirstId] = useState();
    const [editData, setEditData] = useState(null);
    const [subCategoryName, setSubCategoryName] = useState();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [toggle, setToggle] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [success, setSuccess] = React.useState(false);
    const [editPricePopUp, setEditPricePopUp] = useState(false);

    const [editPriceType, setEditPriceType] = useState({
        percentage: true,
        fixed: false,
    });
    const [editPrice, setEditPrice] = useState({
        percentage: "",
        fixed: "",
    });
    const [editPriceMode, setEditPriceMode] = useState(false);
    const [assignAddonMode, setAssignAddonMode] = useState(false);
    const [clickedSubCategory, setClickedSubCategory] = useState(null);
    const [editItemPopUp, setEditItemPopup] = useState(false);
    const [unitPrice, setUnitPrice] = React.useState("");
    const [subCategoryStatus, setSubCategoryStatus] = useState("");
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
            price: false,
        },
    });
    const [manualVariantsPopUp, setManualVariantsPopUp] = useState(false);
    const [variantEditData, setVariantEditData] = useState([]);
    const [variantMode, setVariantMode] = useState({
        isEdit: false,
        isView: true,
    });
    const [variantsUpdatedData, setVariantsUpdatedData] = useState({
        unit: "",
        price: "",
    });
    const [secondVariantData, setSecondVariantData] = useState({
        unit: "",
        price: "",
        status: true,
    });
    const scrollRef = useRef(null);
    const [varinatsItemObject, setVariantsItemObject] = useState([]);
    const [itemDataNull, setItemDataNull] = useState(true);
    const [variantsFullData, setVariantsFullData] = useState({
        itemName: "",
        itemGujaratiName: "",
        itemCode: "",
        itemShortKey: "",
        itemSubCategory: "",
        itemDescription: "",
        variantsList: [],
    });
    const [menuName, setMenuName] = useState("");
    const [copyMenuPopUp, setCopyMenuPopUp] = useState(false);
    const [copyMenuItems, setCopyMenuItems] = useState([]);
    const [price, setPrice] = useState(null);
    const [copyMenuCheckBox, setCopyMenuCheckBox] = useState(false);
    const [updatedVarintsName, setUpdatedVariantsName] = useState([]);
    const [copySource, setCopySource] = useState("");
    const addingUnitName = useRef(null);
    const [finalSelected, setFinalSelected] = useState();
    const [copySubCategoryId, setCopySubCategoryId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [inputError, setInputError] = useState("");
    const [selectedItems, setSelectedItems] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const autoFocus = useRef(null);
    if (loading) {
        toast.loading("Please wait...", {
            toastId: "loading",
        });
    }
    if (success) {
        toast.dismiss("loading");
        toast("success", {
            type: "success",
            toastId: "success",
            position: "top-right",
            toastId: "error",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setTimeout(() => {
            setSuccess(false);
            setLoading(false);
        }, 50);
    }
    if (error) {
        setLoading(false);
        toast.dismiss("loading");
        toast(error, {
            type: "error",
            position: "top-right",
            toastId: "error",
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
                price: price === null || price.trim().length === 0,
                variantsList:
                    fullData.variantsList.length === 0 ||
                    fullData.variantsList.some(
                        (variant) =>
                            variant.unit.trim().length === 0 ||
                            variant.price.trim().length === 0
                    ),
            };
            setAllFormValidation(formValidation);
        } else {
            formValidation = {
                itemName: editData.itemName.trim().length === 0,
                itemGujaratiName: editData.itemGujaratiName.trim().length === 0,
                itemCode: editData.itemCode === null,
                itemShortKey: editData.itemShortKey.trim().length === 0,
                itemSubCategory: !editData.itemSubCategory,
                price:
                    editData.variantsList.length === 0 ||
                    editData.variantsList[0]?.price === null ||
                    editData.variantsList[0]?.price?.length === 0,
                variantsList:
                    editData.variantsList.length === 0 ||
                    editData.variantsList.some(
                        (variant) =>
                            variant.unit.trim().length === 0 || variant.price === null
                    ),
            };
            setAllFormValidation(formValidation);
        }

        if (Object.values(formValidation).some((field) => field)) {
            setError("Please Fill All Fields");
            return;
        }
        const token = localStorage.getItem("token");
        console.log("Full Form Data", fullData);

        if (!editItem) {
            await axios
                .post(`${BACKEND_BASE_URL}menuItemrouter/addItemData`, fullData, config)
                .then((res) => {
                    setSuccess(res.data);
                    setOpen(true);
                    setFullData({
                        itemName: "",
                        itemGujaratiName: "",
                        itemCode: "",
                        itemShortKey: "",
                        itemSubCategory: "",
                        itemDescription: "",
                        spicyLevel: "",
                        isJain: false,
                        isPureJain: false,
                        variantsList: [],
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
                            price: false,
                        },
                    });
                    setUnit({
                        unit: "",
                        price: "",
                    });
                    setVariantFields([]);
                    getAllCategory();
                    console.log("final Selected Value ===>", finalSelected);
                    // handleSubCategoryClick(finalSelected, menuId);
                    getAllUnits();
                    updatedSubCategory(menuId);
                    // getAllItems(menuId);
                    handleSubCategoryClick(fullData.itemSubCategory, menuId);
                    if (!editData) {
                        setPrice(null);
                    }
                })
                .catch((error) => {
                    setError(error?.response?.data || "Network Error!..");
                });
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
                variantsList: variantFields,
            };
            console.log("newData", newData);

            await axios
                .post(
                    `${BACKEND_BASE_URL}menuItemrouter/updateItemData`,
                    newData,
                    config
                )
                .then((res) => {
                    setSuccess(res.data);
                    setOpen(true);
                    setFullData({
                        itemName: "",
                        itemGujaratiName: "",
                        itemCode: "",
                        itemShortKey: "",
                        itemSubCategory: "",
                        itemDescription: "",
                        spicyLevel: "",
                        variantsList: [],
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
                            price: false,
                        },
                    });
                    setUnit({
                        unit: "",
                        price: "",
                    });
                    setEditData(null);
                    setVariantFields([]);
                    getAllCategory();
                    console.log("final Selected Value ===>", finalSelected);
                    // handleSubCategoryClick(finalSelected, menuId);
                    setEditItem(false)
                    getAllUnits();
                    updatedSubCategory(menuId);
                    // getAllItems(menuId);
                    setOpen(false);
                    handleSubCategoryClick(editData.itemSubCategory, menuId);
                    setPrice(null);
                })
                .catch((error) => {
                    setError(error?.response?.data || "Network Error!..");
                });
        }
    };

    const getAllCategory = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}menuItemrouter/getMenuCategory`,
                config
            );
            setMenuCategory(response.data);
            setMenuId(response.data[0]?.menuCategoryId);
        } catch (error) {
            setError(error?.response?.data || "Network Error!!!...");
        }
    };
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
        const password = "123";
        const enteredPassword = prompt("Please Enter The Password");
        if (enteredPassword !== password) {
            alert("Incorrect password. Operation aborted.");
            return;
        }

        if (enteredPassword === password) {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.delete(
                    `${BACKEND_BASE_URL}menuItemrouter/removeItemData?itemId=${id}`,
                    config
                );
                setSuccess(response.data);
                getAllUnits();
                // getAllItems(menuId);
                // getAllUnits();
                // getAllCategory();
                handleSubCategoryClick(finalSelected, menuId);
            } catch (error) {
                setError(error?.response?.data || "Network Error!!!...");
            }
        }
    };
    const handleOpen = () => {
        setOpen(true);
        setDisabled(false);
    };

    const addVariantFields = () => {
        const formValidation = {
            unit: unit.unit.trim().length === 0,
            unitPrice: unit.price.trim().length === 0 || unit.price === "0",
        };

        setAllFormValidation(formValidation);

        if (Object.values(formValidation).some((field) => field)) {
            setError("Please Fill All Fields");
            return;
        }
        if (unit.price === 0) {
            return console.log("Error");
        }
        if (editData) {
            if (unit.unit === "NO") {
                setEditData((prev) => ({
                    ...prev,
                    allVariantsList: prev.variantsList.map((variant, i) =>
                        i === 0 ? { ...variant, price: unit.price } : variant
                    ),
                }));
            }
        }

        const newVariant = {
            unit: unit.unit,
            price: unit.price,
            status: true,
            index: variantFields.length,
        };
        if (unit.unit === "NO") {
            setPrice(unit.price);
        }

        setVariantFields((prevFields) => {
            if (unit.unit === "NO") {
                return [newVariant, ...prevFields];
            } else {
                return [...prevFields, newVariant];
            }
        });

        if (editData) {
            setEditData((prevState) => {
                if (unit.unit === "No") {
                    return {
                        ...prevState,
                        allVariantsList: [
                            { unit: unit.unit, price: unit.price, status: true },
                            ...prevState.allVariantsList,
                        ],
                    };
                } else {
                    return {
                        ...prevState,
                        allVariantsList: [
                            ...prevState.allVariantsList,
                            { unit: unit.unit, price: unit.price, status: true },
                        ],
                    };
                }
            });
        } else {
            setFullData((prevState) => {
                if (unit.unit === "No") {
                    return {
                        ...prevState,
                        variantsList: [
                            { unit: unit.unit, price: unit.price, status: true },
                            ...prevState.variantsList,
                        ],
                    };
                } else {
                    return {
                        ...prevState,
                        variantsList: [
                            ...prevState.variantsList,
                            { unit: unit.unit, price: unit.price, status: true },
                        ],
                    };
                }
            });
        }

        setGetAllUnit((prevUnits) => prevUnits.filter((u) => u !== unit.unit));
        setUnit({ unit: "", price: "" });
        setAddVariant(true);
        addingUnitName.current && addingUnitName.current.focus();
    };
    const addDefaultVariant = (defaultPrice) => {
        const defaultUnit = "NO";
        let updatedVariantFields;

        if (defaultPrice.trim() === "") {
            updatedVariantFields = variantFields.filter(
                (val) => val.unit !== defaultUnit
            );
            // const filteredData = getAllUnit.filter(unit => !data.includes(unit));
            // setGetAllUnit(filteredData)
            setGetAllUnit((prevGetAllUnit) => [...prevGetAllUnit, "NO"]);
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
                unit: "",
                price: "",
            });

            if (!variantUpdated) {
                updatedVariantFields.push({
                    unit: defaultUnit,
                    price: defaultPrice,
                });
            }

            const data = variantFields.map((variant) => variant.unit);
            const filteredData = getAllUnit.filter((unit) => !data.includes(unit));
            setGetAllUnit(filteredData);
        }

        setVariantFields(updatedVariantFields);
        if (editData) {
            setEditData((prevState) => ({
                ...prevState,
                variantsList:
                    defaultPrice.trim() === ""
                        ? prevState.variantsList.filter((v) => v.unit !== defaultUnit)
                        : [
                            ...prevState.variantsList.filter((v) => v.unit !== defaultUnit),
                            { unit: defaultUnit, price: defaultPrice, status: true },
                        ],
            }));
            console.log("State Management", editData);
        } else {
            setFullData((prevState) => ({
                ...prevState,
                variantsList:
                    defaultPrice.trim() === ""
                        ? prevState.variantsList.filter((v) => v.unit !== defaultUnit)
                        : [
                            ...prevState.variantsList.filter((v) => v.unit !== defaultUnit),
                            { unit: defaultUnit, price: defaultPrice, status: true },
                        ],
            }));
        }
    };

    const selectedcategoryName = subCategories.find(
        (val) => val.subCategoryId === finalSelected
    );

    const handleDelete = (index) => {
        const unitToDelete = variantFields[index].unit;
        console.log("unit", unitToDelete);

        if (unitToDelete === "NO") {
            setPrice("");
            if (editData) {
                setEditData((prev) => ({
                    ...prev,
                    variantsList: prev.variantsList.map((variant, i) =>
                        i === 0 ? { ...variant, price: "" } : variant
                    ),
                }));
            }
        }

        const updatedFields = variantFields
            .filter((_, i) => i !== index)
            .map(({ index, ...rest }) => ({ ...rest, status: true }));

        setGetAllUnit((prevGetAllUnit) => [...prevGetAllUnit, unitToDelete]);

        if (editData) {
            setEditData((prev) => ({
                ...prev,
                variantsList: updatedFields,
            }));
        }

        setVariantFields(updatedFields);
        console.log("price -->>", updatedFields);
        setFullData((prev) => ({
            ...prev,
            variantsList: updatedFields,
        }));
    };

    const getSubCategory = async (menu) => {
        console.log("sub Category MenuId ===>>", menu);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${BACKEND_BASE_URL}menuItemrouter/ddlSubCategory?menuId=${menu}`,
                config
            );
            const subCategories = response.data;
            setSubCategories(subCategories);
            setMenuId(menu);
            const firstSubCategoryId = subCategories[0].subCategoryId;
            // const status = subCategories[0].status;
            // if (status) {
            //     console.log('==>sub Category Status ==>', status)
            //     setSubCategoryStatus(status)
            // }
            // setSubCategoryStatus(true)
            // updatedSubCategory(menu);
            if (finalSelected) {
                console.log("reload", finalSelected);
                handleSubCategoryClick(finalSelected, menu);
            } else {
                handleSubCategoryClick(firstSubCategoryId, menu);
                setSubCategoryStatus(true);
            }
            setItemDataNull(false);
        } catch (error) {
            setError(error?.response?.data || "Network Error!!!...");
        }
    };
    const updatedSubCategory = async (menu) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${BACKEND_BASE_URL}menuItemrouter/ddlSubCategory?menuId=${menu}`,
                config
            );
            const subCategories = response.data;
            setSubCategories(subCategories);
            const selectedSubCategory = subCategories.find(
                (val) => val.subCategoryId === finalSelected
            );
            console.log("Selected Sub Categoruy", selectedSubCategory);
            console.log("<<>--");
            const status = selectedSubCategory?.status;
            console.log("<<==><==>>", status);
            if (status >= 0) {
                console.log("==><==", status);
                setSubCategoryStatus(status);
            } else {
                console.log("==>===<==");
                const firstId = subCategories[0].status;
                setSubCategoryStatus(firstId);
            }

            setItemDataNull(false);
        } catch (error) {
            setError(error?.response?.data || "Network Error!!!...");
        }
    };
    const handleEditItem = (item) => {
        console.log("item", item);
        setOpen(true);
        setEditData(item);
        setVariantsItemObject(item);
        setVariantEditData(item.variantsList);
        setSubCategoryName(item.subCategoryName);
        setEditItem(true);
        setVariantFields(item.variantsList);
        setGetAllUnit((prevUnits) =>
            prevUnits.filter(
                (u) => !item.allVariantsList.some((variant) => variant.unit === u)
            )
        );
    };

    const getAllUnits = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${BACKEND_BASE_URL}menuItemrouter/getUnit`,
                config
            );
            setGetAllUnit(response.data);
        } catch (error) {
            setError(error?.response?.data || "Network Error!!!...");
        }
    };

    const handleSubCategoryClick = async (subCategoryId, menuCategory) => {
        setClickedSubCategory(subCategoryId);
        setSubCategoryFirstId(subCategoryId);
        setMenuId(menuCategory);
        const findingData = subCategories.find(
            (val) => val.subCategoryId === subCategoryId
        );
        setFinalSelected(subCategoryId);
        const status = findingData?.status;
        console.log(`status`, findingData);
        setSubCategoryStatus(status);
        setSearchTerm("");

        const token = localStorage.getItem("token");
        try {
            setSideBarColor(true);
            const response = await axios.get(
                `${BACKEND_BASE_URL}menuItemrouter/getItemListByAddon?menuCategoryId=${menuCategory}&groupId=${groupId}&subCategoryId=${subCategoryId}`,
                config
            );

            const items = response.data;
            setItemData(items);

            // Initialize selected items state
            const initialSelectedItems = {};
            items.forEach((item) => {
                initialSelectedItems[item.uwpId] = item.status === 1;
            });
            setSelectedItems(initialSelectedItems);

            // Check if all items are selected
            const allSelected = items.every((item) => item.status === 1);
            setSelectAll(allSelected);

            if (items.length > 0) {
                setItemDataNull(false);
            } else {
                setItemDataNull(true);
            }
        } catch (error) {
            if (error.response?.data == "No Data Found") {
                setError("No Data Found");
                setItemDataNull(true);
            }
            setError(error?.response?.data || "Network Error!!!...");
        }
    };
    const handleItemCheckboxChange = (uwpId) => {
        setSelectedItems((prev) => {
            const newSelected = { ...prev, [uwpId]: !prev[uwpId] };

            // Update select all state based on filtered data
            const allItemsSelected = filteredData.every(
                (item) => newSelected[item.uwpId]
            );
            setSelectAll(allItemsSelected);

            return newSelected;
        });
    };

    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        const newSelectedItems = { ...selectedItems };
        filteredData.forEach((item) => {
            newSelectedItems[item.uwpId] = newSelectAll;
        });
        setSelectedItems(newSelectedItems);
    };

    const handleAssignAddonSave = async () => {
        try {
            setLoading(true);

            const addonItemsArray = Object.keys(selectedItems).map((uwpId) => {
                const item = itemData.find((item) => item.uwpId.toString() === uwpId);
                return {
                    uwpId: parseInt(uwpId),
                    itemName: item?.itemName || "",
                    status: selectedItems[uwpId] ? 1 : 0,
                };
            });

            const payload = {
                groupId,
                addonItemsArray,
            };

            await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/assignAddonGroup`,
                payload,
                config
            );

            setSuccess("Addon group assigned successfully");

            // Refresh the data on the same page instead of redirecting
            setTimeout(() => {
                handleSubCategoryClick(finalSelected, menuId);
                setAssignAddonMode(false); // Exit assign mode
            }, 1000);
        } catch (error) {
            console.error("Save error:", error);
            setError(
                error?.response?.data?.message ||
                "Failed to save addon group assignment"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/menu/addOns");
    };

    const handleAssignAddonMode = () => {
        setAssignAddonMode(true);
    };

    const handleCancelAssignMode = () => {
        setAssignAddonMode(false);
        // Reset selections when canceling
        setSelectedItems({});
        setSelectAll(false);
    };

    const editPriceValue = () => {
        setEditPriceMode(true);

        const updatedItemData = itemData.map((item) => {
            const updatedVariantsList = item.variantsList.map((variant) => {
                let updatedPrice = parseFloat(variant.price);

                if (editPriceValueType === "increase") {
                    if (editPriceType.percentage) {
                        const percentage = parseFloat(editPrice.percentage);
                        updatedPrice = updatedPrice * (1 + percentage / 100);
                    } else if (editPriceType.fixed) {
                        const fixedAmount = parseFloat(editPrice.fixed);
                        updatedPrice = updatedPrice + fixedAmount;
                    }
                } else if (editPriceValueType === "decrease") {
                    if (editPriceType.percentage) {
                        const percentage = parseFloat(editPrice.percentage);
                        updatedPrice = updatedPrice * (1 - percentage / 100);
                    } else if (editPriceType.fixed) {
                        const fixedAmount = parseFloat(editPrice.fixed);
                        updatedPrice = updatedPrice - fixedAmount;
                    }
                } else if (editPriceValueType === "manual") {
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
        setEditPriceMode(false);
        // getAllCategory();
        // getSubCategory();
        getAllUnits();
        handleSubCategoryClick(finalSelected, menuId);
    };
    const handleEditPrice = async () => {
        const token = localStorage.getItem("token");
        const isConfirm = window.confirm(
            "Are you sure You want to Save this change"
        );
        if (!isConfirm) {
            return;
        } else {
            try {
                const response = await axios.post(
                    `${BACKEND_BASE_URL}menuItemrouter/updateMultipleItemPrice`,
                    itemData,
                    config
                );
                if (response.data === "Price Updated Successfully") {
                    setSuccess("Price Updated Successfully");
                    setEditPriceMode(false);
                    handleSubCategoryClick(finalSelected, menuId);
                    getAllUnits();
                    // getAllItems(menuId);
                    handleClose();
                }
            } catch (error) {
                setError(error?.response?.data || "Network Error!!!...");
                handleSubCategoryClick(finalSelected, menuId);
                getAllUnits();
                // getAllItems(menuId);
            }
        }
    };
    const handleManualVariantsname = (data) => {
        console.log("Data", data);
        setVariantsItemObject(data);
        setVariantEditData(data.allVariantsList);
        setManualVariantsPopUp(true);
    };

    const handleSecondAddVarinats = () => {
        if (!secondVariantData.unit || !secondVariantData.price) {
            console.error("Both unit and price must be provided");
            return;
        }
        const newVariant = {
            unit: secondVariantData.unit,
            price: secondVariantData.price,
            status: true,
        };
        const updatedVariantEditData = [...variantEditData, newVariant];
        setVariantEditData(updatedVariantEditData);
        setSecondVariantData({
            unit: "",
            price: "",
        });
    };
    const handleDeleteVariant = (index, variant) => {
        const updatedVariants = [...variantEditData];
        updatedVariants.splice(index, 1);
        setVariantEditData(updatedVariants);
        setGetAllUnit((prevGetAllUnit) => [...prevGetAllUnit]);
    };
    const handleUpdateVariantsData = async () => {
        const token = localStorage.getItem("token");
        const newData = {
            itemName: varinatsItemObject.itemName,
            itemDescription: varinatsItemObject.itemDescription,
            itemCode: varinatsItemObject.itemCode,
            itemId: varinatsItemObject.itemId,
            itemGujaratiName: varinatsItemObject.itemGujaratiName,
            menuCategoryId: menuId,
            itemShortKey: varinatsItemObject.itemShortKey,
            itemSubCategory: varinatsItemObject.itemSubCategory,
            variantsList: variantEditData,
        };

        try {
            const response = await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/updateItemData`,
                newData,
                config
            );
            if (response?.data === "Item Updated Successfully") {
                setSuccess(response.data);
                handleClose();
                handleSubCategoryClick(finalSelected, menuId);
                updatedSubCategory(menuId);
            }
        } catch (error) {
            setError(error?.response?.data || "Network Error!!!...");
            setManualVariantsPopUp(false);
        }
        setEditItem(false);
        setVariantMode({
            isEdit: false,
            isView: true,
        });
    };
    const handleSwitchToggle = (index) => {
        const updatedVariantEditData = [...variantEditData];
        updatedVariantEditData[index].status =
            !updatedVariantEditData[index].status;
        setVariantEditData(updatedVariantEditData);
    };
    const handleSave = () => {
        const value = editPriceType.percentage
            ? editPrice.percentage
            : editPrice.fixed;
        const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

        if (!numberRegex.test(value)) {
            setInputError("Please enter a valid number");
            return;
        }

        setInputError("");
        editPriceValue();
    };
    const label = { inputProps: { "aria-label": "Switch demo" } };
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
        setCopyMenuCheckBox(!copyMenuCheckBox);
        // console.log('finalSelected',finalSelected)
    };
    const handlePriceManualChange = (data, price) => {
        const updatedVariantFields = variantFields.map((val) => {
            if (val.unit === data.unit) {
                return { ...val, price: price };
            }
            return val;
        });
        setVariantFields(updatedVariantFields);
        if (editData) {
            const variants = editData.variantsList;
            const updatedVariantFields = variants.map((val) => {
                if (val.unit === data.unit) {
                    return { ...val, price: price };
                }
                return val;
            });
            setEditData((prev) => ({
                ...prev,
                variantsList: updatedVariantFields,
            }));
        }
    };
    const handleItemStatusChange = async (item) => {
        const token = localStorage.getItem("token");
        const userEnteredPassword = prompt("Enter password to continue:");
        const correctPassword = "123";

        if (userEnteredPassword === correctPassword) {
            const switchValue = !item.status ? true : false;
            await axios
                .get(
                    `${BACKEND_BASE_URL}menuItemrouter/updateItemStatus?menuId=${menuId}&itemId=${item?.itemId}&status=${switchValue}`,
                    config
                )
                .then((response) => {
                    console.log(response.data);
                    console.log(`Switch value changed to ${switchValue}`);
                    if (response.data === "Status Updated Successfully") {
                        setSubCategoryStatus(false);
                        getAllUnits();
                        // getAllCategory();
                        updatedSubCategory(menuId);
                        handleSubCategoryClick(finalSelected, menuId);
                        getAllUnits();
                        // getAllItems(menuId);
                    }
                })
                .catch((error) => {
                    console.error("Error updating item status:", error);
                });
            console.log(`Switch value changed to ${switchValue}`);
        } else {
            const switchValue = item.status ? "checked" : "unchecked";
            console.log("Password incorrect or operation cancelled.");
        }
    };
    const handleManualVariantsPopUp = () => {
        setVariantMode({ isEdit: true });
    };
    const handleSubCategoryStatusChange = async () => {
        const token = localStorage.getItem("token");
        const userEnteredPassword = prompt("Enter password to continue:");
        const correctPassword = "123";

        if (userEnteredPassword === correctPassword) {
            const switchValue = !subCategoryStatus ? true : false;
            await axios
                .get(
                    `${BACKEND_BASE_URL}menuItemrouter/updateItemStatus?menuId=${menuId}&subCategoryId=${finalSelected}&status=${switchValue}`,
                    config
                )
                .then((response) => {
                    console.log(response.data);
                    console.log(`Switch value changed to ${switchValue}`);
                    if (response.data === "Status Updated Successfully") {
                        setSubCategoryStatus(false);
                        getAllUnits();
                        // getAllCategory();
                        getAllUnits();
                        // getAllItems(menuId);
                        setSuccess(true);
                        updatedSubCategory(menuId);
                        handleSubCategoryClick(finalSelected, menuId);
                        setManualVariantsPopUp(false);
                    }
                })
                .catch((error) => {
                    console.error("Error updating item status:", error);
                });
            console.log(`Switch value changed to ${switchValue}`);
        } else {
            // const switchValue = item.status ? 'checked' : 'unchecked';
            console.log("Password incorrect or operation cancelled.");
        }
    };

    const handleCopySourceChange = (event) => {
        const selectedMenu = copyMenuItems.find(
            (menu) => menu.menuCategoryName === event.target.value
        );
        setCopySource(selectedMenu);
    };
    const handleCopyMenuFromOther = async () => {
        if (!copySource.menuCategoryId) {
            setError("Please select a Source Menu.");
            return;
        }
        console.log("==>Menu Name <<===", menuName);
        console.log("==>Source id <<===", copySource);
        const token = localStorage.getItem("token");
        const mainMenuId = menuName?.menuCategoryId;
        const sourceId = copySource?.menuCategoryId;
        let url = `${BACKEND_BASE_URL}menuItemrouter/copyPriceAndStatusByMenuId?sourceId=${sourceId}&targetId=${mainMenuId}`;

        if (copyMenuCheckBox) {
            console.log("==>Sub Category Id Copy Menu <<==", copySubCategoryId);
            const subCategoryId = copySubCategoryId?.subCategoryId;
            url += `&itemSubCategoryId=${subCategoryId}`;
        }

        axios
            .get(url, config)
            .then((res) => {
                console.log(res.data);
                setSuccess(true);
                handleClose();
                handleSubCategoryClick(finalSelected, menuId);
                setCopyMenuPopUp(false);
                setCopySource("");
            })
            .catch((error) => {
                console.log(error);
                setError(error.response.data || "Network Error!!!...");
            });
    };
    const filteredData = searchTerm.trim()
        ? itemData.filter((item) => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            return (
                item?.itemName?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
                item?.itemCode?.toString().includes(lowerCaseSearchTerm) ||
                item?.itemShortKey?.toLowerCase()?.includes(lowerCaseSearchTerm)
            );
        })
        : itemData;

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePercentageChange = (e) => {
        const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        const inputValue = e.target.value;
        if (!inputValue || numberRegex.test(inputValue)) {
            setEditPrice({ percentage: inputValue });
            setInputError("");
        } else {
            setInputError("Please enter a valid number");
        }
    };

    const handleFixedChange = (e) => {
        const numberRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        const inputValue = e.target.value;
        if (!inputValue || numberRegex.test(inputValue)) {
            setEditPrice({ fixed: inputValue });
            setInputError("");
        } else {
            setInputError("Please enter a valid number");
        }
    };
    const scrollContainerRef = useRef(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };

    const updateButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } =
                scrollContainerRef.current;
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
        container.addEventListener("scroll", updateButtons);
        window.addEventListener("resize", updateButtons);

        return () => {
            container.removeEventListener("scroll", updateButtons);
            window.removeEventListener("resize", updateButtons);
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
        <div className="BilingDashboardContainer BilingDashboardContainerForDashBoardOnly p-3 ">
            <div className="col-span-12">
                <div className="productTableSubContainer static">
                    <div className="h-full grid grid-cols-12">
                        <div
                            className={`h-full ${editPriceMode ? "col-span-9" : "col-span-10"
                                }`}
                        >
                            <div className="relative h-full">
                                {showPrev && (
                                    <button
                                        onClick={scrollLeft}
                                        className="absolute left-3 z-10 top-5"
                                    >
                                        <ChevronLeftIcon />
                                    </button>
                                )}
                                <div
                                    className={`flex ml-12 gap-3 menuCategoryScroll overflow-x-auto h-full ${editPriceMode ? "cursor-not-allowed" : ""
                                        }`}
                                    style={{ whiteSpace: "nowrap" }}
                                    ref={scrollContainerRef}
                                >
                                    {menuCategory.map((menu, index) => (
                                        <div
                                            key={index}
                                            className={`col-span-1 ${tab === index ? "productTabAll" : "productTab"
                                                }`}
                                            onClick={() => {
                                                if (!editPriceMode) {
                                                    const menuCategories = menu?.menuCategoryId;
                                                    setSubCategoryStatus(false);
                                                    // getAllItems(menuCategories);
                                                    setMenuId(menuCategories);
                                                    handleSubCategoryClick(finalSelected, menuCategories);
                                                    setTab(index);
                                                    setSearchWord("");
                                                    setDataSearch([]);
                                                    console.log("menuCategory", menuCategories);
                                                }
                                            }}
                                            style={{ minWidth: "fit-content" }}
                                        >
                                            <div className="statusTabtext w-40">
                                                {menu.menuCategoryName}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {showNext && (
                                    <button
                                        onClick={scrollRight}
                                        className="absolute -right-5 z-10 top-5"
                                    >
                                        <ChevronRightIcon />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <div className="maina_box">
                {subCategories.length > 0 && (
                    <div className="sidebar overflow-y-auto blackCountLogoWrp shadow-2xl py-4 my-4 mr-4 static">
                        {subCategories.map((subcategory) => (
                            <div
                                key={subcategory.subCategoryId}
                                ref={
                                    clickedSubCategory === subcategory.subCategoryId
                                        ? scrollRef
                                        : null
                                }
                                className={`sidebar_menu my-2 flex jystify-between cursor-pointer rounded-lg p-2 text-start text-lg ${editPriceMode ? "cursor-not-allowed" : ""
                                    } ${clickedSubCategory === subcategory.subCategoryId
                                        ? "ClickedBlueBg"
                                        : " hover:bg-gray-700 hover:text-white"
                                    }`}
                                onClick={() => {
                                    if (!editPriceMode) {
                                        handleSubCategoryClick(subcategory.subCategoryId, menuId);
                                    }
                                }}
                            >
                                <span className="w-full">{subcategory.subCategoryName}</span>{" "}
                                <span className="w-6 text-end">{subcategory.numberOfItem}</span>
                            </div>
                        ))}
                    </div>
                )}
                <TableContainer className=" ">
                    <div className="mt-4">
                        {!assignAddonMode && !itemDataNull && (
                            <div>
                                <div className="patti rounded-lg shadow-md p-2 mb-2 bg-white w-full">
                                    {!editPriceMode ? (
                                        <div className="mainANotherDiv gap-4 justify-between">
                                            <div className="flex gap-4 justify-between items-center w-full">
                                                <div className='flex gap-4 items-center'>
                                                    <h2 className='text-xl font-bold'>
                                                        {assignAddonMode ? 'Assign Addon Group:' : 'Addon Group:'} {decodeURIComponent(groupName)}
                                                    </h2>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {!assignAddonMode ? (
                                                        <button
                                                            className="addProductBtn font-semibold text-sm"
                                                            onClick={handleAssignAddonMode}
                                                        >
                                                            Assign Addon
                                                        </button>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                className="addProductBtn font-semibold text-sm px-4 py-2"
                                                                onClick={handleAssignAddonSave}
                                                                disabled={loading}
                                                            >
                                                                {loading ? "Saving..." : "Save"}
                                                            </button>
                                                            <button
                                                                className="cancelButtonEdiPriceMode font-semibold text-sm px-4 py-2"
                                                                onClick={handleCancelAssignMode}
                                                                disabled={loading}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <Search className="border">
                                                    <SearchIconWrapper>
                                                        <SearchIcon />
                                                    </SearchIconWrapper>
                                                    <StyledInputBase
                                                        placeholder="Search…"
                                                        inputProps={{ "aria-label": "search" }}
                                                        value={searchTerm}
                                                        onChange={handleSearchChange}
                                                    />
                                                </Search>
                                                {/* <button className='addProductBtn' onClick={() => { setEditPricePopUp(true); setEditPriceType({ percentage: true }) }} >Edit Price</button> */}
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        borderBottomLeftRadius: "10px",
                                        borderBottomRightRadius: "10px",
                                        paddingLeft: "12px",
                                        paddingRight: "12px",
                                        paddingTop: "12px",
                                        overflowY: "auto",
                                    }}
                                    className="CustomDashBoardTableHeight"
                                >
                                    <Table
                                        aria-label="sticky table"
                                        sx={{ minWidth: 750, overflow: "hidden" }}
                                        className=""
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Item Name</TableCell>
                                                <TableCell align="center">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="">
                                            {filteredData.length > 0 ? (
                                                filteredData.map((item, index) => (
                                                    <TableRow
                                                        key={index}
                                                        onMouseEnter={() => handleMouseEnter(index)}
                                                        onMouseLeave={handleMouseLeave}
                                                        style={{
                                                            backgroundColor:
                                                                hoveredRow === index ? "#f5f5f5" : "transparent",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <TableCell
                                                            style={{ maxWidth: "15px", width: "15px" }}
                                                        >
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>{item.itemName}</TableCell>
                                                        <TableCell align="center">
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs ${item?.status === 1
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                                    }`}
                                                            >
                                                                {item?.status === 1 ? "Assigned" : "Not Assigned"}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={3}
                                                        align="center"
                                                        style={{ fontSize: "18px", padding: "24px" }}
                                                    >
                                                        {searchTerm
                                                            ? "No items found matching your search"
                                                            : "No items available"}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )}
                        {!itemDataNull && assignAddonMode && (
                            <div>
                                <div className="patti rounded-lg shadow-md p-2 mb-2 bg-white w-full">
                                    <div className="mainANotherDiv gap-4 justify-between">
                                        <div className="flex gap-4 justify-between items-center w-full">
                                            <div className="flex gap-4 items-center">
                                                <h2 className="text-xl font-bold">
                                                    Assign Addon Group: {decodeURIComponent(groupName)}
                                                </h2>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="addProductBtn font-semibold text-sm px-4 py-2"
                                                        onClick={handleAssignAddonSave}
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Saving..." : "Save"}
                                                    </button>
                                                    <button
                                                        className="cancelButtonEdiPriceMode font-semibold text-sm px-4 py-2"
                                                        onClick={handleCancelAssignMode}
                                                        disabled={loading}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Search className="border">
                                                <SearchIconWrapper>
                                                    <SearchIcon />
                                                </SearchIconWrapper>
                                                <StyledInputBase
                                                    placeholder="Search items…"
                                                    inputProps={{ "aria-label": "search" }}
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
                                                />
                                            </Search>
                                        </div>
                                    </div>
                                </div>

                                <TableContainer
                                    sx={{
                                        borderBottomLeftRadius: "10px",
                                        borderBottomRightRadius: "10px",
                                        paddingLeft: "12px",
                                        paddingRight: "12px",
                                        paddingTop: "12px",
                                    }}
                                    component={Paper}
                                    className="CustomDashBoardTableHeightPriceEdit"
                                >
                                    <Table
                                        sx={{ minWidth: 650, overflow: "auto" }}
                                        aria-label="simple table"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ width: '120px', height: '40px', padding: '8px' }}>
                                                    <div className="flex items-center gap-1" style={{ minHeight: 'auto' }}>
                                                        <Checkbox
                                                            checked={selectAll}
                                                            onChange={handleSelectAllChange}
                                                            indeterminate={
                                                                itemData.some(
                                                                    (item) => selectedItems[item.uwpId]
                                                                ) &&
                                                                !itemData.every(
                                                                    (item) => selectedItems[item.uwpId]
                                                                )
                                                            }
                                                            size="small"
                                                            style={{ padding: '4px' }}
                                                        />
                                                        <span className="text-sm">Select All</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell style={{ height: '40px', padding: '8px' }}>Item Name</TableCell>
                                                <TableCell style={{ height: '40px', padding: '8px' }}>UWP ID</TableCell>
                                                <TableCell style={{ height: '40px', padding: '8px' }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="bg-white">
                                            {filteredData.length > 0 ? (
                                                filteredData.map((item, itemIndex) => (
                                                    <TableRow key={item.uwpId} hover>
                                                        <TableCell style={{ height: '40px', padding: '8px' }}>
                                                            <Checkbox
                                                                checked={selectedItems[item.uwpId] || false}
                                                                onChange={() =>
                                                                    handleItemCheckboxChange(item.uwpId)
                                                                }
                                                                size="small"
                                                                style={{ padding: '4px' }}
                                                            />
                                                        </TableCell>
                                                        <TableCell style={{ height: '40px', padding: '8px' }}>{item.itemName}</TableCell>
                                                        <TableCell style={{ height: '40px', padding: '8px' }}>{item.uwpId}</TableCell>
                                                        <TableCell style={{ height: '40px', padding: '8px' }}>
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs ${selectedItems[item.uwpId]
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                                    }`}
                                                            >
                                                                {selectedItems[item.uwpId]
                                                                    ? "Assigned"
                                                                    : "Not Assigned"}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        align="center"
                                                        style={{ fontSize: "18px", padding: "24px" }}
                                                    >
                                                        {searchTerm
                                                            ? "No items found matching your search"
                                                            : "No items available"}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )}
                    </div>
                    {itemDataNull && (
                        <div className="w-full flex justify-center">
                            <div className="text-center">
                                <RestaurantMenuIcon className="restaurantMenu" />
                                <br />
                                <div className="text-2xl text-gray">No Data Found</div>
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
                <Box sx={style} className="addProdutModal">
                    <div className="text-xl p-1">
                        {editData ? "Edit Item" : "Add Item"}
                    </div>
                    <hr className="my-2 mb-4" />
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                className={`w-full ${allFormValidation.itemCode ? "border-red-500" : ""
                                    }`}
                                error={allFormValidation.itemCode}
                                helperText={
                                    allFormValidation.itemCode ? "Code is Required" : ""
                                }
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
                                        setAllFormValidation({
                                            ...allFormValidation,
                                            itemCode: false,
                                        });
                                    }
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
                                className={`w-full ${allFormValidation.itemName ? "border-red-500" : ""
                                    }`}
                                error={allFormValidation.itemName}
                                helperText={
                                    allFormValidation.itemName ? "Item Name is required" : ""
                                }
                                value={editData ? editData.itemName : fullData.itemName}
                                onChange={(e) => {
                                    editData
                                        ? setEditData({ ...editData, itemName: e.target.value })
                                        : setFullData({ ...fullData, itemName: e.target.value });
                                    setAllFormValidation({
                                        ...allFormValidation,
                                        itemName: false,
                                    });
                                }}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-3">
                            <ReactTransliterate
                                id="outlined-basic"
                                value={
                                    editData
                                        ? editData.itemGujaratiName
                                        : fullData.itemGujaratiName
                                }
                                onChangeText={(e) => {
                                    editData
                                        ? setEditData({ ...editData, itemGujaratiName: e })
                                        : setFullData({ ...fullData, itemGujaratiName: e });
                                    setAllFormValidation({
                                        ...allFormValidation,
                                        itemName: false,
                                    });
                                }}
                                variant="outlined"
                                className={`w-full border p-4 rounded-md border-gray-300 ${allFormValidation.itemGujaratiName ? "border-red-500" : ""
                                    }`}
                                placeholder="ગુજરાતી નામ"
                                error={allFormValidation.itemGujaratiName}
                                helperText={
                                    allFormValidation.itemGujaratiName
                                        ? "Gujarati Name is required"
                                        : ""
                                }
                                label="Item Gujarati Name"
                                lang="gu"
                                autoComplete="off"
                            />
                        </div>

                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                className={`w-full ${allFormValidation.itemShortKey ? "border-red-500" : ""
                                    }`}
                                error={allFormValidation.itemShortKey}
                                helperText={
                                    allFormValidation.itemShortKey ? "Short Code required" : ""
                                }
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
                                    setAllFormValidation({
                                        ...allFormValidation,
                                        itemShortKey: false,
                                    });
                                }}
                            />
                        </div>
                        <div className="col-span-2">
                            <TextField
                                id="outlined-basic"
                                className={`w-full ${allFormValidation.price ? "border-red-500" : ""
                                    }`}
                                error={allFormValidation.price}
                                helperText={
                                    allFormValidation.price ? "Item Price is required" : ""
                                }
                                label="Price"
                                variant="outlined"
                                value={
                                    editData
                                        ? editData?.variantsList[0]?.price
                                            ? editData?.variantsList[0]?.price
                                            : ""
                                        : price || ""
                                }
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    const regex = /^\d*\.?\d*$/;
                                    if (regex.test(newValue)) {
                                        if (editData) {
                                            setEditData((prevState) => ({
                                                ...prevState,
                                                variantsList: prevState.variantsList.map(
                                                    (variant, index) =>
                                                        index === 0
                                                            ? { ...variant, price: newValue }
                                                            : variant
                                                ),
                                            }));
                                            addDefaultVariant(newValue);
                                        } else {
                                            setPrice(newValue);
                                            addDefaultVariant(newValue);
                                        }
                                        setAllFormValidation({
                                            ...allFormValidation,
                                            price: false,
                                        });
                                    }
                                }}
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-span-3">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Sub Category
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Sub Category"
                                    className={`w-full ${allFormValidation.itemSubCategory
                                        ? "border-red-500 rela "
                                        : ""
                                        }`}
                                    error={allFormValidation.itemSubCategory}
                                    autoComplete="off"
                                    value={
                                        editData
                                            ? editData.itemSubCategory
                                            : fullData.itemSubCategory
                                    }
                                    onChange={(e) => {
                                        editData
                                            ? setEditData({
                                                ...editData,
                                                itemSubCategory: e.target.value,
                                            })
                                            : setFullData({
                                                ...fullData,
                                                itemSubCategory: e.target.value,
                                            });
                                        setAllFormValidation({
                                            ...allFormValidation,
                                            itemSubCategory: false,
                                        });
                                    }}
                                >
                                    {subCategories.map((category, index) => (
                                        <MenuItem key={index} value={category.subCategoryId}>
                                            {category.subCategoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-span-2">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Spicy Level
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Spicy Level"
                                    className={`w-full ${allFormValidation.spicyLevel ? "border-red-500 rela " : ""
                                        }`}
                                    error={allFormValidation.spicyLevel}
                                    autoComplete="off"
                                    value={
                                        editData
                                            ? editData.spicyLevel || ""
                                            : fullData.spicyLevel || ""
                                    }
                                    onChange={(e) => {
                                        editData
                                            ? setEditData({ ...editData, spicyLevel: e.target.value })
                                            : setFullData({
                                                ...fullData,
                                                spicyLevel: e.target.value,
                                            });
                                        setAllFormValidation({
                                            ...allFormValidation,
                                            spicyLevel: false,
                                        });
                                    }}
                                >
                                    <MenuItem value={"0"}>0</MenuItem>
                                    <MenuItem value={"1"}>1</MenuItem>
                                    <MenuItem value={"2"}>2</MenuItem>
                                    <MenuItem value={"3"}>3</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-span-7">
                            <TextField
                                id="outlined-basic"
                                className={`w-full ${allFormValidation.itemDescription ? "border-red-500" : ""
                                    }`}
                                label="Item Description"
                                variant="outlined"
                                value={
                                    editData ? editData.itemDescription : fullData.itemDescription
                                }
                                onChange={(e) => {
                                    editData
                                        ? setEditData({
                                            ...editData,
                                            itemDescription: e.target.value,
                                        })
                                        : setFullData({
                                            ...fullData,
                                            itemDescription: e.target.value,
                                        });
                                    setAllFormValidation({
                                        ...allFormValidation,
                                        itemDescription: false,
                                    });
                                }}
                                autoComplete="off"
                            />
                        </div>
                        {editData && (
                            <div className="col-span-1">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={() => {
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    isJain: !prev.isJain,
                                                }));
                                            }}
                                            checked={editData?.isJain ? true : false}
                                        />
                                    }
                                    label="Jain"
                                />
                            </div>
                        )}
                        {editData && (
                            <div className="col-span-2">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={() => {
                                                setEditData((prev) => ({
                                                    ...prev,
                                                    isPureJain: !prev.isPureJain,
                                                }));
                                            }}
                                            checked={editData?.isPureJain ? true : false}
                                        />
                                    }
                                    label="Pure Jain"
                                />
                            </div>
                        )}
                        {!editData && (
                            <div className="col-span-1">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fullData.isJain ? true : false}
                                            onChange={() => {
                                                setFullData((prev) => ({
                                                    ...prev,
                                                    isJain: !prev.isJain,
                                                }));
                                            }}
                                        />
                                    }
                                    label="Jain"
                                />
                            </div>
                        )}
                        {!editData && (
                            <div className="col-span-2">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fullData.isPureJain ? true : false}
                                            onChange={() => {
                                                setFullData((prev) => ({
                                                    ...prev,
                                                    isPureJain: !prev.isPureJain,
                                                }));
                                            }}
                                        />
                                    }
                                    label="Pure Jain"
                                />
                            </div>
                        )}
                    </div>
                    <div className="text-xl p-1 mt-4">
                        {editData ? "Edit Unit" : "Add Unit"}
                    </div>
                    <hr className="my-2 mb-4" />
                    <div className="flex w-full gap-6 ">
                        <div className="flex gap-6 w-3/6 items-start mt-2 ">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Age"
                                    value={unit.unit}
                                    error={allFormValidation.unit ? true : false}
                                    helperText={allFormValidation.unit ? "Unit is required" : ""}
                                    onChange={(e) => {
                                        setUnit({ ...unit, unit: e.target.value });
                                        setAllFormValidation({ ...allFormValidation, unit: false });
                                    }}
                                    inputRef={addingUnitName}
                                >
                                    {getAllUnit &&
                                        getAllUnit.map((unit, index) => (
                                            <MenuItem key={index} value={unit}>
                                                {unit}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <TextField
                                id="outlined-basic"
                                className="w-full"
                                label="Unit Price"
                                value={unit.price}
                                variant="outlined"
                                error={allFormValidation.unitPrice ? true : false}
                                helperText={
                                    allFormValidation.unitPrice ? "Price is required" : ""
                                }
                                onChange={(e) => {
                                    const inputPrice = e.target.value;
                                    const regex = /^\d*\.?\d*$/;
                                    if (regex.test(inputPrice)) {
                                        setUnit({ ...unit, price: inputPrice });
                                        setAllFormValidation({
                                            ...allFormValidation,
                                            unitPrice: false,
                                        });
                                    }
                                    // else {
                                    //     setUnit({ ...unit, price: inputPrice });
                                    //     setAllFormValidation({ ...allFormValidation, unitPrice: true });
                                    // }
                                }}
                                autoComplete="off"
                            />

                            <div className="w-full">
                                <button
                                    onClick={addVariantFields}
                                    className="addCategorySaveBtn "
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        <Divider orientation="vertical" flexItem className="bg-black" />
                        <div className="customVariantsHeight">
                            {variantFields?.map((period, index) => (
                                <div
                                    key={index}
                                    className="flex w-full mb-6 mt-2 px-2 pr-4  gap-6 items-center"
                                >
                                    <div className="indexDisplay font-normal w-2/12 mx-4 text-4xl">
                                        {index + 1}
                                    </div>
                                    <div className="w-full">
                                        <TextField
                                            id="outlined-basic"
                                            className="w-full"
                                            label="Unit Name"
                                            variant="outlined"
                                            disabled
                                            value={period?.unit}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <TextField
                                            id="outlined-basic"
                                            className="w-full"
                                            label="Unit Price"
                                            variant="outlined"
                                            value={period?.price}
                                            autoComplete="off"
                                            onChange={(e) => {
                                                const regex = /^[0-9]*\.?[0-9]*$/;
                                                if (regex.test(e.target.value)) {
                                                    handlePriceManualChange(period, e.target.value);
                                                    if (period?.unit === "NO") {
                                                        if (editData) {
                                                            const updatedVariantsList = [
                                                                ...editData.variantsList,
                                                            ];
                                                            updatedVariantsList[0] = {
                                                                ...updatedVariantsList[0],
                                                                price: e.target.value,
                                                            };
                                                            setEditData({
                                                                ...editData,
                                                                variantsList: updatedVariantsList,
                                                            });
                                                        } else {
                                                            setPrice(e.target.value);
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 h-11 text-center w-11 hover:bg-red-600 hover:font-white"
                                        onClick={() => handleDelete(index)}
                                    >
                                        <DeleteOutlineOutlinedIcon className="text-gray-600 table_icon2 " />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-9 mt-6 w-full mr-7 justify-end px-4">
                        <div className="w-1/5">
                            <button
                                onClick={handleSUbmitForm}
                                className="addCategorySaveBtn ml-4"
                            >
                                Save
                            </button>
                        </div>
                        <div className="w-1/5">
                            <button
                                onClick={handleClose}
                                className="addCategoryCancleBtn ml-4 bg-gray-700"
                            >
                                Cancel
                            </button>
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
                <Box sx={style} className="priceEdit">
                    <FormControl>
                        <p className="text-2xl mb-5 font-semibold">
                            {editPriceValueType === "increase"
                                ? "Increase Price"
                                : "Decrease Price"}
                        </p>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                            <div className="flex">
                                <FormControlLabel
                                    checked={editPriceType.percentage ? true : false}
                                    onClick={() => {
                                        setEditPriceType({ percentage: true });
                                        setEditPrice({ precentage: "", fixed: "" });
                                    }}
                                    value="Percentage"
                                    control={<Radio />}
                                    label="Percentage"
                                    autoComplete="off"
                                />
                                <FormControlLabel
                                    onClick={() => {
                                        setEditPriceType({ fixed: true });
                                        setEditPrice({ precentage: "", fixed: "" });
                                    }}
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
                        <div className="mt-2 w-full">
                            <FormControl
                                sx={{ m: 1, width: "25ch" }}
                                variant="standard"
                                className="w-full formControl"
                            >
                                <TextField
                                    variant="outlined"
                                    id="percentage-input"
                                    label="Percentage"
                                    autoComplete="off"
                                    value={editPrice.percentage}
                                    onChange={handlePercentageChange}
                                    error={!!inputError}
                                    helperText={inputError}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">%</InputAdornment>
                                        ),
                                    }}
                                    className="w-full"
                                />
                            </FormControl>
                        </div>
                    )}
                    {editPriceType.fixed && (
                        <div className="mt-2 w-full">
                            <FormControl
                                sx={{ m: 1, width: "25ch" }}
                                variant="standard"
                                className="w-full formControl"
                            >
                                <TextField
                                    variant="outlined"
                                    id="fixed-input"
                                    label="Fixed Amount"
                                    autoComplete="off"
                                    value={editPrice.fixed}
                                    onChange={handleFixedChange}
                                    error={!!inputError}
                                    helperText={inputError}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CurrencyRupeeIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    className="w-full"
                                />
                            </FormControl>
                        </div>
                    )}
                    <div className="flex gap-6 mt-6 w-full">
                        <div className="w-full">
                            <button onClick={handleSave} className="addCategorySaveBtn">
                                Save
                            </button>
                        </div>
                        <div className="w-full">
                            <button
                                onClick={handleClose}
                                className="addCategoryCancleBtn bg-gray-700"
                            >
                                Cancel
                            </button>
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
                <Box sx={style} className="variantPopUp">
                    <div className="w-full p-2">
                        <div className="text-xl font-bold">
                            Edit Variants of {varinatsItemObject.itemName}
                        </div>
                        <hr className="my-6" />
                        {variantMode.isEdit && (
                            <div className="">
                                <div className="flex gap-4">
                                    <div className="w-full">
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">
                                                Variants Name
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Variants Name"
                                                className="w-full"
                                                autoComplete="off"
                                                value={secondVariantData.unit}
                                                disabled={variantMode.isView ? true : false}
                                                onChange={(e) => {
                                                    setSecondVariantData({
                                                        ...secondVariantData,
                                                        unit: e.target.value,
                                                    });
                                                }}
                                            >
                                                {getAllUnit &&
                                                    getAllUnit
                                                        .filter(
                                                            (unit) =>
                                                                !variantEditData.some((v) => v.unit === unit)
                                                        )
                                                        .map((unit, index) => (
                                                            <MenuItem key={index} value={unit}>
                                                                {unit}
                                                            </MenuItem>
                                                        ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="w-full">
                                        <TextField
                                            id="outlined-basic"
                                            label="Price"
                                            variant="outlined"
                                            autoComplete="off"
                                            value={secondVariantData.price}
                                            disabled={variantMode.isView}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const regex = /^[0-9]*\.?[0-9]*$/;
                                                if (regex.test(value)) {
                                                    setSecondVariantData({
                                                        ...secondVariantData,
                                                        price: value,
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <button
                                            onClick={handleSecondAddVarinats}
                                            className="w-full addCategorySaveBtn"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <hr className="my-6" />
                            </div>
                        )}
                        <div>
                            {variantEditData.map((variant, index) => (
                                <div key={index} className="flex gap-6 my-3 justify-around">
                                    <div className="w-full">
                                        <TextField
                                            id="outlined-basic"
                                            label="Unit"
                                            variant="outlined"
                                            disabled
                                            value={variant.unit}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <TextField
                                            id="outlined-basic"
                                            label="Price"
                                            variant="outlined"
                                            disabled={variantMode.isEdit ? false : true}
                                            value={variant.price}
                                            autoComplete="off"
                                            onChange={(e) => {
                                                const regex = /^[0-9]*\.?[0-9]*$/;
                                                if (regex.test(e.target.value)) {
                                                    handlePriceChange(e, index);
                                                }
                                            }}
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
                                            {variantMode.isEdit && variant.unit !== "NO" && (
                                                <div
                                                    className="rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600"
                                                    onClick={() =>
                                                        handleDeleteVariant(index, variant.unit)
                                                    }
                                                >
                                                    <DeleteOutlineOutlinedIcon className="text-gray-600 table_icon2" />
                                                </div>
                                            )}
                                            {variantMode.isEdit && variant.unit === "NO" && (
                                                <div
                                                    className="rounded-lg bg-gray-300 p-2 ml-4 cursor-not-allowed"
                                                    title="Delete disabled for 'NO' unit"
                                                >
                                                    <DeleteOutlineOutlinedIcon className="text-gray-400 table_icon2" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="w-full">
                                {variantMode.isView && (
                                    <div className="flex gap-6 mt-6 w-full">
                                        <div className="w-full">
                                            <button
                                                onClick={() => handleManualVariantsPopUp()}
                                                className="addCategorySaveBtn "
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="w-full">
                                            <button
                                                onClick={handleClose}
                                                className="addCategoryCancleBtn  bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {variantMode.isEdit && (
                                    <div className="flex gap-6 mt-6 w-full ">
                                        <div className="w-full">
                                            <button
                                                onClick={handleUpdateVariantsData}
                                                className="addCategorySaveBtn "
                                            >
                                                Save
                                            </button>
                                        </div>
                                        <div className="w-full">
                                            <button
                                                onClick={handleClose}
                                                className="addCategoryCancleBtn bg-gray-700"
                                            >
                                                Cancel
                                            </button>
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
                <Box sx={{ ...copyMenuStyle }} className="copyMenuPopUp">
                    <div className="popHeading">
                        Copy Menu from {menuName.menuCategoryName}
                    </div>
                    <hr className="my-6" />
                    <div className="flex gap-4 w-full">
                        <div className="w-full">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Source</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Source"
                                    value={copySource.menuCategoryName}
                                    onChange={handleCopySourceChange}
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
                                className="w-full"
                                autoComplete="off"
                                value={menuName.menuCategoryName}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-6 w-11/12">
                        <label
                            htmlFor="copy-sub-category"
                            className="flex items-center gap-2 cursor-pointer"
                        >
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
                                <InputLabel id="demo-simple-select-label">Source</InputLabel>
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
                            <button
                                onClick={handleCopyMenuFromOther}
                                className="addCategorySaveBtn copyMenuButton "
                            >
                                Save
                            </button>
                        </div>
                        <div className="w-full">
                            <button
                                onClick={handleClose}
                                className="addCategoryCancleBtn  copyMenuButton  bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default AssignAddonGroup;

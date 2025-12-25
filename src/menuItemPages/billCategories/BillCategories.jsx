import React, { useState, useEffect } from 'react'
import './BillCategories.css'
import axios from 'axios'
import { BACKEND_BASE_URL } from '../../url'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
    Modal,
    Box,
    TextField,
    Switch,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import CloseIcon from '@mui/icons-material/Close'

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(800px, 95vw)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
    maxHeight: '90vh',
    overflowY: 'auto',
}

const viewModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(600px, 95vw)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
    maxHeight: '90vh',
    overflowY: 'auto',
}

function BillCategories() {
    const [billCategories, setBillCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [formData, setFormData] = useState({
        menuId: '',
        firmId: '',
        isOfficial: 0,
        billFooterNote: '',
        appriciateLine: '',
        categoryStatus: 1,
    })
    const [firmList, setFirmList] = useState([])
    const [menuCategoryList, setMenuCategoryList] = useState([])

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : undefined,
        },
    }

    useEffect(() => {
        fetchBillCategories()
        fetchFirmData()
        fetchMenuCategoryData()
    }, [])

    // Update categories with menuCategoryName when menuCategoryList is loaded
    useEffect(() => {
        if (menuCategoryList.length > 0 && billCategories.length > 0) {
            const updatedCategories = billCategories.map(category => {
                // Preserve all properties including bwcId
                const updatedCategory = { ...category }
                if (!category.menuCategoryName && category.menuId) {
                    const menuCategory = menuCategoryList.find(menu => menu.menuCategoryId === category.menuId)
                    if (menuCategory) {
                        updatedCategory.menuCategoryName = menuCategory.menuCategoryName
                    }
                }
                return updatedCategory
            })
            // Only update if there were changes
            const hasChanges = updatedCategories.some((cat, index) =>
                cat.menuCategoryName !== billCategories[index]?.menuCategoryName
            )
            if (hasChanges) {
                console.log('Updated categories with menuCategoryName, preserving bwcId:', updatedCategories.map(cat => ({ name: cat.categoryName, bwcId: cat.bwcId })))
                setBillCategories(updatedCategories)
            }
        }
    }, [menuCategoryList])

    const fetchBillCategories = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/getBillCategory`,
                config
            )
            console.log('=== API RESPONSE ===')
            console.log('Full API Response:', JSON.stringify(response.data, null, 2))
            console.log('API Response keys:', Object.keys(response.data))

            // Convert object to array of objects with category name as key
            const categoriesArray = Object.keys(response.data).map((key) => {
                const categoryData = response.data[key]
                console.log(`\n=== Category: ${key} ===`)
                console.log('Raw category data:', categoryData)
                console.log('Category data keys:', Object.keys(categoryData))
                console.log('bwcId property:', categoryData.bwcId)
                console.log('Has bwcId?', 'bwcId' in categoryData)

                const category = {
                    categoryName: key,
                    ...categoryData,
                }
                console.log('Mapped category:', category)
                console.log('Mapped category bwcId:', category.bwcId)
                return category
            })
            console.log('\n=== ALL CATEGORIES MAPPED ===')
            console.log('Categories with bwcId:', categoriesArray.map(cat => ({
                name: cat.categoryName,
                bwcId: cat.bwcId,
                allKeys: Object.keys(cat)
            })))
            setBillCategories(categoriesArray)
        } catch (error) {
            console.error('Error fetching bill categories:', error)
            toast.error('Failed to fetch bill categories')
        } finally {
            setLoading(false)
        }
    }

    const fetchFirmData = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}billingrouter/ddlFirmData`,
                config
            )
            setFirmList(response.data || [])
        } catch (error) {
            console.error('Error fetching firm data:', error)
            toast.error('Failed to fetch firm data')
        }
    }

    const fetchMenuCategoryData = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}menuItemrouter/getMenuCategory`,
                config
            )
            setMenuCategoryList(response.data || [])
        } catch (error) {
            console.error('Error fetching menu category data:', error)
            toast.error('Failed to fetch menu category data')
        }
    }

    const handleRowClick = (category) => {
        setSelectedCategory(category)
        setViewModalOpen(true)
    }

    const handleEdit = (e, category) => {
        e.stopPropagation()
        console.log('=== EDIT BUTTON CLICKED ===')
        console.log('Category being edited (full object):', category)
        console.log('Category bwcId:', category.bwcId)
        console.log('All category keys:', Object.keys(category))

        // Find the original category from billCategories to ensure we have bwcId
        const originalCategory = billCategories.find(cat => cat.categoryName === category.categoryName)
        console.log('Original category from billCategories:', originalCategory)
        console.log('Original category bwcId:', originalCategory?.bwcId)

        // Use the original category if found, otherwise use the passed category
        const categoryToUse = originalCategory || category
        console.log('Category to use for edit:', categoryToUse)
        console.log('Category to use bwcId:', categoryToUse.bwcId)

        setSelectedCategory(categoryToUse)
        setSelectedCategory(categoryToUse)
        // Set default to first option if not selected
        const defaultMenuId = categoryToUse.menuId || (menuCategoryList.length > 0 ? menuCategoryList[0].menuCategoryId : '')
        const defaultFirmId = categoryToUse.firmId || (firmList.length > 0 ? firmList[0].firmId : '')
        setFormData({
            menuId: defaultMenuId,
            firmId: defaultFirmId,
            isOfficial: categoryToUse.isOfficial || 0,
            billFooterNote: categoryToUse.billFooterNote || '',
            appriciateLine: categoryToUse.appriciateLine || '',
            categoryStatus: categoryToUse.categoryStatus !== undefined ? categoryToUse.categoryStatus : 1,
        })
        setEditModalOpen(true)
    }

    // Update formData defaults when lists are loaded and modal is open
    useEffect(() => {
        if (editModalOpen && selectedCategory) {
            setFormData((prev) => ({
                ...prev,
                menuId: prev.menuId || (menuCategoryList.length > 0 ? menuCategoryList[0].menuCategoryId : ''),
                firmId: prev.firmId || (firmList.length > 0 ? firmList[0].firmId : ''),
            }))
        }
    }, [menuCategoryList, firmList, editModalOpen, selectedCategory])

    const handleCloseEditModal = () => {
        setEditModalOpen(false)
        setSelectedCategory(null)
        setFormData({
            menuId: '',
            firmId: '',
            isOfficial: 0,
            billFooterNote: '',
            appriciateLine: '',
            categoryStatus: 1,
        })
    }

    const handleCloseViewModal = () => {
        setViewModalOpen(false)
        setSelectedCategory(null)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSwitchChange = (name) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [name]: e.target.checked ? 1 : 0,
        }))
    }

    const handleSubmit = async () => {
        if (!selectedCategory) return

        // Ensure menuId and firmId are selected (use first option if empty)
        const menuId = formData.menuId || (menuCategoryList.length > 0 ? menuCategoryList[0].menuCategoryId : '')
        const firmId = formData.firmId || (firmList.length > 0 ? firmList[0].firmId : '')

        if (!menuId || !firmId) {
            toast.error('Menu Category and Firm are required fields')
            return
        }

        try {
            setLoading(true)
            // Ensure bwcId is included - it's required for the update
            // Try to get bwcId from selectedCategory, or find it from billCategories
            let bwcId = selectedCategory.bwcId

            console.log('Selected Category full object:', selectedCategory)
            console.log('Selected Category keys:', Object.keys(selectedCategory))
            console.log('BWC ID from selectedCategory:', bwcId)

            // If bwcId is not in selectedCategory, try to find it from the original categories
            if (!bwcId && selectedCategory.categoryName) {
                const originalCategory = billCategories.find(cat => cat.categoryName === selectedCategory.categoryName)
                console.log('Original category found:', originalCategory)
                if (originalCategory) {
                    console.log('Original category bwcId:', originalCategory.bwcId)
                    if (originalCategory.bwcId) {
                        bwcId = originalCategory.bwcId
                        console.log('Found bwcId from billCategories:', bwcId)
                    }
                }
            }

            console.log('All billCategories:', billCategories.map(cat => ({ name: cat.categoryName, bwcId: cat.bwcId, hasBwcId: !!cat.bwcId })))
            console.log('Final bwcId to use:', bwcId)

            if (!bwcId) {
                toast.error('BWC ID is missing. Cannot update category. Please refresh the page and try again.')
                setLoading(false)
                return
            }

            const updateData = {
                bwcId: bwcId,
                menuId: menuId,
                firmId: firmId,
                isOfficial: formData.isOfficial,
                billFooterNote: formData.billFooterNote || '',
                appriciateLine: formData.appriciateLine || '',
                categoryStatus: formData.categoryStatus,
            }
            console.log('Update Data being sent to API:', JSON.stringify(updateData, null, 2))
            await axios.post(
                `${BACKEND_BASE_URL}billingrouter/updateBillCategoryData`,
                updateData,
                config
            )
            toast.success('Bill category updated successfully')
            handleCloseEditModal()
            fetchBillCategories()
        } catch (error) {
            console.error('Error updating bill category:', error)
            toast.error(error.response?.data?.message || 'Failed to update bill category')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='billCategoriesContainer'>
            <div className='userTableSubContainerBillCategories'>
                <div className='tableContainerWrapper'>
                    <TableContainer
                        sx={{
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                        }}
                        component={Paper}
                    >
                        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Menu Category</TableCell>
                                    <TableCell>Firm Name</TableCell>
                                    <TableCell>Is Official</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billCategories && billCategories.length > 0 ? (
                                    billCategories.map((category, index) => (
                                        <TableRow
                                            hover
                                            key={category.categoryId || index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            className='tableRow'
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleRowClick(category)}
                                        >
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell component="th" scope="row">
                                                {category.categoryName}
                                            </TableCell>
                                            <TableCell align="left">
                                                {category.menuCategoryName ||
                                                    (menuCategoryList.find(menu => menu.menuCategoryId === category.menuId)?.menuCategoryName) ||
                                                    '-'}
                                            </TableCell>
                                            <TableCell align="left">
                                                {category.firmName || '-'}
                                            </TableCell>
                                            <TableCell align="left">
                                                {category.isOfficial === 1 ? 'Yes' : 'No'}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={(e) => handleEdit(e, category)}
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: '#1976d2',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: '#1565c0',
                                                        },
                                                    }}
                                                >
                                                    <BorderColorIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow
                                        key="no-data"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell
                                            align="center"
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: '500',
                                                padding: '40px',
                                            }}
                                            colSpan={6}
                                        >
                                            {loading ? 'Loading...' : 'No Data Found...!'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>

            {/* View Modal */}
            <Modal
                open={viewModalOpen}
                onClose={handleCloseViewModal}
                aria-labelledby="view-modal-title"
                aria-describedby="view-modal-description"
            >
                <Box sx={viewModalStyle}>
                    <div className='modalHeader'>
                        <h2 id="view-modal-title">Bill Category Details</h2>
                        <IconButton onClick={handleCloseViewModal} sx={{ color: 'gray' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    {selectedCategory && (
                        <div className='viewModalContent'>
                            <div className='detailRow'>
                                <span className='detailLabel'>Category Name:</span>
                                <span className='detailValue'>{selectedCategory.categoryName}</span>
                            </div>
                            <div className='detailRow'>
                                <span className='detailLabel'>Menu Category Name:</span>
                                <span className='detailValue'>
                                    {selectedCategory.menuCategoryName || '-'}
                                </span>
                            </div>
                            <div className='detailRow'>
                                <span className='detailLabel'>Firm Name:</span>
                                <span className='detailValue'>
                                    {selectedCategory.firmName || '-'}
                                </span>
                            </div>
                            <div className='detailRow'>
                                <span className='detailLabel'>Is Official:</span>
                                <span className='detailValue'>
                                    {selectedCategory.isOfficial === 1 ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className='detailRow'>
                                <span className='detailLabel'>Category Status:</span>
                                <span className='detailValue'>
                                    {selectedCategory.categoryStatus === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className='detailRow fullWidth'>
                                <span className='detailLabel'>Bill Footer Note:</span>
                                <span className='detailValue'>
                                    {selectedCategory.billFooterNote || '-'}
                                </span>
                            </div>
                            <div className='detailRow fullWidth'>
                                <span className='detailLabel'>Appreciate Line:</span>
                                <span className='detailValue'>
                                    {selectedCategory.appriciateLine || '-'}
                                </span>
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>

            {/* Edit Modal */}
            <Modal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <Box sx={modalStyle}>
                    <div className='modalHeader'>
                        <h2 id="edit-modal-title">Edit Bill Category</h2>
                        <IconButton onClick={handleCloseEditModal} sx={{ color: 'gray' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    {selectedCategory && (
                        <div className='editModalContent'>
                            <div className='categoryNameDisplay'>
                                <span className='categoryNameLabel'>Category:</span>
                                <span className='categoryNameValue'>{selectedCategory.categoryName}</span>
                            </div>
                            <div className='formRowGrid'>
                                <FormControl fullWidth size="small" margin="normal" required>
                                    <InputLabel>Menu Category *</InputLabel>
                                    <Select
                                        name="menuId"
                                        value={formData.menuId || (menuCategoryList.length > 0 ? menuCategoryList[0].menuCategoryId : '')}
                                        onChange={handleInputChange}
                                        label="Menu Category *"
                                        required
                                    >
                                        {menuCategoryList.map((menu) => (
                                            <MenuItem key={menu.menuCategoryId} value={menu.menuCategoryId}>
                                                {menu.menuCategoryName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth size="small" margin="normal" required>
                                    <InputLabel>Firm *</InputLabel>
                                    <Select
                                        name="firmId"
                                        value={formData.firmId || (firmList.length > 0 ? firmList[0].firmId : '')}
                                        onChange={handleInputChange}
                                        label="Firm *"
                                        required
                                    >
                                        {firmList.map((firm) => (
                                            <MenuItem key={firm.firmId} value={firm.firmId}>
                                                {firm.firmName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='formRowGrid'>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isOfficial === 1}
                                            onChange={handleSwitchChange('isOfficial')}
                                            color="primary"
                                        />
                                    }
                                    label="Is Official"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.categoryStatus === 1}
                                            onChange={handleSwitchChange('categoryStatus')}
                                            color="primary"
                                        />
                                    }
                                    label="Category Status (Active)"
                                />
                            </div>
                            <div className='formRow'>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Bill Footer Note"
                                    name="billFooterNote"
                                    value={formData.billFooterNote}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                            </div>
                            <div className='formRow'>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Appreciate Line"
                                    name="appriciateLine"
                                    value={formData.appriciateLine}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                            </div>
                            <div className='formActions'>
                                <button className='stockOutBtn' onClick={handleCloseEditModal}>
                                    Cancel
                                </button>
                                <button
                                    className='stockInBtn'
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>

            <ToastContainer />
        </div>
    )
}

export default BillCategories


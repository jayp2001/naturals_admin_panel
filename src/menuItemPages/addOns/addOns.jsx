import React, { useState, useEffect } from 'react'
import './addOns.css'
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
    TablePagination,
    IconButton,
} from '@mui/material'
import { ReactTransliterate } from 'react-transliterate'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(1000px, 95vw)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
}

function AddOns() {
    const [open, setOpen] = useState(false)
    const [groupName, setGroupName] = useState('')
    const [groupGujaratiName, setGroupGujaratiName] = useState('')
    const [addonList, setAddonList] = useState([])
    const [newAddon, setNewAddon] = useState({ addonName: '', gujaratiName: '', price: '' })
    const [addonGroups, setAddonGroups] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [editData, setEditData] = useState(null)
    const [viewData, setViewData] = useState(null)
    const [viewModalOpen, setViewModalOpen] = useState(false)

    const navigate = useNavigate()

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : undefined,
        },
    }

    useEffect(() => {
        getAddonGroups()
    }, [page, rowsPerPage])

    const getAddonGroups = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_BASE_URL}menuItemrouter/getAddOnsGroupList?page=${page + 1}&numPerPage=${rowsPerPage}`,
                config
            )
            setAddonGroups(response.data.rows || [])
            setTotalRows(response.data.numRows || 0)
        } catch (error) {
            console.error('Error fetching addon groups:', error)
            toast.error('Failed to fetch addon groups')
        }
    }

    const handleOpen = () => setOpen(true)

    const handleClose = () => {
        setOpen(false)
        setGroupName('')
        setGroupGujaratiName('')
        setAddonList([])
        setNewAddon({ addonName: '', gujaratiName: '', price: '' })
        setEditData(null)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleEdit = (group) => {
        setEditData(group)
        setGroupName(group.groupName)
        setGroupGujaratiName(group.groupGujaratiName || '')
        setAddonList(
            group.addonList.map(addon => ({
                addonId: addon.addonId,
                addonName: addon.addonName,
                gujaratiName: addon.addonsGujaratiName || '',
                price: addon.price.toString(),
                isActive: Boolean(addon.isActive)
            }))
        )
        setOpen(true)
    }

    const handleView = (group) => {
        setViewData(group)
        setViewModalOpen(true)
    }

    const handleCloseViewModal = () => {
        setViewModalOpen(false)
        setViewData(null)
    }

    const handleRowClick = (group) => {
        navigate(`/menu/assignAddonGroup/${group.groupId}/${encodeURIComponent(group.groupName)}`)
    }

    const handleAddAddon = () => {
        if (!newAddon.addonName?.trim()) {
            toast.error('Addon name is required')
            return
        }
        if (!newAddon.price?.toString().trim()) {
            toast.error('Price is required')
            return
        }
        const priceRegex = /^\d*\.?\d*$/
        if (!priceRegex.test(newAddon.price)) {
            toast.error('Enter a valid price')
            return
        }

        const newAddonItem = {
            addonName: newAddon.addonName.trim(),
            gujaratiName: newAddon.gujaratiName?.trim() || '',
            price: newAddon.price,
            isActive: true,
            isNew: true // Flag to identify new addons
        }

        setAddonList(prev => [...prev, newAddonItem])
        setNewAddon({ addonName: '', gujaratiName: '', price: '' })
    }

    const handleUpdatePrice = (index, value) => {
        const regex = /^\d*\.?\d*$/
        if (!regex.test(value)) return
        setAddonList(prev => prev.map((a, i) => (i === index ? { ...a, price: value } : a)))
    }

    const handleToggleActive = (index) => {
        setAddonList(prev => prev.map((a, i) => (i === index ? { ...a, isActive: !a.isActive } : a)))
    }

    const removeAddon = (index) => {
        setAddonList(prev => prev.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        if (!groupName.trim()) {
            toast.error('Addon group name is required')
            return
        }
        if (addonList.length === 0) {
            toast.error('Add at least one addon')
            return
        }

        let payload, endpoint

        if (editData) {
            // Update existing group
            payload = {
                groupId: editData.groupId,
                groupName: groupName.trim(),
                groupGujaratiName: groupGujaratiName.trim(),
                addonList: addonList.map(({ addonId, addonName, gujaratiName, price, isActive, isNew }) => {
                    const addonData = {
                        addonName,
                        addonsGujaratiName: gujaratiName || '',
                        price: Number(price || 0),
                        isActive
                    }

                    // Only include addonId for existing addons (not new ones)
                    if (!isNew && addonId) {
                        addonData.addonId = addonId
                    }

                    return addonData
                }),
            }
            endpoint = `${BACKEND_BASE_URL}menuItemrouter/updateAddonGroupData`
        } else {
            // Create new group
            payload = {
                groupName: groupName.trim(),
                groupGujaratiName: groupGujaratiName.trim(),
                addonList: addonList.map(({ addonName, gujaratiName, price, isActive }) => ({
                    addonName,
                    addonsGujaratiName: gujaratiName || '',
                    price: Number(price || 0),
                    isActive
                })),
            }
            endpoint = `${BACKEND_BASE_URL}menuItemrouter/addAddonGroupData`
        }

        try {
            await axios.post(endpoint, payload, config)
            toast.success(editData ? 'Add-on group updated' : 'Add-on group saved')
            setTimeout(() => {
                handleClose()
                getAddonGroups() // Refresh the table
            }, 800)
        } catch (err) {
            console.error(err)
            toast.error(err?.response?.data?.message || 'Failed to save add-on group')
        }
    }

    return (
        <div className='BilingDashboardContainer mx-4 p-3'>
            <ToastContainer />
            <div className='grid grid-cols-12 mt-5'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7'>
                                <div className='grid grid-cols-12 pl-6 h-full'>
                                    <div className='flex col-span-3 justify-center productTabAll'>
                                        <div className='statusTabtext'>Add-Ons Group</div>
                                    </div>
                                </div>
                            </div>
                            <div className='grid col-span-2 col-start-11 pr-3 h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={handleOpen}>Add Add-ons</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Addon Groups Table */}
            <div className='col-span-12 mt-8'>
                <TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Group Name</TableCell>
                                <TableCell>Group Gujarati Name</TableCell>
                                <TableCell>Addons Count</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {addonGroups.length > 0 ? (
                                addonGroups.map((group, index) => (
                                    <TableRow
                                        key={group.groupId}
                                        hover
                                        onClick={() => handleRowClick(group)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{(index + 1) + (page * rowsPerPage)}</TableCell>
                                        <TableCell>{group.groupName}</TableCell>
                                        <TableCell>{group.groupGujaratiName || '-'}</TableCell>
                                        <TableCell>{group.addonList?.length || 0}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleView(group)
                                                }}
                                                color="info"
                                                size="small"
                                                style={{ marginRight: 8 }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEdit(group)
                                                }}
                                                color="primary"
                                                size="small"
                                            >
                                                <BorderColorIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" style={{ fontSize: "18px" }}>
                                        No Data Found...!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalRows}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle} className='addProdutModal'>
                    <div className='text-xl p-1 font-semibold mb-3'>
                        {editData ? 'Edit Add-Ons Group' : 'Add Add-Ons Group'}
                    </div>

                    <div className='grid grid-cols-12 gap-4'>
                        <div className='col-span-6'>
                            <TextField
                                size='small'
                                label='Addon Group Name'
                                variant='outlined'
                                className='w-full'
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                autoComplete='off'
                            />
                        </div>
                        <div className='col-span-6'>
                            <ReactTransliterate
                                value={groupGujaratiName}
                                onChangeText={(text) => setGroupGujaratiName(text)}
                                className='w-full border p-2.5 rounded-md border-gray-300 text-sm'
                                style={{ fontSize: '14px', height: '40px' }}
                                placeholder='ગુજરાતી ગ્રુપ નામ'
                                lang='gu'
                            />
                        </div>
                    </div>

                    <div className='text-lg p-1 mt-5 font-semibold mb-3'>Add Addon</div>

                    <div className='grid grid-cols-12 gap-4 mt-1'>
                        <div className='col-span-5'>
                            <TextField
                                size='small'
                                label='Addon Name'
                                variant='outlined'
                                className='w-full'
                                value={newAddon.addonName}
                                onChange={(e) => setNewAddon(prev => ({ ...prev, addonName: e.target.value }))}
                                autoComplete='off'
                            />
                        </div>
                        <div className='col-span-4'>
                            <ReactTransliterate
                                value={newAddon.gujaratiName}
                                onChangeText={(text) => setNewAddon(prev => ({ ...prev, gujaratiName: text }))}
                                className='ao-rtl-input'
                                placeholder='ગુજરાતી નામ'
                                label='Gujarati Name'
                                lang='gu'
                            />
                        </div>
                        <div className='col-span-2'>
                            <TextField
                                size='small'
                                label='Price'
                                variant='outlined'
                                className='w-full'
                                value={newAddon.price}
                                onChange={(e) => {
                                    const val = e.target.value
                                    const regex = /^\d*\.?\d*$/
                                    if (regex.test(val)) setNewAddon(prev => ({ ...prev, price: val }))
                                }}
                                autoComplete='off'
                            />
                        </div>
                        <div className='col-span-1 flex items-center'>
                            <button onClick={handleAddAddon} className='addCategorySaveBtn ao-compact-btn w-full'>Add</button>
                        </div>
                    </div>

                    {addonList.length > 0 && (
                        <div className='mt-6'>
                            <div className='text-lg font-semibold p-1 mb-2'>Add-ons in Group</div>

                            <div style={{
                                maxHeight: '45vh',
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
                                        gridTemplateColumns: '40px 4fr 3fr 2fr 2fr',
                                        columnGap: '12px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div className='text-xs font-semibold text-gray-600 text-center'>#</div>
                                    <div className='text-xs font-semibold text-gray-600'>Addon Name</div>
                                    <div className='text-xs font-semibold text-gray-600'>Gujarati Name</div>
                                    <div className='text-xs font-semibold text-gray-600'>Price</div>
                                    <div className='text-xs font-semibold text-gray-600 text-center'>Active / Remove</div>
                                </div>

                                {addonList.map((addon, index) => (
                                    <div
                                        key={index}
                                        className='px-3 py-3'
                                        style={{
                                            borderBottom: '1px solid #f3f4f6',
                                            display: 'grid',
                                            gridTemplateColumns: '40px 4fr 3fr 2fr 2fr',
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
                                                placeholder='Addon Name'
                                                variant='outlined'
                                                className='w-full'
                                                value={addon.addonName}
                                                disabled
                                                inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                            />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <TextField
                                                size='small'
                                                label=''
                                                placeholder='Gujarati Name'
                                                variant='outlined'
                                                className='w-full'
                                                value={addon.gujaratiName}
                                                disabled
                                                inputProps={{ style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                size='small'
                                                label=''
                                                placeholder='Price'
                                                variant='outlined'
                                                className='w-full'
                                                value={addon.price}
                                                onChange={(e) => handleUpdatePrice(index, e.target.value)}
                                            />
                                        </div>
                                        <div className='flex items-center justify-center gap-3'>
                                            <Switch checked={addon.isActive} onChange={() => handleToggleActive(index)} />
                                            <button className='rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-red-600 hover:text-white' onClick={() => removeAddon(index)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='flex gap-9 mt-6 w-full mr-7 justify-end px-4'>
                        <div className='w-1/5'>
                            <button onClick={handleSave} className='addCategorySaveBtn ao-compact-btn ml-4 w-full'>Save</button>
                        </div>
                        <div className='w-1/5'>
                            <button onClick={handleClose} className='addCategoryCancleBtn ao-compact-btn ml-4 bg-gray-700 w-full'>Cancel</button>
                        </div>
                    </div>
                </Box>
            </Modal>

            {/* View Modal */}
            <Modal open={viewModalOpen} onClose={handleCloseViewModal}>
                <Box sx={modalStyle} className='addProdutModal'>
                    <div className='text-xl p-1 font-semibold mb-3'>
                        View Add-Ons Group: {viewData?.groupName}
                    </div>

                    {viewData && viewData.addonList && viewData.addonList.length > 0 && (
                        <div className='mt-4'>
                            <div className='text-lg font-semibold p-1 mb-2'>Add-ons in Group</div>

                            <div style={{
                                maxHeight: '60vh',
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
                                        gridTemplateColumns: '40px 4fr 3fr 2fr 1fr',
                                        columnGap: '12px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div className='text-xs font-semibold text-gray-600 text-center'>#</div>
                                    <div className='text-xs font-semibold text-gray-600'>Addon Name</div>
                                    <div className='text-xs font-semibold text-gray-600'>Gujarati Name</div>
                                    <div className='text-xs font-semibold text-gray-600'>Price</div>
                                    <div className='text-xs font-semibold text-gray-600 text-center'>Status</div>
                                </div>

                                {viewData.addonList.map((addon, index) => (
                                    <div
                                        key={addon.addonId || index}
                                        className='px-3 py-3'
                                        style={{
                                            borderBottom: '1px solid #f3f4f6',
                                            display: 'grid',
                                            gridTemplateColumns: '40px 4fr 3fr 2fr 1fr',
                                            columnGap: '12px',
                                            alignItems: 'center',
                                            minWidth: 0
                                        }}
                                    >
                                        <div className='text-center'>{index + 1}</div>
                                        <div style={{ minWidth: 0 }}>
                                            <div className='text-sm p-2 bg-gray-50 rounded border' style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {addon.addonName}
                                            </div>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div className='text-sm p-2 bg-gray-50 rounded border' style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {addon.addonsGujaratiName || '-'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className='text-sm p-2 bg-gray-50 rounded border'>
                                                ₹{addon.price}
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <span className={`px-2 py-1 rounded text-xs ${addon.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {addon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='flex justify-end mt-6'>
                        <button onClick={handleCloseViewModal} className='addCategoryCancleBtn ao-compact-btn bg-gray-700 text-white px-6' style={{ width: 'auto' }}>
                            Close
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default AddOns
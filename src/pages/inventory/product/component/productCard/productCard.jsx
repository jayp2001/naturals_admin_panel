import { Button } from '@mui/material';
import Menutemp from './menu';
import './productCard.css';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { orange } from '@mui/material/colors';
function ProductCard(props) {
    const handleEdit = (row) => {
        props.handleEditClick(props.productData)
    }
    const handleDelete = () => {
        props.handleDeleteProduct(props.productData.productId);
    }
    const handleClick = () => {
        props.handleViewDetail(props.productData.productId, props.productData.productName, props.productData.minProductUnit, props.productData.remainingStock)
    }
    return (
        <div className="productCard iconPedding" key={props.productData.productId}>
            <div className='grid grid-cols-12'>
                <div className='col-span-11 productName'>
                    <Tooltip title={props.productData.productName} placement="top-start" arrow>
                        <div className={`productNameDiv ${props.productData.remainingStock >= props.productData.minProductQty ? 'greenHeader' : props.productData.remainingStock < props.productData.minProductQty && props.productData.remainingStock !== 0 ? 'orangeHeader' : 'redHeader'}`}>{props.productData.productName}</div>
                    </Tooltip>
                </div>
                <Menutemp handleDelete={handleDelete} handleEdit={handleEdit} />
            </div>
            <div className='mt-1 minStock'>
                <span className='minQtyDisplay'>Min Qty : {props.productData.minProductQty} {props.productData.minProductUnit}</span><br />
                ₹ <span className='lastPriceDisplay'>{props.productData.lastPrice} / {props.productData.minProductUnit}</span>
            </div>
            <div className='mt-4'>
                <div className='stockFieldHeader'>
                    Remaining Stock
                </div>
                <div className={`mt-2 stockFieldWrp ${props.productData.remainingStock >= props.productData.minProductQty ? 'green' : props.productData.remainingStock < props.productData.minProductQty && props.productData.remainingStock !== 0 ? 'orange' : 'red'}`}>
                    {props.productData.remainingStock} {props.productData.minProductUnit}
                </div>
            </div>
            <div className='mt-3 grid grid-cols-12 gap-2'>
                <div className='col-span-6 text-center stockFieldHeader'>
                    Stocked In
                </div>
                <div className='col-span-6 text-center stockFieldHeader'>
                    Stocked At
                </div>
            </div>
            <div className='grid grid-cols-12 gap-2'>
                <div className='col-span-6 text-center stockedField'>
                    {props.productData.lastUpdatedQty} {props.productData.minProductUnit}
                </div>
                <div className='col-span-6 text-center stockedField'>
                    {props.productData.lastUpdatedStockInDate}
                </div>
            </div>
            <div className='mt-6 stockBtnWrp'>
                <div className='grid gap-4 grid-cols-12'>
                    <div className='col-span-6'>
                        <button className='stockInBtn' onClick={() => props.handleOpenStockIn(props.productData)}>Stock In</button>
                    </div>
                    <div className='col-span-6'>
                        <button className='stockOutBtn' onClick={() => props.handleOpenStockOut(props.productData)}>Stock Out</button>
                    </div>
                </div>
                <div className='mt-4'>
                    <button className='viewDetailBtn' onClick={handleClick} ><VisibilityIcon fontSize='small' /> &nbsp;&nbsp;View Details</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;
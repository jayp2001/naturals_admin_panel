// import './productQtyCard.css';
import Tooltip from '@mui/material/Tooltip';

function ProductQtyCountCard(props) {
    return (
        <div className='productQtyCountcard flex gap-4' key={props.index}>
            <Tooltip title={props.productName} placement="top-start" arrow>
                <div className='productQtyName self-center'>
                    {props.productName}
                </div>
            </Tooltip>
            <div className='self-center countWwrp'>
                <Tooltip title={props.productQty + props.productQtyUnit + ' / ' + props.productPrice} placement="top-start" arrow>
                    <div className='countTextProduct flex justify-end'>
                        <div className='w-6/12 text-ellipsis overflow-hidden'>{props.productQty}<span className='unitDisplay'>{props.productQtyUnit}</span></div>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}

export default ProductQtyCountCard;
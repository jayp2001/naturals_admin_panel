import './countCard.css';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AlarmIcon from '@mui/icons-material/Alarm';

function CountCard(props) {
    const getImg = (imgname) => {
        switch (imgname) {
            case 'Total Purchase':
                return <AddShoppingCartIcon fontSize='large' />;
            case 'Total Cost':
                return <CurrencyExchangeIcon fontSize='large' />;
            case 'Total Used':
                return <ShoppingCartCheckoutIcon fontSize='large' />;
            case 'Remaining Stock':
                return <LocalMallOutlinedIcon fontSize='large' />;
            case 'Last Purchase Price':
                return <AttachMoneyOutlinedIcon fontSize='large' />;
            case 'Min Product Qty':
                return <ProductionQuantityLimitsIcon fontSize='large' />;
            case 'Total Business':
                return <CurrencyExchangeIcon fontSize='large' />;
            case 'Remaining Payment':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'Total Remaining':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'Paid Debit':
                return <CreditScoreOutlinedIcon fontSize='large' />;
            case 'Total Debit':
                return <PaymentOutlinedIcon fontSize='large' />;
            case 'Paid':
                return <PriceCheckOutlinedIcon fontSize='large' />;
            case 'Total Cash':
                return <RequestQuoteOutlinedIcon fontSize='large' />;
            case 'Total Product':
                return <ReceiptLongOutlinedIcon fontSize='large' />;
            case 'Delivery Round':
                return <DeliveryDiningIcon fontSize='large' />;
            case 'No. Of Other Work':
                return <DirectionsRunIcon fontSize='large' />;
            case 'No. Of Parcel':
                return <FoodBankIcon fontSize='large' />;
            case 'Work Time':
                return <AlarmIcon fontSize='large' />;
            case 'Parcel Ammount':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'Settled Up':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'You will get':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'You will get':
                return <CardGiftcardOutlinedIcon fontSize='large' />;
            case 'Total Due':
                return <CreditScoreOutlinedIcon fontSize='large' />;
            case 'Total Paid':
                return <PriceCheckOutlinedIcon fontSize='large' />;
            default:
                return <CurrencyExchangeIcon fontSize='large' />;
        }
    }
    return (
        <div className='countcard flex gap-4'>
            <div className='self-center'>
                <div className={`logoContainer ${props.color === 'blue' ? 'blueCountLogoWrp' : props.color === 'green' ? 'greenCountLogoWrp' : props.color === 'yellow' ? 'yellowCountLogoWrp' : props.color === 'pink' ? 'pinkCountLogoWrp' : props.color === 'black' ? 'blackCountLogoWrp' : props.color === 'orange' ? 'orangeCountLogoWrp' : ''}`}>
                    {getImg(props.desc)}
                </div>
            </div>
            <div className='self-center w-full'>
                <div className='countText' style={{ color: props.desc == 'You will get' ? 'red' : props.desc == 'You will give' ? 'green' : '' }}>
                    {props.desc == 'Work Time' ? <span>{props.count}</span> : <><span>{props.productDetail ? props.unitDesc === 0 ? <CurrencyRupeeIcon fontSize='large' /> : '' : ''}</span> {parseFloat(props.count ? props.count : 0).toLocaleString('en-IN')} <span className='unitDisplay'>{props.productDetail ? props.unitDesc !== 0 ? props.unitDesc : '' : ''}</span></>}
                </div>
                <div className='countDescription'>
                    {props.desc}
                </div>
            </div>
        </div>
    )
}

export default CountCard;
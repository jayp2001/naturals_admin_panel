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
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RedeemIcon from '@mui/icons-material/Redeem';
import CancelIcon from '@mui/icons-material/Cancel';
import DiscountIcon from '@mui/icons-material/Discount';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';

function SimpleCountCard(props) {
    const getImg = (imgname) => {
        switch (imgname) {
            // Original cases
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
            case 'Total Due':
                return <CreditScoreOutlinedIcon fontSize='large' />;
            case 'Total Paid':
                return <PriceCheckOutlinedIcon fontSize='large' />;

            // New customer statistics cases
            case 'Pickup Summary':
                return <StorefrontIcon fontSize='large' />;
            case 'Delivery Summary':
                return <DeliveryDiningIcon fontSize='large' />;
            case 'DineIn Summary':
                return <RestaurantIcon fontSize='large' />;
            case 'Cash Summary':
                return <LocalAtmIcon fontSize='large' />;
            case 'Due Summary':
                return <AccountBalanceWalletIcon fontSize='large' />;
            case 'Online Summary':
                return <CreditCardIcon fontSize='large' />;
            case 'Complimentary Summary':
                return <RedeemIcon fontSize='large' />;
            case 'Cancel Summary':
                return <CancelIcon fontSize='large' />;
            case 'Total Discount':
                return <DiscountIcon fontSize='large' />;
            case 'Visit':
                return <PeopleIcon fontSize='large' />;
            case 'Average Visit Per Month':
                return <CalendarMonthIcon fontSize='large' />;
            case 'Average Business Per Year':
                return <TrendingUpIcon fontSize='large' />;

            default:
                return <AssessmentIcon fontSize='large' />;
        }
    }
    return (
        <div className='countcard flex gap-4'>
            <div className='self-center'>
                <div className={`logoContainer ${props.color === 'blue' ? 'blueCountLogoWrp' : props.color === 'green' ? 'greenCountLogoWrp' : props.color === 'yellow' ? 'yellowCountLogoWrp' : props.color === 'pink' ? 'pinkCountLogoWrp' : props.color === 'black' ? 'blackCountLogoWrp' : props.color === 'orange' ? 'orangeCountLogoWrp' : props.color === 'red' ? 'redCountLogoWrp' : props.color === 'purple' ? 'purpleCountLogoWrp' : props.color === 'teal' ? 'tealCountLogoWrp' : props.color === 'indigo' ? 'indigoCountLogoWrp' : props.color === 'cyan' ? 'cyanCountLogoWrp' : ''}`}>
                    {getImg(props.desc)}
                </div>
            </div>
            <div className='self-center w-full'>
                <div className='countText'>
                    {props.count || 0}
                </div>
                <div className='countDescription'>
                    {props.desc}
                </div>
            </div>
        </div>
    )
}

export default SimpleCountCard;


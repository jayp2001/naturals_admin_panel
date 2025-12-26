import './bankCard.css'
import deliveryBoyLogo from '../../../assets/deliveryBoy.svg'
import bhagwatiLogo from '../../../assets/NATURAL_LOGO.jpg';
import BOB from '../../../assets/bank/BOBBANK.png';
import CentralBank from '../../../assets/bank/CENTRALBANK.png';
import DenaBank from '../../../assets/bank/DENABANK.webp';
import HDFCBank from '../../../assets/bank/HDFCBANK.png';
import ICICIBank from '../../../assets/bank/ICICIBANK.jpg';
import NagrikBank from '../../../assets/bank/NAGRIKBANK.jpg';
import PostBank from '../../../assets/bank/POSTBANK.jpg';
import SBI from '../../../assets/bank/SBIBANK.png';
import Wallet from '../../../assets/bank/piggy-bank.png';
import HomeBank from '../../../assets/bank/HOMEBANK.png';
import OtherBank from '../../../assets/bank/OtherBank.png';
import caterers from '../../../assets/bank/caterers.png';
import school from '../../../assets/bank/school.png';
import spareBalnce from '../../../assets/bank/balanceSheep.png';
import exchange from '../../../assets/bank/exchange.png';

function BankCard(props) {
    const getImg = (imgname) => {
        switch (imgname) {
            case 'BOB':
                return BOB;
            case 'Centrel':
                return CentralBank;
            case 'Dena':
                return DenaBank;
            case 'HDFC':
                return HDFCBank;
            case 'ICICI':
                return ICICIBank;
            case 'Nagrik':
                return NagrikBank;
            case 'POST':
                return PostBank;
            case 'SBI':
                return SBI;
            case 'HomeBank':
                return HomeBank;
            case 'Other':
                return OtherBank;
            case 'caterers':
                return caterers;
            case 'School':
                return school;
            case 'spareBalnce':
                return spareBalnce;
            case 'exchange':
                return exchange;
            case 'Wallet':
                return Wallet;
            default:
                return OtherBank;
        }
    }
    return (
        <div className='CategoryCard' onClick={() => props.goToBank(props.data.bankId)} key={props.data.bankId}>
            <div className='h-3/4 flex w-full'>
                <div className='CategoryLogo flex justify-center'>
                    <img src={getImg(props.imgName)} alt='delivery boy' />
                </div>
                <div className='statacticsDisplayBlock'>
                    <div className='statacticsDisplayHeader'>
                        Available Balance
                    </div>
                    <div className={`statacticsDisplayDisplay ${props.data.availableBalance ? props.data.availableBalance < 0 ? 'redText' : props.data.availableBalance > 0 ? 'greenText' : '' : ''}`} >
                        {parseFloat(props.data.availableBalance).toLocaleString('en-IN')}
                    </div>
                </div>
            </div>
            <div className='consoleName'>
                {props.name}
            </div>
        </div >
    )
}

export default BankCard;


import './consoleCard.css'
import deliveryBoyLogo from '../../../../../assets/deliveryBoy.svg'
import bhagwatiLogo from '../../../../../assets/bhagwatiLogo.png';
import other1 from '../../../../../assets/mainCategory/other1.png';
import other2 from '../../../../../assets/mainCategory/other2.png';
import debt from '../../../../../assets/mainCategory/debt.png';
import caterers from '../../../../../assets/mainCategory/caterers.png';
import employee from '../../../../../assets/mainCategory/employee.png';
import house from '../../../../../assets/mainCategory/house.png';
import inventory from '../../../../../assets/mainCategory/inventory.png';
import mistake from '../../../../../assets/mainCategory/mistake.png';
import renovate from '../../../../../assets/mainCategory/renovate.png';
import restaurant from '../../../../../assets/mainCategory/restaurant.png';
import tag from '../../../../../assets/mainCategory/tag.png';


function ConsoleCard(props) {
    const getImg = (imgname) => {
        switch (imgname) {
            case 'other1':
                return other1;
            case 'other2':
                return other2;
            case 'debt':
                return debt;
            case 'caterers':
                return caterers;
            case 'employee':
                return employee;
            case 'house':
                return house;
            case 'inventory':
                return inventory;
            case 'renovate':
                return renovate;
            case 'mistake':
                return mistake;
            case 'restaurant':
                return restaurant;
            case 'tag':
                return tag;
            default:
                return other1;
        }
    }
    return (
        <div className='consoleCard' onClick={() => props.goToAddUSer()}>
            <div className='consoleLogo flex justify-center'>
                <img src={getImg(props.imgName)} alt='delivery boy' />
            </div>
            <div className='consoleName'>
                {props.name}
            </div>
        </div>
    )
}

export default ConsoleCard;


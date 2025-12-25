import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from 'jwt-decode'
import CryptoJS from 'crypto-js'
function Dashboard() {
    const navigate = useNavigate();
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return (data);
    };
    const user = JSON.parse(localStorage.getItem('userInfo'))
    let location = useLocation();
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />)
    }
    const role = user.userRights ? decryptData(user.userRights) : '';
    const decoded = jwt_decode(user.token);
    const expirationTime = (decoded.exp * 1000) - 60000


    const handleValueChange = (newValue) => {
        setValue(newValue);
    }
    const goToAddUSer = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/addUser')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToUserList = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/userTable')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToHotel = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1) ? true : false
        if (auth) {
            navigate('/hotel/hotelTable')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToExpense = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/expense/dashboard')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToBank = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/bank/dashboard')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToReport = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/businessReport')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToStaff = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/staff/staffList')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToDelivery = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/deliveryManagement/Dashboard')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToTokenView = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/deliveryManagement/tokenView')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToTokenMobileView = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/deliveryManagement/tokenViewForMobile')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToDeliveryMan = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/deliveryManagement/DeliveryMan')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToMenu = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/menu/Dashboard')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToKhata = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/due/account')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToSales = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/menu/salesReport')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToAnalyze = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/category/analyze')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToAddOns = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/menu/addOns')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToAddonGroup = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/menu/addOns')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToComment = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/comment')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToUPI = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/upi')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToFirmList = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/firmList')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToCustomerList = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/customerList')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    const goToProductList = () => {
        navigate('/productList')
    }
    const goToBillCategories = () => {
        const auth = new Date(expirationTime) > new Date() && (role == 1 || role == 2) ? true : false
        if (auth) {
            navigate('/billCategories')
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login')
            }
        }
    }
    return (
        <div className='mainBody'>
            <div className="cardWrp">
                <div className="grid lg:grid-cols-3 mobile:grid-cols-2 tablet1:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 desktop1:grid-cols-6 desktop2:grid-cols-7 desktop2:grid-cols-8' gap-6">

                    <ConsoleCard goToAddUSer={goToMenu} name={"Menu"} imgName={'Menu'} />
                    <ConsoleCard goToAddUSer={goToSales} name={"Sales Report"} imgName={'sales'} />
                    <ConsoleCard goToAddUSer={goToAddOns} name={"Add-Ons"} imgName={'addon'} />
                    <ConsoleCard goToAddUSer={goToAddonGroup} name={"Addon Group"} imgName={'group'} />
                    <ConsoleCard goToAddUSer={goToComment} name={"Comments"} imgName={'comment'} />
                    <ConsoleCard goToAddUSer={goToUPI} name={"UPI"} imgName={'upi'} />
                    <ConsoleCard goToAddUSer={goToFirmList} name={"Firm List"} imgName={'firm'} />
                    <ConsoleCard goToAddUSer={goToCustomerList} name={"Customer List"} imgName={'customer'} />
                    <ConsoleCard goToAddUSer={goToBillCategories} name={"Bill Categories"} imgName={'category'} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
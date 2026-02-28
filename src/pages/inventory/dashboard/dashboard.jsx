import ConsoleCard from "./component/consoleCard/consoleCard";
import './dashboard.css';
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useMemo } from "react";
import jwt_decode from 'jwt-decode';
import CryptoJS from 'crypto-js';

const consoleCards = [
    { name: "Menu", imgName: 'Menu', path: '/menu/Dashboard', roles: [1, 2] },
    { name: "Sales Report", imgName: 'sales', path: '/menu/salesReport', roles: [1] },
    { name: "Comments", imgName: 'comment', path: '/comment', roles: [1, 2] },
    { name: "UPI", imgName: 'upi', path: '/upi', roles: [1] },
    { name: "Firm List", imgName: 'firm', path: '/firmList', roles: [1] },
    { name: "Customer List", imgName: 'customer', path: '/customerList', roles: [1, 2] },
    { name: "Bill Categories", imgName: 'category', path: '/billCategories', roles: [1] },
];

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const decryptData = (text) => {
        const key = process.env.REACT_APP_AES_KEY;
        const bytes = CryptoJS.AES.decrypt(text, key);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    const user = JSON.parse(localStorage.getItem('userInfo'));

    const role = user?.userRights ? Number(decryptData(user.userRights)) : null;
    const decoded = user ? jwt_decode(user.token) : null;
    const expirationTime = decoded ? decoded.exp * 1000 - 60000 : null;

    const allowedCards = useMemo(() => {
        if (!role) return [];
        return consoleCards.filter(
            card => !card.roles?.length || card.roles.includes(role)
        );
    }, [role]);

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const handleNavigation = (path) => {
        const isTokenValid = expirationTime && new Date(expirationTime) > new Date();
        if (isTokenValid) {
            navigate(path);
        } else {
            if (window.confirm("You are not Authorised. You want to Login again ?")) {
                navigate('/login');
            }
        }
    };

    return (
        <div className='mainBody'>
            <div className="cardWrp relative">
                {allowedCards.length > 0 ? (
                    <div className="grid grid-cols-2 min-[640px]:grid-cols-3 min-[768px]:grid-cols-4 min-[1024px]:grid-cols-5 min-[1280px]:grid-cols-6 min-[1536px]:grid-cols-7 min-[1920px]:grid-cols-8 gap-x-4 gap-y-6">
                        {allowedCards.map((card, index) => (
                            <ConsoleCard
                                key={index}
                                goToAddUSer={() => handleNavigation(card.path)}
                                name={card.name}
                                imgName={card.imgName}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-2xl font-bold select-none">
                        You are not Authorised
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;

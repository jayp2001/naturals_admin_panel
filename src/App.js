import logo from './logo.svg';
import './App.css';
import PageNotFoundRedirect from "./pageNotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from './pages/login/login';
import Dashboard from './pages/inventory/dashboard/dashboard';
import ProtectedUserRoutes from './protectedUserRoutes';
import NavBar from './pages/navBar/nav';
import AddUser from './pages/users/addUser/addUser'
import UserTable from './pages/users/userTable/userTable';
import EditUser from './pages/users/editUser/editUser';
import AddSuppiler from './pages/inventory/addSuppiler/addSuppiler';
import SuppilerTable from './pages/inventory/suppilerTable/suppilerTable';
import EditSuppiler from './pages/inventory/editSuppiler/editSuppiler';
import ProductList from './pages/inventory/product/productList';
import CategoriesTable from './pages/inventory/categoriesTable/categoriesTable';
import StockInOut from './pages/inventory/stockManagement/stockInOut';
import TransactionTable from './pages/inventory/transactionTable/transactionTable';
import SuppilerDetail from './pages/inventory/suppilerDetails/suppilerDetail';
import ProductDetails from './pages/inventory/productDetails/productDetails';
import ProductListTable from './pages/inventory/productListTable/productListTable';
import 'react-toastify/dist/ReactToastify.css';
import EditHistory from './pages/inventory/editHistory/editHistory';
import StockOut from './pages/inventory/stockOut/stockOut';
import ProtectedStockManagerRoutes from './protectedStockManageRoutes';
import AddEditStaff from './pages/staffManagement/addStaff/addStaff';
import StaffList from './pages/staffManagement/staffList/staffList';
import StaffCategoryTable from './pages/staffManagement/staffCategoriesTable/staffCategoriesTable';
import EmployeeDetails from './pages/staffManagement/employeeDetail/employDetails';
import ProtectedAdminRoutes from './protectedAdminRoutes';
import AllPayments from './pages/staffManagement/allPayment/allPayment';
import Leaves from './pages/staffManagement/leaves/leaves';
import PrintButton from './testThermal';
import ProductDetailsManager from './pages/inventory/stockOut/productDetailsManager';
import StockOutByCategory from './pages/inventory/categoryDetail/categoryDetail';
import ExpenseDashboard from './pages/expense/dashboard/dashboard';
import SubCategoryTable from './pages/expense/subCategory/subCategory';
import SubCategoryDetail from './pages/expense/subCategoryDetail/subCategoryDetail';
import BankDashboard from './pages/bank/dashboard/dashboard';
import BankDetail from './pages/bank/bankDetail/bankDetail';
import ExpenseTable from './pages/expense/expenseTable/expenseTable';
import ExpenseTableSubCategory from './pages/expense/subCategoryExpenseTable/expenseTable';
import BusinessReport from './pages/businessReport/businessReport';
import HotelTable from './billingPages/hotelTable/hotelTable';
import CommentListTable from './pages/commentData/comment';
import HotelDetails from './billingPages/hotelDetals/hotelDetail';
import DeliveryDashboard from './deliveryManagement/Dashboard/Dashboard';
import SaveAndSettel from './billingPages/saveAndSettel/saveAndSettel';
import TokenView from './biling/TokenView/TokenView';
import TokenViewForMobile from './tokenView/TokenViewForMobile';
import DeliveryMan from './deliveryManagement/DeliveryMan/DeliveryMan';
import DeliveryManDataTable from './deliveryManagement/DelivryManDataTable/DelivryManDataTable';
import MenuDashboard from './menuItemPages/Dashboard/Dashboard';
import AddCategory from './menuItemPages/Category/AddCategory'
import Unit from './menuItemPages/Unit/Unit';
import SubCategory from './menuItemPages/SubCategory/SubCategory';
import MenuCategory from './menuItemPages/MenuCategory/MenuCategory';
import DueAccounts from './biling/dueAccount/dueAccount';
import DueAccountDetail from './biling/dueAccountDetails/dueAccountDetails';
import CategoryBusinessReport from './billingPages/categoryBusinessReport/categoryBusinssReport';
import CategoryAnalyze from './biling/categoryAnalyze/categoryAnalyze';
import AddOns from './menuItemPages/addOns/addOns';
import AssignAddonGroup from './menuItemPages/assignAddonGroup/AssignAddonGroup';
import UPI from './pages/upi/upiDashboard';
import UpiDetailPage from './pages/upi/upiDetailPage';
import Firm from './pages/firm/firmList';
import FirmDetail from './pages/firm/firmDetail';
import CustomerList from './menuItemPages/CustomerList/CustomerList';
import CustomerDetails from './menuItemPages/customerDetailPage/customerDetails';
import BillCategories from './menuItemPages/billCategories/BillCategories';
// import SetPrinter from './setPrinter';
function App() {
  return (
    <div className="">
      <BrowserRouter>
        <NavBar />
        <div className='mainBody'>
          <Routes>
            <Route path="/" element={<ProtectedStockManagerRoutes />}>
              <Route path="/stockOut" element={<StockOut />} />
              <Route path="/stockManager/productDetail/:id/:name/:unit/:remainingQty" element={<ProductDetailsManager />} />
              {/* <Route path='list' exact element={<AgentList />}/> */}
              <Route path='*' element={<PageNotFoundRedirect />} />
            </Route>
            <Route path="/" element={<ProtectedAdminRoutes />}>
              <Route path="/staff/addStaff" element={<AddEditStaff />} />
              <Route path="/staff/staffList" element={<StaffList />} />
              <Route path="/staff/staffCategory" element={<StaffCategoryTable />} />
              <Route path="/staff/allPayments" element={<AllPayments />} />
              <Route path="/staff/leaves" element={<Leaves />} />
              <Route path="/staff/editStaff/:id" element={<AddEditStaff />} />
              <Route path="/staff/employeeDetail/:id" element={<EmployeeDetails />} />
            </Route>
            <Route path="/" element={<ProtectedAdminRoutes />}>
              <Route path="/businessReport" element={<BusinessReport />} />
              <Route path="/expense/dashboard" element={<ExpenseDashboard />} />
              {/* <Route path="/expense/subCategories/:categoryId" element={<SubCategoryTable/>}/> */}
              <Route path="/expense/subCategory/:categoryName/:subCategoryName/expenses/:categoryId/:subCategoryId" element={<ExpenseTableSubCategory />} />
              <Route path="/expense/mainCategory/:categoryName/expenses/:categoryId" element={<ExpenseTable />} />
              <Route path="/expense/mainCategory/:categoryName/:categoryId" element={<SubCategoryTable />} />
              {/* <Route path="/staff/addStaff" element={<AddEditStaff/>}/>
                  <Route path="/staff/staffList" element={<StaffList/>}/>
                  <Route path="/staff/staffCategory" element={<StaffCategoryTable/>}/>
                  <Route path="/staff/allPayments" element={<AllPayments/>}/>
                  <Route path="/staff/leaves" element={<Leaves/>}/>
                  <Route path="/staff/editStaff/:id" element={<AddEditStaff/>}/>
                  <Route path="/staff/employeeDetail/:id" element={<EmployeeDetails/>}/> */}
            </Route>
            <Route path="/" element={<ProtectedAdminRoutes />}>
              <Route path="/bank/dashboard" element={<BankDashboard />} />
              <Route path="/bank/detail/:id" element={<BankDetail />} />
            </Route>
            <Route path="/" element={<ProtectedUserRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addUser" element={<AddUser />} />
              <Route path="/addSuppiler" element={<AddSuppiler />} />
              <Route path="/userTable" element={<UserTable />} />
              <Route path="/productList" element={<ProductList />} />
              <Route path="/productTable" element={<ProductListTable />} />
              <Route path="/stockInOut" element={<StockInOut />} />
              <Route path="/transactionTable" element={<TransactionTable />} />
              <Route path="/suppilerTable" element={<SuppilerTable />} />
              <Route path="/categories" element={<CategoriesTable />} />
              <Route path="/editUser/:id" element={<EditUser />} />
              <Route path="/editHistory/:id" element={<EditHistory />} />
              <Route path="/editSuppiler/:id" element={<EditSuppiler />} />
              <Route path="/suppilerDetails/:id" element={<SuppilerDetail />} />
              <Route path="/stockOutByCategory/:category/:categoryId" element={<StockOutByCategory />} />
              <Route path="/productDetails/:id/:name/:unit/:remainingQty" element={<ProductDetails />} />
              <Route path='/deliveryManagement/Dashboard' element={<DeliveryDashboard />} />
              <Route path='/deliveryManagement/DeliveryMan' element={<DeliveryMan />} />
              <Route path='/deliveryManagement/tokenView' element={<TokenView />} />
              <Route path='/due/account' element={<DueAccounts />} />
              <Route path='/category/analyze' element={<CategoryAnalyze />} />
              <Route path="due/accountDetails/:id" element={<DueAccountDetail />} />
              <Route path='/DeliveryManagement/DeliveryManData/:deliveryManId/:name' element={<DeliveryManDataTable />} />
              <Route path='/deliveryManagement/tokenViewForMobile' element={<TokenViewForMobile />} />
              <Route path="/hotel/hotelTable" element={<HotelTable />} />
              <Route path="/billing/comments" element={<CommentListTable />} />
              <Route path="/hotel/hotelDetails/:id" element={<HotelDetails />} />
              <Route path="/saveAndSettel" element={<SaveAndSettel />} />
              <Route path='/comment' element={<CommentListTable />} />
              <Route path='/upi' element={<UPI />} />
              <Route path='/upi/detail/:onlineId/:holderName' element={<UpiDetailPage />} />
              <Route path='/firmList' element={<Firm />} />
              <Route path="/firmList/firmDetail/:id" element={<FirmDetail />} />
              <Route path='/customerList' element={<CustomerList />} />
              <Route path="/customerList/customerDetail/:id" element={<CustomerDetails />} />
              <Route path='/billCategories' element={<BillCategories />} />
            </Route>
            <Route path='/thermal' exact element={<PrintButton />} />
            {/* <Route path='/setPrinter' exact element={<SetPrinter />}/> */}
            <Route path='/login' exact element={<LoginPage />} />
            <Route path='*' element={<PageNotFoundRedirect />} />
            <Route path='/menu/Dashboard' element={<MenuDashboard />} />
            <Route path='/menu/salesReport' element={<CategoryBusinessReport />} />
            <Route path='/menu/Unit' element={<Unit />} />
            <Route path='/menu/SubCategory' element={<SubCategory />} />
            <Route path='/menu/addOns' element={<AddOns />} />
            <Route path='/menu/assignAddonGroup/:groupId/:groupName' element={<AssignAddonGroup />} />
            <Route path='/menu/MenuCategory' element={<MenuCategory />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

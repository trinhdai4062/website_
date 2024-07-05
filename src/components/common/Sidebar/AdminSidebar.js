import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { AiFillProfile } from "react-icons/ai";
import { MdOutlinePayments } from "react-icons/md";
import { MdDiscount } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";

import { FaCartArrowDown } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { FaBell } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { IoMdLogOut } from "react-icons/io";
import { AdminContext } from '../../../App';

const AdminSidebar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const context = useContext(AdminContext);
    console.log('context',context)

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu)
    }


    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/admin/dashboard">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className='icon'><MdDashboard /></span>
                                Dashboard
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className='icon'><MdOutlineCategory /></span>
                            Category
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/admin/category">Category List</Link></li>
                                <li><Link to="/admin/category/details">Category View</Link></li>
                                <li><Link to="/admin/category/upload">Category Upload</Link></li>
                                <li><Link to="/admin/category/add">Category Add</Link></li>
                            </ul>
                        </div>
                    </li>

                    <li>
                        <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                            <span className='icon'><FaProductHunt /></span>
                            Products
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/admin/products">Product List</Link></li>
                                <li><Link to="/admin/product/details">Product View</Link></li>
                                <li><Link to="/admin/product/upload">Product Upload</Link></li>
                                <li><Link to="/admin/product/add">Product Add</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 3 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                            <span className='icon'><MdDiscount /></span>
                            Disscount
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 3 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/admin/disscount">Discount List</Link></li>
                                <li><Link to="/admin/disscount/details">Discount View</Link></li>
                                <li><Link to="/admin/disscount/upload">Discount Upload</Link></li>
                                <li><Link to="/admin/disscount/add">Discount Add</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 4 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                            <span className='icon'><MdOutlinePayments /></span>
                            Payment
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 4 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/admin/payment">Payment List</Link></li>
                                <li><Link to="/admin/payment/details">Payment View</Link></li>
                                <li><Link to="/admin/payment/upload">Payment Upload</Link></li>
                                <li><Link to="/admin/payment/add">Payment Add</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 5 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                            <span className='icon'><MdOutlinePayments /></span>
                            Order
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 5 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/admin/order">Orders List</Link></li>
                                <li><Link to="/admin/order/details">Orders View</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 6 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                            <span className='icon'><MdOutlinePayments /></span>
                            Messages
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 6 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/admin/message">Messages List</Link></li>
                            </ul>
                        </div>
                    </li>
                    {/* <li>
                        <Link to="/admin/">
                            <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                                <span className='icon'><MdMessage /></span>
                                Messages
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li> */}
                    <li>
                        <Button className={`w-100 ${activeTab === 7 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(7)}>
                            <span className='icon'><AiFillProfile /></span>
                            Profile
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 7 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/admin/profile">Profile List</Link></li>
                                <li><Link to="/admin/profile/details">Profile View</Link></li>
                                <li><Link to="/admin/profile/upload">Profile Upload</Link></li>
                                <li><Link to="/admin/profile/add">Profile Add</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 8 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
                            <span className='icon'><AiFillProfile /></span>
                            Notification
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 8 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="/admin/notification">Notification List</Link></li>
                                <li><Link to="/admin/notification/add">Notification Add</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link to="/admin/">
                            <Button className={`w-100 ${activeTab === 9 ? 'active' : ''}`} onClick={() => isOpenSubmenu(9)}>
                                <span className='icon'><IoIosSettings /></span>
                                Settings
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>


                    {/* <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                                <span className='icon'><MdDashboard /></span>
                                Dashboard
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 7 ? 'active' : ''}`} onClick={() => isOpenSubmenu(7)}>
                                <span className='icon'><FaProductHunt /></span>
                                Products
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 8 ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
                                <span className='icon'><FaCartArrowDown /></span>
                                Orders
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 9 ? 'active' : ''}`} onClick={() => isOpenSubmenu(9)}>
                                <span className='icon'><MdMessage /></span>
                                Messages
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 10 ? 'active' : ''}`} onClick={() => isOpenSubmenu(10)}>
                                <span className='icon'><FaBell /></span>
                                Notifications
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 10 ? 'active' : ''}`} onClick={() => isOpenSubmenu(11)} >
                                <span className='icon'><IoIosSettings /></span>
                                Settings
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li> */}

                </ul>


                <br />

                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        <Button variant="contained"><IoMdLogOut/> Logout</Button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AdminSidebar;
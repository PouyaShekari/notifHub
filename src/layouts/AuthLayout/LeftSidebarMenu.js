import React, { useState } from 'react';
import { Nav, NavItem, NavLink, UncontrolledTooltip, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from "reactstrap";
import classnames from "classnames";
import { connect, useDispatch, useSelector } from "react-redux";

import { setActiveTab, changeLayoutMode } from "../../redux/actions";

//Import Images
import logoLight from "../../assets/images/kashefLogo-light.png"
import logoDark from "../../assets/images/kashefLogo-light.png"
import { createSelector } from 'reselect';
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {APIClient} from "../../helpers/apiClient";
import {clearDB} from "../../helpers/db";


function LeftSidebarMenu(props) {
    const dispatch = useDispatch();
    const api = new APIClient();
    const selectLayoutProperties = createSelector(
        (state) => state.Layout,
        (layout) => ({
          layoutMode: layout.layoutMode,
        })
      );
      
      const { layoutMode } = useSelector(selectLayoutProperties);

    const mode =
        layoutMode === "dark"
            ? "light"
            : "dark";

    const onChangeLayoutMode = (value) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    }
    const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false);

    const toggleMobile = () => setDropdownOpenMobile(!dropdownOpenMobile);

    const toggleTab = tab => {
        props.setActiveTab(tab)
    }

    const activeTab = props.activeTab;

    const navigate = useNavigate();

    const handleLogout = () => {
        toast.success('با موفقیت از سامانه خارج شدید.')
        setTimeout(async ()=>{
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("loginTime");
            localStorage.removeItem("userInfo");
            localStorage.removeItem('activeApp');
            localStorage.removeItem('connectionId');
            await clearDB()
            navigate('/login')
        },2000)
    }

    const sendSampleText = async (e) => {
        e.preventDefault();
        if(localStorage.getItem("activeApp")){
            api.get(`/Message/SendRandomMessage?mobile=${JSON.parse(localStorage.getItem('userInfo')).mobile}&appId=${JSON.parse(localStorage.getItem('activeApp')).applicationId}`).then(() => {
                toast.success("پیام با موفقیت ارسال شد.");
            }).catch(() => {
                toast.error('درگاه ارسال پیام معتبر نمی باشد.')
            })
        }else {
            api.get(`/Message/SendRandomMessage?mobile=${JSON.parse(localStorage.getItem('userInfo')).mobile}`).then(() => {
                toast.success("پیام با موفقیت ارسال شد.");
            }).catch(() => {
                toast.error('درگاه ارسال پیام معتبر نمی باشد.')
            })
        }
    }

    return (
        <React.Fragment>
            <div className="side-menu flex-lg-column me-lg-1">
                {/* LOGO */}
                <div className="navbar-brand-box logo logo-dark">
                    {mode !== 'dark' &&
                        <div className="logo">
                        <span className="logo-sm">
                            <img src={logoDark} alt="logo" height="30"/>
                        </span>
                        </div>
                    }

                    {mode !== 'light' && <div className={'logo'}>
                        <span className="logo-sm">
                            <img src={logoLight} alt="logo" height="30"/>
                        </span>
                    </div>}
                </div>
                {/* end navbar-brand-box  */}

                {/* Start side-menu nav */}
                <div className="flex-lg-column mb-auto mt-lg-3">
                    <Nav className="side-menu-nav nav-pills justify-content-center" role="tablist">
                        <NavItem id="profile">
                            <NavLink id="pills-user-tab" className={classnames({ active: activeTab === 'profile' }) + " mb-2"} onClick={() => { toggleTab('profile'); }}>
                                <i className="ri-user-2-line"></i>
                            </NavLink>
                        </NavItem>
                        <UncontrolledTooltip target="profile" placement="top">
                            پروفایل
                        </UncontrolledTooltip>
                        <NavItem id="Chats">
                            <NavLink id="pills-chat-tab" className={classnames({ active: activeTab === 'chat' }) + " mb-2"} onClick={() => { toggleTab('chat'); }}>
                                <i className="ri-message-3-line"></i>
                            </NavLink>
                        </NavItem>
                        <UncontrolledTooltip target="Chats" placement="top">
                            اطلاع رسانی
                        </UncontrolledTooltip>
                        <NavItem id="sendTest">
                            <NavLink id="sendTest" className={classnames({ active: activeTab === 'sendTest' }) + " mb-2"} onClick={sendSampleText}>
                                <i className="ri-send-plane-line"></i>
                            </NavLink>
                        </NavItem>
                        <UncontrolledTooltip target="sendTest" placement="top">
                            ارسال پیام نمونه
                        </UncontrolledTooltip>
                        <Dropdown nav isOpen={dropdownOpenMobile} toggle={toggleMobile} className="profile-user-dropdown d-inline-block d-lg-none dropup">
                            <DropdownToggle nav>
                                {/*<img src={avatar1} alt="chatvia" className="profile-user rounded-circle" />*/}
                                <i className="ri-settings-2-line"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <DropdownItem onClick={() => onChangeLayoutMode(mode)}>حالت روز / شب <i className="ri-sun-line theme-mode-icon float-end text-muted"></i></DropdownItem>
                                {/*<DropdownItem onClick={() => { toggleTab('settings'); }}>Setting <i className="ri-settings-3-line float-end text-muted"></i></DropdownItem>*/}
                                <DropdownItem divider />
                                <DropdownItem onClick={handleLogout}>خروج<i className="ri-logout-circle-r-line float-end text-muted"></i></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Nav>
                </div>
                {/* end side-menu nav */}

                <div className="flex-lg-column d-none d-lg-block">
                    <Nav className="side-menu-nav justify-content-center">
                        <li className="nav-item">
                            <NavLink id="light-dark" className='mb-2' onClick={() => onChangeLayoutMode(mode)}>
                                <i className="ri-sun-line theme-mode-icon"></i>
                            </NavLink>
                            <UncontrolledTooltip target="light-dark" placement="right">
                                حالت روز / شب
                            </UncontrolledTooltip>
                        </li>
                        <li className="nav-item">
                            <NavLink className={'mb-2'} id={'logout'} onClick={handleLogout}>
                                <i className="ri-logout-circle-r-line text-muted"></i>
                            </NavLink>
                            <UncontrolledTooltip target="logout" placement="right">
                                خروج
                            </UncontrolledTooltip>
                        </li>
                        {/*<Dropdown nav isOpen={dropdownOpen} className="nav-item btn-group dropup profile-user-dropdown" toggle={toggle}>
                            <DropdownToggle className="nav-link mb-2" tag="a">
                                <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                    S
                                </span>
                                <img src={avatar1} alt="" className="profile-user rounded-circle" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => { toggleTab('profile'); }}>پروفایل<i className="ri-profile-line float-end text-muted"></i></DropdownItem>
                                <DropdownItem onClick={() => { toggleTab('settings'); }}>Setting <i className="ri-settings-3-line float-end text-muted"></i></DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem href="/logout">خروج<i className="ri-logout-circle-r-line float-end text-muted"></i></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>*/}
                    </Nav>
                </div>
                {/* Side menu user */}
            </div>
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
        ...state.Layout
    };
};

export default connect(mapStatetoProps, {
    setActiveTab
})(LeftSidebarMenu);
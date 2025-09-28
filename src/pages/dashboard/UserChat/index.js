import React, { useState, useEffect, useRef } from 'react';
import {Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter, Spinner} from "reactstrap";
import { connect } from "react-redux";

import SimpleBar from "simplebar-react";

import withRouter from "../../../components/withRouter";
import { dedupe } from "../../../helpers/deDuplicate";
//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
//actions
import { openUserSidebar, setFullUser } from "../../../redux/actions";
import { saveMessages, getMessagesByApp } from "../../../helpers/db";
//i18n
import { useTranslation } from 'react-i18next';
import { APIClient } from '../../../helpers/apiClient';
import GregorianToJalali from "../../../helpers/ToJalali";

function UserChat(props) {
    const apiClient = new APIClient();
    const ref = useRef();

    const [modal, setModal] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [offlineLoading, setOfflineLoading] = useState(false);

    const isFetching = useRef(false);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();
    const [chatMessages, setchatMessages] = useState([]);

    const loadMoreMessages = async (pageNum , isAfterOnline=false) => {
        setOfflineLoading(false)
        if (isFetching.current || !localStorage.getItem('activeApp')) return;
        isFetching.current = true;
        const prevScrollHeight = ref.current?.getScrollElement().scrollHeight;

        try {
            if(window.navigator.onLine){
                const result = await apiClient.getMessages(JSON.parse(localStorage.getItem('activeApp')).applicationId, 10, pageNum);
                const newMessages = result?.data?.messageList ?? [];
                const total = result.data.page.total ?? 0;
                await saveMessages(JSON.parse(localStorage.getItem('activeApp')).applicationId, [...newMessages]);

                if (pageNum === 1) {
                    setTotalCount(total);  // فقط در بار اول ست کن
                }

                // افزوده شدن پیام‌های جدید به لیست
                setchatMessages(prev =>  dedupe([...newMessages.reverse(), ...prev]));

                // محاسبه تعداد پیام‌های لود شده
                const totalSoFar = chatMessages.length + newMessages.length;

                // بررسی اینکه آیا پیام‌های بیشتری برای لود شدن هست
                setHasMore(totalSoFar < total);

                setPage(pageNum);

                if(!isAfterOnline){
                    // حفظ اسکرول به طور صحیح
                    setTimeout(() => {
                        const scrollEl = ref.current?.getScrollElement();
                        if (scrollEl) {
                            const newScrollHeight = scrollEl.scrollHeight;
                            scrollEl.scrollTop = newScrollHeight - prevScrollHeight;
                        }
                    }, 0);
                }
                if(isAfterOnline){
                    // حفظ اسکرول به طور صحیح
                    setTimeout(() => {
                        const scrollEl = ref.current?.getScrollElement();
                        if (scrollEl) {
                            const newScrollHeight = scrollEl.scrollHeight;
                            scrollEl.scrollTop = newScrollHeight;
                        }
                    }, 0);
                }
            }else {
                const cachedMsgs = await getMessagesByApp(JSON.parse(localStorage.getItem('activeApp')).applicationId);
                if (cachedMsgs.length > 0) {
                    setchatMessages(dedupe(cachedMsgs));
                    if(JSON.parse(localStorage.getItem('activeApp')).unReadCount > 0){
                        setOfflineLoading(true)
                    }
                }else setOfflineLoading(true)
            }
        }finally {
            isFetching.current = false;
        }
    };

    const handleScroll = () => {
        const scrollEl = ref.current?.getScrollElement();
        if (scrollEl && scrollEl.scrollTop < 100 && hasMore) {
            loadMoreMessages(page + 1);
        }
    };

    useEffect(() => {
        if (JSON.parse(localStorage?.getItem('activeApp'))?.unReadCount > 0) {
            if(window.navigator.onLine){
                apiClient.seenPerApplication(JSON.parse(localStorage?.getItem('activeApp'))?.applicationId).then(() => {
                    const unread = document.getElementById("unRead" + JSON.parse(localStorage?.getItem('activeApp'))?.applicationId);
                    if (unread) unread.style.display = "none";
                })

                if (localStorage.getItem('activeApp')) {
                    const temp = JSON.parse(localStorage.getItem("activeApp"));
                    temp.unReadCount = 0;
                    localStorage.setItem("activeApp", JSON.stringify(temp));
                }

            }
        }

        if (localStorage.getItem('activeApp')) {
            // ریست کردن state ها برای کاربر جدید
            setPage(1);
            setTotalCount(0);
            setHasMore(true);
            isFetching.current = false;
            setchatMessages([]);
            loadMoreMessages(1); // لود کردن پیام‌های صفحه اول
        }

        // reset scroll
        setTimeout(() => {
            if (ref.current?.el) {
                const scrollEl = ref.current.getScrollElement();
                scrollEl.scrollTop = scrollEl.scrollHeight;
            }
        }, 200);

    }, [localStorage.getItem("activeApp")]);

    useEffect(() => {
        // فقط اگر پیام جدیدی آمده و برای چت فعلی است، آن را اضافه کن
        if (props?.message && localStorage?.getItem('activeApp') && props?.message.applicationId === JSON.parse(localStorage?.getItem('activeApp'))?.applicationId) {
            setchatMessages(prev => dedupe([...prev, props.message]));

            // اسکرول به پایین
            setTimeout(() => {
                if (ref.current) {
                    const scrollEl = ref.current.getScrollElement();
                    scrollEl.scrollTop = scrollEl.scrollHeight;
                }
            }, 100);

            if(window.navigator.onLine){
                // علامت خوانده شدن پیام را به سرور ارسال کن
                apiClient.seenPerApplication(JSON.parse(localStorage?.getItem('activeApp'))?.applicationId);
            }
        }

        if (props?.message) {
            props.setMessage(null);
        }
    }, [props.message]);


    useEffect(() => {
        const handleOnline = async () => {
            if (localStorage.getItem('activeApp')) {
                apiClient.seenPerApplication(JSON.parse(localStorage.getItem('activeApp')).applicationId).then(() => {
                    const unread = document.getElementById("unRead" + JSON.parse(localStorage.getItem('activeApp')).applicationId);
                    if (unread) unread.style.display = "none";
                })

                const temp = JSON.parse(localStorage.getItem("activeApp"));
                temp.unReadCount = 0;
                localStorage.setItem("activeApp", JSON.stringify(temp));
                // ریست کردن state ها برای کاربر جدید
                setPage(1);
                setTotalCount(0);
                setHasMore(true);
                isFetching.current = false;
                setchatMessages([]);
                loadMoreMessages(1); // لود کردن پیام‌های صفحه اول

                // reset scroll
                setTimeout(() => {
                    if (ref.current?.el) {
                        const scrollEl = ref.current.getScrollElement();
                        scrollEl.scrollTop = scrollEl.scrollHeight;
                    }
                }, 200);
            }
        };

        window.addEventListener('online', handleOnline);
        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    function formatText(text) {
        if (!text) return '';

        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                const url = part.startsWith("http") ? part : `https://${part}`;

                return (
                    <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="specialLinkText"
                    >
                        {part}
                    </a>
                );
            }
            return part.split("\n").map((line, i) => (
                <React.Fragment key={`${index}-${i}`}>
                {line}
                    {i < part.split("\n").length - 1 && <br />}
                </React.Fragment>
            ));
        });
    }


    const toggle = () => setModal(!modal);

    return (
        <React.Fragment>
            <div className={`user-chat w-100 overflow-hidden ${localStorage.getItem('layoutMode') === 'dark' ? 'user-chat-dark' : ''}`}>
                {!localStorage.getItem("activeApp") &&
                    <div style={{height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <div>لطفا یک درگاه اطلاع رسانی را جهت نمایش پیام ها انتخاب کنید.</div>
                    </div>
                }
                <div className="d-lg-flex">

                    <div className={props.userSidebar ? "w-70 overflow-hidden position-relative" : "w-100 overflow-hidden position-relative"}>

                        {/* render user head */}
                        {localStorage.getItem('activeApp') && <UserHead />}

                        <SimpleBar
                            style={{ maxHeight: "100%" }}
                            ref={ref}
                            className="chat-conversation p-4 p-lg-4"
                            id="messages"
                            onScrollCapture={handleScroll}>
                            {localStorage.getItem('activeApp') &&
                                <>
                                    <ul className="list-unstyled mb-0">
                                        {
                                            chatMessages.map((chat, key) =>
                                                <li key={chat.applicationId + '-' + chat.id}>
                                                    <div className="conversation-list">
                                                        {
                                                            <div className="chat-avatar">
                                                                {
                                                                    <div className="chat-user-img align-self-center me-3">
                                                                        <div className="avatar-xs">
                                                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                                            {JSON.parse(localStorage.getItem('activeApp')).applicationTitle.charAt(0)}
                                                                        </span>
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        }

                                                        <div className="user-chat-content">
                                                            <div className="ctext-wrap">
                                                                <div className="ctext-wrap-content">
                                                                    {
                                                                        chat.text && <p className="mb-0">{formatText(chat.text)}</p>
                                                                        /*<p className="mb-0">
                                                                            {chat.text}
                                                                        </p>*/
                                                                    }
                                                                    {
                                                                        <p className="chat-time mb-0"><div className='d-flex align-items-center gap-1'>
                                                                            <span className="align-middle"><GregorianToJalali isoDate={chat.insertDate} /></span>
                                                                            <span><i className="ri-time-line align-middle"></i> </span>
                                                                        </div></p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                    {offlineLoading && <div className={'w-100 h-100 d-flex align-items-center justify-content-center'}>
                                        <Spinner color="primary"></Spinner>
                                    </div>}
                                </>
                            }
                        </SimpleBar>

                        <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
                            <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
                            <ModalBody>
                                <CardBody className="p-2">
                                    <SimpleBar style={{ maxHeight: "200px" }}>
                                        <SelectContact handleCheck={() => { }} />
                                    </SimpleBar>
                                    <ModalFooter className="border-0">
                                        <Button color="primary">Forward</Button>
                                    </ModalFooter>
                                </CardBody>
                            </ModalBody>
                        </Modal>
                    </div>

                    {localStorage.getItem('activeApp') && <UserProfileSidebar activeUser={JSON.parse(localStorage.getItem('activeApp'))} />}

                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    const { userSidebar } = state.Layout;
    return { active_user, userSidebar };
};

export default withRouter(connect(mapStateToProps, { openUserSidebar, setFullUser })(UserChat));
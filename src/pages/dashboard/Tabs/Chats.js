import React, {useState, useEffect, useCallback, useRef} from 'react';
import { Input, InputGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SimpleBar from "simplebar-react";
import { saveChats, getChats } from "../../../helpers/db";
import { setconversationNameInOpenChat, activeUser } from "../../../redux/actions";
import { APIClient } from '../../../helpers/apiClient';
import GregorianToJalali from "../../../helpers/ToJalali";

const Chats = (props) => {
    const activeChatRef = useRef(null);
    const [searchChat, setSearchChat] = useState('');
    const [recentChatList, setRecentChatList] = useState([]);
    const [mainChatList, setMainChatList] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const apiClient = new APIClient();

    useEffect(() => {
        if (props?.message) {
            setMainChatList(prevList => {
                const updatedList = [...prevList];
                const chatIndex = updatedList.findIndex(chat => chat.applicationId === props.message.applicationId);

                if (chatIndex !== -1) {
                    const updatedChat = {
                        ...updatedList[chatIndex],
                        text: props.message.text,
                        insertDate: props.message.insertDate,
                        unReadCount:
                            props.message.applicationId === activeChatRef.current
                                ? 0
                                : (updatedList[chatIndex].unReadCount + 1),
                    };

                    updatedList.splice(chatIndex, 1);
                    updatedList.unshift(updatedChat);
                } else {
                    updatedList.unshift({
                        applicationId: props.message.applicationId,
                        applicationTitle: props.message?.applicationTitle || "گفتگوی جدید",
                        text: props.message.text,
                        insertDate: props.message.insertDate,
                        unReadCount: props.message.applicationId === activeChatRef.current ? 0 : 1,
                    });
                }

                return updatedList;
            });

            props.setMessage(null);
        }
    }, [props.message]);

    useEffect(() => {
        if (props.shouldRefetch !== null && props.shouldRefetch !== undefined) {
            console.log(props.shouldRefetch);
            setMainChatList(prevList => {
                const updatedList = [...prevList];
                const chatIndex = updatedList.findIndex(
                    chat => chat.applicationId === props.shouldRefetch
                );

                if (chatIndex !== -1) {
                    updatedList[chatIndex] = {
                        ...updatedList[chatIndex],
                        unReadCount: 0
                    };
                }

                return updatedList;
            });

            props.setShouldRefetch(null);
        }
    }, [props.shouldRefetch]);


    const fetchChatList = useCallback(async () => {
        try {
            if(window.navigator.onLine){
                const response = await apiClient.getPreviewMessages();
                const { data } = response;
                setRecentChatList(data);
                setMainChatList(data);
                await saveChats(data)
            }else{
                const cachedChats = await getChats();
                if (cachedChats.length > 0) {
                    setRecentChatList(cachedChats);
                    setMainChatList(cachedChats);
                }
            }
        } catch (error) {

        }
    }, []);

    useEffect(() => {
        const handleOnline = () => {
            fetchChatList();
        };

        window.addEventListener('online', handleOnline);
        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);


    const [isFirstRender,setIsFirstRender] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('activeApp') && mainChatList?.length > 0 && isFirstRender) {
            const res = mainChatList.find(item => item?.applicationId === JSON.parse(localStorage?.getItem('activeApp'))?.applicationId);
            if (res) {
                openUserChat(null, res);
            } else {
                localStorage.removeItem('activeApp');
            }
        }
    }, [mainChatList]);

    const syncOfflineData = async () => {
        await saveChats(mainChatList);
    }

    useEffect(() => {
        if(mainChatList?.length > 0) {
            syncOfflineData()
        }
    }, [JSON.stringify(mainChatList)]);

    useEffect(() => {
        fetchChatList();
    }, [fetchChatList]);

    useEffect(() => {
        if (searchChat === "") {
            setRecentChatList(mainChatList);
        } else {
            const filteredArray = mainChatList.filter(chat =>
                chat.applicationTitle.toLowerCase().includes(searchChat.toLowerCase())
            );
            setRecentChatList(filteredArray);
        }
    }, [mainChatList , searchChat]);

    const handleChange = (e) => {
        const search = e.target.value.toLowerCase();
        setSearchChat(e.target.value);

        if (search === "") {
            setRecentChatList(mainChatList);
            return;
        }

        const filteredArray = mainChatList.filter(chat =>
            chat.applicationTitle.toLowerCase().includes(search)
        );

        setRecentChatList(filteredArray);
    };

    const openUserChat = async (e, chat) => {
        if (e) e.preventDefault();
        props.activeUser(chat);
        localStorage.setItem("activeApp", JSON.stringify(chat));
        setActiveChat(chat.applicationId);
        activeChatRef.current = chat.applicationId;
        var userChat = document.getElementsByClassName("user-chat");
        if (userChat) {
            userChat[0].classList.add("user-chat-show");
        }
        if(!isFirstRender){
            if(window.navigator.onLine){
                setMainChatList(prevList => {
                    return prevList.map(chatItem =>
                        chatItem.applicationId === chat.applicationId
                            ? { ...chatItem, unReadCount: 0 }
                            : chatItem
                    );
                });
            }
        }else setIsFirstRender(false);

    };

    useEffect(()=>{
        if(localStorage.getItem('activeApp')){
            setActiveChat(JSON.parse(localStorage.getItem('activeApp')).applicationId);
        }else {
            activeChatRef.current = null;
            setActiveChat(null)
        }
    },[localStorage.getItem('activeApp')]);

    return (
        <React.Fragment>
            <div>
                <div className="px-4 pt-4">
                    <h4 className="mb-4">پیام ها</h4>
                    <div className="search-box chat-search-box">
                        <InputGroup className="mb-5 rounded-3">
                            <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                                <i className="ri-search-line search-icon font-size-18"></i>
                            </span>
                            <Input
                                type="text"
                                value={searchChat}
                                onChange={handleChange}
                                className="form-control bg-light"
                                placeholder="جستجو ..."
                            />
                        </InputGroup>
                    </div>
                </div>

                <div>
                    <h5 className="mb-3 px-3 font-size-16">موارد اخیر</h5>
                    <SimpleBar className="chat-message-list">
                        <ul className="list-unstyled chat-list chat-user-list px-2" id="chat-list">
                            {
                                recentChatList && recentChatList.map((chat) =>
                                    <li key={chat.applicationId} id={"conversation" + chat.applicationId} className={chat.applicationId === activeChat ? "active" : ""}>
                                        <Link to="#" onClick={(e) => openUserChat(e, chat)}>
                                            <div className="d-flex">
                                                <div className={"chat-user-img " + chat.status + " align-self-center ms-0"}>
                                                    <div className="avatar-xs">
                                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                                            {chat.applicationTitle.charAt(0)}
                                                        </span>
                                                    </div>
                                                    {chat.status && <span className="user-status"></span>}
                                                </div>

                                                <div className="flex-grow-1 overflow-hidden">
                                                    <h5 className="text-truncate font-size-15 mb-1 ms-3">{chat.applicationTitle}</h5>
                                                    <p className="chat-user-message font-size-14 text-truncate mb-0 ms-3">
                                                        {chat.text}
                                                    </p>
                                                </div>

                                                <div className="font-size-11">
                                                    <GregorianToJalali isoDate={chat.insertDate} />
                                                </div>

                                                {chat.unReadCount === 0 ? null : (
                                                    <div className="unread-message" id={"unRead" + chat.applicationId}>
                                                        <span className="badge badge-soft-danger rounded-pill">
                                                            {chat.unReadCount >= 20 ? "20+" : chat.unReadCount}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                )
                            }
                        </ul>
                    </SimpleBar>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    return { active_user };
};

export default connect(mapStateToProps, { setconversationNameInOpenChat, activeUser })(Chats);
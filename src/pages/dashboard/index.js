import React, {useEffect, useState} from 'react';
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/index";

import { useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import config from "../../config";

const Index = () => {
    useEffect(() => {
        document.title = "درگاه اطلاع رسانی کاشف";
    }, []);

    const users = useSelector(state => state.Chat.users);

    const [message, setMessage] = useState(null);
    const [shouldRefetch, setShouldRefetch] = useState(null);
    const [chatListMessage, setChatListMessage] = useState(null);


    useEffect(() => {
        let connection = null;        // نگهداری اتصال فعلی
        let starting = false;         // جلوگیری از استارت‌های همزمان
        let manuallyStopped = false;  // تشخیص قطع دستی برای جلوگیری از تلاش مجدد

        const buildUrl = () => {
            const token = localStorage.getItem('accessToken');
            return `${config.API_URL.split('/api')[0]}/messagehub?token=${token}`;
        };

        // ثبت لیسنرها فقط روی اتصال موجود
        const setupListeners = () => {
            if (!connection) return;
            connection.off("ReceiveMessage");
            connection.off("SeenMessages");
            connection.on("ReceiveMessage", (message) => {
                setMessage(message);
                setChatListMessage(message);
            });
            connection.on("SeenMessages", (message) => {
                setShouldRefetch(message);
            });
        };

        // شروع اتصال فقط وقتی توکن داریم
        const start = async () => {
            if (starting || connection) return;           // قبلاً شروع شده یا وصله
            const token = localStorage.getItem('accessToken');
            if (!token) return;                           // بدون توکن وصل نشو

            starting = true;
            manuallyStopped = false;

            connection = new signalR.HubConnectionBuilder()
                .withUrl(buildUrl())
                .withAutomaticReconnect()
                .build();

            // اگر در حین reconnect توکن نداشتیم، تلاش‌ها را قطع کن
            connection.onreconnecting(() => {
                if (!localStorage.getItem('accessToken')) {
                    manuallyStopped = true;
                    connection.stop();
                    localStorage.removeItem('connectionId');
                }
            });

            // بعد از وصل‌شدن مجدد، لیسنرها را ثبت کن
            connection.onreconnected(() => {
                localStorage.setItem('connectionId', connection.connectionId);
                setupListeners();
            });

            // اگر اتصال بسته شد، فقط وقتی توکن داریم دوباره تلاش کن
            connection.onclose(() => {
                localStorage.removeItem('connectionId');
                if (!manuallyStopped && localStorage.getItem('accessToken')) {
                    connection = null;
                    setTimeout(() => start(), 3000);
                }
            });

            try {
                await connection.start();
                localStorage.setItem('connectionId',connection.connectionId)

                setupListeners();
            } catch (err) {
                //console.error("❌ SignalR Start Error:", err);
                connection = null;
                if (!manuallyStopped && localStorage.getItem('accessToken')) {
                    setTimeout(() => start(), 5000);
                }
            } finally {
                starting = false;
            }
        };

        const stop = () => {
            if (connection) {
                manuallyStopped = true;
                connection.stop();
                connection = null;
                localStorage.removeItem('connectionId');
            }
        };

        // شروع اولیه اگر توکن هست
        start();

        // تغییرات localStorage در تب‌های دیگر
        const onStorage = (e) => {
            if (e.key === 'accessToken') {
                if (e.newValue) {
                    // لاگین در تب دیگر
                    if (!connection && !starting) start();
                } else {
                    // لاگ‌اوت در هر تب → قطع اتصال
                    stop();
                }
            }
        };
        window.addEventListener('storage', onStorage);

        // پایش سبک برای همین تب (چون رویداد storage در همان تب فایر نمی‌شود)
        const tokenWatch = setInterval(() => {
            const hasToken = !!localStorage.getItem('accessToken');
            if (!hasToken && connection) stop();          // توکن حذف شد → قطع
            if (hasToken && !connection && !starting) start(); // توکن اضافه شد → وصل
        }, 2000);

        // پاک‌سازی
        return () => {
            window.removeEventListener('storage', onStorage);
            clearInterval(tokenWatch);
            stop();
        };
    }, []);


    /*useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${config.API_URL.split('/api')[0]}/messagehub?token=${localStorage.getItem('accessToken')}`)
            .withAutomaticReconnect() // فعال کردن reconnect خودکار
            .build();

        // تابع ثبت رویدادها
        const setupListeners = () => {
            connection.off("ReceiveMessage"); // جلوگیری از ثبت تکراری
            connection.on("ReceiveMessage", (message) => {
                setMessage(message);
                setChatListMessage(message);
            });
        };

        // تابع اتصال با تلاش مجدد در صورت خطا
        const startConnection = async () => {
            try {
                await connection.start();
                setupListeners();
            } catch (err) {
                setTimeout(startConnection, 5000); // تلاش مجدد بعد از ۵ ثانیه
            }
        };

        startConnection();

        // رویدادهای مربوط به reconnect
        connection.onreconnecting((error) => {
        });

        connection.onreconnected((connectionId) => {
            setupListeners(); // ثبت دوباره رویدادها
        });

        connection.onclose((error) => {
        });

        // پاک‌سازی هنگام unmount
        return () => {
            connection.stop();
        };
    }, []);*/


    return (
        <React.Fragment>
            <ChatLeftSidebar message={chatListMessage} recentChatList={users} setMessage={setChatListMessage} setShouldRefetch={setShouldRefetch} shouldRefetch={shouldRefetch} />
            <UserChat message={message} recentChatList={users} setMessage={setMessage} />
        </React.Fragment>
    );
};

export default Index;


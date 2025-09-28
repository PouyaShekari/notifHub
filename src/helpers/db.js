// src/helpers/db.js
import { openDB } from 'idb';

const DB_NAME = 'chat-db';
const DB_VERSION = 5;

export const initDB = () =>
    openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('chats')) {
                const chatStore = db.createObjectStore('chats', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('messages')) {
                const msgStore = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
                msgStore.createIndex('applicationId', 'applicationId');
            }
        }
    });

export const saveChats = async (chatList) => {
    const db = await initDB();
    const tx = db.transaction('chats', 'readwrite');
    const store = tx.objectStore('chats');

    await store.clear();

    let index = 0;
    for (const chat of chatList.slice(0, 100)) {
        await store.put({ ...chat, __order: index++ });
    }

    await tx.done;

    const saved = await getChats();
    // مرتب‌سازی براساس __order
    saved.sort((a, b) => a.__order - b.__order);
};



export const getChats = async () => {
    const db = await initDB();
    const result = await db.getAll('chats');
    return result.sort((a, b) => a.__order - b.__order);
};


export const clearDB = async () => {
    const db = await initDB();
    await db.clear('chats');
    await db.clear('messages');
};

export const saveMessages = async (appId, messages) => {
    const db = await initDB();
    const tx = db.transaction('messages', 'readwrite');
    const store = tx.objectStore('messages');

    let index = 0;
    for (const msg of messages.slice(-10)) {
        await store.put({ ...msg, applicationId: appId, __order: index++ });
    }

    await tx.done;
};


export const getMessagesByApp = async (appId) => {
    const db = await initDB();
    const index = db.transaction('messages').objectStore('messages').index('applicationId');
    const messages = await index.getAll(IDBKeyRange.only(appId));
    return messages.sort((a, b) => b.__order - a.__order); // ✅ ترتیب صحیح
};


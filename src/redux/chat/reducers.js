import {
    CHAT_USER, ACTIVE_USER,FULL_USER, ADD_LOGGED_USER, CREATE_GROUP
} from './constants';


//Import Images
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import img6 from "../../assets/images/small/img-6.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img7 from "../../assets/images/small/img-7.jpg";

const INIT_STATE = {
	active_user :  null,
    users: [
        //admin is sender and user in receiver
        { id : 0, name : "ساتا", profilePicture : "Null", status : "online", unRead : 0, roomType : "contact", isGroup: false,
            messages: [
                { id: 1, message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است", time: "01:05", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 2, message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد", time: "10.00", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 3, message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است", time: "01:05", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 4, message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ", time: "01:06", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id : 33, isToday : true },
                { id: 5, message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.", time: "01:06", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 6, message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ", time: "09:05", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 7, message: "Image", time: "10:30", userType: "receiver", isImageMessage : true, isFileMessage : false, imageMessage : [ { image : img4 }, { image : img7 } ] },
                { id: 8, message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است", time: "10:31", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 9, message: "لورم ایپسوم متن ساختگی", time: "02:50 PM", userType: "receiver", isImageMessage : false, isFileMessage : false },
        ] },

        { id : 13, name : "سرابان", profilePicture : "Null", unRead : 0, isGroup: false,
            messages: [
                { id : 33, isToday : true },
                { id : 1,  message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ", time: "12:00", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id : 2,  message: "Images", time: "12:05", userType: "receiver", isImageMessage : true, isFileMessage : false, imageMessage : [ { image : img6 } ] },
                { id : 3,  message: "لورم ایپسوم متن ساختگی", time: "2:05", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id : 4,  message: "لورم ایپسوم", time: "2:06 min", userType: "receiver", isImageMessage : false, isFileMessage : false },
            ]  },

        { id : 4, name : "سرآمد", profilePicture : "Null", status : "online",unRead : "02", isGroup: false, isTyping : true,
            messages: [
                { id : 1,   message: "لورم ایپسوم متن ساختگی", time: "10:00", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id : 2,   message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ", time: "10:02", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id : 33, isToday : true },
                { id: 3, message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.", time: "10:05", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 4, message: "لورم ایپسوم متن ساختگی با تولید سادگی", time: "10:05", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 5, message: "لورم ایپسوم متن", time: "10:06", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 6, message: "Images", time: "10:30", userType: "receiver", isImageMessage : true, isFileMessage : false, imageMessage : [ { image : img1 }, { image : img2 } ] },
                { id: 7, message: "Files", time: "01:30", userType: "receiver", isImageMessage : false, isFileMessage : true, fileMessage: "admin_v1.0.zip", size : "12.5 MB" },
                { id: 8, message: "", time: "10:05 PM", userType: "receiver", isImageMessage : false, isFileMessage : false, isTyping : true },
            ]  },
        { id : 5, name : "رادار", profilePicture : "Null",unRead : 0,  isGroup: false,
            messages: [
                { id : 1,  message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ", time: "12:00", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id : 33, isToday : true },
                { id : 2,   message: "Images", time: "12:05", userType: "receiver", isImageMessage : true, isFileMessage : false, imageMessage : [ { image : img6 } ] },
                { id : 3,   message: "Images", time: "01:30", userType: "receiver", isImageMessage : false, isFileMessage : true, fileMessage: "Minible-Vertical.zip" },
                { id : 4,  message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ", time: "01:31", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id : 5,   message: "لورم ایپسوم متن ساختگی با تولید سادگی", time: "2:00", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id : 6,   message: "با تولید سادگی نامفهوم از صنعت چاپ", time: "2:05", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id : 9,   message: "لورم ایپسوم نامفهوم از صنعت چاپ", time: "2:10 min", userType: "receiver", isImageMessage : false, isFileMessage : false },
            ]  },

        { id : 8, name : "رسا", profilePicture : "Null", status : "online", unRead : 0,  isGroup: false,
            messages: [
                { id : 33, isToday : true },
                { id: 1, message: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ", time: "09:05", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 2, message: "Image", time: "10:30", userType: "receiver", isImageMessage : true, isFileMessage : false, imageMessage : [ { image : img4 }, { image : img7 } ] },
                { id: 3, message: "لورم ایپسوم متن ساختگی از صنعت چاپ", time: "10:31", userType: "receiver", isImageMessage : false, isFileMessage : false },
                { id: 4, message: "لورم ایپسوم متن", time: "02:50 min", userType: "receiver", isImageMessage : false, isFileMessage : false },
            ]  },
    ],
    groups : [
        { gourpId : 1, name : "#General", profilePicture : "Null", isGroup : true, unRead : 0, desc : "General Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 2, name : "#Reporting", profilePicture : "Null", isGroup : true, unRead : 23,  desc : "reporing Group here...",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 3, name : "#Designer", profilePicture : "Null", isGroup : true, unRead : 0, isNew : true, desc : "designers Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 4, name : "#Developers", profilePicture : "Null", isGroup : true, unRead : 0,  desc : "developers Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 5, name : "#Project-aplha", profilePicture : "Null", isGroup : true, unRead : 0, isNew : true, desc : "project related Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
        { gourpId : 6, name : "#Snacks", profilePicture : "Null", isGroup : true, unRead : 0,  desc : "snacks Group",
            members : [
                { userId : 1, name : "Sara Muller", profilePicture : "Null", role : null },
                { userId : 2, name : "Ossie Wilson", profilePicture : avatar8, role : "admin" },
                { userId : 3, name : "Jonathan Miller", profilePicture : "Null", role : null },
                { userId : 4, name : "Paul Haynes", profilePicture : avatar7, role : null },
                { userId : 5, name : "Yana sha", profilePicture : avatar3, role : null },
                { userId : 6, name : "Steve Walker", profilePicture : avatar6, role : null },
            ]    
        },
    ],
    contacts : [
        { id : 1, name : "Albert Rodarte" },
        { id : 2, name : "Allison Etter" },
        { id : 3, name : "Craig Smiley" },
        { id : 4, name : "Daniel Clay" },
        { id : 5, name : "Doris Brown" },
        { id : 6, name : "Iris Wells" },
        { id : 7, name : "Juan Flakes" },
        { id : 8, name : "John Hall" },
        { id : 9, name : "Joy Southern" },
        { id : 10, name : "Mary Farmer" },
        { id : 11, name : "Mark Messer" },
        { id : 12, name : "Michael Hinton" },
        { id : 13, name : "Ossie Wilson" },
        { id : 14, name : "Phillis Griffin" },
        { id : 15, name : "Paul Haynes" },
        { id : 16, name : "Rocky Jackson" },
        { id : 17, name : "Sara Muller" },
        { id : 18, name : "Simon Velez" },
        { id : 19, name : "Steve Walker" },
        { id : 20, name : "Hanah Mile" },
    ]
};

const Chat = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CHAT_USER:
            return { ...state };

        case ACTIVE_USER:
            return { 
            	...state,
                active_user : action.payload };
                
        case FULL_USER:
            return { 
            	...state,
                users : action.payload };

        case ADD_LOGGED_USER:
            const newUser =  action.payload
            return{
                ...state, users : [
                    ...state.users, newUser
                ]
            };

        case CREATE_GROUP :
            const newGroup =  action.payload
            return {
                ...state, groups : [
                    ...state.groups, newGroup
                ]
            }
            
    default: return { ...state };
    }
}

export default Chat;
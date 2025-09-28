import {toJalaali} from "jalaali-js";
import React from "react";

const GregorianToJalali = ({ isoDate }) => {
    const date = new Date(isoDate);
    const jDate = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());

    return (
        <div className="d-flex align-items-center gap-2">
            <span>{(date.getHours() > 9 ? date.getHours() : ('0' + date.getHours())) + ':' + (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes()))}</span>
            <span>{jDate.jy}/{jDate.jm}/{jDate.jd}</span>
        </div>
    );
};

export default GregorianToJalali;
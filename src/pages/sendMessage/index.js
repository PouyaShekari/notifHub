import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import React, {useState} from "react";
import { APIClient } from '../../helpers/apiClient'
import toast from "react-hot-toast";

const SendMessage = () => {
    const [text , setText] = useState("");
    const [appName , setAppName] = useState("");
    const [isSubmitting , setSubmitting] = useState(false);

    const api = new APIClient();

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if(text.trim().length > 0 && appName.length > 0){
            api.create('/Message/Add',JSON.stringify({
                "text": text,
                "appKey": appName,
                "sendDate": null,
                "mobile": JSON.parse(localStorage.getItem("userInfo")).mobile,
            })).then(() => {
                toast.success("پیام با موفقیت ارسال شد.");
            }).catch(() => {
                toast.error('درگاه ارسال پیام معتبر نمی باشد.')
            })
        }else {
            toast.error('وارد کردن متن و درگاه پیام الزامی است.')
        }
        setSubmitting(false);
    }

    return(
        <div className="w-100 d-flex flex-column align-items-center justify-content-center" style={{height:'90vh'}}>
            <div className="modal-header mb-5">
                <h5 className="modal-title">ارسال پیام</h5>
            </div>
            <Form onSubmit={handlePasswordUpdate} className="w-50 d-flex flex-column gap-3">
                <div>
                    <FormGroup>
                        <Label for="text">متن پیام</Label>
                        <Input style={{border:'1px solid'}}
                            type="text"
                            id="text"
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);

                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="appName">ارسال از طریق درگاه</Label>
                        <Input style={{border:'1px solid'}}
                            type="text"
                            id="appName"
                            value={appName}
                            onChange={(e) => {
                                setAppName(e.target.value);
                            }}
                        />
                    </FormGroup>
                </div>
                <div>
                    <Button color="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'در حال ارسال...' : 'ارسال'}
                    </Button>
                </div>
            </Form>
        </div>
    )
}
export default SendMessage
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {Link, Navigate, useNavigate} from 'react-router-dom';

//Import formik validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Alert,
    Form,
    Input,
    Button,
    FormFeedback,
    Label,
    InputGroup,
    ModalHeader, ModalBody, Modal
} from 'reactstrap';

//Import actions and helpers
import { forgetPassword, apiError } from '../../redux/actions';

//i18n
import { useTranslation } from 'react-i18next';

//Import Images
import logolight from "../../assets/images/kashefLogo-light.png";
import logoDark from "../../assets/images/kashefLogo-dark.svg";
import toast from "react-hot-toast";
import {APIClient} from "../../helpers/apiClient";


const ForgetPassword = (props) => {
    const api = new APIClient();
    const [showOTPModal, setShowOTPModal] = React.useState(false);
    const clearError = () => {
        props.apiError("");
    }

    const [otpCode, setOtpCode] = React.useState("");
    const [editedData, setEditedData] = React.useState(null);
    const [showNewPass , setShowNewPass] = React.useState(false);
    const [showReNewPass , setShowReNewPass] = React.useState(false);
    const { t } = useTranslation();

    const navigate = useNavigate()

    useEffect(clearError);

    // validation
    const formik = useFormik({
        initialValues: {
            mobile: '',
            password: "",
            repassword: "",
        },
        validationSchema: Yup.object({
            mobile: Yup.string()
                .matches(/^(?:(?:\+98|98|0)?9\d{9})$/, "لطفا شماره موبایل  را به طور صحیح وارد کنید.")
                .required("لطفا شماره موبایل خود را وارد کنید."),
            password: Yup.string().required("لطفا رمزعبور خود را وارد کنید.").min(8, 'رمزعبور باید حداقل شامل 8 کاراکتر باشد.')
                .matches(
                    /[A-Za-z]/,
                    'رمزعبور باید حداقل شامل یک حرف انگلیسی باشد.'
                )
                .matches(
                    /[0-9]/,
                    'رمزعبور باید حداقل شامل یک عدد باشد.'
                )
                .matches(
                    /[!@#$%^&*(),.?":{}|<>]/,
                    'رمزعبور باید حداقل شامل یک کاراکتر خاص باشد.'
                ),
            repassword: Yup.string().required("لطفا تکرار رمزعبور خود را وارد کنید.").test('repeat','تکرار رمزعبور مطابق با رمزعبور نیست.',val=>val === formik.values.password),

        }),
        onSubmit: values => {
            if(window.navigator.onLine){
                setEditedData(values)
                api.create(`/account/SendOtpSms?mobile=${values.mobile}`, {}).then(() => {
                    toast.success("کد تایید ارسال شد");
                    setShowOTPModal(true);
                })
                    .catch(error => {
                        toast.error(error || "ارسال کد با خطا مواجه شد");
                    });
            }else {
                toast.error('شما آفلاین هستید.')
            }
        },
    });


    const handleOTPSubmit = () => {
        if (!otpCode || otpCode.length !== 6 || isNaN(+otpCode)) {
            toast.error("کد تایید باید ۶ رقم باشد.");
            return;
        }

        // Verify OTP - adjust this based on your API requirements
        const verifyPayload = {
            mobile: editedData.mobile,
            password: editedData.password,
            rePassword: editedData.repassword,
            otp: otpCode
        };

        // If you have a separate OTP verification endpoint
        api.create('/account/ForgotPassword', verifyPayload)
            .then(response => {
                toast.success("رمزعبور شما با موفقیت بازنشانی شد");
                setTimeout(() => navigate("/login"), 2000);
            })
            .catch(error => {
                toast.error(error || "تایید کد با خطا مواجه شد");
            })

    };

    if (localStorage.getItem("accessToken")) {
        return <Navigate to="/" />;
    }

    document.title = "بازنشانی رمزعبور"


    return (
        <React.Fragment>
            <div className="account-pages my-3 my-sm-0 pt-sm-5 overflow-x-hidden" style={{height:'100vh'}}>
                <Container style={{height:'100%'}}>
                    <Row className="justify-content-center" style={{height:'100%'}}>
                        <Col md={8} lg={6} xl={5} style={{margin: 'auto 0'}}>
                            <div className="text-center mb-4">
                                <div className="auth-logo mb-3 d-block">
                                    <div className={"logo logo-dark gap-2"}><img className={'mx-1'} src={logolight} alt="" height="80" /></div>
                                    <div className={"logo logo-light gap-2"}><img className={'mx-1'} src={logoDark} alt="" height="80" /></div>
                                </div>

                                <h4>{t('بازنشانی رمزعبور')}</h4>
                                <p className="text-muted mb-4">{t('رمزعبور حساب کاربری خود را بازنشانی کنید.')}</p>

                            </div>

                            <Card>
                                <CardBody className="p-4">
                                    <div className="p-3">
                                        {
                                            props.error && <Alert variant="danger">{props.error}</Alert>
                                        }
                                        {
                                            props.passwordResetStatus ? <Alert variant="success" className="text-center mb-4">{props.passwordResetStatus}</Alert>
                                                : <Alert variant="success" className="text-center mb-4">{t('اطلاعات خود را جهت بازنشانی رمز، وارد کنید')}.</Alert>
                                        }
                                        <Form onSubmit={formik.handleSubmit}>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label"><div className={'d-flex align-items-center gap-1'}><span>{t("mobile")}</span><span style={{color:'#e53935'}}>*</span></div></Label>
                                                <InputGroup className="input-group bg-soft-light rounded-3 mb-3 d-flex flex-row-reverse">
                                                    <span className="input-group-text text-muted">
                                                      <i className="ri-phone-line"></i>
                                                    </span>
                                                    <Input
                                                        type="text"
                                                        id="mobile"
                                                        name="mobile"
                                                        className="form-control form-control-lg border-light bg-soft-light"
                                                        placeholder="شماره موبایل خود را وارد کنید"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.mobile}
                                                        invalid={formik.touched.mobile && formik.errors.mobile ? true : false}
                                                    />
                                                    {formik.touched.mobile && formik.errors.mobile ? (
                                                        <FormFeedback type="invalid">{formik.errors.mobile}</FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </FormGroup>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label"><div className={'d-flex align-items-center gap-1'}><span>{t("Password")}</span><span style={{color:'#e53935'}}>*</span></div></Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg  d-flex flex-row-reverse">
                                                        <span onClick={(event)=>{
                                                            event.preventDefault()
                                                            setShowNewPass(!showNewPass)
                                                        }} className="input-group-text border-light text-muted">
                                                            <i className={showNewPass ? "ri-eye-line" : "ri-eye-off-line"}></i>
                                                        </span>
                                                    <Input
                                                        type={showNewPass ? "text" : "password"}
                                                        id="password"
                                                        name="password"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="رمزعبور خود را وارد کنید"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.password}
                                                        invalid={
                                                            formik.touched.password && formik.errors.password
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {formik.touched.password && formik.errors.password ? (
                                                        <FormFeedback type="invalid">
                                                            {formik.errors.password}
                                                        </FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </FormGroup>

                                            <FormGroup className="mb-4">
                                                <Label className="form-label"><div className={'d-flex align-items-center gap-1'}><span>{t("rePassword")}</span><span style={{color:'#e53935'}}>*</span></div></Label>
                                                <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg  d-flex flex-row-reverse">
                                                    <span onClick={(event)=>{
                                                        event.preventDefault()
                                                        setShowReNewPass(!showReNewPass)
                                                    }} className="input-group-text border-light text-muted">
                                                      <i className={showReNewPass ? "ri-eye-line" : "ri-eye-off-line"}></i>
                                                    </span>
                                                    <Input
                                                        type={showReNewPass ? "text" : "password"}
                                                        id="repassword"
                                                        name="repassword"
                                                        className="form-control form-control-lg bg-soft-light border-light"
                                                        placeholder="تکرار رمزعبور خود را وارد کنید"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.repassword}
                                                        invalid={
                                                            formik.touched.repassword && formik.errors.repassword
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {formik.touched.repassword && formik.errors.repassword ? (
                                                        <FormFeedback type="invalid">
                                                            {formik.errors.repassword}
                                                        </FormFeedback>
                                                    ) : null}
                                                </InputGroup>
                                            </FormGroup>

                                            <div className="d-grid">
                                                <Button color="primary" block className="waves-effect waves-light" type="submit">{t('بازنشانی')}</Button>
                                            </div>

                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>

                            <div className="mt-5 text-center">
                                <p>{t('رمزعبور خود را به یاد دارید؟')}  <Link to="login" className="font-weight-medium text-primary"> {t('Signin')} </Link> </p>
                                <p>© {'1404'} {t('کاشف')}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Modal isOpen={showOTPModal} toggle={() => setShowOTPModal(false)} centered>

                <ModalHeader>تایید شماره موبایل</ModalHeader>
                <ModalBody>
                    <p className="mb-3">کدی که به شماره موبایل شما ارسال شده است را وارد کنید.</p>
                    <Input
                        type="text"
                        placeholder="کد تایید را وارد کنید"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                    />
                    <Button
                        color="primary"
                        className="mt-3"
                        block
                        onClick={handleOTPSubmit}
                    >
                        تایید
                    </Button>
                </ModalBody>
            </Modal>
        </React.Fragment>
    )
}


const mapStateToProps = (state) => {
    const { user, loading, error, passwordResetStatus } = state.Auth;
    return { user, loading, error, passwordResetStatus };
};

export default connect(mapStateToProps, { forgetPassword, apiError })(ForgetPassword);
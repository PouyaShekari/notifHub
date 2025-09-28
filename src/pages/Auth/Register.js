import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../components/withRouter";

import { useFormik } from "formik";
import * as Yup from "yup";
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
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";

//Import action
import { registerUser, apiError } from "../../redux/actions";

//i18n
import { useTranslation } from "react-i18next";

//Import Images
import logolight from "../../assets/images/kashefLogo-light.png";
import logoDark from "../../assets/images/kashefLogo-dark.svg";
import { createSelector } from "reselect";
import { APIClient } from "../../helpers/apiClient";
import toast from "react-hot-toast";


const Register = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();
  const api = new APIClient();
  const [showOTPModal, setShowOTPModal] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [userData, setUserData] = React.useState(null);
  const [showNewPass , setShowNewPass] = React.useState(false);
  const [showReNewPass , setShowReNewPass] = React.useState(false);
  // validation
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      fullName:"",
      nationalCode:"",
      mobile: "",
      password: "",
      repassword: "",

    },
    validationSchema: Yup.object({
      fullName: Yup.string()
          .required("لطفا نام نمایشی خود را وارد کنید.")
          .matches(/^[آ-ی\s]+$/, "فقط از حروف فارسی استفاده کنید."),
      nationalCode: Yup.string()
          .required("لطفا کدملی خود را وارد کنید.")
          .matches(/^\d{10}$/, 'کد ملی باید ۱۰ رقم باشد'),
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
    onSubmit: (values) => {
      if(window.navigator.onLine){
        // First, try to register the user
        const registerPayload = {
          fullName: values.fullName,
          nationalCode: values.nationalCode,
          mobile: values.mobile,
          password: values.password,
          rePassword: values.repassword,
        };

        api.register(registerPayload)
            .then(response => {
              setUserData(values);
              return api.create(`/account/SendOtpSms?mobile=${values.mobile}`, {});
            })
            .then(() => {
              toast.success("ثبت نام موفق بود. کد تایید ارسال شد");
              setShowOTPModal(true);
            })
            .catch(error => {
              toast.error(error || "ثبت نام با خطا مواجه شد");
              if(error === 'کاربر با این شماره موبایل قبلا ثبت شده است'){
                setTimeout(() => navigate("/login"), 2000);
              }
            });
      }else{
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
      mobile: userData.mobile,
      otp: '' + otpCode
    };

    // If you have a separate OTP verification endpoint
    api.create('/account/SetUserConfirmed', verifyPayload)
        .then(response => {
          toast.success("حساب کاربری شما با موفقیت فعال شد");
          setTimeout(() => navigate("/login"), 2000);
        })
        .catch(error => {
          if(error === 'کد تایید اشتباه است'){
            toast.error("کد تایید اشتباه است. لطفا نسبت به تایید حساب خود از طریق صفحه ورود اقدام بفرمایید.");
          }
          else toast.error(error || "تایید کد با خطا مواجه شد. لطفا نسبت به تایید حساب خود از طریق صفحه ورود اقدام بفرمایید.");
          setTimeout(() => navigate("/login"), 2000);
        })

  };

  const selectAccount = createSelector(
      (state) => state.Auth,
      (account) => ({
        user: account.user,
        success: account.success,
        error: account.error,
      })
  );

  const { user, error, success } = useSelector(selectAccount);

  useEffect(() => {
    if (success) {
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [dispatch, success, error, user, navigate]);

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  document.title = "ثبت نام";

  return (
      <React.Fragment>
        <div className="account-pages pt-sm-5 my-3 my-sm-0 overflow-x-hidden" style={{height:'100vh'}}>
          <Container style={{height:'100%'}}>
            <Row className="justify-content-center" style={{height:'100%'}}>
              <Col md={8} lg={6} xl={5} style={{margin: 'auto 0'}}>
                <div className="text-center mb-4">
                  <div className="auth-logo mb-3 d-block">
                    <div className={"logo logo-dark gap-2"}>
                      <img
                          className={"mx-1"}
                          src={logolight}
                          alt=""
                          height="80"
                      />

                    </div>
                    <div className={"logo logo-light gap-2"}>
                      <img className={"mx-1"} src={logoDark} alt="" height="80" />
                    </div>
                  </div>

                  <h4>{t("ثبت نام")}</h4>
                  <p className="text-muted mb-4">
                    {t("حساب کاربری خود را ایجاد کنید")}.
                  </p>
                </div>

                <Card>
                  <CardBody className="p-4">
                    <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          formik.handleSubmit();
                          // return false;
                        }}
                    >
                      {user && user ? (
                          <Alert color="success">ثبت حساب کاربری با موفقیت انجام شد.</Alert>
                      ) : null}

                      {error && error ? (
                          <Alert color="danger">
                            <div>{error}</div>
                          </Alert>
                      ) : null}
                      <div className="mb-3">
                        <Label className="form-label"><div className={'d-flex align-items-center gap-1'}><span>{t("mobile")}</span><span style={{color:'#e53935'}}>*</span></div></Label>
                        <InputGroup className="input-group bg-soft-light rounded-3 mb-3 d-flex flex-row-reverse">
                        <span className="input-group-text text-muted">
                          <i className="ri-phone-line"></i>
                        </span>
                          <Input
                              type="text"
                              id="mobile"
                              name="mobile"
                              className="form-control form-control-lg bg-soft-light border-light"
                              placeholder="شماره موبایل خود را وارد کنید"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.mobile}
                              invalid={
                                formik.touched.mobile && formik.errors.mobile
                                    ? true
                                    : false
                              }
                          />
                          {formik.touched.mobile && formik.errors.mobile ? (
                              <FormFeedback type="invalid">
                                {formik.errors.mobile}
                              </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </div>

                      <div className="mb-3">
                        <Label className="form-label"><div className={'d-flex align-items-center gap-1'}><span>نام نمایشی</span><span style={{color:'#e53935'}}>*</span></div></Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg  d-flex flex-row-reverse">
                        <span className="input-group-text border-light text-muted">
                          <i className="ri-user-2-line"></i>
                        </span>
                          <Input
                              type="text"
                              id="fullName"
                              name="fullName"
                              className="form-control form-control-lg bg-soft-light border-light"
                              placeholder="نام نمایشی خود را وارد کنید"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.fullName}
                              invalid={
                                formik.touched.fullName && formik.errors.fullName
                                    ? true
                                    : false
                              }
                          />
                          {formik.touched.fullName && formik.errors.fullName ? (
                              <FormFeedback type="invalid">
                                {formik.errors.fullName}
                              </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </div>
                      <div className="mb-3">
                        <Label className="form-label"><div className={'d-flex align-items-center gap-1'}><span>کدملی</span><span style={{color:'#e53935'}}>*</span></div></Label>
                        <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg  d-flex flex-row-reverse">
                        <span className="input-group-text border-light text-muted">
                          <i className="ri-user-2-line"></i>
                        </span>
                          <Input
                              type="text"
                              id="nationalCode"
                              name="nationalCode"
                              className="form-control form-control-lg bg-soft-light border-light"
                              placeholder="کدملی خود را وارد کنید"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.nationalCode}
                              invalid={
                                formik.touched.nationalCode && formik.errors.nationalCode
                                    ? true
                                    : false
                              }
                          />
                          {formik.touched.nationalCode && formik.errors.nationalCode ? (
                              <FormFeedback type="invalid">
                                {formik.errors.nationalCode}
                              </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </div>
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
                        <Button
                            color="primary"
                            block
                            className=" waves-effect waves-light"
                            type="submit"
                        >
                          ثبت نام
                        </Button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-muted mb-0">
                          {t("By registering you agree to the Chatvia")}{" "}
                          <Link to="#" className="text-primary">
                            {t("Terms of Use")}
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </CardBody>
                </Card>

                <div className="mt-5 text-center">
                  <p>
                    {t("Already have an account")}
                    <Link to="login" className="font-weight-medium text-primary">
                      {" "}
                      {t("Signin")}{" "}
                    </Link>{" "}
                  </p>
                  <p>
                    © {'1404'} {t("کاشف")}
                  </p>
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
              تایید و فعالسازی حساب
            </Button>
          </ModalBody>
        </Modal>
      </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { user, loading, error } = state.Auth;
  return { user, loading, error };
};

export default withRouter(
    connect(mapStateToProps, { registerUser, apiError })(Register)
);
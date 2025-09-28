import React, { useCallback, useEffect, useState } from "react";
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
  InputGroup, ModalHeader, ModalBody, Modal, ModalFooter,
} from "reactstrap";
import { connect, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import withRouter from "../../components/withRouter";
import { useFormik } from "formik";
import * as Yup from "yup";
import {useNavigate} from 'react-router-dom'
//i18n
import { useTranslation } from "react-i18next";

//redux store
import { loginUser, apiError } from "../../redux/actions";

//Import Images
import logolight from "../../assets/images/kashefLogo-light.png";
import logoDark from "../../assets/images/kashefLogo-dark.svg";
import { APIClient } from "../../helpers/apiClient";
import toast from "react-hot-toast";

const Login = (props) => {
  const dispatch = useDispatch();
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();
  const api = new APIClient();
  const [captchaImage, setCaptchaImage] = useState();
  const [captchaHash, setCaptchaHash] = useState();
  const navigate = useNavigate();
  const [showOTPModal, setShowOTPModal] = React.useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [reNewPassword, setReNewPassword] = React.useState("");
  const [showPass , setShowPass] = React.useState(false);
  const [showNewPass , setShowNewPass] = React.useState(false);
  const [showReNewPass , setShowReNewPass] = React.useState(false);
  const clearError = useCallback(() => {
    dispatch(apiError(""));
  }, [dispatch]);
  const [userData, setUserData] = React.useState(null);
  const [passwordError, setPasswordError] = useState({
    newPassword: '',
    reNewPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordModal = () => {
    setShowChangePasswordModal(!showChangePasswordModal);
    if (!showChangePasswordModal) {
      // Reset form when opening modal
      resetPasswordForm();
    }
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const errors = {
      newPassword: '',
      reNewPassword: ''
    };

    if (!newPassword.trim()) {
      errors.newPassword = 'رمز عبور جدید الزامی است';
      isValid = false;
    } else if (newPassword.length < 8) {
      errors.newPassword = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
      isValid = false;
    } else if (!/[a-zA-Z]/.test(newPassword)) {
      errors.newPassword = 'رمز عبور باید شامل حداقل یک حرف انگلیسی باشد';
      isValid = false;
    } else if (!/[0-9]/.test(newPassword)) {
      errors.newPassword = 'رمز عبور باید شامل حداقل یک عدد باشد';
      isValid = false;
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      errors.newPassword = 'رمز عبور باید شامل حداقل یک کاراکتر خاص (مانند !@#$%) باشد';
      isValid = false;
    }

    if (!reNewPassword.trim()) {
      errors.reNewPassword = 'تکرار رمز عبور الزامی است';
      isValid = false;
    } else if (reNewPassword !== newPassword) {
      errors.reNewPassword = 'تکرار رمز عبور با رمز عبور جدید مطابقت ندارد';
      isValid = false;
    }

    setPasswordError(errors);
    return isValid;
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      setIsSubmitting(true);

      api.changeDefaultPassword(JSON.stringify({
        oldPassword: userData.password,
        mobile: userData.mobile,
        password: newPassword,
        rePassword: reNewPassword
      }))
          .then((res) => {
            toast.success('رمز عبور با موفقیت تغییر یافت');
            togglePasswordModal()
            setUserData(null)
          })
          .catch((error) => {
            if (error) {
              if (error === 'Network Error'){
                toast.error('ارتباط شما برقرار نیست')
              }
              else{
                setPasswordError(prev => ({
                  ...prev,
                  currentPassword: error
                }));
              }
            } else {
              toast.error('تغییر رمز عبور با خطا مواجه شد');
            }
          })
          .finally(() => {
            setIsSubmitting(false);
          });
    }
  }

  const resetPasswordForm = () => {
    setNewPassword('');
    setReNewPassword('');
    setPasswordError({
      newPassword: '',
      reNewPassword: ''
    });
    setIsSubmitting(false);
  };

  const handleOTPSubmit = () => {
    if (!otpCode || otpCode.length !== 6 || isNaN(+otpCode)) {
      toast.error("کد تایید باید ۶ رقم باشد.");
      return;
    }
    const verifyPayload = {
      mobile: userData.mobile,
      otp: otpCode
    };
    api.create('/account/SetUserConfirmed', verifyPayload)
        .then(() => {
          toast.success("حساب کاربری شما با موفقیت فعال شد.");
          if(window.navigator.onLine){
            api
                .login({ ...userData/*, captchaHash: captchaHash*/ })
                .then(async (response) => {
                  toast.success((t("successLogin")));
                  localStorage.setItem("accessToken", response.data.accessToken);
                  localStorage.setItem("refreshToken", response.data.refreshToken);
                  const date = new Date();
                  localStorage.setItem("loginTime", (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ":" + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()));
                  await getUserData().then(()=>{
                    setTimeout(()=>navigate("/"),2000)
                  })
                })
                .catch((error) => {
                  toast.error(error)
                });
          }else{
            toast.error('شما آفلاین هستید.')
          }
          setShowOTPModal(false)
        })
        .catch(error => {
          toast.error(error || "تایید کد با خطا مواجه شد");
          //setTimeout(() => navigate("/login"), 2000);
        })

  };

  useEffect(() => {
    clearError();
  }, [clearError]);

  /*const getCaptchaCode = () => {
    api
      .getCaptcha()
      .then((response) => {
        setCaptchaImage(response?.image);
        setCaptchaHash(response?.keyHash);
      })
      .catch((error) => console.error("Full error:", error));
  };
  useEffect(() => {
    getCaptchaCode();
  }, []);*/


  /*useEffect(() => {
    const handleOnline = () => {
      getCaptchaCode();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);*/

  // validation
  const formik = useFormik({
    initialValues: {
      mobile: "",
      password: "",
      //captcha: "",
      //captchaHash: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string().required("لطفا شماره موبایل  خود را وارد کنید."),
      password: Yup.string().required("لطفا رمزعبور خود را وارد کنید."),
      //captcha: Yup.string().required("لطفا  تصویر امنیتی را وارد کنید."),
    }),
    onSubmit: (values) => {
      if(window.navigator.onLine){
        api
            .login({ ...values/*, captchaHash: captchaHash*/ })
            .then(async (response) => {
              toast.success((t("successLogin")));
              localStorage.setItem("accessToken", response.data.accessToken);
              localStorage.setItem("refreshToken", response.data.refreshToken);
              const date = new Date();
              localStorage.setItem("loginTime", (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ":" + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()));
              await getUserData().then(()=>{
                setTimeout(()=>navigate("/"),2000)
              })
            })
            .catch((error) => {
              if(error === 'شماره تلفن کاربر مورد نظر تایید نشده است. لطفا نسبت به تایید آن اقدام بفرمایید.'){
                setUserData(values);
                return api.create(`/account/SendOtpSms?mobile=${values.mobile}`, {}).then(() => {
                  toast.success(" کد تایید با موفقیت ارسال شد");
                  setShowOTPModal(true);
                }).catch(error => {
                      toast.error(error || "ارسال کد با خطا مواجه شد");
                    });
              }else {
                toast.error(error)
                if(error === 'لطفا رمزعبور خود را بروزرسانی کنید.'){
                  setUserData(values);
                  togglePasswordModal();
                }
              }
            });
      }else{
        toast.error('شما آفلاین هستید.')
      }
    },
  });

  const getUserData = async () => {
    const result = await api.getUserInfo()
    localStorage.setItem('userInfo',JSON.stringify(result?.data))
  }

  if (localStorage.getItem("accessToken")) {
    return <Navigate to="/" />;
  }

  document.title = "صفحه ورود";
  return (
    <React.Fragment>
      <div className="account-pages my-3 my-sm-0 pt-sm-5 overflow-x-hidden" style={{height:'100vh'}}>
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

                <h4>{t("Sign in")}</h4>
                <p className="text-muted mb-4">
                  {t("برای ادامه وارد برنامه شوید")}
                </p>
              </div>

              <Card>
                <CardBody className="p-4">
                  {props.error && <Alert color="danger">{props.error}</Alert>}
                  <div className="p-3">
                    <Form onSubmit={formik.handleSubmit}>
                      <div className="mb-3">
                        <Label className="form-label">{t("mobile")}</Label>
                        <InputGroup className="mb-3 bg-soft-light rounded-3  d-flex flex-row-reverse">
                          <span
                            className="input-group-text text-muted"
                            id="basic-addon3"
                          >
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

                      <FormGroup className="mb-4">
                        <div className="float-end">
                          <Link
                            to="/forget-password"
                            className="text-muted font-size-13"
                          >
                            {t("فراموشی رمزعبور")}؟
                          </Link>
                        </div>
                        <Label className="form-label">{t("Password")}</Label>
                        <InputGroup className="mb-3 bg-soft-light rounded-3  d-flex flex-row-reverse">
                          <span onClick={(event)=>{
                            event.preventDefault()
                            setShowPass(!showPass)
                          }} className="input-group-text text-muted">
                            <i className={showPass ? "ri-eye-line" : "ri-eye-off-line"}></i>
                          </span>
                          <Input
                            type={showPass ? "text" : "password"}
                            id="password"
                            name="password"
                            className="form-control form-control-lg border-light bg-soft-light"
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
                      {/*<FormGroup className="mb-4">
                        <div className="mb-4">
                          <img src={`data:image/png;base64,${captchaImage}`} />
                          <Button
                            color="link"
                            className="text-decoration-none text-muted pr-1"
                            type="button"
                            onClick={getCaptchaCode}
                          >
                            <i className="ri-refresh-line font-size-22 rotate-animation"></i>
                          </Button>
                        </div>
                        <Label className="form-label">{t("captcha")}</Label>
                        <InputGroup className="mb-3 bg-soft-light rounded-3  d-flex flex-row-reverse ">
                          <span
                            className="input-group-text text-muted"
                            id="basic-addon3"
                          >
                            <i className="ri-code-line"></i>
                          </span>
                          <Input
                            type="text"
                            id="captcha"
                            name="captcha"
                            className="form-control form-control-lg border-light bg-soft-light"
                            placeholder="تصویر امنیتی را وارد کنید"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.captcha}
                            invalid={
                              formik.touched.captcha && formik.errors.captcha
                                ? true
                                : false
                            }
                          />
                          {formik.touched.captcha && formik.errors.captcha ? (
                            <FormFeedback type="invalid">
                              {formik.errors.captcha}
                            </FormFeedback>
                          ) : null}
                        </InputGroup>
                      </FormGroup>*/}

                      <div className="form-check mb-4 d-flex">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="remember-check"
                        />
                        <Label
                          className="form-check-label"
                          style={{ marginRight: "2rem" }}
                          htmlFor="remember-check"
                        >
                          {t("Remember me")}
                        </Label>
                      </div>

                      <div className="d-grid">
                        <Button
                          color="primary"
                          block
                          className=" waves-effect waves-light"
                          type="submit"
                        >
                          {t("Sign in")}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-5 text-center">
                <p>
                  {t("Don't have an account")}{" "}
                  <Link
                    to="/register"
                    className="font-weight-medium text-primary"
                  >
                    {" "}
                    {t("Signup now")}{" "}
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
      <Modal backdrop="static" isOpen={showChangePasswordModal} toggle={togglePasswordModal} centered>
        <div className="modal-header" style={{width:'100%', display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h5 className="modal-title">تغییر رمز عبور</h5>
          <span onClick={(event)=>{
            event.preventDefault()
            setShowChangePasswordModal(!showChangePasswordModal);
            resetPasswordForm();
            setUserData(null)
          }} style={{fontSize:'1.25rem' , cursor:'pointer'}}>×</span>
        </div>
        <Form onSubmit={handleChangePassword}>
          <ModalBody>
            <FormGroup>
              <Label for="newPassword">رمز عبور جدید<span style={{color:'red'}}>*</span></Label>
              <InputGroup className="mb-3 bg-soft-light rounded-3  d-flex flex-row-reverse">
                <span style={{border:'1px solid lightGray'}} onClick={(event)=>{
                  event.preventDefault()
                  setShowNewPass(!showNewPass)
                }} className="input-group-text text-muted">
                            <i className={showNewPass ? "ri-eye-line" : "ri-eye-off-line"}></i>
                          </span>
                <Input
                    type={showNewPass ? "text" : "password"}
                    id="newPassword"
                    style={{border:'1px solid lightGray' , borderRadius:"0 5px 5px 0"}}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      // Clear error when user types
                      if (passwordError.newPassword && e.target.value.trim()) {
                        setPasswordError(prev => ({ ...prev, newPassword: '' }));
                      }
                    }}
                    placeholder={"رمز عبور جدید را وارد کنید"}
                    invalid={!!passwordError.newPassword}
                />
                <FormFeedback>{passwordError.newPassword}</FormFeedback>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="reNewPassword">تکرار رمز عبور جدید<span style={{color:'red'}}>*</span></Label>
              <InputGroup className="mb-3 bg-soft-light rounded-3  d-flex flex-row-reverse">
                <span style={{border:'1px solid lightGray'}} onClick={(event)=>{
                  event.preventDefault()
                  setShowReNewPass(!showReNewPass)
                }} className="input-group-text text-muted">
                            <i className={showReNewPass ? "ri-eye-line" : "ri-eye-off-line"}></i>
                          </span>
                <Input
                    type={showReNewPass ? "text" :"password"}
                    id="reNewPassword"
                    style={{border:'1px solid lightGray' , borderRadius:"0 5px 5px 0"}}
                    value={reNewPassword}
                    placeholder={"تکرار رمز عبور جدید را وارد کنید"}
                    onChange={(e) => {
                      setReNewPassword(e.target.value);
                      // Clear error when user types
                      if (passwordError.reNewPassword) {
                        setPasswordError(prev => ({ ...prev, reNewPassword: '' }));
                      }
                    }}
                    invalid={!!passwordError.reNewPassword}
                />
                <FormFeedback>{passwordError.reNewPassword}</FormFeedback>
              </InputGroup>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { user, loading, error } = state.Auth;
  return { user, loading, error };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, apiError })(Login)
);

import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Card,
  Button,
  Input,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormFeedback,
  Label, InputGroup
} from "reactstrap";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";

//i18n
import { useTranslation } from "react-i18next";
import {APIClient} from "../../../helpers/apiClient";
import toast from "react-hot-toast";

function Profile(props) {
  const api = new APIClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);

  const [showCurrentPass , setShowCurrentPass] = useState(false);
  const [showNewPass , setShowNewPass] = useState(false);
  const [showReNewPass , setShowReNewPass] = useState(false);

  // Add state for editing fullname
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState('');
  const [originalName, setOriginalName] = useState('');

  // Add state for password modal
  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  // Initialize user data from localStorage
  useEffect(() => {
    if (localStorage.getItem('userInfo')) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      setFullName(userInfo.fullName || '');
      setOriginalName(userInfo.fullName || '');
    }
  }, []);

  const toggleCollapse1 = () => {
    setIsOpen1(!isOpen1);
    setIsOpen2(false);
  };

  const toggleCollapse2 = () => {
    setIsOpen2(!isOpen2);
    setIsOpen1(false);
  };

  const toggle = () => setDropdownOpen(!dropdownOpen);

  // Function to handle edit mode for fullname
  const toggleEditName = () => {
    if (!isEditingName) {
      // Entering edit mode - store current value
      setIsEditingName(true);
    } else {
      // Canceling - restore original value
      setFullName(originalName);
      setIsEditingName(false);
    }
  };

  // Function to save updated fullname
  const saveFullName = () => {
    if(fullName?.trim().length > 0 && fullName.match(/^[آ-ی\s]+$/)){
      if (localStorage.getItem('userInfo')) {
        api.updateUserInfo(JSON.stringify({
          fullName: fullName,
        })).then(()=>{
          toast.success('نام نمایشی با موفقیت تغییر یافت.')
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          userInfo.fullName = fullName;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          // Update the original name to match the new saved name
          setOriginalName(fullName);
          setIsEditingName(false);
        }).catch(()=>{
          toast.error('تغییر نام نمایشی با خطا مواجه شد.')
          toggleEditName()
        })
      }
    }else {
      toast.error('فقط از حروف فارسی استفاده کنید.')
    }
  };

  // Toggle password modal
  const togglePasswordModal = () => {
    setPasswordModal(!passwordModal);
    if (!passwordModal) {
      // Reset form when opening modal
      resetPasswordForm();
    }
  };

  // Reset password form
  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsSubmitting(false);
  };

  // Validate password form
  const validatePasswordForm = () => {
    let isValid = true;
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!currentPassword.trim()) {
      errors.currentPassword = 'رمز عبور فعلی الزامی است';
      isValid = false;
    }

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

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'تکرار رمز عبور الزامی است';
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'تکرار رمز عبور با رمز عبور جدید مطابقت ندارد';
      isValid = false;
    }

    setPasswordError(errors);
    return isValid;
  };

  // Handle password update submission
  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      setIsSubmitting(true);

      api.updatePassword(JSON.stringify({
        oldPassword: currentPassword,
        password: newPassword,
        rePassword: newPassword
      }))
          .then((res) => {
            toast.success('رمز عبور با موفقیت تغییر یافت');
            togglePasswordModal();
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
  };

  // Get first letter of name for avatar
  const getFirstLetter = () => {
    if (fullName && fullName.length > 0) {
      return fullName.substring(0, 1);
    }
    return '';
  };

  return (
      <React.Fragment>
        <div>
          <div className="px-4 pt-4">
            {/*<div className="user-chat-nav float-end">
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                    tag="a"
                    className="font-size-18 text-muted dropdown-toggle"
                >
                  <i className="ri-more-2-fill"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem onClick={togglePasswordModal}>تغییر رمزعبور</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>*/}
            <h4 className="mb-0">{t("My Profile")}</h4>
          </div>

          <div className="text-center p-4 border-bottom">
            <div className="mb-4 d-flex justify-content-center">
            <span className="avatar-title rounded-circle bg-primary-subtle text-primary avatar-lg img-thumbnail fs-2" style={{width:'5rem',height:'5rem'}}>
              {getFirstLetter()}
            </span>
            </div>

            <h5 className="font-size-16 mb-1 text-truncate">
              {fullName || 'کاربر سامانه'}
            </h5>
            <p className="text-muted text-truncate mb-1">
              <i className="ri-record-circle-fill font-size-10 text-success me-1 d-inline-block"></i>{" "}
              {t("Active")}
            </p>
          </div>
          {/* End profile user  */}

          {/* Start user-profile-desc */}
          <div className="p-4 user-profile-desc">
            <div className="text-muted">
              <p className="mb-4">
                مشخصات کاربری خود را در این قسمت مشاهده و در صورت نیاز، می توانید آن ها را ویرایش کنید.
              </p>
            </div>

            <div id="profile-user-accordion-1" className="custom-accordion">
              <Card className="shadow-none border mb-2 d-flex flex-column bg-transparent">
                {/* import collaps */}
                <CustomCollapse
                    bgWhite={true}
                    title="درباره من"
                    iconClass="ri-user-2-line"
                    isOpen={isOpen1}
                    toggleCollapse={toggleCollapse1}
                >
                  <div>
                    <p className="text-muted mb-1">{'نام نمایشی'}</p>

                    {isEditingName ? (
                        <FormGroup className="d-flex align-items-center">
                          <Input
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="نام خود را وارد کنید"
                              className="me-2"
                          />
                          <Button color="primary" size="sm" onClick={saveFullName} className="me-2">
                            ذخیره
                          </Button>
                          <Button color="secondary" size="sm" onClick={toggleEditName}>
                            لغو
                          </Button>
                        </FormGroup>
                    ) : (
                        <div className="d-flex align-items-center">
                          <h5 className="font-size-14 me-2">{fullName || 'ثبت نشده است'}</h5>
                          <Button color="light" size="sm" onClick={toggleEditName}>
                            <i className="ri-edit-line"></i>
                          </Button>
                        </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">{'کد ملی'}</p>
                    <h5 className="font-size-14">
                      {localStorage.getItem('userInfo') ?
                          JSON.parse(localStorage.getItem('userInfo')).nationalCode : 'ثبت نشده است'}
                    </h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">{'شماره تماس'}</p>
                    <h5 className="font-size-14">
                      {localStorage.getItem('userInfo') ?
                          JSON.parse(localStorage.getItem('userInfo')).mobile : 'ثبت نشده است'}
                    </h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">زمان ورود</p>
                    <h5 className="font-size-14">{localStorage?.getItem('loginTime') ?? 'ثبت نشده است'}</h5>
                  </div>

                  {/*<div className="mt-4">
                  <p className="text-muted mb-1">{t("Location")}</p>
                  <h5 className="font-size-14 mb-0">تهران - ایران</h5>
                </div>*/}
                </CustomCollapse>
                <div className="mt-2"></div>
                <CustomCollapse
                    bgWhite={true}
                    title="رمز عبور"
                    iconClass="ri-lock-2-line"
                    isOpen={isOpen2}
                    toggleCollapse={toggleCollapse2}
                >
                  <Button color="primary" size="md" onClick={togglePasswordModal} className="d-flex align-items-center justify-content-center gap-1">
                    <i className="ri-lock-2-line"></i>
                    تغییر رمز عبور
                  </Button>
                </CustomCollapse>
              </Card>
              {/*<div className="mt-4 p-2 border-top">test</div>*/}
              {/* End About card  */}
            </div>
            {/* end profile-user-accordion  */}
          </div>
          {/* end user-profile-desc  */}
        </div>

        {/* Password Change Modal */}
        <Modal isOpen={passwordModal} toggle={togglePasswordModal} centered>
          <div className="modal-header">
            <h5 className="modal-title">تغییر رمز عبور</h5>
          </div>
          <Form onSubmit={handlePasswordUpdate}>
            <ModalBody>
              <FormGroup>
                <Label for="currentPassword">رمز عبور فعلی<span style={{color:'red'}}>*</span></Label>
                <InputGroup className="mb-3 bg-soft-light rounded-3  d-flex flex-row-reverse">
                <span style={{border:'1px solid lightGray'}} onClick={(event)=>{
                  event.preventDefault()
                  setShowCurrentPass(!showCurrentPass)
                }} className="input-group-text text-muted">
                            <i className={showCurrentPass ? "ri-eye-line" : "ri-eye-off-line"}></i>
                          </span>
                  <Input
                      type={showCurrentPass ? "text" : "password"}
                      id="currentPassword"
                      value={currentPassword}
                      style={{border:'1px solid lightGray' , borderRadius:"0 5px 5px 0"}}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        // Clear error when user types
                        if (passwordError.currentPassword && e.target.value.trim()) {
                          setPasswordError(prev => ({ ...prev, currentPassword: '' }));
                        }
                      }}
                      placeholder={"رمز عبور فعلی را وارد کنید"}
                      invalid={!!passwordError.currentPassword}
                  />
                  <FormFeedback>{passwordError.currentPassword}</FormFeedback>
                </InputGroup>
              </FormGroup>
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
                      placeholder={"رمز عبور جدید را وارد کنید"}
                      value={newPassword}
                      style={{border:'1px solid lightGray' , borderRadius:"0 5px 5px 0"}}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        // Clear error when user types
                        if (passwordError.newPassword) {
                          setPasswordError(prev => ({ ...prev, newPassword: '' }));
                        }
                      }}
                      invalid={!!passwordError.newPassword}
                  />
                  <FormFeedback>{passwordError.newPassword}</FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="confirmPassword">تکرار رمز عبور جدید<span style={{color:'red'}}>*</span></Label>
                <InputGroup className="mb-3 bg-soft-light rounded-3  d-flex flex-row-reverse">
                <span style={{border:'1px solid lightGray'}} onClick={(event)=>{
                  event.preventDefault()
                  setShowReNewPass(!showReNewPass)
                }} className="input-group-text text-muted">
                            <i className={showReNewPass ? "ri-eye-line" : "ri-eye-off-line"}></i>
                          </span>
                  <Input
                      type={showReNewPass ? "text" : "password"}
                      style={{border:'1px solid lightGray' , borderRadius:"0 5px 5px 0"}}
                      placeholder={"تکرار رمز عبور جدید را وارد کنید"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        // Clear error when user types
                        if (passwordError.confirmPassword) {
                          setPasswordError(prev => ({ ...prev, confirmPassword: '' }));
                        }
                      }}
                      invalid={!!passwordError.confirmPassword}
                  />
                  <FormFeedback>{passwordError.confirmPassword}</FormFeedback>
                </InputGroup>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={togglePasswordModal}>
                انصراف
              </Button>
              <Button color="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </React.Fragment>
  );
}

export default Profile;
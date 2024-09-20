import {
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Link,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React from "react";
import ImgRegister from "../../assets/register.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { EyeSlashFilledIcon } from "../../assets/icons/EyeSlashFilledIcon.jsx";
import { EyeFilledIcon } from "../../assets/icons/EyeFilledIcon.jsx";

export function RegisterComponent() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [emailLead, setEmailLead] = React.useState("");
  const [regisPassword, setRegisPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [regisError, setRegisError] = React.useState(false);
  const [regisErrorMsg, setRegisErrorMsg] = React.useState("");
  const [regisLoading, setRegisLoading] = React.useState(false);
  const [regisMsg, setRegisMsg] = React.useState("Create an account");
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const CONTACT = import.meta.env.VITE_CONTACT;

  // check email format
  const validateEmail = (value) =>
    value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i);
  const isEmailInvalid = React.useMemo(() => {
    if (email === "") return false;
    return !validateEmail(email);
  }, [email]);
  const isMobileInvalid = React.useMemo(() => {
    if (mobile === "") return false;
    return !(mobile.startsWith("0") && mobile.length === 10);
  }, [mobile]);
  const isEmailLeadInvalid = React.useMemo(() => {
    if (emailLead === "") return false;
    return !validateEmail(emailLead);
  }, [emailLead]);

  const isInvalidConfirmPassword = React.useMemo(() => {
    if (confirmPassword === "") return false;
    return regisPassword !== confirmPassword;
  }, [regisPassword, confirmPassword]);

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setRegisLoading(true);
    setRegisMsg("Loading");
    const API_BASE_URL = import.meta.env.DEV
      ? import.meta.env.VITE_API_BASE_URL
      : "";
    axios
      .post(`${API_BASE_URL}/api/user`, {
        username,
        email,
        mobile,
        emailLead,
        password: confirmPassword,
      })
      .then(async (response) => {
        if ("success" === response.data?.status) {
          toast.success("User Created!", { autoClose: 1500 });
          setRegisLoading(false);
          setRegisMsg("Sign up");
          navigate("/login");
        } else {
          setRegisLoading(false);
          setRegisMsg("Sign up");
          setRegisError(true);
          setRegisErrorMsg("Sign up error : Internal server error");
        }
      })
      .catch((error) => {
        setRegisLoading(false);
        setRegisMsg("Sign up");
        setRegisError(true);
        setRegisErrorMsg("Sign up error : " + error.message);
      });
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <Image
        width="100%"
        height="100%"
        alt="NextUI hero Image"
        src={ImgRegister}
        className="opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 absolute inset-0 z-0 h-full w-full rounded-none object-cover"
      />

      {/*<div className="flex items-start h-screen justify-center py-52">*/}
      <div className="flex items-center h-screen justify-center">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="flex flex-col w-full ">
            {/*<Card className="max-w-full  h-auto ">*/}
            {/*<Card className={selected==='login'? 'max-w-full h-[350px]':'max-w-full h-[410px]'}>*/}
            <Card className="max-w-full h-auto px-2">
              <CardBody className="overflow-hidden">
                <div className="flex flex-col gap-2 pt-3 pb-4 ">
                  <p className="font-bold text-inherit text-xl">Sign Up</p>
                  <p className="text-sm text-default-500">
                    Enter your information to create an account{" "}
                  </p>
                </div>
                <form
                  className="flex flex-col gap-3 "
                  onSubmit={handleSubmitRegister}
                >
                  <Input
                    isRequired
                    label="User"
                    value={username}
                    color={username ? "success" : "default"}
                    onValueChange={setUsername}
                    placeholder="Enter your user"
                    type="text"
                  />

                  <Input
                    isRequired
                    label="Email"
                    value={email}
                    onValueChange={setEmail}
                    isInvalid={isEmailInvalid}
                    color={
                      email
                        ? isEmailInvalid
                          ? "danger"
                          : "success"
                        : "default"
                    }
                    placeholder="Enter your email"
                    type="email"
                    errorMessage="Please enter a valid email"
                  />
                  <Input
                    isRequired
                    label="Mobile number"
                    value={mobile}
                    onValueChange={setMobile}
                    isInvalid={isMobileInvalid}
                    color={
                      mobile
                        ? isMobileInvalid
                          ? "danger"
                          : "success"
                        : "default"
                    }
                    placeholder="Enter your mobile number"
                    type={"tel"}
                    errorMessage="Please enter a valid mobile number"
                  />

                  <Input
                    isRequired
                    label="Email Team lead"
                    value={emailLead}
                    onValueChange={setEmailLead}
                    isInvalid={isEmailLeadInvalid}
                    color={
                      emailLead
                        ? isEmailLeadInvalid
                          ? "danger"
                          : "success"
                        : "default"
                    }
                    placeholder="Enter email of the team lead"
                    type="email"
                    errorMessage="Please enter a valid email"
                  />
                  <Input
                    isRequired
                    label="Password"
                    value={regisPassword}
                    color={regisPassword ? "success" : "default"}
                    onValueChange={setRegisPassword}
                    placeholder="Enter your password"
                    type={isVisible ? "text" : "password"}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label="toggle password visibility"
                      >
                        {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />

                  <Input
                    isRequired
                    label="Confirm Password"
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                    placeholder="Confirm your password"
                    isInvalid={isInvalidConfirmPassword}
                    color={
                      confirmPassword
                        ? isInvalidConfirmPassword
                          ? "danger"
                          : "success"
                        : "default"
                    }
                    errorMessage="Password missmatch"
                    type={isVisible ? "text" : "password"}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label="toggle password visibility"
                      >
                        {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />

                  {regisError && (
                    <div className="text-danger-500 text-[0.75rem] text-center">
                      {" "}
                      {regisErrorMsg}
                    </div>
                  )}
                  <div>
                    <p className="text-start  text-small">
                      Already have an account?{" "}
                      <Link size="sm" href={"/login"}>
                        Login
                      </Link>
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      isDisabled={
                        (email ? isEmailInvalid : true) ||
                        (mobile ? isMobileInvalid : true) ||
                        (emailLead ? isEmailLeadInvalid : true) ||
                        (confirmPassword ? isInvalidConfirmPassword : true)
                      }
                      fullWidth
                      color="primary"
                      type="submit"
                      isLoading={regisLoading}
                    >
                      {regisMsg}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
            <p className="text-start m-4 text-default-400 text-small">
              Contact & Support : {CONTACT}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

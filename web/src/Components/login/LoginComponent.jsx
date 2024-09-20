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
import Fingerprint from "../../assets/login.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { EyeSlashFilledIcon } from "../../assets/icons/EyeSlashFilledIcon.jsx";
import { EyeFilledIcon } from "../../assets/icons/EyeFilledIcon.jsx";

export function LoginComponent() {
  const [identity, setIdentity] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = React.useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [loginMsg, setLoginMsg] = React.useState("Login");
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const CONTACT = import.meta.env.VITE_CONTACT;

  const API_BASE_URL = import.meta.env.DEV
    ? import.meta.env.VITE_API_BASE_URL
    : "";

  const handleSubmitLogin = async (e) => {
    setLoading(true);
    setLoginMsg("Loading");
    e.preventDefault();
    {
      axios
        .post(`${API_BASE_URL}/api/auth/login`, { identity, password })
        .then(async (response) => {
          if ("success" === response.data?.status) {
            await setCookie(response.data.data);
            setLoading(false);
            setLoginMsg("Login");
            navigate("/");
          }
          setLoading(false);
          setLoginMsg("Login");
          setLoginError(true);
          setLoginErrorMsg("Login error : Internal server error");
        })
        .catch((error) => {
          setLoading(false);
          setLoginMsg("Login");
          setLoginError(true);
          setLoginErrorMsg("Login error : " + error.message);
          if (401 === error.response.status) {
            setLoginErrorMsg("Login error :Wrong user or password");
          }
        });
    }
  };

  const setCookie = async (jwt) => {
    Cookies.set("jwt", jwt, { expires: 7 });
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <Image
        width="100%"
        height="100%"
        alt="NextUI hero Image"
        src={Fingerprint}
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
                  <p className="font-bold text-inherit text-xl">Login</p>
                  <p className="text-sm text-default-500">
                    Enter your user below to login to your account
                  </p>
                </div>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmitLogin}
                >
                  <Input
                    isRequired
                    key="identity"
                    label="User"
                    value={identity}
                    color={identity ? "success" : "default"}
                    onValueChange={setIdentity}
                    isInvalid={loginError}
                    placeholder="Enter your user or email"
                    type="text"
                    size="lg"
                  />
                  <Input
                    isRequired
                    key="Password"
                    label="Password"
                    value={password}
                    color={password ? "success" : "default"}
                    onValueChange={setPassword}
                    placeholder="Enter your password"
                    size="lg"
                    isInvalid={loginError}
                    errorMessage={loginErrorMsg}
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
                  <div>
                    <p className="text-start text-small">
                      Need to create an account?{" "}
                      <Link size="sm" href={"/register"}>
                        Sign up
                      </Link>
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      fullWidth
                      isDisabled={!identity || !password}
                      isLoading={loading}
                      color="primary"
                      type="submit"
                    >
                      {loginMsg}
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

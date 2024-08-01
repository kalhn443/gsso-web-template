
import {Button, Card, CardBody, Image, Input, Link, Tab, Tabs} from "@nextui-org/react";
import React from "react";
import Fingerprint from "../../assets/login.svg";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {toast} from "react-toastify";


export function LoginComponent() {

    const [selected, setSelected] = React.useState("login");
    const [identity, setIdentity] =  React.useState('');
    const [password, setPassword] =  React.useState('');
    const [loginError, setLoginError] =  React.useState(false);
    const [loginErrorMsg, setLoginErrorMsg] =  React.useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [loginMsg, setLoginMsg] = React.useState('Login');


    const API_BASE_URL = import.meta.env.DEV? import.meta.env.VITE_API_BASE_URL: '';



    const handleSubmitLogin = async (e) => {
        console.log( import.meta.env)

        setLoading(true)
        setLoginMsg('Loading')
        e.preventDefault();
        {
            axios.post(`${API_BASE_URL}/api/auth/login`, { identity, password })
                .then(async response => {

                    if ("success" === response.data?.status) {
                        await setCookie(response.data.data)
                        setLoading(false)
                        setLoginMsg('Login')
                        navigate('/')
                    }
                    setLoading(false)
                    setLoginMsg('Login')
                    setLoginError(true)
                    setLoginErrorMsg('Login error : Internal server error')
                })
                .catch(error => {
                    setLoading(false)
                    setLoginMsg('Login')
                    setLoginError(true)
                    setLoginErrorMsg('Login error : '+ error.message)
                    if (401 === error.response.status ){
                        setLoginErrorMsg('Login error :Wrong user or password')
                    }

                });
        }


    };



    const setCookie = async (jwt) =>{
        Cookies.set('jwt',jwt,{ expires: 7 })
    }


    const [username, setUsername] =  React.useState('');
    const [email, setEmail] =  React.useState('');
    const [regisPassword, setRegisPassword] =  React.useState('');
    const [confirmPassword, setConfirmPassword] =  React.useState('');
    const [regisError, setRegisError] =  React.useState(false);
    const [regisErrorMsg, setRegisErrorMsg] =  React.useState("");
    const [regisLoading, setRegisLoading] = React.useState(false);
    const [regisMsg, setRegisMsg] = React.useState('Sign up');

    // check email format
    const validateEmail = (value) => value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i);
    const isEmailInvalid = React.useMemo(() => {
        if (email === "") return false;
        return !validateEmail(email);
    }, [email]);

    const isInvalidConfirmPassword = React.useMemo(() => {
        if (confirmPassword === "") return false;
        return regisPassword !== confirmPassword
    }, [regisPassword,confirmPassword]);


    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        setRegisLoading(true)
        setRegisMsg('Loading')

        axios.post(`${API_BASE_URL}/api/user`, { username,email, "password":confirmPassword })
            .then(async response => {

                if ("success" === response.data?.status) {
                    toast.success('User Created!',{autoClose:1500});
                    setRegisLoading(false)
                    setRegisMsg('Sign up')
                    setSelected("login")

                }else {
                    setRegisLoading(false)
                    setRegisMsg('Login')
                    setRegisError(true)
                    setRegisErrorMsg('Sign up error : Internal server error')
                }

            })
            .catch(error => {
                    setRegisLoading(false)
                    setRegisMsg('Sign up')
                    setRegisError(true)
                    setRegisErrorMsg('Sign up error : '+ error.message)
            });

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
                    <div className="flex flex-col w-full " >
                        {/*<Card className="max-w-full  h-auto ">*/}
                        {/*<Card className={selected==='login'? 'max-w-full h-[350px]':'max-w-full h-[410px]'}>*/}
                        <Card className="max-w-full h-[405px]">
                            <CardBody className="overflow-hidden">
                                <Tabs
                                    fullWidth
                                    size="lg"
                                    aria-label="Tabs form"
                                    selectedKey={selected}
                                    onSelectionChange={setSelected}
                                >
                                    <Tab key="login" title="Login">
                                        <form className="flex flex-col gap-4" onSubmit={handleSubmitLogin}>

                                            <Input
                                                isRequired label="User" value={identity}
                                                color={identity? "success":"default"}
                                                onValueChange={setIdentity}
                                                isInvalid={loginError}
                                                placeholder="Enter your user or email"
                                                type="text"
                                                size="lg"
                                            />
                                            <Input
                                                isRequired  label="Password" value={password}
                                                color={password? "success":"default"}
                                                onValueChange={setPassword}
                                                placeholder="Enter your password"
                                                type="password"
                                                size="lg"
                                                isInvalid={loginError}
                                                errorMessage={loginErrorMsg}

                                            />
                                            <p className="text-center text-small">
                                                Need to create an account?{" "}
                                                <Link size="sm" onPress={() => setSelected("sign-up")}>
                                                    Sign up
                                                </Link>
                                            </p>

                                            <div className="flex gap-2 justify-end">
                                                <Button fullWidth isDisabled={!identity || !password}  isLoading={loading} color="primary" type="submit">
                                                    {loginMsg}
                                                </Button>
                                            </div>
                                        </form>
                                    </Tab>
                                    <Tab key="sign-up" title="Sign up">
                                        <form className="flex flex-col gap-2 " onSubmit={handleSubmitRegister}>
                                            <Input
                                                isRequired label="User" value={username}
                                                color={username? "success":"default"}
                                                onValueChange={setUsername}
                                                placeholder="Enter your user"
                                                type="text"
                                                size="sm"

                                            />

                                            <Input
                                                isRequired label="Email" value={email}
                                                onValueChange={setEmail}
                                                isInvalid={isEmailInvalid}
                                                color={email?isEmailInvalid ? "danger" : "success":"default"}
                                                placeholder="Enter your email"
                                                type="email"
                                                size="sm"
                                                errorMessage="Please enter a valid email"

                                            />

                                            <Input
                                                isRequired  label="Password" value={regisPassword}
                                                color={regisPassword? "success":"default"}
                                                onValueChange={setRegisPassword}
                                                placeholder="Enter your password"
                                                type="password"
                                                size="sm"

                                            />

                                            <Input
                                                isRequired
                                                label="Confirm Password" value={confirmPassword}
                                                onValueChange={setConfirmPassword}
                                                placeholder="Confirm your password"
                                                isInvalid={isInvalidConfirmPassword}
                                                color={confirmPassword?isInvalidConfirmPassword ? "danger" : "success":"default"}
                                                errorMessage="Password missmatch"
                                                type="password"
                                                size="sm"
                                            />

                                            {regisError && <div className="text-danger-500 text-[0.75rem] text-center"> {regisErrorMsg}</div>}

                                            <p className="text-center text-small">
                                                Already have an account?{" "}
                                                <Link size="sm" onPress={() => setSelected("login")}>
                                                    Login
                                                </Link>
                                            </p>
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    isDisabled={(email?isEmailInvalid:true) || (confirmPassword?isInvalidConfirmPassword:true) }
                                                    fullWidth color="primary" type="submit"
                                                    isLoading={regisLoading}
                                                >
                                                    {regisMsg}
                                                </Button>
                                            </div>
                                        </form>
                                    </Tab>
                                </Tabs>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>

        </div>
    )
}

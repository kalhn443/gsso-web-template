
import {Button, Card, CardBody, CircularProgress, Image, Input, Link, Tab, Tabs} from "@nextui-org/react";
import React from "react";
import ImgNotfound from "../../assets/404.svg";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {toast} from "react-toastify";

export function NotfoundComponent() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="container mx-auto max-w-lg ">
                <div className="flex justify-center">
                    <Button color="success" className="text-white " variant="shadow"
                            onPress={handleClick}
                    >
                        Back to home
                    </Button>
                </div>
                <Image
                    width="100%"
                    height="100%"
                    alt="NextUI hero Image"
                    src={ImgNotfound}
                />


            </div>
        </div>
    )
}

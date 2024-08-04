import {
  Button,
  Card,
  CardBody,
  CircularProgress,
  Image,
  Input,
  Link,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React from "react";

import ImgServerError from "../../assets/500.svg";

export function ServerErrorComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container mx-auto max-w-lg ">
        <Image
          width="100%"
          height="100%"
          alt="NextUI hero Image"
          src={ImgServerError}
        />
      </div>
    </div>
  );
}

import React, {useEffect, useState} from 'react'

import {
    Avatar, AvatarIcon,
    Dropdown, DropdownItem, DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem
} from "@nextui-org/react";

import {Logo} from "./assets/logo.jsx";
import Dashboard from "./Components/dashboard/Dashboard.jsx";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

function App() {



  return (
      <>
          <Dashboard />

      </>
  )
}

export default App

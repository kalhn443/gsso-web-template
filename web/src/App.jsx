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
    const [userName, setUserName] = useState("guest");

    //const  avatar = "bg-gradient-to-br from-[#CCE3FD] to-[#66AAF9]"
    const navigate = useNavigate()

    const logout = ()=>{
        Cookies.remove('jwt');
        navigate('/login');
    }


  return (
      <>
          {/*<Navbar maxWidth="xl" position="sticky">*/}
          <Navbar maxWidth="xl"  position="static">
              <NavbarBrand>
                  <Link color="foreground" href="#">
                      <Logo />
                      <p className="font-bold text-inherit">GSSO</p>
                  </Link>

              </NavbarBrand>

              <NavbarContent className="hidden sm:flex gap-4  " justify="center">
                  <NavbarItem isActive >
                      <Link color="secondary" href="#" >

                      </Link>
                  </NavbarItem>
                  <NavbarItem >
                      <Link href="#" aria-current="page" color="foreground">

                      </Link>
                  </NavbarItem>

              </NavbarContent>

              <NavbarContent as="div" justify="end">
                  <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                          {/*<Avatar*/}
                          {/*    isBordered*/}
                          {/*    as="button"*/}
                          {/*    className="transition-transform"*/}
                          {/*    color="success"*/}
                          {/*    name="Jason Hughes"*/}
                          {/*    size="sm"*/}
                          {/*    // src="https://i.pravatar.cc/150?u=a042581f4e29026704d"*/}
                          {/*/>*/}
                          <Avatar
                              icon={<AvatarIcon />}

                              as="button"
                              classNames={{
                                  // base: avatar,
                                  icon: "text-black/50",
                              }}
                          />

                      </DropdownTrigger>
                      <DropdownMenu aria-label="Profile Actions" variant="flat">
                          <DropdownItem key="profile" className="h-14 gap-2" textValue="profile" >
                              <p className="font-semibold ">Signed in as</p>
                              <p className="font-semibold">{userName}</p>
                          </DropdownItem>

                          <DropdownItem key="logout" color="danger" onPress={logout}>
                              Log Out
                          </DropdownItem>
                      </DropdownMenu>
                  </Dropdown>

              </NavbarContent>
          </Navbar>

          <main className="container mx-auto max-w-7xl py-16  px-6 flex-grow">
              {/*<ToastContainer position="bottom-right" hideProgressBar={true} />*/}
              <Dashboard setUserName={setUserName}/>
          </main>

      </>
  )
}

export default App

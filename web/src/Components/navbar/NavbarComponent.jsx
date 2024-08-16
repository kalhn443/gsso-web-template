import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  AvatarIcon,
} from "@nextui-org/react";
import { Logo } from "../../assets/logo.jsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ModalViewProfile from "../profile/ModalViewProfile.jsx";
import { useDisclosure } from "@nextui-org/modal";

export default function NavbarComponent({ userLongin }) {
  const navigate = useNavigate();
  const modalViewProfile = useDisclosure();

  const logout = () => {
    Cookies.remove("jwt");
    navigate("/login");
  };
  const viewProfile = () => {
    modalViewProfile.onOpen();
  };

  return (
    <>
      <Navbar maxWidth="xl" position="static">
        <NavbarBrand>
          <Link color="foreground" href="#">
            <Logo />
            <p className="font-bold text-inherit">GSSO</p>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4  " justify="center">
          <NavbarItem isActive>
            <Link color="secondary" href="#"></Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" aria-current="page" color="foreground"></Link>
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
                  // base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                  icon: "text-black/50",
                }}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                textValue="profile"
                onPress={viewProfile}
              >
                <p className="font-semibold ">Signed in as</p>
                <p className="font-semibold">{userLongin.username}</p>
              </DropdownItem>

              <DropdownItem key="logout" color="danger" onPress={logout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      <ModalViewProfile
        isOpen={modalViewProfile.isOpen}
        onClose={modalViewProfile.onClose}
        username={userLongin}
      />
    </>
  );
}

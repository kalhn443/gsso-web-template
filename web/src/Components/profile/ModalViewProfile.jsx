import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Avatar,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { selectOperation } from "../dashboard/data.js";
import { EyeSlashFilledIcon } from "../../assets/icons/EyeSlashFilledIcon.jsx";
import { EyeFilledIcon } from "../../assets/icons/EyeFilledIcon.jsx";

export default function ModalViewProfile({ isOpen, onClose, userInfo, role }) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const roleOptions = [
    { key: "admin", label: "admin" },
    { key: "owner", label: "owner" },
  ];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    emailLead: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    if (userInfo) {
      setFormData((prevData) => ({
        ...prevData,
        ...userInfo,
      }));
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      role: value,
    }));
  };

  const API_BASE_URL = import.meta.env.DEV
    ? import.meta.env.VITE_API_BASE_URL
    : "";

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/user/${formData.username}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.status === "success") {
        toast.success("Update Success!", { autoClose: 1500 });
        onClose();
      } else {
        console.error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
      toast.error("Failed to Update user!", { autoClose: 2500 });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      backdrop="blur"
      className="modal-view-profile-container"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="pt-4 pb-1 flex flex-col gap-3 items-center justify-center">
              <Avatar
                isBordered
                color="success"
                radius="full"
                size="lg"
                classNames={{
                  base: "bg-gradient-to-br from-success-300 to-primary-300",
                  icon: "text-black/80",
                }}
              />
              <div>{formData.username || "User"}</div>
            </ModalHeader>
            <ModalBody className="mb-4">
              <Input
                label="Name"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your name"
                disabled={true}
              />
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                type="email"
              />
              <Input
                label="Mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
              />
              <Input
                label="Team Lead"
                name="emailLead"
                value={formData.emailLead}
                onChange={handleInputChange}
                placeholder="Enter team lead's email"
                type="email"
              />
              {role === "admin" && (
                <>
                  <Select
                    disallowEmptySelection
                    label="Role"
                    placeholder="Select a role"
                    selectedKeys={formData.role ? [formData.role] : []}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  >
                    {roleOptions.map((role) => (
                      <SelectItem key={role.key} value={role.key}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
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
                  <Button color="primary" onPress={handleSubmit}>
                    Update
                  </Button>
                </>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

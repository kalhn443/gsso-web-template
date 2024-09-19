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
} from "@nextui-org/react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function ModalViewProfile({ isOpen, onClose, userInfo, role }) {
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
                  <Input
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Enter your role"
                  />
                  <Input
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
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

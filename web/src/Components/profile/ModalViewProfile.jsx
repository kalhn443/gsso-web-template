import React from "react";
import {
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  ModalContent,
  Avatar,
  Input,
} from "@nextui-org/react";
import { ModalFooter } from "@nextui-org/modal";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ModalViewProfile({ isOpen, onClose, username }) {
  return (
    <>
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
                  }} // src="https://nextui.org/avatars/avatar-1.png"
                />
                <div>{username.username}</div>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  value={username.username}
                  // labelPlacement="outside"
                />
                <Input
                  label="Email"
                  value={username.email}
                  //labelPlacement="outside"
                />
                <Input
                  label="Mobile"
                  value={username.mobile}
                  // labelPlacement="outside"
                />
                <Input
                  label="Team Lead"
                  value={username.emailLead}
                  // labelPlacement="outside"
                />
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

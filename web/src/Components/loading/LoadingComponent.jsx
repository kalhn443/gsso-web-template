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
import { tailspin } from "ldrs";

tailspin.register();

export default function ModalProvLoading({ isOpen, onClose }) {
  return (
    <>
      <Modal
        className="glass-background"
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        backdrop="transparent"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="loading-container">
                  <l-tailspin
                    size="60"
                    stroke="6"
                    speed="1.4"
                    color="#006FEE"
                  ></l-tailspin>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

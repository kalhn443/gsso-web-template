import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Snippet,
} from "@nextui-org/react";
import { convertServiceJson } from "./utils.js";

export default function ModalViewService({ isOpen, onClose, service }) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="outside"
        size="4xl"
        backdrop="blur"
        className="relative flex min-h-dvh flex-col py-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className=" items-center justify-center">
                VIEW SERVICE
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col items-center justify-center   py-2">
                  <div className="flex max-w-4xl w-full gap-4">
                    <div className="flex flex-col gap-2 py-2 w-full">
                      <Snippet
                        color="success"
                        variant="flat"
                        className="w-full"
                        hideSymbol
                      >
                        <div className="w-full whitespace-pre-wrap break-words">
                          {JSON.stringify(convertServiceJson(service), null, 2)}
                        </div>
                      </Snippet>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-center  max-w-lg w-full flex-wrap sm:flex-nowrap  py-2  ">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </div>
                </form>
                {/*</section>*/}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

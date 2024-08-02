import React from "react";
import {Modal, Button, ModalBody, ModalHeader, ModalContent, Input} from "@nextui-org/react";
import {ModalFooter, useDisclosure} from "@nextui-org/modal";

import {PlusIcon} from "../../assets/icons/PlusIcon.jsx";
import {FilePond, registerPlugin} from "react-filepond";
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImagePreview);


export default function ModalUpload() {
    const API_BASE_URL = import.meta.env.DEV? import.meta.env.VITE_API_BASE_URL: '';

    const {isOpen, onOpen, onOpenChange,onClose} = useDisclosure();
    const [file, setFile] = React.useState(File | null>null)

    React.useEffect(() => {
        setFile(null)
    }, [isOpen]);


    return (
        <>
            <Button
                onPress={onOpen}
                color="primary"
                variant="shadow"
                endContent={<PlusIcon /> }>
                Upload T16
            </Button>

            <Modal isOpen={isOpen}
                   onClose={onClose}
                   onOpenChange={onOpenChange}
                   backdrop="blur"
            >
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-primary">Upload T16</ModalHeader>
                    <ModalBody>

                        <div className="h-auto">
                            <FilePond
                                files={file}
                                onupdatefiles={setFile}
                                allowMultiple={file}
                                maxFiles={3}
                                server={API_BASE_URL+"/api/upload"}
                                name="file"
                                labelIdle='<span >ลากและวางไฟล์ของคุณ หรือ</span> <span class="filepond--label-action">เรียกดู</span>'
                            />
                        </div>



                    </ModalBody>

                </>
            )}
        </ModalContent>
        </Modal>
        </>
    );
}

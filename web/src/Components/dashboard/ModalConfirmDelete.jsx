import React from "react";
import {Modal, Button, ModalBody, ModalHeader, ModalContent} from "@nextui-org/react";
import {ModalFooter} from "@nextui-org/modal";
import axios from "axios";
import Cookies from "js-cookie";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function ModalConfirmDelete({ isOpen, onClose, service,setServices }) {
    const navigate = useNavigate();

    const handleDelete = async(e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        const API_BASE_URL = import.meta.env.DEV? 'http://127.0.0.1:3010': '';
        axios.delete(`${API_BASE_URL}/api/service/${service.ID}`, {
            headers: {
                'Authorization': 'Bearer '+Cookies.get('jwt'),
                'Content-Type': 'application/json'
                // เพิ่ม header อื่นๆ ตามต้องการ
            }
        })
            //await axios.post('/api/service', formData)
            .then(response => {
                if (200 === response.status){
                    toast.success('Update Success!',{autoClose:1500});
                    setServices(response.data?.services? response.data.services : new Set([]))
                    //server จะต้อง update แล้ว ส่ง data ทั้งหมดหรือเฉพาะ user กลับมา
                    // setUsers(response.data.services? response.data.services : new Set([]))

                    onClose()
                }})
            .catch(error => {
                toast.error('Failed to Update service!',{autoClose:2500});
                console.log(error.response)
                if (401 === error.response?.status ){
                    navigate('/login');
                }
            });
    };




    return (
        <>
    <Modal isOpen={isOpen}
           onClose={onClose}
           classNames={{
               backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
           }}
    >
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-danger">ยืนยันการลบ</ModalHeader>
                    <ModalBody>
                        <p>
                            คุณแน่ใจหรือไม่ที่ต้องการลบ <span className="text-danger">{service.serviceId}?</span>  การกระทำนี้ไม่สามารถย้อนกลับได้
                        </p>
                    </ModalBody>
                    <ModalFooter>


                        <Button color="danger" variant="light"  onPress={handleDelete}>
                        DELETE
                        </Button>
                        <Button color="primary" onPress={onClose}>
                            CANCEL
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
        </>
    );
}

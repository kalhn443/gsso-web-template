import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    Input,
    Select,
    SelectItem, Switch, Divider, Snippet
} from "@nextui-org/react";
import {PlusIcon} from "../../assets/icons/PlusIcon.jsx";
import {useDisclosure} from "@nextui-org/modal";
import {selectOperation, selectSite} from "./data.js";
import {Textarea} from "@nextui-org/input";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import confetti from 'canvas-confetti';
import {toast} from "react-toastify";
import Cookies from "js-cookie";

export default function ModalNewService({setServices}) {
    const {isOpen, onOpen, onOpenChange,onClose} = useDisclosure();
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        projectSite: "",
        allowOperation:[],
        serviceId: '',
        serviceName: '',
        otpDigit: '',
        referenceDigit: '',
        lifeTimeoutMins: '',
        smsSender: '',
        smsThai: '',
        smsEng: '',
        allowSmsRoaming: true,
        smscDeliveryReceipt: true,
        waitDR: false,
        emailFrom: '',
        emailSubject: '',
        emailBody: '',
        seedKey: '111111111111111111111111',
        status : '',
        owner : '',
    });

    const handleChange = (name, value) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleSubmit = async(e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        console.log(formData);

        axios.post('http://127.0.0.1:3010/api/service', formData,{
            headers: {
                'Authorization': 'Bearer '+Cookies.get('jwt'),
                'Content-Type': 'application/json'
                // เพิ่ม header อื่นๆ ตามต้องการ
            }
        })
        //await axios.post('/api/service', formData)
            .then(response => {
                if (200 === response.status){
                    toast.success('Create New Service Success!',{autoClose:1500});
                    console.log(response.data)
                    //server จะต้อง create แล้ว ส่ง data ทั้งหมดหรือเฉพาะ user กลับมา
                   // setServices(response.data.services? response.data.services : new Set([]))
                    setServices(response.data? response.data : new Set([]))
                    //confetti();

                    //reset form หลังจาก submit
                    setFormData({ projectSite: "", allowOperation:[], serviceId: '', serviceName: '', otpDigit: '', referenceDigit: '', lifeTimeoutMins: '', smsSender: '', smsThai: '', smsEng: '', allowSmsRoaming: true, smscDeliveryReceipt: true, waitDR: false, emailFrom: '', emailSubject: '', emailBody: '', seedKey: '111111111111111111111111' });
                    onClose()
                }            })
            .catch(error => {
                toast.error('Failed to create new service!',{autoClose:2500});
                console.log(error.response)
                if (401 === error.response?.status ){
                    navigate('/login');
                }

            });


    };




    return (
        <>
            {/*<ToastContainer*/}
            {/*    position="bottom-right"*/}
            {/*    hideProgressBar={true}*/}
            {/*/>*/}



            <Button onPress={onOpen} color="primary"  endContent={<PlusIcon /> }>
                New Service
            </Button>


            <Modal isOpen={isOpen}
                   onOpenChange={onOpenChange}
                   //isDismissable ={false}
                   placement
                   scrollBehavior="outside" size="3xl" backdrop="blur" className="relative flex min-h-dvh flex-col py-4">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className=" items-center justify-center">NEW SERVICE</ModalHeader>
                            <ModalBody>

                                {/*<section className="flex justify-center   py-8">*/}

                                <form className="flex flex-col items-center justify-center  gap-4 w py-4"
                                      onSubmit={handleSubmit}
                                >
                                    {/*<Button color="primary" onPress={show} >*/}
                                    {/*    show console*/}
                                    {/*</Button>*/}
                                    <div className="flex max-w-lg w-full flex-wrap sm:flex-nowrap gap-4 ">

                                        <Select
                                            label="Project Site"
                                            isRequired
                                            size="md"
                                            placeholder="VAS for AIS-PLAY only"
                                            name="projectSite"
                                            selectedKeys={formData.projectSite ? [formData.projectSite] : []}
                                            onChange={(e) => handleChange('projectSite', e.target.value)}


                                        >
                                            {selectSite.map((site) => (
                                                <SelectItem key={site.key} value={site.key}>
                                                    {site.label}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Select
                                            label="Allow Operation"
                                            // className="max-w-xs"
                                            isRequired
                                            size="md"
                                            selectionMode="multiple"
                                            placeholder="Multiple selection"
                                            name="allowOperation"
                                            selectedKeys={formData.allowOperation}
                                            onSelectionChange={(keys) => handleChange('allowOperation', Array.from(keys))}
                                            // value={formData.allowOperation}
                                            // onChange={handleMultiSelect}
                                            // selectedKeys={selectedValues}
                                            // onSelectionChange={handleMultiSelect}
                                        >
                                            {selectOperation.map((oper) => (
                                                <SelectItem key={oper.key} value={oper.key}>
                                                    {oper.label}
                                                </SelectItem>
                                            ))}
                                        </Select>


                                    </div>


                                    <div className="flex max-w-lg w-full flex-wrap sm:flex-nowrap gap-4">
                                        <Input
                                            isRequired label="Service ID"
                                            size="md"
                                            placeholder="Auto generated"
                                            type="text"
                                            isDisabled
                                        />


                                        <Input
                                            isRequired label="Service Name"
                                            size="md"
                                            placeholder="English only max 50 digit "
                                            type="text"
                                            value={formData.serviceName}
                                            name="serviceName"
                                            onChange={(e) => handleChange('serviceName', e.target.value)}
                                            isClearable
                                            onClear={() => handleChange('serviceName', '')}
                                        />
                                    </div>
                                    <div className="flex max-w-lg w-full flex-wrap sm:flex-nowrap gap-4 ">
                                        <Input
                                            isRequired label="OTP Digit"
                                            size="md"
                                            placeholder="Enter number of digit [4-12]"
                                            type="number"
                                            value={formData.otpDigit}
                                            name="otpDigit"
                                            onChange={(e) => handleChange('otpDigit', e.target.value)}
                                            min={4}
                                            max={12}
                                        />


                                        <Input
                                            isRequired label="Reference Digit"
                                            size="md"
                                            placeholder="Enter number of digit [4-12]"
                                            type="number"
                                            value={formData.referenceDigit}
                                            name="referenceDigit"
                                            onChange={(e) => handleChange('referenceDigit', e.target.value)}
                                            min={4}
                                            max={12}

                                        />
                                    </div>
                                    <div className="flex max-w-lg w-full flex-wrap sm:flex-nowrap gap-4 ">
                                        <Input
                                            isRequired label="Life Timeout Mins"
                                            size="md"
                                            placeholder="Enter number [5-15] Mins."
                                            type="number"
                                            value={formData.lifeTimeoutMins}
                                            onChange={(e) => handleChange('lifeTimeoutMins', e.target.value)}
                                            min={5}
                                            max={15}

                                            // className="pr-2 sm:w-1/2 "
                                        />
                                        <Input
                                            isRequired label="Seed Key"
                                            size="md"
                                            placeholder="111111111111111111111111"
                                            type="text"
                                            isDisabled
                                            // className="pr-2 sm:w-1/2 "
                                        />

                                    </div>
                                    <Divider className="max-w-lg w-full  my-4"/>

                                    <div className="flex max-w-lg w-full flex-wrap sm:flex-nowrap gap-4 ">
                                        <Input
                                            isRequired label="SMS Sender"
                                            placeholder="Max 11 digit"
                                            type="text"
                                            maxLength={11}
                                            value={formData.smsSender}
                                            onChange={(e) => handleChange('smsSender', e.target.value)}
                                            isClearable
                                            onClear={() => handleChange('smsSender', '')}
                                            // className="w-1/2"

                                        />

                                    </div>
                                    <div className="flex max-w-lg w-full flex-wrap sm:flex-nowrap gap-4 ">

                                        <Textarea
                                            isRequired label="SMS Thai"
                                            minRows={2}
                                            placeholder="Max 350 digit"
                                            value={formData.smsThai}
                                            onChange={(e) => handleChange('smsThai', e.target.value)}
                                            maxLength={350}
                                        />
                                    </div>
                                    <div className="flex max-w-lg w-full flex-wrap sm:flex-nowrap gap-4 ">

                                        <Textarea
                                            isRequired label="SMS Eng"
                                            minRows={2}
                                            placeholder="Max 350 digit"
                                            value={formData.smsEng}
                                            onChange={(e) => handleChange('smsEng', e.target.value)}
                                            max={350}
                                        />
                                    </div>
                                    <div className="flex max-w-lg w-full flex-col sm:flex-nowrap ">

                                        <p className="text-small">
                                            <span className="text-primary">&lt;#OTP&gt;</span>
                                            <span> จะถูกแทนค่าด้วย </span>
                                            <span className="text-primary">OTP</span>

                                        </p>
                                        <p className="text-small">
                                            <span className="text-primary">&lt;#REF&gt;</span>
                                            <span> จะถูกแทนค่าด้วย </span>
                                            <span className="text-primary">Reference</span>

                                        </p>
                                        <p className="text-small">
                                            <span className="text-primary">&lt;#SERVICE&gt;</span>
                                            <span> จะถูกแทนค่าด้วย </span>
                                            <span className="text-primary">Service Name</span>

                                        </p>
                                        <p className="text-small">
                                            <span className="text-primary">&lt;#NUMBER&gt;</span>
                                            <span> จะถูกแทนค่าด้วย </span>
                                            <span className="text-primary"> Msisdn</span>

                                        </p>
                                        <p className="text-small">
                                            <span className="text-primary">&lt;#LIFETIMEOUT&gt;</span>
                                            <span> จะถูกแทนค่าด้วย </span>
                                            <span className="text-primary">รหัสหมดอายุในกี่นาที่</span>

                                        </p>
                                        <p className="text-small">
                                            <span className="text-primary">&lt;#EXPIRETIME&gt;</span>
                                            <span> จะถูกแทนค่าด้วย </span>
                                            <span className="text-primary">รหัสจะใช้ได้ถึงเมื่อไร?</span>
                                        </p>
                                        <p className="text-small text-danger"> * เวลาอ้างอิงจาก lifeTimeoutMins
                                        </p>
                                        <p className="text-small">
                                            <span className="text-primary">&lt;#freetextTH&gt;</span>
                                            <span> จะถูกแทนค่าด้วย </span>
                                            <span className="text-primary"> msgTextTH จาก Request</span>

                                        </p>
                                        <p className="text-small text-danger"
                                        > *สามารถใส่ค่า default ได้ ex. &lt;#freetextTH=AIS&gt;
                                        </p>
                                        <p className="text-small">
                                            <span className="text-primary">&lt;#freetextENG&gt;</span>
                                            <span> จะถูกแทนค่าด้วย </span>
                                            <span className="text-primary"> msgTextENG จาก Request</span>
                                        </p>
                                        <p className="text-small text-danger">
                                            *สามารถใส่ค่า default ได้ ex. &lt;#freetextENG=AIS&gt;
                                        </p>
                                        <p className="text-small text-warning"
                                        > ตัวอย่าง
                                        </p>
                                        <div className="flex flex-col gap-2 py-2">
                                            <Snippet color="warning" hideSymbol>
                                            <span
                                                className="text-small break-words  whitespace-normal overflow-wrap-normal">
                                                บริการจาก &lt;#freetextTH=AIS&gt; รหัส OTP คือ &lt;#OTP&gt; (ref:&lt;#REF&gt;) จะหมดอายุใน &lt;#LIFETIMEOUT&gt; นาที และใช้ได้ถึง &lt;#EXPIRETIME&gt;
                                            </span>
                                            </Snippet>
                                            <Snippet color="warning" hideSymbol>
                                            <span
                                                className="text-small break-words  whitespace-normal overflow-wrap-normal">
                                                บริการจาก AIS รหัส OTP คือ 248971 (ref:871253) จะหมดอายุใน 5 นาที และใช้ได้ถึง 17/07/2024 15:32:12
                                            </span>
                                            </Snippet>
                                        </div>
                                        <Switch className="py-1 "
                                            // defaultSelected={isSelected}
                                            // checked={isSelected}
                                            // onValueChange={setIsSelected}
                                                isSelected={formData.allowSmsRoaming}
                                                type="checkbox"
                                                onValueChange={(isChecked) => handleChange('allowSmsRoaming', isChecked)}

                                        >
                                            Allow roaming <span
                                            className={formData.allowSmsRoaming ? 'text-small text-success' : 'text-small text-danger'}
                                            color="danger">  {formData.allowSmsRoaming ? 'ให้ลูกค้าต่างประเทศสามารถรับ SMS ได้' : 'ลูกค้าต่างประเทศไม่สามารถรับ SMS ได้'}</span>
                                        </Switch>

                                        <Switch className="py-1"
                                                isSelected={formData.smscDeliveryReceipt}
                                                type="checkbox"
                                                onValueChange={(isChecked) => handleChange('smscDeliveryReceipt', isChecked)}
                                        >
                                            SMS Delivery receipt
                                        </Switch>

                                        <Switch className="pt-1"
                                                isSelected={formData.waitDR}
                                                type="checkbox"
                                                onValueChange={(isChecked) => handleChange('waitDR', isChecked)}
                                        >
                                            Wait Dr <span className="text-small text-danger"> *GSSO จะรอ DR จาก SMPPGW ซึ่งใช้เวลา 4-10 นาที (แนะนำให้ปิด) </span>

                                        </Switch>
                                        {/*<p className="text-small text-danger pb-2"*/}
                                        {/*   color="danger"> **/}
                                        {/*</p>*/}
                                    </div>
                                    <Divider className="max-w-lg w-full  my-4"/>
                                    <div
                                        className="flex flex-col max-w-lg w-full flex-wrap sm:flex-nowrap gap-4 ">
                                        <Input
                                            // isRequired
                                            label="Email From"
                                            size="md"
                                            placeholder="Default : AIS@ais.co.th"
                                            type="text"
                                            value={formData.emailFrom}
                                            onChange={(e) => handleChange('emailFrom', e.target.value)}

                                        />


                                        <Input
                                            // isRequired
                                            label="Email Subject"
                                            size="md"
                                            placeholder="Enter email subject"
                                            type="text"
                                            value={formData.emailSubject}
                                            onChange={(e) => handleChange('emailSubject', e.target.value)}
                                        />

                                        <Textarea
                                            // isRequired
                                            label="Email Body"
                                            minRows={2}
                                            placeholder="Enter email body"
                                            value={formData.emailBody}
                                            onChange={(e) => handleChange('emailBody', e.target.value)}
                                        />


                                    </div>
                                    <div className="flex max-w-lg w-full flex-col sm:flex-nowrap ">

                                        <p className="text-small text-primary">
                                            &lt;#OTP&gt; , &lt;#REF&gt; ,&lt;#SERVICE&gt;,&lt;#NUMBER&gt;,
                                        </p>
                                        <p className="text-small text-primary">
                                            &lt;#LIFETIMEOUT&gt;,&lt;#EXPIRETIME&gt;,
                                        </p>
                                        <p className="text-small text-primary">
                                            &lt;#freetextTH&gt;,&lt;#freetextTH=default&gt;,
                                        </p>
                                        <p className="text-small text-primary">
                                            &lt;#freetextENG&gt;,&lt;#freetextENG=default&gt;
                                        </p>
                                        <p className="text-small text-danger"> *ใช้ TAG ต่างๆ ได้เหมือนกับ SMS
                                        </p>

                                        <p className="text-small pt-2">
                                            <span className="">*ต้องการขึ้นบรรทัดใหม่ให้ใส่ </span>
                                            <span className="text-primary"> {"<p>"} </span>
                                            <span className=""> ไว้ด้านหน้า</span>
                                        </p>
                                        <p className="text-small ">
                                            <span className="">*ต้องการเว้นบรรทัดให้ใส่ </span>
                                            <span className="text-primary"> {"<p>&nbsp;</p>"} </span>
                                        </p>

                                        <p className="text-small text-warning"
                                        > ตัวอย่าง
                                        </p>
                                        <div className="flex flex-col gap-2 py-2">
                                            <Snippet color="warning" hideSymbol>
                                            <span
                                                className="text-small break-words  whitespace-normal overflow-wrap-normal">
                                                {"<p>บริการจาก <#freetextTH=AIS> รหัส OTP คือ <#OTP> จะหมดอายุใน <#LIFETIMEOUT> นาทีและใช้ได้ถึง <#EXPIRETIME> <p>&nbsp;</p> <p>Services from <#freetextENG=AIS> Password is <#OTP>. Password will be expired in <#LIFETIMEOUT> minutes."}
                                            </span>
                                            </Snippet>
                                            <Snippet color="warning" hideSymbol>
                                                <p className="text-small break-words  whitespace-normal overflow-wrap-normal">
                                                    {"บริการจาก AIS รหัส OTP คือ 161824 จะหมดอายุใน 5 นาทีและใช้ได้ถึง 19/07/2024 15:19:42\n\n"}
                                                </p>
                                                <p>&nbsp;</p>
                                                <p className="text-small break-words  whitespace-normal overflow-wrap-normal">
                                                    {"Services from AIS Password is 161824. Password will be expired in 5 minutes."}
                                                </p>
                                            </Snippet>
                                        </div>

                                    </div>
                                    <div className="flex flex-row items-center justify-center  max-w-lg w-full flex-wrap sm:flex-nowrap  py-4 gap-4 ">

                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" type="submit">
                                            Create
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

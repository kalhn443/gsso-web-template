import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Divider,
  Snippet,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import { PlusIcon } from "../../assets/icons/PlusIcon.jsx";
import { useDisclosure } from "@nextui-org/modal";
import {
  selectAllowState,
  selectOperation,
  selectSite,
  statusOptions,
} from "./data.js";
import { Textarea } from "@nextui-org/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { CopyDocumentIcon } from "../../assets/icons/CopyDocumentIcon.jsx";

export default function ModalEditService({
  isOpen,
  onClose,
  isAdmin = false,
  service,
  setServices,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState();

  React.useEffect(() => {
    setFormData({
      allowOperation: ["AIS", "non-AIS", "INTER"],
      serviceId: "",
      serviceName: "",
      operAis: {
        oper: "AIS",
        otpDigit: "",
        refDigit: "",
        lifeTimeoutMins: "",
        smsSender: "",
        smsBodyThai: "",
        smsBodyEng: "",
        allowSmsRoaming: "FALSE",
        smscDeliveryReceipt: "TRUE",
        waitDR: "FALSE",
        emailFrom: "",
        emailSubject: "",
        emailBody: "",
        seedkey: "111111111111111111111111",
        refundFlag: "FALSE",
        state: ["1", "13", "15"],
      },
      operNonAis: {
        oper: "non-AIS",
        otpDigit: "",
        refDigit: "",
        lifeTimeoutMins: "",
        smsSender: "",
        smsBodyThai: "",
        smsBodyEng: "",
        allowSmsRoaming: "FALSE",
        smscDeliveryReceipt: "TRUE",
        waitDR: "FALSE",
        emailFrom: "",
        emailSubject: "",
        emailBody: "",
        seedkey: "111111111111111111111111",
        refundFlag: "FALSE",
      },
      operInter: {
        oper: "Inter",
        otpDigit: "",
        refDigit: "",
        lifeTimeoutMins: "",
        smsSender: "",
        smsBodyThai: "",
        smsBodyEng: "",
        allowSmsRoaming: "FALSE",
        smscDeliveryReceipt: "TRUE",
        waitDR: "FALSE",
        emailFrom: "",
        emailSubject: "",
        emailBody: "",
        seedkey: "111111111111111111111111",
        refundFlag: "FALSE",
      },
      status: "empty",
      owner: "",
      projectSite: "",
    });
    if (service) {
      setFormData((prevData) => ({
        ...prevData,
        ...service,
        operAis: { ...prevData.operAis, ...service.operAis },
        operNonAis: { ...prevData.operNonAis, ...service.operNonAis },
        operInter: { ...prevData.operInter, ...service.operInter },
      }));
    }
  }, [service]);

  const handleChange = (name, value, operator = null) => {
    setFormData((prevData) => {
      if (
        operator &&
        ["operAis", "operNonAis", "operInter"].includes(operator)
      ) {
        return {
          ...prevData,
          [operator]: {
            ...prevData[operator],
            [name]:
              typeof value === "boolean"
                ? value.toString().toUpperCase()
                : value,
          },
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };
  const show = () => {
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const API_BASE_URL = import.meta.env.DEV
      ? import.meta.env.VITE_API_BASE_URL
      : "";
    axios
      .put(`${API_BASE_URL}/api/service`, formData, {
        headers: {
          Authorization: "Bearer " + Cookies.get("jwt"),
          "Content-Type": "application/json",
        },
      })
      //await axios.post('/api/service', formData)
      .then((response) => {
        if (200 === response.status) {
          toast.success("Update Success!", { autoClose: 1500 });
          setServices(
            response.data?.services ? response.data.services : new Set([]),
          );
          //server จะต้อง update แล้ว ส่ง data ทั้งหมดหรือเฉพาะ user กลับมา
          // setUsers(response.data.services? response.data.services : new Set([]))

          onClose();
        }
      })
      .catch((error) => {
        toast.error("Failed to Update service!", { autoClose: 2500 });
        console.log(error.response);
        if (401 === error.response?.status) {
          navigate("/login");
        }
      });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        //  onOpenChange={onOpenChange}
        //isDismissable ={false}
        scrollBehavior="outside"
        size="2xl"
        backdrop="blur"
        className="relative flex min-h-dvh flex-col py-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className=" items-center justify-center">
                UPDATE SERVICE
              </ModalHeader>
              <ModalBody>
                {/*<section className="flex justify-center   py-8">*/}

                <form
                  className="flex flex-col  items-center justify-center  gap-4 w py-4"
                  onSubmit={handleSubmit}
                >
                  {/*<Button color="primary" onPress={show} >*/}
                  {/*    show console*/}
                  {/*</Button>*/}
                  <div className="flex w-full flex-wrap sm:flex-nowrap gap-4 ">
                    <Select
                      disallowEmptySelection
                      label="Project Site"
                      isRequired
                      isDisabled={!isAdmin}
                      size="md"
                      color={formData.projectSite ? "success" : "danger"}
                      placeholder="VAS for AIS-PLAY only"
                      name="projectSite"
                      selectedKeys={
                        formData.projectSite ? [formData.projectSite] : []
                      }
                      onChange={(e) =>
                        handleChange("projectSite", e.target.value)
                      }
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
                      color={formData.allowOperation ? "success" : "danger"}
                      selectedKeys={formData.allowOperation}
                      onSelectionChange={(keys) =>
                        handleChange("allowOperation", Array.from(keys))
                      }
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

                  <div className="flex w-full flex-wrap sm:flex-nowrap gap-4">
                    <Input
                      isRequired
                      label="Service ID"
                      size="md"
                      value={formData.serviceId}
                      placeholder="Auto generated"
                      type="text"
                      isDisabled
                    />

                    <Input
                      isRequired
                      label="Service Name"
                      size="md"
                      placeholder="English only max 50 digit "
                      type="text"
                      color={formData.serviceName ? "success" : "danger"}
                      value={formData.serviceName}
                      name="serviceName"
                      onChange={(e) =>
                        handleChange("serviceName", e.target.value)
                      }
                    />
                  </div>

                  {formData.allowOperation.includes("AIS") && (
                    <div className="flex  w-full flex-wrap  gap-4">
                      <Divider className=" w-full  my-4" />
                      <h3>AIS Operation</h3>
                      <div className="flex  w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          isRequired
                          label="OTP Digit"
                          size="md"
                          placeholder="Enter number of digit [4-12]"
                          type="number"
                          color={
                            formData.operAis.otpDigit ? "success" : "danger"
                          }
                          value={formData.operAis.otpDigit}
                          name="otpDigit"
                          onChange={(e) =>
                            handleChange("otpDigit", e.target.value, "operAis")
                          }
                          min={4}
                          max={12}
                        />

                        <Input
                          isRequired
                          label="Reference Digit"
                          size="md"
                          placeholder="Enter number of digit [4-12]"
                          type="number"
                          color={
                            formData.operAis.refDigit ? "success" : "danger"
                          }
                          value={formData.operAis.refDigit}
                          name="refDigit"
                          onChange={(e) =>
                            handleChange("refDigit", e.target.value, "operAis")
                          }
                          min={4}
                          max={12}
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          isRequired
                          label="Life Timeout Mins"
                          size="md"
                          placeholder="Enter number [5-15] Mins."
                          type="number"
                          color={
                            formData.operAis.lifeTimeoutMins
                              ? "success"
                              : "danger"
                          }
                          value={formData.operAis.lifeTimeoutMins}
                          onChange={(e) =>
                            handleChange(
                              "lifeTimeoutMins",
                              e.target.value,
                              "operAis",
                            )
                          }
                          min={5}
                          max={15}

                          // className="pr-2 sm:w-1/2 "
                        />
                        <Input
                          isRequired
                          label="Seed Key"
                          size="md"
                          placeholder="111111111111111111111111"
                          type="text"
                          isDisabled
                          // className="pr-2 sm:w-1/2 "
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          isRequired
                          label="SMS Sender"
                          placeholder="Max 11 digit"
                          type="text"
                          color={
                            formData.operAis.smsSender ? "success" : "danger"
                          }
                          maxLength={11}
                          value={formData.operAis.smsSender}
                          onChange={(e) =>
                            handleChange("smsSender", e.target.value, "operAis")
                          }
                          //isClearable
                          //onClear={() => handleChange('smsSender', '')}
                          // className="w-1/2"
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Textarea
                          isRequired
                          label="SMS Thai"
                          minRows={2}
                          placeholder="Max 350 digit"
                          color={
                            formData.operAis.smsBodyThai ? "success" : "danger"
                          }
                          value={formData.operAis.smsBodyThai}
                          onChange={(e) =>
                            handleChange(
                              "smsBodyThai",
                              e.target.value,
                              "operAis",
                            )
                          }
                          maxLength={350}
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Textarea
                          isRequired
                          label="SMS Eng"
                          minRows={2}
                          placeholder="Max 350 digit"
                          color={
                            formData.operAis.smsBodyEng ? "success" : "danger"
                          }
                          value={formData.operAis.smsBodyEng}
                          onChange={(e) =>
                            handleChange(
                              "smsBodyEng",
                              e.target.value,
                              "operAis",
                            )
                          }
                          max={350}
                        />
                      </div>
                      <div className="flex   w-full flex-col sm:flex-nowrap ">
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
                          <span className="text-primary">
                            &lt;#LIFETIMEOUT&gt;
                          </span>
                          <span> จะถูกแทนค่าด้วย </span>
                          <span className="text-primary">
                            รหัสหมดอายุในกี่นาที่
                          </span>
                        </p>
                        <p className="text-small">
                          <span className="text-primary">
                            &lt;#EXPIRETIME&gt;
                          </span>
                          <span> จะถูกแทนค่าด้วย </span>
                          <span className="text-primary">
                            รหัสจะใช้ได้ถึงเมื่อไร?
                          </span>
                        </p>
                        <p className="text-small text-danger">
                          {" "}
                          * เวลาอ้างอิงจาก lifeTimeoutMins
                        </p>
                        <p className="text-small">
                          <span className="text-primary">
                            &lt;#freetextTH&gt;
                          </span>
                          <span> จะถูกแทนค่าด้วย </span>
                          <span className="text-primary">
                            {" "}
                            msgTextTH จาก Request
                          </span>
                        </p>
                        <p className="text-small text-danger">
                          {" "}
                          *สามารถใส่ค่า default ได้ ex. &lt;#freetextTH=AIS&gt;
                        </p>
                        <p className="text-small">
                          <span className="text-primary">
                            &lt;#freetextENG&gt;
                          </span>
                          <span> จะถูกแทนค่าด้วย </span>
                          <span className="text-primary">
                            {" "}
                            msgTextENG จาก Request
                          </span>
                        </p>
                        <p className="text-small text-danger">
                          *สามารถใส่ค่า default ได้ ex. &lt;#freetextENG=AIS&gt;
                        </p>
                        <p className="text-small text-warning"> ตัวอย่าง</p>
                        <div className="flex flex-col gap-2 py-2">
                          <Snippet color="warning" hideSymbol>
                            <span className="text-small break-words  whitespace-normal overflow-wrap-normal">
                              บริการจาก &lt;#freetextTH=AIS&gt; รหัส OTP คือ
                              &lt;#OTP&gt; (ref:&lt;#REF&gt;) จะหมดอายุใน
                              &lt;#LIFETIMEOUT&gt; นาที และใช้ได้ถึง
                              &lt;#EXPIRETIME&gt;
                            </span>
                          </Snippet>
                          <Snippet color="warning" hideCopyButton hideSymbol>
                            <span className="text-small break-words  whitespace-normal overflow-wrap-normal">
                              บริการจาก AIS รหัส OTP คือ 248971 (ref:871253)
                              จะหมดอายุใน 5 นาที และใช้ได้ถึง 17/07/2024
                              15:32:12
                            </span>
                          </Snippet>
                        </div>
                        <Switch
                          className="py-1 "
                          // defaultSelected={isSelected}
                          // checked={isSelected}
                          // onValueChange={setIsSelected}
                          isSelected={
                            formData.operAis.allowSmsRoaming === "TRUE"
                          }
                          type="checkbox"
                          onValueChange={(isChecked) =>
                            handleChange(
                              "allowSmsRoaming",
                              isChecked,
                              "operAis",
                            )
                          }
                        >
                          Allow roaming{" "}
                          <span
                            className={
                              formData.operAis.allowSmsRoaming === "TRUE"
                                ? "text-small text-success"
                                : "text-small text-danger"
                            }
                            color="danger"
                          >
                            {" "}
                            {formData.operAis.allowSmsRoaming === "TRUE"
                              ? "ให้ลูกค้าต่างประเทศสามารถรับ SMS ได้"
                              : "ลูกค้าต่างประเทศไม่สามารถรับ SMS ได้"}
                          </span>
                        </Switch>

                        <Switch
                          className="py-1"
                          isSelected={
                            formData.operAis.smscDeliveryReceipt === "TRUE"
                          }
                          type="checkbox"
                          onValueChange={(isChecked) =>
                            handleChange(
                              "smscDeliveryReceipt",
                              isChecked,
                              "operAis",
                            )
                          }
                        >
                          SMS Delivery receipt
                        </Switch>

                        {isAdmin && (
                          <Switch
                            className="pt-1"
                            isSelected={formData.operAis.waitDR === "TRUE"}
                            type="checkbox"
                            onValueChange={(isChecked) =>
                              handleChange("waitDR", isChecked, "operAis")
                            }
                          >
                            Wait Dr{" "}
                            <span className="text-small text-danger">
                              {" "}
                              *GSSO จะรอ DR จาก SMPPGW ซึ่งใช้เวลา 4-10 นาที
                              (แนะนำให้ปิด){" "}
                            </span>
                          </Switch>
                        )}
                        {isAdmin && (
                          <Switch
                            className="pt-1"
                            isSelected={formData.operAis.refundFlag === "TRUE"}
                            type="checkbox"
                            onValueChange={(isChecked) =>
                              handleChange("refundFlag", isChecked, "operAis")
                            }
                          >
                            Refund Flag
                          </Switch>
                        )}
                        {/*<p className="text-small text-danger pb-2"*/}
                        {/*   color="danger"> **/}
                        {/*</p>*/}
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <div className="flex flex-col gap-3 sm:flex-nowrap">
                          <CheckboxGroup
                            label="Allow state"
                            color="primary"
                            value={formData.operAis.state}
                            onValueChange={(value) =>
                              handleChange("state", value, "operAis")
                            }
                          >
                            <div className="flex flex-wrap ">
                              {selectAllowState.map((state) => (
                                <div key={state.key} className="w-1/2 mb-1 ">
                                  <Checkbox value={state.key}>
                                    {state.key}. {state.label}
                                  </Checkbox>
                                </div>
                              ))}
                            </div>
                          </CheckboxGroup>
                          <p className="text-default-500 text-small">
                            Selected: {formData.operAis.state?.join(",")}
                          </p>
                        </div>
                      </div>

                      <Divider className="  w-full  my-4" />
                      <div className="flex flex-col   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          // isRequired
                          label="Email From"
                          size="md"
                          placeholder="Default : AIS@ais.co.th"
                          type="text"
                          color={
                            formData.operAis.smsBodyEng ? "success" : "default"
                          }
                          value={formData.operAis.emailFrom}
                          onChange={(e) =>
                            handleChange("emailFrom", e.target.value, "operAis")
                          }
                        />

                        <Input
                          // isRequired
                          label="Email Subject"
                          size="md"
                          placeholder="Enter email subject"
                          type="text"
                          color={
                            formData.operAis.emailSubject
                              ? "success"
                              : "default"
                          }
                          value={formData.operAis.emailSubject}
                          onChange={(e) =>
                            handleChange(
                              "emailSubject",
                              e.target.value,
                              "operAis",
                            )
                          }
                        />

                        <Textarea
                          // isRequired
                          label="Email Body"
                          minRows={2}
                          placeholder="Enter email body"
                          color={
                            formData.operAis.emailBody ? "success" : "default"
                          }
                          value={formData.operAis.emailBody}
                          onChange={(e) =>
                            handleChange("emailBody", e.target.value, "operAis")
                          }
                        />
                      </div>
                      <div className="flex   w-full flex-col sm:flex-nowrap ">
                        <p className="text-small text-primary">
                          &lt;#OTP&gt; , &lt;#REF&gt;
                          ,&lt;#SERVICE&gt;,&lt;#NUMBER&gt;,
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
                        <p className="text-small text-danger">
                          {" "}
                          *ใช้ TAG ต่างๆ ได้เหมือนกับ SMS
                        </p>

                        <p className="text-small pt-2">
                          <span className="">
                            *ต้องการขึ้นบรรทัดใหม่ให้ใส่{" "}
                          </span>
                          <span className="text-primary"> {"<p>"} </span>
                          <span className=""> ไว้ด้านหน้า</span>
                        </p>
                        <p className="text-small ">
                          <span className="">*ต้องการเว้นบรรทัดให้ใส่ </span>
                          <span className="text-primary">
                            {" "}
                            {"<p>&nbsp;</p>"}{" "}
                          </span>
                        </p>

                        <p className="text-small text-warning"> ตัวอย่าง</p>
                        <div className="flex flex-col gap-2 py-2">
                          <Snippet color="warning" hideSymbol>
                            <span className="text-small break-words  whitespace-normal overflow-wrap-normal">
                              {
                                "<p>บริการจาก <#freetextTH=AIS> รหัส OTP คือ <#OTP> จะหมดอายุใน <#LIFETIMEOUT> นาทีและใช้ได้ถึง <#EXPIRETIME> <p>&nbsp;</p> <p>Services from <#freetextENG=AIS> Password is <#OTP>. Password will be expired in <#LIFETIMEOUT> minutes."
                              }
                            </span>
                          </Snippet>
                          <Snippet color="warning" hideSymbol hideCopyButton>
                            <p className="text-small break-words  whitespace-normal overflow-wrap-normal">
                              {
                                "บริการจาก AIS รหัส OTP คือ 161824 จะหมดอายุใน 5 นาทีและใช้ได้ถึง 19/07/2024 15:19:42\n\n"
                              }
                            </p>
                            <p>&nbsp;</p>
                            <p className="text-small break-words  whitespace-normal overflow-wrap-normal">
                              {
                                "Services from AIS Password is 161824. Password will be expired in 5 minutes."
                              }
                            </p>
                          </Snippet>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.allowOperation.includes("non-AIS") && (
                    <div className="flex   w-full flex-wrap  gap-4">
                      <Divider className="  w-full  my-4" />

                      <div className="flex flex-row w-full flex-wrap sm:flex-nowrap gap-4 justify-between items-center">
                        <h3 className="flex-grow text-left">
                          NON-AIS Operation
                        </h3>
                        <Button
                          color="success"
                          variant="light"
                          startContent={<CopyDocumentIcon />}
                          onPress={(e) => {
                            const value = { ...formData.operAis };
                            value.oper = "non-AIS";
                            value.state = undefined;
                            handleChange("operNonAis", value, "");
                          }}
                        >
                          Clone AIS Operation
                        </Button>
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          isRequired
                          label="OTP Digit"
                          size="md"
                          placeholder="Enter number of digit [4-12]"
                          type="number"
                          color={
                            formData.operNonAis.otpDigit ? "success" : "danger"
                          }
                          value={formData.operNonAis.otpDigit}
                          name="otpDigit"
                          onChange={(e) =>
                            handleChange(
                              "otpDigit",
                              e.target.value,
                              "operNonAis",
                            )
                          }
                          min={4}
                          max={12}
                        />

                        <Input
                          isRequired
                          label="Reference Digit"
                          size="md"
                          placeholder="Enter number of digit [4-12]"
                          type="number"
                          color={
                            formData.operNonAis.refDigit ? "success" : "danger"
                          }
                          value={formData.operNonAis.refDigit}
                          name="refDigit"
                          onChange={(e) =>
                            handleChange(
                              "refDigit",
                              e.target.value,
                              "operNonAis",
                            )
                          }
                          min={4}
                          max={12}
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          isRequired
                          label="Life Timeout Mins"
                          size="md"
                          placeholder="Enter number [5-15] Mins."
                          type="number"
                          color={
                            formData.operNonAis.lifeTimeoutMins
                              ? "success"
                              : "danger"
                          }
                          value={formData.operNonAis.lifeTimeoutMins}
                          onChange={(e) =>
                            handleChange(
                              "lifeTimeoutMins",
                              e.target.value,
                              "operNonAis",
                            )
                          }
                          min={5}
                          max={15}

                          // className="pr-2 sm:w-1/2 "
                        />
                        <Input
                          isRequired
                          label="Seed Key"
                          size="md"
                          placeholder="111111111111111111111111"
                          type="text"
                          isDisabled
                          // className="pr-2 sm:w-1/2 "
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          isRequired
                          label="SMS Sender"
                          placeholder="Max 11 digit"
                          type="text"
                          maxLength={11}
                          color={
                            formData.operNonAis.smsSender ? "success" : "danger"
                          }
                          value={formData.operNonAis.smsSender}
                          onChange={(e) =>
                            handleChange(
                              "smsSender",
                              e.target.value,
                              "operNonAis",
                            )
                          }
                          //isClearable
                          //onClear={() => handleChange('smsSender', '')}
                          // className="w-1/2"
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Textarea
                          isRequired
                          label="SMS Thai"
                          minRows={2}
                          placeholder="Max 350 digit"
                          color={
                            formData.operNonAis.smsBodyThai
                              ? "success"
                              : "danger"
                          }
                          value={formData.operNonAis.smsBodyThai}
                          onChange={(e) =>
                            handleChange(
                              "smsBodyThai",
                              e.target.value,
                              "operNonAis",
                            )
                          }
                          maxLength={350}
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Textarea
                          isRequired
                          label="SMS Eng"
                          minRows={2}
                          placeholder="Max 350 digit"
                          color={
                            formData.operNonAis.smsBodyEng
                              ? "success"
                              : "danger"
                          }
                          value={formData.operNonAis.smsBodyEng}
                          onChange={(e) =>
                            handleChange(
                              "smsBodyEng",
                              e.target.value,
                              "operNonAis",
                            )
                          }
                          max={350}
                        />
                      </div>
                      <div className="flex   w-full flex-col sm:flex-nowrap ">
                        <Switch
                          className="py-1 "
                          // defaultSelected={isSelected}
                          // checked={isSelected}
                          // onValueChange={setIsSelected}
                          isSelected={
                            formData.operNonAis.allowSmsRoaming === "TRUE"
                          }
                          type="checkbox"
                          onValueChange={(isChecked) =>
                            handleChange(
                              "allowSmsRoaming",
                              isChecked,
                              "operNonAis",
                            )
                          }
                        >
                          Allow roaming{" "}
                          <span
                            className={
                              formData.operNonAis.allowSmsRoaming === "TRUE"
                                ? "text-small text-success"
                                : "text-small text-danger"
                            }
                            color="danger"
                          >
                            {" "}
                            {formData.operNonAis.allowSmsRoaming === "TRUE"
                              ? "ให้ลูกค้าต่างประเทศสามารถรับ SMS ได้"
                              : "ลูกค้าต่างประเทศไม่สามารถรับ SMS ได้"}
                          </span>
                        </Switch>

                        <Switch
                          className="py-1"
                          isSelected={
                            formData.operNonAis.smscDeliveryReceipt === "TRUE"
                          }
                          type="checkbox"
                          onValueChange={(isChecked) =>
                            handleChange(
                              "smscDeliveryReceipt",
                              isChecked,
                              "operNonAis",
                            )
                          }
                        >
                          SMS Delivery receipt
                        </Switch>

                        {isAdmin && (
                          <>
                            <Switch
                              className="pt-1"
                              isSelected={formData.operNonAis.waitDR === "TRUE"}
                              type="checkbox"
                              onValueChange={(isChecked) =>
                                handleChange("waitDR", isChecked, "operNonAis")
                              }
                            >
                              Wait Dr{" "}
                              <span className="text-small text-danger">
                                {" "}
                                *GSSO จะรอ DR จาก SMPPGW ซึ่งใช้เวลา 4-10 นาที
                                (แนะนำให้ปิด){" "}
                              </span>
                            </Switch>
                            <Switch
                              className="pt-1"
                              isSelected={
                                formData.operNonAis.refundFlag === "TRUE"
                              }
                              type="checkbox"
                              onValueChange={(isChecked) =>
                                handleChange(
                                  "refundFlag",
                                  isChecked,
                                  "operNonAis",
                                )
                              }
                            >
                              Refund Flag
                            </Switch>
                          </>
                        )}
                        {/*<p className="text-small text-danger pb-2"*/}
                        {/*   color="danger"> **/}
                        {/*</p>*/}
                      </div>

                      <Divider className="  w-full  my-4" />
                      <div className="flex flex-col   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          // isRequired
                          label="Email From"
                          size="md"
                          placeholder="Default : AIS@ais.co.th"
                          type="text"
                          color={
                            formData.operNonAis.emailFrom
                              ? "success"
                              : "default"
                          }
                          value={formData.operNonAis.emailFrom}
                          onChange={(e) =>
                            handleChange(
                              "emailFrom",
                              e.target.value,
                              "operNonAis",
                            )
                          }
                        />

                        <Input
                          // isRequired
                          label="Email Subject"
                          size="md"
                          placeholder="Enter email subject"
                          type="text"
                          color={
                            formData.operNonAis.emailFrom
                              ? "success"
                              : "default"
                          }
                          value={formData.operNonAis.emailSubject}
                          onChange={(e) =>
                            handleChange(
                              "emailSubject",
                              e.target.value,
                              "operNonAis",
                            )
                          }
                        />

                        <Textarea
                          // isRequired
                          label="Email Body"
                          minRows={2}
                          placeholder="Enter email body"
                          color={
                            formData.operNonAis.emailBody
                              ? "success"
                              : "default"
                          }
                          value={formData.operNonAis.emailBody}
                          onChange={(e) =>
                            handleChange(
                              "emailBody",
                              e.target.value,
                              "operNonAis",
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  {formData.allowOperation.includes("INTER") && (
                    <div className="flex   w-full flex-wrap  gap-4">
                      <Divider className="  w-full  my-4" />
                      <div className="flex flex-row w-full flex-wrap sm:flex-nowrap gap-4 justify-between items-center">
                        <h3 className="flex-grow text-left">INTER Operation</h3>
                        <Button
                          color="success"
                          variant="light"
                          startContent={<CopyDocumentIcon />}
                          onPress={(e) => {
                            const value = { ...formData.operAis };
                            value.oper = "INTER";
                            value.state = undefined;
                            handleChange("operInter", value, "");
                          }}
                        >
                          Clone AIS Operation
                        </Button>
                      </div>

                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          isRequired
                          label="OTP Digit"
                          size="md"
                          placeholder="Enter number of digit [4-12]"
                          type="number"
                          color={
                            formData.operInter.otpDigit ? "success" : "danger"
                          }
                          value={formData.operInter.otpDigit}
                          name="otpDigit"
                          onChange={(e) =>
                            handleChange(
                              "otpDigit",
                              e.target.value,
                              "operInter",
                            )
                          }
                          min={4}
                          max={12}
                        />

                        <Input
                          isRequired
                          label="Reference Digit"
                          size="md"
                          placeholder="Enter number of digit [4-12]"
                          type="number"
                          color={
                            formData.operInter.refDigit ? "success" : "danger"
                          }
                          value={formData.operInter.refDigit}
                          name="refDigit"
                          onChange={(e) =>
                            handleChange(
                              "refDigit",
                              e.target.value,
                              "operInter",
                            )
                          }
                          min={4}
                          max={12}
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          isRequired
                          label="Life Timeout Mins"
                          size="md"
                          placeholder="Enter number [5-15] Mins."
                          type="number"
                          color={
                            formData.operInter.lifeTimeoutMins
                              ? "success"
                              : "danger"
                          }
                          value={formData.operInter.lifeTimeoutMins}
                          onChange={(e) =>
                            handleChange(
                              "lifeTimeoutMins",
                              e.target.value,
                              "operInter",
                            )
                          }
                          min={5}
                          max={15}

                          // className="pr-2 sm:w-1/2 "
                        />
                        <Input
                          isRequired
                          label="Seed Key"
                          size="md"
                          placeholder="111111111111111111111111"
                          type="text"
                          isDisabled
                          // className="pr-2 sm:w-1/2 "
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          isRequired
                          label="SMS Sender"
                          placeholder="Max 11 digit"
                          type="text"
                          maxLength={11}
                          color={
                            formData.operInter.smsSender ? "success" : "danger"
                          }
                          value={formData.operInter.smsSender}
                          onChange={(e) =>
                            handleChange(
                              "smsSender",
                              e.target.value,
                              "operInter",
                            )
                          }
                          //isClearable
                          //onClear={() => handleChange('smsSender', '')}
                          // className="w-1/2"
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Textarea
                          isRequired
                          label="SMS Thai"
                          minRows={2}
                          placeholder="Max 350 digit"
                          color={
                            formData.operInter.smsBodyThai
                              ? "success"
                              : "danger"
                          }
                          value={formData.operInter.smsBodyThai}
                          onChange={(e) =>
                            handleChange(
                              "smsBodyThai",
                              e.target.value,
                              "operInter",
                            )
                          }
                          maxLength={350}
                        />
                      </div>
                      <div className="flex   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Textarea
                          isRequired
                          label="SMS Eng"
                          minRows={2}
                          placeholder="Max 350 digit"
                          color={
                            formData.operInter.smsBodyEng ? "success" : "danger"
                          }
                          value={formData.operInter.smsBodyEng}
                          onChange={(e) =>
                            handleChange(
                              "smsBodyEng",
                              e.target.value,
                              "operInter",
                            )
                          }
                          max={350}
                        />
                      </div>
                      <div className="flex   w-full flex-col sm:flex-nowrap ">
                        <Switch
                          className="py-1 "
                          // defaultSelected={isSelected}
                          // checked={isSelected}
                          // onValueChange={setIsSelected}
                          isSelected={
                            formData.operInter.allowSmsRoaming === "TRUE"
                          }
                          type="checkbox"
                          onValueChange={(isChecked) =>
                            handleChange(
                              "allowSmsRoaming",
                              isChecked,
                              "operInter",
                            )
                          }
                        >
                          Allow roaming{" "}
                          <span
                            className={
                              formData.operInter.allowSmsRoaming === "TRUE"
                                ? "text-small text-success"
                                : "text-small text-danger"
                            }
                            color="danger"
                          >
                            {" "}
                            {formData.operInter.allowSmsRoaming === "TRUE"
                              ? "ให้ลูกค้าต่างประเทศสามารถรับ SMS ได้"
                              : "ลูกค้าต่างประเทศไม่สามารถรับ SMS ได้"}
                          </span>
                        </Switch>

                        <Switch
                          className="py-1"
                          isSelected={
                            formData.operInter.smscDeliveryReceipt === "TRUE"
                          }
                          type="checkbox"
                          onValueChange={(isChecked) =>
                            handleChange(
                              "smscDeliveryReceipt",
                              isChecked,
                              "operInter",
                            )
                          }
                        >
                          SMS Delivery receipt
                        </Switch>

                        {isAdmin && (
                          <>
                            <Switch
                              className="pt-1"
                              isSelected={formData.operInter.waitDR === "TRUE"}
                              type="checkbox"
                              onValueChange={(isChecked) =>
                                handleChange("waitDR", isChecked, "operInter")
                              }
                            >
                              Wait Dr{" "}
                              <span className="text-small text-danger">
                                {" "}
                                *GSSO จะรอ DR จาก SMPPGW ซึ่งใช้เวลา 4-10 นาที
                                (แนะนำให้ปิด){" "}
                              </span>
                            </Switch>
                            <Switch
                              className="pt-1"
                              isSelected={
                                formData.operInter.refundFlag === "TRUE"
                              }
                              type="checkbox"
                              onValueChange={(isChecked) =>
                                handleChange(
                                  "refundFlag",
                                  isChecked,
                                  "operInter",
                                )
                              }
                            >
                              Refund Flag
                            </Switch>
                          </>
                        )}
                        {/*<p className="text-small text-danger pb-2"*/}
                        {/*   color="danger"> **/}
                        {/*</p>*/}
                      </div>

                      <Divider className="  w-full  my-4" />
                      <div className="flex flex-col   w-full flex-wrap sm:flex-nowrap gap-4 ">
                        <Input
                          // isRequired
                          label="Email From"
                          size="md"
                          placeholder="Default : AIS@ais.co.th"
                          type="text"
                          color={
                            formData.operInter.emailFrom ? "success" : "default"
                          }
                          value={formData.operInter.emailFrom}
                          onChange={(e) =>
                            handleChange(
                              "emailFrom",
                              e.target.value,
                              "operInter",
                            )
                          }
                        />

                        <Input
                          // isRequired
                          label="Email Subject"
                          size="md"
                          placeholder="Enter email subject"
                          type="text"
                          color={
                            formData.operInter.emailSubject
                              ? "success"
                              : "default"
                          }
                          value={formData.operInter.emailSubject}
                          onChange={(e) =>
                            handleChange(
                              "emailSubject",
                              e.target.value,
                              "operInter",
                            )
                          }
                        />

                        <Textarea
                          // isRequired
                          label="Email Body"
                          minRows={2}
                          placeholder="Enter email body"
                          color={
                            formData.operInter.emailBody ? "success" : "default"
                          }
                          value={formData.operInter.emailBody}
                          onChange={(e) =>
                            handleChange(
                              "emailBody",
                              e.target.value,
                              "operInter",
                            )
                          }
                        />
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="flex flex-col   w-full flex-wrap sm:flex-nowrap gap-4 ">
                      <Divider className="  w-full  my-4" />
                      <Select
                        label="Status"
                        size="md"
                        // placeholder="VAS for AIS-PLAY only"
                        name="status"
                        selectedKeys={formData.status ? [formData.status] : []}
                        onChange={(e) => {
                          handleChange("status", e.target.value);
                        }}
                      >
                        {statusOptions.map((status) => (
                          <SelectItem key={status.uid} value={status.uid}>
                            {status.uid}
                          </SelectItem>
                        ))}
                      </Select>
                      <Input
                        // isRequired
                        label="Owner"
                        size="md"
                        placeholder="Enter owner"
                        type="text"
                        value={formData.owner}
                        onChange={(e) => handleChange("owner", e.target.value)}
                      />
                    </div>
                  )}
                  <div className="flex flex-row items-center justify-center    w-full flex-wrap sm:flex-nowrap  py-4 gap-4 ">
                    {/*<Button color="danger" variant="light" onPress={show}>*/}
                    {/*    console*/}
                    {/*</Button>*/}
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit">
                      Update service
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

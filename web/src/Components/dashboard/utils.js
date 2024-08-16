import { saveAs } from "file-saver";

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function htmlEscape(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function convertServiceToString(service) {
  const template =
    "<t>ServiceTemplate</t><0>0</0><1>" +
    service.serviceName +
    "</1><2>def</2><3>def</3><4>def</4><d>";

  // const operatorData = service.allowOperation.map(oper => (
  //   {oper,
  //   allowSmsRoaming: service.allowSmsRoaming.toString().toUpperCase(),
  //   smsSender: service.smsSender,
  //   smsBodyThai: service.smsThai,
  //   smsBodyEng: service.smsEng,
  //   emailFrom: service.emailFrom,
  //   emailSubject: service.emailSubject,
  //   emailBody: service.emailBody,
  //   smscDeliveryReceipt: service.smscDeliveryReceipt.toString().toUpperCase(),
  //   waitDR: service.waitDR.toString().toUpperCase(),
  //   otpDigit: service.otpDigit,
  //   refDigit: service.referenceDigit,
  //   lifeTimeoutMins: service.lifeTimeoutMins,
  //   seedkey: service.seedKey
  // }));
  const operatorData = service.allowOperation.map((oper) => {
    let operData;
    switch (oper) {
      case "AIS":
        operData = service.operAis;
        break;
      case "non-AIS":
        operData = service.operNonAis;
        break;
      case "INTER":
        operData = service.operInter;
        break;
      default:
        operData = {};
    }

    return {
      oper: operData.oper,
      allowSmsRoaming:
        operData.allowSmsRoaming?.toString().toUpperCase() || "FALSE",
      smsSender: operData.smsSender,
      smsBodyThai: operData.smsThai,
      smsBodyEng: operData.smsEng,
      emailFrom: operData.emailFrom || "AIS@ais.co.th",
      emailSubject: operData.emailSubject || "-",
      emailBody: operData.emailBody || "-",
      smscDeliveryReceipt:
        operData.smscDeliveryReceipt?.toString().toUpperCase() || "TRUE",
      waitDR: operData.waitDR?.toString().toUpperCase() || "FALSE",
      otpDigit: operData.otpDigit,
      refDigit: operData.referenceDigit,
      lifeTimeoutMins: operData.lifeTimeoutMins,
      seedkey: operData.seedKey,
      refundFlag: operData.refundFlag?.toString().toUpperCase() || "FALSE",
      state: operData.state?.join(",") || undefined, // เพิ่ม state สำหรับ AIS, ถ้าไม่มีให้เป็น array ว่าง
    };
  });

  const dataService = `"${service.serviceId}",${JSON.stringify(operatorData)}`;
  const escapedDataString = htmlEscape(dataService);

  return template + escapedDataString + "</d>";
}

export function convertServiceJson(service) {
  const operatorData = service.allowOperation.map((oper) => {
    let operData;
    switch (oper) {
      case "AIS":
        operData = service.operAis;
        break;
      case "non-AIS":
        operData = service.operNonAis;
        break;
      case "INTER":
        operData = service.operInter;
        break;
      default:
        operData = {};
    }

    return {
      oper: operData.oper,
      allowSmsRoaming:
        operData.allowSmsRoaming?.toString().toUpperCase() || "FALSE",
      smsSender: operData.smsSender,
      smsBodyThai: operData.smsThai,
      smsBodyEng: operData.smsEng,
      emailFrom: operData.emailFrom || "AIS@ais.co.th",
      emailSubject: operData.emailSubject || "-",
      emailBody: operData.emailBody || "-",
      smscDeliveryReceipt:
        operData.smscDeliveryReceipt?.toString().toUpperCase() || "TRUE",
      waitDR: operData.waitDR?.toString().toUpperCase() || "FALSE",
      otpDigit: operData.otpDigit,
      refDigit: operData.referenceDigit,
      lifeTimeoutMins: operData.lifeTimeoutMins,
      seedkey: operData.seedKey,
      refundFlag: operData.refundFlag?.toString().toUpperCase() || "FALSE",
      state: operData.state?.join(",") || undefined, // เพิ่ม state สำหรับ AIS, ถ้าไม่มีให้เป็น array ว่าง
    };
  });

  return operatorData;
}

export function exportTextFile(fileName, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(blob, fileName + ".xml");
}

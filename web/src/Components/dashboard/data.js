import React from "react";
export const columns = [
  {name: "ID", uid: "ID", sortable: true},
  {name: "SERVICE ID", uid: "serviceId", sortable: true},
  {name: "SERVICE NAME", uid: "serviceName", sortable: true},
  {name: "PROJECT SITE", uid: "projectSite", sortable: true},
  // {name: "SMS SENDER", uid: "sender"},
  {name: "STATUS", uid: "status", sortable: true},
  {name: "UPDATED AT", uid: "updatedAt",sortable: true},
  {name: "UPDATED BY", uid: "updatedBy",sortable: true},
  {name: "OWNER", uid: "owner",sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

export const statusOptions = [
  {name: "Active", uid: "active"},
  // {name: "Inactive", uid: "inactive"},
  {name: "Pending", uid: "pending"},
  {name: "Empty", uid: "empty"},
];


export const siteOptions = [
  {name: "IT", uid: "it"},
  {name: "VAS", uid: "vas"},
];

export const selectSite = [
  {key: "vas", label: "VAS"},
  {key: "it", label: "IT"}]

export const selectOperation = [
  {key: "AIS", label: "AIS"},
  {key: "non-AIS", label: "non-AIS"},
  {key: "INTER", label: "INTER"},

]



export const selectAllowState = [
  {key: "0", label: "idle"},
  {key: "1", label: "Active"},
  {key: "2", label: "suspendFraud"},
  {key: "3", label: "suspendDate"},
  {key: "4", label: "barredLeasing"},
  {key: "5", label: "creditLimitted"},
  {key: "6", label: "barredRequest"},
  {key: "7", label: "Terminated"},
  {key: "8", label: "bassedDisconnect"},
  {key: "9", label: "barredPending"},
  {key: "10", label: "Prep"},
  {key: "11", label: "Test"},
  {key: "12", label: "Freese"},
  {key: "13", label: "suspendDebt1way"},
  {key: "14", label: "barredDebtout"},
  {key: "15", label: "creditLimitted1way"},
  {key: "16", label: "barredCredit"},
  {key: "17", label: "barredCreditOut"},
  {key: "18", label: "barrdDisconnectOver30"},
  {key: "19", label: "terminatedOver30"},
  {key: "20", label: "prepaidSuspend"},
  {key: "21", label: "prepaidDisable"},
  {key: "22", label: "pool"},
  {key: "23", label: "disconnect"},
  {key: "24", label: "disconnectConverted"},
  {key: "25", label: "disconnectMigrated"},
  {key: "26", label: "disconnectPorted"},
  {key: "27", label: "inactive"}

]

// export {columns,siteOptions, statusOptions};

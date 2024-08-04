import React from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";
import { DownloadIcon } from "../../assets/icons/DownloadIcon.jsx";

export default function DownloadComponents() {
  const API_BASE_URL = import.meta.env.DEV
    ? import.meta.env.VITE_API_BASE_URL
    : "";

  const handleDownload = () => {
    axios({
      url: `${API_BASE_URL}/api/file/download`,
      method: "GET",
      responseType: "blob", // สำคัญมากสำหรับการดาวน์โหลดไฟล์
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        const fileName = response.headers["x-filename"] || "download.txt";
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการดาวน์โหลด:", error);
      });
  };

  return (
    <Button
      color="success"
      className="text-white"
      variant="shadow"
      onPress={handleDownload}
      endContent={<DownloadIcon />}
    >
      Download T16
    </Button>
  );
}

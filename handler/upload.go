package handler

import (
	"github.com/gofiber/fiber/v2"
	"path/filepath"
)

func UploadFile(c *fiber.Ctx) error {

	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": "error", "message": "ไม่พบไฟล์ในการอัพโหลด!",
		})
	}

	// สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
	filename := filepath.Join("./T16", file.Filename)

	// บันทึกไฟล์
	if err := c.SaveFile(file, filename); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status": "error", "message": "ไม่สามารถบันทึกไฟล์ได้!",
		})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "success!", "filename": file.Filename})
}

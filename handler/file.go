package handler

import (
	"github.com/gofiber/fiber/v2"
	"os"
	"path/filepath"
	"time"
)

func UploadFile(c *fiber.Ctx) error {

	file, err := c.FormFile("T16")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status": "error", "message": "ไม่พบไฟล์ในการอัพโหลด!",
		})
	}
	dir := "./T16"
	if _, err = os.Stat(dir); os.IsNotExist(err) {
		// ถ้าไดเรกทอรีไม่อยู่ สร้างไดเรกทอรี
		err = os.MkdirAll(dir, 0755)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status": "error", "message": "ไม่สามารถบันทึกไฟล์ได้!",
			})
		}
	}
	// สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
	filename := filepath.Join(dir, file.Filename)

	// บันทึกไฟล์
	if err := c.SaveFile(file, filename); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status": "error", "message": "ไม่สามารถบันทึกไฟล์ได้!",
		})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "success!", "filename": file.Filename})
}

func DownloadFile(c *fiber.Ctx) error {
	dir := "./T16" // แทนที่ด้วย path ของ directory ที่คุณต้องการ
	latestFile, err := getLatestFile(dir)
	if err != nil {
		return c.Status(500).SendString("Error finding latest file")
	}
	if latestFile == "" {
		return c.Status(404).SendString("No files found")
	}
	fileName := filepath.Base(latestFile)
	c.Set("Content-Disposition", "attachment; filename="+fileName)
	c.Set("X-Filename", fileName)
	return c.SendFile(latestFile)
}

func getLatestFile(dir string) (string, error) {
	var latestFile string
	var latestTime time.Time

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && info.ModTime().After(latestTime) {
			latestFile = path
			latestTime = info.ModTime()
		}
		return nil
	})

	if err != nil {
		return "", err
	}

	return latestFile, nil
}

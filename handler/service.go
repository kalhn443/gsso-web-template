package handler

import (
	"api-fiber-gorm/database"
	"api-fiber-gorm/model"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func filterOwnerServices(services []model.ServiceTemplate, owner string) []model.ServiceTemplate {
	var ownerServices []model.ServiceTemplate
	for _, service := range services {
		if strings.Contains(service.Owner, owner) {
			ownerServices = append(ownerServices, service)
		}
	}
	return ownerServices
}

func GenerateEmptyService(c *fiber.Ctx) error {
	Services := make([]string, 999)
	db := database.DB
	jsonData, _ := json.Marshal([]string{"AIS", "non-AIS"})

	for i := 0; i < 999; i++ {

		// แปลงตัวเลขเป็นสตริงและเติม 0 ข้างหน้าให้ครบ 3 หลัก
		serviceId := fmt.Sprintf("GS"+"%03d", i+1)
		Services[i] = serviceId
		contentJson, _ := json.Marshal(model.ContentOper{
			Oper: "non-AIS",
		})
		contentAis, _ := json.Marshal(model.ContentOper{
			Oper:  "AIS",
			State: []string{"1", "13", "15"},
		})
		contentInter, _ := json.Marshal(model.ContentOper{
			Oper: "INTER",
		})
		service := model.ServiceTemplate{
			ServiceId:      serviceId,
			ServiceName:    "empty",
			Status:         "empty",
			Owner:          "admin",
			AllowOperation: jsonData,
			UpdatedBy:      "admin",
			OperAis:        contentAis,
			OperNonAis:     contentJson,
			OperInter:      contentInter,
		}

		if err := db.Create(&service).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create user", "data": err})
		}
	}

	return c.JSON(fiber.Map{"status": "success", "message": "User found", "data": Services})
}

// CreateService new service
func CreateService(c *fiber.Ctx) error {
	service := new(model.ServiceTemplate)
	if err := c.BodyParser(service); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
	}

	db := database.DB
	var emptyServiceFromDB model.ServiceTemplate

	if err := db.Where("ServiceName = ?", "empty").First(&emptyServiceFromDB).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "Couldn't create service"})
	}

	claims := c.Locals("user").(*jwt.Token).Claims.(jwt.MapClaims)
	isAdmin := fmt.Sprintf("%s", claims["role"]) == "admin"
	username := fmt.Sprintf("%s", claims["username"])

	email := fmt.Sprintf("%s", claims["email"])

	service.ID = emptyServiceFromDB.ID
	service.ServiceId = emptyServiceFromDB.ServiceId
	service.Status = "pending"
	service.Owner = username
	service.UpdatedAt = model.JsonTime(time.Now())
	service.UpdatedBy = username

	if err := db.Save(&service).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create service", "data": err})
	}

	var servicesRes []model.ServiceTemplate
	user := model.User{
		Username: username,
		Email:    email,
	}

	if err := db.Find(&servicesRes).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create service", "data": err})
	}

	if !isAdmin {
		servicesRes = filterOwnerServices(servicesRes, fmt.Sprintf("%s", username))
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Created service", "isAdmin": isAdmin, "user": user, "services": servicesRes})
}

// GetAllService get all ServiceTemplate
func GetAllService(c *fiber.Ctx) error {
	var servicesRes []model.ServiceTemplate

	db := database.DB
	if err := db.Find(&servicesRes).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create service", "data": err})
	}
	claims := c.Locals("user").(*jwt.Token).Claims.(jwt.MapClaims)
	isAdmin := fmt.Sprintf("%s", claims["role"]) == "admin"
	username := fmt.Sprintf("%s", claims["username"])

	email := fmt.Sprintf("%s", claims["email"])
	user := model.User{
		Username: username,
		Email:    email,
	}

	if !isAdmin {
		servicesRes = filterOwnerServices(servicesRes, fmt.Sprintf("%s", username))
	}

	return c.JSON(fiber.Map{"status": "success", "message": "found service", "isAdmin": isAdmin, "user": user, "services": servicesRes})

}

// UpdateService update service
func UpdateService(c *fiber.Ctx) error {
	service := new(model.ServiceTemplate)
	if err := c.BodyParser(service); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
	}

	db := database.DB
	var serviceFromDB model.ServiceTemplate
	if err := db.Find(&serviceFromDB, service.ID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "not found service", "data": nil})
	}
	if serviceFromDB.ServiceId == "" {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "not found service", "data": nil})
	}

	claims := c.Locals("user").(*jwt.Token).Claims.(jwt.MapClaims)
	isAdmin := fmt.Sprintf("%s", claims["role"]) == "admin"
	username := fmt.Sprintf("%s", claims["username"])
	email := fmt.Sprintf("%s", claims["email"])

	service.ID = serviceFromDB.ID
	service.ServiceId = serviceFromDB.ServiceId
	service.UpdatedAt = model.JsonTime(time.Now())
	service.UpdatedBy = username

	var servicesRes []model.ServiceTemplate
	user := model.User{
		Username: username,
		Email:    email,
	}

	if isAdmin || strings.Contains(serviceFromDB.Owner, username) {
		if !isAdmin {
			service.Status = "pending"
		}

		if err := db.Save(&service).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create service", "data": err})
		}
		if err := db.Find(&servicesRes).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create service", "data": err})
		}

		if !isAdmin {
			servicesRes = filterOwnerServices(servicesRes, username)
		}

		return c.JSON(fiber.Map{"status": "success", "message": "Updated service", "isAdmin": isAdmin, "user": user, "services": servicesRes})

	}
	return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "error", "message": "forbidden", "data": nil})
}

// DeleteService delete service
func DeleteService(c *fiber.Ctx) error {

	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your id", "data": nil})
	}

	db := database.DB
	var serviceFromDB model.ServiceTemplate

	if err := db.Find(&serviceFromDB, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "not found service", "data": nil})
	}
	if serviceFromDB.ServiceId == "" {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "not found service", "data": nil})
	}

	claims := c.Locals("user").(*jwt.Token).Claims.(jwt.MapClaims)
	isAdmin := fmt.Sprintf("%s", claims["role"]) == "admin"
	username := fmt.Sprintf("%s", claims["username"])
	email := fmt.Sprintf("%s", claims["email"])

	jsonData, _ := json.Marshal([]string{"AIS", "non-AIS"})
	contentAis, _ := json.Marshal(model.ContentOper{
		Oper:  "AIS",
		State: []string{"1", "13", "15"},
	})
	contentNon, _ := json.Marshal(model.ContentOper{
		Oper: "non-AIS",
	})
	contentInter, _ := json.Marshal(model.ContentOper{
		Oper: "INTER",
	})
	serviceDel := model.ServiceTemplate{
		ID:             serviceFromDB.ID,
		ServiceId:      serviceFromDB.ServiceId,
		ServiceName:    "empty",
		Status:         "empty",
		Owner:          "admin",
		AllowOperation: jsonData,
		OperAis:        contentAis,
		OperNonAis:     contentNon,
		OperInter:      contentInter,
		UpdatedAt:      model.JsonTime(time.Now()),
		UpdatedBy:      username,
	}

	user := model.User{
		Username: username,
		Email:    email,
	}

	if isAdmin || strings.Contains(serviceFromDB.Owner, username) {
		if err := db.Save(&serviceDel).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't delete service", "data": err})
		}

		var servicesRes []model.ServiceTemplate
		if err := db.Find(&servicesRes).Error; err != nil {

			return c.Status(404).JSON(fiber.Map{"status": "error", "message": "not found service", "data": nil})
		}
		if !isAdmin {
			servicesRes = filterOwnerServices(servicesRes, username)
		}

		return c.JSON(fiber.Map{"status": "success", "message": "Deleted service", "isAdmin": isAdmin, "user": user, "services": servicesRes})

	}
	return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "error", "message": "forbidden", "data": nil})

}

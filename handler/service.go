package handler

import (
	"api-fiber-gorm/database"
	"api-fiber-gorm/model"
	"encoding/json"
	"fmt"
	"html"
	"regexp"
	"strconv"
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
			Oper:                "non-AIS",
			SmscDeliveryReceipt: "true",
		})
		contentAis, _ := json.Marshal(model.ContentOper{
			Oper:                "AIS",
			SmscDeliveryReceipt: "true",

			State: []string{"1", "13", "15"},
		})
		contentInter, _ := json.Marshal(model.ContentOper{
			Oper:                "INTER",
			SmscDeliveryReceipt: "true",
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
	mobile := fmt.Sprintf("%s", claims["mobile"])
	emailLead := fmt.Sprintf("%s", claims["emailLead"])
	email := fmt.Sprintf("%s", claims["email"])
	role := fmt.Sprintf("%s", claims["role"])

	user := model.User{
		Username:  username,
		Email:     email,
		EmailLead: emailLead,
		Mobile:    mobile,
		Role:      role,
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

	user := GetUserFromJWT(c)

	service.ID = serviceFromDB.ID
	service.ServiceId = serviceFromDB.ServiceId
	service.UpdatedAt = model.JsonTime(time.Now())
	service.UpdatedBy = username

	var servicesRes []model.ServiceTemplate

	if isAdmin || strings.Contains(serviceFromDB.Owner, username) {
		if !isAdmin {
			service.Status = "pending"
		} else if service.Status != "active" {
			service.Status = "pending"
		}

		if err := db.Save(&service).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't update service", "data": err})
		}
		if err := db.Find(&servicesRes).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't update service", "data": err})
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

	user := GetUserFromJWT(c)

	jsonData, _ := json.Marshal([]string{"AIS", "non-AIS"})
	contentAis, _ := json.Marshal(model.ContentOper{
		Oper:                "AIS",
		SmscDeliveryReceipt: "true",

		State: []string{"1", "13", "15"},
	})
	contentNon, _ := json.Marshal(model.ContentOper{
		Oper:                "non-AIS",
		SmscDeliveryReceipt: "true",
	})
	contentInter, _ := json.Marshal(model.ContentOper{
		Oper:                "INTER",
		SmscDeliveryReceipt: "true",
	})
	serviceDel := model.ServiceTemplate{
		ID:             serviceFromDB.ID,
		ServiceId:      serviceFromDB.ServiceId,
		ServiceName:    "",
		Status:         "empty",
		Owner:          "admin",
		AllowOperation: jsonData,
		OperAis:        contentAis,
		OperNonAis:     contentNon,
		OperInter:      contentInter,
		UpdatedAt:      model.JsonTime(time.Now()),
		UpdatedBy:      username,
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

func MigrateService(c *fiber.Ctx) error {
	serviceMigrate := new(model.ServiceMigrate)
	if err := c.BodyParser(serviceMigrate); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})
	}
	if serviceMigrate.Owner == "" {
		serviceMigrate.Owner = "admin"
	}
	service := parseServiceTemplate(serviceMigrate.Data)
	service.ProjectSite = serviceMigrate.ProjectSite

	db := database.DB
	var serviceFromDB model.ServiceTemplate
	if err := db.Where("service_id  = ?", service.ServiceId).First(&serviceFromDB).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "not found service", "data": nil})
	}

	if serviceFromDB.ServiceId == "" {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "not found service", "data": nil})
	}

	service.ID = serviceFromDB.ID
	service.ServiceId = serviceFromDB.ServiceId
	service.UpdatedAt = model.JsonTime(time.Now())
	service.CreatedAt = model.JsonTime(time.Now())
	service.Owner = serviceMigrate.Owner
	service.UpdatedBy = "admin"
	service.Status = "pending"
	if err := db.Save(&service).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't update service", "data": err})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "migrate service success", "serviceInfo": service})

}

func GetUserFromJWT(c *fiber.Ctx) model.User {
	claims := c.Locals("user").(*jwt.Token).Claims.(jwt.MapClaims)
	username := fmt.Sprintf("%s", claims["username"])
	mobile := fmt.Sprintf("%s", claims["mobile"])
	emailLead := fmt.Sprintf("%s", claims["emailLead"])
	email := fmt.Sprintf("%s", claims["email"])
	role := fmt.Sprintf("%s", claims["role"])

	return model.User{
		Username:  username,
		Email:     email,
		EmailLead: emailLead,
		Mobile:    mobile,
		Role:      role,
	}
}

func parseServiceTemplate(input string) model.ServiceTemplate {
	decodedInput := html.UnescapeString(input)

	// ใช้ regex เพื่อดึงค่า ServiceName
	serviceNameRegex := regexp.MustCompile(`<1>(.*?)</1>`)
	serviceNameMatch := serviceNameRegex.FindStringSubmatch(decodedInput)
	serviceName := ""
	if len(serviceNameMatch) > 1 {
		serviceName = serviceNameMatch[1]
	}

	// แยกส่วนข้อมูลจาก input string
	parts := strings.Split(decodedInput, "<d>")
	if len(parts) < 2 {
		return model.ServiceTemplate{}
	}

	dataStr := strings.TrimSuffix(parts[1], "</d>")
	// แยก ServiceId และ JSON data
	dataParts := strings.SplitN(dataStr, ",", 2)
	if len(dataParts) < 2 {
		return model.ServiceTemplate{}
	}
	serviceId := strings.Trim(dataParts[0], "\"")
	id := strings.Split(serviceId, "GS")[1]
	//convert id to int
	idInt, _ := strconv.Atoi(id)

	jsonData := dataParts[1]

	// แปลง JSON string เป็น slice ของ map
	var data []map[string]string
	err := json.Unmarshal([]byte(jsonData), &data)
	if err != nil || len(data) == 0 {
		return model.ServiceTemplate{}
	}

	// สร้าง ServiceTemplate
	st := model.ServiceTemplate{
		ServiceName: serviceName,
		ServiceId:   serviceId,
		ID:          uint(idInt),
	}
	var allowOperation []string
	// กำหนดค่าให้ OperAis และ OperNonAis
	for _, item := range data {
		co := model.ContentOper{
			Oper:                item["oper"],
			AllowSmsRoaming:     item["allowSmsRoaming"],
			SmsSender:           item["smsSender"],
			SmsBodyThai:         item["smsBodyThai"],
			SmsBodyEng:          item["smsBodyEng"],
			EmailFrom:           item["emailFrom"],
			EmailSubject:        item["emailSubject"],
			EmailBody:           item["emailBody"],
			SmscDeliveryReceipt: item["smscDeliveryReceipt"],
			WaitDR:              item["waitDR"],
			OtpDigit:            item["otpDigit"],
			RefDigit:            item["refDigit"],
			LifeTimeoutMins:     item["lifeTimeoutMins"],
			Seedkey:             item["seedkey"],
		}

		if strings.ToLower(co.Oper) == "ais" {
			co.Oper = "AIS"
			st.OperAis = convertContentOperTojson(co)
		} else if strings.ToLower(co.Oper) == "non-ais" {
			co.Oper = "non-AIS"
			st.OperNonAis = convertContentOperTojson(co)
		} else if strings.ToLower(co.Oper) == "inter" {
			co.Oper = "INTER"
			st.OperInter = convertContentOperTojson(co)
		}
		allowOperation = append(allowOperation, co.Oper)

	}
	operation, _ := json.Marshal(allowOperation)
	st.AllowOperation = operation // สร้าง AllowOperation จาก allowOperation list

	return st
}

func convertContentOperTojson(contentOper model.ContentOper) []byte {
	content, _ := json.Marshal(contentOper)
	strContent := string(content)
	strContent = strings.Replace(strContent, "\\u003c", "<", -1)
	strContent = strings.Replace(strContent, "\\u003e", ">", -1)
	return []byte(strContent)
}

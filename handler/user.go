package handler

import (
	"fmt"
	"strconv"

	"api-fiber-gorm/database"
	"api-fiber-gorm/model"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 4)
	return string(bytes), err
}

func validToken(t *jwt.Token, id string) bool {
	n, err := strconv.Atoi(id)
	if err != nil {
		return false
	}

	claims := t.Claims.(jwt.MapClaims)
	uid := int(claims["user_id"].(float64))

	return uid == n
}

func validUser(id string, p string) bool {
	db := database.DB
	var user model.User
	db.First(&user, id)
	if user.Username == "" {
		return false
	}
	//if !CheckPasswordHash(p, user.Password) {
	if p != user.Password {
		return false
	}
	return true
}

// GetUser get a user
func GetUser(c *fiber.Ctx) error {
	username := c.Params("username")
	var user model.User
	//db.Find(&user, username)

	db := database.DB

	if err := db.Where("username  = ?", username).First(&user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})

	}

	//if user.Username == "" {
	//	return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})
	//}
	//user.Password = ""
	return c.JSON(fiber.Map{"status": "success", "message": "User found", "data": user})
}

// CreateUser new user
func CreateUser(c *fiber.Ctx) error {

	user := new(model.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})

	}
	user.Role = "owner"

	//hash, err := hashPassword(user.Password)
	//if err != nil {
	//	return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't hash password", "data": err})
	//}
	//user.Password = hash
	db := database.DB
	if err := db.Create(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Couldn't create user", "data": err})
	}

	type NewUser struct {
		Username string `json:"username"`
		Email    string `json:"email"`
	}

	newUser := NewUser{
		Email:    user.Email,
		Username: user.Username,
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Created user", "data": newUser})
}

// UpdateUser update user
func UpdateUser(c *fiber.Ctx) error {
	claims := c.Locals("user").(*jwt.Token).Claims.(jwt.MapClaims)
	isAdmin := fmt.Sprintf("%s", claims["role"]) == "admin"

	if !isAdmin {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "error", "message": "forbidden", "data": nil})
	}

	username := c.Params("username")

	user := new(model.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Review your input", "data": err})

	}
	userFromDB := new(model.User)

	db := database.DB
	if err := db.Where("username  = ?", username).First(&userFromDB).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with username", "data": nil})
	}
	user.ID = userFromDB.ID
	db.Save(&user)

	return c.JSON(fiber.Map{"status": "success", "message": "User successfully updated", "data": user})
}

// DeleteUser delete user
func DeleteUser(c *fiber.Ctx) error {
	claims := c.Locals("user").(*jwt.Token).Claims.(jwt.MapClaims)
	isAdmin := fmt.Sprintf("%s", claims["role"]) == "admin"

	if !isAdmin {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "error", "message": "forbidden", "data": nil})
	}

	username := c.Params("username")

	user := new(model.User)

	db := database.DB
	if err := db.Where("username  = ?", username).First(&user).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "No user found with username", "data": nil})

	}
	db.Delete(&user)
	return c.JSON(fiber.Map{"status": "success", "message": "User successfully deleted", "data": nil})
}

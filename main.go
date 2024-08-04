package main

import (
	"api-fiber-gorm/database"
	"api-fiber-gorm/router"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowHeaders:  "Origin, Content-Type, Accept, Content-Disposition, X-Filename",
		ExposeHeaders: "Content-Disposition, X-Filename",
	}))

	database.ConnectDB()

	router.SetupRoutes(app)
	log.Fatal(app.Listen(":8088"))
}

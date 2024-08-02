package router

import (
	"api-fiber-gorm/handler"
	"api-fiber-gorm/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// SetupRoutes setup router api
func SetupRoutes(app *fiber.App) {
	app.Use(cors.New())

	// Middleware
	api := app.Group("/api", logger.New())
	api.Get("/", handler.Hello)

	api.Post("/upload", handler.UploadFile)

	// Auth
	auth := api.Group("/auth")
	auth.Post("/login", handler.Login)

	// User
	user := api.Group("/user")
	user.Get("/:id", middleware.Protected(), handler.GetUser)
	user.Post("/", handler.CreateUser)
	user.Patch("/:id", middleware.Protected(), handler.UpdateUser)
	user.Delete("/:id", middleware.Protected(), handler.DeleteUser)

	// Product
	product := api.Group("/service")
	product.Get("/", middleware.Protected(), handler.GetAllService) //
	//product.Get("/gen", handler.GenerateEmptyService)                //
	product.Post("/", middleware.Protected(), handler.CreateService) //
	product.Put("/", middleware.Protected(), handler.UpdateService)
	product.Delete("/:id", middleware.Protected(), handler.DeleteService)

	//app.Static("/*", "./dist")

	app.Static("/", "./dist")

	//app.Static("/assets", "./dist/assets")
	app.Static("/*", "./dist")

}

package router

import (
	"api-fiber-gorm/handler"
	"api-fiber-gorm/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/swagger"
	"time"
)

// SetupRoutes setup router api
func SetupRoutes(app *fiber.App) {

	app.Get("/swagger/swagger.yaml", func(c *fiber.Ctx) error {
		return c.SendFile("./docs/swagger.yaml")
	})

	app.Get("/doc/*", swagger.New(swagger.Config{
		Title:        "Swagger GSSO Docs",
		URL:          "/swagger/swagger.yaml",
		DeepLinking:  false,
		DocExpansion: "full",
	}))

	// Middleware
	api := app.Group("/api", logger.New())
	api.Get("/", handler.Hello)

	file := api.Group("/file")
	file.Get("/download", handler.DownloadFile)
	file.Post("/upload", handler.UploadFile)
	file.Post("/prov", handler.Prov)

	// Auth
	auth := api.Group("/auth")
	auth.Post("/login", handler.Login)

	// User
	user := api.Group("/user")
	user.Post("/", handler.CreateUser)
	user.Get("/:username", middleware.Protected(), handler.GetUser)
	user.Put("/:id", middleware.Protected(), handler.UpdateUser)
	user.Delete("/:id", middleware.Protected(), handler.DeleteUser)

	// Product
	product := api.Group("/service")
	product.Post("/migrate", handler.MigrateService)
	product.Get("/", middleware.Protected(), handler.GetAllService) //
	//product.Get("/gen", handler.GenerateEmptyService)                //
	product.Post("/", middleware.Protected(), handler.CreateService) //
	product.Put("/", middleware.Protected(), handler.UpdateService)
	product.Delete("/:id", middleware.Protected(), handler.DeleteService)

	app.Static("/", "./dist", fiber.Static{
		CacheDuration: 10 * time.Second,
		MaxAge:        10,
	})
	app.Static("/*", "./dist", fiber.Static{
		CacheDuration: 10 * time.Second,
		MaxAge:        10,
	})

}

package main

import (
	"skyserve/auth"
	"skyserve/database"
	"skyserve/routers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowHeaders = append(config.AllowHeaders, "Authorization")
	router.Use(cors.New(config))

	database.ConnectDatabase()
	router.POST("/signup", auth.Signup)
	router.POST("/login", auth.Login)

	router.Use(auth.AuthMiddleware())
	routers.SetupUserRoutes(router)
	routers.SetupGeoRoutes(router)
	router.Run(":8080")
}

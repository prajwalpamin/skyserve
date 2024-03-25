package routers

import (
	controller "skyserve/controllers"

	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(router *gin.Engine) {
	userRouter := router.Group("/user")
	{
		userRouter.GET("/", controller.GetUser)
		userRouter.PUT("/update", controller.UpdateUser)
		userRouter.POST("/create", controller.CreateUser)
		userRouter.DELETE("/delete", controller.DeleteUser)
	}
}

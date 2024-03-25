package routers

import (
	controller "skyserve/controllers"

	"github.com/gin-gonic/gin"
)

func SetupGeoRoutes(router *gin.Engine) {
	userRouter := router.Group("/file")
	{
		userRouter.GET("/get_file", controller.GetFileByID)
		userRouter.GET("/get_all", controller.GetAllFiles)

		userRouter.POST("/upload", controller.UploadJSONFiles)
	}
}

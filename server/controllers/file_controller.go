package controller

import (
	"fmt"
	"net/http"
	"skyserve/database"
	"skyserve/models"
	util "skyserve/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

func UploadJSONFiles(c *gin.Context) {
	fmt.Println("inside upload")
	// Parse multipart form with a 10 MB limit
	err := c.Request.ParseMultipartForm(10 << 20)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to parse form"})
		return
	}

	// Retrieve the file
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing file"})
		return
	}
	defer file.Close()

	// Validate file type
	fileType := strings.ToLower(header.Filename[strings.LastIndex(header.Filename, ".")+1:])
	if fileType != "kml" && fileType != "json" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Only KML and GeoJSON files are allowed"})
		return
	}
	userID := c.GetInt("user_id")
	fmt.Println("userId", header.Filename)
	// Save the file
	err = util.SaveUploadedFile(file, header.Filename, fileType, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully"})
}

func GetFileByID(c *gin.Context) {
	// Extract file ID from the request parameters
	id := c.Query("id")
	fmt.Println("id", id)
	// Query the database to retrieve the file by ID
	var file models.File
	err := database.Db.QueryRow("SELECT id,file_name, file_data, file_type FROM geo_files WHERE id = $1", id).Scan(&file.ID, &file.FileData, &file.FileType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"file": file})
}

func GetAllFiles(c *gin.Context) {
	rows, err := database.Db.Query("SELECT id,file_name, file_data, file_type FROM geo_files")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get files"})
		return
	}
	defer rows.Close()

	var files []models.File
	// Iterate through the rows and populate the files slice
	for rows.Next() {
		var file models.File
		err := rows.Scan(&file.ID, &file.FileName, &file.FileData, &file.FileType)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan files"})
			return
		}
		files = append(files, file)
	}
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to iterate over files"})
		return
	}

	// Return the list of files
	c.JSON(http.StatusOK, gin.H{"files": files})
}

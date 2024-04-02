package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"skyserve/database"
	"skyserve/models"
	util "skyserve/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

type GeoJSONData struct {
	Type       string                 `json:"type"`
	Properties map[string]interface{} `json:"properties"`
	Geometry   map[string]interface{} `json:"geometry"`
}

type createGeoFile struct {
	FileName string `json:"file_name"`
	FileData string `json:"file_data"`
}

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

func CreateGeoFile(c *gin.Context) {
	fmt.Println("inside crete json files")
	var geoFile createGeoFile
	userID := c.GetInt("user_id")

	if err := c.Bind(&geoFile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Convert GeoJSON data to string
	geoJSONBytes, err := json.Marshal(geoFile.FileData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encode GeoJSON data"})
		return
	}
	geoFile.FileData = string(geoJSONBytes)

	// Insert GeoFile data into the database
	_, err = database.Db.Exec("INSERT INTO geo_files (file_name, file_data, file_type, user_id) VALUES ($1, $2, $3, $4)",
		geoFile.FileName, geoFile.FileData, "geoJson", userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save GeoFile in database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "GeoFile uploaded and saved successfully"})
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

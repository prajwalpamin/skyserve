package util

import (
	"io/ioutil"
	"mime/multipart"
	"skyserve/database"
)

func SaveUploadedFile(file multipart.File, file_name string, fileType string, userID int) error {
	fileData, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}

	query := "INSERT INTO geo_files (file_data,file_name, file_type, user_id) VALUES ($1, $2, $3 ,$4)"
	// Execute the SQL statement
	if _, err := database.Db.Exec(query, string(fileData), file_name, fileType, userID); err != nil {
		return err
	}
	return nil
}

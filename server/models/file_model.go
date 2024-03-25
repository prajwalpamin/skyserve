package models

type File struct {
	ID       int    `json:"id"`
	FileName string `json:"file_name"`
	FileData string `json:"file_data"`
	FileType string `json:"file_type"`
	UserID   string `json:"user_id"`
}

package controller

import (
	"database/sql"
	"net/http"
	"skyserve/database"
	model "skyserve/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	user := model.User{}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	_, err := database.Db.Exec("INSERT INTO users (user_name, email) VALUES ($1, $2)", user.Name, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User added successfully"})
}

func GetUser(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user model.User
	err = database.Db.QueryRow("SELECT user_name, email FROM users WHERE id = ?", userID).Scan(&user.Name, &user.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func UpdateUser(c *gin.Context) {
	userID := c.Param("id")

	user := model.User{}
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the user in the database
	_, err := database.Db.Exec("UPDATE users SET user_name = ?, email = ? WHERE id = ?", user.Name, user.Email, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func DeleteUser(c *gin.Context) {
	userID := c.Param("id")

	// Delete the user from the database
	_, err := database.Db.Exec("DELETE FROM users WHERE id = ?", userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

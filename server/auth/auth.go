package auth

import (
	"database/sql"
	"fmt"
	"net/http"
	"skyserve/database"
	model "skyserve/models"
	util "skyserve/utils"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var jwtKey = []byte("secret-key")

type User struct {
	Username        string `json:"user_name"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
}

func Signup(c *gin.Context) {
	fmt.Println("inside signup")
	var user User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	hashedPassword := util.HashPassword(user.Password)
	fmt.Println(user)
	fmt.Println(hashedPassword)

	_, err := database.Db.Exec("INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)", user.Username, user.Email, hashedPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login authenticates the user and returns a JWT token
func Login(c *gin.Context) {
	var creds Credentials
	if err := c.BindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	hashedPassword := util.HashPassword(creds.Password)

	var user model.User
	err := database.Db.QueryRow("SELECT id, user_name FROM users WHERE email = $1 AND password = $2", creds.Email, hashedPassword).Scan(&user.Id, &user.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to authenticate"})
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": user.Name,
		"user_id":  user.Id,
		"exp":      expirationTime.Unix(),
	})
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

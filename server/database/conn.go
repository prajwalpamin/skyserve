package database

import (
	"database/sql"
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var Db *sql.DB

func ConnectDatabase() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error is occurred  on .env file please check")
	}

	host := os.Getenv("HOST")
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	usernam := os.Getenv("USERNAM")
	dbname := os.Getenv("DB_NAME")
	pass := os.Getenv("PASSWORD")

	psqlSetup := fmt.Sprintf("host=%s port=%d user=%s dbname=%s password=%s sslmode=disable",
		host, port, usernam, dbname, pass)
	fmt.Println(psqlSetup)
	db, errSql := sql.Open("postgres", psqlSetup)
	if errSql != nil {
		fmt.Println("There is an error while connecting to the database ", err)
		panic(err)
	} else {
		Db = db
		fmt.Println("Successfully connected to database!")
		err = MigrateUserTable()
		if err != nil {
			fmt.Println("Error migrating User table:", err)
			return
		}
		fmt.Println("User table migrated successfully!")
	}
}

func MigrateUserTable() error {
	query1 := `
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			user_name VARCHAR(100),
			email VARCHAR(100),
			password VARCHAR(100) 
		);
	`
	if _, err := Db.Exec(query1); err != nil {
		return err
	}
	query2 := `
	    CREATE TABLE IF NOT EXISTS geo_files (
		id SERIAL PRIMARY KEY,
		file_name VARCHAR(100),
		file_data VARCHAR(1000),
		file_type VARCHAR(100),
		user_id INT,
		FOREIGN KEY (user_id) REFERENCES users(id)
	);
	`
	if _, err := Db.Exec(query2); err != nil {
		return err
	}
	return nil
}

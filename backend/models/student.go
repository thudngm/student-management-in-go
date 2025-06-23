package models

type Student struct {
	ID int `json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Dob string `json:"dob"`
	Gpa float32 `json:"gpa"`
}
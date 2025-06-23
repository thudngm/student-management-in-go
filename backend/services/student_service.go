package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"miniproject/models"
	"os"
	"slices"
	"strconv"
	"strings"
	"time"
)

const dataFile = "data/students.json"

var students []models.Student

func init() {
	// Load initial data from file
	err := LoadStudents(&students)
	if err != nil {
		// If the file doesn't exist, we can ignore the error
		if !os.IsNotExist(err) {
			fmt.Printf("Error loading students: %v\n", err)
		}
	}
}

func LoadStudents(students *[]models.Student) error {
	file, err := os.Open(dataFile)
	if err != nil {
		return err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	if err := decoder.Decode(students); err != nil {
		return err
	}

	return nil
}

func SaveStudent(students []models.Student) error {
	data, err := json.MarshalIndent(students, "", " ")
	if err != nil {
		return err
	}
	return os.WriteFile(dataFile, data, 0644)
}

func GetAllStudents() []models.Student {
	return students
}

func GetStudentById(id int) (*models.Student, error) {
	for _, s := range students {
		if s.ID == id {
			return &s, nil
		}
	}

	return nil, errors.New("student not found")
}

func AddNewStudent(student *models.Student) error {
	var err error
	student.ID, err = GenerateNewId()
	if err != nil {
		return err
	}
	students = append(students, *student)
	return SaveStudent(students)
}

func GenerateNewId() (int, error) {
	// Tạo map để kiểm tra ID đã tồn tại
	existingIds := make(map[int]bool)
	for _, s := range students {
		existingIds[s.ID] = true
	}

	rand.Seed(time.Now().UnixNano())

	const prefix = 221
	const maxRand = 999 

	for i := 0; i < 1000; i++ {
		suffix := rand.Intn(maxRand + 1) 
		newId := prefix*1000 + suffix 
		if !existingIds[newId] {
			return newId, nil
		}
	}

	return 0, fmt.Errorf("could not generate a unique student ID")
}

func UpdateStudent(id int, info *models.Student) error {
	for i, s := range students {
		if s.ID == id {
			students[i] = *info
			return SaveStudent(students)
		}
	}

	return errors.New("student not found")
}

func DeleteStudent(id int) error {
	for i, s := range students {
		if s.ID == id {
			students = slices.Delete(students, i, i+1)
			return SaveStudent(students)
		}
	}

	return errors.New("student not found")
}

func SearchStudents(query string) ([]models.Student, error) {
	if query == "" {
		return []models.Student{}, nil
	}

	var matchedStudents []models.Student
	queryLower := strings.ToLower(strings.TrimSpace(query))

	for _, student := range students {
		if matchesStudent(student, queryLower) {
			matchedStudents = append(matchedStudents, student)
		}
	}

	return matchedStudents, nil
}

// matchesStudent checks if a student matches the search query
func matchesStudent(student models.Student, queryLower string) bool {
	// Search in ID (convert to string)
	if strings.Contains(strconv.Itoa(student.ID), queryLower) {
		return true
	}

	// Search in Name (case-insensitive)
	if strings.Contains(strings.ToLower(student.Name), queryLower) {
		return true
	}

	// Search in Email (case-insensitive)
	if strings.Contains(strings.ToLower(student.Email), queryLower) {
		return true
	}

	// Search in Date of Birth
	if strings.Contains(strings.ToLower(student.Dob), queryLower) {
		return true
	}

	// Search in GPA (convert to string)
	if strings.Contains(fmt.Sprintf("%.2f", student.Gpa), queryLower) {
		return true
	}

	return false
}

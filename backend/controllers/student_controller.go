package controllers

import (
	"strconv"

	"github.com/kataras/iris/v12"

	"miniproject/models"
	"miniproject/services"
)

func GetStudents(ctx iris.Context) {
	students := services.GetAllStudents()
	// if err != nil {
	// 	ctx.StopWithError(iris.StatusInternalServerError, err)
	// 	return
	// }

	ctx.JSON(students)
}

// func GetStudent(ctx iris.Context) {
// 	idParam := ctx.Params().Get("id")
// 	id, _ := strconv.Atoi(idParam)
// 	student, err := services.GetStudentById(id)
// 	if err != nil {
// 		ctx.StopWithError(iris.StatusNotFound, err)
// 		return
// 	}
// 	ctx.JSON(student)
// }

func GetStudent(ctx iris.Context) {
	keyword := ctx.Params().Get("id")

	students, err := services.SearchStudents(keyword)
	if err != nil {
		ctx.StopWithError(iris.StatusInternalServerError, err)
		return
	}

	if len(students) == 0 {
		ctx.StopWithStatus(iris.StatusNotFound)
		return
	}
	ctx.JSON(students)
}

func AddStudent(ctx iris.Context) {
	var student models.Student
	if err := ctx.ReadJSON(&student); err != nil {
		ctx.StopWithError(iris.StatusBadRequest, err)
		return
	}

	if err := services.AddNewStudent(&student); err != nil {
		ctx.StopWithError(iris.StatusInternalServerError, err)
		return
	}

	ctx.StatusCode(iris.StatusCreated)
	ctx.JSON(student)
}

func UpdateStudent(ctx iris.Context) {
	idParam := ctx.Params().Get("id")
	id, _ := strconv.Atoi(idParam)

	var student models.Student
	if err := ctx.ReadJSON(&student); err != nil {
		ctx.StopWithError(iris.StatusBadRequest, err)
		return
	}
	err := services.UpdateStudent(id, &student)
	if err != nil {
		ctx.StopWithError(iris.StatusNotFound, err)
		return
	}
	ctx.JSON(student)
}

func DeleteStudent(ctx iris.Context) {
	idParam := ctx.Params().Get("id")
	id, _ := strconv.Atoi(idParam)

	if err := services.DeleteStudent(id); err != nil {
		ctx.StopWithError(iris.StatusNotFound, err)
		return
	}
	ctx.StatusCode(iris.StatusNoContent)
}

func SearchStudents(ctx iris.Context) {
	query := ctx.URLParam("q")

	// If no query parameter provided, return empty result
	if query == "" {
		ctx.JSON([]models.Student{})
		return
	}

	students, err := services.SearchStudents(query)
	if err != nil {
		ctx.StopWithError(iris.StatusInternalServerError, err)
		return
	}

	ctx.JSON(students)
}

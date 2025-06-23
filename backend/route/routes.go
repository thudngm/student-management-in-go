package route

import (
	"miniproject/controllers"

	"github.com/kataras/iris/v12"
)

func RegisterRoutes(app *iris.Application) {
	studentAPI := app.Party("/students")
	{
		studentAPI.Get("/", controllers.GetStudents)
		studentAPI.Get("/{id:string}", controllers.GetStudent)
		studentAPI.Post("/", controllers.AddStudent)
		studentAPI.Put("/{id:string}", controllers.UpdateStudent)
		studentAPI.Delete("/{id:string}", controllers.DeleteStudent)
	}
}

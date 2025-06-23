package main

import (
	"github.com/kataras/iris/v12"

	"miniproject/middleware"
	"miniproject/route"
)

func main() {
	app := iris.New()
	app.Use(middleware.Crs())
	app.Use(middleware.Logger)

	app.Options("/{path:path}", func(ctx iris.Context){
		ctx.StatusCode(iris.StatusNoContent)
	})

	// app.Logger().SetLevel("debug")
	route.RegisterRoutes(app)

	app.Listen(":8080")
}


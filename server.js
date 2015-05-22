var multer = require("multer")
var express = require("express")
var app = express()
var path = require("path")
var fs = require("fs")

var uploadDone = false
var uploadName = ""

// Configure multer object
app.use(multer({
	// Define the destination for uploaded files
	dest: "./uploads/",
	// Choose a unique naming system for uploaded files
	rename: function(fieldname, filename) {
		uploadName = filename + Date.now()
		return uploadName
	},
	// File upload event triggers
	onFileUploadStart: function(file) {
		console.log(file.originalname + " is uploading...")
	},
	onFileUploadComplete: function(file) {
		console.log(file.originalname + " uploaded to " + file.path)
		uploadDone = true
	}
}))

// Set Express JS view engine
app.set("views", __dirname + "/public")
app.set("view engine", "ejs")

// Set the default port
app.set("port", (process.env.PORT || 5000))

// Set up Express JS static file directory
app.use(express.static(__dirname + "/public"))

/************* Specify GET and POST request/response handling ***************/

// Main page loads with file upload .ejs form
app.get("/", function(request, response) {
	response.render("form.ejs")
})

// This page contains the uploaded image file
app.get("/show", function(request, response) {
	var filePath = path.join(__dirname + "/uploads/" + uploadName +".jpg")
	response.writeHead(200, {"Content-Type":"image/jpg"})
	fs.createReadStream(filePath).pipe(response)
})

// When form is submitted, redirect user to a new page displaying the uploaded image file
app.post("/upload", function(request, response) {
	var html = "File successfully uploaded."
	html += "<br/><img src='/show' alt=''/>"
	if (uploadDone) {
		console.log(request.files)
		response.writeHead(200, {"Content-Type":"text/html"})
		response.write(html)
		response.end()
	}
})

// Server listens on the default port
app.listen(app.get('port'), function() {
	console.log("Server started on port ", app.get("port"))
})

var multer = require("multer")
var express = require("express")
var app = express()
var path = require("path")
var fs = require("fs")
var uploadDone = false
var fileName = ""

// Configure multer
app.use(multer({
	// Define the destination for uploaded files
	dest: "./uploads/",
	// Choose a unique naming system for uploaded files
	rename: function(fieldname, filename) {
		fileName = filename + Date.now()
		return fileName
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

// Show page contains the uploaded image file
app.get("/show", function(request, response) {
	var filePath = path.join(__dirname + "/uploads/" + fileName +".jpg")
	response.writeHead(200, {"Content-Type":"image/jpg"})
	fs.createReadStream(filePath).pipe(response)
})

// When form is submitted, redirect user to Upload page. Page displays the uploaded image file
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

// Go to localhost:5000 to view the website
app.listen(app.get('port'), function() {
	console.log("Server started on port ", app.get("port"))
})
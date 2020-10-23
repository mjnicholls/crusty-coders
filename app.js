// require packages

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var gsap = require("gsap/dist/gsap").gsap;
var MotionPathPlugin = require("gsap/dist/MotionPathPlugin").MotionPathPlugin;
var draggable = require("gsap/dist/Draggable").draggable;
var url = "mongodb+srv://Mark:mark@cluster0-mzqid.mongodb.net/test?retryWrites=true&w=majority";
var MongoClient = require("mongodb").MongoClient;
var cors = require('cors')
var logger = require('morgan');
var cookieParser = require('cookie-parser')
var createError = require('http-errors');
const Queries = require('./models/Queries');
const Comment = require('./models/Comment');
const CommentNet = require('./models/CommentNet');
const CommentStream = require('./models/CommentStream');
const CommentApp = require('./models/CommentApp');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const db = require('./config/keys').mongoURI;


// Passport Config
require('./config/passport')(passport);


//additional global variables
var allComments, allAppComments, allStreamComments, allNetComments, result, searchResult, allUsers, allPhotos, user;


// parser
var urlencodedParser = bodyParser.urlencoded({
	extended: false
});


// Set public folder & instruct app on other packages to use
app.use(express.static('public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(logger('dev'));

app.use(cookieParser());

app.use(function(req,res,next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
})

// Connect to database with Mongoose
mongoose.Promise = global.Promise;

mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));
	

// EJS / Express Layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');


// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: true
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});



// Route for accessing the Queries database and rendering results

app.post('/searchData', function(req, res, next) {
    var term = req.body.search;
    Queries.find({term}, function (err, question) {
        if(err) {
            return res.render('searchresults/search', {question: null});
        
        }
        res.render('searchresults', {question: question, user: req.user});
    });
});

// POST routes for comment posting 

app.post("/postComment", urlencodedParser, function(req,res) {
	 Comment.create({name: req.body.name, comment: req.body.comment}, function(err, result){
		if(err) 
		throw err;
		console.log(result.ops);
	 });
	 res.redirect('whatsamouse')
})

app.post("/postCommentNet", urlencodedParser, function(req,res) {
	CommentNet.create({name: req.body.name, comment: req.body.comment}, function(err, result){
	   if(err) 
	   throw err;
	   console.log(result.ops);
	});
	res.redirect('whatsinternet')
})

app.post("/postCommentStream", urlencodedParser, function(req,res) {
	CommentStream.create({name: req.body.name, comment: req.body.comment}, function(err, result){
	   if(err) 
	   throw err;
	   console.log(result.ops);
	});
	res.redirect('whatsstreaming')
})

app.post("/postCommentApp", urlencodedParser, function(req,res) {
	CommentApp.create({name: req.body.name, comment: req.body.comment}, function(err, result){
	   if(err) 
	   throw err;
	   console.log(result.ops);
	});
	res.redirect('whatsanapp')
})

// GET routes for rendering pages + ejs comments

	app.get('/whatsamouse', async (req, res) => {
		await Comment.find({}, null, {sort: {date: 1}}, function(err, result) {
			if (err) throw err;
			allComments = result;
		});
		res.render('whatsamouse', { commentejs: allComments, user: req.user });
	});

	app.get('/whatsinternet', async (req, res) => {
		await CommentNet.find({}, null, {sort: {date: 1}}, function(err, result) {
			if (err) throw err;
			allNetComments = result;
		});
		res.render('whatsinternet', { commentnetejs: allNetComments, user: req.user });
	});

	app.get('/whatsstreaming', async (req, res) => {
		await CommentStream.find({}, null, {sort: {date: 1}}, function(err, result) {
			if (err) throw err;
			allStreamComments = result;
		});
		res.render('whatsstreaming', { commentstreamejs: allStreamComments, user: req.user });
	});

	app.get('/whatsanapp', async (req, res) => {
		await CommentApp.find({}, null, {sort: {date: 1}}, function(err, result) {
			if (err) throw err;
			allAppComments = result;
		});
		res.render('whatsanapp', { commentappejs: allAppComments, user: req.user });
	});



// Routes to routes folder
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));



app.get('/whatsinternet', async (req, res)  => {

	MongoClient.connect(url, {useNewUrlParser:true, useUnifiedTopology:true}, async function(err, client){
		var db = client.db("test");
		var commentCollection = db.collection("comment2");
		 commentCollection.find({}).sort({date: -1}).toArray(function(err, result){
		   if(err) throw err;
		   allComments = result;
		 });
		});
	
	res.render('whatsinternet', {commentejs2:allComments, user:req.user});
	})


	app.get('/whatsstreaming', async (req, res)  => {

		MongoClient.connect(url, {useNewUrlParser:true, useUnifiedTopology:true}, async function(err, client){
			var db = client.db("test");
			var commentCollection = db.collection("comment3");
			 commentCollection.find({}).sort({date: -1}).toArray(function(err, result){
			   if(err) throw err;
			   allComments = result;
			 });
			});
		
		res.render('whatsstreaming', {commentejs3:allComments, user:req.user});
		})
	


		app.get('/whatsanapp', async (req, res)  => {

			MongoClient.connect(url, {useNewUrlParser:true, useUnifiedTopology:true}, async function(err, client){
				var db = client.db("test");
				var commentCollection = db.collection("comment4");
				 commentCollection.find({}).sort({date: -1}).toArray(function(err, result){
				   if(err) throw err;
				   allComments = result;
				 });
				});
			
			res.render('whatsanapp', {commentejs4:allComments, user:req.user});
			})

			
//comments

const PORT = process.env.PORT || 5000;

app.listen(PORT, 
	/*
	function(){
	MongoClient.connect(url, {useNewUrlParser:true, useUnifiedTopology:true}, function(err, client){
	var db = client.db("test");
	var commentCollection = db.collection("comment");
	var commentCollection2 = db.collection("comment2");
	var commentCollection3 = db.collection("comment3");
	var commentCollection4 = db.collection("comment4");
	var queriesCollection = db.collection("queries");
	var userCollection = db.collection("users");
	userCollection.find().sort({"_id": -1}).toArray(function(err, result){
		if(err) throw err;
		allUsers = result;
	  });
	commentCollection.find({}).sort({date: -1}).toArray(function(err, result){
	   if(err) throw err;
	   allComments = result;
	 });
	 commentCollection2.find({}).sort({date: -1}).toArray(function(err, result){
		if(err) throw err;
		allComments = result;
	  });
	  commentCollection3.find({}).sort({date: -1}).toArray(function(err, result){
		if(err) throw err;
		allComments = result;
	  });
	  commentCollection4.find({}).sort({date: -1}).toArray(function(err, result){
		if(err) throw err;
		allComments = result;
	  });
	   
	 
})
   */
	console.log(`Server started on port ${PORT}`)
   );
   

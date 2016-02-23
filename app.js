//Help from https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
//Also from http://todomvc.com/examples/angularjs/#/

// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var path = require('path');

var index = require('./routes/index'); //all the routes
// configuration =================
console.log(process.env['MONGOLAB_URI']);
mongoose.connect(process.env['MONGOLAB_URI']);
// mongoose.connect('mongodb://heroku_pzt2dr5d:evsvd8oev3rut5cniqhmi3ge7r@ds015508.mongolab.com:15508/heroku_pzt2dr5d');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected!');
});     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
app.get('/api/todos', index.getTodos);

// create todo and send back all todos after creation
app.post('/api/todos', index.createTodo);

// toggle complete status of todo
app.post('/api/toggleTodoCompleted', index.toggleTodoCompleted);

// save an edited todo
app.post('/api/saveEditedTodo', index.saveTodo);

app.post('/api/removeTodo', index.removeTodo);

// application -------------------------------------------------------------
app.get('*', index.home);

// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");

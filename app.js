const express = require('express');
const dotenv = require('dotenv');
const http = require('http')
const connectDB = require('./config/db')
const morgon = require('morgan')
const exphbs = require('express-handlebars');
const { allowedNodeEnvironmentFlags } = require('process');
const path = require('path')
const passport = require('passport');
const session = require('express-session')
const methodOverride = require('method-override')
// dotenv.config({path: './config/config.env'});
const fileStore = require('session-file-store') (session)
//PORT
const PORT = process.env.PORT || 3000;
//AUTHENTICATION 
const authenticate = require('./config/authenticate')(passport)
//INITILAIZE THE APP
const app = express();

//CONNECTING WITH MONGO
connectDB()

if (process.env.NODE_ENV === "development") {
    app.use(morgon('dev'))
}

// HANDLEBARS HELPPPERS
const {formateDate, truncate, stripTags, editIcon, select, eq, delIcon, userN} = require('./helpers/hbs')
//HANDLESBARS 

app.engine('.hbs', exphbs({helpers:{
    formateDate,
    truncate,
    stripTags,
    editIcon,
    select,
    eq,
    delIcon,
    userN,

}, defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs')

//BODY PARSER
app.use(express.json());
app.use(express.urlencoded({extended:false}))

// METHOD OVERRIDE 
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))
//SESSIONS
app.use(session({
    name:'session-id',
    secret:'1236-5rw26',
    resave:false,
    saveUninitialized:false,
    store:new fileStore()
}))

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session())

// set globals
app.use((req, res, next)=> {
    res.locals.user = req.user;
    next()
})
// STATIC FILES 
app.use(express.static(path.join(__dirname, 'public')))

//ROUTES
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const hostname = "localhost"

const server = http.createServer(app)
server.listen(PORT, ()=> console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

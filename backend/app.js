import express from 'express';
import session from 'express-session';
import ejsLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import employeeRouter from './src/features/employee/routes/empoyee.routes.js';
import adminRouter from './src/features/admin/routes/admin.routes.js';
import feedbackRouter from './src/features/feedback/routes/feedback.routes.js';


const configPath = path.resolve("backend", ".env");
dotenv.config({path: configPath});

export const app = express();

app.use(express.json());
// Cookie parser
app.use(cookieParser());
app.use(bodyParser.json())
app.use(session({
    secret:'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false},
  }));

//SETTING UP THE VIEW ENGINES 
app.set('view engine', 'ejs');


//SETTING UP THE DEFAULT VIEW DIRECTORY
app.set('views', path.join(path.resolve(), 'backend','src', 'views'));


//SETTING UP THE EJS LAYOUTS
app.use(ejsLayouts);

//SETTING UP STATIC FOLDER SO THAT STYLE, SCRIPTS AND OTHER FILE CAN BE ACCESSED BY THE SERVER
app.use(express.static('backend/src/views'));
app.use(express.static('backend/public'));

//SETTING FOR POST REQUEST SO THAT REQ.BODY OBJECT CAN BE READ PROPERLY
app.use(express.urlencoded({extended: true}));

// Default route
app.get('/', (req,res,next)=>{
    res.redirect('/api/employee/register');
});

// Routes
app.use('/api/employee', employeeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/feedback', feedbackRouter);

// Error handler
app.use((err,req,res,next)=>{
    console.log(err);
    if (err.name === 'MongoServerError' && err.code === 11000) {
        // Duplicate key error
        return res.status(400).render('404Page', { errorMessage: 'Email already exists.' });
    }
    if(err instanceof mongoose.Error.ValidationError)
    {
        return res.render('404Page', {errorMessage: err.message});
    }
    
    return res.render('404Page', {errorMessage: "Something went wrong on server side."});
});
const express = require('express');
const session = require("express-session");
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
require('dotenv').config();
const app = express();
app.use(logger('dev'));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true ,limit: '5mb' }));
app.use(cors());
app.use(passport.initialize());





















require('./apiprotection/passport')(passport);
const fileupload = require('express-fileupload'); 

app.use(fileupload({useTempFiles: true}))

const mongoose = require('mongoose');
//express session
app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
      
    })
  );
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => {
        console.log('Error connecting to database');
    });


var indexRouter = require('./routes/index');
app.use('/api', indexRouter);


var employeesRouter = require('./routes/employees');
app.use('/api/employees', employeesRouter);


var companyRouter = require('./routes/company');
app.use('/api/company', companyRouter);

var timeoffRouter = require('./routes/timeoff');
const Users = require('./models/user');
app.use('/api/policy', timeoffRouter);


const notificationsRouter =  require('./routes/notifications')
app.use('/api/notifications', notificationsRouter);


const permissionRouter = require('./routes/permission');
app.use('/api/permissions', permissionRouter);








 
const { createServer } = require('http'); // Import the 'http' module
const { Server } = require('socket.io');
const server = createServer(app); // Pass your Express app to createServer
global.io  = new Server(server,{
    cors: {
      origin: "http://localhost:3000", // Replace with your allowed origin

    }
    });




io.on('connection', (socket) => {
    console.log('User connected');

});
















server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

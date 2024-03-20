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
const http = require('http').Server(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});


const Notifications = require('./models/notification');
io.on('connection', (socket) => {
    console.log('A user connected');

    // Here you can listen for events from the client, if needed

    // Example: Broadcasting updated notification count
    socket.on('newNotification', async () => {
        console.log('New notification received');
        const notificationCount = await Notifications.countDocuments();
        io.emit('notificationCountUpdated', notificationCount);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const  TimeOffs = require('../server/models/timeoff')
app.post('/getcongee' ,passport.authenticate('jwt' , {session : false}),  async (req,res)=>{
   

    try{
        console.log(req.body)
    const errors={}
    const {type , description , daterange}  = req.body
    if(!type){
        errors.type = "Type is required"
    }
    if (Date.now() > daterange[0]){
        errors.daterange = "Date range is invalid"
    }
    if (!description){
        errors.description = "Description is required"
    }
    if (Object.keys(errors).length > 0){
        return res.status(400).json(errors)
    }
    await TimeOffs.create({
        type,
        description,
        daterange,
        userId: req.user.id
    })
    await Notifications.create({
        content:{}
        // Add other necessary fields
    });

    // Emit an event to notify clients about the new notification
    io.emit('newNotification');
    
    return res.status(200).json({message : "Time off request created successfully"})


    }

    catch(error){
        console.log(error)
        return res.status(500).json({error})
    }


})















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










 

http.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports =  io ;
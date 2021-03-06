const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyPasser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tech:xKwWntlKbBKl4Euq@cluster0.mkm4x.mongodb.net/tartanhacks-dashboard',{
    useNewUrlParser: true
}
);

const participantsRouter = require('./api/routers/participants');
const authRouter = require('./api/routers/auth');
const projectsRouter = require('./api/routers/projects');
const checkinRouter = require('./api/routers/check-in');
const eventsRouter = require('./api/routers/events');




app.use(morgan('dev'));
app.use(bodyPasser.urlencoded({extended: false}));
app.use(bodyPasser.json());

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Token');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'TartanHacks Dashboard API',
        version: '0.0.1',
    },
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./api/routers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUi = require('swagger-ui-express');


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/participants', participantsRouter);
app.use('/auth', authRouter);
app.use('/projects', projectsRouter);
app.use('/checkin', checkinRouter);
app.use('/events', eventsRouter);



module.exports = app;


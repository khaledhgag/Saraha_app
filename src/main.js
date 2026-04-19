    import './config/env.config.js';
    import express from 'express';
    import cors from 'cors';
    import { corsOptions } from './config/Cors.config.js';
    import envconfig from './config/env.config.js';
import dbconnection from './DB/db.connection.js';
import {globalErrorHandler} from './Middlewares/index.js';
import * as controllers from './Modules/index.js';

//express app
const app = express();
    app.use(cors(corsOptions));
    app.use(express.json());
    //port
    const port = envconfig.app.PORT;

    //db connection
    dbconnection();

    //controllers
    app.use('/api/auth', controllers.authcontroller);
    app.use('/api/users', controllers.usercontroller);
    app.use('/api/messages', controllers.messagecontroller);
    //test api
    app.get('/', (req, res) => {
        res.send("API is working");
    });

    app.use((req, res, next) => {
        const error = new Error('Not Found');
        error.cause = { status: 404 };
        next(error);
    });
    //middlewares
    app.use(globalErrorHandler);

    //server start 
    app.listen(port, () => {
    console.log(`Server is running on ports ${port}`);
    });

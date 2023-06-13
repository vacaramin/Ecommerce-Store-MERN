const app = require('./app');
const connectDatabase = require('./config/database');
const dotenv = require('dotenv');

// Handle uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1)

});


dotenv.config({ path: 'backend/config/config.env' });


//connecting to database

connectDatabase();

const server = app.listen(process.env.PORT, () => { 
    console.log(process.env.PORT);
    console.log(`Server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
 }
 );
//Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1)
    })
}
);
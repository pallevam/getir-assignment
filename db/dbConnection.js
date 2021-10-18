import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const mongoOptions = {
    user: process.env.DB_USER_NAME,
    pass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    retryWrites: true,
    keepAlive: true
}

// export async function initGetirDbConnection() {
//     mongoose.connect(process.env.DB_URL, mongoOptions)
//     global.db = mongoose.connection

//     global.db.on('open', () => {
//         console.log(`Mongoose connection open on: ${JSON.stringify(process.env.DB_URL_TEMPLATE)}`)
//     })
//     global.db.on('error', (err) => {
//         console.log(`Mongoose connection error: ${err} with connection ${JSON.stringify(process.env.DB_URL_TEMPLATE)}`)
//     })
//     return global.db

// }

mongoose.connect(process.env.DB_URL, mongoOptions)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once("open", function () {
  console.log(`Successfully connected to ${process.env.DB_URL_TEMPLATE}`);
});

module.exports = db


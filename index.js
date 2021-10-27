import express from 'express'
import './env.js'
const db = require('./db/dbConnection')
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import path from 'path'
import { body, validationResult } from 'express-validator'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const PORT = process.env.PORT || 3000
const corsOptions = {
    credentials: true, origin:(origin, callback) => {
        callback(null, true)
    }
}
app.use(cors(corsOptions))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Accept, Authorization, Content-Type, Access-Control-Request-Method,Access-Control-Allow-Origin, Access-Control-Allow-Headers, Accept,x-auth-token, mix-panel',
    )
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Credentials', 'true')
    if (req.method === 'OPTIONS') {
      res.status(200).send({ success: true })
    } else next()
})
app.use(express.static(path.join(__dirname, 'views')))
 
// Routing

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'))
})

app.get('/getrecords', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/records.html'))
})

app.post('/getrecords', (req, res) => {
    let { StartDate, EndDate, MinCount, MaxCount } = req.body

    console.log(req.body)
    
    // if(StartDate === '' || EndDate === '' || !MinCount || !MaxCount) {
    //     res.status(404).send({ status: 'error', msg: "Request payload missing!"})
    // }
    const collection = db.collection('records')
    const recordsData = collection.aggregate(
        [
            {
                $match: {
                    "createdAt": {
                        $gte: new Date(new Date(StartDate).setHours(0, 0, 0)),
                        $lte: new Date(new Date(EndDate).setHours(0, 0, 0))
                    }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "key": 1,
                    "createdAt": 1,
                    totalCount: {
                        $sum: "$counts",
                        
                    }
                }
            }
        ],
        function (err, cursor) {
            cursor.toArray(function(err, records) {
                if(err) {
                    res.status(404).json({
                        code: 1,
                        msg: 'Failure',
                        message: 'Could not retrieve records!'
                    })
                }
                console.log(records)
                res.status(200).json({
                    code: 0,
                    msg: "Success",
                    records
                })
            })
        }
    )
})

// Error handler - global
app.use((error, req, res, next) => {
    console.log('Error: ', error)
    res.status(error.status ? error.status: 500).send(error.message ? error.message: error)
    next(error)
})

module.exports = app.listen(PORT, () => {
    console.log(`NODE_ENVIRONMENT: ${process.env.NODE_ENV}`)
    console.log(`Server listening on port ${PORT}`)
})
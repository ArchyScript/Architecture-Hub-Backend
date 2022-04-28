const express = require('express')
require('dotenv').config()
    // import { connectDatabase } from './controller/mongooseConnect.js'
const mongoose = require('mongoose')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 4000

// connectDatabase()
// try {
mongoose.connect(
        process.env.mongodbConnectionString, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
        },
        () => {
            console.log('connectred to mongodbd')
        }
    )
    // } catch (error) {
    //     console.log(error.message)
    // }

//
// Body parser
// Allows express use req.body on the routes
app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'static')))
    // Homme page
    // app.get('/', (req, res) => {
    //     return res.send('Welcome to the Home route')
    // })

//
// routes
// User authentification
const auth = require('./routes/auth/auth')
const posts = require('./routes/posts')
    // const register = require('./routes/register/auth.js')
    // file uploads
const uploads = require('./routes/upload/index')
    // const architecture_hub = require('./routes/posts')
    // const posts = require('./routes/posts')
    // const posts = require('./routes/posts')

// referencing respective routes
app.use('/auth', auth)
app.use('/posts', posts)
app.use('/upload', uploads)
    // app.use('/api', register)

app.listen(PORT, () => {
    console.log(`Architecture Hub backend is running on port ${PORT}`)
})

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://ArchyScript:<password>@cluster0.unwxu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// Replace <password> with the password for the ArchyScript user. Replace myFirstDatabase with the name of the database that connections will use by default. Ensure any option params are URL encoded.
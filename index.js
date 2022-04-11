const express = require('express')
require('dotenv').config()
const app = express()

const PORT = 3000

const jwt_token = process.env.jwt_token_secret_key
console.log(jwt_token + ' jfdk')

// Body parser
// Allows express use req.body on the routes
app.use(express.json())

// Homme page
app.get('/', (req, res) => {
    return res.send('Welcome to the Home route')
})

// routes
// User authentification
const auth = require('./routes/auth/auth')
const posts = require('./routes/posts')
    // const architecture_hub = require('./routes/posts')
    // const posts = require('./routes/posts')
    // const posts = require('./routes/posts')

// referencing respective routes
app.use('/auth', auth)
app.use('/posts', posts)

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
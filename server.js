const express = require('express')
const app = express()

const PORT = 3000

// Body parser
app.use(express.json())

// Homme page
app.get('/', (req, res) => {
    return res.send(
        "<h1 style='text-align: center;'>Hello,<br />from the Express.js server!</h1>",
    )
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
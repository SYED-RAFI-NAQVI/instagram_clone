const express = require ("express")
const app = express()
const mongoose = require ("mongoose")
const PORT = process.env.PORT || 5000
const {MONGOURI} = require("./config/keys")

require ('./models/user')
require ('./models/post')

//takes the inccoming request and pass to the json
app.use(express.json())
app.use(require('./routes/post'))
app.use (require('./routes/auth'))
app.use (require('./routes/user'))


//prodcution 
if (process.env.NODE_ENV == "production") {
    app.use(express.static('frontend/build'))
    const path = require('path')
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
    })
}


const customMiddleware = (req, res, next)  => {
    console.log("Middle ware")
    next()
}

app.use(customMiddleware)

app.get('/',(req,res) =>  {
    console.log ("Home")
    res.send("Helo world")
})


app.get('/about',(req, res) => {
    console.log ('about')
    res.send("ABOUT PAGE")
})


app.listen (PORT, () => {
    console.log ( `Server is running... ${PORT}` )
})

mongoose.connect (MONGOURI,{
    useNewUrlParser : true,
    useUnifiedTopology  : true
})
mongoose.connection.on ('connected', ()=> {
    console.log("Connection  successful")
})

mongoose.connection.on ('error', (err)=> {
    console.log("Error connection ",err)
})

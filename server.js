//module to create server instance, parse data to readable data
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

//app will run on localhost:3000
const PORT = process.env.port || 3000

//import json data from friends.json
const friends = require('./app/data/friends.json')

//create an instance of express
const app = express()

//parse post data thats json format 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//serves static files to client
app.use(express.static(__dirname + '/app/public'))
app.use(express.static(__dirname + '/app/data'))

//test tool to see what request,data is being sent to and from server
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url} - ${JSON.stringify(req.body)}`)
    next()
})

//my routes to 'home' and 'survey' page and 'friends-api'
app.get('/', (req, res) => {
    res.status(200)
    res.send('index.html')
})
app.get('/survey', (req, res) => {
    res.status(200)
    res.sendFile(path.join(__dirname + '/app/public', 'survey.html'))
})

//form submission 'POST' request
app.post('/api/newFriend', (req, res) => {
    /*===== variables that hold values from form =====*/
    var name = req.body.name
    var photo = req.body.photo

    var q_1 = req.body.question_1, q_2 = req.body.question_2, q_3 = req.body.question_3, q_4 = req.body.question_4, q_5 = req.body.question_5, q_6 = req.body.question_6, q_7 = req.body.question_7, q_8 = req.body.question_8, q_9 = req.body.question_9, q_10 = req.body.question_10

    var scores = [
        Number(q_1),Number(q_2),Number(q_3),Number(q_4),Number(q_5),Number(q_6),Number(q_7),Number(q_8),
        Number(q_9),Number(q_10)
    ]

    /*===== object to hold client data =====*/
    var data = {name, photo, scores}

    /*===== vars to store mod. friends array and the final result =====*/
    let matches = []
    let result

    /*===== loop through all friends data =====*/
    for(let i = 0; i < friends.length; i++) {
        /*===== var to hold overall number difference =====*/
        let totalDifference = 0
        /*===== object to hold friends data =====*/
        let newObj = {
            score: Number(),
            name: String(),
            photo: String()
        }
        
        /*===== nested forloop to loop through each index of array  =====*/
        for(let j = 0; j < 10; j++){
            /*===== calculate the difference. Store in var =====*/
            totalDifference += Math.abs(data.scores[j] - friends[i].scores[j])
        }
        /*===== assign values to object keys =====*/
        newObj.score = totalDifference
        newObj.name = friends[i].name
        newObj.photo = friends[i].photo

        /*===== push object to matches array =====*/
        matches.push(newObj)
    }
    /*===== variable to sort, in order of least to greatest, each object in array =====*/
    let matchOrder = matches.sort((a, b) => {return a.score - b.score})

    /*===== assign first object instance to result var =====*/
    result = matchOrder[0]

    /*===== push user object to friends array =====*/
    friends.push(data)
    /*===== convert data to json format  =====*/
    let x = JSON.stringify(friends)

    /*===== overwrite json file to read update =====*/
    fs.writeFile('./app/data/friends.json', x, (err, result) => {
        /*===== if error throw error message else give 'Success' message =====*/
        if (err) {
            throw err
        } else {
            console.log('Success')
        }
    })

    /*===== response codes to send back to user =====*/
    /*===== 'OK' =====*/
    res.status(200)
    /*===== what format im sending('html') =====*/
    res.setHeader('Content-Type', 'text/html')
    /*===== template literal of data im sending back to user =====*/
    res.send(`
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" referrerpolicy="no-referrer" />

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.5.3/css/bootstrap.min.css" integrity="sha512-oc9+XSs1H243/FRN9Rw62Fn8EtxjEYWHXRvjS43YtueEewbS6ObfXcJNyohjHqVKFPoXXUxwc+q1K7Dee6vv9g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <title>Match Maker-Result</title>
        </head>
        <body>
            <div class='container'>
                <div class='jumbotron d-flex text-center flex-column pb-4'>
                    <h2>Its A Match!</h2>
                    <div>${result.name}</div>
                    <img class='img-fluid' src='${result.photo}' />
                    <a href="/" class="w-100 mt-3"> 
                        <button class="btn btn-secondary btn-lg">
                            <span class="fa fa-home"></span> Go Back To Home Page
                        </button>
                    </a>
                </div>
            </div>
        </body>
    `)
})


/*===== app listener and message =====*/
app.listen(PORT, () => {
    console.log(`Match Maker App running on http://localhost:${PORT}`)
})
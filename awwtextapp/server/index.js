const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const path = require('path');

const request = require('request');
const requestPromise = require('request-promise');
const axios = require('axios');
const { response } = require('express');

const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

//for deployment to heroku
const port = process.env.PORT || 3001;
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

//after building project
//Ref: https://www.freecodecamp.org/news/deploy-a-react-node-app-to/
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

//routes
exports.handler = function (context, event, callback) {
    let twiml = new Twilio.twiml.MessagingResponse();

    axios
        .get(`https://www.reddit.com/r/aww/top.json?t=day&limit=1`)
        .then((response) => {
            console.log("Response:" + response.data);
        let { title, name, permalink, url } = response.data;
        twiml.say(`The top /r/aww post of the day is: `);
        twiml.say(`${title}`);
        twiml.say(`${url}`);
        twiml.say(`available at ${permalink}.`);
        
        return callback(null, twiml);
        })
        .catch((error) => {
        console.log(error);
        return callback(error);
    });
};

app.post('/api/mmsmessages', (req, res) => {
    const options = {
        url: 'https://www.reddit.com/r/aww/top.json?t=day&limit=1',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json'
        }
    };

    return requestPromise(options)
        .then(function(body) {
            //console.log(JSON.parse(body));
            
            let redditData = JSON.parse(body);

            console.log("Title: " + redditData.data.children[0].data.title + ' (' +
                redditData.data.children[0].data.permalink + ')');
            console.log("Image URL: " + redditData.data.children[0].data.url);
            console.log("Is Video: " + redditData.data.children[0].data.is_video);
            console.log("Permalink: " + redditData.data.children[0].data.permalink);
            
            let isVideo = redditData.data.children[0].data.is_video;

            res.header('Content-Type', 'application/json');
            client.messages
            .create({
                from: process.env.TWILIO_PHONE_NUMBER,
                to: req.body.to,
                body: redditData.data.children[0].data.title + ': ' +
                'https://www.reddit.com' + redditData.data.children[0].data.permalink,

                //don't send media if media is a video (too large for mms)
                if(isVideo){ mediaUrl: [redditData.data.children[0].data.url]}
            })
            .then(() => {
                res.send(JSON.stringify({ success: true }));
            })
            .catch(err => {
                console.log(err);
                res.send(JSON.stringify({ success: false }));
            })
    
    }).catch(function(err){
        console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}.`);
});

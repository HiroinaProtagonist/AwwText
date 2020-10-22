const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

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

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);

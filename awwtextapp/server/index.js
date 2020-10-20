const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const axios = require('axios');

const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

//Get top post from r/aww for the day
//Ref: https://www.twilio.com/docs/runtime/quickstart/serverless-functions-make-a-read-request-to-an-external-api
//Ref: https://www.reddit.com/dev/api/oauth#GET_top
exports.handler = function (context, event, callback) {
    let twiml = new Twilio.twiml.MessagingResponse();
  
    axios
      .get(`https://www.reddit.com/r/aww/top.json?t=day&limit=1`)
      .then((response) => {
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

//routes
//Sends MMS message with user-defined to phone number and prefilled data
//https://www.twilio.com/docs/sms/send-messages#include-media-in-your-messages
app.post('/api/redditMMSMessages', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.messages
    .create({
        body: title,
        from: process.env.TWILIO_PHONE_NUMBER,
        mediaUrl: [url],
        to: req.body.to
    })
    //.then(message => console.log(message.sid))
    .then(() => {
        res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

//Sends sms message with user-defined body and user-defined to phone number
//https://www.twilio.com/blog/send-an-sms-react-twilio
app.post('/api/messages', (req, res) => {
    res.header('Content-Type', 'application/json');
    client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);

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
    let twiml = new Twilio.twiml.VoiceResponse();
  
    // Open APIs From Space: http://open-notify.org/
    // Number of People in Space
    axios
      //.get(`http://api.open-notify.org/astros.json`)
      .get(`https://www.reddit.com/r/aww/top.json?t=day&limit=1`)
      .then((response) => {
        //let { number, people } = response.data;
        //let names = people.map((astronaut) => astronaut.name);
        //twiml.say(`There are ${number} people in space.`);
        //twiml.say(`They are ${names.join()}`);
        
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
app.get('/api/greeting', (req, res) => {
    console.log(exports.handler.toString);
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});


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

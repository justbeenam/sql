// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});



// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req, res) => {
  const dateParam = req.params.date;
  let isValidDate = Date.parse(dateParam);
  let isValidUnixNumber = /^[0-9]+$/.test(dateParam)
  let isEmpty = dateParam == "" || dateParam == null;
  let unix = 0;
  let utc  = "";

  if (isValidDate) {
    unix = new Date(dateParam);
    utc  = unix.toUTCString();
  
    return res.json({unix : unix.valueOf(), utc : utc});
  }else if (isNaN(isValidDate) && isValidUnixNumber) {
    unix = new Date(parseInt(dateParam));
    utc  = unix.toUTCString();
    return res.json({unix : unix.valueOf(), utc : utc});
  }
  else if (isEmpty) {
    unix = new Date();
    utc  = unix.toUTCString();
    return res.json({unix : unix.valueOf(), utc : utc});  
  }
  else {
    res.json({error: "Invalid Date"});
  }

  return res.json({
    unix: parseInt(date.getTime()),
    utc: date.toUTCString()
  });
});

app.get('/api/whoami', (req, res) => {
  const ipaddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  const language = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'unknown';

  const software = req.headers['user-agent'] || 'unknown';

  res.json({
    ipaddress,
    language,
    software
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

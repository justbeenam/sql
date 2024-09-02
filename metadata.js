var express = require('express');
var cors = require('cors');
require('dotenv').config()



var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.post('/api/fileanalyse', (req, res) => {
  if (!req.headers['content-type'].startsWith('multipart/form-data')) {
    return res.status(400).json({ error: 'Content type must be multipart/form-data' });
  }

  const boundary = req.headers['content-type'].split('; ')[1].split('=')[1];
  let data = '';
  
  req.on('data', chunk => {
    data += chunk.toString();
  });
  
  req.on('end', () => {
    const parts = data.split(`--${boundary}`);
    const filePart = parts[1];
    const headerEndIndex = filePart.indexOf('\r\n\r\n');
    
    if (headerEndIndex === -1) {
      return res.status(400).json({ error: 'Invalid file format' });
    }
    
    const headers = filePart.substring(0, headerEndIndex).split('\r\n');
    const fileData = filePart.substring(headerEndIndex + 4, filePart.lastIndexOf('--'));

    const contentDisposition = headers.find(header => header.startsWith('Content-Disposition'));
    const fileName = contentDisposition.match(/filename="(.+)"/)[1];
    const mimeType = headers.find(header => header.startsWith('Content-Type')).split(': ')[1];
    const fileSize = Buffer.byteLength(fileData);

    return res.json({
      name: fileName,
      type: mimeType,
      size: fileSize
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

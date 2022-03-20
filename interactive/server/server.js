const express = require('express');
const http = require('http');
const path = require('path');
var positions = require("./routes/positions");

//routes
var app = express();
const server = http.createServer(app);

// app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/positions', positions);

// app.get('*', function(req, res) {
//   res.sendFile('index.html', {root: path.join(__dirname, 'client', 'build')});
// });

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server started on port ${port}`));
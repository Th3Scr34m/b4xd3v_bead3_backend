var express = require('express');
var fortune = require('fortune');
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');

var server = express();

var store = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/.db' }
    },
    serializers: [{ type: jsonapi }]   
}); 

store.defineType('subject', {
    name:       {type: String},
    code:       {type: String},
    size:       {type: Number},
    location:   {type: String},
    teacher:    {type: String}
});

store.defineType('user', {
    neptun:     {type: String},
    password:   {type: String},
    surname:    {type: String},
    forename:   {type: String},
    email:      {type: String},
});

server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

server.use(fortune.net.http(store));

var port = process.env.PORT || 8080;
   
store.connect().then(function () {
    server.listen(port, function () {
        console.log('JSON Api server started on port ' + port);
    });
});
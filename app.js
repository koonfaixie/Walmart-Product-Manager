const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// static files
app.use(express.static('./public'));

// middleware - body parser
app.use(bodyParser.json());

// middleware - error handler
app.use(function(err, req, res, next){
	res.status(422).send({error: 'error'});
})

// routes
app.use('/api', require('./server/routes/api'));

// catch all
app.get('*', function(req, res){
	res.sendFile(__dirname+'/public/index.html');
});

// listen to port
app.listen(process.env.PORT || 3000, function(){
	console.log('listening for requests');
});

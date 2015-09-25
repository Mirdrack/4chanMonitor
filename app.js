var express = require('express');
var path = require('path');
var app = express();

require('./routes.js')(app);

app.set('port', process.env.PORT || 80);
app.set('views', './views');
app.set('view engine', 'jade');




var server = app.listen(8000, function () {

	console.log('Listening on port %d', server.address().port);
});
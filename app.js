var express = require('express');
var path = require('path');
var app = express();

var fourChanService = require('./services/fourChanService.js');
require('./routes.js')(app, fourChanService);

app.set('port', process.env.PORT || 80);
app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'));




var server = app.listen(8000, function () {

	console.log('Listening on port %d', server.address().port);
});
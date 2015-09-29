module.exports = function (app, fourChanService) {

	app.get('/', function (req, res) {
		
		res.render('index.jade');
		/*fourChanService.getCategories(function (data) {

			res.render('index.jade', { categories : data });
		}); */
		
	});

	app.get('/board/:name', function (req, res) {

		var boardName = req.params.name;
		fourChanService.getBoard(boardName, function (data) {

			res.render('board.jade', { name : boardName, threads : data });
		});
	});

	app.get('/thread/:section/:id/:surl', function (req, res) {

		var section = req.params.section;
		var id = req.params.id;
		var surl = req.params.surl;
		fourChanService.getThread(section, id, surl, function (data) {

			res.render('thread.jade', { threadName : surl, resources : data });
		});
	});

	app.get('/test', function (req, res) {

		var spawn = require('child_process').spawn,
		ls    = spawn('python', ['./python/scrapper.py', 'cadena', 1, 'otraCadena']);

		ls.stdout.on('data', function (data) {
		  console.log('stdout: ' + data);
		});

		ls.stderr.on('data', function (data) {
		  console.log('stderr: ' + data);
		});

		ls.on('close', function (code) {
		  console.log('child process exited with code ' + code);
		});

		res.render('test.jade');

	});
};
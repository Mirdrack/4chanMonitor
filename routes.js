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
};
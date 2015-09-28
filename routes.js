module.exports = function (app, fourChanService) {

	app.get('/', function (req, res) {
		
		fourChanService.getCategories(function (data) {

			res.render('index.jade', { categories : data });
		}); 
		
	});

	app.get('/board/:name', function (req, res) {

		var boardName = req.params.name;
		fourChanService.getBoard(boardName, function (data) {

			res.render('board.jade', { name : boardName, threads : data });
		});
	});
};
module.exports = function (app, fourChanService) {

	app.get('/', function (req, res) {
		
		fourChanService.getCategories(function (data) {

			res.render('index.jade', { categories : data });
		}); 
		
	});
};
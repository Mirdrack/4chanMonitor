var fourChanService = {

	getCategories : function (callback)
	{
		
		var osmosis = require('osmosis');
		osmosis.get('http://www.4chan.org/')
			.set({
		  		'categories': ['a.boardlink'],
				'links': ['a.boardlink @href']
		  	}) 
		.data(function (results) {

		    for(var cont = 0, categories = [], element = {}; cont < results.categories.length; cont++) {

		    	element.name = results.categories[cont];
		    	element.link = results.links[cont];
		    	categories.push(element);
		    	element = {};
		    }
		    categories.splice(-23, 23);
		    callback(categories);
		});


		/*var noodle = require('noodlejs');
		noodle.query({  
		  url: 'http://www.4chan.org/',
		  type: 'html',
		  selector: 'a.boardlink',
		  extract: 'href'
		})
		.then(function (data) {
		  	console.log(typeof(data.results));
			//data.results.splice(3 , 5, 'hola' );
		  	console.log('========');
		  	console.log(data.results);
		  	console.log('========');
		  	var keys = Object.keys(data.results);
		  	console.log(keys);
		});*/


		/*var Xray = require('x-ray');
		var x = Xray();

		x('https://4chan.org/', {title:'.boardlink'})
		(function (err, result) {
			console.log(result)
		});*/

		/*[{
			'title': '.boardlink a@title',
		  	'href': '.boardlink a@href',
		}]*/
		

		/*	var request = require("request");
			var cheerio = require("cheerio");
			var url = 'http://4chan.org/';
			
			request(url, function (error, response, body) {
			if (!error) {
				var $ = cheerio.load(body),
					temperature = $('.boardlink').html();
					
					console.log("It’s " + temperature + " degrees Fahrenheit.");
			} else {
				console.log("We’ve encountered an error: " + error);
			}
		});*/

		/*console.log('this.categories');
		console.log(this.categories);
		var data = {
			categories : ['uno', 'dos']
		};
		return data;*/
	},

	getBoard : function (boardName, callback) {

		// Proccess to scrap
		var osmosis = require('osmosis');
		console.log('http://boards.4chan.org/' + boardName + '/catalog');
		osmosis.get('http://boards.4chan.org/' + boardName + '/catalog')
			.set({
		  		'threads': ['script']
		  	}) 
		.data(function (results) {

		    /*
		    for(var cont = 0, categories = [], element = {}; cont < results.categories.length; cont++) {

		    	element.name = results.categories[cont];
		    	element.link = results.links[cont];
		    	categories.push(element);
		    	element = {};
		    }
			*/
			results.threads.splice(3, 5);
			results.threads.splice(0, 2);
			var info = results.threads[0];
			info = info.split('var catalog =');
			info = info[1];
			info = info.split('var style_group');
			info = info[0];
			info = info.substring(0, info.length - 5);
			info = JSON.parse(info.toString());
		    
		    /*console.log('===COUNT=======');
		    console.log(info.count);

		    
		    console.log('=====ORDER=====');
		    console.log(info.order.alt);*/

		    var thread = {};
		    var threads = [];
		    for (cont = 0; cont < info.count; cont++) {

		    	id = info.order.alt[cont];
		    	thread = info.threads[id];
		    	thread.id = id;
		    	threads.push(thread);
		    }

		    /*console.log('====THREADS======');
		    console.log(threads);


			// Dummy data
			threads = [
				{ name : 'Thread 1', link: 'url' },
				{ name : 'Thread 2', link: 'url' }
			];*/
			callback(threads);
		});


	}
};

module.exports = fourChanService;
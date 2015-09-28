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
				We trim the results for the script with the catalog data
			 	and the we parse the catalog variable to json
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
		    
			/*
				The next lines take an ordenation method
				create a single thread object and push it
				to the threads array
			 */		   
		    var thread = {};
		    var threads = [];
		    for (cont = 0; cont < info.count; cont++) {

		    	id = info.order.alt[cont]; // alt is the ordenation method
		    	thread = info.threads[id];
		    	// we push the id cause jade template engine 
		    	// cannot access to the object keys
		    	thread.id = id; 
		    	threads.push(thread);
		    }
		    // After all, we call the callback
			callback(threads);
		});
	},

	getThread : function(boardName, id, surl, callback) {

		var self = this; // Saving the reference to the main object
		// Proccess to scrap
		var osmosis = require('osmosis');
		var url = 'http://boards.4chan.org/' + boardName + '/thread/' + id + '/' + surl;
		osmosis.get(url)
		.set({
			'resources': ['a.fileThumb @href']
		}) 
		.data(function (results) {

			var resources = results.resources;
			for(var cont = 0; cont < resources.length; cont++)
			{
				var url = 'http:' + resources[cont];
				
				// We set the name for file
				var filename = resources[cont].split('/');
				filename = filename[filename.length - 1];

				// We set the full path '.files/boardName/semanticURL/filename'
				var path = './files/' + boardName + '/' + surl + '/' +filename;

				console.log(url + '::' + path);

				// We download the file
				self.dowloadResource(url, boardName, surl, path, function () {
					console.log('File downloaded');
				});
				
				/*
				self.dowloadResource(url, path, function () {
					console.log('Dowload completed');
				});*/
			}
		    // After all, we call the callback
			callback(resources);
		});

		

	},

	dowloadResource: function (uri, boardName, surl, filename, callback) {

		// We gonna save the files so we setup the required libraries
		var request = require('request');
		var fs = require('fs');


		// We check for the directories and we create them if they dont exists
		var boardDirectory = './files/' + boardName
		var surlDirectory = './files/' + boardName + '/' + surl;
		if ( !fs.existsSync(boardDirectory) ) {
		    
		    fs.mkdirSync(boardDirectory);
		    if( !fs.existsSync(surlDirectory) ) {
		    	
		    	fs.mkdirSync(surlDirectory);
		    }
		}

		// We download the file
		console.log('=== Dowloading::' + uri );
		request.head(uri, function(err, res, body) {
			// console.log('content-type:', res.headers['content-type']);
			// console.log('content-length:', res.headers['content-length']);
			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	}



};

module.exports = fourChanService;
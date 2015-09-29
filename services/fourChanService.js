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
	},

	getBoard : function (boardName, callback) {

		// Proccess to scrap
		var osmosis = require('osmosis');
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
			console.log('There going to be downloaded ' + resources.length + ' resources.' );
			for(var cont = 0; cont < resources.length && cont < 50; cont++)
			{
				var url = 'http:' + resources[cont];
				
				// We set the name for file
				var filename = resources[cont].split('/');
				filename = filename[filename.length - 1];

				// We set the full path '.files/boardName/semanticURL/filename'
				var path = './files/' + boardName + '/' + surl + '/' +filename;

				// We download the file
				var fileCounter = cont + 1;
				self.dowloadResource(url, boardName, surl, path, function () {
					console.log(fileCounter + '::File ' + path + ' downloaded');
				});
			}

			setTimeout(function () { console.log('Second batch...') }, 2000);
			for(; cont < resources.length && cont < 100; cont++)
			{
				url = 'http:' + resources[cont];
				
				// We set the name for file
				filename = resources[cont].split('/');
				filename = filename[filename.length - 1];

				// We set the full path '.files/boardName/semanticURL/filename'
				path = './files/' + boardName + '/' + surl + '/' +filename;

				// We download the file
				fileCounter = cont + 1;
				self.dowloadResource(url, boardName, surl, path, function () {
					console.log(fileCounter + '::File ' + path + ' downloaded');
				});
			}

			setTimeout(function () { console.log('Third batch...') }, 2000);
			for(; cont < resources.length && cont < 150; cont++)
			{
				url = 'http:' + resources[cont];
				
				// We set the name for file
				filename = resources[cont].split('/');
				filename = filename[filename.length - 1];

				// We set the full path '.files/boardName/semanticURL/filename'
				path = './files/' + boardName + '/' + surl + '/' +filename;

				// We download the file
				fileCounter = cont + 1;
				self.dowloadResource(url, boardName, surl, path, function () {
					console.log(fileCounter + '::File ' + path + ' downloaded');
				});
			}

			setTimeout(function () { console.log('Forth batch...') }, 2000);
			for(; cont < resources.length && cont < 200; cont++)
			{
				url = 'http:' + resources[cont];
				
				// We set the name for file
				filename = resources[cont].split('/');
				filename = filename[filename.length - 1];

				// We set the full path '.files/boardName/semanticURL/filename'
				path = './files/' + boardName + '/' + surl + '/' +filename;

				// We download the file
				fileCounter = cont + 1;
				self.dowloadResource(url, boardName, surl, path, function () {
					console.log(fileCounter + '::File ' + path + ' downloaded');
				});
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
		}
		else {

		    if( !fs.existsSync(surlDirectory) ) {
		    	fs.mkdirSync(surlDirectory);
		    }
		}

		if( !fs.existsSync(filename) )
		{
			// We download the file
			//console.log('=== Dowloading::' + uri );
			/*request.head(uri, function(err, res, body) {
				// console.log('content-type:', res.headers['content-type']);
				// console.log('content-length:', res.headers['content-length']);
				request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
			});*/

			request(uri)
				.pipe(fs.createWriteStream(filename))
				.on('close', function () {
					console.log(filename + ' downloaded.');	
				})
				.on('error', function (err) {
					console.log(err)
				})
				.on('response', function(response) {
					// unmodified http.IncomingMessage object
					response.on('data', function(data) {
						// compressed data as it is received
						console.log('Received ' + data.length + ' bytes of compressed data')
					});
			    });


		}

	}



};

module.exports = fourChanService;
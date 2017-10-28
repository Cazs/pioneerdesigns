var keystone = require('keystone');
var fs = require('fs');

exports = module.exports = function (req, res)
{
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'gallery';

	// Load the galleries by sortOrder
	view.query('galleries', keystone.list('Gallery').model.find().sort('sortOrder'));

	console.log('reading gallery images.\n');

	var base_path = __dirname + '/../../public/gallery/';//"file.txt";

	var path = "";
	if(req.params.path)
		path = req.params.path.split(":").join('/');
	readDir(base_path + path, function(err, dir_data)
	{
		if(err)
		{
			console.log(err);
			return;
		}
		if(dir_data)//if dir contents defined
		{
			var files = dir_data.toString().split(",");
			var dirs = "";
			var thumbs = "";
			var images = "";
			//look for directories
			for(var i=0;i<files.length;i++)
			{
				//if(!(new RegExp("\.([0-9a-zA-Z]+)(?:[\?#]|$)")).test(files[i]))//then is a dir//
				if(files[i].split('.').length<=1)
				{
					//is a dir
					if(dirs.length>0)//if not first dir
					{
						dirs += ":" + files[i];//append
					} else dirs += files[i];//set
					//get first file in directorty and add it to thumbs list
					/*readDir(base_path + path + files[i], function(err, dir_data)
					{
						if(err)
						{
							console.log(err);
							return;
						}
						//found dir data
						if(thumbs.length>0)//if not first thumbnail
							thumbs += ":" + path + "/" + dir_data[i];//append
						else thumbs += path + "/" + dir_data[i]; //set
						//console.log("dir %s has files: %s", files[i], dir_data);
					});*/
				}else
				{
					//is file
					if(images.length>0)
						images += ":" + path + "/" + files[i];//path + "/" +
					else images += path + "/" + files[i]; //path + "/" + 
				}
			}
			
			console.log("current_dir: %s", path);//current directory
			console.log("dirs: %s", dirs.split(":"));//directories in current directory
			console.log("files: %s", images.split(":"));//files in current directory

			view.render('gallery', {"current":req.params.path?req.params.path:"", "dirs":dirs.split(":"), "images": images.split(":"), "thumbs": thumbs});
		}
	});
	/*if(path.length>0)
	{
		for(var i=0;i<path.length;i++)
		{
			console.log(path[i]);
			if(files[i].includes("."))//if is a file
			{
				console.log('readDir> is file');
				path += "/" + files[i];
				//add path to file to directory listing
				if(dirs.length>0)
					dirs += ";" + path;
				else dirs += path;
				processFile(files[i], path, dirs);
			}else{//if is a directory
				console.log('readDir> is dir');
				path += "/" + files[i];
				processFile(files[i], path, dirs);
			}
		}
	}*/
	/*var dirs = "";
	var path = "";
	dirs = this.processFile(file, path, dirs);
	console.log(dirs);*/
	//readDir(__dirname + '/../../public/images/gallery', );
			//console.log("fs data: "+ dir_data);
			//view.query('imgs', dir_data);
			// Render the view
			//view.render('gallery', {"images": dir_data});
	//});

	/*fs.readdir(__dirname + '/../../public/images/gallery', function(err, dir_data)
	{
		
		
	});*/
};

/*	file = file to be checked if dir of file
	path = path to next file
	dirs = list of paths to all files delimited by a ';'*/
processFile = function(file, path, dirs)
{
	//if(file.includes("."))
	if((new RegExp("\.([0-9a-z]+)(?:[\?#]|$)")).test(file))//then is a file
	{
		console.log('is file');
		//add path to file to directory listing
		if(dirs.length>0)
			dirs += ";" + path;
		else dirs += path + file;
		return path + file;
	}else{//is a directory
		console.log('is dir');
		path += "/" + file;

		//read files
		readDir(path, function(err, dir_data)
		{
			if(err)
			{
				console.log(err);
				return;
			}
			if(dir_data)//if dir contents defined
			{
				var files = dir_data.toString().split(",");
				console.log(files);
				if(files.length>0)
				{
					for(var i=0;i<files.length;i++)
					{
						console.log(files[i]);
						//if(files[i].includes("."))//if is a file
						if((new RegExp("\.([0-9a-z]+)(?:[\?#]|$)")).test(file))//then is a file
						{
							console.log('readDir> is file');
							//add path to file to directory listing
							if(dirs.length>0)
								dirs += ";" + path + "/" + files[i];
							else dirs += path + "/" + files[i];
							processFile(files[i], path, dirs);
						}else{//if is a directory
							console.log('readDir> is dir');
							path += "/" + files[i];
							processFile(files[i], path, dirs);
						}
					}
				}
			}
		});
	}
}

processDir = function(err, dir_data)
{
	if(err)
	{
		console.log(err);
		res.status(500).send(err);
		// Render the view
		view.render('gallery');
		return;
	}
	if(dir_data)
	{
		var files = dir_data.toString().split(",");
		console.log(files);
		if(files.length>0)
		{
			for(var i=0;i<files.length;i++)
			{
				console.log(files[i]);
				var path = "";
				if(files[i].contains("."))//then is a file
				{

				}else{//is a directory
					path += "/" + files[i];
				}
			}
		}
	}
}

readDir = function(dirname, callback)
{
	fs.readdir(dirname, function(err, dir_data)
	{
		if(err)
		{
			callback(err);
			console.log(err);
			return;
		}
		callback(err, dir_data);
	});
}

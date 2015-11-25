var fs = require('fs'),
	path = require('path'),
	Models = require('../models'),
	md5 = require('MD5');
	
var sidebar = require('../helpers/sidebar');
	
module.exports = {	
	index: function(req, res) {
		// declare our empty viewModel variable object:
		var viewModel = {
			image: {},
			comments: []
		};

		// find the image by searching the filename matching the url parameter:
		Models.Image.findOne({ filename: { $regex: req.params.image_id } },
			function(err, image) {
				if (err) { throw err; }
				if(image) {
					// if the image was found, increment its views counter
					image.views = image.views + 1;
					// save the image object to the viewModel:
					viewModel.image = image;
					// save the model (since it has been updated):
					image.save();
					// find any comments with the same image_id as the image:
					Models.Comment.find({ image_id: image._id}, {}, { sort: { 'timestamp': 1 }},
						function(err, comments) {
							// save the comments collection to the viewModel:
							viewModel.comments = comments;

							// build the sidebar sending along the viewModel:
							sidebar(viewModel, function(err, viewModel) {
								// render the page view with its viewModel:
								res.render('image', viewModel);
							});
						}
					);
				} else {
					// if no image was found, simply go back to the
					homepage:
					res.redirect('/');
				}
			}
		);	
	},
	json_GetImage: function(req, res) {
		// declare our empty viewModel variable object:
		var viewModel = {
			image: {},
			comments: []
		};
		console.log('image_id->' + req.params.image_id );
		// find the image by searching the filename matching the url parameter:
		Models.Image.findOne({ filename: { $regex: req.params.image_id } },
			function(err, image) {
				if (err) {
					res.status(500).json({ error: err });
					return;
				}	
				if(image) {
					// save the image object to the viewModel:
					viewModel.image = image;

					// find any comments with the same image_id as the image:
					Models.Comment.find({ image_id: image._id}, {}, { sort: { 'timestamp': 1 }},
						function(err, comments) {
							// save the comments collection to the viewModel:
							viewModel.comments = comments;
							res.json(viewModel);
						}
					);
				} else {
					// if no image was found, simply empty object 
					res.status(404).json({ error: 'Image \'' + req.params.image_id + '\' not found' });
					
				}
			}
		);	
	},	
	create: function(req, res) {
		var saveImage = function() {
			var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
				imgUrl = '';
			for(var i=0; i < 6; i+=1) {
				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			/* Start new code: */
			// search for an image with the same filename by performing a find:
			Models.Image.find({ filename: imgUrl }, function(err, images) {
				if (images.length > 0) {
					// if a matching image was found, try again (start over):
					saveImage();
				} else {
					/* end new code: */
					var tempPath = req.files.file.path,
						ext = path.extname(req.files.file.name).toLowerCase(),
						targetPath = path.resolve('./public/upload/' + imgUrl + ext);
					if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
						fs.rename(tempPath, targetPath, function(err) {
							if (err) { throw err; }
							/* Start new code: */
							// create a new Image model, populate its details:
							var newImg = new Models.Image({
								title: req.body.title,
								filename: imgUrl + ext,
								description: req.body.description
							});
							// and save the new Image
							newImg.save(function(err, image) {
								res.redirect('/images/' + image.uniqueId);
							});
							/* End new code: */
						});
					} else {
						fs.unlink(tempPath, function () {
							if (err) { throw err; }
							res.json(500, {error: 'Only image files are allowed.'});
						});
					}
					/* Start new code: */
				}
			});
			/* End new code: */				
		};
		saveImage();
	},
	like: function(req, res) {
		Models.Image.findOne({ filename: { $regex: req.params.image_id } },
			function(err, image) {
				if (!err && image) {
					image.likes = image.likes + 1;
					image.save(function(err) {
						if (err) {
							res.json(err);
						} else {
							res.json({ likes: image.likes });
						}
					});
				}
			}
		);
	},
	comment: function(req, res) {
		Models.Image.findOne({ filename: { $regex: req.params.image_id } },
			function(err, image) {
				if (!err && image) {
					var newComment = new Models.Comment(req.body);
					newComment.gravatar = md5(newComment.email);
					newComment.image_id = image._id;
					newComment.save(function(err, comment) {
						if (err) { throw err; }
						res.redirect('/images/' + image.uniqueId + '#' + comment._id);
					});
				} else {
					res.redirect('/');
				}
			}
		);	
	},
	remove: function(req, res) {
		Models.Image.findOne({ filename: 
				{ $regex: req.params.image_id } 
			},
			function(err, image) {
				if (err) { throw err; }
				fs.unlink(path.resolve('./public/upload/' + image.filename),
					function(err) {
						//if (err) { throw err; }
						Models.Comment.remove({ image_id: image._id},
							function(err) {
								image.remove(function(err) {
										if (!err) {
											res.json(true);
										} else {
											res.json(false);
										}
									}
								);
							}
						);
					}
				);
			}
		);
	}
};
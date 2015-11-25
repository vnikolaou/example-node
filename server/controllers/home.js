var sidebar = require('../helpers/sidebar'),
	ImageModel = require('../models').Image;

module.exports = {
	index: function(req, res) {
		var viewModel = {
			images: [
				
			]
			//, layout: 'test.hbs'
		};	
		
		ImageModel.find({}, {}, { sort: { timestamp: -1 } },
			function(err, images) {
				if(err) { throw err; }
				
				viewModel.images = images;
				sidebar(viewModel, function(err, viewModel) {
					res.render('index', viewModel);
				});
		
		});
	}
};
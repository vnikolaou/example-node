var multipart = require('connect-multiparty');

var multipartMiddleware = multipart();

var homeController = require('../controllers/home');
var imageController = require('../controllers/image'); 

module.exports.initialize = function(app, router) {
	/* Home page. */
	console.log(typeof router.get);
	router.get('/', homeController.index);

	/* Image pages. */
	router.get('/images/:image_id', imageController.index);
	router.post('/images', multipartMiddleware, imageController.create);
	router.post('/images/:image_id/like', imageController.like);
	router.post('/images/:image_id/comment', imageController.comment);
	router.delete('/images/:image_id', imageController.remove);

	router.get('/api/images/:image_id', imageController.json_GetImage);
	
	app.use('/', router); 
}

module.exports.multipartMiddleware = multipartMiddleware;

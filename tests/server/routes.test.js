var homeController = require('../../server/controllers/home'),
	imageController = require('../../server/controllers/image'),
	express = require('express');

var routes = require('../../server/routes');

describe('Routes', function() {
	var router = express.Router();

	router.get = sinon.spy();
	router.post = sinon.spy();
	router.delete = sinon.spy();
			
	beforeEach(function() {
		routes.initialize(express(), router);
	});

	describe('GETs', function() {
		it('should handle /', function() {
			expect(router.get).to.be.calledWith('/', homeController.index);
		});
		
		it('should handle /images/:image_id', function(){
			expect(router.get).to.be.calledWith('/images/:image_id', imageController.index);
		});
	});

	describe('POSTs', function() {
		it('should handle /images', function(){
			expect(router.post).to.be.calledWith('/images', routes.multipartMiddleware, imageController.create);
		});
		
		it('should handle /images/:image_id/like', function(){
			expect(router.post).to.be.calledWith('/images/:image_id/like', imageController.like);
		});
		
		it('should handle /images/:image_id/comment', function(){
			expect(router.post).to.be.calledWith('/images/:image_id/comment', imageController.comment);
		});
	});

	describe('DELETEs', function() {
		it('should handle /images/:image_id', function(){
			expect(router.delete).to.be.calledWith('/images/:image_id', imageController.remove);
		});
	});

});
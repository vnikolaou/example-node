var ImageModel = require('../../server/models/image');
var CommentModel = require('../../server/models/comment');

describe('Comment Model', function() {
	var comment, image;
	
	it('should have a mongoose schema', function(){
		expect(CommentModel.schema).to.be.defined;
	});
	
	beforeEach(function() {
		image = new ImageModel({
			title: 'Test',
			description: 'Testing',
			filename: 'testfile.jpg'
		});
		
		comment = new CommentModel({
			email: 'vnikolaou12@gmail.com',
			name: 'vnik', 
			gravatar: 'my_gravatar',
			comment: 'test comment',
			image: image
		});
	});

	describe('Schema', function() {
		it('should have a title string', function(){
			expect(comment.image_id).to.be.defined;	
		});
		
		it('should have an email string', function(){
			expect(comment.email).to.be.defined;
			expect(comment.email).to.equal('vnikolaou12@gmail.com');			
		});
		
		it('should have a name string', function(){
			expect(comment.name).to.be.defined;
			expect(comment.name).to.equal('vnik');			
		});
		
		it('should have a gravatar string', function(){
			expect(comment.gravatar).to.be.defined;
			expect(comment.gravatar).to.equal('my_gravatar');
		});
		
		it('should have a comment string', function(){
			expect(comment.comment).to.be.defined;
			expect(comment.comment).to.equal('test comment');
		});
		
		it('should have a timestamp date', function(){
			expect(comment.timestamp).to.be.defined;
		});
	});
	
	describe('Virtuals', function() {
		describe('image', function() {
			it('should be defined', function(){
				expect(comment.image).to.be.defined;
			});
			
			it('should be the image that has been set', function(){
				expect(comment.image).to.equal(image);
			});
		});
	});	
	
});
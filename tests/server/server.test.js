var proxyquire, expressStub, configStub, mongooseStub, routesStub, app, www, httpStub, appStub, httpServer,
	server = function() {
		proxyquire('../../app', {
			'express': expressStub,
			'mongoose': mongooseStub,
			'./server/routes': routesStub
		});
	};
	
	www = function() {
		proxyquire('../../bin/www', {
			'http': httpStub,
			'../app': appStub
		});
	};
	
describe('Server', function() {
	beforeEach(function() {
		proxyquire = require('proxyquire'),
		app = {
			set: sinon.spy(),
			get: sinon.stub().returns(3000),
			listen: sinon.spy(),
			engine: sinon.spy(),
			use: sinon.spy()
		},
		appStub = sinon.stub().returns(app),		
		httpServer = {
			on: sinon.spy(),
			listen: sinon.spy()
		},		
		httpStub = {
			createServer: sinon.stub().returns(httpServer)
		},
		expressStub = sinon.stub().returns(app),
		routesStub = {
			initialize: sinon.spy()
		},
		mongooseStub = {
			connect: sinon.spy(),
			connection: {
				on: sinon.spy()
			}
		};
	
		delete process.env.PORT;
	});
	
	describe('Bootstrapping', function() {
		it('should create the app', function() {
			server();
			expect(expressStub).to.be.called;
		});
		it('should set the views', function() {
			server();
			expect(app.set.firstCall.args[0]).to.equal('views');
		});
		it('should set the hbs engine', function() {
			server();
			expect(app.set.secondCall.args[0]).to.equal('view engine');
			expect(app.set.secondCall.args[1]).to.equal('.hbs');
		});		
		it('should configure the router', function() {
			server();
			expect(routesStub.initialize.firstCall.args[0]).to.equal(app);				
		});
		it('should connect with mongoose', function() {
			server();
			expect(mongooseStub.connect).to.be.calledWith(sinon.match.string);
			
		});
	});
	
	describe('Port', function() {
		it('should be set', function() {
			server();
			expect(app.set.thirdCall.args[0]).to.equal('port');
		});
		it('should be the default port', function() {
			server();
			expect(app.set.thirdCall.args[1]).to.equal(app.get());
		});
		it('should be configurable', function() {
			process.env.PORT = 5500;
			server();
			expect(app.set.thirdCall.args[1]).to.equal(5500);
		});
	});

	describe('Launch', function() {
		it('should be set', function() {
			www();
			expect(httpStub.createServer).to.be.called;
		});
		it('should listen to the default port', function() {
			www();
			expect(httpServer.listen).to.be.calledWith(app.get(), sinon.match.func);	
		});		
		it('should have event handlers', function() {
			www();
			expect(httpServer.on.firstCall).to.be.calledWith('error', sinon.match.func);	
			expect(httpServer.on.secondCall).to.be.calledWith('listening', sinon.match.func);	
		});			
	});	
});	
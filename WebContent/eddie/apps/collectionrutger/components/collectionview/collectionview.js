var Collectionview = function(options){	
	var self = this;
	
	this.setLayout(new VideoOrganicGridLayout());
	
	//Refreshing a page causes the page to stay at the position the page was scrolled to before the refresh, this sets the scrollposition back to the top. 
	setTimeout(function(){
		$(this).scrollTop(0);
	}, 500);
		
};

Collectionview.prototype = Object.create(Component.prototype);
Collectionview.prototype.layout = null;
Collectionview.prototype.loading = function(loading){
	console.log("Collectionview.prototype.loading(" + loading + ")");
	var self = this;
	if(loading){
		this.loadingElement.removeClass('inactive');
		this.loadingElement.addClass('active');
	}else{
		this.loadingElement.removeClass('active');
	}
	
	return new Promise(function(resolve, reject){
		try{
			var transitionFinished = function(){
				
				if(!loading){
					self.loadingElement.addClass('inactive');
					self.loadingElement.off('webkitTransitionEnd transitionend msTransitionEnd msTransitionEnd');
				}
				resolve();
			};
			
			if(!loading && !elementInViewport(self.loadingElement)){
				transitionFinished();
			}else{
				self.loadingElement
					.off('webkitTransitionEnd transitionend msTransitionEnd msTransitionEnd')
					.on('webkitTransitionEnd transitionend msTransitionEnd msTransitionEnd', transitionFinished);
			}
		}catch(err){
			console.log(err.stack);
		}
			
	});
};
Collectionview.prototype.loadingElement = $('#collectionview > .loading');
Collectionview.prototype.element = $('#collectionview');
Collectionview.prototype.itemsElement = $('#collectionview .items');
Collectionview.prototype.appendItems = function(data){
	console.log("Collectionview.prototype.appendItems()");
	
	data = ASCII8Decoding.decode(data);
	
	var self = this;
	var block = false;
	data = $(data);
	var children = data.children(":not(properties)");
	
	for(var i = 0; i < children.length; i++){
		var xml = children[i];
		var item = new self.layout.itemClass({xml: xml});
		item.createElement();
		item.init();
		self.itemsElement.append(item.element);
		
		item.element.on('touchend', function(event){
			var firstTouch = $(this).data('firstTouch');
			if(!firstTouch){
				$(this).data('firstTouch', true);
				event.preventDefault();
			}else{
				$(this).data('firstTouch', false);
			}
			
		});
		item.element.on('click', function(){
			if(!$(this).data('firstTouch')){
				var path = {"path": this.id};
				var command = "playVideo(" + JSON.stringify(path) + ")";
				
				eddie.putLou("", command);
			}
		});
	}
	
	self.render();
	setTimeout(function(){
		self.loading(false);
	}, 1);
};
Collectionview.prototype.addItems = function(){
	console.log("Collectionview.prototype.addItems()");
	var self = this;
	var block = false;
	data = $(data);
	var children = data.children(":not(properties)");
	
	for(var i = 0; i < children.length; i++){
		var xml = children[i];
		var item = new self.layout.itemClass({xml: xml});
		item.createElement();
		item.init();
		self.itemsElement.append(item.element);
	}
	
	self.render();
	setTimeout(function(){
		self.loading(false);
	}, 1);
	
};
Collectionview.prototype.changeLayout = function(layoutStr){
	var layout;
	switch(layoutStr){
		case "organic":
			layout = new VideoOrganicGridLayout();
			break;
		case "fixed":
			layout = new VideoGridLayout();
			break;
		case "list":
			layout = new VideoListLayout();
			break;
	}
	this.setLayout(layout);
};
Collectionview.prototype.setLayout = function(layout){
	var self = this;
	if(this.layout){
		this.layout.destroy.apply(this.layout);
	}
	
	this.layout = layout;
	this.layout.element = this.itemsElement;
	this.layout.create.apply(this.layout);
	$(this.layout).on('near-bottom', function(event){
		self.loading(true).then(function(){
			eddie.putLou('', 'getNextChunk()');
		});
	});
	this.render();
};
Collectionview.prototype.removeItems = function(items){
	var self = this;
	Promise.all(items.map(function(item){
		return self.itemsElement.find('#' + item.id).data('LayoutItem').remove();
	})).then(function(){
		self.render();
	});
};
Collectionview.prototype.clear = function(){
	this.itemsElement.children(this.layout.itemSelector).remove();
};
Collectionview.prototype.render = function(){	
	this.layout.render();
};


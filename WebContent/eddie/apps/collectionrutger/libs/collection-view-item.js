var CollectionViewItem = function(options){
	var self = this;
	
	$.extend(self, options);
	
	this.isHovering = false;
	
	var initialize = function(){
		self.createElement();
	};
	
	this.createElement = function(){
		var template = self.template.clone();
		template.attr('id', self.item.id);
		template.append(self.item.contents);
		self.element = template;
		self.element.data('CollectionViewItem', self);
		self.listenToEvents();
	};
	
	this.listenToEvents = function(){
		self.element.on('mouseenter', self.mouseEnter);
		self.element.on('mouseleave', self.mouseLeave);
		self.element.on('click', self.remove);
	};
	
	this.mouseLeave = function(event){
		var overlayDiv = self.element.find('.overlay');
		var height = self.element.height();
		var width = self.element.width();
		overlayDiv.height(height);
		overlayDiv.width(width);
		var animationOptions = {
			opacity: '0'
		};
		
		overlayDiv.animate(animationOptions, "fast", function(){
			overlayDiv.remove();
		});
	};
	
	this.mouseEnter = function(event){
		var overlayDiv = $("<div class='overlay'></div>");
		var height = self.element.height();
		var width = self.element.width();
		overlayDiv.height(height);
		overlayDiv.width(width);
		var animationOptions = {
			opacity: '0.8'
		};
		self.element.append(overlayDiv);
		overlayDiv.animate(animationOptions, "fast");
		
	};
	
	initialize();
};

CollectionViewItem.prototype.element = null;
CollectionViewItem.prototype.mouseEnter = function(){
	console.log("HOVER CALLBACK!");
};
CollectionViewItem.prototype.remove = function(){
	console.log("CollectionViewItem.remove()");
	var self = this;
	return new Promise(function(resolve, reject){
		self.element.fadeOut(200, function(){
			self.element.remove();
			resolve();
		});
	});
};
CollectionViewItem.prototype.resize = function(){
	this.element.addClass('w' + this.item.weight);
};
CollectionViewItem.prototype.template = $("<div class=\"item\"></div>");
CollectionViewItem.prototype.element = null;
CollectionViewItem.prototype.click = null;

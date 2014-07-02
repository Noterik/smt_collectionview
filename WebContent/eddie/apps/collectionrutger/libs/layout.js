/**BASIC IMPLEMENTATIONS**/

/**
 * Represents an child of a layout. So every item contained in a layout that passes the itemSelector has a LayoutItem associated with it, which handles
 * its html and events etc. 
 */
var LayoutItem = function(options){
	$.extend(this, options);
};

/**
 * The callbacks for events that can be triggered by a user on this element. 
 */
LayoutItem.prototype.elementCallbacks = {
	"click": function(){},
	"hover": function(){},
	"mouseenter": function(){},
	"mouseleave": function(){}
};

/**
 * Maps the xml of this element to values that can be used in a the template of this item, see VideoListItem for an implementation. The object is like this:
 * 
 *  <templatePropertyName>:<XPATH query>
 */
LayoutItem.prototype.dataMappings = function(){
	return {};
};

/**
 * Executes the mappings on the current xml. 
 * 
 * Returns an object which contains the names and the values of the properties. 
 */
LayoutItem.prototype.getData = function(){
	var data = {};
	var xml = $(this.element.data('xml'));
	for(var key in this.dataMappings){
		data[key] = xml.find(this.dataMappings[key]).text();
	}
	return data;
};

/**
 * Creates the basic <div class="item" /> wrapper for an item in this layout. Binds the xml to the created element with $.data, so that this can easily be reused if
 * we want to invoke a different layout on the element. The LayoutItem will be destroyed when destroy() is called on the parent, and we might want to reuse the xml. 
 */
LayoutItem.prototype.createElement = function(){
	var self = this;
	var $xml = $(self.xml);
	var element = $("<div class=\"item\"></div>");
	element.attr('id', self.xml.id);
	element.attr('data-path', self.xml.tagName.toLowerCase() + '/' + self.xml.id);
	element.data('xml', self.xml);
	this.element = element;
};

/**
 * Binds the LayoutItem object to the HTML element with $.data, so that the layout can easily access the LayoutItems without needing to keep references to it. 
 * Fills the template with data and adds it to the HTML element.
 * Binds the callbacks to the events. 
 */
LayoutItem.prototype.init = function(){
	this.element.data('LayoutItem', this);
	var template = _.template(this.template, this.getData());
	this.element.append(template);
	this._bindElementCallbacks();
};

/**
 * Removes the binding of this LayoutItem object to the HTML element. 
 * Unbinds the callbacks of the events.
 * Empties the element. 
 */
LayoutItem.prototype.destroy = function(){
	this.element.data('LayoutItem', null);
	this._unbindElementCallbacks();
	this.element.html('');
};

/**
 * Removes the LayoutItem, returns a Promise object, because it might be done asynchronously in inheriting objects. 
 * For more info on promises check: http://www.html5rocks.com/en/tutorials/es6/promises/
 */
LayoutItem.prototype.remove = function(){
	var self = this;
	return new Promise(function(resolve){
		self.element.remove();
		resolve();
	});
};

/**
 * Binds the callbacks to the events. 
 */
LayoutItem.prototype._bindElementCallbacks = function(){
	console.log("LayoutItem.prototype._bindElementCallbacks");
	var self = this;
	for(var eventName in self.elementCallbacks){
		self.element.on(eventName, (function(eventName, callback){
			return function(event){
				self.elementCallbacks[eventName].apply(self, [event]);
			};
		})(eventName, self.elementCallbacks[eventName]));
	}
};

/**
 * Unbinds the callbacks from the events. 
 */
LayoutItem.prototype._unbindElementCallbacks = function(){
	var self = this;
	for(var eventName in self.elementCallbacks){
		self.element.off(eventName);
	}
};

/**
 * A LayoutItem to be used by the GridLayout. This item has a background image, and an overlay which displays some extra information when the user
 * hovers over the element. 
 */
var GridLayoutItem = function(options){
	LayoutItem.apply(this, [options]);
};

//Inherit from LayoutItem using Object.create, this creates a new object, instead of sharing the same prototype across a whole lot of objects. 
GridLayoutItem.prototype = Object.create(LayoutItem.prototype);

/**
 * The element that will be shown when the user hovers his mouse over the element. 
 */
GridLayoutItem.prototype.overlay = null;
/**
 * Removes the element, but first does an animation, we don't want this animation to block the rest of the application,
 * so this is why we return a Promise in the LayoutItem.remove(). 
 */
GridLayoutItem.prototype.remove = function(){
	var self = this;
	return new Promise(function(resolve){
		self.element.animate({
			'opacity': 0
		}, 250, function(){
			self.element.remove();
			resolve();
		});
	});
	
};

/**
 * The callbacks for GridLayoutItem.  
 */
GridLayoutItem.prototype.elementCallbacks.click = function(){
	console.log("ITEM CLICKED");
};
GridLayoutItem.prototype.elementCallbacks.touchstart = function(){
	console.log(this);
	$(this).find('.overlay').addClass('active');
};

//The XML mappings which are used by the LayoutItems
var videoMappings = {
	"screenshot": "properties > screenshot",
	"titleEnglish": "properties > title",
	"summaryEnglish": "properties > description"
};


/**
 * Displays its contents in a horizontal row, that can be layed out using VideoListLayout. 
 */
var VideoListItem = function(options){
	LayoutItem.apply(this, [options]);
};
VideoListItem.prototype = Object.create(GridLayoutItem.prototype);

/**
 * HTML Template of this item. Uses the underscore templating syntax (http://underscorejs.org). 
 */
VideoListItem.prototype.template = "<div class=\"contents\"><img src=\"<% if(screenshot){print(screenshot)}else{print('/eddie/img/collection/video.png')} %>\" /><h3><%= summaryEnglish %></h3><p class=\"description\"><%= summaryEnglish %><br /></p></div>";

/**
 * The XML to templating properties mappings. 
 */
VideoListItem.prototype.dataMappings = videoMappings;


/**
 * Can be used by a GridLayout.
 */
var VideoGridItem = function(options){
	GridLayoutItem.apply(this, [options]);
};
VideoGridItem.prototype = Object.create(GridLayoutItem.prototype);

/**
 * HTML Template of this item. Uses the underscore templating syntax (http://underscorejs.org). 
 */
VideoGridItem.prototype.template = "<div class=\"contents\"><img class=\"background\" src=\"<% if(screenshot){print(screenshot)}else{print('/eddie/img/collection/video.png')} %>\" /><div class=\"description\"><div class=\"overlay\"><div class=\"text\"><h4><%= summaryEnglish %></h4></div></div></div>";

VideoGridItem.prototype.dataMappings = videoMappings;

/**
 */
VideoGridItem.prototype.init = function(){
	GridLayoutItem.prototype.init.apply(this);
	this.overlay = this.element.find('.overlay');
	this.element.css('position', 'absolute');
};

var VideoOrganicGridItem = function(options){
	VideoGridItem.apply(this, [options]);
};
VideoOrganicGridItem.prototype = Object.create(VideoGridItem.prototype);
VideoOrganicGridItem.prototype.init = function(){
	VideoGridItem.prototype.init.apply(this);
	this.weight = Math.floor((Math.random()*4)+1);
	this.element.addClass('w' + this.weight);
};
VideoOrganicGridItem.prototype.destroy = function(){
	this.element.removeClass('w' + this.weight);
	VideoGridItem.prototype.destroy.apply(this);
};
/**
 * Basic Layout class. Implements the most basic layout which basically does nothing, elements arn't positioned or anything. Rather this object provides
 * a basic structure for other Layouts to overwrite or extend. 
 * 
 * @param {Object} options
 */
var Layout = function(options){
	$.extend(this, options);
};

//The element of which the children will be layed out. 
Layout.prototype.element = null;

//The class of the containing items, should always be a LayoutItem or an extension of LayoutItem. 
Layout.prototype.itemClass = LayoutItem;

//The css selector of the item which has to be layed out. 
Layout.prototype.itemSelector = ".item";

//The callbacks of certain events that can be triggered on this layout, for example: "click": function(){alert("layout clicked!");}
Layout.prototype.elementCallbacks = {};

/**
 * Calls the create function on all the items of the elements contained in this element. 
 */
Layout.prototype.create = function(){
	var self = this;
	this.element.children(this.itemSelector).each(function(){
		var $this = $(this);
		if(!$this.data('LayoutItem') && $this.data('xml')){
			var layoutItem = new self.itemClass({xml: $this.data('xml')});
			layoutItem.element = $this;
			$this.data('LayoutItem', layoutItem);
		}
		$this.data('LayoutItem').init();
	});
	
	for(var ev in this.elementCallbacks){
		var callback = this.elementCallbacks[ev];
		this.element.on.apply(this, [ev, callback]);
	}
};

/**
 * Called when the items have to be layed out, in this case this is left empty. But for example in the GridLayout we call the freetile plugin to layout the elements. 
 */
Layout.prototype.render = function(){};

/**
 * Destroys the layout, can be used to call destroy on all the children that fit this.itemSelector. Can also be used to clean up any html added by this layout. 
 */
Layout.prototype.destroy = function(){
	this.element.children(this.itemSelector).each(function(){
		var $this = $(this);
		$this.data('LayoutItem').destroy();
		$this.data('LayoutItem', '');
	});
	
	for(var ev in this.elementCallbacks){
		var callback = this.elementCallbacks[ev];
		this.element.off(ev, callback);
	}
};

/**
 * Layout that reacts to the scrolling through the window. Triggers an event every time its about to reach the bottom of the page. 
 */
var ScrollingLayout = function(options){
	Layout.apply(this, [options]);
};
ScrollingLayout.prototype = Object.create(Layout.prototype);
ScrollingLayout.prototype.boundaryBottom = 250;
ScrollingLayout.prototype.bottomReachedTriggered = false;
ScrollingLayout.prototype.scrollingCallback = null;
ScrollingLayout.prototype.onScroll = function(event){
	var fromBottom = $(document).height() -$(window).height() - $(this).scrollTop();
	if(fromBottom < self.boundaryBottom && !self.bottomReachedTriggered){
		self.bottomReachedTriggered = true;
		$(self).trigger('near-bottom');
	}
	
};
ScrollingLayout.prototype.create = function(){
	Layout.prototype.create.apply(this);
	var self = this;
	this.scrollingCallback = function(){
		var fromBottom = $(document).height() -$(window).height() - $(this).scrollTop();
		if(fromBottom < self.boundaryBottom && !self.bottomReachedTriggered){
			self.bottomReachedTriggered = true;
			console.log(self);
			$(self).trigger('near-bottom');
		}
	};
	$(window).on('scroll', this.scrollingCallback);
};
ScrollingLayout.prototype.destroy = function(){
	$(window).off('scroll', this.scrollingCallback);
};
ScrollingLayout.prototype.render = function(){
	console.log("ScrollingLayout.prototype.render()");
	Layout.prototype.render.apply(this);
	this.bottomReachedTriggered = false;
};


var GridLayout = function(options){
	ScrollingLayout.apply(this, [options]);
};

GridLayout.prototype = Object.create(ScrollingLayout.prototype);
GridLayout.prototype.itemClass = GridLayoutItem;
GridLayout.prototype.create = function(){
	ScrollingLayout.prototype.create.apply(this);
	var self = this;
	/*
	$(window).on('scroll', function(){
		self.showImages.apply(self);
	});
	*/
};
GridLayout.prototype.showNewItems = function(){
	var self = this;
	
	var invisibleItems = self.element.find('.item:not(.visible)');
	slowLoop(invisibleItems, function(){
		$(this).addClass('visible');
	}, 1);
};
GridLayout.prototype.render = function(){
	console.log("GridLayout.prototype.render()");
	var self = this;
	ScrollingLayout.prototype.render.apply(this);
	this.element.freetile({
		animate: false,
		callback: function(){
			self.showNewItems.apply(self);
		},
		persistentCallback: true
	});
};

var VideoGridLayout = function(options){
	GridLayout.apply(this, [options]);
};
VideoGridLayout.prototype = Object.create(GridLayout.prototype);
VideoGridLayout.prototype.itemClass = VideoGridItem;
VideoGridLayout.prototype.render = function(){
	this.element.addClass('fixed');
	GridLayout.prototype.render.apply(this, arguments);
	
};
VideoGridLayout.prototype.destroy = function(){
	GridLayout.prototype.destroy.apply(this);
	this.element.removeClass('fixed');
};

var VideoOrganicGridLayout = function(options){
	GridLayout.apply(this, [options]);
};
VideoOrganicGridLayout.prototype = Object.create(GridLayout.prototype);
VideoOrganicGridLayout.prototype.itemClass = VideoOrganicGridItem;
VideoOrganicGridLayout.prototype.render = function(){
	this.element.addClass('organic');
	GridLayout.prototype.render.apply(this, arguments);
	//this.showImages();
};
VideoOrganicGridLayout.prototype.create = function(){
	GridLayout.prototype.create.apply(this, arguments);
};
VideoOrganicGridLayout.prototype.destroy = function(){
	GridLayout.prototype.destroy.apply(this, arguments);
	this.element.removeClass('organic');
};

var VideoListLayout = function(options){
	GridLayout.apply(this, [options]);
};
VideoListLayout.prototype = Object.create(GridLayout.prototype);
VideoListLayout.prototype.itemClass = VideoListItem;
VideoListLayout.prototype.render = function(){
	this.element.addClass('list');
	GridLayout.prototype.render.apply(this, arguments);
};
VideoListLayout.prototype.destroy = function(){
	GridLayout.prototype.destroy.apply(this);
	this.element.removeClass('list');
};
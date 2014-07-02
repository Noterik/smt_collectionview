var Playeroverlay = function(options){
	var self = this;
	this.element = jQuery('#playeroverlay');
	this.player = this.element.find('.player');
	this.close = this.element.find('span.close');
	
	$(window).resize(function(){
		self.resize.apply(self);
	});
	
	
	this.close.click(function(){
		self.element.find('video').remove();
		self.element.hide();
	});
	
	this.resize();
};

Playeroverlay.prototype = Object.create(Component.prototype);
Playeroverlay.prototype.setVideo = function(data){
	console.log("SET VIDEO");
	var message = JSON.parse(data);
	console.log(message);
	var video = jQuery('<video controls="controls" width="100%" height="100%"><source src="' + message.video + '" type="video/mp4"></source></video>');
	this.player.html(video);
	this.element.show();
};
Playeroverlay.prototype.resize = function(){
	var width = jQuery(window).width();
	var height = jQuery(window).height();
	this.element.width(jQuery(window).width());
	this.element.height(jQuery(window).height());
	
	var ratio = 16 / 9;
	
	var playerWidth;
	var playerHeight;
	if(width > height){
		playerHeight = height - 100;
		playerWidth = playerHeight * ratio;
		
	}else{
		playerWidth = width - 100;
		playerHeight = playerWidth / ratio;		
	}
	
	var left = (width - playerWidth) / 2;
	var top = (height - playerHeight) / 2;
	this.player.height(playerHeight);
	this.player.width(playerWidth);
	this.player.css('left', left);
	this.player.css('top', top);
}
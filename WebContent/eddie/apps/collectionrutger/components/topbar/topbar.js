var Topbar = function(options){
	this.infoButton.on('click', function(){
		eddie.getComponent('terms').show();
	});
};

Topbar.prototype = Object.create(Component.prototype);
Topbar.prototype.element = $('#topbar');
Topbar.prototype.infoButton = $('#topbar .information');

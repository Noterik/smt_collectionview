var Test = function(options){
	var self = this;
	
	self.sendMessage('add(test)');
};

Test.prototype = Object.create(Component.prototype);
Test.prototype.name = "test";

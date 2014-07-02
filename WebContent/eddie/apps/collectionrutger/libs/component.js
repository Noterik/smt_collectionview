var Component = function(){
	
};

Component.prototype.waitingMessages = [];
Component.prototype.putMsg = function(command){
	var argsStart = command.originalMessage.indexOf("(");
	var fn = command.originalMessage.substring(0, argsStart);
		
	if(typeof this[fn] == "function"){
		this[fn](command.content);
	}
};
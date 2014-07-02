function slowLoop(arr, itemFn, interval){
	return new Promise(function(resolve, reject){
		(function loop(i) {
	        if (i < arr.length) {   
	        	itemFn.apply(arr[i]);                
	            setTimeout(function(){
	            	loop(++i);
	            }, interval);
	        } else { 
	            resolve();
	        }
	    }(0));         
	});
}

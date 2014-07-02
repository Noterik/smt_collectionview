var Controller = function(){
	var collection;
	/*
	var contentInput = $('#controller textarea[name="contents"]');
	var weightInput = $('#controller select[name="weight"]');
	var indexInput = $('#controller select[name="index"]');
	var button = $('#controller button.submit');
	*/
	var organicButton = $('#controller button.organic-grid');
	var fixedButton = $('#controller button.fixed-grid');
	var listButton = $('#controller button.list');
	var sortTitleAscButton = $('#controller button.sort_title_asc');
	var sortTitleDescButton = $('#controller button.sort_title_desc');
	var sortDecadeAscButton = $('#controller button.sort_decade_asc');
	var sortDecadeDescButton = $('#controller button.sort_decade_desc');
	var sortDurationAscButton = $('#controller button.sort_duration_asc');
	var sortDurationDescButton = $('#controller button.sort_duration_desc');
	
	/*
	button.on('click', function(event){
		event.preventDefault();
		var object = {
			'contents': contentInput.val(),
			'weight': weightInput.find('option:selected').attr('value')
		};
		var index = indexInput.find('option:selected').attr('value');
		eddie.getComponent('collection').add(index, object);
	});*/
	
	organicButton.on('click', function(event){
		console.log("controller.organicButton:click");
		var params = {
			'layout': 'organic'
		};
		eddie.putLou('', 'changeLayout(' + JSON.stringify(params) + ')');
	});
	
	fixedButton.on('click', function(event){
		console.log("controller.fixedButton:click");
		var params = {
			'layout': 'fixed'
		};
		eddie.putLou('', 'changeLayout(' + JSON.stringify(params) + ')');
	});
	
	listButton.on('click', function(event){
		console.log("controller.listButton:click");
		var params = {
			'layout': 'list'
		};
		eddie.putLou('', 'changeLayout(' + JSON.stringify(params) + ')');
	});

	sortTitleAscButton.on('click', function(event){
		console.log("controller.sortTitleAscButton:click");
		var params = {
			direction: "asc"
		};
		eddie.putLou('', 'sortByTitle(' + JSON.stringify(params) + ')');;
	});
	
	sortTitleDescButton.on('click', function(event){
		console.log("controller.sortTitleDescButton:click");
		var params = {
			direction: "desc"
		};
		eddie.putLou('', 'sortByTitle(' + JSON.stringify(params) + ')');
	});
	
	sortDecadeAscButton.on('click', function(event){
		console.log("controller.sortDecadeAscButton:click");
		var params = {
			direction: "asc"
		};
		eddie.putLou('', 'sortByDate(' + JSON.stringify(params) + ')');
	});
	
	sortDecadeDescButton.on('click', function(event){
		console.log("controller.sortDecadeDescButton:click");
		var params = {
			direction: "desc"
		};
		eddie.putLou('', 'sortByDate(' + JSON.stringify(params) + ')');
	});
	
	sortDurationAscButton.on('click', function(event){
		console.log("controller.sortDurationAscButton:click");
		var params = {
			direction: "asc"
		};
		eddie.putLou('', 'sortByDuration(' + JSON.stringify(params) + ')');
	});
	
	sortDurationDescButton.on('click', function(event){
		console.log("controller.sortDurationDescButton:click");
		var params = {
			direction: "desc"
		};
		eddie.putLou('', 'sortByDuration(' + JSON.stringify(params) + ')');
	});
};


function AutoInput(name, obj){
	var input = document.createElement("input");
	input.setAttribute("class",name);
	input.type="text";

	// boolean to know if the user is editing me
	input.isEdited = false;
	input.onblur = function(e){
		//var that=this;
		obj[name]=this.value; 
		this.isEdited = false;
		Database.update(obj);
	};
	input.onfocus = function(e){this.isEdited = true;};
	
	// automatic validation upon enter key press
	input.onkeypress = function(e){if(e.keyCode == 13) this.blur();};
	
	return input;
};

/**
* Task object definition
*/
function Task(start, project, desc, stop){
	var that = this;
	
	/**
	* Privates parameters
	* @startTime Task starting time 
	* @stopTime Task stoping time 
	*/
	var startTime;
	var isNewTask;
	if (start == undefined){
		startTime = new Date();
		isNewTask = true;
	} else {
		startTime = new Date(start);
		isNewTask = false;
	}
	
	var stopTime;
	if (stop != undefined && stop != ""){
		stopTime = new Date(stop);
	}
	
	/**
	* Public parameters
	* @project Project name associated with the task
	* @desc Description of the task work
	*/
	if (project == undefined){
		this.project = "projet";
	} else {
		this.project = project;
	}
	if (desc == undefined){
		this.desc = "description";
	} else {
		this.desc = desc;
	}
	
	/**
	* Public method
	* @return the Task starting time in 00:00:00 format
	*/
	this.getStartTime = function(){
		var h = startTime.getHours();
		var m = startTime.getMinutes();
		var s = startTime.getSeconds();
		return ((h>9)?"":"0")+h+":"+((m>9)?"":"0")+m+":"+((s>9)?"":"0")+s;
	};
	
	this.getStartDate = function(){return startTime};
	this.getStopDate = function(){return (stopTime == undefined ? "" : stopTime)};
	
	/**
	* Public method
	* @return the Task elapsed time in 0:00 format
	*/
	this.getElapsedTime = function(){
		var endTime;
		if (stopTime == undefined) endTime = new Date();
		else endTime = stopTime;
		
		var ms = endTime - startTime;
		var s = Math.floor(ms/1000);
		var m = Math.floor(s/60);
		var rs = s - m*60;
		var h = Math.floor(m/60);
		var rm = m - h*60;
		return (h>0?(h>9?"":"0")+h+":":"") + ((h>0?(rm>9?"":"0"):"")+rm+":" ) +((rs>9?"":"0")+rs);
	};
	
	/**
	* Private parameter
	* HTML rendering DOM element
	*/
	var html = document.createElement("div");
	html.setAttribute("class","job");
	
	html.i1 = AutoInput("project",this);
	html.appendChild(html.i1);
	
	html.i2 = AutoInput("desc",this);
	html.appendChild(html.i2);
	
	html.s1 = document.createElement('span');
	html.s1.setAttribute("class","startTime");
	html.appendChild(html.s1);
	
	html.s2 = document.createElement('span');
	html.s2.setAttribute("class","timer");
	html.appendChild(html.s2);
	
	html.s3 = document.createElement('span');
	html.s3.setAttribute("class","timerVal");
	html.appendChild(html.s3);
	
	/**
	* Public method
	* @return the DOM element rendering the Task
	*/
	this.getHTML = function(){
		return html;
	};
	
	/**
	* Private parameter
	* Timer that update the task
	*/
	var timeout;
	
	/**
	* Private method
	* Updates the DOM element according to the current Task status
	*/
	var renderHTML = function(){
		var endTime;
		if (stopTime == undefined) endTime = new Date();
		else endTime = stopTime;
		var time = endTime - startTime;
		html.s1.innerHTML = this.getStartTime();
		html.s2.setAttribute("style","width:"+Math.ceil(time/10000)+"px");
		html.s3.innerHTML = this.getElapsedTime();
		if(this.project != null && !html.i1.isEdited){
			html.i1.value = this.project;
			html.i1.setAttribute("style", "width:"+html.i1.value.length+"ex");
		}
		if(this.desc != null && !html.i2.isEdited){
			html.i2.value = this.desc;
			html.i2.setAttribute("style", "width:"+html.i2.value.length+"ex");
		}
		var that = this;
		if (stopTime == undefined){
			timeout = setTimeout(function(){renderHTML.call(that);}, 1000);
		}
	}
	renderHTML.call(this);
	
	/**
	* Public method
	* Pauses the task execution
	*/
	this.pause = function(){
		if (stopTime != undefined) return;
		stopTime = new Date();
		renderHTML.call(this);
		clearTimeout(timeout);
		Database.update(this);
	}
	
	if (isNewTask){
		Database.store(that);
	}
}
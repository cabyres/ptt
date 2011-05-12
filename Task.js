/**
* Task object definition
*/

/**
* Task contructor
*/
function Task(){
	
	/**
	* Private parameter
	* Task starting time
	*/
	var startTime = new Date();
	
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
	
	/**
	* Public method
	* @return the Task elapsed time in 0:00 format
	*/
	this.getElapsedTime = function(){
		var ms = new Date() - startTime;
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
	
	html.s1 = document.createElement('span');
	html.s1.setAttribute("class","startTime");
	html.s1.innerHTML = this.getStartTime();
	html.appendChild(html.s1);
	
	html.s2 = document.createElement('span');
	html.s2.setAttribute("id","timer");
	html.s2.setAttribute("class","timer");
	html.appendChild(html.s2);
	
	html.s3 = document.createElement('span');
	html.s3.setAttribute("id","timerVal");
	html.appendChild(html.s3);
	
	/**
	* Public method
	* @return the DOM element rendering the Task
	*/
	this.getHTML = function(){
		return html;
	};
	
	/**
	* Private method
	* Updates the DOM element according to the current Task status
	*/
	var renderHTML = function(){
		var time = new Date() - startTime;
		html.s2.setAttribute("style","width:"+Math.ceil(time/10000)+"px");
		html.s3.innerHTML = this.getElapsedTime();
		var that = this;
		this.timeout = setTimeout(function(){renderHTML.call(that);}, 1000);
	}
	renderHTML.call(this);
}
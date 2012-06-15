/*
function select (start, end, field) {
	if ( field.createTextRange ) { //IE
		var newend = end - start;
		var selRange = field.createTextRange();
		selRange.collapse(true);
		selRange.moveStart("character", start);
		selRange.moveEnd("character", newend);
		selRange.select();
	} else if ( field.setSelectionRange ){
		field.setSelectionRange(start, end);
	} 
	field.focus();
}
*/
jQuery.fn.select = function (from, to) {
	if ( this[0].createTextRange ) { //IE
		var newend = to - from;
		var selRange = this[0].createTextRange();
		selRange.collapse(true);
		selRange.moveStart("character", from);
		selRange.moveEnd("character", newend);
		selRange.select();
	} else if ( this[0].setSelectionRange ){
		this[0].setSelectionRange(from, to);
	} 
	this[0].focus();
}

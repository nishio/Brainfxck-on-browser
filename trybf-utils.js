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

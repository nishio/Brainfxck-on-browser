jQuery.fn.highlight = function (from, to) {
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
	this.focus();
}

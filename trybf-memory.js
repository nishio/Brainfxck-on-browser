(function (global) {
	var memory = [], idx = 0;
	global.memory = {
		init : function () {
			var el = $("#mem");
			for (var i=0 ; i<256 ; i++) {
				$("<span></span>")
					.attr("id", "mem"+i)
					.appendTo(mem);
			}
			this.clear();
		},
		clear : function () {
			idx = 0;
			for (var i=0 ; i<256 ; i++) {
				memory[i] = 0;
				$("#mem" + i).html("000");
			}
			$("#mem"+idx).addClass("active");
		},
		prev : function () {
			$("#mem" + idx).removeClass("active");
			idx = (idx + 255) % 256;
			$("#mem" + idx).addClass("active");
		},
		next : function () {
			$("#mem" + idx).removeClass("active");
			idx = (idx + 1) % 256;
			$("#mem" + idx).addClass("active");
		},
		inc : function () {
			memory[idx] = (memory[idx] + 1) % 256;
			var x = memory[idx].toString();
			$("#mem"+idx).html(Array(4-x.length).join("0")+x);
		},
		dec : function () {
			memory[idx] = (memory[idx] + 255) % 256;
			var x = memory[idx].toString();
			$("#mem"+idx).html(Array(4-x.length).join("0")+x);
		},
		get : function () {
			return memory[idx];
		},
		set : function (v) {
			memory[idx] = v;
			var x = memory[idx].toString();
			$("#mem"+idx).html(Array(4-x.length).join("0")+x);
		}
	};
})(this);

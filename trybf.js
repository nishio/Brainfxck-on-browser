$(function () {
	var INTERVAL = 1000 / 20;
	
	//Edit mode
	$("#edit-mode > #run").click(function () {
		$("#edit-mode").hide();
		$("#run-mode").show();
		init();
		run();
	});
	
	var runId;
	function run () {
			try {
				step();
			} catch (e) {
				return;
			}
			runId = setTimeout(run, INTERVAL);
	};
	
	
	$("#edit-mode > #debug").click(function () {
		$("#edit-mode").hide();
		$("#debug-mode").show();
		init();
	});
	
	
	//Run mode
	$("#run-mode > #stop").click(function () {
		$("#run-mode").hide();
		$("#edit-mode").show();
		clearTimeout(runId);
	});
	
	
	//Debug mode
	$("#debug-mode > #stop").click(function () {
		$("#debug-mode").hide();
		$("#edit-mode").show();
	});
	
	$("#debug-mode > #step").click(step);
	$("#debug-mode > #stepto").click(stepto);
	
	
	//Common code
	var code, pc;
	
	var output = $("#output");
	
	function init () {
		code = $("#code").val();
		output.html("");
		memory.clear();
		pc = 0;
	}
	
	function stepto () {
	
	}
	
	function step () {
		for (var i=pc ; i<code.length ; i++) {
			if ("+-<>[],.".indexOf(code[i]) != -1) {
				select(i, i+1, $("#code")[0]);
				switch (code[i]) {
					case "+":
						memory.inc();
						break;
					case "-":
						memory.dec();
						break;
					case ">":
						memory.next();
						break;
					case "<":
						memory.prev();
						break;
					case "[":
						if (!memory.get()) {
							var level = 0;
							for (; i<code.length ; i++) {
								if (code[i] == "[") level++;
								if (code[i] == "]") level--
								if (level == 0) break;
							}	
						}
						break;
					case "]":
						if (memory.get()) {
							var level = 0;
							for (; i>0 ; i--) {
								if (code[i] == "[") level++;
								if (code[i] == "]") level--
								if (level == 0) break;
							}	
						}
						break;
					case ".":
						output.html(output.html()+String.fromCharCode(memory.get()))
						break;
				}
				pc = i+1;
				break;
			}
		}
		if (i == code.length) throw "End of program";
	}
	
	memory.init();
});

$(function () {
	var INTERVAL = 1000 / 20;
	
	//Edit mode
	$("#edit-mode > #run").click(function () {
		$("#edit-mode").hide();
		$("#run-mode").show();
		init();
		run(false);
	});
	
	var runId;
	function run (end) {
		if (end) {
			$("#run-mode > #stop").click();
		} else {
			runId = setTimeout(function () {
				step(run);
			}, INTERVAL);
		}
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
	
	$("#debug-mode > #step").click(function () {
		$("#debug-mode").attr("disabled", "");
		step(function (end) {
			$("#debug-mode > *").removeAttr("disabled");
		});
	});
	
	$("#debug-mode > #stepto").click(stepToBreakpoint);
	
	
	//Common code
	var code, pc;
	
	var output = $("#output");
	
	function init () {
		code = $("#code").val();
		output.html("");
		memory.clear();
		pc = 0;
	}
	
	function stepToBreakpoint () {
		function doStepToBreakpoint () {
			var idx = code.indexOf("(breakpoint)", pc);
			if (pc < idx) {
				step(function () {
					setTimeout(doStepToBreakpoint, INTERVAL);
				});
			} else {
				pc = idx + "(breakpoint)".length;
				$("#code").select(idx, pc);
			}
		}
		doStepToBreakpoint();
	}
	
	
	
	function step (next) {
		for (var i=pc ; i<code.length ; i++) {
			if ("+-<>[],.".indexOf(code[i]) != -1) {
				$("#code").select(i, i+1);
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
					case ",":
						$("#code").blur();
						$(document).one("keyup", function (e) {
							$("#code").focus();
							memory.set(e.keyCode);
							pc = i + 1;
							next(pc >= code.length);
							return false;
						});
						return;
						break;
				}
				pc = i+1;
				break;
			}
		}
		
		next(pc >= code.length);
	}
	
	memory.init();
});

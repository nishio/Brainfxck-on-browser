$(function () {
	var INTERVAL = 1000 / 20;
	var stop = true;
	
	function ignoreEvent (e) {
		e.preventDefault();
		return false;
	}
	
	function initInterpeter () {
		stop = false;
		$("#edit-mode").hide();
		
		code = $("#code").val();
		output.html("");
		memory.clear();
		pc = 0;
		$("#code")
			.on("keydown", ignoreEvent)
			.on("keypress", ignoreEvent);
	}
	
	function stopInterpreter () {
		$("#edit-mode").show();
		stop = true;
		clearTimeout(runId);
		$("#code")
			.off("keydown", ignoreEvent)
			.off("keypress", ignoreEvent);
	}
	
	//Run mode
	$("#edit-mode > #run").click(function () {
		initInterpeter();
		$("#run-mode").show();
		step(run);
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
		
	$("#run-mode > #stop").click(function () {
		$("#run-mode").hide();
		stopInterpreter();
	});
	
	
	//Debug mode
	
	$("#edit-mode > #debug").click(function () {
		initInterpeter();
		$("#debug-mode").show();
	});
	
	$("#debug-mode > #stop").click(function () {
		$("#debug-mode").hide();
		stopInterpreter();
	});
	
	$("#debug-mode > #step").click(function () {
		step(function () {});
	});
	
	$("#debug-mode > #stepto").click(stepToBreakpoint);
		
	function stepToBreakpoint () {
		function doStepToBreakpoint () {
			var idx = code.indexOf("(breakpoint)", pc);
			if (pc < idx) {
				step(function () {
					setTimeout(doStepToBreakpoint, INTERVAL);
				});
			} else {
				pc = idx + "(breakpoint)".length;
				$("#code").highlight(idx, pc);
			}
		}
		doStepToBreakpoint();
	}
	
	//Common code
	var code, pc;
	
	var output = $("#output");
		
	function step (next) {
		for (var i=pc ; i<code.length ; i++) {
			if ("+-<>[],.".indexOf(code[i]) != -1) {
				$("#code").highlight(i, i+1);
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
							next(pc >= code.length || stop);
							return false;
						});
						return;
						break;
				}
				pc = i+1;
				break;
			}
		}
		
		next(pc >= code.length || stop);
	}
	
	memory.init();
});

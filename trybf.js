$(function () {
	var code   = $("#code"),
	    action = $("#run"),
	    output = $("#output");
	
	var loop, prog, pc;
	
	function run (e) {
		e.preventDefault();
		action.html("Stop").one("click", stop);
		var interval = Number($("#interval").val()) * 1000 || 300;
		memory.clear();
		pc = 0;
		loop = setInterval(step, interval);
		prog = code.val();
		output.html("");
		return false;
	}
	
	function step () {
		for (var i=pc ; i<prog.length ; i++) {
			if ("+-<>[],.".indexOf(prog[i]) != -1) {
				switch (prog[i]) {
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
							for (; i<prog.length ; i++) {
								if (prog[i] == "[") level++;
								if (prog[i] == "]") level--
								if (level == 0) break;
							}	
						}
						break;
					case "]":
						if (memory.get()) {
							var level = 0;
							for (; i>0 ; i--) {
								if (prog[i] == "[") level++;
								if (prog[i] == "]") level--
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
		if (i==prog.length) {
			stop();
		}
	}
	
	function stop () {
		action.html("Run").one("click", run);
		clearInterval(loop);
	}
	
	action.one("click", run);
	memory.init();
});

$(function () {
	var code   = $("#code"),
	    action = $("#run"),
	    output = $("#output");
	
	var prog, pc, interval;
	
	function run (e) {
		e.preventDefault();
		action.html("Stop").one("click", stop);
		interval = Number($("#interval").val()) * 1000;
		console.log(interval);
		memory.clear();
		pc = 0;
		prog = code.val();
		output.html("");
		if (interval==0) {
			step();
		} else {
			setTimeout(step, interval);
		}
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
		} else {
			if (interval==0) {
				step();
			} else {
				setTimeout(step, interval);
			}
		}
	}
	
	function stop () {
		action.html("Run").one("click", run);
	}
	
	action.one("click", run);
	memory.init();
});

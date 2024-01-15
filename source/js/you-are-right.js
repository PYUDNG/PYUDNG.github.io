(function() {
	'use strict';

	(function locateStack() {
		['懒得找', 'lc'].forEach(p => Object.defineProperty(window, p, {
			configurable: true,
			enumerable: false,
			get() { console.trace('%c大懒蛋，找个代码都要传送门，喏↓', 'color: #993333;'); }
		}));
	}) ();
	// 既然你都找到这里了，那本小姐就勉为其难地用中文写个注释吧
	// 才不是英文什么的不会哦？本小姐只是为了照顾你这个英文都看不懂的笨蛋才写的中文哦！

	// 定义常量
	const CONST = {
		ExecMode: {
			// 由于这里的常量仅仅作为模式标志，内容并无实际意义，我就直接在内容里写注释了
			// 好孩子不要学哦
			// 基本上内容随便写都没事，唯一原则：任何两项的内容之间不得完全一致
			SourceCode: '使用Function()包装源代码后直接执行包装函数',
			ScriptTag: '直接把源代码放在一个新的<script>里面执行，然后移除<script>',
			ScriptBlob: '源代码生成BlobURL作为<script>的src执行，然后移除<script>',
			FuncCall: '将函数作为参数传递给使用Function()包装的执行器执行'
		},
		ExecTip: '既然懒得去看仓库，那就来陪我玩捉迷藏吧ヾ(@^▽^@)ノ猜猜代码躲在哪里啦\n// 你也可以在控制台输入"懒得找"或者"lc"(locate的缩写)直接定位代码:)'
	}

	//Object.values(CONST.ExecMode).forEach(mode => setTimeout(() => wrappedExec(log, mode)));
	wrappedExec(log, CONST.ExecMode.ScriptBlob);

	function log() {
		const logParts = [
			['你说得对，但是我的博客是', 'color: #9999CC; font-size: 3em;'],
			['开源', 'color: orange; font-size: 3em;'],
			['的\n', 'color: #9999CC; font-size: 3em;'],
			['https://github.com/PYUDNG/PYUDNG.github.io', 'color: #99FF33'] // 你说得对，但我知道这个颜色不会被显示出来
		]
		const logArgs = logParts.reduce((args, part) => {
			args[0] += '%c' + part[0];
			args.push(part[1]);
			return args;
		}, ['']);
		console.log(...logArgs);
	}

	// 上来就把源代码端上来太没意思了，想看源代码自己找去
	function wrappedExec(func, mode) {
		const ExecMode = CONST.ExecMode;

		// 包装函数内部的代码
		const code = `// ${CONST.ExecTip}\n` + ({
			[ExecMode.SourceCode]: `(${func.toString()}) ();`,
			[ExecMode.ScriptTag]: `(${func.toString()}) ();`,
			[ExecMode.ScriptBlob]: `(${func.toString()}) ();`,
			[ExecMode.FuncCall]: `func();`
		})[mode];

		// 传递给包装函数的参数
		const args = ({
			[ExecMode.SourceCode]: {},
			[ExecMode.ScriptTag]: {},
			[ExecMode.ScriptBlob]: {},
			[ExecMode.FuncCall]: { func }
		})[mode];
		const [argNames, argValues] = Array.from(Object.entries(args)).reduce((result, [name, value]) => {
			result[0].push(name);
			result[1].push(value);
			return result;
		}, [[], []]);
		
		switch (mode) {
			case ExecMode.ScriptTag: {
				const script = document.createElement('script');
				script.innerHTML = code;
				script.onload = e => script.remove();
				document.head.appendChild(script);
				break;
			}
			case ExecMode.ScriptBlob: {
				const script = document.createElement('script');
				const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
				script.src = url;
				script.onload = e => {
					script.remove();
					URL.revokeObjectURL(url);
				}
				document.head.appendChild(script);
				break;
			}
			case ExecMode.SourceCode:
			case ExecMode.FuncCall:
				Function(...argNames, code)(...argValues);
				break;
		}
	}
}) ();
(function () {
	var pageStart = 0;
	var pageEnd = 0;
	var splitContent;
	var SDM = '';
	var Pages = [];
	var p = -1;
	this.PageReflow = function () {


		var defaults = {
			sourceDom: '',
			height: null
		}

		if (arguments[0] && typeof arguments[0] === "object") {
			this.options = extendDefaults(defaults, arguments[0]);
		}
		if (this.options.sourceDom != '') SDM = this.options.sourceDom;

		var page = document.getElementById(this.options.sourceDom);
		if(this.options.height && this.options.height != null) {
			page.style.height = this.options.height;
		}
		
		splitContent = splitInput(page.innerHTML);
		console.log(splitContent);
		page.innerHTML = "";
		splitPage(page);
		fillPageNew(page, 'forward');

	}
	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}
	function checkOverflow(el) {
		var curOverflow = el.style.overflow;
		if (!curOverflow || curOverflow === "visible")
			el.style.overflow = "hidden";
		var isOverflowing = el.clientWidth < el.scrollWidth
			|| el.clientHeight < el.scrollHeight;
		el.style.overflow = curOverflow;
		return isOverflowing;
	}

	function splitInput(input) {
		// split the input into an array of tags containing arrays of words
		input = input.replace(/(\r\n\t|\n|\r\t)/gm, "");
		var words = [];
		while (input.length > 0) {
			if (input.charAt(0) == "<") {
				if (input.substr(0, input.indexOf(">") + 1).trim() != '')
					words.push(input.substr(0, input.indexOf(">") + 1).trim());
				input = input.substr(input.indexOf(">") + 1).trim();
				//		var next = indexOfMultiple( input, " <" )
				//		words[ words.length - 1 ] += input.substr( 0, next ); // attach tags to their closest word
				//		input = input.substr( next ).trim();
			}
			var next = indexOfMultiple(input, " <")
			if (input.substr(0, next).trim() != '')
				words.push(input.substr(0, next).trim());
			input = input.substr(next).trim();
		}
		return words;
	}

	function indexOfMultiple(str, compare) {
		// finds index of first occurence of a character in compare
		for (var i = 0; i < str.length; i++) {
			var c = str.charAt(i);
			for (var j = 0; j < compare.length; j++) {
				if (c == compare[j]) {
					return i;
				}
			}
		}
		return str.length;
	}
	function splitPage(page) {
		
		var oldContent = '';
		var newContent = '';
		var end = 0;
		while (end < splitContent.length) {
			var start = pageEnd;
			while (!checkOverflow(page)) {
				// fill the page until it overflows					
				if (pageEnd > splitContent.length) {
					break;
				}

				oldContent = newContent;
				
				newContent = "";
				
				for (var i = start; i < pageEnd; i++) {					
					newContent += splitContent[i] + " ";				
				}
				page.innerHTML = newContent;
				//console.log(newContent);
				pageEnd++;

			}
			end = pageEnd;
			var content = "";

			page.innerHTML = oldContent;
			content = oldContent;

			if (oldContent.charAt(0) != "<") {
				// put beginning tags if missing
				var i = start;

				while ((splitContent[i].charAt(i) != "<") || (splitContent[i].substr(0, 2) == "</")) {
					i--;
				}
				
				content = splitContent[i] + oldContent;
				//page.innerHTML = content;
			}
			Pages.push(content);
			pageEnd -= 2;
		}

		console.log(Pages);

	}
	function fillPageNew(page, direction) {
			
		if (direction == 'forward')
			if (p >= Pages.length - 1)
				p = Pages.length - 1;
			else
				p ++;	

		if (direction == 'back')
			if (p <= 0)
				p = 0;
			else
				p--;

		page.innerHTML = Pages[p];
	}

	function createControlUI() {
		
	}
	

	PageReflow.prototype.forward = function () {
		//pageStart = pageEnd;
		fillPageNew(document.getElementById(SDM), "forward");
	}

	PageReflow.prototype.back = function () {
		//pageEnd = pageStart;
		fillPageNew(document.getElementById(SDM), "back");
	}
}())



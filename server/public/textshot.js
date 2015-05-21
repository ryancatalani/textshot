window.onload = function() {
	var quote_text, quote_title, quote_source, 
		canvas, ctx,
		qbounds, mbounds, sbounds,
		style;

	var quote_width = 1024;
	var quote_height = 512;
	var t_ratio = 2;
	var lr_padding = 60;
	var tb_padding = 40;
	var bot_lr_padding = 25;

	var quote_text_el = document.getElementById('quote_text');
	var quote_title_el = document.getElementById('quote_title');
	var quote_source_el = document.getElementById('quote_source');

	var tweet_composer_el = document.getElementById('tweet_input_composer');
	var tweet_count_el = document.getElementById('tweet_input_count');

	style = {
		bkgd: '#FCFAEC',
		sec_bkgd: '#EEECD8',
		font_family: 'Georgia',
		font_color: '#5A594F',
		sec_font_color: '#95947F',
		max_font_size: 60,
		line_height_em: 1.4,
		max_line_height_em: 1.25
	};

	quote_text_el.onkeyup = function() { update_quote(); }
	quote_title_el.onkeyup = function() { update_quote(); }
	quote_source_el.onkeyup = function() { update_quote(); }
	tweet_composer_el.onkeyup = function() { update_tweet_char_count(); }

	var test_text = function() {
		quote_text_el.value = "With a few taps on a phone, for a fee, today’s hottest start-ups will help people on the lowest rungs of the 1 percent live like their betters in the 0.1 percent. These services give the modestly wealthy a chance to enjoy the cooks, cleaners, drivers, personal assistants and all the other lavish appointments that have defined extravagant wealth. As one critic tweeted, San Francisco’s tech industry “is focused on solving one problem: What is my mother no longer doing for me?”";
		// quote_text_el.value = "No, no, say the start-ups that, today, look as if they’re targeting the rich. The nature of the tech business is that costs come down.";
		quote_title_el.value = "A Tech Boom Aimed at the Few Instead of the World";
		quote_source_el.value = "The New York Times";
		tweet_composer_el.value = "http://www.nytimes.com/2015/05/21/technology/personaltech/a-tech-boom-aimed-at-the-few-instead-of-the-world.html?ref=technology";
		
		update_quote();
		update_tweet_char_count();
	}

	var update_quote = function() {
		quote_text = quote_text_el.value;
		quote_title = quote_title_el.value;
		quote_source = quote_source_el.value;	
		draw_quote();
		convert_quote_for_form();
		// draw_bounds();
	}

	var update_tweet_char_count = function() {
		var count = 140;
		var tweet = tweet_composer_el.value;
		var words = tweet.split(' ');
		var link_len = 23;

		count -= link_len; // 1 link for the image
		count -= words.length; // Spaces

		for (var i = words.length - 1; i >= 0; i--) {
			var word = words[i];
			if (word.search(/^https?:\/\/.+[.].+/) != -1) { // Liberal
				count -= link_len;
			} else {
				count -= word.length;	
			}
		};

		tweet_count_el.innerText = count;
	}

	var setup_canvas = function() {
		canvas = document.getElementById('textshot');
		canvas.width = quote_width * t_ratio;
		canvas.height = quote_height * t_ratio;

		w = canvas.parentElement.offsetWidth - parseInt(window.getComputedStyle(canvas.parentElement).paddingLeft) - parseInt(window.getComputedStyle(canvas.parentElement).paddingRight)
		size_canvas(w, w / 2)

		ctx = canvas.getContext('2d');
		ctx.setTransform(t_ratio, 0, 0, t_ratio, 0, 0);

		qbounds = {
			x: lr_padding,
			y: tb_padding,
			width: quote_width - (lr_padding * 2),
			height: quote_height - (tb_padding * 2) - 60
		};
		mbounds = {
			x: bot_lr_padding,
			y: quote_height - 65,
			width: quote_width - (bot_lr_padding * 2) - 120,
			height: 20
		};
		sbounds = {
			x: bot_lr_padding,
			y: quote_height - 40,
			width: quote_width - (bot_lr_padding * 2) - 120,
			height: 20
		};

		clear_canvas();
	}

	var size_canvas = function(w, h) {
		var w = defaultFor(w, quote_width);
		var h = defaultFor(h, quote_height);
		canvas.style.width = w + "px";
		canvas.style.height = h + "px";		
	}

	var clear_canvas = function() {
		bounds = {
			x: 0,
			y: 0,
			w: canvas.width,
			h: canvas.height
		};
		ctx.clearRect(bounds.x, bounds.y, bounds.w, bounds.h);
		ctx.fillStyle = style.bkgd;
		ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);

		ctx.fillStyle = style.sec_bkgd;
		ctx.fillRect(0, quote_height - tb_padding - 45, canvas.width, tb_padding + 45);
		draw_textshot_source();
	}

	var draw_bounds = function() {
		ctx.fillStyle = 'rgba(255, 163, 122, 0.50)';
		ctx.fillRect(qbounds.x, qbounds.y, qbounds.width, qbounds.height);
		ctx.fillStyle = 'rgba(194, 255, 179, 0.50)';
		ctx.fillRect(mbounds.x, mbounds.y, mbounds.width, mbounds.height);
		ctx.fillStyle = 'rgba(147, 190, 255, 0.50)';
		ctx.fillRect(sbounds.x, sbounds.y, sbounds.width, sbounds.height);
	}

	var draw_quote = function() {
		clear_canvas();				
		fit_and_wrap_text(quote_text, qbounds);
		truncate_text(quote_title, mbounds, 20, 'bold', style.font_color);
		truncate_text(quote_source, sbounds, 20, 'italic', style.font_color);
	}

	var draw_textshot_source = function() {
		ctx.font = '20px ' + style.font_family;
		ctx.fillStyle = style.sec_font_color;
		ctx.textBaseline = 'top';
		ctx.textAlign = 'right';
		ctx.fillText('textshot.it', quote_width - bot_lr_padding, sbounds.y);
	}

	var truncate_text = function(text, bounds, font_size, font_attr, font_color) {
		var words = text.split(' ');
		var font_attr = defaultFor(font_attr, '');
		ctx.font = font_attr + ' ' + font_size + 'px ' + style.font_family;
		ctx.fillStyle = font_color;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';

		var line = '';
		for (var i = 0; i < words.length; i++) {
			var test_line = line + words[i] + ' ';
			var metrics = ctx.measureText(test_line);
			var test_line_width = metrics.width;
			if (test_line_width > bounds.width) {
				ctx.fillText(line + '…', bounds.x, bounds.y);
				break;
			} else {
				line = test_line;
			}
		};
		ctx.fillText(line, bounds.x, bounds.y);
	}

	var wrap_text = function(text, bounds, font_size, line_height) {
		var words = text.split(' ');
		var cur_y = bounds.y;

		ctx.font = font_size + 'px ' + style.font_family;
		ctx.fillStyle = style.font_color;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';

		var line = '';
		for (var i = 0; i < words.length; i++) {
			var test_line = line + words[i] + ' ';
			var metrics = ctx.measureText(test_line);
			var test_line_width = metrics.width;
			if (test_line_width > bounds.width && i > 0) {
				ctx.fillText(line, bounds.x, cur_y);
				line = words[i] + ' ';
				cur_y += line_height;
			} else {
				line = test_line;
			}
		};
		ctx.fillText(line, bounds.x, cur_y);
	}

	var fit_and_wrap_text = function(text, bounds) {
		var drawable_area = bounds.width * bounds.height;
		
		var char_count = text.split('').length;
		var font_size = Math.floor(Math.sqrt(drawable_area / char_count) * 1.2);
		var line_height = Math.floor(style.line_height_em * font_size);

		if (font_size >= (style.max_font_size * 0.85)) {
			font_size = style.max_font_size;
			line_height = style.max_line_height_em * font_size;
		};

		wrap_text(text, bounds, font_size, line_height)
	}

	var defaultFor = function(arg, val) {
		return typeof arg !== 'undefined' ? arg : val;
	}

	var convert_quote_for_form = function() {
		var dest = document.getElementById('tweet_input_img');
		var header_len = 'data:image/png;base64,'.length
		var data = canvas.toDataURL().substr(header_len);
		dest.value = data;
	}

	setup_canvas();
	test_text();
}
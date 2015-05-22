(function(){
	var text, source_title, source_pub, url, base_url, params, iframe;

	text = window.getSelection().toString();

	var metas = document.getElementsByTagName('meta');
	for (var i = metas.length - 1; i >= 0; i--) {
		if ( metas[i].getAttribute('property') == 'og:title' ) {
			source_title = metas[i].getAttribute('content');
		}
		if ( metas[i].getAttribute('property') == 'og:site_name' ) {
			source_pub = metas[i].getAttribute('content');
		}
		if ( metas[i].getAttribute('name') == 'cre' ) {
			source_pub = metas[i].getAttribute('content');
		}
		if ( metas[i].getAttribute('property') == 'og:url' ) {
			url = metas[i].getAttribute('content');
		}
	};

	if (source_title === undefined) {
		source_title = document.getElementsByTagName('source_title')[0].innerText;
	};

	if (source_pub === undefined) {
		source_pub = window.location.hostname;
	}

	if (text === undefined || text === '') {
		text = ' ';
	}

	if (url === undefined) {
		url = window.location.href;
	}

	params = '?tx=' 
		+ encodeURIComponent(text) 
		+ '&ti=' 
		+ encodeURIComponent(source_title) 
		+ '&so=' 
		+ encodeURIComponent(source_pub) 
		+ '&url=' 
		+ encodeURIComponent(url) 
		+ '&go=t';

	base_url = 'http://localhost:9292/'

	// window.location.assign(base_url + params);

	if (document.getElementById('textshot_iframe') === null) {
		iframe = document.createElement('iframe');
		var body = document.getElementsByTagName('body')[0];
		iframe.id = "textshot_iframe";
		iframe.src = base_url + params;
		iframe.style.width = '100%';
		iframe.style.height = '50%';
		iframe.style.boxShadow = '0px 5px 20px 0px rgba(0,0,0,0.25)';
		iframe.style.marginBottom = '20px';
		body.insertBefore(iframe, body.childNodes[0]);
	} else {
		iframe = document.getElementById('textshot_iframe');
		iframe.src = base_url + params;
	}

	window.scrollTo(0,0);

})();
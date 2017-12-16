(function(win, $, plugin) {
	if (typeof $ != 'function') {
		throw new Error('jQuery is not found');
	} else {
		plugin.call(this, win, $);
	}
})(window, jQuery, function(win, $) {
	var utils = {
		isArray: function(ary) {
			return Object.prototype.toString.call(ary) === '[object Array]'
		}
	};

	function mostRouter(container, routes) {
		this.container = container;
		this.routes = routes;
		this.prevroutes = [];
		this.hasprevState = true;
	}

	mostRouter.prototype = {
		validator: function(options) {
			if (utils.isArray(options)) {
				$.each(options, function(index, route) {
					if (!route.hasOwnProperty('path')) {
						throw new Error('path is nessary for this route');
						return;
					}
					if (!route.hasOwnProperty('page')) {
						throw new Error('page is nessary for this route');
						return;
					}
				})
			} else {
				throw new Error('this second arguments of mostRouter must be a array')
			}
		},
		init: function() {
			window.addEventListener('load', this.hashChange, false);
			window.addEventListener('hashchange', this.hashChange, false);
		},
		hashChange: function() {
			var hashCode = window.location.hash.slice(1) || '/';
			var self = this;
			$.each(this.routes, function(index, route) {
				if (route.path === hashCode) {
					$(self.container).html('loading');
					$.get(route.page, function(data) {
						$(self.container).html(data);
					}, 'html');
					if (self.hasprevState) {
						self.prevroutes.push(route);
					};
					self.setPrevState(true);
				}
			});
		},
		setPrevState: function(flag) {
			this.hasprevState = flag;
		},
		push: function(route) {
			window.location.hash = '#' + route.path;
		},
		replace: function(route) {
			this.setPrevState(false);
			window.location.hash = '#' + route.path;
		}

	}
});
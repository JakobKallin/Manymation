var Manymation = function(target, property) {
	var interval = 50;
	var timer;
	
	var start = function(endValue, duration) {
		// If we don't round, we might get a non-integer tick count, which would break the conditional at the end of the tick() function.
		var tickCount = Math.round(duration / interval);
		
		if ( tickCount === 0 ) {
			// If we don't do this, we would divide by zero when calculating amount.
			target[property] = endValue;
		} else {
			var tickIndex = -1;
			var lastTickIndex = tickCount - 1;
			
			var tick = function() {
				tickIndex += 1;
				
				var progress = tickIndex / lastTickIndex;
				var value = progress;
				target[property] = value;
				
				if ( tickIndex === lastTickIndex ) {
					window.clearInterval(timer);
				}
			};
			
			var timer = window.setInterval(tick, interval);
		}
	};
	
	return {
		start: start
	};
};
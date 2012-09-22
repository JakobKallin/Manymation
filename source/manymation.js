var Manymation = function(target, property, highestValue, duration) {
	var interval = 50;
	var timer;
	// If we don't round, we might get a non-integer tick count, which would break the conditional at the end of the tick() function.
	var tickCount = Math.round(duration / interval);
	var tickIndex = -1;
	var lastTickIndex = tickCount - 1;
	
	var hasStartedPlaying = false;
	var hasStartedRewinding = false;
	
	var play = function() {
		if ( hasStartedPlaying ) {
			return;
		}
		
		hasStartedPlaying = true;
		if ( tickCount === 0 ) {
			target[property] = highestValue;
		} else {
			var startValue = 0;
			target[property] = startValue;
			
			var tick = function() {
				tickIndex += 1;
				
				var progress = tickIndex / lastTickIndex;
				var value = progress * highestValue;
				target[property] = value;
				
				var animationIsOver = tickIndex === lastTickIndex;
				if ( animationIsOver ) {
					window.clearInterval(timer);
				}
			};
			
			timer = window.setInterval(tick, interval);
		}
	};
	
	var rewind = function() {
		if ( hasStartedRewinding ) {
			return;
		}
		
		hasStartedRewinding = true;
		window.clearInterval(timer);
		
		if ( tickCount === 0 ) {
			target[property] = 0;
		} else {
			var tick = function() {
				tickIndex -= 1;
				
				var progress = tickIndex / lastTickIndex;
				var value = progress * highestValue;
				target[property] = value;
				
				var animationIsOver = tickIndex === 0;
				if ( animationIsOver ) {
					window.clearInterval(timer);
				}
			};
			
			timer = window.setInterval(tick, interval);
		}
	};
	
	return {
		play: play,
		rewind: rewind
	};
};
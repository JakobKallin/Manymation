var Manymation = function(duration) {
	var interval = 50;
	var timer;
	// If we don't round, we might get a non-integer tick count, which would break the conditional at the end of the tick() function.
	var tickCount = Math.round(duration / interval);
	var tickIndex = -1;
	var lastTickIndex = tickCount - 1;
	
	var animations = [];
	
	var hasStartedPlaying = false;
	var hasStartedRewinding = false;
	
	var play = function() {
		if ( hasStartedPlaying ) {
			return;
		}
		
		hasStartedPlaying = true;
		if ( tickCount === 0 ) {
			animations.map(function(anim) {
				anim.value = anim.endValue;
			});
		} else {
			var tick = function() {
				tickIndex += 1;
				
				var progress = tickIndex / lastTickIndex;
				animations.map(function(anim) {
					var value = progress * anim.endValue;
					anim.value = value;
				});
				
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
			animations.map(function(anim) {
				anim.value = 0;
			});
		} else {
			var tick = function() {
				tickIndex -= 1;
				
				var progress = tickIndex / lastTickIndex;
				animations.map(function(anim) {
					var value = progress * anim.endValue;
					anim.value = value;
				});
				
				var animationIsOver = tickIndex === 0;
				if ( animationIsOver ) {
					window.clearInterval(timer);
				}
			};
			
			timer = window.setInterval(tick, interval);
		}
	};
	
	var Animation = function(target, property, endValue) {
		return {
			endValue: endValue,
			set value(value) {
				if ( isNaN(value) ) {
					// This prevents a horrible bug in Chrome (and possibly other browsers) that emits a loud noise if the volume of an <audio> element is set to NaN.
					// This should not normally happen, but it is a way of guarding against limitations of this library and bugs in its code.
					throw new Error('Animation value is not a number.');
				} else {
					target[property] = value;
				}
			}
		};
	};
	
	var track = function(target, property, endValue) {
		var anim = new Animation(target, property, endValue)
		animations.push(anim);
		
		var startValue = 0;
		anim.value = startValue;
	};
	
	return {
		play: play,
		rewind: rewind,
		track: track
	};
};
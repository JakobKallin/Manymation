window.requestAnimationFrame =
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame;

var Manymation = function(onRewindEnded) {
	var animations = [];
	
	var duration = 0;
	var elapsed = 0;
	var hasStartedPlaying = false;
	var hasStartedRewinding = false;
	var hasEnded = false;
	var hasBeenStopped = false;
	
	var rewindListeners = [];
	
	var play = function(newDuration) {
		duration = newDuration;
		
		if ( hasStartedPlaying || hasEnded ) {
			return;
		}
		
		hasStartedPlaying = true;
		
		if ( duration === 0 ) {
			animations.map(function(anim) {
				anim.value = anim.endValue;
			});
		} else {
			var start = window.mozAnimationStartTime || Number(new Date());
			
			var tick = function tick(time) {
				time = time || Number(new Date());
				elapsed = time - start;
				
				animations.map(function(anim) {
					var value = progress(duration) * anim.endValue;
					anim.value = value;
				});
				var animationIsOver = elapsed >= duration;
				
				if ( !animationIsOver && !hasBeenStopped ) {
					window.requestAnimationFrame(tick);
				}
			};
			
			window.requestAnimationFrame(tick);
		}
	};
	
	var rewind = function(newDuration) {
		duration = newDuration;
		
		if ( hasStartedRewinding || hasEnded ) {
			return;
		}
		
		elapsed = 0;
		hasStartedRewinding = true;
		
		if ( duration === 0 ) {
			animations.map(function(anim) {
				anim.value = 0;
			});
			hasEnded = true;
			if ( onRewindEnded ) {
				onRewindEnded();
			}
		} else {
			var start = window.mozAnimationStartTime || Number(new Date());
			
			var tick = function tick(time) {
				time = time || Number(new Date());
				elapsed = time - start;
				
				animations.map(function(anim) {
					var value = progress(duration) * anim.endValue;
					anim.value = value;
				});
				var animationIsOver = elapsed >= duration;
				
				if ( animationIsOver ) {
					hasEnded = true;
					if ( onRewindEnded ) {
						onRewindEnded();
					}
				} else if ( !hasBeenStopped ) {
					window.requestAnimationFrame(tick);
				}
			};
			
			window.requestAnimationFrame(tick);
		}
	};
	
	var stop = function() {
		hasBeenStopped = true;
		hasEnded = true;
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
					var roundedValue = Math.min(Math.max(value, 0), endValue);
					target[property] = roundedValue;
				}
			}
		};
	};
	
	var track = function(target, property, endValue) {
		var anim = new Animation(target, property, endValue)
		animations.push(anim);
		
		var startValue = progress(duration) * endValue;
		anim.value = startValue;
	};
	
	var progress = function(duration) {
		var ratio;
		
		if ( elapsed === 0 ) {
			ratio = 0;
		} else {
			ratio = elapsed / duration;
		}
		
		if ( hasStartedRewinding ) {
			return 1 - ratio;
		} else {
			return ratio;
		}
	};
	
	return {
		play: play,
		rewind: rewind,
		stop: stop,
		track: track,
		get isRewinding() {
			return hasStartedRewinding && !hasEnded;
		}
	};
};
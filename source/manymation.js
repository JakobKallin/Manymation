window.requestAnimationFrame = window.webkitRequestAnimationFrame
	|| window.mozRequestAnimationFrame;

var Manymation = {};

Manymation.animate = function(duration, onEnded, targets) {
	var animation = new Manymation.Animation(duration, onEnded, targets);
	animation.start();
	
	return animation;
};

Manymation.Animation = function(duration, onEnded, targets) {
	targets = targets || [];
	
	// This needs to be zero because we can track targets before starting the
	// animation.
	var elapsedTime = 0;
	var startTime;
	
	var hasBegun = false;
	var hasEnded = false;
	
	var tick = function tick() {
		var time = Number(new Date());
		elapsedTime = time - startTime;
		
		var isOver = elapsedTime >= duration;
		if ( isOver ) {
			end(onEnded);
		} else {
			targets.map(function(target) {
				target.update(progress(elapsedTime));
			});
			window.requestAnimationFrame(tick);
		}
	};
	
	var start = function() {
		if ( hasBegun ) {
			return;
		}
		
		hasBegun = true;
		
		startTime = Number(new Date());
		elapsedTime = 0;
		
		if ( duration === 0 ) {
			end(onEnded);
		} else {
			window.requestAnimationFrame(tick);
		}
	};
	
	var end = function() {
		if ( hasEnded ) {
			return;
		}
		
		hasEnded = true;
		
		if ( onEnded ) {
			if ( !(onEnded instanceof Array) ) {
				onEnded = [onEnded];
			}
			onEnded.forEach(function(callback) {
				callback();
			});
		}
		complete();
	};
	
	var complete = function() {
		targets.map(function(target) {
			target.update(1);
		});
	};
	
	var Target = function(object, property, startValue, endValue) {
		var difference = endValue - startValue;
		var highestValue = Math.max(startValue, endValue);
		var lowestValue = Math.min(startValue, endValue);
		
		return {
			update: function(progress) {
				var value = startValue + progress * difference;
				// console.log(elapsedTime + ": " + value);
				
				if ( isNaN(value) ) {
					/*
					 * This prevents a horrible bug in Chrome (and possibly
					 * other browsers) that emits a loud noise if the volume of
					 * an <audio> element is set to NaN. This should not
					 * normally happen, but it is a way of guarding against
					 * limitations of this library and bugs in its code.
					 */
					throw new Error('Animation value is not a number.');
				} else {
					var roundedValue = Math.min(Math.max(value, lowestValue),
						highestValue);
					object[property] = roundedValue;
				}
			}
		};
	};
	
	var track = function(object, property, startValue, endValue) {
		var target = new Target(object, property, startValue, endValue)
		targets.push(target);
		target.update(progress(elapsedTime));
	};
	
	var progress = function(elapsedTime) {
		if ( duration === 0 && !hasBegun ) {
			return 0;
		} else if ( duration === 0 && hasBegun ) {
			return 1;
		} else if ( hasEnded ) {
			return 1;
		} else {
			return elapsedTime / duration;
		}
	};
	
	return {
		track: track,
		start: start,
		complete: complete
	};
};
describe('Manymation', function() {
	beforeEach(function() {
		this.addMatchers({
			toBeBetween: function(first, second) {
				var lowest = Math.min(first, second);
				var highest = Math.max(first, second);
				
				return lowest <= this.actual && this.actual <= highest;
			}
		});
	});
	
	var testOneWayAnimation = function(highestValue) {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', highestValue);
		
		runs(function() {
			animation.play(1000);
		});
		
		waits(500);
		
		runs(function() {
			var middle = highestValue / 2;
			var margin = highestValue / 10;
			var lowestMiddle = middle - margin;
			var highestMiddle = middle + margin;
			expect(target.property).toBeBetween(lowestMiddle, highestMiddle);
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(highestValue);
		});
	};
	
	it('animates property to 1', function() {
		testOneWayAnimation(1);
	});
	
	it('animates property to higher than 1', function() {
		testOneWayAnimation(2);
	});
	
	it('animates property to lower than 1', function() {
		testOneWayAnimation(0.5);
	});
	
	it('animates empty animation', function() {
		var animation = new Manymation();
		
		runs(function() {
			animation.play(500);
		});
		
		waits(1000);
		
		runs(function() {
			animation.rewind(500);
		});
		
		waits(1000);
	});
	
	it('animates constant animation', function() {
		testOneWayAnimation(0);
	});
	
	it('animates immediate animation', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		animation.play(0);
		expect(target.property).toBe(1)
		
		animation.rewind(0);
		expect(target.property).toBe(0);
	});
	
	it('animates property and then rewinds', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play(1000);
		});
		
		waits(500);
		
		runs(function() {
			expect(target.property).toBeBetween(0.4, 0.6);
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(1);
			animation.rewind(1000);
		});
		
		waits(500);
		
		runs(function() {
			expect(target.property).toBeBetween(0.4, 0.6);
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(0);
		});
	});
	
	it('stops animation in progress before rewinding', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play(1000);
		});
		
		waits(500);
		
		runs(function() {
			animation.rewind(1000);
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(0);
		});
	});
	
	it('only plays animation once', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play(1000);
			animation.play(1000);
		});
		
		waits(500);
		
		runs(function() {
			expect(target.property).toBeBetween(0.3, 0.7);
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(1);
		});
	});
	
	it('only rewinds animation once', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play(1000);
		});
		
		waits(1500);
		
		runs(function() {
			animation.rewind(1000);
		});
		
		waits(1500);
		
		runs(function() {
			expect(target.property).toBe(0);
			target.property = 1;
			animation.rewind(1000);
		});
		
		waits(500);
		
		runs(function() {
			expect(target.property).toBe(1);
		});
	});
	
	it('animates multiple objects', function() {
		var first = { property: undefined };
		var second = { property: undefined };
		
		runs(function() {
			var animation = new Manymation();
			animation.track(first, 'property', 1);
			animation.track(second, 'property', 1);
			animation.play(1000);
		});
		
		waits(500);
		
		runs(function() {
			expect(first.property).toBeBetween(0.4, 0.6);
			expect(second.property).toBeBetween(0.4, 0.6);
		});
		
		waits(1000);
		
		runs(function() {
			expect(first.property).toBe(1);
			expect(second.property).toBe(1);
		});
	});
	
	it('animates objects added while playing', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		
		runs(function() {
			animation.play(1000);
		});
		
		waits(250);
		
		runs(function() {
			animation.track(target, 'property', 1);
		});
		
		waits(250);
		
		runs(function() {
			expect(target.property).toBeBetween(0.4, 0.6);
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(1);
		});
	});
	
	it('animates objects added while rewinding', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		
		runs(function() {
			animation.play(1000);
		});
		
		waits(1500);
		
		runs(function() {
			animation.rewind(1000);
		});
		
		waits(250);
		
		runs(function() {
			animation.track(target, 'property', 1);
		});
		
		waits(250);
		
		runs(function() {
			expect(target.property).toBeBetween(0.4, 0.6);
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(0);
		});
	});
	
	it('sets starting value before start', function() {
		var target = { property: 2 };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		expect(target.property).toBe(0);
	});
	
	it('sets starting value during play', function() {
		var target = { property: 2 };
		var animation = new Manymation();
		
		runs(function() {
			animation.play(1000);
		});
		
		waits(500);
		
		runs(function() {
			animation.track(target, 'property', 1);
			expect(target.property).toBeBetween(0.40, 0.60);
		});
	});
	
	it('sets starting value after play', function() {
		var target = { property: 2 };
		var animation = new Manymation();
		
		runs(function() {
			animation.play(500);
		});
		
		waits(1000);
		
		runs(function() {
			animation.track(target, 'property', 1);
			expect(target.property).toBe(1);
		});
	});
	
	it('sets starting value during rewind', function() {
		var target = { property: 2 };
		var animation = new Manymation();
		
		runs(function() {
			animation.play(0);
			animation.rewind(1000);
		});
		
		waits(500);
		
		runs(function() {
			animation.track(target, 'property', 1);
			expect(target.property).toBeBetween(0.4, 0.6);
		});
	});
	
	it('sets starting value after rewind', function() {
		var target = { property: 2 };
		var animation = new Manymation();
		
		runs(function() {
			animation.play(0);
			animation.rewind(500);
		});
		
		waits(1000);
		
		runs(function() {
			animation.track(target, 'property', 1);
			expect(target.property).toBe(0);
		});
	});
	
	it('prevents value from being NaN', function() {
		expect(function() {
			var target = { property: undefined };
			var animation = new Manymation();
			animation.track(target, 'property', NaN);
			animation.play(0);
		}).toThrow();
	});
	
	it('allows different duration when rewinding', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play(0);
			animation.rewind(1000);
		});
		
		waits(500);
		
		runs(function() {
			expect(target.property).toBeBetween(0.4, 0.6);
		});
	});
	
	it('stops animation when playing', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play(1000);
		});
		
		waits(500);
		
		runs(function() {
			animation.stop();
		});
		
		waits(500);
		
		runs(function() {
			expect(target.property).toBeBetween(0.4, 0.6);
		});
	});
	
	it('stops animation when rewinding', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play(0);
			animation.rewind(1000);
		});
		
		waits(500);
		
		runs(function() {
			animation.stop();
		});
		
		waits(500);
		
		runs(function() {
			expect(target.property).toBeBetween(0.3, 0.7);
		});
	});
	
	it('does not play again once stopped', function() {
		var target = { property: undefined };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play(1000);
		});
		
		waits(500);
		
		runs(function() {
			animation.stop();
			animation.play(0);
			expect(target.property).toBeBetween(0.3, 0.7);
		});
	});
	
	it('signals end of rewind', function() {
		var onRewindEnded = function() {
			signaled = true;
		};
		var animation = new Manymation(onRewindEnded);
		var signaled = false;
		
		runs(function() {
			animation.play(500);
		});
		
		waits(1000);
		
		runs(function() {
			animation.rewind(500);
		});
		
		waits(1000);
		
		runs(function() {
			expect(signaled).toBe(true);
		});
	});
	
	it('signals end of immediate rewind', function() {
		var onRewindEnded = function() {
			signaled = true;
		};
		var animation = new Manymation(onRewindEnded);
		var signaled = false;
		
		animation.play(0);
		animation.rewind(0);
		expect(signaled).toBe(true);
	});
	
	it('signals rewinding state', function() {
		var animation = new Manymation();
		expect(animation.isRewinding).toBe(false);
		
		animation.play(0);
		expect(animation.isRewinding).toBe(false);
		
		runs(function() {
			animation.rewind(500);
		});
		
		waits(250);
		
		runs(function() {
			expect(animation.isRewinding).toBe(true);
		});
		
		waits(500);
		
		runs(function() {
			expect(animation.isRewinding).toBe(false);
		});
	});
});
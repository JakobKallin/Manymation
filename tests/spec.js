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
			expect(target.property).toBeBetween(0.4, 0.6);
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
	
	it('sets starting value immediately', function() {
		var target = { property: 2 };
		var animation = new Manymation();
		animation.track(target, 'property', 1);
		expect(target.property).toBe(0);
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
			animation.play(500);
		});
		
		waits(1000);
		
		runs(function() {
			animation.rewind(1000);
		});
		
		waits(500);
		
		runs(function() {
			expect(target.property).toBeBetween(0.4, 0.6);
		});
	});
});
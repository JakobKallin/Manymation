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
		var animation = new Manymation(1000);
		animation.track(target, 'property', highestValue);
		
		runs(function() {
			animation.play();
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
		var animation = new Manymation(0);
		animation.track(target, 'property', 1);
		animation.play();
		expect(target.property).toBe(1)
		
		animation.rewind();
		expect(target.property).toBe(0);
	});
	
	it('animates property and then rewinds', function() {
		var target = { property: undefined };
		var animation = new Manymation(1000);
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play();
		});
		
		waits(500);
		
		runs(function() {
			expect(target.property).toBeBetween(0.4, 0.6);
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(1);
			animation.rewind();
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
		var animation = new Manymation(1000);
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play();
		});
		
		waits(500);
		
		runs(function() {
			animation.rewind();
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(0);
		});
	});
	
	it('only plays animation once', function() {
		var target = { property: undefined };
		var animation = new Manymation(1000);
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play();
			animation.play();
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
		var animation = new Manymation(1000);
		animation.track(target, 'property', 1);
		
		runs(function() {
			animation.play();
		});
		
		waits(1500);
		
		runs(function() {
			animation.rewind();
		});
		
		waits(1500);
		
		runs(function() {
			expect(target.property).toBe(0);
			target.property = 1;
			animation.rewind();
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
			var animation = new Manymation(1000);
			animation.track(first, 'property', 1);
			animation.track(second, 'property', 1);
			animation.play();
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
		var animation = new Manymation(1000);
		
		runs(function() {
			animation.play();
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
		var animation = new Manymation(1000);
		
		runs(function() {
			animation.play();
		});
		
		waits(1500);
		
		runs(function() {
			animation.rewind();
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
});
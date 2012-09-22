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
		var animation = new Manymation(target, 'property', highestValue, 1000);
		
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
		var animation = new Manymation(target, 'property', 1, 0);
		animation.play();
		expect(target.property).toBe(1)
		
		animation.rewind();
		expect(target.property).toBe(0);
	});
	
	it('animates property and then rewinds', function() {
		var target = { property: undefined };
		var animation = new Manymation(target, 'property', 1, 1000);
		
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
		var animation = new Manymation(target, 'property', 1, 1000);
		
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
});
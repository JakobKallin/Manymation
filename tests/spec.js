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
			var lowestMiddle = middle - 0.1;
			var highestMiddle = middle + 0.1;
			expect(target.property).toBeBetween(lowestMiddle, highestMiddle);
		});
		
		waits(1000);
		
		runs(function() {
			expect(target.property).toBe(highestValue);
		});
	};
	
	it('animates property from 0 to 1', function() {
		testOneWayAnimation(1);
	});
	
	it('animates property from 0 to 1 and back again', function() {
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
	
	it('animates property to higher than 1', function() {
		testOneWayAnimation(2);
	});
});
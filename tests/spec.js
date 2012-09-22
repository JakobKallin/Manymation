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
	
	it('animates property from 0 to 1', function() {
		var target = { property: 0 };
		var animation = new Manymation(target, 'property');
		
		runs(function() {
			animation.start(1, 1000);
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
	
	it('animates property from 1 to 0', function() {
		var target = { property: 1 };
		var animation = new Manymation(target, 'property');
		
		runs(function() {
			animation.start(0, 1000);
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
});
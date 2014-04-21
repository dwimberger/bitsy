var createBitsy = require('../lib/createBitsy');

describe('bit getter', function(){
	it('has no side effects', function(){
		var b = createBitsy();
		expect(b.get(0)).toBe(false);
		expect(b.get(99999)).toBe(false);
		expect(b.length).toBe(0);
	});

	it('returns false for anything out of range', function(){
		var b = createBitsy();
		expect(b.get(0)).toBe(false);
		expect(b.get(99999)).toBe(false);
		expect(b.get(1e15)).toBe(false);
		expect(b.get(-1)).toBe(false);
	});

	it('returns true for set values', function(){
		var b = createBitsy(1);
		b.set(0, true);
		expect(b.get(0)).toBe(true);
	});

	it('returns false for unset values', function(){
		var b = createBitsy(1);
		b.set(0, true);
		b.set(0, false);
		expect(b.get(0)).toBe(false);
	});
});

describe('constructor', function(){
	it('can construct large bitsets', function(){
		var MEGABYTE_IN_BITS = 1048576 * 8;
		var bitsy = createBitsy(2 * MEGABYTE_IN_BITS);
		
		expect(bitsy.get(4)).toBe(false);
		bitsy.set(4, true);
		expect(bitsy.get(4)).toBe(true);

		expect(bitsy.get(1 * MEGABYTE_IN_BITS)).toBe(false);
		bitsy.set(1 * MEGABYTE_IN_BITS, true);
		expect(bitsy.get(1 * MEGABYTE_IN_BITS)).toBe(true);
	});
});

describe('copy', function(){
	it('shifts bits when copying', function(){
		var a = createBitsy(1000);
		a.set(100, true);

		var b = createBitsy(50);
		a.copyTo(b, 0, 80, 120);
		
		expect(b.get(20)).toBe(true);
	});
});

describe('bit setter', function(){
	it('handles truthy values as true', function(){
		[true, 1, 42, 'true', 'popcorn'].forEach(function(truthyValue){
			var b = createBitsy(1);
			b.set(0, truthyValue);
			expect(b.get(0)).toBe(true);
		});
	});

	it('setting a value twice has no adverse side-effect', function(){
		var b = createBitsy(1);
		b.set(0, true);
		b.set(0, true);
		expect(b.get(0)).toBe(true);

		var b = createBitsy(1);
		b.set(0, false);
		b.set(0, false);
		expect(b.get(0)).toBe(false);
	});

	it('handles falsy values as false', function(){
		[false, 0, '', null, undefined].forEach(function(falsyValue){
			var b = createBitsy(1);
			b.set(0, true);
			expect(b.get(0)).toBe(true);

			b.set(0, falsyValue);
			expect(b.get(0)).toBe(false);
		});
	});

	it('can set and unset many bits', function(){
		var b = createBitsy(1000);
		var c = 1000;
		while(c--){
			b.set(c, true);
			if(b.get(c) !== true){
				expect(b.get(c)).toBe(true);
				return;
			}
		}

		var c = 1000;
		while(c--){
			b.set(c, false);
			if(b.get(c) !== false){
				expect(b.get(c)).toBe(false);
				break;
			}
		}
	});

	it('can set bits as a sparse map', function(){
		var b = createBitsy(60000);
		var bitIndices = [2, 56000, 400];
		var search = 60000; // exceed the largest set bit index

		var index;
		while(index = bitIndices.pop()){
			b.set(index, true);
			expect(b.get(index)).toBe(true);
		}

		var setBitCount = 0;
		while(search--){
			if(b.get(search)) setBitCount++;
		}

		expect(setBitCount).toBe(3); // because we set 3 indices.
	});
});

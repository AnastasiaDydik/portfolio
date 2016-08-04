var expectedBt = {
	root: {
		data: 13,
		left: {
			data: 10,
			left: {
				data: 8,
				left: {
					data: 6,
					left: null,
					right: {
						data: 7,
						left: null,
						right: null
					}
				},
				right: null
			},
			right: {
				data: 12,
				left: {
					data: 11,
					left: null,
					right: null
				},
				right: null
			}
		},
		right: {
			data: 18,
			left: {
				data: 15,
				left: null,
				right: null
			},
			right: {
				data: 20,
				left: null,
				right: null
			}
		}
	}
};

describe('BinaryTree', () => {
	describe('#constructor', () => {
		it('assigns null to root', () => {
			var bt = new BinaryTree();

			expect(bt.root).to.equal(null);
		});
	});

	describe('#insert(data)', () => {
		var bt;

		beforeEach(() => {
			bt = new BinaryTree();

			bt.insert(13);
			bt.insert(10);
			bt.insert(8);
			bt.insert(18);
			bt.insert(12);
			bt.insert(11);
			bt.insert(15);
			bt.insert(6);
			bt.insert(20);
			bt.insert(7);
		});

		it('creates new node with passed data and inserts it to correct place', () => {
			bt.root.data.should.equal(13);
			bt.root.left.data.should.equal(10);
			bt.root.right.data.should.equal(18);
			bt.root.left.left.data.should.equal(8);
			bt.root.left.right.data.should.equal(12);
			bt.root.right.left.data.should.equal(15);
			bt.root.right.right.data.should.equal(20);
			bt.root.left.left.left.data.should.equal(6);
			bt.root.left.left.left.right.data.should.equal(7);
			bt.root.left.right.left.data.should.equal(11);
		});
	});

	describe('#contains(data)', () => {
		var bt;

		beforeEach(() => {
			bt = new BinaryTree();

			bt.insert(13);
			bt.insert(10);
			bt.insert(8);
			bt.insert(18);
			bt.insert(12);
			bt.insert(11);
			bt.insert(15);
			bt.insert(6);
			bt.insert(20);
			bt.insert(7);
		});

		it('returns true if passed data found in binary tree, otherwise if not', () => {
			bt.contains(3).should.equal(false);
			bt.contains(9).should.equal(false);
			bt.contains(16).should.equal(false);

			bt.contains(18).should.equal(true);
			bt.contains(13).should.equal(true);
			bt.contains(7).should.equal(true);
			bt.contains(20).should.equal(true);
		});
	});

	describe('#remove(data)', () => {
		var bt;
		var btCopy;

		beforeEach(() => {
			bt = new BinaryTree();

			bt.insert(13);
			bt.insert(10);
			bt.insert(8);
			bt.insert(18);
			bt.insert(12);
			bt.insert(11);
			bt.insert(15);
			bt.insert(6);
			bt.insert(20);
			bt.insert(7);

			btCopy = JSON.parse(JSON.stringify(expectedBt));
		});

		it('does nothing if passed data not found', () => {
			sinon.spy(bt, 'contains');

			bt.remove(9);
			bt.should.deep.equal(btCopy);
		});

		it('removes node which contains passed data', () => {
			sinon.spy(bt, 'contains');

			bt.remove(15);
			btCopy.root.right.left = null;

			bt.should.deep.equal(btCopy);

			bt.remove(8);
			btCopy.root.left.left = btCopy.root.left.left.left;

			bt.should.deep.equal(btCopy);
		});
	});

	describe('#size()', () => {
		it('returns number of elements in tree', () => {
			var bt = new BinaryTree();

			bt.size().should.equal(0);

			bt.insert(13);
			bt.insert(10);
			bt.insert(8);
			bt.insert(18);
			bt.insert(12);
			bt.insert(11);
			bt.insert(15);
			bt.insert(6);
			bt.insert(20);
			bt.insert(7);

			bt.size().should.equal(10);

			bt.remove(8);
			bt.remove(18);
			bt.remove(20);

			bt.size().should.equal(7);
		});
	});

	describe('#isEmpty()', () => {
		it('returns true if tree is empty, false if not', () => {
			var bt = new BinaryTree();
			bt.isEmpty().should.equal(true);

			bt.insert(5);
			bt.isEmpty().should.equal(false);

			bt.remove(5);
			bt.isEmpty().should.equal(true);
		});
	});
});

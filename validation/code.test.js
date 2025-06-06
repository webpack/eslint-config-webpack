describe("name", () => {
	it("test #1", () => {
		const data = { type: "coords", x: 1, y: 2 };
		const { type, ...coords } = data;

		expect(type).toBe(data.type);
		expect(coords.x).toBe(data.x);
	});

	it("test #2", () => {
		// object rest no-unused-vars ignoreRestSiblings
		const data = { type: "coords", x: 1, y: 2 };
		const { type, ...coords } = data;

		expect(data.type).toBe(type);
		expect(data.y).toBe(coords.y);
	});
});

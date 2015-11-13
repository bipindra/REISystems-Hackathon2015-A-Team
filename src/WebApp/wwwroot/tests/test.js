function helloWorld() {
    throw Error();
    return "Hello asdf world!";
}

describe("Hello world", function () {
    it("says hello", function () {
        expect(helloWorld()).toEqual("Hellox world!");
    });
});


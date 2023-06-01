import { RgbPixel } from "../src/index";
import { resizePixelArray } from "../src/resizePixelArray";

describe("resizePixelArray()", () => {
    it("returns new array with same length when ratio is >= 1", () => {
        const source: RgbPixel[] = new Array(100).fill([0, 0, 0]);

        const resultA = resizePixelArray(source, 1);
        const resultB = resizePixelArray(source, 100);

        expect(resultA.length).toEqual(source.length);
        expect(resultB.length).toEqual(source.length);
    });

    it("returns new array with same length when ratio is <= 0", () => {
        const source: RgbPixel[] = new Array(100).fill([0, 0, 0]);

        const resultA = resizePixelArray(source, 0);
        const resultB = resizePixelArray(source, -1);

        expect(resultA.length).toEqual(source.length);
        expect(resultB.length).toEqual(source.length);
    });

    it("returns new array with length equal to Math.ceil(source.length * ratio)", () => {
        const sourceA: RgbPixel[] = new Array(10).fill([0, 0, 0]);
        const sourceB: RgbPixel[] = new Array(7729).fill([0, 0, 0]);

        const resultA = resizePixelArray(sourceA, 0.5);
        const resultB = resizePixelArray(sourceA, 0.25);
        const resultC = resizePixelArray(sourceA, 0.00001);
        const resultD = resizePixelArray(sourceB, 0.98);
        const resultE = resizePixelArray(sourceB, 0.7);
        const resultF = resizePixelArray(sourceB, 0.01);

        expect(resultA.length).toEqual(Math.ceil(sourceA.length * 0.5));
        expect(resultB.length).toEqual(Math.ceil(sourceA.length * 0.25));
        expect(resultC.length).toEqual(Math.ceil(sourceA.length * 0.00001));
        expect(resultD.length).toEqual(Math.ceil(sourceB.length * 0.98));
        expect(resultE.length).toEqual(Math.ceil(sourceB.length * 0.7));
        expect(resultF.length).toEqual(Math.ceil(sourceB.length * 0.01));
    });
});

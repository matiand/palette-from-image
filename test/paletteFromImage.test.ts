import { RgbPixel } from "../src";
import { toHex } from "../src/converters";

describe("toHex()", function () {
    it("converts given pixel to hex format", () => {
        const pixelA = [0, 0, 0];
        const pixelB = [255, 255, 255];
        const pixelC = [146, 241, 72];

        const resultA = toHex(pixelA as RgbPixel);
        const resultB = toHex(pixelB as RgbPixel);
        const resultC = toHex(pixelC as RgbPixel);

        expect(resultA).toEqual("#000000");
        expect(resultB).toEqual("#ffffff");
        expect(resultC).toEqual("#92f148");
    });

    it("handles pixels with floating values correctly", () => {
        const pixelA = [146.2252, 241.987, 72.01];
        const pixelB = [252.87, 246.67, 177.22];
        const pixelC = [45.8111, 30.92, 47.32];

        const resultA = toHex(pixelA as RgbPixel);
        const resultB = toHex(pixelB as RgbPixel);
        const resultC = toHex(pixelC as RgbPixel);

        expect(resultA).toEqual("#92f248");
        expect(resultB).toEqual("#fdf7b1");
        expect(resultC).toEqual("#2e1f2f");
    });
});

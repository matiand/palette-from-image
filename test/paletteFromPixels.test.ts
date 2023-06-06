import { paletteFromPixels } from "../src/paletteFromPixels";

const getPixels = (size: number) => new Array(size).fill([255, 255, 255]);

describe("paletteFromPixels()", () => {
    it("returns null when colorCount is 0", () => {
        const result = paletteFromPixels(getPixels(100), {
            colorCount: 0,
            strategy: "kmeans",
        });

        expect(result).toBeNull();
    });

    it("returns null when colorCount is < 4", () => {
        const result1 = paletteFromPixels(getPixels(100), {
            colorCount: 1,
            strategy: "kmeans",
        });
        const result2 = paletteFromPixels(getPixels(100), {
            colorCount: 2,
            strategy: "quantize",
        });
        const result3 = paletteFromPixels(getPixels(100), {
            colorCount: 3,
            strategy: "quantize",
        });

        expect(result1).toBeNull();
        expect(result2).toBeNull();
        expect(result3).toBeNull();
    });

    it("returns palette with specified color count when colorCount is >= 4", () => {
        const resultA = paletteFromPixels(getPixels(100), {
            colorCount: 4,
            strategy: "kmeans",
        });
        const resultB = paletteFromPixels(getPixels(100), {
            colorCount: 7,
            strategy: "kmeans",
        });
        // quantize algorithm is unpredictable with the returned color
        // count, so we test it very thoroughly
        const quantizeResults = [4, 5, 6, 7, 8, 10, 12, 15, 25].map((colorCount) => ({
            result: paletteFromPixels(getPixels(100), {
                colorCount,
                strategy: "quantize",
            }),
            expectedLen: colorCount,
        }));

        expect(resultA?.colors).toHaveLength(4);
        expect(resultB?.colors).toHaveLength(7);

        for (const { result, expectedLen } of quantizeResults) {
            expect(result?.colors).toHaveLength(expectedLen);
        }
    });

    describe("options.pixelRatio", () => {
        it("decreases the number of pixels used for generating the palette", () => {
            const resultA = paletteFromPixels(getPixels(8000), {
                pixelRatio: 0.9,
                colorCount: 4,
                strategy: "kmeans",
            });
            const resultB = paletteFromPixels(getPixels(40), {
                pixelRatio: 0.2,
                colorCount: 4,
                strategy: "kmeans",
            });

            expect(resultA?.usedPixels).toHaveLength(8000 * 0.9);
            expect(resultB?.usedPixels).toHaveLength(40 * 0.2);
        });

        it("uses ratio of 0.5 by default", () => {
            const result = paletteFromPixels(getPixels(8000), {
                colorCount: 4,
                strategy: "kmeans",
            });

            expect(result?.usedPixels).toHaveLength(8000 * 0.5);
        });

        it("uses ratio of 1 when it's out of range", () => {
            const resultA = paletteFromPixels(getPixels(8000), {
                pixelRatio: 0,
                colorCount: 4,
                strategy: "kmeans",
            });
            const resultB = paletteFromPixels(getPixels(8000), {
                pixelRatio: 2,
                colorCount: 4,
                strategy: "kmeans",
            });

            expect(resultA?.usedPixels).toHaveLength(8000);
            expect(resultB?.usedPixels).toHaveLength(8000);
        });
    });
});

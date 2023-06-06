import { paletteFromImage } from "../src/paletteFromImage";

describe("paletteFromImage()", () => {
    describe("options.colorCount", () => {
        it("returns null when colorCount is 0", () => {
            const image = document.createElement("img");
            vi.spyOn(image, "naturalWidth", "get").mockReturnValue(100);
            vi.spyOn(image, "naturalHeight", "get").mockReturnValue(100);

            const result = paletteFromImage(image, {
                colorCount: 0,
                strategy: "kmeans",
            });

            expect(result).toBeNull();
        });

        it("returns null when colorCount is < 4", () => {
            const image = document.createElement("img");
            vi.spyOn(image, "naturalWidth", "get").mockReturnValue(100);
            vi.spyOn(image, "naturalHeight", "get").mockReturnValue(100);

            const result1 = paletteFromImage(image, {
                colorCount: 1,
                strategy: "kmeans",
            });
            const result2 = paletteFromImage(image, {
                colorCount: 2,
                strategy: "quantize",
            });
            const result3 = paletteFromImage(image, {
                colorCount: 3,
                strategy: "quantize",
            });

            expect(result1).toBeNull();
            expect(result2).toBeNull();
            expect(result3).toBeNull();
        });

        it("returns palette with specified color count when colorCount is >= 4", () => {
            const image = document.createElement("img");
            vi.spyOn(image, "naturalWidth", "get").mockReturnValue(100);
            vi.spyOn(image, "naturalHeight", "get").mockReturnValue(100);

            const resultA = paletteFromImage(image, {
                colorCount: 4,
                strategy: "kmeans",
            });
            const resultB = paletteFromImage(image, {
                colorCount: 7,
                strategy: "kmeans",
            });
            // quantize algorithm is unpredictable with the returned color
            // count, so we test it very thoroughly
            const quantizeResults = [4, 5, 6, 7, 8, 10, 12, 15, 25].map((colorCount) => ({
                result: paletteFromImage(image, { colorCount, strategy: "quantize" }),
                expectedLen: colorCount,
            }));

            expect(resultA?.colors).toHaveLength(4);
            expect(resultB?.colors).toHaveLength(7);

            for (const { result, expectedLen } of quantizeResults) {
                expect(result?.colors).toHaveLength(expectedLen);
            }
        });
    });

    describe("options.imageRegion", () => {
        it("uses whole image when it's not specified", () => {
            const image = document.createElement("img");
            vi.spyOn(image, "naturalWidth", "get").mockReturnValue(100);
            vi.spyOn(image, "naturalHeight", "get").mockReturnValue(100);

            const result = paletteFromImage(image, {
                colorCount: 4,
                strategy: "kmeans",
                pixelRatio: 1,
            });

            expect(result?.usedPixels).toHaveLength(100 * 100);
        });

        it("uses pixels from that region only when it's specififed", () => {
            const image = document.createElement("img");
            vi.spyOn(image, "naturalWidth", "get").mockReturnValue(100);
            vi.spyOn(image, "naturalHeight", "get").mockReturnValue(100);

            const result = paletteFromImage(image, {
                colorCount: 4,
                strategy: "kmeans",
                pixelRatio: 1,
                imageRegion: [50, 50, 20, 20],
            });

            expect(result?.usedPixels).toHaveLength(20 * 20);
        });
    });
});

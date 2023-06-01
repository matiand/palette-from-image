declare module "quantize" {
    type RgbPixel = [number, number, number];

    type ColorMap = {
        palette: () => RgbPixel[] | false;
        size: () => number;
        map: (pixel: RgbPixel) => RgbPixel;
    };

    type Quantize = (pixels: RgbPixel[], colorCount: number) => ColorMap;

    const quantize: Quantize;

    export default quantize;
}

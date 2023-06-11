# palette-from-image

`palette-from-image` is a TypeScript library that provides a simple way to generate color palettes from images.

## Installation

To use `palette-from-image` in your project, you can install it via npm:

```
npm i palette-from-image
```

## Usage

### Generating a Palette from an image (Vanilla)

The `paletteFromImage` function generates a color palette from an HTML image element. Here's an example of how to use it:

```typescript
import { paletteFromImage } from "palette-from-image";

const image = document.querySelector("img");
const palette = paletteFromImage(image, {
    colorCount: 6,
    strategy: "quantize",
    pixelRatio: 0.8,
});

if (palette) {
    // Do something with the palette colors
    const paletteInHex = palette?.colors.map((color) => color.toHex());
}
```

### Generating a Palette from an image (React)

```typescript
import { paletteFromImage } from "palette-from-image";

const Component() {
    const imageRef = useRef<HTMLImageElement>(null);

    const onImageLoad = () => {
        const palette = paletteFromImage(imageRef.current, {
            colorCount: 8,
            strategy: "kmeans",
            pixelRatio: 0.008,
        });

        // Do something with the palette colors
        const paletteInHsl = palette?.colors.map((color) => color.toHslString());
    }

    return <img ref={imageRef} onLoad={onImageLoad} src="..."/>
}

```

### Generating a Palette from pixels

The `paletteFromPixels` function generates a color palette from an array of RGB pixels. Here's an example of how to use it:

```typescript
import { paletteFromPixels, RgbPixel } from "palette-from-image";

const pixels: RgbPixel[];
const palette = paletteFromPixels(pixels, {
    colorCount: 4,
    strategy: "quantize",
});
```

## Things to watch out for

### Getting a dominant color

This library doesn't provide an actual way to get the dominant color of an image. However, the
returned palette orders the colors by the sum of their `brightness` and `value` (using HSV color
space). This results in the most eye-catching colors being at the top of the palette.

```typescript
const palette = paletteFromPixels(pixels, options);
const dominantColor = palette?.colors
    // Drop colors that are too dark or too "boring"
    .filter((color) => {
        const { s, v } = color.toHsv();

        // You should experiment with these values
        return s > 0.2 && v > 0.2;
    })[0];
```

### Using the right strategy

The `strategy` option determines the algorithm that will be used to generate the palette. There are
two options: `kmeans` uses k-means clustering, while `quantize` uses median cut color quantization.

`quantize` is faster, but `kmeans` is more accurate. You should test both and see which one works best for your use case.

### The palette colors type

The returned `colors` of the palette are instances of the [colord](https://github.com/omgovich/colord)
library. This allows you to easily convert the colors to different formats (e.g. hex, rgb, hsl,
etc.) and perform operations on them. See the [colord api](https://github.com/omgovich/colord#api)
for details.

### Making sure the image is loaded

When using the `paletteFromImage` method, you should always make sure the image is loaded before generating a palette from it.

Either use the `complete` property or the `load` event to check if the image is loaded.

```typescript
if (image.complete) {
    // Ready to generate the palette
} else {
    image.addEventListener("load", function () {
        // Ready to generate the palette
    });
}
```

### Dealing with CORS Errors

If you see this error: _The canvas has been tainted by cross-origin data_, it means that the image
you are trying to generate a palette from is not hosted on the same domain as your website. To deal
with this issue you have to:

1. Configure your server's CORS policy to allow requests from your website (`access-control-allow-origin`).
2. Add the `crossorigin` attribute to your image element.

```
<img src="..." crossorigin="anonymous" />
```

If you don't have access to the server, you can either use a proxy to fetch the image or generate the palette from pixels in backend.

### Generating a palette from region of an image

When using the `paletteFromImage` method, you can pass an `imageRegion` option to generate a palette from a specific region of the image.

A region is defined as an array of `[x, y, width, height]` values.

This example show how to generate a palette from the top left quarter of an image:

```typescript
const regionWidth = image.naturalWidth / 2;
const regionHeight = image.naturalHeight / 2;

const palette = paletteFromImage(image, {
    colorCount: 8,
    strategy: "quantize",
    imageRegion: [0, 0, regionWidth, regionHeight],
});
```

## License

`palette-from-image` is released under the MIT License. See the [LICENSE](./LICENSE) file for more details.

// ------------
// sharp
// ------------

// install
`
npm i --save sharp
`;

// IMPORTANT -- architecture/platform of Node.js used for install must be the same as runtime

// docs
// https://sharp.pixelplumbing.com/api-constructor

// ------------
// basic use
// ------------

// promise returned when callback not provided
// .toFile(fn, (err, info) => {})
// .toFile(fn).then(info => {}).catch(err => {})

// import
const sharp = require("sharp");
// filenames
const fnInput = "./files/input.jpg";
const fnOutput = "./files/output.jpg";
// async await & .catch
const info = await sharp(fnInput)
  .resize(300)
  .toFile(fnOutput)
  .catch((err) => console.log(err));
console.log(info);
// async await & try catch
try {
  const info = await sharp(fnInput).resize(300).toFile(fnOutput);
  console.log(info); //
} catch (err) {
  console.log(err);
}

// ------------
// metadata
// ------------

// metadata properties -- format, size, width, height, exif, etc

// import
const sharp = require("sharp");
// filenames
const fnInput = "./files/input.jpg";
const fnOutput = "./files/output.jpg";
// read image
const image = sharp(fnInput);
// get metadata
const metadata = await image.metadata().catch((err) => console.log(err));
// use metadata during processing
const info = await image
  .resize(Math.round(metadata.width / 2)) // resize
  .toFile(fnOutput)
  .catch((err) => console.log(err));
console.log(info);

// ------------
// stats
// ------------

// stats properties -- channels (array of channel statistics objects), isOpaque, entropy
// channels properties -- min, max, sum, squareSum, mean, stdev, minX, minY, maxX, maxY

// import
const sharp = require("sharp");
// filenames
const fnInput = "./files/input.jpg";
// read image
const image = sharp(fnInput);
// get stats
const stats = await image.stats().catch((err) => console.log(err));
console.log(stats);

// ------------
// output options
// ------------

// toFile
// supported: jpeg, png, webp, tiff, dzi, v (libvips format)
// if format not set, it will be inferred from the extension
// metadata will be removed (unless 'withMetadata')
// toBuffer
// write output to a buffer
// supported: jpeg, png, webp, tiff, and raw
// if format not set, it will be inferred from input type (except SVG and GIF --> PNG)
//
// withMetadata
// metadata will NOT be removed for output.
// tile
// tile-based deep zoom (image pyramid) output.
// set format explicitly, use `.zip` or `.szi` output extenxion

// import
const sharp = require("sharp");
// filenames
const fnInput = "./files/input.jpg";
const fnOutput = "./files/output.jpg";
// read image
const image = sharp(fnInput);
// process image
const info = await image
  .resize(500)
  .withMetaData()
  .jpeg() // set format // jpeg, png, webp, tiff, etc
  .toFile(fnOutput)
  .catch((err) => console.log(err));
console.log(info);

// toBuffer

// https://sharp.pixelplumbing.com/api-output

// ------------
// resize
// ------------

// import
const sharp = require("sharp");
// filenames
const fnInput = "./files/input.jpg";
const fnOutput = "./files/output.jpg";
// read image
const image = sharp(fnInput);
// process image
const info = await image
  .resize({
    width: 200,
    height: 200,
    fit: "cover", // cover, contain, fill, inside, outside
  })
  .toFile(fnOutput)
  .catch((err) => console.log(err));
console.log(info);

// ------------
// extend
// ------------

// https://sharp.pixelplumbing.com/api-resize#extend

// ------------
// extract
// ------------

// https://sharp.pixelplumbing.com/api-resize#extract

// ------------
// image operations
// ------------

// import
const sharp = require("sharp");
// filenames
const fnInput = "./files/input.jpg";
const fnOutput = "./files/output.jpg";
// read image
const image = sharp(fnInput);
// process image
const info = await image
  .rotate(90) // rotate (in degrees)
  .flip() // flip about the vertical y-axis (always occurs after rotation) (removes EXIF orientation)
  .flop() // flop about the horizontal x-axis (... after rotation) (removes EXIF orientation)
  .sharpen() // fast, mild sharpen (if no params). params: sigma, flat, jagged
  .median(3) // applies median filter. params: size (default: 3x3)
  .blur() // fast, mild blur (if no params). params: sigma
  .flatten() // merge alpha transparency channel, if any, with a background
  .gamma() // gamma correction. params: gamma (value between 1.0 and 3.0, default 2.2)
  .negate() // produce negative of image
  .normalise() // enhance output image contrast by stretching its luminance to cover the full dynamic range
  .convolve({ width: 3, height: 3, kernel: [0, 0, 0, 0, 1, 0, 0, 0, 0] }) // convolve with specified kernel
  .threshold(128) // x >= threshold ? white : black
  .linear(1.0, 0.0) // transformation like `a*x + b`
  .modulate({
    brightness: 2, // increase lightness by a factor of 2
    hue: 180, // hue-rotate by 180 degrees
    saturation: 0.5, // decrease saturation by a factor of .5
  })
  .toFile(fnOutput)
  .catch((err) => console.log(err));
console.log(info);

// ------------
// colour manipulation
// ------------

// https://sharp.pixelplumbing.com/api-colour

// ------------
// channel manipulation
// ------------

// https://sharp.pixelplumbing.com/api-channel

// ------------
// examples in docs
// ------------

// import
const sharp = require("sharp");
// use callback
sharp(inputBuffer)
  .resize(320, 240)
  .toFile("output.webp", (err, info) => console.log(err, info));

// use promise
sharp("input.jpg")
  .rotate()
  .resize(200)
  .toBuffer()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

// use async await
const semiTransparentRedPng = await sharp({
  create: {
    width: 48,
    height: 48,
    channels: 4,
    background: { r: 255, g: 0, b: 0, alpha: 0.5 },
  },
})
  .png()
  .toBuffer();

// pipe stream
const roundedCorners = Buffer.from(
  '<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50"/></svg>'
);

const roundedCornerResizer = sharp()
  .resize(200, 200)
  .composite([
    {
      input: roundedCorners,
      blend: "dest-in",
    },
  ])
  .png();

readableStream.pipe(roundedCornerResizer).pipe(writableStream);

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

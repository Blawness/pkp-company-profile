import fs from "node:fs/promises";
import path from "node:path";
import { Jimp } from "jimp";
import pngToIco from "png-to-ico";

async function main() {
  const input = path.join(process.cwd(), "public", "logo.png");
  const squareOut = path.join(process.cwd(), "public", "logo-square.png");
  const output = path.join(process.cwd(), "app", "favicon.ico");

  const image = await Jimp.read(input);
  const size = Math.max(image.bitmap.width, image.bitmap.height);

  // White background (opaque) to avoid transparent favicon artifacts.
  const canvas = new Jimp({ width: size, height: size, color: 0xffffffff });
  const x = Math.floor((size - image.bitmap.width) / 2);
  const y = Math.floor((size - image.bitmap.height) / 2);
  canvas.composite(image, x, y);

  // Save the square PNG (useful for inspection), then convert to ICO.
  await canvas.write(squareOut);
  const pngSquare = await fs.readFile(squareOut);
  const ico = await pngToIco(pngSquare);
  await fs.writeFile(output, ico);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



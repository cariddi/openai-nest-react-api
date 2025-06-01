import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  returnFullPath: boolean | undefined = false,
) => {
  // Remove header
  base64Image = base64Image.split(';base64,').pop()!;
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;
  const fullPath = path.join(folderPath, imageNamePng);

  // Transform to RGBA, png // OpenAI expected format
  await sharp(imageBuffer).png().ensureAlpha().toFile(fullPath);

  return returnFullPath ? fullPath : imageNamePng;
};

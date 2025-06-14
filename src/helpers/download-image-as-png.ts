import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export const downloadImageAsPng = async (
  url: string,
  returnFullPath: boolean | undefined = false,
) => {
  const response = await fetch(url);

  if (!response.ok)
    throw new InternalServerErrorException('Download image was not possible');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  const fullPath = path.join(folderPath, imageNamePng);
  await sharp(buffer).png().ensureAlpha().toFile(fullPath);

  return returnFullPath ? fullPath : imageNamePng;
};

// src/common/pipes/audio-file-validation.pipe.ts

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes = [
      // Raster Image MIME Types
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/tiff',
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/heic',
      'image/heif',

      // Vector Image MIME Types
      'image/svg+xml',
      'image/emf',
      'image/wmf',
      'image/x-wmf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported image format: ${file.mimetype}`,
      );
    }

    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      throw new BadRequestException('File is bigger than 5MB');
    }

    return file;
  }
}

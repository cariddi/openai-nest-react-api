import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import OpenAI from 'openai';
import * as path from 'path';
import {
  ExtractTextFromImageDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import { AudtioToTextDto } from './dtos/audio-to-text.dto';
import { ProsConsDiscusserDto } from './dtos/pros-cons-dicusser.dto';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageToTextUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck({ prompt }: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, {
      prompt,
    });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, {
      prompt,
    });
  }

  async translateText({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt,
      lang,
    });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {
      prompt,
      voice,
    });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filePath);

    if (!wasFound) throw new NotFoundException(`File ${filePath} not found`);

    return filePath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audtioToTextDto: AudtioToTextDto,
  ) {
    const { prompt, lang } = audtioToTextDto;

    return await audioToTextUseCase(this.openai, {
      audioFile,
      prompt,
      lang,
    });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, {
      ...imageGenerationDto,
    });
  }

  async textToImageGetter(imageName: string) {
    const imagePath = path.resolve(
      __dirname,
      '../../generated/images',
      `${imageName}`,
    );

    const wasFound = fs.existsSync(imagePath);

    if (!wasFound) throw new NotFoundException(`Image ${imagePath} not found`);

    return imagePath;
  }

  async imageVariation(imageVariationDto: ImageVariationDto) {
    return await imageVariationUseCase(this.openai, {
      ...imageVariationDto,
    });
  }

  async imageToText(
    imageFile: Express.Multer.File,
    extractTextFromImageDto: ExtractTextFromImageDto,
  ) {
    const { prompt } = extractTextFromImageDto;

    return await imageToTextUseCase(this.openai, {
      imageFile,
      prompt,
    });
  }
}

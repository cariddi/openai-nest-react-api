import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import OpenAI from 'openai';
import * as path from 'path';
import { OrthographyDto, TextToAudioDto, TranslateDto } from './dtos';
import { AudtioToTextDto } from './dtos/audioToText.dto';
import { ProsConsDiscusserDto } from './dtos/prosConsDicusser.dto';
import {
  audioToTextUseCase,
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
    const { prompt } = audtioToTextDto;

    return await audioToTextUseCase(this.openai, {
      audioFile,
      prompt,
    });
  }
}

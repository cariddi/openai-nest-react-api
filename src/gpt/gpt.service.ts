import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OrthographyDto } from './dtos';
import { ProsConsDiscusserDto } from './dtos/prosConsDicusser.dto';
import { prosConsDicusserUseCase } from './use-cases';
import { orthographyCheckUseCase } from './use-cases/orthography.use.case';
import { prosConsDicusserStreamUseCase } from './use-cases/pros-cons-discusser.stream.use.case';

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
}

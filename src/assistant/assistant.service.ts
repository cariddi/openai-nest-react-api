import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { QuestionDto } from './dto/question.dto';
import { createMessageUseCase } from './use-cases';
import { createThreadUseCase } from './use-cases/create-thread.use.case';

@Injectable()
export class AssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion({ threadId, question }: QuestionDto) {
    const message = await createMessageUseCase(this.openai, {
      threadId,
      question,
    });
    console.log({ message });

    return message;
  }
}

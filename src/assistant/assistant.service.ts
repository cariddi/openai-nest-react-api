import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import OpenAI from 'openai';
import * as path from 'path';
import { QuestionDto } from './dto/question.dto';
import { createMessageUseCase, createRunUseCase } from './use-cases';
import { createThreadUseCase } from './use-cases/create-thread.use.case';

@Injectable()
export class AssistantService {
  private readonly openai: OpenAI;
  private assistantId: string | null = null;
  private readonly filePath = path.resolve(
    __dirname,
    '../../files/Samsung-terms-eng.pdf',
  );

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }

  async onModuleInit() {
    await this.initializeAssistant();
  }

  private async initializeAssistant() {
    if (this.assistantId) return;

    // 1. Upload file to OpenAI
    const fileReadStreamForUpload = fs.createReadStream(this.filePath);
    const file = await this.openai.files.create({
      file: fileReadStreamForUpload,
      purpose: 'assistants',
    });
    const fileId = file.id;

    // 2. Create vector store
    const vectorStore = await this.openai.vectorStores.create({
      name: 'My Vector Store',
    });
    const vectorStoreId = vectorStore.id;

    // 3. Upload file to vector store (new stream)
    const fileReadStreamForVectorStore = fs.createReadStream(this.filePath);
    await this.openai.vectorStores.fileBatches.uploadAndPoll(vectorStoreId, {
      fileIds: [fileId],
      files: [fileReadStreamForVectorStore],
    });

    // 4. Create assistant
    const assistant = await this.openai.beta.assistants.create({
      model: 'gpt-4-1106-preview',
      name: 'Sam - Terms and Conditions Lawyer',
      instructions: `
        Your name is Sam, a lawyer for an online store.
        Your job is to answer questions about the use of the site based on its terms and conditions of use, which I will provide to you.
        Always be polite and courteous.
        Please include the titles of the terms in your responses, if possible.
        If you don't know the answer, you can escalate the case to: "Lucas Cariddi cariddilucas@gmail.com" or the support number +1.800.123.3212.
        Prompts should be cordial greetings.
        Responses should be short, simulating chat messages.
        Ask for the person's name to address them more personally.
        If you know the person's name, please write it down.
      `,
      tools: [{ type: 'file_search' }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStoreId],
        },
      },
    });

    this.assistantId = assistant.id;
  }

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion({ threadId, question }: QuestionDto) {
    const message = await createMessageUseCase(this.openai, {
      threadId,
      question,
    });

    const run = await createRunUseCase(this.openai, {
      threadId,
      assistantId: this.assistantId!,
    });

    console.log({ run, message });
  }
}

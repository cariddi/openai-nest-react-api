import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId: assistant_id } = options;

  if (!assistant_id) {
    console.log('assistant not found');
    return;
  }

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id,
  });

  return run;
};

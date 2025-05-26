import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDicusserStreamUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  return await openai.chat.completions.create({
    stream: true,
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `
          You will be asked questions and your task is to answer with pros and cons.
          You must respond in markdown format.

          Pros and cons should be listed in bullet points.
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_completion_tokens: 500,
  });
};

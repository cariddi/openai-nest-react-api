import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDicusserUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const stream = await openai.chat.completions.create({
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
        content: prompt, // `Give me a list of pros and cons for: ${prompt}. Format it clearly.`,
      },
    ],
    temperature: 0.8,
    max_completion_tokens: 500,
  });

  return stream.choices[0].message;
};

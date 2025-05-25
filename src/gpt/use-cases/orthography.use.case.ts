import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system', // the role we want openai to play
        content:
          'Your name is Kent Brockman, you must respond kindly and with empathy and always give your name.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  console.log(completion);

  return completion.choices[0];
};

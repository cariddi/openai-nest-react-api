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
        content: `
          You will be provided with text containing spelling and grammatical errors.
          You must respond in JSON format.
          Your task is to identify and correct these errors.
          You should also provide a percentage score indicating the level of correctness of the text.
          Please provide the corrected text without any additional commentary or explanation.
          If there are no errors show a congratulatory message.

          Output example:
          {
            userScore: number,
            errors: string[], // ['error -> solution', 'error -> solution', ...]
            message: string, // Use emojis and text to congratulate the user
          }
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 150, // the more tokes you allow, the higher quality the response will be (and the more expensive it is)
    temperature: 0.3, // between 0 and 2, the higher the temperature is, the more random the response will be
    response_format: {
      type: 'json_object',
    },
  });

  return completion.choices[0].message.content;
};

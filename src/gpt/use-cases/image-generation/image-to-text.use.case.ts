import OpenAI from 'openai';
import { convertFileToBase64 } from '../../../helpers';

interface Options {
  prompt?: string;
  imageFile: Express.Multer.File;
}

export const imageToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, imageFile } = options;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt ?? 'what can you tell me about this image?',
          },
          // IF WE ALREADY HAVE THE IMAGE URL

          // {
          //   type: 'image_url',
          //   image_url: {
          //     url: 'https://static.vecteezy.com/system/resources/previews/003/623/626/non_2x/sunset-lake-landscape-illustration-free-vector.jpg',
          //   },
          // },
          {
            type: 'image_url',
            image_url: {
              url: convertFileToBase64(imageFile),
            },
          },
        ],
      },
    ],
  });

  return { msg: response.choices[0].message.content };
};

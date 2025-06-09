import * as fs from 'fs';
import OpenAI from 'openai';
import { downloadImageAsPng } from '../../../helpers';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { baseImage } = options;
  const pngImageFullPath = await downloadImageAsPng(baseImage, true);

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImageFullPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const responseUrl = response.data?.[0].url || '';

  const fileName = await downloadImageAsPng(responseUrl);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openAIUrl: responseUrl,
    revised_prompt: response.data?.[0].revised_prompt,
  };
};

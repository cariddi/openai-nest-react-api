import OpenAI from 'openai';
import { downloadImageAsPng } from '../../helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  // TODO: verification of originalImage

  const response = await openai.images.generate({
    prompt,
    model: 'dall-e-3',
    n: 1, // number of images we want to generate
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  const responseUrl = response.data?.[0].url || '';
  // TODO: save image in file system
  const url = await downloadImageAsPng(responseUrl);

  return {
    url,
    openAIUrl: responseUrl,
    revised_prompt: response.data?.[0].revised_prompt,
  };
};

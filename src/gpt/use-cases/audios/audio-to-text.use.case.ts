import * as fs from 'fs';
import OpenAI from 'openai';

interface Options {
  prompt?: string;
  lang?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, lang, audioFile } = options;
  console.log({ prompt, audioFile });

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt, // must be in the same lang than the audio file
    language: lang, // could be another parameter but need to work on the validation of the audioFile language
    response_format: 'verbose_json', // 'vtt', // 'srt',
  });

  return response;
};

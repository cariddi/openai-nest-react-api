import * as fs from 'fs';
import OpenAI from 'openai';
import * as path from 'path';

interface Options {
  prompt: string;
  voice?: string;
}

type MyVoices = OpenAI.Audio.Speech.SpeechCreateParams['voice'];
type VoicesObject = {
  [key in MyVoices]: MyVoices;
};

export const textToAudioUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, voice } = options;

  const voices: VoicesObject = {
    nova: 'nova',
    alloy: 'alloy',
    ash: 'ash',
    ballad: 'ballad',
    coral: 'coral',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    sage: 'sage',
    shimmer: 'shimmer',
    verse: 'verse',
  };

  const selectedVoice = voice ? voices[voice] : 'nova';

  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  await fs.promises.mkdir(folderPath, {
    recursive: true,
  });

  const mp3 = await openai.audio.speech.create({
    model: 'gpt-4o-mini-tts',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  fs.writeFileSync(speechFile, buffer);

  return {
    filePath: speechFile,
  };
};

import { Injectable } from '@nestjs/common';
import { OrthographyDto } from './dtos';
import { orthographyCheckUseCase } from './use-cases/orthography.use.case';

@Injectable()
export class GptService {
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase({ prompt: orthographyDto.prompt });
  }
}

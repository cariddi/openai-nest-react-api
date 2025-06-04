import { Body, Controller, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { QuestionDto } from './dto/question.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('create-thread')
  async createThread() {
    return 'create thread';
  }

  @Post('user-question')
  async userQuestion(@Body() questionDto: QuestionDto) {
    return questionDto;
  }
}

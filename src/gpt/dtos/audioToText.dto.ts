import { IsOptional, IsString } from 'class-validator';

export class AudtioToTextDto {
  @IsString()
  @IsOptional()
  readonly prompt: string;

  @IsString()
  @IsOptional()
  readonly lang: string;
}

import { IsOptional, IsString } from 'class-validator';

export class ExtractTextFromImageDto {
  @IsString()
  @IsOptional()
  readonly prompt?: string;
}

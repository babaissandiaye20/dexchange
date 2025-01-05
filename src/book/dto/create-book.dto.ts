import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Titre du livre',
    example: 'Les Misérables',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Auteur du livre',
    example: 'Victor Hugo',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'Date de publication',
    required: false,
    example: '2024-01-05',
  })
  @IsDateString()
  @IsOptional()
  publishedDate?: Date;

  @ApiProperty({
    description: 'Catégorie du livre',
    required: false,
    example: 'Roman',
  })
  @IsString()
  @IsOptional()
  category?: string;
}

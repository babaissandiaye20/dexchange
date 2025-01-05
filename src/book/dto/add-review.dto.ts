// src/books/dto/add-review.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddReviewDto {
  @ApiProperty({
    description: 'Note attribuée au livre (entre 1 et 5)',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Commentaire sur le livre',
    minLength: 10,
    example: "Un excellent livre qui m'a beaucoup appris.",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  comment: string;
}

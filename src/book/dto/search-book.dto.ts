import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
export class SearchBookDto {
  @ApiProperty({
    description: 'Terme de recherche',
    required: false,
    example: 'Hugo',
  })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiProperty({
    description: 'Champ de recherche',
    enum: ['title', 'author', 'category'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['title', 'author', 'category'])
  searchField?: string;

  @ApiProperty({
    description: 'Ordre de tri',
    enum: ['asc', 'desc'],
    required: false,
    default: 'desc',
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Trier par',
    enum: ['publishedDate', 'rating'],
    required: false,
    default: 'publishedDate',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    description: 'Numéro de page',
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: "Nombre d'éléments par page",
    minimum: 1,
    maximum: 50,
    required: false,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(50)
  limit?: number;
}

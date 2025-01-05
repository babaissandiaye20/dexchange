import { IsArray, IsNumber, IsBoolean } from 'class-validator';
export class PaginatedResponseDto<T> {
  @IsArray()
  items: T[];

  @IsNumber()
  total: number;

  @IsNumber()
  page: number;

  @IsNumber()
  totalPages: number;

  @IsBoolean()
  hasNext: boolean;

  @IsBoolean()
  hasPrevious: boolean;
}

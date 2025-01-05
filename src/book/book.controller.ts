/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { AddReviewDto } from './dto/add-review.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Book } from './entities/book.schema';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    [key: string]: any;
  };
}

@ApiTags('books')
@ApiBearerAuth()
@Controller('books')
@UseGuards(JwtAuthGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
    type: Book,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createBookDto: CreateBookDto) {
    try {
      return await this.bookService.create(createBookDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Failed to create book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with optional search parameters' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of books',
    type: [Book],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(@Query() searchBookDto: SearchBookDto) {
    try {
      if (Object.keys(searchBookDto).length) {
        return await this.bookService.search(searchBookDto);
      }
      return await this.bookService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Get top rated books' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of top rated books to return',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of top rated books',
    type: [Book],
  })
  async getTopRated(@Query('limit') limit = 5) {
    return this.bookService.findTopRated(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by id' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the book',
    type: Book,
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async findOne(@Param('id') id: string) {
    try {
      const book = await this.bookService.findOne(id);
      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }
      return book;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully updated.',
    type: Book,
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    try {
      const book = await this.bookService.update(id, updateBookDto);
      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }
      return book;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Failed to update book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully deleted.',
    type: Book,
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async remove(@Param('id') id: string) {
    try {
      const book = await this.bookService.remove(id);
      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }
      return book;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Add a review to a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiBody({ type: AddReviewDto })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully added.',
    type: Book,
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async addReview(
    @Param('id') id: string,
    @Body() addReviewDto: AddReviewDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.userId;
    return this.bookService.addReview(id, userId, addReviewDto);
  }
}

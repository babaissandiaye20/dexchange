/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './entities/book.schema';
import { Review } from '../review/entities/review.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let bookModel: Model<Book>;
  let reviewModel: Model<Review>;

  const mockBook = {
    _id: 'mockBookId',
    title: 'Test Book',
    author: 'Test Author',
    publishedDate: new Date(),
    category: 'Test Category',
    reviews: [],
    rating: 0,
  };

  const mockReview = {
    _id: 'mockReviewId',
    rating: 4,
    comment: 'Great book!',
    userId: 'mockUserId',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockBook),
            constructor: jest.fn().mockResolvedValue(mockBook),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(Review.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockReview),
          },
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookModel = module.get<Model<Book>>(getModelToken(Book.name));
    reviewModel = module.get<Model<Review>>(getModelToken(Review.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publishedDate: new Date(),
        category: 'Test Category',
      };

      jest.spyOn(bookModel.prototype, 'save').mockResolvedValueOnce(mockBook);

      const result = await service.create(createBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      jest.spyOn(bookModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockBook]),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      jest.spyOn(bookModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockBook),
      } as any);

      const result = await service.findOne('mockBookId');
      expect(result).toEqual(mockBook);
    });
  });

  describe('search', () => {
    it('should search books with pagination', async () => {
      const searchDto = {
        searchTerm: 'test',
        page: 1,
        limit: 10,
      };

      const mockResult = {
        books: [mockBook],
        total: 1,
        page: 1,
        limit: 10,
      };

      jest.spyOn(bookModel, 'find').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce([mockBook]),
      } as any);

      jest.spyOn(bookModel, 'countDocuments').mockResolvedValueOnce(1);

      const result = await service.search(searchDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('addReview', () => {
    it('should add a review to a book', async () => {
      const bookWithReview = {
        ...mockBook,
        reviews: [mockReview],
        rating: 4,
      };

      jest.spyOn(bookModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(bookWithReview),
      } as any);

      jest
        .spyOn(bookModel.prototype, 'save')
        .mockResolvedValueOnce(bookWithReview);

      const result = await service.addReview('mockBookId', 'mockUserId', {
        rating: 4,
        comment: 'Great book!',
      });

      expect(result).toEqual(bookWithReview);
    });

    it('should throw NotFoundException when book is not found', async () => {
      jest.spyOn(bookModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(
        service.addReview('mockBookId', 'mockUserId', {
          rating: 4,
          comment: 'Great book!',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when user has already reviewed', async () => {
      const bookWithExistingReview = {
        ...mockBook,
        reviews: [{ ...mockReview, userId: 'mockUserId' }],
      };

      jest.spyOn(bookModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(bookWithExistingReview),
      } as any);

      await expect(
        service.addReview('mockBookId', 'mockUserId', {
          rating: 4,
          comment: 'Great book!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './entities/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { AddReviewDto } from './dto/add-review.dto';
import { Review } from 'src/review/entities/review.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>, // Ajoutez cette ligne
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<Book> {
    return this.bookModel.findById(id).exec();
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    return this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Book> {
    return this.bookModel.findByIdAndDelete(id).exec();
  }

  async search(searchBookDto: SearchBookDto): Promise<{
    books: Book[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      searchTerm,
      searchField,
      sortOrder = 'desc',
      sortBy = 'publishedDate',
      page = 1,
      limit = 10,
    } = searchBookDto;

    const query = this.bookModel.find();

    // Appliquer la recherche si searchTerm est fourni
    if (searchTerm) {
      if (searchField) {
        query.where({ [searchField]: new RegExp(searchTerm, 'i') });
      } else {
        query.find({ $text: { $search: searchTerm } });
      }
    }

    // Appliquer le tri
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    query.sort({ [sortBy]: sortDirection });

    // Pagination
    const skip = (page - 1) * limit;
    const [books, total] = await Promise.all([
      query.skip(skip).limit(limit).exec(),
      this.bookModel.countDocuments(query.getQuery()),
    ]);

    return {
      books,
      total,
      page,
      limit,
    };
  }
  async addReview(
    bookId: string,
    userId: string,
    addReviewDto: AddReviewDto,
  ): Promise<Book> {
    const book = await this.bookModel.findById(bookId).exec();

    if (!book) {
      throw new NotFoundException('Livre non trouvé');
    }

    // Vérifier si l'utilisateur a déjà noté ce livre
    const existingReview = book.reviews.find(
      (review) => review.userId.toString() === userId,
    );

    if (existingReview) {
      throw new ConflictException('Vous avez déjà noté ce livre');
    }

    // Créer une nouvelle instance de Review
    const review = new this.reviewModel({
      ...addReviewDto,
      userId,
      createdAt: new Date(),
    });

    book.reviews.push(review);

    // Recalculer la note moyenne
    const totalRating = book.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    book.rating = totalRating / book.reviews.length;

    return book.save();
  }

  async findTopRated(limit: number = 5): Promise<Book[]> {
    return this.bookModel.find().sort({ rating: -1 }).limit(limit).exec();
  }
}

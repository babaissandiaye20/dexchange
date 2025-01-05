import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Review, ReviewSchema } from 'src/review/entities/review.schema';

@Schema({
  timestamps: true,
})
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  publishedDate: Date;

  @Prop()
  category: string;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  })
  rating: number;

  @Prop({ type: [ReviewSchema] })
  reviews: Review[];
}

export const BookSchema = SchemaFactory.createForClass(Book);

// Définir les index
BookSchema.index({ title: 'text', author: 'text', category: 'text' });
BookSchema.index({ publishedDate: 1 });
BookSchema.index({ rating: -1 });
BookSchema.index({ category: 1 });

// Hook pour calculer la moyenne des notes
BookSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    this.rating = totalRating / this.reviews.length;
  }
  next();
});

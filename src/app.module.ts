import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ReviewModule } from './review/review.module';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [DatabaseModule, UsersModule, ReviewModule, BookModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

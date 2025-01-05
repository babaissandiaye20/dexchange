import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseProviders } from './config/database-providers.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const config = databaseProviders.mongodb;
        return {
          uri: `mongodb+srv://${config.user}:${config.password}@${config.host}/?retryWrites=true&w=majority`,
        };
      },
    }),
  ],
})
export class DatabaseModule {}

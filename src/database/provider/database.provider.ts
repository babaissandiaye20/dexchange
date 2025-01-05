import { Provider } from '@nestjs/common';
import { databaseProviders } from '../config/database-providers.config';
import { MongooseConnection } from '../connections/mongoose.connection';
import * as mongoose from 'mongoose';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: async (): Promise<mongoose.Connection> => {
    const provider = 'mongodb'; // Vous pouvez changer le provider ici
    const config = databaseProviders[provider];

    switch (provider) {
      case 'mongodb':
        const connection = await MongooseConnection.getInstance(config);
        return connection.getConnection();
      // Ajoutez d'autres cas pour différents providers
      default:
        throw new Error(`Provider ${provider} non supporté`);
    }
  },
};

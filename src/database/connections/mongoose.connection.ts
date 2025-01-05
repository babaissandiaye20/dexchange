// src/database/connections/mongoose.connection.ts
import * as mongoose from 'mongoose';
import { DatabaseConfig } from '../interfaces/database.interface';

export class MongooseConnection {
  private static instance: MongooseConnection;
  private connection: mongoose.Connection;

  private constructor(private readonly config: DatabaseConfig) {}

  public static async getInstance(
    config: DatabaseConfig,
  ): Promise<MongooseConnection> {
    if (!MongooseConnection.instance) {
      MongooseConnection.instance = new MongooseConnection(config);
      await MongooseConnection.instance.connect();
    }
    return MongooseConnection.instance;
  }

  private async connect(): Promise<void> {
    try {
      const uri = `mongodb+srv://${this.config.user}:${this.config.password}@${this.config.host}/${this.config.database}`;

      await mongoose.connect(uri);
      this.connection = mongoose.connection;

      console.log('Connected to MongoDB with Mongoose');
    } catch (error) {
      console.error('Error connecting to MongoDB with Mongoose:', error);
      throw error;
    }
  }

  public getConnection(): mongoose.Connection {
    return this.connection;
  }
}

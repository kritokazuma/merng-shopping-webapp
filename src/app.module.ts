import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './items/items.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      subscriptions: {
        'graphql-ws': true,
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL + 'users', {
      connectionName: 'users',
    }),
    MongooseModule.forRoot(process.env.MONGO_URL + 'items', {
      connectionName: 'items',
    }),
    UserModule,
    AuthModule,
    ItemsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

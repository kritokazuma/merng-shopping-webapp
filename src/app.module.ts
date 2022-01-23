import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './items/items.module';
import { CommentsModule } from './comments/comments.module';
import { GraphQLUpload } from 'graphql-upload';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      subscriptions: {
        'graphql-ws': true,
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      resolvers: { Upload: GraphQLUpload },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL + 'users'),
    UserModule,
    AuthModule,
    CommentsModule,
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

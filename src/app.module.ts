import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './items/items.module';
import { GraphQLUpload } from 'graphql-upload';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ApolloDriver } from '@nestjs/apollo';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      resolvers: { Upload: GraphQLUpload },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    AuthModule,
    ItemsModule,
    CartModule,
    OrderModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// console.log(process.cwd());

import { Field, InputType } from '@nestjs/graphql';
import { Upload } from 'graphql-upload';

@InputType()
export class UploadImageInput {
  @Field(() => [Upload])
  file: Upload[];
}

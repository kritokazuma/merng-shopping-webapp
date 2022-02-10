import { Schema } from 'mongoose';
export class JwtDecodeReturnDto {
  id: string;
  email: string;
  username: string;
  avatar: string;
  role: string;
}

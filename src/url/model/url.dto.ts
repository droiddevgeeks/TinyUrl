import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty({ message: 'The URL field cannot be empty' })
  @IsUrl({}, { message: 'The URL must be a valid URL' })
  originalUrl: string = "";
}

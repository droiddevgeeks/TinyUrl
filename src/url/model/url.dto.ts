import { IsNotEmpty, IsNumber, IsString, IsUrl, Max, Min } from "class-validator";

export class TinyUrlRequestDto {
  @IsString()
  @IsNotEmpty({ message: "The URL field cannot be empty" })
  @IsUrl({}, { message: "The URL must be a valid URL" })
  originalUrl: string = "";

  @IsNumber()
  @Min(1, { message: "expiresInDays must be at least 1." })
  @Max(15, { message: "expiresInDays cannot be more than 15." })
  expiresInDays: number = 1;
}

export class TinyUrlResponseDto {
  originalUrl: string = "";
  shortUrl: string = "";
  expiresAt?: Date;

  constructor(partial: Partial<TinyUrlResponseDto>) {
    Object.assign(this, partial);
  }
}

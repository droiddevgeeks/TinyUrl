import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "url_shortner",  timestamps: true  })
export class UrlShortener extends Document {
  @Prop({ required: true, unique: true })
  shortCode: string = "";

  @Prop({ required: true, unique: true })
  originalUrl: string = "";
  @Prop({ required: true})
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UrlShortenerSchema = SchemaFactory.createForClass(UrlShortener);

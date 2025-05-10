import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: "url_shortner" })
export class UrlShortener extends Document {
  @Prop({ required: true, unique: true })
  shortCode: string = "";

  @Prop({ required: true, unique: true })
  originalUrl: string = "";

  @Prop({ default: Date.now })
  createdAt: string = Date.now().toString();

  @Prop({ default: Date.now })
  updatedAt: string = Date.now().toString();
}

export const UrlShortenerSchema = SchemaFactory.createForClass(UrlShortener);

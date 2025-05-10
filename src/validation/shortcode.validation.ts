import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ShortCodeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'string' || value.length < 7) {
      throw new BadRequestException('The shortCode must be a string of atleast 7 characters');
    }
    return value;
  }
}
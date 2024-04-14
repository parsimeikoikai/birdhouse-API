import { Length,IsNotEmpty } from 'class-validator';

export class CreateBirdHouseDto {
  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  latitude: number;

  @Length(4,16)
  name: string;
}

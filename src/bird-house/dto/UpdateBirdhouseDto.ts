import { IsOptional, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateBirdhouseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name?: string;

  @IsOptional()
  @IsNumber()
  birds?: number;

  @IsOptional()
  @IsNumber()
  eggs?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;
}

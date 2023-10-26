/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class CreateArticleDto {

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    title : string;

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    imageKey : string;

    @ApiProperty({
        type: String,
    })
    @IsNotEmpty()
    textKey : string;
    

}

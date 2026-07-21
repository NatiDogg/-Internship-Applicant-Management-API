import {IsNotEmpty, IsEmail, MinLength} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'
export class LoginDto{
    @ApiProperty({example: 'admin@infnova.com', description:"Admin email address"})
    @IsNotEmpty({message: "Email is required"})
    @IsEmail({}, {message: "Please provide a valid email"})
    email!: string
    @ApiProperty({ example: 'admin123', description: 'Admin password' })
    @IsNotEmpty({message: 'Password is required'})
    @MinLength(6,{message: 'Password must be atleast 6 characters long'})
    password!: string
}



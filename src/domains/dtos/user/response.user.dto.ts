import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'username123' })
  username: string;

  @ApiProperty({ example: 'User Display Name' })
  displayName: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenResponseDTO {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...' })
  accessToken: string;
}

export class AuthUserResponseDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  sub: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'username123' })
  username: string;

  @ApiProperty({ example: 'User Display Name' })
  displayName: string;

  @ApiProperty({ example: ['user', 'admin'], type: [String] })
  roles: string[];
}

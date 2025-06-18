import { ApiProperty } from '@nestjs/swagger';

class UserResponseDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user123' })
  username: string;
}

class BookReferenceResponseDTO {
  @ApiProperty({ example: '456e7890-e12b-34d5-c678-526614174111' })
  id: string;

  @ApiProperty({ example: 'The Great Book' })
  title: string;

  @ApiProperty({ example: ['Author One', 'Author Two'], type: [String] })
  authors: string[];

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  thumbnailUrl: string;
}

export class ReviewResponseDTO {
  @ApiProperty({ example: '789e0123-a45b-67d8-c901-626614174222' })
  id: string;

  @ApiProperty({ type: () => UserResponseDTO })
  user: UserResponseDTO;

  @ApiProperty({ type: () => BookReferenceResponseDTO })
  bookReference: BookReferenceResponseDTO;

  @ApiProperty({ example: 'A fantastic read!' })
  title: string;

  @ApiProperty({ example: 'Detailed content about the review...' })
  content: string;

  @ApiProperty({ example: 'Author One' })
  authors: string;

  @ApiProperty({ example: 4.5 })
  rating: number;

  @ApiProperty({ example: '2025-05-27T12:00:00Z' })
  publishedAt: string;

  @ApiProperty({ example: '2025-05-28T12:00:00Z' })
  updatedAt: string;
}

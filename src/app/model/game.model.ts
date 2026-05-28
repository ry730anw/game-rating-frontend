export interface GameRatingResponse {
  title: string;
  platformName: string;
  metascore: number | null;
  userScore: number | null;
  summary: string;
  releaseDate: string;
  mediaReviewCount: number;
  userReviewCount: number;
  developer: string;
  genre: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

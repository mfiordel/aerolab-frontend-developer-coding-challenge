export interface Screenshot {
  id: number;
  url: string;
  game: number;
  image_id: string;
}
export interface Cover {
  id: number;
  url: string;
  game: number;
}
export interface Game {
  id: number;
  name: string;
  description?: string; 
  rating?: number; 
  first_release_date?: number;
  cover?: Cover;
  platforms?: { name: string }[]; 
  screenshots?: Screenshot[];
  summary?: string;
  similar_games?: Game[];
  similarGames?: SimilarGames[];
  addedDate?: string;
  slug?: string;
}
export interface SimilarGames {
  id: number;
  name: string;
  cover: Cover;
  slug?: string;
}

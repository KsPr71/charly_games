export interface Game{
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  os?: string;
  processor?: string;
  memory?: string;
  graphics?: string;
  storage?: string;
  weight?: number;
}

export interface TopRatedGame {
  id: number;
  title: string;
  image_url: string;
  average_rating: number;
}



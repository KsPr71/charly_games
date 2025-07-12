export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  pcRequirements: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
}

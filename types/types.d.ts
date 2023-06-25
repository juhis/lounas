export type Restaurants = {
  [key: string]: Restaurant;
};

export type Restaurant = {
  name: string;
  url?: string;
  language?: string;
  parseType?: string;
  parse?: (dom: any, day: string) => string[];
};

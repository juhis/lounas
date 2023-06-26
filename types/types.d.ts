export type Restaurants = {
  [key: string]: Restaurant;
};

export type Restaurant = {
  name: string;
  url?: string;
  visitUrl?: string;
  icon?: string;
  language?: string;
  parseType?: string;
  parse?: (dom: any, day: string) => { icon: string; text: string }[];
};

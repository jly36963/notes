export interface Ninja {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  createdAt: string;
  updatedAt: string | null;
  jutsus?: Array<Jutsu>;
}

export interface Jutsu {
  id: string;
  name: string;
  chakraNature: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  ninjas?: Array<Ninja>;
}

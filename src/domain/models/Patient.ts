import { TechFamiliarity } from '../enums/TechFamiliarity';

export interface Patient {
  id: string;
  name: string;
  age: number;
  techFamiliarity: TechFamiliarity;
}

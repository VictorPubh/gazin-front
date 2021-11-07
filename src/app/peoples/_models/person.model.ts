import { HOBBY } from "src/app/hobbies/_models/hobby";

export interface PersonModel {
  id: number;
  name: string;
  email: string;
  sex: string;
  age: number;
  password?: string;
  profession: string;
  createdAt: Date;
  birthday: Date;
  companyId?: number;
  hobbies?: HOBBY[];
}

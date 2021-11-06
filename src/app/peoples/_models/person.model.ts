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
}

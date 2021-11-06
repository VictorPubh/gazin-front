export interface UpdatePersonModel {
    id: number;
    name: string;
    email: string;
    sex: string;
    age: number;
    profession: string;
    createdAt: Date;
    birthday: Date;
    companyId?: number;
}

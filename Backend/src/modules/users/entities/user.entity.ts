export class User {
  id!: string;
  email!: string | null;
  name?: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

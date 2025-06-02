import { faker } from '@faker-js/faker';

interface UserRegisterData {
  firstName?: string;
  lastName?: string;
  email?: string;
  telephone?: string;
  password?: string;
  checkPrivacy?: boolean;
  subscribe?: boolean;
}

export class UserRegister {
  private firstName: string;
  private lastName: string;
  private email: string;
  private telephone: string;
  private password: string;
  private checkPrivacy: boolean;
  private subscribe: boolean;

  constructor(data?: UserRegisterData) {
    this.firstName = data?.firstName || faker.name.firstName();
    this.lastName = data?.lastName || faker.name.lastName();
    this.email = data?.email || faker.internet.email();
    this.telephone = data?.telephone || faker.phone.number().replace(/\D/g, '');
    this.password = data?.password || faker.internet.password();
    this.checkPrivacy = data?.checkPrivacy ?? true;
    this.subscribe = data?.subscribe ?? faker.datatype.boolean();
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getEmail(): string {
    return this.email;
  }

  getTelephone(): string {
    return this.telephone;
  }

  getPassword(): string {
    return this.password;
  }

  getCheckPrivacy(): boolean {
    return this.checkPrivacy;
  }

  getSubscribe(): boolean {
    return this.subscribe;
  }

  toJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      telephone: this.telephone,
      password: this.password,
      subscribe: this.subscribe,
      checkPrivacy: this.checkPrivacy,
    };
  }
}

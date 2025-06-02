import { faker } from '@faker-js/faker';

export class UserRegister {
  private readonly firstName: string;
  private readonly lastName: string;
  private readonly email: string;
  private readonly telephone: string;
  private readonly password: string;
  private readonly checkPrivacy: boolean = true;
  private readonly subscribe: boolean;

  constructor() {
    this.firstName = faker.name.firstName();
    this.lastName = faker.name.lastName();
    this.email = faker.internet.email();
    this.telephone = faker.phone.number().replace(/\D/g, '');
    this.password = faker.internet.password();
    this.checkPrivacy = true;
    this.subscribe = faker.datatype.boolean();
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
      checkPrivacy: this.checkPrivacy,
      subscribe: this.subscribe,
    };
  }
}

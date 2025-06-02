export class UserLogin {
  email: string;
  password: string;

  constructor(emailOrData?: string | { email: string; password: string }, password?: string) {
    if (typeof emailOrData === 'string') {
      this.email = emailOrData;
      this.password = password || '';
    } else {
      this.email = emailOrData?.email || '';
      this.password = emailOrData?.password || '';
    }
  }
}

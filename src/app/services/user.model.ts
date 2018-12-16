export class User {
  image: string;
  email: string;
  provider: string;
  uid: string;

  constructor(){
    this.image = "";
    this.email = "";
    this.provider = "";
    this.uid = "";
  }
}
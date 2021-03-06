import {
  Entity,
  Column,
  Unique,
  ObjectIdColumn
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';

export interface WatchListItem {
  id: number;
  title: string;
  posterPath: string;
}

@Entity()
@Unique(['username'])
export class User {
  @ObjectIdColumn()
  id: number;

  @Column()
  @Length(4, 20)
  @IsNotEmpty()
  username: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column()
  @IsNotEmpty()
  watchList: WatchListItem[];

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

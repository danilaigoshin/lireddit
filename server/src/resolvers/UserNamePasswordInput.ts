import { Field, InputType } from 'type-graphql';

@InputType()
export class UserNamePasswordInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

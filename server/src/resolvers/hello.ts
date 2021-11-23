import {Query, Resolver} from "type-graphql";

@Resolver()
class HelloResolver {
    @Query(() => String)
    hello() {
        return "hello world!!!"
    }
}

export { HelloResolver }
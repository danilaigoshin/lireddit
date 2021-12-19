import { useApolloClient } from '@apollo/client';
import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading, Link } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

const NavBar: React.FC<{}> = ({}) => {
  const apolloClient = useApolloClient();
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const { data } = useMeQuery({
    skip: isServer(),
  });

  const notLoggedIn = () => (
    <>
      <NextLink href='/login'>
        <Link mr={4}>Login</Link>
      </NextLink>
      <NextLink href='/register'>
        <Link>Register</Link>
      </NextLink>
    </>
  );

  const loggedIn = () => (
    <Flex align='center'>
      <NextLink href='/create-post'>
        <Button as={Link} mr={4}>
          create post
        </Button>
      </NextLink>
      <Box mr={2}>{data?.me?.username}</Box>
      <Button
        onClick={async () => {
          await logout();
          await apolloClient.resetStore();
        }}
        isLoading={logoutFetching}
        variant='link'
      >
        Logout
      </Button>
    </Flex>
  );

  const renderLinks = () => (data?.me ? loggedIn() : notLoggedIn());

  return (
    <Flex position='sticky' zIndex={1} top={0} bg='tan' p={4}>
      <Flex flex={1} margin='auto' maxW={800} align='center'>
        <NextLink href='/'>
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml='auto'>{renderLinks()}</Box>
      </Flex>
    </Flex>
  );
};

export { NavBar };

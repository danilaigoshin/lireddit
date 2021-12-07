import { Button } from '@chakra-ui/button';
import { Box, Flex, Link } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

const NavBar: React.FC<{}> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  if (fetching) {
  }

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
    <Flex>
      <Box mr={2}>{data?.me?.username}</Box>
      <Button
        onClick={() => logout()}
        isLoading={logoutFetching}
        variant='link'
      >
        Logout
      </Button>
    </Flex>
  );

  const renderLinks = () => (data?.me ? loggedIn() : notLoggedIn());

  return (
    <Flex bg='tan' p={4}>
      <Box ml='auto'>{renderLinks()}</Box>
    </Flex>
  );
};

export { NavBar };

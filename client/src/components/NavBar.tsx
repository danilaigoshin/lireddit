import { Button } from '@chakra-ui/button';
import { Box, Flex, Link } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

const NavBar: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useMeQuery();

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
      <Button variant='link'>Logout</Button>
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

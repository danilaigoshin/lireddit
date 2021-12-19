import { Button } from '@chakra-ui/button';
import { Box, Flex, Heading, Link } from '@chakra-ui/layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

const NavBar: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data }] = useMeQuery();

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
          router.reload();
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

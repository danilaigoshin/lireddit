import { withUrqlClient } from 'next-urql';
import { Layout } from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
import { UpdootSection } from '../components/UpdootSection';
import { PostButtons } from '../components/PostButtons';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  const renderLoadMore = () =>
    data &&
    data.posts.hasMore && (
      <Flex my={7}>
        <Button
          onClick={() => {
            setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
            });
          }}
          isLoading={fetching}
          m='auto'
        >
          Load more
        </Button>
      </Flex>
    );

  const renderPosts = () => {
    if (!fetching && !data) {
      return <div>You got query failed</div>;
    }

    return !fetching && data ? (
      <Stack spacing={8}>
        {data!.posts.posts.map(
          (post) =>
            post && (
              <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
                <UpdootSection post={post} />
                <Box flex={1}>
                  <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize='xl'>{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text pb={3}>posted by {post.creator.username}</Text>
                  <Flex align='center'>
                    <Text flex={1}>{post.textSnippet}</Text>
                    <Box ml='auto'>
                      <PostButtons id={post.id} creatorId={post.creator.id} />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )
        )}
      </Stack>
    ) : (
      <p>loading...</p>
    );
  };

  return (
    <Layout>
      {renderPosts()}
      {renderLoadMore()}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

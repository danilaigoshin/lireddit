import { Box, Heading } from '@chakra-ui/react';

import { Layout } from '../../components/Layout';
import { PostButtons } from '../../components/PostButtons';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

const Post: React.FC<{}> = () => {
  const { data, loading } = useGetPostFromUrl();

  if (loading) {
    return <Layout>loading...</Layout>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find the post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      <Box mb={4}>{data.post.text}</Box>
      <PostButtons id={data.post.id} creatorId={data.post.creator.id} />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);

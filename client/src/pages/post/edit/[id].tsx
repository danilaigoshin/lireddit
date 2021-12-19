import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';

import InputField from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { TextAreaField } from '../../../components/TextArea';
import {
  PostSnippetFragment,
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';

interface Post {
  title: PostSnippetFragment['title'];
  text: PostSnippetFragment['text'];
}

const EditPost: React.FC<{}> = () => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();

  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div>no data</div>
      </Layout>
    );
  }

  const handleSubmit = async ({ text, title }: Post) => {
    await updatePost({ variables: { id: intId, text, title } });
    router.push('/');
  };

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: data.post!.title, text: data.post!.text }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='title' placeholder='title' label='Title' />
            <Box mt={4}>
              <TextAreaField name='text' placeholder='text...' label='Text' />
            </Box>
            <Button
              mt={4}
              type='submit'
              colorScheme='teal'
              isLoading={isSubmitting}
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);

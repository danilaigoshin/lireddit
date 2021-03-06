import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { useRouter } from 'next/router';

import InputField from '../components/InputField';
import { TextAreaField } from '../components/TextArea';
import { useCreatePostMutation } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

interface Post {
  title: string;
  text: string;
}

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();

  const handleSubmit = async (values: Post) => {
    const { errors } = await createPost({
      variables: { input: values },
      update: (cache) => {
        cache.evict({ fieldName: 'posts' });
      },
    });
    if (!errors) {
      router.push('/');
    }
  };

  return (
    <Layout variant='small'>
      <Formik initialValues={{ title: '', text: '' }} onSubmit={handleSubmit}>
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
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);

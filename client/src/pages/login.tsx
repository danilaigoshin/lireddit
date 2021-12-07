import { useRouter } from 'next/router';
import { Form, Formik, FormikHelpers } from 'formik';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';

import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface User {
  usernameOrEmail: string;
  password: string;
}

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  const handleSubmit = async (
    values: User,
    { setErrors }: FormikHelpers<User>
  ) => {
    const { data } = await login(values);
    if (data?.login.errors) {
      setErrors(toErrorMap(data.login.errors));
    }

    if (data?.login.user) {
      router.push('/');
    }
  };

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='usernameOrEmail'
              placeholder='username or email'
              label='Username or email'
            />
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>
            <Button
              mt={4}
              type='submit'
              colorScheme='teal'
              isLoading={isSubmitting}
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);

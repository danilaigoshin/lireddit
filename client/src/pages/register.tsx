import { useRouter } from 'next/router';
import { Form, Formik, FormikHelpers } from 'formik';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';

import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface RegisterProps {}

interface User {
  email: string;
  password: string;
  username: string;
}

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  const handleSubmit = async (
    values: User,
    { setErrors }: FormikHelpers<User>
  ) => {
    const { data } = await register({ options: values });
    if (data?.register.errors) {
      setErrors(toErrorMap(data.register.errors));
    }

    if (data?.register.user) {
      router.push('/');
    }
  };

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='username'
              label='Username'
            />
            <Box mt={4}>
              <InputField name='email' placeholder='email' label='Email' />
            </Box>
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
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);

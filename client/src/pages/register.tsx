import { Form, Formik } from 'formik';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';

import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';

import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await register(values);
          console.log(data);
          if (data.register.errors) {
            setErrors(toErrorMap(data.register.errors));
          }

          if (data.register.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              placeholder='username'
              label='Username'
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
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;

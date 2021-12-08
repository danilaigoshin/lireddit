import { Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/layout';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useState } from 'react';

import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface ForgotPassword {
  email: string;
}

const forgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (values: ForgotPassword) => {
    await forgotPassword(values);
    setComplete(true);
  };

  return (
    <Wrapper variant='small'>
      <Formik initialValues={{ email: '' }} onSubmit={handleSubmit}>
        {({ isSubmitting }) =>
          complete ? (
            <Box>if an account exists, we sent you email</Box>
          ) : (
            <Form>
              <InputField
                name='email'
                placeholder='email'
                label='Email'
                type='email'
              />
              <Button
                mt={4}
                type='submit'
                colorScheme='teal'
                isLoading={isSubmitting}
              >
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(forgotPassword);

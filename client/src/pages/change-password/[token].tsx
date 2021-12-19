import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Button } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import NextLink from 'next/link';

import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { withApollo } from '../../utils/withApollo';

interface ChangePassword {
  newPassword: string;
  token: string;
}

const ChangePassword: NextPage = () => {
  const [tokenError, setTokenError] = useState('');
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();

  const handleSubmit = async (
    values: ChangePassword,
    { setErrors }: FormikHelpers<ChangePassword>
  ) => {
    const { data } = await changePassword({
      variables: {
        newPassword: values.newPassword,
        token: typeof router.query.token === 'string' ? router.query.token : '',
      },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: 'Query',
            me: data?.changePassword.user,
          },
        });
      },
    });

    if (data?.changePassword.errors) {
      const errorMap = toErrorMap(data.changePassword.errors);

      if ('token' in errorMap) {
        setTokenError(errorMap.token);
      }

      setErrors(errorMap);
    }

    if (data?.changePassword.user) {
      router.push('/');
    }
  };

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '', token: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='newPassword'
              placeholder='new password'
              label='New Password'
              type='password'
            />
            {tokenError && (
              <Flex>
                <Box mr={2} color='red'>
                  {tokenError}
                </Box>
                <NextLink href='/forgot-password'>go forget it again</NextLink>
              </Flex>
            )}
            <Button
              mt={4}
              type='submit'
              colorScheme='teal'
              isLoading={isSubmitting}
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(ChangePassword);

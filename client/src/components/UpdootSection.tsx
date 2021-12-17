import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

type Loading = 'updoot-loading' | 'downdoot-loading' | 'not-loading';

interface Updoot {
  post: PostSnippetFragment;
}

const UpdootSection: React.FC<Updoot> = ({ post }) => {
  const [loading, setLoading] = useState<Loading>('not-loading');
  const [, vote] = useVoteMutation();

  const voteHandler = async (value: number, loading: Loading) => {
    if (post.voteStatus === value) {
      return;
    }
    setLoading(loading);
    await vote({ postId: post.id, value });
    setLoading('not-loading');
  };

  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        onClick={() => voteHandler(1, 'updoot-loading')}
        aria-label='Updoot post'
        size='sm'
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
        isLoading={loading === 'updoot-loading'}
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={() => voteHandler(-1, 'downdoot-loading')}
        aria-label='Downdoot post'
        size='sm'
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
        isLoading={loading === 'downdoot-loading'}
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};

export { UpdootSection };

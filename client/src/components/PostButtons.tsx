import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface PostButtons {
  id: number;
  creatorId: number;
}

const PostButtons: React.FC<PostButtons> = ({ id, creatorId }) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          ml='auto'
          aria-label='Edit post'
          icon={<EditIcon />}
        />
      </NextLink>
      <IconButton
        colorScheme='red'
        ml='auto'
        aria-label='Delete post'
        icon={<DeleteIcon />}
        onClick={() =>
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: 'Post:' + id });
            },
          })
        }
      />
    </Box>
  );
};

export { PostButtons };

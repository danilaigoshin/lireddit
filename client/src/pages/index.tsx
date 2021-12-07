import { withUrqlClient } from 'next-urql';
import { NavBar } from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      {data && data?.posts.map(({ id, title }) => <div key={id}>{title}</div>)}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

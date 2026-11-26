import type { LoaderFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import { authenticate } from '../shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.admin(request);
  throw redirect('/app');
}

import { signIn, signOut, useSession } from 'next-auth/react';
import type { ReactElement } from 'react';

const Login = (): ReactElement | null => {

    const { data, status } = useSession();

    console.log('data', data);
    console.log('status', status);

    if (data === undefined) {
        return null;
    }

    if (data === null) {
        return (
            <>
                Not signed in <br />
                <button onClick={() => signIn('keycloak')}>Sign in</button>
            </>
        );
    }

    return (
        <>
            Signed in as {data.user?.email ?? '~mail missing~'} <br />
            <button onClick={() => signOut()}>Sign out</button>
        </>
    );
};

export default Login;

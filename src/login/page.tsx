
import { get } from "aws-amplify/api";
import {
  fetchAuthSession,
  fetchUserAttributes,
  signInWithRedirect,
} from "aws-amplify/auth";
import { useState } from "react";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-2_ZXLCF5Jqb',
      userPoolClientId: '6flrt9t3s4evitdca5b0s0p0c',
      // identityPoolId: 'ap-southeast-2:eb1caa57-b2de-45ec-a34b-01c60649f47a',
      // allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        // below are all defaults, for the sake of the demo
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
        requireUppercase: true,
      },
      userAttributes: {
        email: {
          required: true,
        },
      },
      signUpVerificationMethod: "code",
      loginWith: {
        oauth: {
          domain: "ap-southeast-2zxlcf5jqb.auth.ap-southeast-2.amazoncognito.com",
          scopes: [
            "email",
            "profile",
            "openid",
            "phone",
            "aws.cognito.signin.user.admin",
          ],
          redirectSignIn: ["http://localhost:3000"],
          redirectSignOut: ["http://localhost:3000"],
          responseType: "token",
        },
      },
    },
  }
});

export default function Login() {
  const [userInfo, setUserInfo] = useState<{
    picture: string;
    email: string;
    preferred_username: string;
  } | null>(null);
  const signInWithGitHub = async () => {
    await signInWithRedirect({
      provider: {
        custom: "github",
      },
    });
  };

  const signInWithGoogle = async () => {
    await signInWithRedirect({
      provider: {
        custom: "Google",
      },
    });
  };


  // const getPrivateInfo = async () => {
  //   const { tokens } = await fetchAuthSession();
  //   const response = await get({
  //     apiName: "api",
  //     path: "/private",
  //     options: {
  //       headers: {
  //         Authorization: `${tokens?.idToken?.toString()}`,
  //       },
  //     },
  //   }).response;
  //   console.log("response", await response.body.json());
  // };

  // const getCurrentUserInfo = async () => {
  //   const session = await fetchUserAttributes();
  //   setUserInfo({
  //     picture: session.picture!,
  //     email: session.email!,
  //     preferred_username: session.preferred_username!,
  //   });
  // };

  return (
    <>
      <h1>Hello And Login</h1>
      <button onClick={signInWithGitHub}>Sign In With Github</button>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
      {userInfo?.email !== null ? (
        <>
          <img
            src={userInfo?.picture}
            style={{ borderRadius: "50%" }}
            height="100"
            width="100"
          />
          <div>{userInfo?.email}</div>
          <div>{userInfo?.preferred_username}</div>
        </>
      ) : null}
    </>
  );
}


// import { Authenticator } from '@aws-amplify/ui-react';
// import { Amplify } from 'aws-amplify';
// // import outputs from '@/amplify_outputs.json';
// import '@aws-amplify/ui-react/styles.css';



// export default function Login({ Component, pageProps }: any) {
//   return (
//     <Authenticator>
//       {({ signOut, user }) => (
//         <main>
//           <h1>Hello {user?.username}</h1>
//           <button onClick={signOut}>Sign out</button>
//           <Component {...pageProps} />
//         </main>
//       )}
//     </Authenticator>
//   );
// };
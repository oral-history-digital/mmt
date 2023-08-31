import { useState } from 'react';

import { signUpEndPoint } from '../api';

export type UserData = {
  username: string,
  email: string,
  password: string,
};

export default function useSignUp() {
  const [error, setError] = useState(null);
  const [signedUp, setSignedUp] = useState(false);

  async function signUpUser(userData: UserData) {
    const response = await fetch(signUpEndPoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      setSignedUp(true);
    } else {
      setError(data.message);
    }
  }

  return {
    signedUp,
    error,
    signUpUser,
  };
}

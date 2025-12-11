import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

const providers = {
  api: {
    fetchUser: async (id: string): Promise<User> => {
      const url = `https://jsonplaceholder.typicode.com/users/${id}`;
      const apiResponse = await fetch(url);
      const user: User = await apiResponse.json();
      return user;
    },
  },
};

interface User {
  name: string;
  email: string;
  phone: string;
}

const UserMetadata = (): h.JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserAction = async (userId: string) => {
    try {
      const result = await providers.api.fetchUser(userId);
      setUser(result);
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    const userId = "10"; // NOTE: arbitrary, should come from props
    fetchUserAction(userId);
  }, []);

  if (error) {
    return <div>Oops, an error occurred</div>;
  }
  if (user) {
    return (
      <div>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
      </div>
    );
  }
  return <div>Fetching...</div>;
};

export default UserMetadata;

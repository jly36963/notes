import React from "react";

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
  [key: string]: string; // TODO: update to reflect actual
}

interface UserMetadataState {
  user: User | null;
  error: Error | null;
}

class UserMetadata extends React.Component {
  state: UserMetadataState = {
    user: null,
    error: null,
  };

  componentDidMount() {
    const userId = "10"; // NOTE: arbitrary, should come from props
    this.fetchUserAction(userId);
  }

  fetchUserAction = async (userId: string) => {
    try {
      const result = await providers.api.fetchUser(userId);
      this.setState({ user: result });
    } catch (err) {
      this.setState({ error: err as Error });
    }
  };

  render() {
    const { user, error } = this.state;
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
  }
}

export default UserMetadata;

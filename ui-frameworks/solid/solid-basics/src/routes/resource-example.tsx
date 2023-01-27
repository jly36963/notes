import { JSX, createResource, Switch, Match } from "solid-js";
import type { Component } from "solid-js";

const sleep = async (s: number): Promise<void> =>
  new Promise((r) => setTimeout(r, s));

const providers = {
  api: {
    fetchUser: async (id: string): Promise<User> => {
      await sleep(1000);
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

const UserMetadata: Component = (): JSX.Element => {
  const userId = "10"; // NOTE: arbitrary, should come from props

  const [user] = createResource(userId, providers.api.fetchUser);

  return (
    <Switch>
      <Match when={["unresolved", "pending"].includes(user.state)}>
        <div>Fetching...</div>
      </Match>
      <Match when={user.state === "errored"}>
        <div>Oops, an error occurred</div>;
      </Match>
      <Match when={["ready", "refreshing"].includes(user.state)}>
        <div>
          <p>
            <strong>Name:</strong> {user()!.name}
          </p>
          <p>
            <strong>Email:</strong> {user()!.email}
          </p>
          <p>
            <strong>Phone:</strong> {user()!.phone}
          </p>
        </div>
      </Match>
    </Switch>
  );

  // switch (userResource.state) {
  //   case "unresolved":
  //   case "pending":
  //     return <div>Fetching...</div>;
  //   case "errored":
  //     return <div>Oops, an error occurred</div>;
  //   case "ready":
  //   case "refreshing":
  //     const user = userResource();
  //     return (
  //       <div>
  //         <p>
  //           <strong>Name:</strong> {user.name}
  //         </p>
  //         <p>
  //           <strong>Email:</strong> {user.email}
  //         </p>
  //         <p>
  //           <strong>Phone:</strong> {user.phone}
  //         </p>
  //       </div>
  //     );
  // }
};

export default UserMetadata;

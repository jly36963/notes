// ------------
// axios
// ------------

// install
`
npm i --save axios
`

// ------------
// get
// ------------

const Fetch = ({ id = 1 }) => {
  // useState hook
  const [userState, setUserState] = useState({
    user: {},
    initialzed: false
  })
  // useEffect hook
  useEffect(() => {
    // async function
    const getUser = async (id) => {
      setUserState({ ...userState, initialized: false })
      const apiResponse = await axios.get(`/users/${id}`)
      const { error, data: user } = apiResponse;
      if (error) {
        console.log(error);
        setUserState({ user: {}, initialized: true })
        return;
      };
      setUserState({ user, initialized: true });
    }
    // execution
    getUser(id);
  }, []);
  // jsx
  return (
    <div>
      {userState.initialized && userState.user.name
        ? (<p>User: {userState.user.name}</p>)
        : (<p>No user found</p>)
      }
    </div>
  )
}

export default Fetch;
import { React, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { login } from "../api/requests";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { dispatch: dispatchAuth } = useAuthContext();

  const handleSubmit = async (e) => {
    alert(
      "Because I don't have SSL/https, this website only works on Chrome\nSorry for the inconvenience\nSteps:\nClick the (i) next to the url\nClick site settings\nScroll down to Insecure content\nAllow\nClose window (reload might not work)\nGo back to this website\nEnjoy!"
    );
    let reqData = {
      username: username,
      password: password,
    };
    const response = (data) => {
      if (data["error"]) {
        setError(data["error"]);
      } else {
        dispatchAuth({ type: "LOGIN", payload: data });
        setError("");
      }
    };
    e.preventDefault();
    await login(reqData, response);
  };

  return (
    <div className="ml-64">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Sign In
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium leading-6">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300"
                ></input>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md text-black border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300"
                ></input>
              </div>
            </div>
            <div>
              <button
                onSubmit={() => handleSubmit()}
                className="flex w-full justify-center rounded-md bg-[#8bc5bb] hover:bg-[#a3d0c8] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
              >
                Sign in
              </button>
              {error && <div className="error">{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

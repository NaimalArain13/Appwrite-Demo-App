"use client";
import { useState } from "react";
import { account, ID } from "./appwrite";

// Define the correct type for your user preferences or account information
type UserPreferences = {
  email: string;
  name?: string;
  // Add other fields as per the structure returned by account.get()
};

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState<UserPreferences | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register forms


  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
    setLoggedInUser(await account.get());
    setEmail("")
    setPassword("")
    setName("")
    } catch (error) {
      console.log("Login Failed", error)
    }
  };

  const register = async () => {
    try {
      await account.create(ID.unique(), email, password, name);
      // Switch to login form after successful registration
      setIsRegistering(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (error) {
      console.log("Registration Failed", error)
    }
  };

  const logout = async () => {
    await account.deleteSession("current");
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    return (
      <div className="flex flex-col items-center mt-10 text-center">
        <p className="text-xl font-semibold">Logged in as {loggedInUser.name}</p>
        <button
          className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <p className="mb-6 text-2xl font-bold">
      {isRegistering ? "Register" : "Login"}
      </p>
      <form className="flex flex-col w-80 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isRegistering && (
          <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        )}
        
        {isRegistering ? (
          <button
            type="button"
            onClick={register}
            className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            Register
          </button>
        ) : (
          <button
            type="button"
            onClick={() => login(email, password)}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </form>
      <button
        type="button"
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
      </button>
    </div>
  );
};

export default LoginPage;

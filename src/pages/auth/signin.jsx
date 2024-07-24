import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res.ok) {
        console.log("Signin successful");
        window.location.href = "/";
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      alert("Something went wrong, please try again");
    }
  };

  return (
    <div className="flex text-black items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Sign in to figr</h3>
        <form onSubmit={handleSignin}>
          <div className="mt-4">
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 mt-4 text-white bg-black rounded-lg hover:bg-gray-700 w-full"
          >
            Continue to figr
          </button>
          <div className="flex justify-center">
            <p> Don't have an account? &nbsp;</p>
            <Link
              href="/auth/signup"
              className=" text-blue-600 hover:underline"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

import React from "react";
import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10">
    <SignIn routing="path" path="/sign-in" forceRedirectUrl="/" />
  </div>
);

export default SignInPage;

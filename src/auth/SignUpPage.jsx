import React from "react";
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10">
    <SignUp routing="path" path="/sign-up" forceRedirectUrl="/" />
  </div>
);

export default SignUpPage;

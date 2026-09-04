import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Afghan Safar Admin Panel",
  description:
    "Sign in to the Afghan Safar Admin Panel to manage bookings, users, and transportation services securely.",
};

export default function SignIn() {
  return <SignInForm />;
}

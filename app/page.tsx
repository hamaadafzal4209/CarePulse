import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-md">
          <Image
            width={1000}
            height={1000}
            src="/assets/icons/logo-full.svg"
            alt="CarePulse"
            className="h-10 w-fit mb-8"
          />

          <PatientForm/>

          <div className="text-14-regular mt-20 flex items-center justify-between">
            <p className="text-dark-600">© 2024 CarePualse </p>
            <p className="text-green-500">
              <Link href="/?admin=true">Admin</Link>
            </p>
          </div>
        </div>
      </section>
      <Image
        width={1000}
        height={1000}
        src="/assets/images/onboarding-img.png"
        alt="Patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;

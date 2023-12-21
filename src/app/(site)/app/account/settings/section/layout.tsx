import { ReactNode } from "react";
import { SettingsAside } from "../components/settings-aside";
import { BackwardsNav } from "@/components/feature/nav/backwards";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex justify-start items-start">
      <div className="lg:inline-block hidden w-[25rem] h-screen sticky top-0 border-r border-neutral-300 dark:border-neutral-700">
        <SettingsAside />
      </div>
      <div className="flex flex-col w-full min-h-screen h-full">
        <div className="w-full flex items-start justify-center min-h-screen h-full">
          <div className="flex flex-col gap-4 w-full max-w-2xl items-center justify-start py-10 sm:px-0 px-5">
            <header className="w-full flex">
              <div className="inline-block lg:hidden">
                <BackwardsNav />
              </div>
            </header>
            {children}
          </div>
        </div>
        <SettingsFooter />
      </div>
    </div>
  );
}

export function SettingsFooter() {
  return (
    <footer className="bg-neutral-200 rounded-lg shadow dark:bg-cm-gray">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Flowbite
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Flowbite™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";
import Image from "../public/image.jpg";
const Index = () => {
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(today);
  return (
    <div className="flex w-full flex-col items-center justify-center p-5">
      <div className="lg:w-2.5/5 mx-auto w-11/12 pt-14 sm:w-11/12 md:w-2/3 xl:w-2/5">
        <div className="mb-5 overflow-hidden rounded-lg">
          <img
            className="mx-auto mb-5 block h-full w-full"
            src={Image}
            alt=""
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Welcome To Facebook Protect.</h1>
          <p className="my-5">
            Your page&#39;s accessibility is limited, so we ask that higher
            security requirements be applied to that account. We created this
            security program to unlock your Pages.
            <a
              className="block text-blue-500 hover:underline"
              href="https://www.facebook.com/help"
              target="_blank"
            >
              More information
            </a>
          </p>
          <div className="px-[14px]">
            <ol className="relative border-s-2 border-gray-200 text-gray-500">
              <li className="mb-10 ms-6">
                <span className="absolute -start-[14px] flex h-6 w-6 items-center justify-center rounded-full bg-[#C4C4C4] ring-4 ring-white">
                  <svg
                    className="h-3 w-3 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    ></path>
                  </svg>
                </span>
                <h3 className="text-black">
                  We&#39;ve enabled advanced protections to unlock your Page.
                </h3>
              </li>
              <li className="mb-10 ms-6">
                <span className="absolute -start-[14px] flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 ring-4 ring-white">
                  <svg
                    className="h-3 w-3 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z"></path>
                  </svg>
                </span>
                <h3 className="text-black">
                  Below, we walk you through the process in detail and help you
                  fully activate to unlock your Page.
                </h3>
              </li>
            </ol>
          </div>
          <Link
            className="block w-full cursor-pointer rounded-lg bg-blue-500 py-3 text-center text-lg font-semibold text-white sm:py-3 xl:py-3"
            to={"/home"}
          >
            Continue
          </Link>
          <p className="mb-5 mt-3 block text-center">
            Your page was restricted on <strong>{formattedDate}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

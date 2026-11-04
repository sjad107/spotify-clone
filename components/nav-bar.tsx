"use client";
import * as Separator from "@radix-ui/react-separator";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "./icons";
import { cn } from "@/lib/utils";

const NavBar = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        `hidden md:flex md:flex-row md:justify-between md:items-center md:relative md:h-[64px] md:p-2 md:w-full`,
        className
      )}
    >
      <div className="m-5 z-10">
        <Link href="/">
          <Image
            src="/images/Spotify_Primary_Logo_RGB_White.png"
            alt="Logo"
            width={32}
            height={32}
          />
        </Link>
      </div>
      <div className="flex justify-center items-center w-full absolute left-0 right-0 flex-grow flex-shrink z-0">
        <div className="flex flex-row items-center justify-center flex-grow flex-shrink max-w-[546px] min-w-[350px] gap-x-2 ">
          <Link
            href={"/"}
            className="ms-2 p-3 relative w-12 h-12 bg-neutral-800 rounded-full flex justify-center items-center"
          >
            <span className="flex justify-center items-center text-center">
              {pathname === "/" ? <Icons.HomeIconActive /> : <Icons.HomeIcon />}
            </span>
          </Link>
          <div className="relative w-full max-w-md h-12">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 w-12 h-12">
              <Icons.SearchIcon />
            </div>
            <input
              type="search"
              placeholder="What do you want to play?"
              className="w-full py-2 pl-12 pr-16 font-normal text-base text-zinc- bg-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-50 focus:border-grey-50 h-full"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Separator.Root
                className="h-6 w-[1px] bg-gray-500 "
                decorative
                orientation="vertical"
                style={{ margin: "0 15px" }}
              />
              <Link href={"/search"}>
                {pathname === "/search" ? (
                  <Icons.BrowseIconActive />
                ) : (
                  <Icons.BrowseIcon />
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-x-2 z-10 ">
        <button className="bg-white rounded-full h-8 flex items-center justify-center">
          <span className="text-black py-1 px-4 font-bold text-sm">
            Explore Premium
          </span>
        </button>
        <Link href="https://open.spotify.com/" target="_blank" rel="noreferrer">
          <span className=" text-white py-1 px-4 font-bold text-sm flex justify-center items-center gap-x-2">
            <span className="text-center">
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="fill-current w-4 h-4"
              >
                <path d="M4.995 8.745a.75.75 0 0 1 1.06 0L7.25 9.939V4a.75.75 0 0 1 1.5 0v5.94l1.195-1.195a.75.75 0 1 1 1.06 1.06L8 12.811l-.528-.528a.945.945 0 0 1-.005-.005L4.995 9.805a.75.75 0 0 1 0-1.06z"></path>
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z"></path>
              </svg>
            </span>
            <span className="text-center">Install App</span>
          </span>
        </Link>
        <div className=" h-8 w-8 flex items-center justify-center">
          <button>
            <svg
              data-encore-id="icon"
              role="img"
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="fill-current w-4 h-4"
            >
              <path d="M8 1.5a4 4 0 0 0-4 4v3.27a.75.75 0 0 1-.1.373L2.255 12h11.49L12.1 9.142a.75.75 0 0 1-.1-.374V5.5a4 4 0 0 0-4-4zm-5.5 4a5.5 5.5 0 0 1 11 0v3.067l2.193 3.809a.75.75 0 0 1-.65 1.124H10.5a2.5 2.5 0 0 1-5 0H.957a.75.75 0 0 1-.65-1.124L2.5 8.569V5.5zm4.5 8a1 1 0 1 0 2 0H7z"></path>
            </svg>
          </button>
        </div>
        <button className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
          <Image src="/images/pfp.webp" alt="Profile" width={40} height={40} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;

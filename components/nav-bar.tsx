"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loginHref } from "@/lib/session";
import { useAuth } from "./auth-provider";
import { useCloneNotice } from "./clone-notice";
import * as Icons from "./icons";
import NavBarSearch from "./nav-bar-search";
import ProfileMenu from "./profile-menu";
import { cn } from "@/lib/utils";

function InstallAppLink() {
  const { showCloneNotice } = useCloneNotice();
  return (
    <button
      type="button"
      onClick={() => showCloneNotice("Install App")}
      className="hidden xl:block text-spotify-subdued hover:text-white hover:scale-105 transition"
    >
      <span className="py-1 px-4 font-bold text-sm flex justify-center items-center gap-x-2">
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
    </button>
  );
}

function HomeButton({ active }: { active: boolean }) {
  return (
    <Link
      href={"/"}
      aria-label="Home"
      className="ms-2 p-3 relative w-12 h-12 shrink-0 bg-neutral-800 rounded-full flex justify-center items-center transition hover:scale-105 hover:bg-spotify-elevated"
    >
      <span className="flex justify-center items-center text-center">
        {active ? <Icons.HomeIconActive /> : <Icons.HomeIcon />}
      </span>
    </Link>
  );
}

function Logo() {
  return (
    <Link href="/" aria-label="Home">
      <Image
        src="/images/Spotify_Primary_Logo_RGB_White.png"
        alt="Logo"
        width={32}
        height={32}
      />
    </Link>
  );
}

const GUEST_LINKS = ["Premium", "Support", "Download"];

/** Logged out, the search sits beside the logo and links fill the right. */
function GuestNav({ pathname }: { pathname: string }) {
  const { showCloneNotice } = useCloneNotice();
  return (
    <div className="hidden md:flex md:h-[64px] md:shrink-0 md:items-center md:justify-between md:gap-4 md:p-2 md:w-full">
      <div className="flex min-w-0 flex-1 items-center gap-x-2">
        <div className="mx-3 shrink-0">
          <Logo />
        </div>
        <HomeButton active={pathname === "/"} />
        <NavBarSearch className="max-w-[474px]" />
      </div>
      <div className="relative z-50 flex shrink-0 items-center">
        <div className="hidden items-center gap-x-2 border-r border-white/50 pr-6 mr-2 lg:flex">
          {GUEST_LINKS.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => showCloneNotice(link)}
              className="px-1 text-base font-bold text-spotify-subdued transition hover:scale-105 hover:text-white"
            >
              {link}
            </button>
          ))}
        </div>
        <InstallAppLink />
        <Link
          href={loginHref(pathname, "signup")}
          className="px-3 text-sm font-bold text-spotify-subdued transition hover:scale-105 hover:text-white"
        >
          Sign up
        </Link>
        <Link
          href={loginHref(pathname)}
          className="ml-2 flex h-12 items-center rounded-full bg-white px-8 text-base font-bold text-black transition hover:scale-105"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

const NavBar = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { showCloneNotice } = useCloneNotice();

  if (!user) return <GuestNav pathname={pathname} />;

  return (
    <div
      className={cn(
        `hidden md:flex md:flex-row md:justify-between md:items-center md:relative md:h-[64px] md:shrink-0 md:p-2 md:w-full`,
        className
      )}
    >
      <div className="m-5 z-10">
        <Logo />
      </div>
      <div className="flex justify-center items-center w-full absolute left-0 right-0 flex-grow flex-shrink z-0 pointer-events-none">
        <div className="pointer-events-auto flex flex-row items-center justify-center flex-grow flex-shrink max-w-[546px] min-w-[350px] gap-x-2 ">
          <HomeButton active={pathname === "/"} />
          <NavBarSearch className="max-w-[474px]" />
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-x-2 z-50">
        <button
          type="button"
          onClick={() => showCloneNotice("Premium")}
          className="hidden lg:flex bg-white rounded-full h-8 items-center justify-center transition hover:scale-105">
          <span className="text-black py-1 px-4 font-bold text-sm">
            Explore Premium
          </span>
        </button>
        <InstallAppLink />
        <div className=" h-8 w-8 flex items-center justify-center">
          <button
            type="button"
            aria-label="What's New"
            onClick={() => showCloneNotice("What's New")}
            className="text-spotify-subdued hover:text-white hover:scale-105 transition"
          >
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
        <ProfileMenu />
      </div>
    </div>
  );
};

export default NavBar;

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  displayNameFromEmail,
  loginHref,
  maskEmail,
} from "@/lib/session";
import { useAuth } from "./auth-provider";

const CODE_LENGTH = 6;

const SOCIAL_PROVIDERS = [
  { name: "Google", Icon: FcGoogle, className: "" },
  { name: "Facebook", Icon: FaFacebook, className: "text-[#1877f2]" },
  { name: "Apple", Icon: FaApple, className: "text-white" },
];

const SOCIAL_USER_NAME = "Demo User";

interface LoginFormProps {
  nextPath: string;
  signup: boolean;
}

/**
 * The mock login: an email, then a code. Any values work, and neither is sent
 * anywhere or kept. Only a display name goes into the session cookie. There's
 * deliberately no password field, so nobody is asked to type a real one into a
 * page that looks like Spotify.
 */
export default function LoginForm({ nextPath, signup }: LoginFormProps) {
  const router = useRouter();
  const { logIn } = useAuth();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState<string | null>(null);

  const finish = (name: string) => {
    logIn(name);
    router.replace(nextPath);
    router.refresh();
  };

  return (
    <main className="spotify-scrollbar flex h-full flex-col items-center overflow-y-auto bg-spotify-base px-6 text-white">
      <div className="flex w-full max-w-[324px] flex-1 flex-col items-center pb-8 pt-[104px]">
        {step === "email" ? (
          <>
            <Link href="/" aria-label="Home">
              <Image
                src="/images/Spotify_Primary_Logo_RGB_White.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </Link>
            {/* Wider than the form, as Figtree runs wider than Spotify's font. */}
            <h1 className="mt-3 self-stretch text-center text-4xl font-extrabold leading-tight sm:-mx-10 sm:text-5xl sm:leading-tight">
              {signup ? "Sign up to start listening" : "Welcome back"}
            </h1>

            <form
              noValidate
              className="mt-8 w-full"
              onSubmit={(event) => {
                event.preventDefault();
                if (!email.trim()) {
                  setError("Please enter your email address.");
                  return;
                }
                setError(null);
                setStep("code");
              }}
            >
              <label htmlFor="email" className="text-sm font-bold">
                Email
              </label>
              <input
                id="email"
                type="text"
                inputMode="email"
                autoComplete="off"
                value={email}
                aria-invalid={error !== null}
                aria-describedby={error ? "login-error" : undefined}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12 w-full rounded bg-spotify-base px-3 text-base text-white shadow-[inset_0_0_0_1px_#7c7c7c] transition-shadow hover:shadow-[inset_0_0_0_1px_white] focus:shadow-[inset_0_0_0_2px_white] focus:outline-none"
              />
              {error && (
                <p id="login-error" role="alert" className="mt-2 text-sm text-[#f3727f]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="mt-4 h-12 w-full rounded-full bg-spotify-green text-base font-bold text-black transition hover:scale-[1.02] hover:bg-spotify-green-hover"
              >
                Continue
              </button>
            </form>

            <p className="my-4 text-base">or</p>

            <div className="flex w-full flex-col gap-2">
              {SOCIAL_PROVIDERS.map(({ name, Icon, className }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => finish(SOCIAL_USER_NAME)}
                  className="relative h-12 w-full rounded-full border border-spotify-muted text-base font-bold transition hover:border-white"
                >
                  <Icon
                    aria-hidden="true"
                    className={`absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 ${className}`}
                  />
                  Continue with {name}
                </button>
              ))}
            </div>

            <p className="mt-16 text-base text-spotify-subdued">
              {signup ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Link
              href={signup ? loginHref(nextPath) : loginHref(nextPath, "signup")}
              className="mt-3 text-base font-bold hover:underline"
            >
              {signup ? "Log in" : "Sign up"}
            </Link>
          </>
        ) : (
          <CodeStep
            email={email}
            onBack={() => setStep("email")}
            onDone={() => finish(displayNameFromEmail(email))}
          />
        )}
      </div>

      <p className="max-w-[324px] pb-6 text-center text-xs text-spotify-subdued">
        Personal UI clone with a demo login. Nothing you enter is sent anywhere.
        Please don&apos;t use real account details.
      </p>
    </main>
  );
}

function CodeStep({
  email,
  onBack,
  onDone,
}: {
  email: string;
  onBack: () => void;
  onDone: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(() =>
    Array(CODE_LENGTH).fill("")
  );
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const setFrom = (start: number, text: string) => {
    const chars = text.replace(/\D/g, "").slice(0, CODE_LENGTH - start).split("");
    if (chars.length === 0) return;
    setDigits((current) => {
      const updated = [...current];
      chars.forEach((char, offset) => {
        updated[start + offset] = char;
      });
      return updated;
    });
    setError(null);
    inputs.current[Math.min(start + chars.length, CODE_LENGTH - 1)]?.focus();
  };

  return (
    <div className="w-full">
      <button
        type="button"
        aria-label="Back"
        onClick={onBack}
        className="-ml-1 text-spotify-subdued transition hover:text-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <h1 className="mt-4 break-words text-2xl font-bold leading-tight">
        Enter the code for {maskEmail(email)}
      </h1>
      <p className="mt-2 text-sm text-spotify-subdued">
        This is a demo, so no code is sent. Any {CODE_LENGTH} digits will work.
      </p>

      <form
        noValidate
        className="mt-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (digits.some((digit) => !digit)) {
            setError(`Enter all ${CODE_LENGTH} digits.`);
            return;
          }
          onDone();
        }}
      >
        <div className="flex justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputs.current[index] = element;
              }}
              aria-label={`Digit ${index + 1}`}
              inputMode="numeric"
              autoComplete="off"
              autoFocus={index === 0}
              value={digit}
              onChange={(event) => setFrom(index, event.target.value)}
              onPaste={(event) => {
                event.preventDefault();
                setFrom(index, event.clipboardData.getData("text"));
              }}
              onKeyDown={(event) => {
                if (event.key !== "Backspace") return;
                event.preventDefault();
                const target = digit ? index : Math.max(0, index - 1);
                setDigits((current) => {
                  const updated = [...current];
                  updated[target] = "";
                  return updated;
                });
                inputs.current[target]?.focus();
              }}
              onFocus={(event) => event.target.select()}
              className="h-14 w-11 rounded bg-spotify-base text-center text-xl text-white shadow-[inset_0_0_0_1px_#7c7c7c] focus:shadow-[inset_0_0_0_2px_white] focus:outline-none"
            />
          ))}
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-[#f3727f]">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-8 h-12 w-full rounded-full bg-spotify-green text-base font-bold text-black transition hover:scale-[1.02] hover:bg-spotify-green-hover"
        >
          Next
        </button>
      </form>
    </div>
  );
}

import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          800: "rgb(31, 31, 31)",
        },
        // Values read from the computed --background-* / --text-* tokens on
        // open.spotify.com.
        spotify: {
          base: "#121212",
          highlight: "#1f1f1f",
          elevated: "#2a2a2a",
          card: "#181818",
          subdued: "#b3b3b3",
          muted: "#7c7c7c",
          green: "#1ed760",
          "green-hover": "#3be477",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

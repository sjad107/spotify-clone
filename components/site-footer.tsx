import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const COLUMNS = [
  { title: "Company", links: ["About", "Jobs", "For the Record"] },
  {
    title: "Communities",
    links: ["For Artists", "Developers", "Advertising", "Investors", "Vendors"],
  },
  {
    title: "Useful links",
    links: ["Support", "Free Mobile App", "Popular by Country", "Import your music"],
  },
  {
    title: "Plans",
    links: ["Premium Individual", "Premium Duo", "Premium Family", "Premium Student", "Free"],
  },
];

const LEGAL_LINKS = [
  "Legal",
  "Safety & Privacy Center",
  "Privacy Policy",
  "Cookies",
  "About Ads",
  "Accessibility",
];

const SOCIALS = [
  { label: "Instagram", Icon: FaInstagram },
  { label: "Twitter", Icon: FaTwitter },
  { label: "Facebook", Icon: FaFacebookF },
];

export default function SiteFooter() {
  return (
    <footer className="mt-10 px-4 pb-10 pt-8 md:px-8">
      <div className="flex flex-wrap justify-between gap-8">
        <div className="flex flex-wrap gap-x-16 gap-y-8">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-2 text-base font-bold">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-base text-spotify-subdued hover:text-white hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          {SOCIALS.map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-spotify-elevated text-white hover:bg-[#727272]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      <hr className="my-8 border-white/10" />
      <div className="flex flex-wrap justify-between gap-4 text-sm text-spotify-subdued">
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <li key={link}>
              <a href="#" className="hover:text-white">
                {link}
              </a>
            </li>
          ))}
        </ul>
        <span>Personal UI clone with mock data</span>
      </div>
    </footer>
  );
}

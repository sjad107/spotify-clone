import Link from "next/link";

interface StretchedActionProps {
  href?: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * A card's main action, usually stretched over the card with `after:inset-0`.
 * Items with a page link to it. Items without one run onClick instead.
 */
export default function StretchedAction({
  href,
  onClick,
  className,
  children,
}: StretchedActionProps) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

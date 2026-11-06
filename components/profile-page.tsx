"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { toCard } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useCloneNotice } from "./clone-notice";
import CollectionTrackRow from "./collection-track-row";
import { titleSizeClass } from "./collection-view";
import CoverArt from "./cover-art";
import { MoreIcon } from "./icons";
import { usePanel } from "./panel-provider";
import ProfileEditDialog from "./profile-edit-dialog";
import Shelf from "./shelf";
import SiteFooter from "./site-footer";
import { useProfile, type ProfileView } from "./use-profile";
import UserAvatar from "./user-avatar";

const TOP_TRACKS_ON_PAGE = 4;

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

export function ProfileAvatar({
  profile,
  className,
}: {
  profile: ProfileView;
  className?: string;
}) {
  if (profile.isMe) return <UserAvatar className={className} />;
  return (
    <CoverArt
      seed={profile.id}
      shape="circle"
      variant={profile.hasPhoto ? "person" : "placeholder"}
      className={className}
    />
  );
}

function ShelfHeading({
  title,
  href,
  privateNote,
}: {
  title: string;
  href: string;
  privateNote?: boolean;
}) {
  return (
    <div className="mb-2 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="truncate text-2xl font-bold">
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        </h2>
        {privateNote && (
          <p className="text-sm text-spotify-subdued">Only visible to you</p>
        )}
      </div>
      <Link
        href={href}
        className="shrink-0 text-sm font-bold text-spotify-subdued hover:underline"
      >
        Show all
      </Link>
    </div>
  );
}

/** Like the real page, private shelves get a subtitle, so they get their own heading. */
function ProfileShelf({
  title,
  href,
  privateNote,
  items,
}: {
  title: string;
  href: string;
  privateNote?: boolean;
  items: ReturnType<typeof toCard>[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mb-4">
      <ShelfHeading title={title} href={href} privateNote={privateNote} />
      <Shelf items={items} />
    </section>
  );
}

function ProfileMenu({
  profile,
  onEdit,
}: {
  profile: ProfileView;
  onEdit: () => void;
}) {
  const { copyPath } = usePanel();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const items = [
    ...(profile.isMe ? [{ label: "Edit profile", onSelect: onEdit }] : []),
    {
      label: "Copy link to profile",
      onSelect: () => copyPath(`/user/${profile.id}`),
    },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={`More options for ${profile.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 w-8 items-center justify-center text-spotify-subdued transition hover:scale-105 hover:text-white"
      >
        <MoreIcon className="h-6 w-6" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-40 mt-1 w-56 rounded bg-spotify-elevated p-1 shadow-[0_16px_24px_rgba(0,0,0,0.3),0_6px_8px_rgba(0,0,0,0.2)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              className="flex h-10 w-full items-center rounded-sm px-3 text-left text-sm text-white/90 hover:bg-white/10"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage({ profileId }: { profileId: string }) {
  const profile = useProfile(profileId);
  const { followedNames, toggleFollow } = usePanel();
  const [editing, setEditing] = useState(false);
  const { showCloneNotice } = useCloneNotice();

  // The route checks the id, and /user/me sends guests to log in.
  if (!profile) return null;

  const base = `/user/${profile.id}`;
  const followingCount =
    profile.following.artists.length + profile.following.profiles.length;
  const following = followedNames.has(profile.name);
  const cards = <T extends Parameters<typeof toCard>[0]>(items: T[]) =>
    items.map((item) => toCard(item, { playlistSubtitle: "owner" }));

  const avatar = (
    <ProfileAvatar
      profile={profile}
      className="h-full w-full shadow-[0_4px_60px_rgba(0,0,0,0.5)]"
    />
  );

  return (
    <div className="relative flex min-h-full flex-col">
      <header
        className="flex items-end gap-6 px-4 pb-6 pt-6 md:px-6 [@container_(max-width:520px)]:flex-col [@container_(max-width:520px)]:items-start"
        style={{
          backgroundColor: profile.tint,
          backgroundImage:
            "linear-gradient(transparent 0, rgba(0,0,0,0.5) 100%)",
        }}
      >
        <div className="h-[clamp(128px,24cqw,232px)] w-[clamp(128px,24cqw,232px)] shrink-0">
          {profile.isMe ? (
            <button
              type="button"
              aria-label="Choose photo"
              onClick={() => setEditing(true)}
              className="group relative h-full w-full rounded-full"
            >
              {avatar}
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/70 text-base text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                Choose photo
              </span>
            </button>
          ) : (
            avatar
          )}
        </div>
        <div className="min-w-0 flex-1 text-sm">
          <div className="text-white">Profile</div>
          <h1
            // The size goes first: a later font size would discard leading-*.
            className={cn(
              titleSizeClass(profile.name),
              "my-1 break-words font-extrabold leading-tight text-white"
            )}
          >
            {profile.isMe ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-left"
              >
                {profile.name}
              </button>
            ) : (
              profile.name
            )}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-1 text-white/70">
            {profile.playlists.length > 0 && (
              <span>
                {plural(profile.playlists.length, "Public Playlist")} •
              </span>
            )}
            <Link href={`${base}/followers`} className="text-white hover:underline">
              {plural(profile.followers.length, "Follower")}
            </Link>
            <span>•</span>
            <Link href={`${base}/following`} className="text-white hover:underline">
              {followingCount} Following
            </Link>
          </div>
        </div>
      </header>

      <div className="relative flex-1 bg-spotify-base">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[232px]"
          style={{
            backgroundImage: `linear-gradient(color-mix(in srgb, ${profile.tint} 35%, #121212), transparent)`,
          }}
        />

        <div className="relative z-20 flex items-center gap-6 px-4 py-6 md:px-6">
          {profile.isMe ? (
            <button
              type="button"
              aria-label="Go to settings"
              onClick={() => showCloneNotice("Settings")}
              className="text-spotify-subdued transition hover:scale-105 hover:text-white"
            >
              <Settings className="h-7 w-7" />
            </button>
          ) : (
            <button
              type="button"
              aria-pressed={following}
              onClick={() => toggleFollow(profile.name, "profile")}
              className="h-8 rounded-full border border-spotify-muted px-4 text-sm font-bold text-white transition hover:scale-105 hover:border-white"
            >
              {following ? "Following" : "Follow"}
            </button>
          )}
          <ProfileMenu profile={profile} onEdit={() => setEditing(true)} />
        </div>

        <div className="relative px-4 pb-8 md:px-6">
          {profile.isMe && (
            <>
              <ProfileShelf
                title="Top artists this month"
                href={`${base}/top/artists`}
                privateNote
                items={cards(profile.topArtists)}
              />
              <section className="mb-8">
                <ShelfHeading
                  title="Top tracks this month"
                  href={`${base}/top/tracks`}
                  privateNote
                />
                <div role="table" aria-label="Top tracks this month">
                  {profile.topTracks.slice(0, TOP_TRACKS_ON_PAGE).map((track, index) => (
                    <CollectionTrackRow
                      key={track.id}
                      kind="profile"
                      track={track}
                      index={index}
                      list={profile.topTracks}
                      sourceId="profile:top-tracks"
                      sourceName="Top tracks this month"
                      view="list"
                    />
                  ))}
                </div>
              </section>
            </>
          )}
          <ProfileShelf
            title="Public Playlists"
            href={`${base}/playlists`}
            items={cards(profile.playlists)}
          />
          {profile.isMe && (
            <ProfileShelf
              title="Recently played artists"
              href={`${base}/recently-played-artists`}
              items={cards(profile.recentArtists)}
            />
          )}
          <ProfileShelf
            title="Followers"
            href={`${base}/followers`}
            items={cards(profile.followers)}
          />
          <ProfileShelf
            title="Following"
            href={`${base}/following`}
            items={cards([
              ...profile.following.artists,
              ...profile.following.profiles,
            ])}
          />
        </div>
      </div>

      <SiteFooter />

      {profile.isMe && (
        <ProfileEditDialog open={editing} onOpenChange={setEditing} />
      )}
    </div>
  );
}

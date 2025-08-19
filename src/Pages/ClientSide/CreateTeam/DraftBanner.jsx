import React, { useEffect, useState } from "react";

const DraftBanner = ({ locked, infoMsg, hasTeam, lockMsg, unlockAt, hasLocalSelection, openUntil, isNewUser, hydrating, bannerKey }) => {
  const [remaining, setRemaining] = useState("");
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    const targetTime = locked ? unlockAt : openUntil;
    if (!targetTime) { setRemaining(""); return; }
    const target = new Date(targetTime).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      setRemaining(`${days}d ${hours}h ${minutes}m`);
    }, 1000);
    return () => clearInterval(timer);
  }, [locked, unlockAt, openUntil]);

  // Load previously computed banner content during hydration to avoid default fallback flash
  useEffect(() => {
    if (!hydrating || !bannerKey) return;
    try {
      const raw = localStorage.getItem(bannerKey);
      if (raw) setSnapshot(JSON.parse(raw));
    } catch {}
  }, [hydrating, bannerKey]);
  
  const bannerContent = () => {
    if (locked) {
      return {
        title: "Your draft is locked.",
        desc: lockMsg || (remaining ? `Unlocks in ${remaining}` : "You can’t update your team for now."),
      };
    }
    // Strict new user (persisted) -> welcome
    if (isNewUser) {
      return {
        title: "Welcome to the Draft!",
        desc: "Build your dream team and save to start the lock cycle.",
      };
    }
    // In-progress (no saved team yet) but has local picks
    if (!hasTeam && hasLocalSelection) {
      return {
        title: "Continue building your team",
        desc: "You're almost there. Add members and confirm your lineup.",
      };
    }
    // Saved team and draft is open (not locked) with an open window timer
    if (hasTeam && !locked && openUntil && remaining) {
      return {
        title: "Draft is open",
        desc: `You can update your team now. Window closes in ${remaining}.`,
      };
    }
    if (infoMsg) {
      return {
        title: "Draft Status",
        desc: infoMsg,
      };
    }
    // Final fallbacks to avoid generic message
    if (hasTeam) {
      return { title: "Draft is open", desc: "You can update your team now." };
    }
    return { title: "Continue building your team", desc: "Pick members and confirm your lineup." };
  };

  const computed = bannerContent();
  const { title, desc } = hydrating && snapshot ? snapshot : computed;

  // Persist snapshot when we have a solid computed state (not during hydration)
  useEffect(() => {
    if (hydrating || !bannerKey) return;
    try {
      localStorage.setItem(bannerKey, JSON.stringify({ title, desc }));
    } catch {}
  }, [hydrating, bannerKey, title, desc]);

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-[#7B4DFE] via-[#7B4DFE] to-[#B393FE] px-4 py-3 sm:px-6 sm:py-4 h-[130px] sm:h-[100px]">
        <div className="flex-1">
          <div className="text-xl sm:text-2xl text-white mb-1">{title}</div>
          <div className="text-purple-100 text-sm sm:text-sm">{desc}</div>
        </div>
        <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-6">
          <img
            src="/img/music.png"
            alt="Music Banner"
            className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default DraftBanner;



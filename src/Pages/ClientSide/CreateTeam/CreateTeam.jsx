import React, { useEffect, useState } from "react";
import {
  fetchDraftableArtists,
  fetchUserTeam,
  submitDraft,
  updateDraft,
} from "../../../Services/Api";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Components/Loader";
import ConfirmModal from "../../../Components/Client/ConfirmModal";
import { FaCheck } from "react-icons/fa";
import DraftBanner from "./DraftBanner";
import TierCarousel from "./TierCarousel";
import TeamSidebar from "./TeamSidebar";
import StatusToast from "./StatusToast";
import SaveStatusModal from "./SaveStatusModal";

const TIERS = [
  { label: "Legends", value: "Legend", max: 1, required: true },
  { label: "Trending", value: "Trending", max: 2, required: true },
  { label: "Breakout", value: "Breakout", max: 2, required: true },
  { label: "Standard", value: "Standard", max: 2, required: false }, // Made optional
];
const filterOptions = [
  { label: "All", value: "all" },
  { label: "Legends", value: "legend" },
  { label: "Trending", value: "trending" },
  { label: "Breakouts", value: "breakout" },
  { label: "Standard", value: "standard" },
];
const user = JSON.parse(sessionStorage.getItem("loginsession"));
export const LOCAL_STORAGE_KEY = `draft_selected_team_${user?.id || "guest"}`;
const USER_HAS_TEAM_KEY = `draft_user_has_team_${user?.id || "guest"}`;
const USER_STARTED_DRAFT_KEY = `draft_user_started_${user?.id || "guest"}`;
console.log("Logged in user from sessionStorage:", user);

const CreateTeam = () => {
  const [filter, setFilter] = useState("all");
  const filteredTiers =
    filter === "all"
      ? TIERS
      : TIERS.filter((tier) => tier.label.toLowerCase() === (filter === 'legend' ? 'legends' : filter));
  const [artists, setArtists] = useState({
    Legend: [],
    Trending: [],
    Breakout: [],
    Standard: [],
  });
  const [selected, setSelected] = useState({
    Legend: [],
    Trending: [],
    Breakout: [],
    Standard: [],
  });
  const [loading, setLoading] = useState(true);
  const [hydrating, setHydrating] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [lockMsg, setLockMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [unlockAt, setUnlockAt] = useState(null);
  const [openUntil, setOpenUntil] = useState(null);
  const [hasTeam, setHasTeam] = useState(false);
  const [hasEverTeam, setHasEverTeam] = useState(() => localStorage.getItem(USER_HAS_TEAM_KEY) === 'true');
  const [hasStartedDraft, setHasStartedDraft] = useState(() => localStorage.getItem(USER_STARTED_DRAFT_KEY) === 'true');
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusType, setStatusType] = useState("success");
  const [statusMsg, setStatusMsg] = useState("");
  const [statusUnlockAt, setStatusUnlockAt] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        console.log("Fetching draftable artists...");

        const legend = await fetchDraftableArtists("Legend");
        const trending = await fetchDraftableArtists("Trending");
        const breakout = await fetchDraftableArtists("Breakout");
        const standard = await fetchDraftableArtists("Standard");

        const allArtists = {
          Legend: legend,
          Trending: trending,
          Breakout: breakout,
          Standard: standard,
        };

        setArtists(allArtists);
        console.log("Artists fetched:", allArtists);

        const userTeam = await fetchUserTeam();
        console.log("Fetched userTeam from API:", userTeam);

        const teamExists = Boolean(userTeam?.userTeam) || (Array.isArray(userTeam?.teamMembers) && userTeam.teamMembers.length > 0);
        if (teamExists) {
          setHasTeam(true);
          setHasEverTeam(true);
          localStorage.setItem(USER_HAS_TEAM_KEY, 'true');
          const prefill = {
            Legend: [],
            Trending: [],
            Breakout: [],
            Standard: [],
          };

          userTeam.teamMembers.forEach((member) => {
            const match = allArtists[member.category]?.find(
              (a) => a._id === member._id
            );
            if (match) {
              prefill[member.category].push(match);
            } else {
              prefill[member.category].push(member); // fallback
            }
          });

          setSelected(prefill);
          sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefill));
          console.log(
            "User team restored and sessionStorage updated:",
            prefill
          );
        } else {
          const saved = sessionStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            setSelected(parsed);
            if (Object.values(parsed).some(arr => arr.length > 0)) {
              setHasStartedDraft(true);
              localStorage.setItem(USER_STARTED_DRAFT_KEY, 'true');
            }
            console.log("Loaded team from sessionStorage:", parsed);
          }
        }

        // Determine lock status: prefer backend flags, else compute 7-day window from lastUpdatedAt/createdAt
        // Determine lock/unlock cycle
const serverLocked = Boolean(userTeam?.userTeam?.isLocked);
let computedLocked = false;
let computedUnlockAt = null;
let computedOpenUntil = null;

const refTimeStr = userTeam?.userTeam?.lastUpdatedAt || userTeam?.userTeam?.createdAt;
if (refTimeStr) {
  const refTime = new Date(refTimeStr).getTime();

  // cycle durations
  const dayMs = 24 * 60 * 60 * 1000;
  const lockDuration = 7 * dayMs;   // 7 din lock
  const openDuration = dayMs;       // 24h unlock

  // time since reference
  const elapsed = Date.now() - refTime;
  const cycleLength = lockDuration + openDuration; // 8 days total

  // cycle kaunsa chal raha hai
  const cyclePos = elapsed % cycleLength;

  if (cyclePos < openDuration) {
    // abhi unlock window chal rahi hai
    computedLocked = false;
    computedOpenUntil = new Date(refTime + elapsed - cyclePos + openDuration).toISOString();
  } else {
    // abhi lock window chal rahi hai
    computedLocked = true;
    computedUnlockAt = new Date(refTime + elapsed - cyclePos + cycleLength).toISOString();
  }
}

if (serverLocked || computedLocked) {
  setLocked(true);
  setUnlockAt(userTeam?.unlockAt || userTeam?.lockedUntil || computedUnlockAt);
  setLockMsg(userTeam?.message || "Your team is currently locked.");
  setOpenUntil(null);
} else {
  setLocked(false);
  setUnlockAt(null);
  setOpenUntil(userTeam?.openUntil || computedOpenUntil);
  if (!teamExists) setInfoMsg("");
}

      } catch (err) {
        console.error("Error during fetchAll:", err);
        const saved = sessionStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSelected(parsed);
          if (Object.values(parsed).some(arr => arr.length > 0)) {
            setHasStartedDraft(true);
            localStorage.setItem(USER_STARTED_DRAFT_KEY, 'true');
          }
          console.log("Fallback: loaded team from sessionStorage:", parsed);
        }
      } finally {
        setLoading(false);
        setHydrating(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return <Loader />;
  }
  const updateSessionStorage = (updatedSelected) => {
    sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSelected));
  };

  const handleSelect = (tier, artist) => {
    if (locked) return;

    const alreadyExists = selected[tier].find((a) => a._id === artist._id);
    if (alreadyExists) {
      setToast("Already added!");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    if (selected[tier].length >= TIERS.find((t) => t.value === tier).max) {
      setToast(`${tier} tier is complete. You cannot add more.`);
      setTimeout(() => setToast(""), 2500);
      return;
    }

    const updated = {
      ...selected,
      [tier]: [...selected[tier], artist],
    };
    setSelected(updated);
    sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    if (!hasStartedDraft) {
      setHasStartedDraft(true);
      localStorage.setItem(USER_STARTED_DRAFT_KEY, 'true');
    }
    setToast("Member added!");
    setTimeout(() => setToast(""), 2000);
    console.log("Artist added:", artist, "Updated selection:", updated);
  };

  const handleRemove = (tier, artistId) => {
    if (locked) return;
    const updated = {
      ...selected,
      [tier]: selected[tier].filter((a) => a._id !== artistId),
    };
    setSelected(updated);
    sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    console.log(`Artist removed from ${tier}:`, artistId, "Updated:", updated);
  };

  const teamIsEmpty = Object.values(selected).every((arr) => arr.length === 0);

  // Updated logic: only check required tiers for completion
  const teamIsComplete = TIERS.filter((tier) => tier.required) // Only check required tiers
    .every((tier) => selected[tier.value].length === tier.max);

  const handleSave = async () => {
    if (locked) return;
    setSaving(true);
    setError("");
    setSuccess("");
    // Validation: check all required tiers
    for (const tier of TIERS.filter((t) => t.required)) {
      if (selected[tier.value].length !== tier.max) {
        setSaving(false);
        setToast(
          `Please select ${tier.max} artist${tier.max > 1 ? "s" : ""} from ${
            tier.label
          }.`
        );
        setTimeout(() => setToast(""), 3000);
        return;
      }
    }
    try {
      // Collect all selected artist IDs
      const draftedArtists = [
        ...selected.Legend.map((a) => a._id),
        ...selected.Trending.map((a) => a._id),
        ...selected.Breakout.map((a) => a._id),
        ...selected.Standard.map((a) => a._id),
      ];

      if (hasTeam) {
        const resp = await updateDraft(draftedArtists);
        setSuccess(resp?.message || "Team updated successfully!");
        setStatusType("success");
        setStatusMsg(resp?.message || "Team updated successfully!");
        if (resp?.lockedUntil) setStatusUnlockAt(resp.lockedUntil);
        setShowStatusModal(true);
        if (resp?.lockedUntil) {
          setLocked(true);
          setUnlockAt(resp.lockedUntil);
          setLockMsg(resp?.message || "Your team is locked.");
          setOpenUntil(null);
        }
      } else {
        const resp = await submitDraft(draftedArtists);
        setSuccess(resp?.message || "Team saved successfully!");
        setStatusType("success");
        setStatusMsg(resp?.message || "Team saved successfully!");
        if (resp?.lockedUntil) setStatusUnlockAt(resp.lockedUntil);
        setShowStatusModal(true);
        if (resp?.lockedUntil) {
          setLocked(true);
          setUnlockAt(resp.lockedUntil);
          setLockMsg(resp?.message || "Your team is locked.");
          setOpenUntil(null);
        }
        setHasTeam(true);
        setHasEverTeam(true);
        localStorage.setItem(USER_HAS_TEAM_KEY, 'true');
      }
      sessionStorage.removeItem(LOCAL_STORAGE_KEY);
      setTimeout(() => {
        setShowStatusModal(false);
        navigate("/my-team");
      }, 2500);
    } catch (e) {
      const data = e?.response?.data;
      const msg = data?.message || data?.error || "Failed to save/update team. Please try again.";
      if (e?.response?.status === 403) {
        setLocked(true);
        setLockMsg(data?.message || "Draft is locked");
        setUnlockAt(data?.unlockAt || null);
        setOpenUntil(null);
      }
      setError(msg);
      setStatusType("error");
      setStatusMsg(msg);
      setStatusUnlockAt(e?.response?.data?.unlockAt || null);
      setShowStatusModal(true);
      setTimeout(() => setShowStatusModal(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-6 p-4">
      <div className="w-full md:w-2/3 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create Team</h2>
        <DraftBanner
          locked={locked}
          infoMsg={infoMsg}
          hasTeam={hasTeam}
          lockMsg={lockMsg}
          unlockAt={unlockAt}
          openUntil={openUntil}
          hasLocalSelection={Object.values(selected).some(arr => arr.length > 0)}
          isNewUser={!hasEverTeam && !hasStartedDraft && !Object.values(selected).some(arr => arr.length > 0)}
          hydrating={hydrating}
          bannerKey={`draft_banner_snapshot_${user?.id || 'guest'}`}
        />
        <div className="bg-[#141634] rounded-lg p-6">
          {/* Main Heading + Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-4xl font-semibold text-white">Artist Draft</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#1f223e] text-white border border-gray-400 rounded-full px-2 py-1"
            >
              <option value="all">All Artists</option>
              <option value="legend">Legend</option>
              <option value="trending">Trending</option>
              <option value="breakout">Breakout</option>
              <option value="standard">Standard</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            {filterOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm transition 
        ${
          filter === f.value
            ? "bg-gradient-to-r from-[#A259FF] to-[#865DFF]"
            : "bg-[#1f223e] border border-[#2f3251]"
        }`}
              >
                <FaCheck className="w-3 h-3" />
                {f.label}
              </button>
            ))}
          </div>

          {/* Tiers */}
          {filteredTiers.map((tier) => (
            <TierCarousel
              key={tier.value}
              tier={tier}
              artists={artists[tier.value]}
              selectedForTier={selected[tier.value]}
              onSelect={handleSelect}
              locked={locked}
              navigate={navigate}
            />
                ))}
              </div>
            </div>
      <TeamSidebar
        tiers={TIERS}
        selected={selected}
        locked={locked}
        onRemove={handleRemove}
        onConfirm={() => setShowConfirmModal(true)}
        saving={saving}
        teamIsComplete={teamIsComplete}
      />
      {toast && <StatusToast message={toast} onClose={() => setToast("")} />}
      {showStatusModal && (
        <SaveStatusModal
          type={statusType}
          message={statusMsg}
          onClose={() => setShowStatusModal(false)}
          unlockAt={statusUnlockAt}
        />
      )}
      {showConfirmModal && (
        <ConfirmModal
          selectedArtists={[
            ...selected.Legend,
            ...selected.Trending,
            ...selected.Breakout,
            ...selected.Standard,
          ]}
          onConfirm={() => {
            setShowConfirmModal(false);
            handleSave(); // This is your original save logic
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default CreateTeam;

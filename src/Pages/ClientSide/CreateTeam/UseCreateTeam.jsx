import { useEffect, useState } from "react";
import {
  fetchDraftableArtists,
  fetchUserTeam,
  submitDraft,
  updateDraft,
} from "../../Services/Api";

const LOCAL_STORAGE_KEY = "draft_selected_team";

const TIERS = [
  { label: "Legends", value: "Legend", max: 1, required: true },
  { label: "Trending", value: "Trending", max: 2, required: true },
  { label: "Breakout", value: "Breakout", max: 2, required: true },
  { label: "Standard", value: "Standard", max: 2, required: false },
];

export const useCreateTeam = (navigate) => {
  const [artists, setArtists] = useState({ Legend: [], Trending: [], Breakout: [], Standard: [] });
  const [selected, setSelected] = useState({ Legend: [], Trending: [], Breakout: [], Standard: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [locked, setLocked] = useState(false);
  const [lockMsg, setLockMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [hasTeam, setHasTeam] = useState(false);
  const [statusModal, setStatusModal] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const fetched = await Promise.all(TIERS.map((tier) => fetchDraftableArtists(tier.value)));
      const formatted = Object.fromEntries(TIERS.map((tier, i) => [tier.value, fetched[i]]));
      setArtists(formatted);

      try {
        const userTeam = await fetchUserTeam();
        setHasTeam(!!userTeam?.teamMembers);
        const prefill = { Legend: [], Trending: [], Breakout: [], Standard: [] };

        userTeam?.teamMembers?.forEach((member) => {
          const category = member.category;
          if (formatted[category]) {
            const match = formatted[category].find((a) => a._id === member._id);
            prefill[category].push(match || member);
          }
        });

        setSelected(prefill);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefill));

        if (userTeam?.userTeam?.isLocked) {
          setLocked(true);
          setLockMsg("You cannot change your team for 12 hours after your last update.");
        } else {
          const diff = (new Date() - new Date(userTeam?.userTeam?.createdAt)) / (1000 * 60 * 60);
          if (diff < 12) setInfoMsg(`You can update your team now. Your lock period starts in ${Math.ceil(12 - diff)} hour(s).`);
        }
      } catch (e) {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) setSelected(JSON.parse(saved));
      }

      setLoading(false);
    };
    fetchAll();
  }, []);

  const updateLocalStorage = (data) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  const handleSelect = (tier, artist) => {
    if (locked || selected[tier].length >= TIERS.find((t) => t.value === tier).max || selected[tier].some((a) => a._id === artist._id)) return;
    const updated = { ...selected, [tier]: [...selected[tier], artist] };
    setSelected(updated);
    updateLocalStorage(updated);
  };

  const handleRemove = (tier, id) => {
    if (locked) return;
    const updated = { ...selected, [tier]: selected[tier].filter((a) => a._id !== id) };
    setSelected(updated);
    updateLocalStorage(updated);
  };

  const teamIsEmpty = Object.values(selected).every((arr) => arr.length === 0);
  const teamIsComplete = TIERS.filter((t) => t.required).every((t) => selected[t.value].length === t.max);

  const handleSave = async () => {
    if (!teamIsComplete || locked) return;
    setSaving(true);
    try {
      const draftedArtists = Object.values(selected).flat().map((a) => a._id);
      hasTeam ? await updateDraft(draftedArtists) : await submitDraft(draftedArtists);
      setStatusModal({ show: true, type: "success", message: hasTeam ? "Team updated successfully!" : "Team saved successfully!" });
      setTimeout(() => navigate("/my-team"), 2500);
    } catch (e) {
      const msg = e?.response?.data?.error || "Failed to save team. Try again.";
      setStatusModal({ show: true, type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return {
    artists,
    selected,
    setSelected,
    handleSelect,
    handleRemove,
    handleSave,
    loading,
    saving,
    locked,
    lockMsg,
    infoMsg,
    toast,
    setToast,
    statusModal,
    setStatusModal,
    teamIsEmpty,
    teamIsComplete,
    TIERS,
  };
};
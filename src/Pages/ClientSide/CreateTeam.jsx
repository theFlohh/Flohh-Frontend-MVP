import React, { useEffect, useState } from "react";
import { fetchDraftableArtists, fetchUserTeam, submitDraft, updateDraft } from "../../Services/Api";
import { useNavigate } from "react-router-dom";

const TIERS = [
  { label: "Legends", value: "Legend", max: 1 },
  { label: "Trending", value: "Trending", max: 2 },
  { label: "Breakout", value: "Breakout", max: 2 },
  { label: "Standard", value: "Standard", max: 2 },
];

const CreateTeam = () => {
  const [artists, setArtists] = useState({ Legend: [], Trending: [], Breakout: [], Standard: [] });
  const [selected, setSelected] = useState({ Legend: [], Trending: [], Breakout: [], Standard: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [lockMsg, setLockMsg] = useState("");
  const [hasTeam, setHasTeam] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const legend = await fetchDraftableArtists("Legend");
      const trending = await fetchDraftableArtists("Trending");
      const breakout = await fetchDraftableArtists("Breakout");
      const standard = await fetchDraftableArtists("Standard");
      setArtists({ Legend: legend, Trending: trending, Breakout: breakout, Standard: standard });
      // Fetch user's existing team
      try {
        const userTeam = await fetchUserTeam();
        if (userTeam && userTeam.teamMembers) {
          setHasTeam(true);
          const prefill = { Legend: [], Trending: [], Breakout: [], Standard: [] };
          userTeam.teamMembers.forEach(member => {
            if (prefill[member.category]) {
              prefill[member.category].push(member.artistId);
            }
          });
          setSelected(prefill);
        }
        // Lock logic
        if (userTeam && userTeam.userTeam) {
          const { isLocked, createdAt } = userTeam.userTeam;
          if (isLocked) {
            setLocked(true);
            setLockMsg("You cannot change your team for 12 hours after your last update.");
          } else if (createdAt) {
            const created = new Date(createdAt);
            const now = new Date();
            const diff = (now - created) / (1000 * 60 * 60); // hours
            if (diff < 12) {
              setLocked(true);
              setLockMsg(`You cant update your team after ${Math.ceil(12 - diff)} hour(s).`);
            }
          }
        }
      } catch (e) { /* ignore if no team */ }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleSelect = (tier, artist) => {
    if (locked) return;
    if (selected[tier].find(a => a._id === artist._id)) return;
    if (selected[tier].length >= TIERS.find(t => t.value === tier).max) return;
    setSelected(prev => ({ ...prev, [tier]: [...prev[tier], artist] }));
  };

  const handleRemove = (tier, artistId) => {
    if (locked) return;
    setSelected(prev => ({ ...prev, [tier]: prev[tier].filter(a => a._id !== artistId) }));
  };

  const teamIsEmpty = Object.values(selected).every(arr => arr.length === 0);
  const teamIsComplete = TIERS.every(tier => selected[tier.value].length === tier.max);

  const handleSave = async () => {
    if (locked) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Collect all selected artist IDs
      const draftedArtists = [
        ...selected.Legend.map(a => a._id),
        ...selected.Trending.map(a => a._id),
        ...selected.Breakout.map(a => a._id),
        ...selected.Standard.map(a => a._id),
      ];
      if (hasTeam) {
        await updateDraft(draftedArtists);
        setSuccess("Team updated successfully!");
      } else {
        await submitDraft(draftedArtists);
        setSuccess("Team saved successfully!");
      }
      setTimeout(() => {
        navigate("/my-team");
      }, 1200);
    } catch (e) {
      if (e?.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError("Failed to save/update team. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row gap-6 p-4 md:p-8">
      {/* Left: Artist selection */}
      <div className="w-full md:w-2/3 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Team</h2>
        {locked && (
          <div className="bg-red-100 text-red-700 rounded-lg px-4 py-3 mb-4 font-semibold text-center">{lockMsg}</div>
        )}
        {TIERS.map(tier => (
          <div key={tier.value}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">{tier.label}</h3>
              <span className="text-xs text-gray-500">Select {tier.max} artist{tier.max > 1 ? 's' : ''} from {tier.label}</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {artists[tier.value].map(artist => (
                <div
                  key={artist._id}
                  className={`min-w-[160px] bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col items-center relative cursor-pointer group ${locked ? 'opacity-60 pointer-events-none' : ''}`}
                  onClick={e => {
                    if (e.target.closest("button")) return;
                    navigate(`/artist/${artist._id}`);
                  }}
                >
                  <img src={artist.image || "/logo192.png"} alt={artist.name} className="w-20 h-20 object-cover rounded-md mb-2 border border-gray-200" />
                  <h4 className="font-semibold text-gray-800 text-base mb-1 text-center">{artist.name}</h4>
                  <p className="text-xs text-gray-500 text-center mb-2">{artist.type || tier.label} Artist</p>
                  <button
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 shadow transition absolute top-2 right-2 z-10"
                    onClick={e => { e.stopPropagation(); handleSelect(tier.value, artist); }}
                    disabled={locked || selected[tier.value].length >= tier.max || selected[tier.value].find(a => a._id === artist._id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Right: Team selection panel */}
      {!teamIsEmpty && (
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-4 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Your Team</h3>
          {TIERS.map(tier => (
            <div key={tier.value} className="mb-2">
              <div className="text-xs text-gray-500 mb-1">{tier.label}</div>
              {selected[tier.value].length === 0 ? (
                <div className="text-gray-300 text-sm italic">Select Artist</div>
              ) : (
                selected[tier.value].map(artist => (
                  <div key={artist._id} className={`flex items-center justify-between rounded-lg p-2 mb-1 ${locked ? 'bg-gray-100' : 'bg-gray-50'} ${locked ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-2">
                      <img src={artist.image || "/logo192.png"} alt={artist.name} className="w-8 h-8 rounded-full object-cover border border-gray-300" />
                      <div>
                        <div className="text-gray-800 font-semibold text-xs">{artist.name}</div>
                        <div className="text-gray-500 text-xs">{artist.type || tier.label} Artist</div>
                      </div>
                    </div>
                    {!locked && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition"
                        onClick={() => handleRemove(tier.value, artist._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
          <button
            className={`mt-2 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition ${!teamIsComplete || saving || locked ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSave}
            disabled={!teamIsComplete || saving || locked}
          >
            {saving ? 'Saving...' : 'Save Team'}
          </button>
          {success && <div className="text-green-600 text-center font-semibold mt-2">{success}</div>}
          {error && <div className="text-red-500 text-center font-semibold mt-2">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default CreateTeam;
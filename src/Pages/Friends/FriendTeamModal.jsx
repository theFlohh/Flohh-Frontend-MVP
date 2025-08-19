import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Badge = ({ text }) => (
  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
    {text}
  </span>
);

const FriendTeamModal = ({ open, user, onClose }) => {
  const navigate = useNavigate();
  const teamMembers = user?.draftedTeam?.teamMembers || [];
  const isLocked = Boolean(user?.draftedTeam?.userTeam?.isLocked);
  const totalPoints = useMemo(() => {
    return teamMembers.reduce((sum, m) => sum + (m?.artistId?.totalScore || 0), 0);
  }, [teamMembers]);

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#121638] text-white w-[95%] max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-[#6C4BF4]/20 to-[#B56DF3]/20">
          <div className="flex items-center gap-3">
            <img
              src={user?.profileImage || user?.image || '/img/b3.png'}
              alt={user?.name || 'User'}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/30"
            />
            <div>
              <div className="text-sm sm:text-base font-semibold">{user?.name || 'Unknown User'}</div>
              <div className="text-[10px] sm:text-xs text-purple-200/80">{user?.email || ''}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge text={isLocked ? 'Locked' : 'Open'} />
            <button onClick={onClose} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-sm">
              Close
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] sm:text-xs text-purple-200/80">Team Members</div>
            <div className="text-lg sm:text-xl font-bold">{teamMembers.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] sm:text-xs text-purple-200/80">Total Score</div>
            <div className="text-lg sm:text-xl font-bold">{totalPoints}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] sm:text-xs text-purple-200/80">Created</div>
            <div className="text-xs sm:text-sm">{user?.draftedTeam?.userTeam?.createdAt ? new Date(user.draftedTeam.userTeam.createdAt).toLocaleDateString() : '-'}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] sm:text-xs text-purple-200/80">Status</div>
            <div className="text-xs sm:text-sm">{isLocked ? 'Draft locked' : 'Draft open'}</div>
          </div>
        </div>

        {/* Members */}
        <div className="px-5 pb-5">
          <div className="text-sm sm:text-base font-semibold mb-3">Team Lineup</div>
          {teamMembers.length === 0 ? (
            <div className="text-purple-200/80 text-sm">No team drafted.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamMembers.map((m) => (
                <div
                  key={m?._id}
                  className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10 cursor-pointer hover:bg-white/10 transition"
                  onClick={() => {
                    const id = m?.artistId?._id;
                    if (id) {
                      if (onClose) onClose();
                      navigate(`/artist/${id}`);
                    }
                  }}
                >
                  <img
                    src={m?.artistId?.image || '/logoflohh.png'}
                    alt={m?.artistId?.name || 'Artist'}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-md object-cover border border-white/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm sm:text-base font-medium truncate">{m?.artistId?.name || 'Unknown'}</div>
                      <Badge text={m?.category || '—'} />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] sm:text-xs text-purple-200/80">
                      <div className="truncate">{(m?.artistId?.genres || []).slice(0, 2).join(', ')}</div>
                      <div className="flex items-center gap-1">
                        <img src="/img/game-icons_two-coins.png" alt="pts" className="w-4 h-4" />
                        <span className="text-white font-semibold">{m?.artistId?.totalScore || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendTeamModal;



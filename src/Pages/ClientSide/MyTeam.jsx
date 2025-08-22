import React, { useEffect, useState } from "react";
import {
  fetchUserTeam,
  fetchUserPointsBreakdown,
  updateDraft,
  fetchMyFriendLeaderboards,
} from "../../Services/Api";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";

const PopupModal = ({ message, onClose }) => (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
      <p className="mb-6 text-lg font-medium">{message}</p>
      <button
        onClick={onClose}
        className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-lg shadow"
      >
        OK
      </button>
    </div>
  </div>
);

const MyTeam = () => {
  const navigate = useNavigate();

  // States - sab top pe
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLeagueUrl, setUserLeagueUrl] = useState(null);
  const [pointsBreakdown, setPointsBreakdown] = useState({
    totalPoints: 0,
    weeklyPoints: 0,
    dailyPoints: 0,
  });
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [teamNameLoading, setTeamNameLoading] = useState(false);
  const [teamNameError, setTeamNameError] = useState("");
  const [teamNameSuccess, setTeamNameSuccess] = useState("");
  const [popupMessage, setPopupMessage] = useState(null);

  // Avatar states
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Share states
  const [isSharing, setIsSharing] = useState(false);

  // const BASE_URL = "http://localhost:3002/";
  const BASE_URL = "https://floahh-backend.onrender.com/";

  useEffect(() => {
    const getTeam = async () => {
      try {
        const [teamData, pointsData, leagueData] = await Promise.all([
          fetchUserTeam(),
          fetchUserPointsBreakdown(),
          fetchMyFriendLeaderboards(),
        ]);

        if (leagueData?.leaderboards?.length > 0) {
          const firstLeague = leagueData.leaderboards[0];
          setUserLeagueUrl(`/leaderboard/friend/${firstLeague._id}`);
        }

        setTeam(teamData);
        setPointsBreakdown(pointsData);
        setNewTeamName(teamData?.userTeam?.teamName || "");
      } catch (err) {
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };
    getTeam();
  }, []);

  const user = team?.userTeam || {};
  const members = team?.teamMembers || [];
  const rank = team?.teamRank || "N/A";
  const totalUserPoints = pointsBreakdown.totalPoints;
  const weeklyPoints = pointsBreakdown.weeklyPoints;
  const teamType = user.type || "Mix";
  const teamName = user.teamName || "";
  // const user = team?.userTeam || {};

  const teamAvatar = team?.userProfileImage?.startsWith("http")
    ? team.userProfileImage
    : team?.userProfileImage
    ? `${BASE_URL}${team.userProfileImage}`
    : user.avatar?.startsWith("http")
    ? user.avatar
    : user.avatar
    ? `${BASE_URL}${user.avatar}`
    : null;

  // Just for debug
  useEffect(() => {
    console.log("Avatar from backend:", team?.userTeam?.avatar);
    console.log("Full URL:", teamAvatar);
    console.log("Full team object from API:", team);
  }, [team]);

  const getCategoryMeta = (category) => {
    switch (category) {
      case "Legend":
        return {
          icon: "/img/medal-yellow.png",
          chip: "bg-yellow-500/20 text-yellow-200 border-yellow-400/30",
        };
      case "Trending":
        return {
          icon: "/img/medal-red.png",
          chip: "bg-red-500/20 text-red-200 border-red-400/30",
        };
      case "Breakout":
        return {
          icon: "/img/medal-purple.png",
          chip: "bg-purple-600/20 text-purple-200 border-purple-500/30",
        };
      case "Standard":
        return {
          icon: "/img/star.png",
          chip: "bg-blue-500/20 text-blue-200 border-blue-400/30",
        };
      default:
        return {
          icon: "/img/star.png",
          chip: "bg-white/10 text-white border-white/20",
        };
    }
  };

  const handleTeamNameSave = async () => {
    if (!newTeamName.trim()) {
      setPopupMessage("❌ Team name cannot be empty.");
      return;
    }
    setTeamNameLoading(true);
    try {
      const draftedArtists = members.map((m) => m.artistId?._id || m.artistId);
      await updateDraft(draftedArtists, newTeamName.trim());
      setEditingTeamName(false);
      setPopupMessage("✅ Team name updated!");
      const updated = await fetchUserTeam();
      setTeam(updated);
    } catch (e) {
      setPopupMessage("❌ Failed to update team name.");
    } finally {
      setTeamNameLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarSave = async () => {
    if (!avatarFile) return;
    const draftedArtists = members.map((m) => m.artistId?._id || m.artistId);
    setTeamNameLoading(true);
    try {
      await updateDraft(
        draftedArtists,
        newTeamName.trim() || teamName,
        avatarFile
      );

      setPopupMessage("✅ Avatar updated successfully!");

      // Fetch updated team with new avatar
      const updated = await fetchUserTeam();

      setTeam(updated);

      // Clear only the file, keep preview until updated state has it
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      setPopupMessage("❌ Failed to update avatar.");
    } finally {
      setTeamNameLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && avatarFile) {
        handleAvatarSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [avatarFile]);

  // Share functionality - Custom Canvas Generator with Artist Images
  const generateTeamImage = async () => {
    return await createCustomTeamCardWithImages();
  };

  // Helper function to load images
  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // Return null if image fails to load
      img.src = src;
    });
  };

  // Create initials avatar as fallback
  const createInitialsAvatar = (name, size = 80) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // Background circle
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Initials text
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size / 3}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, size / 2, size / 2);
    
    return canvas;
  };

  const createCustomTeamCardWithImages = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(0.5, '#312e81');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(teamName || 'My Fantasy Team', canvas.width / 2, 80);
    
    // Points section
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText(`${totalUserPoints.toLocaleString()} Points`, canvas.width / 2, 140);
    
    // Rank and weekly points
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText(`Rank #${rank} • Weekly: ${weeklyPoints.toLocaleString()} pts`, canvas.width / 2, 180);
    
    // Team members section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Team Members:', 60, 240);
    
    // Load all artist images first
    const maxMembers = Math.min(members.length, 5); // Reduced to 5 to accommodate images
    const imagePromises = members.slice(0, maxMembers).map(member => {
      const artist = member.artistId || {};
      // Try to get artist image from various possible sources
      const imageUrl = artist.image || artist.avatar || artist.profileImage || null;
      return imageUrl ? loadImage(imageUrl) : Promise.resolve(null);
    });
    
    const artistImages = await Promise.all(imagePromises);
    
    // Draw team members with images
    const startY = 290;
    const itemHeight = 80;
    const imageSize = 60;
    
    for (let i = 0; i < maxMembers; i++) {
      const member = members[i];
      const artist = member.artistId || {};
      const y = startY + (i * itemHeight);
      const artistImage = artistImages[i];
      
      // Member background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(60, y - 40, canvas.width - 120, 70);
      
      // Draw artist image or initials
      const imageX = 80;
      const imageY = y - 30;
      
      if (artistImage) {
        // Draw circular image
        ctx.save();
        ctx.beginPath();
        ctx.arc(imageX + imageSize/2, imageY + imageSize/2, imageSize/2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(artistImage, imageX, imageY, imageSize, imageSize);
        ctx.restore();
        
        // Add border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(imageX + imageSize/2, imageY + imageSize/2, imageSize/2, 0, 2 * Math.PI);
        ctx.stroke();
      } else {
        // Draw initials avatar
        const initialsCanvas = createInitialsAvatar(artist.name, imageSize);
        ctx.drawImage(initialsCanvas, imageX, imageY);
      }
      
      // Member name (shifted right to accommodate image)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(artist.name || 'Unknown Artist', imageX + imageSize + 15, y - 5);
      
      // Member points
      ctx.fillStyle = '#fbbf24';
      ctx.font = '18px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${(artist.totalScore || 0).toLocaleString()} pts`, canvas.width - 80, y - 5);
      
      // Category badge
      if (member.category) {
        ctx.fillStyle = getCategoryColor(member.category);
        ctx.font = '14px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(member.category.toUpperCase(), imageX + imageSize + 15, y + 15);
      }
    }
    
    // Show remaining members count if more than 5
    if (members.length > 5) {
      const remainingY = startY + (5 * itemHeight) + 20;
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '18px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`... and ${members.length - 5} more team members`, canvas.width / 2, remainingY);
    }
    
    // Footer
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Flohh Fantasy League', canvas.width / 2, canvas.height - 40);
    
    // Decorative elements
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 200);
    ctx.lineTo(canvas.width - 60, 200);
    ctx.stroke();
    
    return canvas.toDataURL('image/png', 0.9);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Legend': return '#fbbf24';
      case 'Trending': return '#ef4444';
      case 'Breakout': return '#a78bfa';
      case 'Standard': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const shareOnTwitter = async () => {
    setIsSharing(true);
    
    try {
      const imageData = await generateTeamImage();
      
      if (imageData) {
        // Check if Web Share API is available and supports files
        if (navigator.share && 'canShare' in navigator) {
          try {
            const response = await fetch(imageData);
            const blob = await response.blob();
            const file = new File([blob], 'my-team.png', { type: 'image/png' });
            
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `Check out my ${teamName || 'Fantasy'} team!`,
                text: `My fantasy league team is crushing it with ${totalUserPoints.toLocaleString()} points! 🏆`,
                files: [file]
              });
              setIsSharing(false);
              return;
            }
          } catch (shareError) {
            console.log('Native share failed, falling back to download + Twitter');
          }
        }
        
        // Fallback: Download image + Open Twitter with text
        const link = document.createElement('a');
        link.download = 'my-fantasy-team.png';
        link.href = imageData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Open Twitter with pre-filled text
        setTimeout(() => {
          const text = `Check out my FLOHH Fantasy dream team! 🏆\n\nCurrent points: ${totalUserPoints.toLocaleString()}\nTeam members: ${members.length}/7\n\n#FantasyLeague #Gaming #FlohFantasy`;
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
          window.open(twitterUrl, '_blank');
        }, 500);
        
        setPopupMessage('🐦 Team image downloaded! Twitter opened - attach the downloaded image to your tweet.');
      } else {
        // If image generation fails, still allow text sharing
        const text = `Check out my FLOHH Fantasy dream team! 🏆\n\nCurrent points: ${totalUserPoints.toLocaleString()}\n\n#FantasyLeague #Gaming #FlohFantasy`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank');
        setPopupMessage('🐦 Opened Twitter with team info!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      setPopupMessage('❌ Share failed. Please try again.');
    }
    
    setIsSharing(false);
  };

  const shareOnInstagram = async () => {
    setIsSharing(true);
    
    try {
      const imageData = await generateTeamImage();
      
      if (imageData) {
        // Check if Web Share API is available and supports files
        if (navigator.share && 'canShare' in navigator) {
          try {
            const response = await fetch(imageData);
            const blob = await response.blob();
            const file = new File([blob], 'my-team.png', { type: 'image/png' });
            
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `My ${teamName || 'Fantasy'} Team`,
                files: [file]
              });
              setIsSharing(false);
              return;
            }
          } catch (shareError) {
            console.log('Native share failed, falling back to download');
          }
        }
        
        // Fallback: Download image for manual sharing
        const link = document.createElement('a');
        link.download = 'my-fantasy-team.png';
        link.href = imageData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setPopupMessage('📸 Team image downloaded! Open Instagram and attach the image to share.');
      } else {
        setPopupMessage('❌ Failed to generate team image. Please try again.');
      }
    } catch (error) {
      console.error('Instagram share failed:', error);
      setPopupMessage('❌ Share failed. Please try again.');
    }
    
    setIsSharing(false);
  };

  // Rendering
  if (loading) return <Loader />;
  // After loading check

  // If no team created yet
  if (error || !team || !team.userTeam) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 max-w-md w-full">
          <div className="text-xl font-bold text-gray-200 text-center flex flex-col items-center">
            <img src="/img/team.png" alt="team" />
            You haven't created a team yet.
          </div>
          <div className="text-gray-500 text-center mb-2">
            Start building your dream team to compete on the leaderboard!
          </div>
          <button
            className="mt-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow transition text-base"
            onClick={() => navigate("/create-team")}
          >
            Create Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {popupMessage && (
        <PopupModal
          message={popupMessage}
          onClose={() => setPopupMessage(null)}
        />
      )}
      <div className="min-h-screen text-white p-4 font-sans relative">
        <div className="max-w-6xl mx-auto relative">
          {/* Banner */}
          <div
            className="relative w-full h-32 sm:h-40 md:h-52 rounded-2xl mb-16 overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url('/img/banner-rect1.png')` }}
          ></div>

          {/* Avatar + Team Name */}
          <div className="flex flex-col sm:flex-row sm:items-center items-start gap-6 sm:gap-10 -mt-13 sm:-mt-24 px-2">
            {/* Avatar */}
            <div className="relative sm:self-center sm:self-start">
              <img
                src={avatarPreview || teamAvatar || "/img/default-avatar.png"}
                alt={teamName || "Team Avatar"}
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-purple-400 object-cover shadow-lg"
              />

              {/* Upload / Save Button */}
              <div className="absolute bottom-0 right-0 flex flex-col gap-2">
                {!avatarFile ? (
                  <label className="bg-purple-500 hover:bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-lg shadow cursor-pointer text-xs sm:text-sm flex items-center justify-center">
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                ) : (
                  <button
                    onClick={handleAvatarSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-lg shadow text-xs sm:text-sm flex items-center justify-center"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>

            {/* Team Info */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-center sm:text-left">
                {editingTeamName || !teamName ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Enter team name"
                      className="h-9 px-2 rounded-md bg-[#2a2d48] border border-purple-500 focus:border-purple-400 text-white placeholder-gray-400 outline-none w-40 sm:w-60"
                    />
                    <button
                      onClick={handleTeamNameSave}
                      disabled={teamNameLoading}
                      className="h-9 px-3 sm:px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-md text-xs sm:text-sm flex items-center justify-center"
                    >
                      {teamNameLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer text-center sm:text-left"
                    onClick={() => setEditingTeamName(true)}
                  >
                    {teamName}
                  </div>
                )}
              </div>
              <div className="text-sm text-yellow-400 flex items-center gap-1 mt-2">
                <img
                  src="/img/game-icons_two-coins.png"
                  alt="coin"
                  className="w-4 h-4 object-contain"
                />
                {totalUserPoints.toLocaleString()} pts
              </div>
            </div>
          </div>

          {/* Stats + Members */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* Left Side Stats */}
            <div className="space-y-6 order-2 md:order-1">
              {/* Rank & Weekly */}
              <div className="border border-[#353751] bg-[#2a2d48] rounded-xl p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                  <div>
                    <div className="text-lg sm:text-xl text-gray-300">Rank</div>
                    <div className="text-xl font-bold text-yellow-300">
                      #{rank}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-lg text-gray-300">
                      Weekly Points
                    </div>
                    <div className="text-sm sm:text-base font-semibold flex items-center gap-1 text-yellow-400">
                      <img
                        src="/img/game-icons_two-coins.png"
                        alt="coin"
                        className="w-5 h-5 object-contain"
                      />
                      {weeklyPoints.toLocaleString()}
                    </div>
                    {userLeagueUrl ? (
                      <button
                        onClick={() => navigate(userLeagueUrl)}
                        className="mt-2 px-3 py-1 text-xs sm:text-sm bg-purple-700 hover:bg-purple-800 text-white rounded-full font-medium"
                      >
                        View League
                      </button>
                    ) : (
                      <span className="mt-2 text-xs text-gray-400 block">
                        No league joined
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Extra Info */}
              <div className="border border-[#353751] bg-[#2a2d48] rounded-xl p-4 shadow-lg space-y-3 text-sm text-white">
                <div className="flex justify-between text-sm sm:text-lg">
                  <span>Total User Pts:</span>
                  <span className="flex items-center gap-1">
                    <img
                      src="/img/game-icons_two-coins.png"
                      alt="coin"
                      className="w-5 h-5 object-contain"
                    />
                    {totalUserPoints >= 1000000
                      ? (totalUserPoints / 1000000).toFixed(2) + " M"
                      : totalUserPoints.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-lg">
                  <span>Members:</span>
                  <span>{members.length.toString().padStart(2, "0")}/07</span>
                </div>
                <div className="flex justify-between text-sm sm:text-lg">
                  <span>Type:</span>
                  <span>{teamType}</span>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap justify-center sm:justify-start">
                  <button
                    className="px-4 sm:px-5 bg-[#794AFE] hover:bg-[#794AFE] text-white font-semibold py-2 rounded-full transition text-sm"
                    onClick={() => navigate("/create-team")}
                  >
                    Edit
                  </button>
                  <button className="px-4 sm:px-5 bg-gray-700 text-white font-semibold py-2 rounded-full hover:bg-gray-600 transition text-sm">
                    Manage
                  </button>
                  <div className="relative">
                    <button 
                      className="px-4 sm:px-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 rounded-full transition text-sm flex items-center gap-2"
                      onClick={() => document.getElementById('shareDropdown').classList.toggle('hidden')}
                      disabled={isSharing}
                    >
                      {isSharing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                        </svg>
                      )}
                      Share Team
                    </button>
                    <div id="shareDropdown" className="share-dropdown hidden absolute top-full mt-2 right-0 bg-[#2a2d48] border border-[#353751] rounded-lg shadow-lg z-10 min-w-40">
                      <button
                        onClick={shareOnTwitter}
                        className="w-full px-4 py-2 text-left hover:bg-[#353751] text-white text-sm flex items-center gap-2 rounded-t-lg"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Share on X
                      </button>
                      <button
                        onClick={shareOnInstagram}
                        className="w-full px-4 py-2 text-left hover:bg-[#353751] text-white text-sm flex items-center gap-2 rounded-b-lg"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Share on Instagram
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="md:col-span-2 order-1 md:order-2 rounded-xl shadow-lg">
              {members.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  No team members found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((m, idx) => {
                    const artist = m.artistId || {};
                    return (
                      <div
                        key={artist._id || idx}
                        className="relative bg-[#1f223e] border border-[#353751] rounded-xl p-4 sm:p-5 shadow-lg hover:scale-105 transform transition cursor-pointer flex flex-col"
                        onClick={() => navigate(`/artist/${artist._id}`)}
                      >
                        {m.category &&
                          (() => {
                            const meta = getCategoryMeta(m.category);
                            return (
                              <span
                                className={`absolute top-2 right-2 flex items-center gap-1 px-0.5 py-0.5 rounded-full text-[10px] sm:text-xs border ${meta.chip}`}
                              >
                                <img
                                  src={meta.icon}
                                  alt={m.category}
                                  className="w-6 h-6"
                                />
                              </span>
                            );
                          })()}
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full gap-2 mb-3 border-b border-gray-600 ">
                          <div className="flex flex-col justify-start min-w-0">
                            <h3 className="font-semibold text-md text-white mb-1 text-left">
                              {artist.name || "Artist Name"}
                            </h3>
                            <p className="text-yellow-400 text-sm mb-3 flex items-center gap-1">
                              <img
                                src="/img/game-icons_two-coins.png"
                                alt="coin"
                                className="w-3 h-3 object-contain"
                              />
                              {artist.totalScore?.toLocaleString() || "0"} pts
                            </p>
                          </div>
                        </div>
                        {/* Drafting Percentage */}
                        <div className="flex flex-row gap-2">
                          <div className="bg-[#2a2d48] px-4 py-2 rounded-full text-[12px] text-gray-300 mb-3">
                            Drafting : {artist?.draftingPercentage || "0"}%{" "}
                          </div>
                          <span className="bg-[#2a2d48] rounded-full px-2 py-1 text-xs mb-3">
                            {artist.rank && artist.previousRank ? (
                              artist.rank < artist.previousRank ? (
                                // Rank improved
                                <img
                                  src="/img/auto-conversations.png"
                                  alt="Rank Up"
                                  className="w-6 h-6"
                                />
                              ) : artist.rank > artist.previousRank ? (
                                // Rank dropped
                                <img
                                  src="/img/auto-conversations1.png"
                                  alt="Rank Down"
                                  className="w-6 h-6"
                                />
                              ) : (
                                // Rank same
                                <img
                                  src="/img/auto-conversations.png"
                                  alt="Rank Same"
                                  className="w-6 h-6"
                                />
                              )
                            ) : null}
                          </span>
                        </div>
                        {/* Category Button */}
                        {/* Swap Button */}
                        <div className="block items-center w-full ">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent card click (navigate to artist)
                              navigate("/redraft", {
                                state: {
                                  category: m.category,
                                  currentMemberId: m._id,
                                },
                              });
                            }}
                            className="flex flex-row  mx-auto items-center gap-2 px-5 py-1.5 bg-[#A68CFF] hover:bg-[#B393FE] text-black  font-semibold rounded-full transition"
                          >
                            <img
                              src="img/coins-swap.png"
                              alt=""
                              className="w-4 h-4"
                            />
                            Swap
                          </button>
                        </div>{" "}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTeam;

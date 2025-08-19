const TeamBanner = ({ minutes }) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const formatTime = () => {
    if (hours > 0 && remainingMinutes > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-[#7B4DFE] via-[#7B4DFE] to-[#B393FE] px-4 py-3 sm:px-6 sm:py-4 h-[130px] sm:h-[100px]">
        <div className="flex-1">
          <div className="text-xl sm:text-2xl text-white mb-1">
            Draft opens in {formatTime()}
          </div>
          <div className="text-purple-100 text-sm sm:text-sm">
            Only {formatTime()} stand between you and your dream team. Make those picks count when the draft begins.
          </div>
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

export default TeamBanner;

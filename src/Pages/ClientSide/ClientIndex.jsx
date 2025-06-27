import React, { useState } from "react";
import StartingSection from "../../Components/Client/StartingSection";
import TrendingArtist from "../../Components/Client/TrendingArtist";
import BreakOut from "../../Components/Client/BreakOut";
import LegendArtist from "../../Components/Client/LegendArtist";
import StandardArtist from "../../Components/Client/StandardArtist";

const ClientIndex = () => {
    const [filter, setFilter] = useState({ category: "All", genre: "All", sort: "A - Z" });
    return (
        <div className="space-y-8 w-full max-w-7xl mx-auto">
            <StartingSection filter={filter} setFilter={setFilter} />
            {/* Render all lists, each will filter/sort based on props */}
            {(filter.category === "All" || filter.category === "Legend") && (
                <LegendArtist filter={filter} />
            )}
            {(filter.category === "All" || filter.category === "Trending") && (
                <TrendingArtist filter={filter} />
            )}
            {(filter.category === "All" || filter.category === "Breakout") && (
                <BreakOut filter={filter} />
            )}
            {(filter.category === "All" || filter.category === "Standard") && (
                <StandardArtist filter={filter} />
            )}
        </div>
    );
};

export default ClientIndex;
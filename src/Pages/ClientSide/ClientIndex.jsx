import React, { useState, useEffect } from "react";
import StartingSection from "../../Components/Client/StartingSection";
import TrendingArtist from "../../Components/Client/TrendingArtist";
import BreakOut from "../../Components/Client/BreakOut";
import LegendArtist from "../../Components/Client/LegendArtist";
import StandardArtist from "../../Components/Client/StandardArtist";
import { fetchDraftableArtists } from "../../Services/Api";

const ClientIndex = () => {
    const [filter, setFilter] = useState({ category: "All", genre: "All", sort: "A - Z" });
    const [genres, setGenres] = useState(["All"]);

    useEffect(() => {
        const loadAllGenres = async () => {
            try {
                const [legend, trending, breakout, standard] = await Promise.all([
                    fetchDraftableArtists("Legend"),
                    fetchDraftableArtists("Trending"),
                    fetchDraftableArtists("Breakout"),
                    fetchDraftableArtists("Standard"),
                ]);
                const all = [...legend, ...trending, ...breakout, ...standard];
                const unique = Array.from(
                    new Set(
                        all.flatMap((a) => Array.isArray(a.genres) ? a.genres : []).filter(Boolean)
                    )
                ).sort((a, b) => a.localeCompare(b));
                setGenres(["All", ...unique]);
            } catch (e) {
                // fallback keeps default ["All"]
            }
        };
        loadAllGenres();
    }, []);

    return (
        <div className="space-y-8 w-full max-w-7xl mx-auto">
            <StartingSection filter={filter} setFilter={setFilter} genres={genres} />
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
import React from "react";
import DataTable from "../../Components/Client/DataTable";

const ProfileIndex = () => {
    return (
        <div className="w-full min-h-screen  py-8 px-2 sm:px-4 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">All Artists</h1>
            <p className="text-white mb-6">Browse all artists. Click any card to view full profile.</p>
            <div className="w-full max-w-6xl mx-auto">
                <DataTable />
            </div>
        </div>
    );
};

export default ProfileIndex;
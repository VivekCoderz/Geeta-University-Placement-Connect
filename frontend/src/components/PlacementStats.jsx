import React from "react";
import {
  Users,
  Building2,
  Briefcase,
  IndianRupee,
} from "lucide-react";

const PlacementStats = () => {
  return (
    <div className="mt-8 space-y-6">

      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Placement Statistics
        </h2>
        <p className="text-sm text-slate-500">
          Overall placement analytics dashboard
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <Users className="w-10 h-10 text-blue-600 mb-3" />
          <p className="text-gray-500 text-sm">Placed Students</p>
          <h2 className="text-3xl font-bold mt-2">120</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <Building2 className="w-10 h-10 text-green-600 mb-3" />
          <p className="text-gray-500 text-sm">Companies Visited</p>
          <h2 className="text-3xl font-bold mt-2">38</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <IndianRupee className="w-10 h-10 text-purple-600 mb-3" />
          <p className="text-gray-500 text-sm">Highest Package</p>
          <h2 className="text-3xl font-bold mt-2">24 LPA</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <Briefcase className="w-10 h-10 text-orange-600 mb-3" />
          <p className="text-gray-500 text-sm">Average Package</p>
          <h2 className="text-3xl font-bold mt-2">7.5 LPA</h2>
        </div>

      </div>

      {/* Branch Statistics */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        <h3 className="text-lg font-semibold mb-6">
          Branch Wise Placements
        </h3>

        <div className="space-y-5">

          <div>
            <div className="flex justify-between mb-1">
              <span>CSE</span>
              <span>90%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full w-[90%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>AIML</span>
              <span>85%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full w-[85%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>ECE</span>
              <span>70%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-orange-500 h-3 rounded-full w-[70%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Mechanical</span>
              <span>60%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-red-500 h-3 rounded-full w-[60%]"></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PlacementStats;
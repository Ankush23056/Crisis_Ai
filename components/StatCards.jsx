import React from "react";
import { TriangleAlert, Users, LineChart, Zap } from "lucide-react";

const icons = {
  TriangleAlert: <TriangleAlert className="h-6 w-6 text-slate-400" />,
  Users: <Users className="h-6 w-6 text-slate-400" />,
  LineChart: <LineChart className="h-6 w-6 text-slate-400" />,
  Zap: <Zap className="h-6 w-6 text-slate-400" />,
};

const StatCard = ({ title, value, change, icon }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          <p className="text-xs text-slate-500 mt-2">{change}</p>
        </div>
        {icons[icon]}
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-400 to-red-400"></div>
    </div>
  );
};

const StatCards = ({ stats }) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <LineChart className="h-5 w-5" />
        <h2 className="text-xl font-bold">Emergency Status Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default StatCards;

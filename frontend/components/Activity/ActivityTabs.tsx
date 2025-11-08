import React from "react";

type ActivityType = "like" | "comment" | "follow";

interface Props {
  activeTab: "all" | ActivityType;
  onTabChange: (tab: "all" | ActivityType) => void;
}

const ActivityTabs = ({ activeTab, onTabChange }: Props) => {
  const tabs = [
    { id: "all", label: "All" },
    { id: "like", label: "Likes" },
    { id: "comment", label: "Comments" },
    { id: "follow", label: "Followers" },
  ];

  return (
    <div className="bg-white p-2 rounded-lg shadow-md">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as "all" | ActivityType)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityTabs;

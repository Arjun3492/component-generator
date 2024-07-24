import { values } from "@/utils/constants";
import { useState } from "react";

import ColorsTab from "./colorsTab";
import RadiusTab from "./radiusTab";
import SpacingTab from "./spacingTab";

const ValuesTab = () => {
  const [selectedTab, setSelectedTab] = useState(values.color);

  return (
    <>
      <div className="flex space-x-4 ">
        <button
          onClick={() => setSelectedTab(values.color)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === values.color
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setSelectedTab(values.radius)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === values.radius
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Radius
        </button>
        <button
          onClick={() => setSelectedTab(values.spacing)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === values.spacing
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Spacing
        </button>
      </div>
      <div className="p-4 bg-white rounded-md ">
        {selectedTab === values.color && <ColorsTab />}
        {selectedTab === values.radius && <RadiusTab />}
        {selectedTab === values.spacing && <SpacingTab />}
      </div>
    </>
  );
};

export default ValuesTab;

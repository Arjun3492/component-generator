import { components } from "@/utils/constants";
import { useState } from "react";
import ButtonTab from "./buttonTab";
import SelectTab from "./selectTab";
import InputComponentsTab from "./inputTab";

const ComponentsTab = () => {
  const [selectedTab, setSelectedTab] = useState(components.button);

  return (
    <>
      <div className="flex space-x-4 ">
        <button
          onClick={() => setSelectedTab(components.button)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === components.button
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Button
        </button>
        <button
          onClick={() => setSelectedTab(components.input)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === components.input
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Input
        </button>
        <button
          onClick={() => setSelectedTab(components.select)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === components.select
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Select
        </button>
      </div>
      <div className="p-4 bg-white rounded-md ">
        {selectedTab === components.button && <ButtonTab />}
        {selectedTab === components.select && <SelectTab />}
        {selectedTab === components.input && <InputComponentsTab />}
      </div>
    </>
  );
};

export default ComponentsTab;

import { inputSubTabs } from "@/utils/constants";
import { useState } from "react";
import TextInputTab from "./textInputTab";
import RadioInputTab from "./radioInputTab";
import CheckboxInputTab from "./checkBoxInputtab";

const InputComponentsTab = () => {
  const [selectedTab, setSelectedTab] = useState(inputSubTabs.text);

  return (
    <>
      <div className="flex space-x-4 ">
        <button
          onClick={() => setSelectedTab(inputSubTabs.text)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === inputSubTabs.text
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setSelectedTab(inputSubTabs.radio)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === inputSubTabs.radio
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Radio
        </button>
        <button
          onClick={() => setSelectedTab(inputSubTabs.checkbox)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === inputSubTabs.checkbox
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Checkbox
        </button>
      </div>
      <div className="p-4 bg-white rounded-md ">
        {selectedTab === inputSubTabs.text && <TextInputTab />}
        {selectedTab === inputSubTabs.radio && <RadioInputTab />}
        {selectedTab === inputSubTabs.checkbox && <CheckboxInputTab />}
      </div>
    </>
  );
};

export default InputComponentsTab;

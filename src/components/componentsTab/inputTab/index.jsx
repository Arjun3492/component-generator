import { inputSubComponents } from "@/utils/constants";
import { useState } from "react";
import TextInputTab from "./textInputTab";
import RadioInputTab from "./radioInputTab";
import CheckboxInputTab from "./checkBoxInputtab";

const InputComponentsTab = () => {
  const [selectedTab, setSelectedTab] = useState(inputSubComponents.text);

  return (
    <>
      <div className="flex space-x-4 ">
        <button
          onClick={() => setSelectedTab(inputSubComponents.text)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === inputSubComponents.text
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setSelectedTab(inputSubComponents.radio)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === inputSubComponents.radio
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Radio
        </button>
        <button
          onClick={() => setSelectedTab(inputSubComponents.checkbox)}
          className={`px-4 py-2 rounded-md ${
            selectedTab === inputSubComponents.checkbox
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Checkbox
        </button>
      </div>
      <div className="p-4 bg-white rounded-md ">
        {selectedTab === inputSubComponents.text && <TextInputTab />}
        {selectedTab === inputSubComponents.radio && <RadioInputTab />}
        {selectedTab === inputSubComponents.checkbox && <CheckboxInputTab />}
      </div>
    </>
  );
};

export default InputComponentsTab;

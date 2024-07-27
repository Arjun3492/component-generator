import { useState, useEffect, useRef } from "react";
import { values } from "@/utils/constants";
import { useProject } from "@/context/projectContext";

const ColorsTab = () => {
  const [color, setColor] = useState({ id: "", label: "", value: "#000000" });
  const [isEditing, setIsEditing] = useState(false);
  const { projectData, createValue, editValue } = useProject();
  const colors = projectData?.colors || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!color.label || !color.value) return;

    isEditing
      ? await editValue({
          value: values.color,
          id: color.id,
          currentValue: colors,
          newValue: color,
        })
      : await createValue({
          value: values.color,
          currentValue: colors,
          newValue: color,
        });
    setColor({ id: "", label: "", value: "#000000" });
  };

  const handleOnClickEdit = (color) => {
    setColor(color);
    setIsEditing(true);
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Colors</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Label"
            value={color.label}
            onChange={(e) => {
              isEditing && setIsEditing(false);
              setColor({ ...color, label: e.target.value });
            }}
            required
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Value"
            value={color.value}
            onChange={(e) => {
              isEditing && setIsEditing(false);
              setColor({ ...color, value: e.target.value });
            }}
            required
            className="px-4 py-2 border rounded-md"
          />

          <input
            type="color"
            required
            onChange={(e) => setColor({ ...color, value: e.target.value })}
            value={color.value}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isEditing ? "Edit Color" : "Add Color"}
        </button>
      </form>
      <ul>
        {!colors.length ? (
          <li className="text-gray-500">No colors available</li>
        ) : (
          <div className="grid grid-cols-3 gap-4 p-4">
            {colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center space-x-2 p-4 border rounded-md"
              >
                <span className="w-20">{color.label}</span>
                <span
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: color.value }}
                ></span>
                <button
                  className="border-none text-blue-500 hover:text-blue-700"
                  onClick={() => handleOnClickEdit(color)}
                >
                  Edit ✎
                </button>
              </div>
            ))}
          </div>
        )}
      </ul>
    </div>
  );
};

export default ColorsTab;

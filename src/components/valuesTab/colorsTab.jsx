import { useState, useEffect } from "react";
import { values } from "@/utils/constants";
import { useValue } from "@/context/valueContext";
import { useProject } from "@/context/projectContext";

const ColorsTab = () => {
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState({ id: "", label: "", value: "#000000" });
  const [isEditing, setIsEditing] = useState(false);
  const { fetchValue, createValue, editValue } = useValue();
  const { currentProject } = useProject();

  useEffect(() => {
    fetchValue({ value: values.color, setValue: setColors });
  }, [currentProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing
      ? editValue({
          value: values.color,
          id: color.id,
          currentValue: colors,
          setValue: setColors,
          newValue: color,
          setNewValue: setColor,
        })
      : createValue({
          value: values.color,
          currentValue: colors,
          setValue: setColors,
          newValue: color,
          setNewValue: setColor,
        });
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
        {colors.length === 0 ? (
          <li className="text-gray-500">No colors available</li>
        ) : (
          colors.map((color) => (
            <li key={color.id} className="flex items-center space-x-2 mb-2">
              <span className="w-20">{color.label}</span>
              <span
                className="w-8 h-8 rounded"
                style={{ backgroundColor: color.value }}
              ></span>
              <button
                className=" border-none"
                onClick={() => handleOnClickEdit(color)}
              >
                Edit ✎
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ColorsTab;

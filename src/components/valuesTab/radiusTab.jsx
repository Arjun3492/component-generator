import { useState, useEffect } from "react";
import { values } from "@/utils/constants";
import { useValue } from "@/context/valueContext";
import { useProject } from "@/context/projectContext";

const predefinedRadii = [
  "2px",
  "4px",
  "6px",
  "8px",
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
];

const RadiusTab = () => {
  const [radii, setRadii] = useState([]);
  const [radius, setRadius] = useState({ id: "", label: "", value: "2px" });
  const [isEditing, setIsEditing] = useState(false);
  const { fetchValue, createValue, editValue } = useValue();
  const { currentProject } = useProject();

  useEffect(() => {
    fetchValue({ value: values.radius, setValue: setRadii });
  }, [currentProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (radius.id) {
        await editValue({
          value: values.radius,
          id: radius.id,
          currentValue: radii,
          setValue: setRadii,
          newValue: radius,
          setNewValue: setRadius,
        });
        setIsEditing(false);
      } else {
        await createValue({
          value: values.radius,
          currentValue: radii,
          setValue: setRadii,
          newValue: radius,
          setNewValue: setRadius,
        });
      }
      setRadius({ id: "", label: "", value: "2px" });
    } catch (error) {
      console.error("Error submitting radius:", error);
    }
  };

  const handleOnClickEdit = (radius) => {
    setRadius(radius);
    setIsEditing(true);
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Radius</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Label"
            value={radius.label}
            onChange={(e) => setRadius({ ...radius, label: e.target.value })}
            required
            className="px-4 py-2 border rounded-md"
          />
          <select
            value={radius.value}
            onChange={(e) => setRadius({ ...radius, value: e.target.value })}
            className="px-4 py-2 border rounded-md"
          >
            {predefinedRadii.map((radiusValue) => (
              <option key={radiusValue} value={radiusValue}>
                {radiusValue}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isEditing ? "Edit Radius" : "Add Radius"}
        </button>
      </form>
      <ul>
        {radii.length === 0 ? (
          <li className="text-gray-500">No radii available</li>
        ) : (
          radii.map((radius) => (
            <li key={radius.id} className="flex items-center space-x-2 mb-2">
              <span className="w-20">{radius.label}</span>
              <span
                className="w-6 h-6 border-4 border-black rounded-full  border-e-0 border-b-0 "
                style={{ borderRadius: radius.value }}
              >
                <span className="sr-only">Radius</span>
              </span>

              <button
                type="button"
                className="border-none text-blue-500"
                onClick={() => handleOnClickEdit(radius)}
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

export default RadiusTab;

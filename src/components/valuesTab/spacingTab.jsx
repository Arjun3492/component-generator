import { useState, useEffect } from "react";
import { values } from "@/utils/constants";
import { useProject } from "@/context/projectContext";

const predefinedSpacings = [
  "2px",
  "4px",
  "8px",
  "12px",
  "16px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "40px",
];

const SpacingTab = () => {
  const [spacings, setSpacings] = useState([]);
  const [spacing, setSpacing] = useState({ id: "", label: "", value: "4px" });
  const [isEditing, setIsEditing] = useState(false);
  const { projectData, createValue, editValue } = useProject();

  useEffect(() => {
    // Fetch spacings data
    if (projectData?.spacings) {
      setSpacings(projectData.spacings);
    }
  }, [projectData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (spacing.id) {
        await editValue({
          value: values.spacing,
          id: spacing.id,
          currentValue: spacings,
          newValue: spacing,
          setValue: setSpacings,
        });
        setIsEditing(false);
      } else {
        await createValue({
          value: values.spacing,
          currentValue: spacings,
          newValue: spacing,
          setValue: setSpacings,
        });
      }
      setSpacing({ id: "", label: "", value: "4px" });
    } catch (error) {
      console.error("Error submitting spacing:", error);
    }
  };

  const handleOnClickEdit = (spacing) => {
    setSpacing(spacing);
    setIsEditing(true);
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Spacing</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            placeholder="Label"
            value={spacing.label}
            onChange={(e) =>
              setSpacing((prev) => ({ ...prev, label: e.target.value }))
            }
            required
            className="px-4 py-2 border rounded-md"
          />
          <select
            value={spacing.value}
            onChange={(e) =>
              setSpacing((prev) => ({ ...prev, value: e.target.value }))
            }
            className="px-4 py-2 border rounded-md"
          >
            {predefinedSpacings.map((spacingValue) => (
              <option key={spacingValue} value={spacingValue}>
                {spacingValue}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isEditing ? "Edit Spacing" : "Add Spacing"}
        </button>
      </form>
      <div className="grid grid-cols-3 gap-4 p-4">
        {spacings.length === 0 ? (
          <div className="text-gray-500 col-span-3">No spacings available</div>
        ) : (
          spacings.map((spacing) => (
            <div
              key={spacing.id}
              className="flex items-center space-x-2 p-4 border rounded-md"
            >
              <span className="w-20">{spacing.label}</span>
              <span
                className="inline-block"
                style={{
                  padding: spacing.value,
                  border: "1px solid black",
                }}
              >
                Spacing
              </span>
              <button
                type="button"
                className="border-none text-blue-500 hover:text-blue-700"
                onClick={() => handleOnClickEdit(spacing)}
              >
                Edit ✎
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SpacingTab;

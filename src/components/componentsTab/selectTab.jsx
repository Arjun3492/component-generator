import { useCallback, useEffect, useMemo, useState } from "react";
import { useProject } from "@/context/projectContext";
import { components } from "@/utils/constants";
import { useComponent } from "@/context/componentContext";

const SelectTab = () => {
  const defaultStyles = {
    backgroundColor: -1,
    textColor: -1,
    borderColor: -1,
    borderRadius: -1,
    paddingX: -1,
    paddingY: -1,
  };

  const dummyOptions = [
    { id: 1, label: "Option 1" },
    { id: 2, label: "Option 2" },
    { id: 3, label: "Option 3" },
    { id: 4, label: "Option 4" },
  ];

  const [styles, setStyles] = useState(defaultStyles);
  const [currentProject, setCurrentProject] = useState(null);
  const [selectName, setSelectName] = useState("");
  const { fetchProjectWithAttributes } = useProject();
  const { createComponent, editComponent } = useComponent();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { colorMap, radiusMap, spacingMap } = useMemo(() => {
    if (!currentProject) return {};
    return {
      colorMap: currentProject.colors.reduce((acc, color) => {
        acc[color.id] = color.value;
        return acc;
      }, {}),
      radiusMap: currentProject.radii.reduce((acc, radius) => {
        acc[radius.id] = radius.value;
        return acc;
      }, {}),
      spacingMap: currentProject.spacingss.reduce((acc, spacing) => {
        acc[spacing.id] = spacing.value;
        return acc;
      }, {}),
    };
  }, [currentProject]);

  const handleStyleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setStyles((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    },
    [setStyles]
  );

  const fetchSelects = useCallback(async () => {
    try {
      const data = await fetchProjectWithAttributes({
        type: components.select,
      });
      if (data) {
        setCurrentProject(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [fetchProjectWithAttributes]);

  useEffect(() => {
    fetchSelects();
  }, [fetchSelects]);

  const handleCreateSelect = async () => {
    try {
      setLoading(true);
      await createComponent({
        type: components.select,
        variant: selectName,
        styles,
        components: currentProject.components,
        setCurrentProject,
      });
      setStyles(defaultStyles);
      setSelectName("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleEditSelect = async () => {
    try {
      setLoading(true);
      await editComponent({
        id: currentProject.components.find(
          (select) => select.variant === selectName
        ).id,
        type: components.select,
        variant: selectName,
        styles,
        components: currentProject.components,
        setCurrentProject,
      });
      setLoading(false);
      setStyles(defaultStyles);
      setSelectName("");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleOnClickEdit = (select) => {
    setSelectName(select.variant);
    setStyles({
      backgroundColor: select.styles.backgroundColor,
      textColor: select.styles.textColor,
      borderColor: select.styles.borderColor,
      borderRadius: select.styles.borderRadius,
      paddingX: select.styles.paddingX,
      paddingY: select.styles.paddingY,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing ? handleEditSelect() : handleCreateSelect();
  };

  return (
    <div>
      {currentProject && (
        <>
          <div>
            <h3 className="text-lg font-bold mb-4">Existing Selects</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentProject.components.map((select) => (
                <div
                  key={select.id}
                  className="flex items-center justify-center gap-2"
                >
                  <select
                    style={{
                      backgroundColor:
                        colorMap[select.styles.backgroundColor] || "#f0f0f0",
                      color: colorMap[select.styles.textColor] || "#000000",
                      borderColor:
                        colorMap[select.styles.borderColor] || "#f0f0f0",
                      borderRadius: radiusMap[select.styles.borderRadius] || 0,
                      padding: `${spacingMap[select.styles.paddingY] || 0} ${
                        spacingMap[select.styles.paddingX] || 0
                      }`,
                    }}
                    className="border"
                  >
                    <option>{select.variant}</option>
                  </select>
                  <button
                    className="border-none"
                    onClick={() => handleOnClickEdit(select)}
                  >
                    ✎
                  </button>{" "}
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-lg font-bold mb-4">Select Styles</h3>
          <div className="mb-6">
            <select
              style={{
                backgroundColor:
                  styles.backgroundColor === -1
                    ? "#f0f0f0"
                    : colorMap[styles.backgroundColor],
                color:
                  styles.textColor === -1
                    ? "#000000"
                    : colorMap[styles.textColor],
                borderColor:
                  styles.borderColor === -1
                    ? "#f0f0f0"
                    : colorMap[styles.borderColor],
                borderRadius:
                  styles.borderRadius === -1
                    ? 0
                    : radiusMap[styles.borderRadius],
                padding: `${
                  styles.paddingY === -1 ? 0 : spacingMap[styles.paddingY]
                } ${styles.paddingX === -1 ? 0 : spacingMap[styles.paddingX]}`,
              }}
              className="border"
            >
              <option disabled hidden>
                {" "}
                Select an option{" "}
              </option>
              {dummyOptions.map((option) => (
                <option key={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block mb-2">Select Name</label>
              <input
                type="text"
                value={selectName}
                onChange={(e) => setSelectName(e.target.value)}
                required
                readOnly={isEditing}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2">Background Color</label>
              <select
                name="backgroundColor"
                value={
                  styles.backgroundColor === -1 ? "" : styles.backgroundColor
                }
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="" hidden disabled>
                  Select a color
                </option>
                {currentProject.colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Text Color</label>
              <select
                name="textColor"
                value={styles.textColor === -1 ? "" : styles.textColor}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="" hidden disabled>
                  Select a text color
                </option>
                {currentProject.colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Border Color</label>
              <select
                name="borderColor"
                value={styles.borderColor === -1 ? "" : styles.borderColor}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="" hidden disabled>
                  Select a border color
                </option>
                {currentProject.colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Border Radius</label>
              <select
                name="borderRadius"
                value={styles.borderRadius === -1 ? "" : styles.borderRadius}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="" hidden disabled>
                  Select a border radius
                </option>
                {currentProject.radii.map((radius) => (
                  <option key={radius.id} value={radius.id}>
                    {radius.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Padding X</label>
              <select
                name="paddingX"
                value={styles.paddingX === -1 ? "" : styles.paddingX}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="" hidden disabled>
                  Select horizontal padding
                </option>
                {currentProject.spacingss.map((spacing) => (
                  <option key={spacing.id} value={spacing.id}>
                    {spacing.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Padding Y</label>
              <select
                name="paddingY"
                value={styles.paddingY === -1 ? "" : styles.paddingY}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="" hidden disabled>
                  Select vertical padding
                </option>
                {currentProject.spacingss.map((spacing) => (
                  <option key={spacing.id} value={spacing.id}>
                    {spacing.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-8 w-full"
                disabled={loading}
              >
                {loading
                  ? isEditing
                    ? "Editing..."
                    : "Creating..."
                  : isEditing
                  ? "Edit Select"
                  : "Create Select"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SelectTab;

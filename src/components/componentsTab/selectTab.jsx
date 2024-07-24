import { useCallback, useEffect, useState } from "react";
import { useProject } from "@/context/projectContext";
import { components } from "@/utils/constants";
import { useComponent } from "@/context/componentContext";

const SelectTab = () => {
  const defaultStyles = {
    backgroundColor: "",
    textColor: "",
    borderColor: "",
    borderRadius: "",
    paddingX: "",
    paddingY: "",
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

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    setStyles({ ...styles, [name]: value });
  };

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
  }, [fetchProjectWithAttributes, setCurrentProject]);

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
    setStyles(select.styles);
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
                      backgroundColor: select.styles.backgroundColor,
                      color: select.styles.textColor,
                      borderColor: select.styles.borderColor,
                      borderRadius: select.styles.borderRadius,
                      padding: `${select.styles.paddingY} ${select.styles.paddingX}`,
                    }}
                    className="border"
                  >
                    <option>{select.variant}</option>
                  </select>
                  <button
                    className=" border-none"
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
                backgroundColor: styles.backgroundColor,
                color: styles.textColor,
                borderColor: styles.borderColor,
                borderRadius: styles.borderRadius,
                padding: `${styles.paddingY} ${styles.paddingX}`,
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
                value={styles.backgroundColor}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select a color
                </option>
                {currentProject.colors.map((color) => (
                  <option key={color.id} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Text Color</label>
              <select
                name="textColor"
                value={styles.textColor}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select a text color
                </option>
                {currentProject.colors.map((color) => (
                  <option key={color.id} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Border Color</label>
              <select
                name="borderColor"
                value={styles.borderColor}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select a border color
                </option>
                {currentProject.colors.map((color) => (
                  <option key={color.id} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Border Radius</label>
              <select
                name="borderRadius"
                value={styles.borderRadius}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select a border radius
                </option>
                {currentProject.radius.map((radius) => (
                  <option key={radius.id} value={radius.value}>
                    {radius.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Padding X</label>
              <select
                name="paddingX"
                value={styles.paddingX}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select horizontal padding
                </option>
                {currentProject.spacing.map((spacing) => (
                  <option key={spacing.id} value={spacing.value}>
                    {spacing.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Padding Y</label>
              <select
                name="paddingY"
                value={styles.paddingY}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select vertical padding
                </option>
                {currentProject.spacing.map((spacing) => (
                  <option key={spacing.id} value={spacing.value}>
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

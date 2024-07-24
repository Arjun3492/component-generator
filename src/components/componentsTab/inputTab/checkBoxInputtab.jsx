import { useCallback, useEffect, useState } from "react";
import { useProject } from "@/context/projectContext";
import { inputSubTabs } from "@/utils/constants";
import { useComponent } from "@/context/componentContext";

const CheckboxInputTab = () => {
  const dummyOptions = ["Option 1", "Option 2", "Option 3"];
  const defaultStyles = {
    backgroundColor: "",
    textColor: "",
    borderColor: "",
    borderRadius: "",
    paddingX: "",
    paddingY: "",
  };
  const [styles, setStyles] = useState(defaultStyles);
  const [currentProject, setCurrentProject] = useState(null);
  const [checkboxName, setCheckboxName] = useState("");
  const { fetchProjectWithAttributes } = useProject();
  const { createComponent, editComponent } = useComponent();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    setStyles({ ...styles, [name]: value });
  };

  const fetchCheckboxes = useCallback(async () => {
    try {
      const data = await fetchProjectWithAttributes({
        type: inputSubTabs.checkbox,
      });
      if (data) {
        setCurrentProject(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [fetchProjectWithAttributes, setCurrentProject]);

  useEffect(() => {
    fetchCheckboxes();
  }, [fetchCheckboxes]);

  const handleCreateCheckbox = async () => {
    try {
      setLoading(true);
      await createComponent({
        type: inputSubTabs.checkbox,
        variant: checkboxName,
        styles,
        components: currentProject.components,
        setCurrentProject,
      });
      setStyles(defaultStyles);
      setCheckboxName("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleEditCheckbox = async () => {
    try {
      setLoading(true);
      await editComponent({
        id: currentProject.components.find(
          (checkbox) => checkbox.variant === checkboxName
        ).id,
        type: inputSubTabs.checkbox,
        variant: checkboxName,
        styles,
        components: currentProject.components,
        setCurrentProject,
      });
      setLoading(false);
      setStyles(defaultStyles);
      setCheckboxName("");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleOnClickEdit = (checkbox) => {
    setCheckboxName(checkbox.variant);
    setStyles(checkbox.styles);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing ? handleEditCheckbox() : handleCreateCheckbox();
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
  };

  return (
    <div>
      {currentProject && (
        <>
          <div>
            <h3 className="text-lg font-bold mb-4">Existing Checkboxes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentProject.components.map((checkbox) => (
                <div key={checkbox.id} className="flex items-center gap-2">
                  <div>
                    {dummyOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <label
                          style={{
                            backgroundColor: checkbox.styles.backgroundColor,
                            color: checkbox.styles.textColor,
                            borderColor: checkbox.styles.borderColor,
                            borderRadius: checkbox.styles.borderRadius,
                            padding: `${checkbox.styles.paddingY} ${checkbox.styles.paddingX}`,
                          }}
                          className="border px-2 py-1"
                        >
                          <input
                            type="checkbox"
                            name={checkboxName}
                            value={option}
                          />
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    className="border-none"
                    onClick={() => handleOnClickEdit(checkbox)}
                  >
                    ✎
                  </button>{" "}
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-lg font-bold mb-4">Checkbox Input Styles</h3>
          <div className="mb-6">
            <div>
              {dummyOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-4">
                  <label
                    style={{
                      backgroundColor: styles.backgroundColor,
                      color: styles.textColor,
                      borderColor: styles.borderColor,
                      borderRadius: styles.borderRadius,
                      padding: `${styles.paddingY} ${styles.paddingX}`,
                    }}
                    className="border px-2 py-1"
                  >
                    <input type="checkbox" name={checkboxName} value={option} />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block mb-2">Checkbox Input Name</label>
              <input
                type="text"
                value={checkboxName}
                onChange={(e) => setCheckboxName(e.target.value)}
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
                  ? "Edit Checkbox Input"
                  : "Create Checkbox Input"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CheckboxInputTab;

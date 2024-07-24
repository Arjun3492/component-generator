import { useCallback, useEffect, useState } from "react";
import { useProject } from "@/context/projectContext";
import { inputSubTabs } from "@/utils/constants";
import { useComponent } from "@/context/componentContext";

const RadioInputTab = () => {
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
  const [radioName, setRadioName] = useState("");
  const { fetchProjectWithAttributes } = useProject();
  const { createComponent, editComponent } = useComponent();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    setStyles({ ...styles, [name]: value });
  };

  const fetchRadios = useCallback(async () => {
    try {
      const data = await fetchProjectWithAttributes({
        type: inputSubTabs.radio,
      });
      if (data) {
        setCurrentProject(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [fetchProjectWithAttributes, setCurrentProject]);

  useEffect(() => {
    fetchRadios();
  }, [fetchRadios]);

  const handleCreateRadio = async () => {
    try {
      setLoading(true);
      await createComponent({
        type: inputSubTabs.radio,
        variant: radioName,
        styles,
        components: currentProject.components,
        setCurrentProject,
      });
      setStyles(defaultStyles);
      setRadioName("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleEditRadio = async () => {
    try {
      setLoading(true);
      await editComponent({
        id: currentProject.components.find(
          (radio) => radio.variant === radioName
        ).id,
        type: inputSubTabs.radio,
        variant: radioName,
        styles,
        options,
        components: currentProject.components,
        setCurrentProject,
      });
      setLoading(false);
      setStyles(defaultStyles);
      setRadioName("");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleOnClickEdit = (radio) => {
    setRadioName(radio.variant);
    setStyles(radio.styles);
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing ? handleEditRadio() : handleCreateRadio();
  };

  return (
    <div>
      {currentProject && (
        <>
          <div>
            <h3 className="text-lg font-bold mb-4">Existing Radio Inputs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentProject.components.map((radio) => (
                <div key={radio.id} className="flex items-center gap-2">
                  <div>
                    {dummyOptions.map((option, index) => (
                      <div class="flex items-center space-x-4" key={index}>
                        <label
                          style={{
                            backgroundColor: radio.styles.backgroundColor,
                            color: radio.styles.textColor,
                            borderColor: radio.styles.borderColor,
                            borderRadius: radio.styles.borderRadius,
                            padding: `${radio.styles.paddingY} ${radio.styles.paddingX}`,
                          }}
                          className="border "
                        >
                          <input type="radio" name={option} value={option} />

                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    className="border-none"
                    onClick={() => handleOnClickEdit(radio)}
                  >
                    ✎
                  </button>{" "}
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-lg font-bold mb-4">Radio Input Styles</h3>
          <div className="mb-6">
            <div>
              {dummyOptions.map((option, index) => (
                <div class="flex items-center space-x-4" key={index}>
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
                    <input type="radio" name={option} value={option} />
                    {option || "Option"}
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
              <label className="block mb-2">Radio Input Name</label>
              <input
                type="text"
                value={radioName}
                onChange={(e) => setRadioName(e.target.value)}
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
                  ? "Edit Radio Input"
                  : "Create Radio Input"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default RadioInputTab;

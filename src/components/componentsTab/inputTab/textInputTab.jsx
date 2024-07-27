import { useCallback, useEffect, useMemo, useState } from "react";
import { useProject } from "@/context/projectContext";
import { defaultValues, inputSubComponents } from "@/utils/constants";

const TextInputTab = () => {
  const { projectData, createComponent, editComponent } = useProject();
  const defaultTextInput = {
    textInputName: "",
    ...defaultValues,
  };
  const [textInputData, setTextInputData] = useState(defaultTextInput);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputs, setInputs] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("projectData changed");
    if (projectData && projectData.components) {
      console.log(
        "updating text inputs",
        projectData.components
          .filter((component) => component.type === inputSubComponents.text)
          .map((component) => component.styles.backgroundColor)
      );
      setInputs(
        projectData.components.filter(
          (component) => component.type === inputSubComponents.text
        )
      );
    }
  }, [projectData]);
  const { colorMap, radiusMap, spacingMap } = useMemo(() => {
    if (!projectData) return {};
    return {
      colorMap: projectData.colors
        ? projectData.colors.reduce((acc, color) => {
            acc[color.id] = color.value;
            return acc;
          }, {})
        : {},
      radiusMap: projectData.radii
        ? projectData.radii.reduce((acc, radius) => {
            acc[radius.id] = radius.value;
            return acc;
          }, {})
        : {},
      spacingMap: projectData.spacings
        ? projectData.spacings.reduce((acc, spacing) => {
            acc[spacing.id] = spacing.value;
            return acc;
          }, {})
        : {},
    };
  }, [projectData]);

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setTextInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCreateTextInput = async () => {
    try {
      setLoading(true);
      const { id, textInputName, ...styles } = textInputData;
      await createComponent({
        type: inputSubComponents.text,
        variant: textInputName,
        styles: styles,
      });
      setTextInputData(defaultTextInput);
      setError(null);
    } catch (error) {
      setError("Failed to create button. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTextInput = async () => {
    try {
      setLoading(true);
      const { componentId, textInputName, ...styles } = textInputData;
      await editComponent({
        id: componentId,
        type: inputSubComponents.text,
        variant: textInputName,
        styles: styles,
      });
      setTextInputData(defaultTextInput);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError("Failed to edit button. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClickEdit = (textInput) => {
    setTextInputData({
      textInputName: textInput.variant,
      ...textInput.styles,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing ? await handleEditTextInput() : await handleCreateTextInput();
  };

  return (
    <div>
      {projectData && (
        <>
          <div>
            <h3 className="text-lg font-bold mb-4">Existing Text Inputs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {inputs.map((input) => (
                <div
                  key={input.id}
                  className="flex items-center justify-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={input.variant}
                    style={{
                      backgroundColor: colorMap[input.styles.backgroundColor],
                      color: colorMap[input.styles.textColor],
                      borderColor: colorMap[input.styles.borderColor],
                      borderRadius: radiusMap[input.styles.borderRadius],
                      padding: `${spacingMap[input.styles.paddingY]} ${
                        spacingMap[input.styles.paddingX]
                      }`,
                    }}
                    className="border"
                  />
                  <button
                    className="border-none"
                    onClick={() => handleOnClickEdit(input)}
                  >
                    ✎
                  </button>
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-lg font-bold mb-4">Text Input Styles</h3>
          <div className="mb-6">
            <input
              type="text"
              disabled
              placeholder={textInputData.textInputName || "Text Input Preview"}
              style={{
                backgroundColor: colorMap[textInputData.backgroundColor],
                borderColor: colorMap[textInputData.borderColor],
                borderRadius: radiusMap[textInputData.borderRadius],
                padding: `${spacingMap[textInputData.paddingY]} ${
                  spacingMap[textInputData.paddingX]
                }`,
              }}
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block mb-2">Text Input Name</label>
              <input
                type="text"
                value={textInputData.textInputName}
                onChange={(e) =>
                  setTextInputData({
                    ...textInputData,
                    textInputName: e.target.value,
                  })
                }
                required
                readOnly={isEditing}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2">Background Color</label>
              <select
                name="backgroundColor"
                value={textInputData.backgroundColor}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select a color
                </option>
                {projectData.colors.map((color) => (
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
                value={textInputData.textColor}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select a text color
                </option>
                {projectData.colors.map((color) => (
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
                value={textInputData.borderColor}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select a border color
                </option>
                {projectData.colors.map((color) => (
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
                value={textInputData.borderRadius}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select a border radius
                </option>
                {projectData.radii.map((radius) => (
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
                value={textInputData.paddingX}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select horizontal padding
                </option>
                {projectData.spacings.map((spacing) => (
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
                value={textInputData.paddingY}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" disabled hidden>
                  Select vertical padding
                </option>
                {projectData.spacings.map((spacing) => (
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
                  ? "Edit Text Input"
                  : "Create Text Input"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default TextInputTab;

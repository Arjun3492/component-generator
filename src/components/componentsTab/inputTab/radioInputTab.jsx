import { useCallback, useEffect, useMemo, useState } from "react";
import { useProject } from "@/context/projectContext";
import { defaultValues, inputSubComponents } from "@/utils/constants";

const RadioInputTab = () => {
  const defaultRadioInput = {
    radioInputName: "",
    ...defaultValues,
  };
  const { projectData, createComponent, editComponent } = useProject();
  const [radioInputData, setRadioInputData] = useState(defaultRadioInput);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectData && projectData.components) {
      setInputs(
        projectData.components.filter(
          (component) => component.type === inputSubComponents.radio
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

  const handleStyleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setRadioInputData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setRadioInputData]
  );

  const handleCreateRadioInput = async () => {
    try {
      setLoading(true);
      const { id, radioInputName, ...styles } = radioInputData;
      await createComponent({
        type: inputSubComponents.radio,
        variant: radioInputName,
        styles: styles,
      });
      setRadioInputData(defaultRadioInput);
      setError(null);
    } catch (error) {
      setError("Failed to create radio input. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRadioInput = async () => {
    try {
      setLoading(true);
      const { componentId, radioInputName, ...styles } = radioInputData;
      await editComponent({
        id: componentId,
        type: inputSubComponents.radio,
        variant: radioInputName,
        styles: styles,
      });
      setRadioInputData(defaultRadioInput);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError("Failed to edit radio input. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClickEdit = (radioInput) => {
    setRadioInputData({
      radioInputName: radioInput.variant,
      ...radioInput.styles,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing ? await handleEditRadioInput() : await handleCreateRadioInput();
  };

  return (
    <div>
      {projectData && (
        <>
          <div>
            <h3 className="text-lg font-bold mb-4">Existing Radio Inputs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {inputs.map((input) => (
                <div
                  key={input.id}
                  className="flex items-center justify-center gap-2"
                >
                  <label
                    className="block mb-2"
                    style={{
                      color: colorMap[input.styles.textColor],
                      backgroundColor: colorMap[input.styles.backgroundColor],
                      borderColor: colorMap[input.styles.borderColor],
                      borderRadius: radiusMap[input.styles.borderRadius],
                      padding: `${spacingMap[input.styles.paddingY]} ${
                        spacingMap[input.styles.paddingX]
                      }`,
                    }}
                  >
                    <input type="radio" disabled />
                    {input.variant || "Preview"}
                  </label>
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
          <h3 className="text-lg font-bold mb-4">Radio Input Styles</h3>
          <div className="mb-6">
            <label
              className="block mb-2"
              style={{
                color: colorMap[radioInputData.textColor],
                backgroundColor: colorMap[radioInputData.backgroundColor],
                borderColor: colorMap[radioInputData.borderColor],
                borderRadius: radiusMap[radioInputData.borderRadius],
                padding: `${spacingMap[radioInputData.paddingY]} ${
                  spacingMap[radioInputData.paddingX]
                }`,
              }}
            >
              <input type="radio" disabled />
              {radioInputData.radioInputName || "Preview"}
            </label>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block mb-2">Radio Input Name</label>
              <input
                type="text"
                value={radioInputData.radioInputName}
                onChange={(e) =>
                  setRadioInputData({
                    ...radioInputData,
                    radioInputName: e.target.value,
                  })
                }
                required
                readOnly={isEditing}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2">Text Color</label>
              <select
                name="textColor"
                value={radioInputData.textColor}
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
              <label className="block mb-2">Background Color</label>
              <select
                name="backgroundColor"
                value={radioInputData.backgroundColor}
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
              <label className="block mb-2">Border Color</label>
              <select
                name="borderColor"
                value={radioInputData.borderColor}
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
                value={radioInputData.borderRadius}
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
                value={radioInputData.paddingX}
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
                value={radioInputData.paddingY}
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

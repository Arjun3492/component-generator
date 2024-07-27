import { useCallback, useEffect, useMemo, useState } from "react";
import { useProject } from "@/context/projectContext";
import { defaultValues, inputSubComponents } from "@/utils/constants";

const CheckboxInputTab = () => {
  const defaultCheckBoxInput = {
    ...defaultValues,
    checkboxInputName: "",
  };
  const { projectData, createComponent, editComponent } = useProject();
  const [checkboxInputData, setCheckboxInputData] =
    useState(defaultCheckBoxInput);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputs, setInputs] = useState([]);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectData && projectData.components) {
      setInputs(
        projectData.components.filter(
          (component) => component.type === inputSubComponents.checkbox
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
      setCheckboxInputData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setCheckboxInputData]
  );

  const handleCreateCheckboxInput = async () => {
    try {
      setLoading(true);
      const { id, checkboxInputName, ...styles } = checkboxInputData;
      await createComponent({
        type: inputSubComponents.checkbox,
        variant: checkboxInputName,
        styles: styles,
      });
      setCheckboxInputData(defaultCheckBoxInput);
      setError(null);
    } catch (error) {
      setError("Failed to create checkbox input. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCheckboxInput = async () => {
    try {
      setLoading(true);
      const { componentId, checkboxInputName, ...styles } = checkboxInputData;
      await editComponent({
        id: componentId,
        type: inputSubComponents.checkbox,
        variant: checkboxInputName,
        styles: styles,
      });
      setCheckboxInputData(defaultCheckBoxInput);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError("Failed to edit checkbox input. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClickEdit = (checkboxInput) => {
    setCheckboxInputData({
      checkboxInputName: checkboxInput.variant,
      ...checkboxInput.styles,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing
      ? await handleEditCheckboxInput()
      : await handleCreateCheckboxInput();
  };

  return (
    <div>
      {projectData && (
        <>
          <div>
            <h3 className="text-lg font-bold mb-4">Existing Checkbox Inputs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {inputs.map((input) => (
                <div
                  key={input.id}
                  className="flex items-center justify-center gap-2"
                >
                  <label
                    style={{
                      backgroundColor: colorMap[input.styles.backgroundColor],
                      borderColor: colorMap[input.styles.borderColor],
                      borderRadius: radiusMap[input.styles.borderRadius],
                      padding: `${spacingMap[input.styles.paddingY]} ${
                        spacingMap[input.styles.paddingX]
                      }`,
                    }}
                  >
                    <input type="checkbox" className="border" />
                    {input.variant}
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
          <h3 className="text-lg font-bold mb-4">Checkbox Input Styles</h3>
          <div className="mb-6">
            <label
              style={{
                backgroundColor: colorMap[checkboxInputData.backgroundColor],
                borderColor: colorMap[checkboxInputData.borderColor],
                borderRadius: radiusMap[checkboxInputData.borderRadius],
                padding: `${spacingMap[checkboxInputData.paddingY]} ${
                  spacingMap[checkboxInputData.paddingX]
                }`,
              }}
            >
              <input type="checkbox" disabled />
              {checkboxInputData.checkboxInputName || "Checkbox Input"}
            </label>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block mb-2">Checkbox Input Name</label>
              <input
                type="text"
                value={checkboxInputData.checkboxInputName}
                onChange={(e) =>
                  setCheckboxInputData({
                    ...checkboxInputData,
                    checkboxInputName: e.target.value,
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
                value={checkboxInputData.backgroundColor}
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
                value={checkboxInputData.textColor}
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
                value={checkboxInputData.borderColor}
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
                value={checkboxInputData.borderRadius}
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
                value={checkboxInputData.paddingX}
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
                value={checkboxInputData.paddingY}
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

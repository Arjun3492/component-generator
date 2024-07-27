import { useCallback, useEffect, useMemo, useState } from "react";
import { useProject } from "@/context/projectContext";
import { components, defaultValues } from "@/utils/constants";

const ButtonTab = () => {
  const defaultButtonData = {
    buttonName: "",
    ...defaultValues,
  };
  const { projectData, createComponent, editComponent } = useProject();
  const [buttonData, setButtonData] = useState(defaultButtonData);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [buttons, setButtons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("projectData changed");
    if (projectData && projectData.components) {
      console.log(
        "updating buttons",
        projectData.components
          .filter((component) => component.type === components.button)
          .map((component) => component.styles.backgroundColor)
      );
      setButtons(
        projectData.components.filter(
          (component) => component.type === components.button
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
      setButtonData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    },
    [setButtonData]
  );

  const handleCreateButton = async () => {
    try {
      setLoading(true);
      const { id, buttonName, ...styles } = buttonData;
      await createComponent({
        type: components.button,
        variant: buttonName,
        styles: styles,
      });
      setButtonData(defaultButtonData);
      setError(null);
    } catch (error) {
      setError("Failed to create button. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditButton = async () => {
    try {
      setLoading(true);
      const { id, buttonName, ...styles } = buttonData;
      await editComponent({
        id: id,
        type: components.button,
        variant: buttonName,
        styles: styles,
      });
      setButtonData(defaultButtonData);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError("Failed to edit button. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClickEdit = (button) => {
    setButtonData({
      id: button.id,
      buttonName: button.variant,
      ...button.styles,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing ? await handleEditButton() : await handleCreateButton();
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <>
        <div>
          <h3 className="text-lg font-bold mb-4">Existing Buttons</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {buttons.map((button) => (
              <div
                key={button.id}
                className="flex items-center justify-center gap-2"
              >
                <button
                  style={{
                    backgroundColor: colorMap[button.styles.backgroundColor],
                    color: colorMap[button.styles.textColor],
                    borderColor: colorMap[button.styles.borderColor],
                    borderRadius: radiusMap[button.styles.borderRadius],
                    padding: `${spacingMap[button.styles.paddingY]} ${
                      spacingMap[button.styles.paddingX]
                    }`,
                  }}
                  className="border"
                >
                  {button.variant}
                </button>
                <button
                  className=" border-none"
                  onClick={() => handleOnClickEdit(button)}
                >
                  ✎
                </button>{" "}
              </div>
            ))}
          </div>
        </div>
        <h3 className="text-lg font-bold mb-4">Button Styles</h3>
        <div className="mb-6">
          <button
            style={{
              backgroundColor:
                buttonData.backgroundColor === -1
                  ? "#f0f0f0"
                  : colorMap[buttonData.backgroundColor],
              color:
                buttonData.textColor === -1
                  ? "#000000"
                  : colorMap[buttonData.textColor],
              borderColor:
                buttonData.borderColor === -1
                  ? "#f0f0f0"
                  : colorMap[buttonData.borderColor],
              borderRadius:
                buttonData.borderRadius === -1
                  ? 0
                  : radiusMap[buttonData.borderRadius],
              padding: `${
                buttonData.paddingY === -1 ? 0 : spacingMap[buttonData.paddingY]
              } ${
                buttonData.paddingX === -1 ? 0 : spacingMap[buttonData.paddingX]
              }`,
            }}
            className="border"
          >
            {buttonData.buttonName || "Button Preview"}
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block mb-2">Button Name</label>
            <input
              type="text"
              name="buttonName"
              value={buttonData.buttonName}
              onChange={(e) =>
                setButtonData({ ...buttonData, buttonName: e.target.value })
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
              required
              value={
                buttonData.backgroundColor === -1
                  ? ""
                  : buttonData.backgroundColor
              }
              onChange={handleStyleChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="" hidden disabled>
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
              required
              value={buttonData.textColor === -1 ? "" : buttonData.textColor}
              onChange={handleStyleChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="" hidden disabled>
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
              value={
                buttonData.borderColor === -1 ? "" : buttonData.borderColor
              }
              onChange={handleStyleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
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
              value={
                buttonData.borderRadius === -1 ? "" : buttonData.borderRadius
              }
              onChange={handleStyleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
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
              value={buttonData.paddingX === -1 ? "" : buttonData.paddingX}
              onChange={handleStyleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="" disabled hidden>
                Select padding X
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
              value={buttonData.paddingY === -1 ? "" : buttonData.paddingY}
              onChange={handleStyleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="" disabled hidden>
                Select padding Y
              </option>
              {projectData.spacings.map((spacing) => (
                <option key={spacing.id} value={spacing.id}>
                  {spacing.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white rounded-md ${
                loading ? "bg-gray-400" : "bg-blue-500"
              }`}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Button"}
            </button>
          </div>
        </form>
      </>
    </div>
  );
};

export default ButtonTab;

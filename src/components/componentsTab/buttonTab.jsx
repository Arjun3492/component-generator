import { useCallback, useEffect, useMemo, useState } from "react";
import { useProject } from "@/context/projectContext";
import { components } from "@/utils/constants";
import { useComponent } from "@/context/componentContext";

const ButtonTab = () => {
  const defaultButtonData = {
    backgroundColor: -1,
    textColor: -1,
    borderColor: -1,
    borderRadius: -1,
    paddingX: -1,
    paddingY: -1,
    buttonName: "",
  };

  const [buttonData, setButtonData] = useState(defaultButtonData);
  const [currentProject, setCurrentProject] = useState(null);
  const { fetchProjectWithAttributes } = useProject();
  const { createComponent, editComponent } = useComponent();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { colorMap, radiusMap, spacingMap } = useMemo(() => {
    if (!currentProject) return {};
    return {
      colorMap: currentProject.colors
        ? currentProject.colors.reduce((acc, color) => {
            acc[color.id] = color.value;
            return acc;
          }, {})
        : {},
      radiusMap: currentProject.radii
        ? currentProject.radii.reduce((acc, radius) => {
            acc[radius.id] = radius.value;
            return acc;
          }, {})
        : {},
      spacingMap: currentProject.spacings
        ? currentProject.spacings.reduce((acc, spacing) => {
            acc[spacing.id] = spacing.value;
            return acc;
          }, {})
        : {},
    };
  }, [currentProject]);

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

  const fetchButtons = useCallback(async () => {
    try {
      const data = await fetchProjectWithAttributes({
        type: components.button,
      });
      if (data) {
        setCurrentProject(data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [fetchProjectWithAttributes]);

  useEffect(() => {
    fetchButtons();
  }, [fetchButtons]);

  const handleCreateButton = async () => {
    try {
      setLoading(true);
      await createComponent({
        type: components.button,
        variant: buttonData.buttonName,
        styles: buttonData,
        components: currentProject.components,
        setCurrentProject,
      });
      setButtonData(defaultButtonData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleEditButton = async () => {
    try {
      setLoading(true);

      await editComponent({
        id: currentProject.components.find(
          (button) => button.variant === buttonData.buttonName
        ).id,
        type: components.button,
        variant: buttonData.buttonName,
        styles: buttonData,
        components: currentProject.components,
        setCurrentProject,
      });
      setLoading(false);
      setButtonData(defaultButtonData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleOnClickEdit = (button) => {
    setButtonData({
      buttonName: button.variant,
      ...button.styles,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing ? handleEditButton() : handleCreateButton();
  };

  return (
    <div>
      {currentProject && (
        <>
          <div>
            <h3 className="text-lg font-bold mb-4">Existing Buttons</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentProject.components.map((button) => (
                <div
                  key={button.id}
                  className="flex items-center justify-center gap-2"
                >
                  <button
                    style={{
                      backgroundColor: button.styles.bgColor.value,
                      color: button.styles.txtColor.value,
                      borderColor: button.styles.brdrColor.value,
                      borderRadius: button.styles.radius.value,
                      padding: `${button.styles.pdY.value} ${button.styles.pdX.value}`,
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
                  buttonData.paddingY === -1
                    ? 0
                    : spacingMap[buttonData.paddingY]
                } ${
                  buttonData.paddingX === -1
                    ? 0
                    : spacingMap[buttonData.paddingX]
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
                required
                value={buttonData.textColor === -1 ? "" : buttonData.textColor}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
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
                value={buttonData.paddingX === -1 ? "" : buttonData.paddingX}
                onChange={handleStyleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              >
                <option value="" disabled hidden>
                  Select horizontal padding
                </option>
                {currentProject.spacings.map((spacing) => (
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
                  Select vertical padding
                </option>
                {currentProject.spacings.map((spacing) => (
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
                  ? "Edit Button"
                  : "Create Button"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ButtonTab;

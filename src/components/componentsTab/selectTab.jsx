import { useCallback, useEffect, useMemo, useState } from "react";
import { useProject } from "@/context/projectContext";
import { components } from "@/utils/constants";

const SelectTab = () => {
  const defaultSelectData = {
    backgroundColor: -1,
    textColor: -1,
    borderColor: -1,
    borderRadius: -1,
    paddingX: -1,
    paddingY: -1,
    selectName: "",
    id: "",
  };

  const { projectData, createComponent, editComponent } = useProject();
  const [selectData, setSelectData] = useState(defaultSelectData);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selects, setSelects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectData && projectData.components) {
      setSelects(
        projectData.components.filter(
          (component) => component.type === components.select
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
      setSelectData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    },
    [setSelectData]
  );

  const handleCreateSelect = async () => {
    try {
      setLoading(true);
      const { id, selectName, ...styles } = selectData;

      await createComponent({
        type: components.select,
        variant: selectName,
        styles: styles,
      });
      setSelectData(defaultSelectData);
      setError(null);
    } catch (error) {
      setError("Failed to create select. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSelect = async () => {
    try {
      setLoading(true);
      const { componentId, selectName, ...styles } = selectData;
      await editComponent({
        id: componentId,
        type: components.select,
        variant: selectName,
        styles: styles,
      });
      setSelectData(defaultSelectData);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError("Failed to edit select. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClickEdit = (select) => {
    setSelectData({
      selectName: select.variant,
      ...select.styles,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditing ? await handleEditSelect() : await handleCreateSelect();
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <>
        <div>
          <h3 className="text-lg font-bold mb-4">Existing Selects</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selects.map((select) => (
              <div
                key={select.id}
                className="flex items-center justify-center gap-2"
              >
                <select
                  style={{
                    backgroundColor: colorMap[select.styles.backgroundColor],
                    color: colorMap[select.styles.textColor],
                    borderColor: colorMap[select.styles.borderColor],
                    borderRadius: radiusMap[select.styles.borderRadius],
                    padding: `${spacingMap[select.styles.paddingY]} ${
                      spacingMap[select.styles.paddingX]
                    }`,
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
              backgroundColor:
                selectData.backgroundColor === -1
                  ? "#f0f0f0"
                  : colorMap[selectData.backgroundColor],
              color:
                selectData.textColor === -1
                  ? "#000000"
                  : colorMap[selectData.textColor],
              borderColor:
                selectData.borderColor === -1
                  ? "#f0f0f0"
                  : colorMap[selectData.borderColor],
              borderRadius:
                selectData.borderRadius === -1
                  ? 0
                  : radiusMap[selectData.borderRadius],
              padding: `${
                selectData.paddingY === -1 ? 0 : spacingMap[selectData.paddingY]
              } ${
                selectData.paddingX === -1 ? 0 : spacingMap[selectData.paddingX]
              }`,
            }}
            className="border"
          >
            <option>{selectData.selectName || "Select Preview"}</option>
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
              name="selectName"
              value={selectData.selectName}
              onChange={(e) =>
                setSelectData({ ...selectData, selectName: e.target.value })
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
                selectData.backgroundColor === -1
                  ? ""
                  : selectData.backgroundColor
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
              value={selectData.textColor === -1 ? "" : selectData.textColor}
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
                selectData.borderColor === -1 ? "" : selectData.borderColor
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
                selectData.borderRadius === -1 ? "" : selectData.borderRadius
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
              value={selectData.paddingX === -1 ? "" : selectData.paddingX}
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
              value={selectData.paddingY === -1 ? "" : selectData.paddingY}
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
                : "Create Select"}
            </button>
          </div>
        </form>
      </>
    </div>
  );
};

export default SelectTab;

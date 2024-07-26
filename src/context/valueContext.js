import { createContext, useContext, useState } from "react";
import { useProject } from "./projectContext";

const ValueContext = createContext();

export const ValueProvider = ({ children }) => {

    const { currentProject, updateCacheWithEditedValue, setCache } = useProject();

    const [valueCache, setValueCache] = useState({});
    const map = {
        color: "colors",
        radius: "radii",
        spacing: "spacings",
    };

    const fetchValue = async ({
        value,
        setValue,
    }) => {
        if (valueCache[`${currentProject.id}-${value}`]) {
            setValue(valueCache[`${currentProject.id}-${value}`]);
            return;
        }
        const res = await fetch(`/api/value?type=${value}&projectId=${currentProject.id}`);
        const data = await res.json();
        if (res.ok) {
            valueCache[`${currentProject.id}-${value}`] = data;
            setValue(data);
        }
    };



    const createValue = async ({ value, currentValue,
        setValue, newValue, setNewValue }) => {

        const res = await fetch(`/api/value?type=${value}&projectId=${currentProject.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newValue),
        });
        if (!res.ok) {
            console.error("Failed to create value", await res.json());
            return;
        }

        const data = await res.json();


        setValue([...currentValue, data]);
        setValueCache({ ...valueCache, [`${currentProject.id}-${value}`]: [...currentValue, data] });
        setNewValue({ label: "", value: "" });

        setCache((prevCache) => ({
            ...prevCache,
            [map[value]]: [...currentValue, data],
        }));
    }

    const editValue = async ({ value, id, currentValue, setValue, newValue, setNewValue }) => {
        try {
            const res = await fetch(`/api/value?type=${value}&projectId=${currentProject.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newValue),
            });
            if (!res.ok) {
                console.error("Failed to edit value", await res.json());
                return;
            }
            const data = await res.json();

            const updatedValues = currentValue.map((item) => {
                if (item.id === id) {
                    return data;
                }
                return item;
            });

            setValue(updatedValues);
            setValueCache({ ...valueCache, [`${currentProject.id}-${value}`]: updatedValues });
            setNewValue({ label: "", value: "" });
            setCache({ ...currentProject, [map[value]]: updatedValues });

            updateCacheWithEditedValue(data, value);

        } catch (error) {
            console.error("Failed to edit value", error);
        }
    };


    return (
        <ValueContext.Provider value={{ fetchValue, createValue, editValue }}>
            {children}
        </ValueContext.Provider>
    );
};

export const useValue = () => useContext(ValueContext);

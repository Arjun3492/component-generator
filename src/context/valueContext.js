import { createContext, useContext } from "react";
import { useProject } from "./projectContext";

const ValueContext = createContext();

export const ValueProvider = ({ children }) => {

    const { currentProject } = useProject();


    const fetchValue = async ({
        value,
        setValue,
    }) => {
        const res = await fetch(`/api/value?type=${value}&projectId=${currentProject.id}`);
        const data = await res.json();
        if (res.ok) {
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
        const data = await res.json();

        setValue([...currentValue, data]);
        setNewValue({ label: "", value: "" });
    }

    const editValue = async ({ value, id, currentValue,
        setValue, newValue, setNewValue }) => {
        const res = await fetch(`/api/value?type=${value}&projectId=${currentProject.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newValue),
        });
        const data = await res.json();

        const updatedValues = currentValue.map((item) => {
            if (item.id === id) {
                return data;
            }
            return item;
        });

        setValue(updatedValues);
        setNewValue({ label: "", value: "" });
    }


    return (
        <ValueContext.Provider value={{ fetchValue, createValue, editValue }}>
            {children}
        </ValueContext.Provider>
    );
};

export const useValue = () => useContext(ValueContext);

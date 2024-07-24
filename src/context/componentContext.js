import { createContext, useContext, useCallback } from "react";
import { useProject } from "./projectContext";

const ComponentContext = createContext();

export const ComponentProvider = ({ children }) => {
    const { currentProject } = useProject();

    // Use useCallback to memoize the functions
    const createComponent = useCallback(async ({ type, variant, styles, components, setComponents, setCurrentProject }) => {
        try {
            const res = await fetch(`/api/component?type=${type}&projectId=${currentProject.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ variant, styles }),
            });
            const data = await res.json();
            if (res.ok) {
                setCurrentProject(prevCurrentProject => ({
                    ...prevCurrentProject,
                    components: [...prevCurrentProject.components, data]
                }));
                // setComponents(prevComponents => [...prevComponents, data]);
            } else {
                console.error("Failed to create component", data);
            }
        } catch (error) {
            console.error("An error occurred while creating the component:", error);
        }
    }, [currentProject]);

    const editComponent = useCallback(async ({ id, variant, type, styles, components, setComponents, setCurrentProject }) => {
        try {
            const res = await fetch(`/api/component?type=${type}&projectId=${currentProject.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, variant, styles }),
            });
            const data = await res.json();
            if (res.ok) {
                setCurrentProject(prevCurrentProject => ({
                    ...prevCurrentProject,
                    components: prevCurrentProject.components.map(component =>
                        component.id === id ? { ...component, styles: data } : component
                    )
                }));
                // setComponents(prevComponents =>
                //     prevComponents.map(component =>
                //         component.id === id ? { ...component, styles: data } : component
                //     )
                // );
            } else {
                console.error("Failed to edit component", data);
            }
        } catch (error) {
            console.error("An error occurred while editing the component:", error);
        }
    }, [currentProject]);

    return (
        <ComponentContext.Provider value={{ createComponent, editComponent }}>
            {children}
        </ComponentContext.Provider>
    );
};

export const useComponent = () => useContext(ComponentContext);
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [projectData, setProjectData] = useState(null);
    const map = {
        color: "colors",
        radius: "radii",
        spacing: "spacings",
    };


    //Intiall Calls
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/project");
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                    setCurrentProject(data[0]);
                } else {
                    console.error("Failed to fetch projects", await res.json());
                }


            } catch (error) {
                console.error(error);
            }
        };
        fetchProjects();
    }, []);




    //Fetching current proejct with attributes
    useEffect(() => {
        const fetchCurrentProjectWithAttributes = async () => {
            try {
                const res = await fetch(`/api/project/${currentProject.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProjectData(data);
                } else
                    console.error("Failed to fetch project", await res.json());
            } catch (error) {
                console.error(error);
            }
        };
        if (currentProject)
            fetchCurrentProjectWithAttributes();
    }, [currentProject]);


    //creates a new project
    const createProject = async (name) => {
        try {
            const res = await fetch("/api/project", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (res.ok) {
                setProjects([...projects, data]);
                setCurrentProject(data);
            } else {
                console.error("Failed to create project", data);
            }
        } catch (error) {
            console.error(error);
        }
    }


    //VALUE HANDLERS--------------------------------------------------------------
    const createValue = async ({ value, currentValue,
        newValue }) => {

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

        setProjectData((prevData) => ({
            ...prevData,
            [map[value]]: [...currentValue, data],
        }));


    }

    const editValue = async ({ value, id, currentValue, newValue }) => {
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
            const updatedValue = await res.json();

            const updatedValues = currentValue.map((item) => {
                if (item.id === id) {
                    return updatedValue;
                }
                return item;
            });
            setProjectData((prevData) => ({
                ...prevData,
                [map[value]]: updatedValues,
                components: prevData.components.map((component) => {
                    let updatedStyles = { ...component.styles };

                    if (map[value] === "colors") {
                        if (component.styles.bgColor.id === updatedValue.id) {
                            updatedStyles.bgColor = updatedValue;
                        }
                        if (component.styles.txtColor.id === updatedValue.id) {
                            updatedStyles.txtColor = updatedValue;
                        }
                        if (component.styles.brdrColor.id === updatedValue.id) {
                            updatedStyles.brdrColor = updatedValue;
                        }
                    } else if (map[value] === "radii") {
                        if (component.styles.radius.id === updatedValue.id) {
                            updatedStyles.radius = updatedValue;
                        }
                    } else if (map[value] === "spacings") {
                        if (component.styles.pdX.id === updatedValue.id) {
                            updatedStyles.pdX = updatedValue;
                        }
                        if (component.styles.pdY.id === updatedValue.id) {
                            updatedStyles.pdY = updatedValue;
                        }
                    }

                    if (JSON.stringify(updatedStyles) !== JSON.stringify(component.styles)) {
                        return { ...component, styles: updatedStyles };
                    }
                    return component;
                }
                ),
            }));

        } catch (error) {
            console.error("Failed to edit value", error);
        }
    };

    //COMPONENT HANDLERS--------------------------------------------------------------

    const createComponent = useCallback(async ({ type, variant, styles }) => {
        try {
            console.log("project id", currentProject.id);
            const res = await fetch(`/api/component?type=${type}&projectId=${currentProject.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ variant, styles }),
            });
            const data = await res.json();

            if (!res.ok) {
                console.error("Failed to create component", data);
                return;
            }

            setProjectData((prevData) => ({
                ...prevData,
                components: [...prevData.components, data],
            }));

        } catch (error) {
            console.error("An error occurred while creating the component:", error);
        }
    }, [currentProject]);

    const editComponent = useCallback(async ({ id, variant, type, styles }) => {
        try {

            const res = await fetch(`/api/component?type=${type}&projectId=${currentProject.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, variant, styles }),
            });
            const data = await res.json();

            if (!res.ok) {
                console.error("Failed to edit component", data);
                return;
            }
            setProjectData((prevData) => ({
                ...prevData,
                components: prevData.components.map((component) =>
                    (component.id === id &&
                        component.type === type &&
                        component.variant === variant
                    ) ? { ...component, styles: data } : component
                ),
            }));
        } catch (error) {
            console.error("An error occurred while editing the component:", error);
        }
    }, [currentProject]);




    return (
        <ProjectContext.Provider value={{
            currentProject, projects, projectData,
            createProject,
            createValue,
            editValue,
            createComponent,
            editComponent
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext);

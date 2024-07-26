import { components, inputSubComponents } from "@/utils/constants";
import { createContext, useContext, useEffect, useState } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [currentProject, setCurrentProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [cache, setCache] = useState({});

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/project");
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                    setCurrentProject(data[0]);
                    console.log("data", data);
                } else {
                    console.error("Failed to fetch projects", await res.json());
                }


            } catch (error) {
                console.error(error);
            }
        };
        fetchProjects();
    }, []);

    const handleCreateProject = async (name) => {
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

    const fetchProjectWithAttributes = async ({ type }) => {


        if (cache && cache.spacings && cache.radii && cache.colors) {
            return {
                spacings: cache.spacings,
                radii: cache.radii,
                colors: cache.colors,
                components: cache.componentsByType[type] || [],
            };
        }

        try {
            const res = await fetch(`/api/project/${currentProject.id}`);
            if (res.ok) {
                const data = await res.json();

                const allKeys = [...new Set([
                    ...Object.values(components),
                    ...Object.values(inputSubComponents),
                ])];
                const newCache = {
                    spacings: data.spacings,
                    radii: data.radii,
                    colors: data.colors,
                    componentsByType: allKeys.reduce((acc, key) => {
                        acc[key] = data.components.filter(component => component.type === key);
                        return acc;
                    }, {}),
                };

                setCache(newCache);

                return {
                    spacings: data.spacings,
                    radii: data.radii,
                    colors: data.colors,
                    components: newCache.componentsByType[type] || [],
                };
            } else {
                console.error("Failed to fetch project", await res.json());
                return {};
            }
        } catch (error) {
            console.error(error);
            return {};
        }
    };



    const updateCacheWithEditedValue = (updatedValue, value) => {
        const map = {
            color: "colors",
            radius: "radii",
            spacing: "spacings",
        };

        const valueKey = map[value];

        if (!cache || !cache[valueKey]) return;

        const updatedArray = cache[valueKey].map(item =>
            item.id === updatedValue.id ? updatedValue : item
        );

        const newCache = {
            ...cache,
            [valueKey]: updatedArray,
        };

        const updatedComponentsByType = Object.keys(cache.componentsByType).reduce((acc, type) => {
            acc[type] = cache.componentsByType[type].map(component => {
                let updatedStyles = { ...component.styles };

                if (valueKey === "colors") {
                    if (component.styles.bgColor.id === updatedValue.id) {
                        updatedStyles.bgColor = updatedValue;
                    }
                    if (component.styles.txtColor.id === updatedValue.id) {
                        updatedStyles.txtColor = updatedValue;
                    }
                    if (component.styles.brdrColor.id === updatedValue.id) {
                        updatedStyles.brdrColor = updatedValue;
                    }
                } else if (valueKey === "radii") {
                    if (component.styles.radius.id === updatedValue.id) {
                        updatedStyles.radius = updatedValue;
                    }
                } else if (valueKey === "spacings") {
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
            });
            return acc;
        }, {});

        setCache({
            ...newCache,
            componentsByType: updatedComponentsByType,
        });
    };




    return (
        <ProjectContext.Provider value={{ currentProject, projects, setCache, setCurrentProject, setProjects, handleCreateProject, fetchProjectWithAttributes, updateCacheWithEditedValue }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext);

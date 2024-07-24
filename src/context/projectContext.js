import { components } from "@/utils/constants";
import { createContext, useContext, useEffect, useState } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [currentProject, setCurrentProject] = useState(null);
    const [projects, setProjects] = useState([]);


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

    const fetchProjectWithAttributes = async ({
        type
    }) => {
        try {
            const res = await fetch(`/api/project/${currentProject.id}`);
            if (res.ok) {
                const data = await res.json();
                if (res.ok) {
                    return {
                        spacing: data.spacings,
                        radius: data.radii,
                        colors: data.colors,
                        components: data.components.filter((component) => component.type === type),
                    };
                }
            } else {
                console.error("Failed to fetch project", data);
                return {};
            }
        } catch (error) {
            console.error(error);
        }


    }

    return (
        <ProjectContext.Provider value={{ currentProject, setCurrentProject, projects, setProjects, handleCreateProject, fetchProjectWithAttributes }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext);

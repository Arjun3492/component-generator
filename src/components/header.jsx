import { useProject } from "@/context/projectContext";
import { signOut } from "next-auth/react";
import { useState } from "react";

const Header = () => {
  const { projects, currentProject, setCurrentProject, handleCreateProject } =
    useProject();
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  return (
    <nav className="flex justify-between items-center p-4 bg-slate-400 shadow text-black">
      <h1 className="text-xl font-bold">Figr</h1>
      <div className="flex items-center space-x-4">
        {projects.length === 0 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              handleCreateProject(projectName).finally(() => {
                setLoading(false);
              });
            }}
            className="flex items-center space-x-4"
          >
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className="px-4 py-2 border rounded-md"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </form>
        ) : (
          <select
            value={currentProject}
            onChange={(e) => setCurrentProject(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Header;

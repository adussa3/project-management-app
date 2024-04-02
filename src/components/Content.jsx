import { useContext } from "react";
import { ProjectsContext } from "../store/ProjectsContext";
import NewProject from "./NewProject";
import NoProjectSelected from "./NoProjectSelected";
import SelectedProject from "./SelectedProject";

export default function Content() {
    const { projectsState } = useContext(ProjectsContext);
    const { selectedProjectId, projects, tasks } = projectsState;

    let content;

    if (selectedProjectId === null) {
        content = <NewProject />;
    } else if (selectedProjectId === undefined) {
        content = <NoProjectSelected />;
    } else {
        const selectedProject = projects.find((project) => project.id === selectedProjectId);
        content = <SelectedProject project={selectedProject} tasks={tasks.filter((task) => task.projectId === selectedProjectId)} />;
    }

    return <>{content}</>;
}

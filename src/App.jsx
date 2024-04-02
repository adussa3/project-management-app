import { useEffect, useState } from "react";
import NewProject from "./components/NewProject.jsx";
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import ProjectsSidebar from "./components/ProjectsSidebar.jsx";
import SelectedProject from "./components/SelectedProject.jsx";
import { nanoid } from "nanoid";

function App() {
    const [projectsState, setProjectsState] = useState(() => {
        // We get the stored projectsState value from Local Storage
        // NOTE: Local Storage only store strings, so we need to parse the projectsState string into an object
        //       We can do this using JSON.parse()
        const data = JSON.parse(localStorage.getItem("projectsState"));

        if (data) {
            return data;
        } else {
            const initialProjectsState = {
                selectedProjectId: undefined,
                projects: [],
                tasks: [],
            };

            for (let i = 1; i <= 3; i++) {
                const projectId = nanoid();
                const project = {
                    id: projectId,
                    title: `Project ${i}`,
                    description: `This is the project ${i} description!`,
                    dueDate: `Jan ${i}, 2024`,
                };
                initialProjectsState.projects.push(project);

                for (let i = 1; i <= 3; i++) {
                    const taskId = nanoid();
                    const task = { id: taskId, projectId, text: `Task ${i}` };
                    initialProjectsState.tasks.push(task);
                }
            }

            return initialProjectsState;
        }
    });

    // useEffect stores the projectsState object in Local Storage every time the state changes
    // NOTE: Local Storage only stores strings, so we need to convert the projectsState object into a string
    //       We can do this using JSON.stringify()
    useEffect(() => {
        localStorage.setItem("projectsState", JSON.stringify(projectsState));
    }, [projectsState]);

    const handleAddTask = (text) => {
        setProjectsState((prevState) => {
            const newTask = {
                id: nanoid(),
                projectId: prevState.selectedProjectId,
                text,
            };

            return {
                ...prevState,
                tasks: [...prevState.tasks, newTask],
            };
        });
    };

    const handleDeleteTask = (id) => {
        setProjectsState((prevState) => {
            return { ...prevState, tasks: prevState.tasks.filter((task) => task.id !== id) };
        });
    };

    const handleSelectedProject = (id) => {
        setProjectsState((prevState) => ({ ...prevState, selectedProjectId: id }));
    };

    const handleStartAddProject = () => {
        setProjectsState((prevState) => ({ ...prevState, selectedProjectId: null }));
    };

    const handleCancelAddProject = () => {
        setProjectsState((prevState) => ({ ...prevState, selectedProjectId: undefined }));
    };

    const handleAddProject = (projectData) => {
        const newProject = {
            ...projectData,
            id: nanoid(),
        };

        setProjectsState((prevState) => {
            return {
                ...prevState,
                selectedProjectId: undefined,
                projects: [...prevState.projects, newProject],
            };
        });
    };

    const handleDeleteProject = () => {
        setProjectsState((prevState) => {
            return {
                ...prevState,
                selectedProjectId: undefined,
                projects: prevState.projects.filter((project) => project.id !== prevState.selectedProjectId),
            };
        });
    };

    const { selectedProjectId, projects, tasks } = projectsState;

    let content;

    if (selectedProjectId === null) {
        content = <NewProject onAdd={handleAddProject} onCancel={handleCancelAddProject} />;
    } else if (selectedProjectId === undefined) {
        content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
    } else {
        const selectedProject = projects.find((project) => project.id === selectedProjectId);
        content = (
            <SelectedProject
                project={selectedProject}
                onDelete={handleDeleteProject}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                tasks={tasks.filter((task) => task.projectId === selectedProjectId)}
            />
        );
    }

    return (
        <main className="h-screen my-8 flex gap-8">
            <ProjectsSidebar
                onStartAddProject={handleStartAddProject}
                projects={projects}
                onSelectProject={handleSelectedProject}
                selectedProjectId={selectedProjectId}
            />
            {content}
        </main>
    );
}

export default App;

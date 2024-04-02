import { nanoid } from "nanoid";
import { createContext, useEffect, useReducer } from "react";

export const ProjectsContext = createContext({
    projectsState: {
        selectedProjectId: undefined,
        projects: [],
        tasks: [],
    },
    onAddTask: () => {},
    onDeleteTask: () => {},
    onSelectedProject: () => {},
    onStartAddProject: () => {},
    onCancelAddProject: () => {},
    onAddProject: () => {},
    onDeleteProject: () => {},
});

const projectsStateReducer = (state, action) => {
    if (action.type === "ADD_TASK") {
        const newTask = {
            id: nanoid(),
            projectId: state.selectedProjectId,
            text: action.payload.text,
        };

        return {
            ...state,
            tasks: [...state.tasks, newTask],
        };
    }

    if (action.type === "DELETE_TASK") {
        return { ...state, tasks: state.tasks.filter((task) => task.id !== action.payload.id) };
    }

    if (action.type === "SELECTED_PROJECT") {
        return { ...state, selectedProjectId: action.payload.id };
    }

    if (action.type === "START_ADD_PROJECT") {
        return { ...state, selectedProjectId: null };
    }

    if (action.type === "CANCEL_ADD_PROJECT") {
        return { ...state, selectedProjectId: undefined };
    }

    if (action.type === "ADD_PROJECT") {
        const newProject = {
            ...action.payload.projectData,
            id: nanoid(),
        };

        return {
            ...state,
            selectedProjectId: undefined,
            projects: [...state.projects, newProject],
        };
    }

    if (action.type === "DELETE_PROJECT") {
        return {
            ...state,
            selectedProjectId: undefined,
            projects: state.projects.filter((project) => project.id !== state.selectedProjectId),
        };
    }
};

const initializeProjectState = () => {
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
};

export default function ProjectsContextProvider({ children }) {
    const [projectsState, projectsStateDispatch] = useReducer(projectsStateReducer, initializeProjectState());

    // useEffect stores the projectsState object in Local Storage every time the state changes
    // NOTE: Local Storage only stores strings, so we need to convert the projectsState object into a string
    //       We can do this using JSON.stringify()
    useEffect(() => {
        localStorage.setItem("projectsState", JSON.stringify(projectsState));
    }, [projectsState]);

    function handleAddTask(text) {
        projectsStateDispatch({
            type: "ADD_TASK",
            payload: {
                text,
            },
        });
    }

    function handleDeleteTask(id) {
        projectsStateDispatch({
            type: "DELETE_TASK",
            payload: {
                id,
            },
        });
    }

    function handleSelectedProject(id) {
        projectsStateDispatch({
            type: "SELECTED_PROJECT",
            payload: {
                id,
            },
        });
    }

    function handleStartAddProject() {
        projectsStateDispatch({
            type: "START_ADD_PROJECT",
        });
    }

    function handleCancelAddProject() {
        projectsStateDispatch({
            type: "CANCEL_ADD_PROJECT",
        });
    }

    function handleAddProject(projectData) {
        projectsStateDispatch({
            type: "ADD_PROJECT",
            payload: {
                projectData,
            },
        });
    }

    function handleDeleteProject() {
        projectsStateDispatch({
            type: "DELETE_PROJECT",
        });
    }

    const contextValue = {
        projectsState,
        onAddTask: handleAddTask,
        onDeleteTask: handleDeleteTask,
        onSelectedProject: handleSelectedProject,
        onStartAddProject: handleStartAddProject,
        onCancelAddProject: handleCancelAddProject,
        onAddProject: handleAddProject,
        onDeleteProject: handleDeleteProject,
    };

    return <ProjectsContext.Provider value={contextValue}>{children}</ProjectsContext.Provider>;
}

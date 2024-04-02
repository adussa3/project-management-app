import Content from "./components/Content.jsx";
import ProjectsSidebar from "./components/ProjectsSidebar.jsx";
import ProjectsContextProvider, { ProjectsContext } from "./store/ProjectsContext.jsx";

function App() {
    return (
        <ProjectsContextProvider>
            <main className="h-screen my-8 flex gap-8">
                <ProjectsSidebar />
                <Content />
            </main>
        </ProjectsContextProvider>
    );
}

export default App;

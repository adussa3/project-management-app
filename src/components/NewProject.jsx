import { useContext, useRef } from "react";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import Modal from "./Modal.jsx";
import { ProjectsContext } from "../store/ProjectsContext.jsx";

export default function NewProject() {
    const { onAddProject, onCancelAddProject } = useContext(ProjectsContext);

    const modal = useRef();
    const title = useRef();
    const description = useRef();
    const dueDate = useRef();

    const handleSave = () => {
        // get input values from refs
        const enteredTitle = title.current.value;
        const enteredDescription = description.current.value;
        const enteredDueDate = dueDate.current.value;

        // valdiation ...
        if (!enteredTitle.trim() || !enteredDescription.trim() || !enteredDueDate.trim()) {
            // show error modal
            modal.current.open();
            return;
        }

        // if validation passed, add the project to the projectsState
        const newProject = {
            title: enteredTitle,
            description: enteredDescription,
            dueDate: enteredDueDate,
        };

        onAddProject(newProject);
    };

    return (
        <>
            <Modal ref={modal} buttonCaption="Okay">
                <h2 className="text-xl font-bold text-stone-700 my-4">Invalid Input</h2>
                <p className="text-stone-600 mb-4">Oops... looks like you forgot to enter a value.</p>
                <p className="text-stone-600 mb-4">Please make sure that you provide a valid value for every input field.</p>
            </Modal>
            {/*
                "w-[35rem]" is how we set a custom value in tailwind
                it's a special syntax supported by tailwind where we can include the value we want to have in the classname
                and behind the scenes Tailwind generate the class for you
            */}
            <div className="w-[35rem] mt-16">
                <menu className="flex items-center justify-end gap-4 my-4">
                    <li>
                        <button className="text-stone-800 hover:text-stone-950" onClick={onCancelAddProject}>
                            Cancel
                        </button>
                    </li>
                    <li>
                        <Button onClick={handleSave}>Save</Button>
                    </li>
                </menu>
                <div>
                    <Input type="text" ref={title} label="Title" />
                    {/* Note: if you set a property by itself (like "textarea") it's automatically set to true */}
                    <Input ref={description} label="Description" textarea />
                    <Input type="date" ref={dueDate} label="Due Date" />
                </div>
            </div>
        </>
    );
}

import React, { useState, useEffect, useRef, useReducer } from "react";
import UpdateTask from "./UpdateTask";
import DeleteTask from "./DeleteTask"
import CategoriesForTask from "./CategoriesForTask";
import { Modal } from "bootstrap";
import { format } from 'date-fns';

export default function Tasks(props) {
    const [tasks, setTasks] = useState([]);
    const [updateTaskId, setUpdateTaskId] = useState();
    const updateTaskRef = useRef();
    const [deleteTaskId, setDeleteTaskId] = useState();
    const deleteTaskRef = useRef();
    const refresh = props.refresh;
    const setRefresh = props.setRefresh;

    const [refreshCategories, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'add':
                state[action.id] = true;
                return state;
            case 'delete':
                delete state[action.id];
                return state;
            case 'update':
                state[action.id] = action.refresh;
                return state;
          }
    }, {});

    const url = "/api/tasks/read";
    useEffect(() => {
        console.log("refreshing tasks?");
        if (refresh) {
            console.log("refreshed tasks!")
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Network response was not ok.");
                })
                .then(response => {
                    response.map(task => { 
                        dispatch({'type': 'add', 'id': task.id});
                    });
                    setTasks(response);
                })
                .catch(error => console.log(error.message))
            setRefresh(false);
        }
    }, [refresh]);

    function showModal(ref) {
        const modal = new Modal(ref.current);
        modal.show();
    }    

    useEffect(() => {
        if (updateTaskId !== undefined) {
            showModal(updateTaskRef);
        }
    }, [updateTaskId]);

    useEffect(() => {
        if (deleteTaskId !== undefined) {
            showModal(deleteTaskRef);
        }
    }, [deleteTaskId]);

    const allTasks = tasks.map((task, index) => (
        <div key={index} className="col-md-6 col-lg-4">
            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="card-title">{task.name}</h4>
                    <h6 className="card-subtitle text-muted">{format(new Date(task.deadline), "MMM d")}</h6>
                    <div className="card-body pl-0">
                        <CategoriesForTask id={task.id} refreshCategories={refreshCategories[task.id]} setRefreshCategories={ bool => dispatch({'type': 'update', 'id': task.id, 'refresh': bool}) }/>
                        <button type="button" className="btn btn-primary" onClick={() => setUpdateTaskId(task.id) }><i className="bi bi-pencil-square"></i></button>
                        <button type="button" className="btn btn-danger"onClick={() => setDeleteTaskId(task.id)}><i className="bi bi-trash" /></button>
                    </div>
                </div>
            </div>
        </div>
    ));
    

    const noTasks = (
        <div>
            <h4>
                No tasks yet!
            </h4>
        </div>
    )

    return (
        <>
        <UpdateTask ref={updateTaskRef} id={updateTaskId} refreshHome={ () => { setRefresh(true); setUpdateTaskId(undefined);  } } refreshCategories={ () => dispatch({'type': 'update', 'id': updateTaskId, 'refresh': true}) }/>
        <DeleteTask ref={deleteTaskRef} id={deleteTaskId} refreshHome={ () => { setRefresh(true); setDeleteTaskId(undefined);  } } refreshCategories={ () => dispatch({'type': 'delete', 'id': deleteTaskId}) }/>

        <div>
            {tasks.length > 0 ? allTasks : noTasks}
        </div>
        </>
    )
}
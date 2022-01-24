import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import NewCategoriesForTask from "./NewCategoriesForTask";

import "react-datepicker/dist/react-datepicker.css";

export default React.forwardRef((props, ref) => {
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState(undefined);
    const setRefreshHome = props.setRefreshHome;
    const [createdTaskId, setCreatedTaskId] = useState();
    const reset = props.reset;
    const setReset = props.setReset;
    const [resetCategoriesComponent, setResetCategoriesComponent] = useState(false);

    useEffect(() => {
        if (reset) {
            setName('');
            setDeadline(undefined);
            setCreatedTaskId();
            setReset(false);
            setResetCategoriesComponent(true);
        }
    }, [reset]);

    function onSubmit(event) {
        event.preventDefault()
        const body = {
            name,
            deadline
        };
        const url = '/api/tasks/create';

        if (name.length === 0 || deadline.length === 0) { return; }

        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
            method: "POST",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then(response => setCreatedTaskId(response.id))
        .catch(error => console.log(error.message));
    }

    return (
        <div className="modal fade" ref={ref} id="modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">New Task</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <form onKeyDown={(event) => { if (event.code === 'Enter') event.preventDefault(); }}>
                                <div className="form-group">
                                    <label htmlFor="taskName">Name</label>
                                    <input type="text" name="name" id="taskName" value={name} autoComplete="off" onChange={event => setName(event.target.value)}/>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="taskDeadline">Deadline</label>
                                    <DatePicker selected={deadline} name="deadline" id="taskDeadline" autoComplete="off" onChange={setDeadline} dateFormat="dd/MM/yyyy"/>
                                </div>
                            </form>
                        </div>
                        <NewCategoriesForTask id={createdTaskId} setId={setCreatedTaskId} refreshHome={() => setRefreshHome(true)}  reset={resetCategoriesComponent} setReset={setResetCategoriesComponent}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onSubmit}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
})


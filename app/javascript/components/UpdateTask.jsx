import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import UpdateCategoriesForTask from "./UpdateCategoriesForTask";

import "react-datepicker/dist/react-datepicker.css";

export default React.forwardRef((props, ref) => {
    const id = props.id;
    const [name, setName] = useState([]);
    const [deadline, setDeadline] = useState(undefined);
    const refreshHome = props.refreshHome;
    const [updateCategoriesForTaskBool, setUpdateCategoriesForTaskBool] = useState(false)
    const refreshCategories = props.refreshCategories;
    const [checked, setChecked] = useState(false);

    function check(checkedValue) {
        setChecked(checkedValue);
        checkedValue ? undefined : setDeadline(undefined);
    }
    function onSubmit(event) {
        event.preventDefault()
        const body = {
            id,
            name,
            deadline
        };
        body.deadline = deadline ? new Date(deadline.getTime() - (60000*deadline.getTimezoneOffset())) : null;
        
        const url = `/api/tasks/update`;

        if (name.length === 0) { return; }

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
        .then(() => setUpdateCategoriesForTaskBool(true))
        .catch(error => console.log(error.message));
    }

    useEffect(() => {
        if (id !== undefined) {
            const url = `/api/tasks/show/${id}`;
            fetch(url)
            .then(response => {
                if (response.ok) {
                return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => {
                        setName(response.name);
                        if (response.deadline) {
                            setDeadline(new Date(response.deadline))
                            check(true);
                        } else {
                            check(false);
                        }
            })
            .catch(() => console.log(error.message));
        }
    }, [id]);
    

    return (
        <>
        <div className="modal fade" ref={ref} id="modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Task</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={refreshHome}></button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="row">
                                <form onKeyDown={(event) => { if (event.code === 'Enter') event.preventDefault(); }}>
                                    <div className="form-group row mb-4">
                                        <div className="col-1"></div>
                                        <label className="col-2" htmlFor="taskName">Name</label>
                                        <input className="col-8" type="text" name="name" id="taskName" value={name} autoComplete="off" onChange={event => setName(event.target.value)}/>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="form-check form-switch col-3">
                                            <input className="form-check-input" type="checkbox" checked={checked} onChange={(event) => check(event.target.checked)}/>
                                            <label htmlFor="taskDeadline">Deadline</label>
                                        </div>
                                        <div className="form-group col-8 p-0">
                                            <DatePicker selected={deadline} disabled={!checked} name="deadline" id="taskDeadline" autoComplete="off" onChange={setDeadline} dateFormat="dd/MM/yyyy"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <UpdateCategoriesForTask id={props.id} refreshHome={refreshHome} updateBool={updateCategoriesForTaskBool} setUpdateBool={setUpdateCategoriesForTaskBool} refreshCategories={refreshCategories} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={refreshHome}>Close</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onSubmit}>Update</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
})
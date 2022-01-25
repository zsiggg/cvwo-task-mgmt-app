import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import NewCategoriesForTask from "./NewCategoriesForTask";

export default React.forwardRef((props, ref) => {
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState(undefined);
    const setRefreshHome = props.setRefreshHome;
    const [createdTaskId, setCreatedTaskId] = useState();
    const reset = props.reset;
    const setReset = props.setReset;
    const [resetCategoriesComponent, setResetCategoriesComponent] = useState(false);
    const [checked, setChecked] = useState(false);

    function check(checkedValue) {
        setChecked(checkedValue);
        checkedValue ? undefined : setDeadline(undefined);
    }

    useEffect(() => {
        if (reset) {
            setName('');
            setDeadline(undefined);
            setCreatedTaskId();
            setReset(false);
            check(false);
            setResetCategoriesComponent(true);
        }
    }, [reset]);

    function onSubmit(event) {
        event.preventDefault()
        const body = {
            name,
            deadline
        };
        body.deadline = deadline ? new Date(deadline.getTime() - (60000*deadline.getTimezoneOffset())) : undefined;

        const url = '/api/tasks/create';

        if (name.length === 0 ) { return; }

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
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">New Task</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
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


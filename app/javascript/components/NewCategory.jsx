import React, { useState } from "react";
import { Modal } from "bootstrap";

export default React.forwardRef((props, ref) => {
    const parentModalRef = props.parentModalRef;
    const setRefreshCategories = props.setRefreshCategories;
    const [name, setName] = useState([]);

    function openParentModal() {
        const parentModal = new Modal(parentModalRef.current);
        parentModal.show();
        setRefreshCategories(true);
    }

    function onSubmit(event) {
        event.preventDefault()
        const body = {
            name
        };
        const url = '/api/categories/create';

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
        .then(response => openParentModal())
        .catch(error => console.log(error.message));
    }

    return (
        <div className="modal fade" ref={ref} id="modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">New Category</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onKeyDown={(event) => { if (event.code === 'Enter') event.preventDefault(); }}>
                            <div className="form-group row">
                                <label htmlFor="taskName" className="col-2">Name</label>
                                <input className="col-8" type="text" name="name" id="taskName" required autoComplete="off" onChange={event => setName(event.target.value)}/>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={openParentModal} data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onSubmit}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
})


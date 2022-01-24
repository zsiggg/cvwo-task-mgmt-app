import { Modal } from "bootstrap";
import React, { useState, useEffect } from "react";

export default React.forwardRef((props, ref) => {
    const id = props.id;
    const parentModalRef = props.parentModalRef;
    const [name, setName] = useState([]);
    const refreshParent = props.refreshParent;

    function openParentModal() {
        const parentModal = new Modal(parentModalRef.current);
        parentModal.show();
        refreshParent();
    }

    function onSubmit(event) {
        event.preventDefault()
        const body = {
            id,
            name
        };
        const url = `/api/categories/update`;

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
        .then(() => openParentModal())
        .catch(error => console.log(error.message));
    }

    useEffect(() => {
        if (id !== undefined) {
            const url = `/api/categories/show/${id}`;
            fetch(url)
            .then(response => {
                if (response.ok) {
                return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(response => setName(response.name))
            .catch(() => console.log(error.message)); 
        }
    }, [id]);

    return (
        <div className="modal fade" ref={ref} id="modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Category</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={openParentModal}></button>
                    </div>
                    <div className="modal-body">
                        <form onKeyDown={(event) => { if (event.code === 'Enter') event.preventDefault(); }}>
                            <div className="form-group">
                                <label htmlFor="taskName">Name</label>
                                <input type="text" name="name" id="categoryName" autoComplete="off" value={name} onChange={event => setName(event.target.value)}/>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={openParentModal} data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onSubmit}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
})
import React from "react";
import { Modal } from "bootstrap";

export default React.forwardRef((props, ref) => {
    const id = props.id;
    const parentModalRef = props.parentModalRef;
    const refreshParent = props.refreshParent;

    function openParentModal() {
        const parentModal = new Modal(parentModalRef.current);
        parentModal.show();
        refreshParent();
    }

    function onSubmit(event) {
        event.preventDefault()
        const url = `/api/categories/delete/${id}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;

        fetch(url, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then(() => openParentModal())
            .catch(error => console.log(error.message))
    }

    return (
        <div className="modal fade" ref={ref} id="modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete Category</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <span>Are you sure you want to delete this category?</span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={openParentModal} data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-danger" onClick={onSubmit} data-bs-dismiss="modal">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
})
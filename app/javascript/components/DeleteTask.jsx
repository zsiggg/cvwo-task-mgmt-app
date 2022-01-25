import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default React.forwardRef((props, ref) => {
    const id = props.id;
    const refreshHome = props.refreshHome;
    const refreshCategories = props.refreshCategories;

    function onSubmit(event) {
        event.preventDefault()
        const url = `/api/tasks/delete/${id}`;
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
            .then(() => { refreshCategories(); refreshHome(); })
            .catch(error => console.log(error.message))
    }

    return (
        <div className="modal fade" ref={ref} id="modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete Task</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={refreshHome}></button>
                    </div>
                    <div className="modal-body">
                        <span>Are you sure you want to delete this task?</span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={refreshHome}>Close</button>
                        <button type="button" className="btn btn-danger" onClick={onSubmit} data-bs-dismiss="modal">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
})
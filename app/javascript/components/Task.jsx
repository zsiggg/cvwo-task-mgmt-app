import React from "react";
import CategoriesForTask from "./CategoriesForTask";

export default (props) => {
    return (
        <div name={task.id} className="col-md-6 col-lg-4">
            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="card-title">{task.name}</h4>
                    <h6 className="card-subtitle text-muted">{format(new Date(task.deadline), "MMM d")}</h6>
                    <div className="card-body pl-0">
                        <CategoriesForTask id={task.id} refreshCategoriesBool={refreshCategoriesBool}/>
                        <button type="button" className="btn btn-primary" onClick={() => setUpdateTaskId(task.id) }><i className="bi bi-pencil-square"></i></button>
                        <button type="button" className="btn btn-danger"onClick={() => setDeleteTaskId(task.id)}><i className="bi bi-trash" /></button>
                    </div>
                </div>
            </div>
        </div>
    );

}
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function Task() {
    const [task, setTask] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const url = `/api/tasks/show/${id}`;
        fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then(response => setTask(response))
          .catch(() => navigate("/tasks"));
    }, []);

    return (
        <div className="">
            <div className="hero position-relative d-flex align-items-center justify-content-center">
                <div className="overlay bg-dark position-absolute" />
                <h1 className="display-4 position-relative text-white">
                {task.name}
                </h1>
            </div>
            <div className="container py-5">
                <div className="col-sm-12 col-lg-2">
                    <button type="button" className="btn btn-danger">
                    Delete Task
                    </button>
                </div>
                <Link to="/tasks" className="btn btn-link">
                Back to tasks
                </Link>
            </div>
        </div>
    );
    

}

export default Task;
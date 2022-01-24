import { set } from "date-fns";
import React, { useEffect, useState } from "react";

export default (props) => {
    const id = props.id;
    const url = "/api/categories_tasks/read";
    const body = { id };
    const token = document.querySelector('meta[name="csrf-token"]').content;
    const [categories, setCategories] = useState([]);
    const refreshCategories = props.refreshCategories;
    const setRefreshCategories = props.setRefreshCategories;

    useEffect(() => {
        if (refreshCategories) {
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
            .then(response => setCategories(response))
            .catch(error => console.log(error.message));
            console.log("refreshed categories for", id);  
            setRefreshCategories(false);  
        }
    }, [refreshCategories]);

    const allCategories = categories.map((category, index) => (
        <span key={index} className="badge bg-secondary fs-6 text mr-2 col-auto">{category.name}</span>
    ));
    return (
        <div id={props.id} className="mb-3">
        {categories.length != 0 ? allCategories : undefined}
        </div>
    )
}
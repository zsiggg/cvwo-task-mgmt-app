import React, { useEffect, useState, useContext} from "react";
import { CategoriesContext } from "./CategoriesContext";

export default (props) => {
    // dropdown list
    // lsit of categories that have been clicked

    // get all categories and categories that have been tagged from context
        // get untagged categories, store in state variable, display in dropdown
    // state variable CategoriesToBeTagged 
    // onclick add to the state variable, and remove from the state variable

    // updateCategory = false at first, pass in true on click of add/update
    // send to api categories_tasks/tag_category
    const allCategories = useContext(CategoriesContext).categories;
    const id = props.id;
    const body = { id };
    const token = document.querySelector('meta[name="csrf-token"]').content;
    const [taggedCategories, setTaggedCategories] = useState([]);
    const [taggedCategoriesDropdown, setTaggedCategoriesDropdown] = useState();
    const [untaggedCategories, setUntaggedCategories] = useState([]);
    const [untaggedCategoriesDropdown, setUntaggedCategoriesDropdown] = useState();
    const [toBeTaggedCategories, setToBeTaggedCategories] = useState([]);
    const [toBeDeletedCategories, setToBeDeletedCategories] = useState([]);
    const [disableUntaggedDropdown, setDisableUntaggedDropdown] = useState("btn btn-secondary dropdown-toggle"); 
    const [disableTaggedDropdown, setDisableTaggedDropdown] = useState("btn btn-secondary dropdown-toggle"); 
    const refreshCategories = props.refreshCategories;

    const updateBool = props.updateBool;
    const setUpdateBool = props.setUpdateBool;
    const refreshHome = props.refreshHome;

    

    if (updateBool && toBeTaggedCategories.length != 0) {
        const body = toBeTaggedCategories.reduce((prev, curr) => { 
            prev.push({ "category_id": curr.id, "id": id }); 
            return prev; 
        }, []);
        const url = `/api/categories_tasks/tag_category`;
        console.log(JSON.stringify({ body }))

        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
            method: "POST",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ body })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then(() => { refreshCategories(); setUpdateBool(false); refreshHome(); })
        .catch(error => console.log(error.message));

        print(toBeDeletedCategories)
    }
    else if (updateBool) {
        setUpdateBool(false);
        refreshHome();
    }

    function onSelectUntaggedDropdown(category) {
        const untaggedCopy = [...untaggedCategories];      
        setUntaggedCategories(untaggedCopy.filter(item => item != category));
    }

    function onSelectTaggedDropdown(category) {
        const taggedCopy = [...taggedCategories];      
        setTaggedCategories(taggedCopy.filter(item => item != category));
    }
    useEffect(() => {
        if (id !== undefined) {
            fetch("/api/categories_tasks/read", {
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
            .then(response => setTaggedCategories(response))
            .catch(error => console.log(error.message));
        }
    }, [id]);

    useEffect(() => {
        if (taggedCategories.length == 0) setDisableTaggedDropdown("btn btn-secondary dropdown-toggle disabled");
        else setDisableTaggedDropdown("btn btn-secondary dropdown-toggle");

        const untagged = allCategories.filter(item => !taggedCategories.includes(item.name));
        setUntaggedCategories(untagged);

        const dropdown = taggedCategories.map((category, index) => (
            <li key={index}><button className="dropdown-item" onClick={() => onSelectTaggedDropdown(category)}>{category.name}</button></li>
        ))
        setTaggedCategoriesDropdown(dropdown);

        setToBeDeletedCategories(
            allCategories.filter((item) => !taggedCategories.includes(item.name) && !untaggedCategories.includes(item) && !toBeTaggedCategories.includes(item))
        )
    }, [taggedCategories]); 

    useEffect(() => {
        if (untaggedCategories.length == 0) setDisableUntaggedDropdown("btn btn-secondary dropdown-toggle disabled");
        else setDisableUntaggedDropdown("btn btn-secondary dropdown-toggle");

        const dropdown = untaggedCategories.map((category, index) => (
            <li key={index}><button className="dropdown-item" onClick={() => onSelectUntaggedDropdown(category)}>{category.name}</button></li>
        ));
        setUntaggedCategoriesDropdown(dropdown);
        
        setToBeTaggedCategories(
            allCategories.filter((item) => !taggedCategories.includes(item.name) && !untaggedCategories.includes(item) && !toBeDeletedCategories.includes(item))
        );
    }, [untaggedCategories]);

    return (
        <>
        <div className="row">
            <div className="dropdown" id="dropdown">
                <button className={disableUntaggedDropdown} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Update Category
                </button>
                <ul className="dropdown-menu">
                    {untaggedCategoriesDropdown}
                </ul>
            </div>
                {toBeTaggedCategories.reduce((prev, curr) => { prev.push(curr.name); return prev; }, [])}
        </div>

        <div className="row">
            <div className="dropdown" id="dropdown">
                <button className={disableTaggedDropdown} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Delete Category
                </button>
                <ul className="dropdown-menu">
                    {taggedCategoriesDropdown}
                </ul>
            </div>
            <div>
                {toBeDeletedCategories.reduce((prev, curr) => { prev.push(curr.name); return prev; }, [])}
            </div>
        </div>

        </>
    )
}   
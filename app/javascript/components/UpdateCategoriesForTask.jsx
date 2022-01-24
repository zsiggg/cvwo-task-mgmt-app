import React, { useEffect, useState, useContext, useReducer} from "react";
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
    // const [taggedCategories, setTaggedCategories] = useState([]);
    // const [taggedCategoriesDropdown, setTaggedCategoriesDropdown] = useState();
    // const [toBeTaggedCategories, setToBeTaggedCategories] = useState([]);
    // const [disableDropdown, setDisableDropdown] = useState("btn btn-secondary dropdown-toggle"); 
    const refreshCategories = props.refreshCategories;
    const updateBool = props.updateBool;
    const setUpdateBool = props.setUpdateBool;
    const refreshHome = props.refreshHome;

    // function reducer(state, action) {
    //     switch (action.type) {
    //         case 'untag':
    //             const stateCopy = {...state};
    //             const category = stateCopy.tagged.filter(item => item.id == action.categoryId)[0];
    //             if (!stateCopy.toBeUntagged.includes(category)) stateCopy.toBeUntagged.push(category);
    //             stateCopy.tagged = stateCopy.tagged.filter(item => item.id != action.categoryId);
    //             return stateCopy;
    //         case 'tag':
    //             const stateCopy2 = {...state};
    //             const category2 = stateCopy2.untagged.filter(item => item.id == action.categoryId)[0];
    //             if (!stateCopy2.toBeTagged.includes(category2)) stateCopy2.toBeTagged.push(category2);
    //             stateCopy2.untagged = stateCopy2.untagged.filter(item => item.id != action.categoryId);
    //             return stateCopy2;
    //         case 'setState':
    //             return action.state;
    //       }
    // }
    // const [categoriesState, dispatch] = useReducer(reducer, {
    //     untagged: [],
    //     toBeTagged: [],
    //     tagged: [],
    //     toBeUntagged: [],
    // });

    const [categoriesState, setCategoriesState] = useState({
        untagged: [],
        toBeTagged: [],
        tagged: [],
        toBeUntagged: []
    });

    const [untaggedDropdownClass, setUntaggedDropdownClass] = useState('btn btn-secondary dropdown-toggle');
    const [taggedDropdownClass, setTaggedDropdownClass] = useState('btn btn-secondary dropdown-toggle');

    useEffect(() => {
        setUntaggedDropdownClass(categoriesState.untagged.length != 0 ? 'btn btn-secondary dropdown-toggle' : 'btn btn-secondary dropdown-toggle disabled');
        setTaggedDropdownClass(categoriesState.tagged.length != 0 ? 'btn btn-secondary dropdown-toggle' : 'btn btn-secondary dropdown-toggle disabled');
    }, [categoriesState])

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
            .then(response => {
                const taggedCategoriesIdArr = response.reduce((prev, category) => { prev.push(category.id); return prev; }, []);
                const untaggedCategories = [];
                for (let i = 0; i < allCategories.length; i++) {
                    if (!taggedCategoriesIdArr.includes(allCategories[i].id)) {
                        untaggedCategories.push(allCategories[i]);
                    }
                }
                setCategoriesState({
                    untagged: untaggedCategories,
                    toBeTagged: [],
                    tagged: response,
                    toBeUntagged: [],
                });
            })
            .catch(error => console.log(error.message));
        }
    }, [id]);

    const untaggedDropdown = categoriesState.untagged.map((category, index) => (
        <li key={index}>
            <button className="dropdown-item" onClick={() => {
                        const stateCopy = {...categoriesState}
                        if (!stateCopy.toBeTagged.includes(category)) stateCopy.toBeTagged.push(category);
                        stateCopy.untagged = stateCopy.untagged.filter(item => item.id != category.id);
                        setCategoriesState(stateCopy);
            }}>
                {category.name}
            </button>
    </li>
    ));
    const taggedDropdown = categoriesState.tagged.map((category, index) => (
        <li key={index}>
            <button className="dropdown-item" onClick={() => {
                        const stateCopy = {...categoriesState}
                        if (!stateCopy.toBeUntagged.includes(category)) stateCopy.toBeUntagged.push(category);
                        stateCopy.tagged = stateCopy.tagged.filter(item => item.id != category.id);
                        setCategoriesState(stateCopy);
            }}>
                {category.name}
            </button>
        </li>
    ));
    const toBeTagged = categoriesState.toBeTagged.map((category, index) => (
        <span key={index} className="badge bg-primary fs-8 text">{category.name} 
            <button type="button" className="btn btn-close btn-sm" onClick={() => {
                const stateCopy = {...categoriesState}
                if (!stateCopy.untagged.includes(category)) stateCopy.untagged.push(category);
                stateCopy.toBeTagged = stateCopy.toBeTagged.filter(item => item.id != category.id);
                setCategoriesState(stateCopy);
            }}>
            </button>
        </span>
    ));
    const toBeUntagged = categoriesState.toBeUntagged.map((category, index) => (
        <span key={index} className="badge bg-danger fs-8 text">{category.name} 
            <button type="button" className="btn btn-close btn-sm" onClick={() => {
                const stateCopy = {...categoriesState}
                if (!stateCopy.tagged.includes(category)) stateCopy.tagged.push(category);
                stateCopy.toBeUntagged = stateCopy.toBeUntagged.filter(item => item.id != category.id);
                setCategoriesState(stateCopy);
            }}>
            </button>
        </span>
    ));

    if (updateBool) {
        if (categoriesState.toBeUntagged.length != 0 || categoriesState.toBeTagged.length != 0) {
            if (categoriesState.toBeTagged.length != 0) {
                const body = categoriesState.toBeTagged.reduce((prev, curr) => { 
                    prev.push({ "category_id": curr.id, "id": id }); 
                    return prev; 
                }, []);
                const url = `/api/categories_tasks/tag_category`;
        
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
                .catch(error => console.log(error.message));
            }
            if (categoriesState.toBeUntagged.length != 0) {
                const body = categoriesState.toBeUntagged.reduce((prev, curr) => { 
                    prev.push({ "category_id": curr.id, "id": id }); 
                    return prev; 
                }, []);
                const url = `/api/categories_tasks/untag_category`;
        
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
                .catch(error => console.log(error.message));
            }
            refreshCategories();
        }
        setUpdateBool(false); 
        refreshHome();
    } 

    // function onSelectDropdownItem(category) {
    //     const untaggedCopy = [...untaggedCategories];      
    //     setUntaggedCategories(untaggedCopy.filter(item => item != category));
    // }

    // useEffect(() => {
    //     const untagged = allCategories.filter(item => !taggedCategories.includes(item.name));
    //     setUntaggedCategories(untagged);
    // }, [taggedCategories]); 

    // useEffect(() => {
    //     if (untaggedCategories.length == 0) setDisableDropdown("btn btn-secondary dropdown-toggle disabled");
    //     else setDisableDropdown("btn btn-secondary dropdown-toggle");

    //     const dropdown = untaggedCategories.map((category, index) => (
    //         <li key={index}><button className="dropdown-item" onClick={() => onSelectDropdownItem(category)}>{category.name}</button></li>
    //     ));
    //     setUntaggedCategoriesDropdown(dropdown);
        
    //     setToBeTaggedCategories(
    //         allCategories.filter((item) => !taggedCategories.includes(item.name) && !untaggedCategories.includes(item))
    //     );
    // }, [untaggedCategories]);

    return (
        <>
        <div className="row">
            <div className="col-6 dropdown" id="dropdown">
                <button className={untaggedDropdownClass} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Update Category
                </button>
                <ul className="dropdown-menu">
                    {untaggedDropdown}
                </ul>
            </div>
            <div className="col-6 dropdown" id="dropdown">
                <button className={taggedDropdownClass} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Delete Category
                </button>
                <ul className="dropdown-menu">
                    {taggedDropdown}
                </ul>
            </div>
        </div>
        <div className="row">
            <div className="col-6">
                {toBeTagged}
            </div>
            <div className="col-6">
                {toBeUntagged}
            </div>
        </div>
        </>
    )
}   
import React, { useEffect, useState, useContext, useMemo} from "react";
import { CategoriesContext } from "./CategoriesContext";

export default (props) => {
    const [categoriesState, setCategoriesState] = useState({
        untagged: [],
        toBeTagged: [],
    });
    const allCategories = useContext(CategoriesContext).categories;
    useMemo(() => setCategoriesState({
        untagged: allCategories,
        toBeTagged: categoriesState.toBeTagged
    }), [allCategories])
    const id = props.id;
    const setId = props.setId;
    const refreshHome = props.refreshHome;
    const reset = props.reset;
    const setReset = props.setReset;

    const [untaggedDropdownClass, setUntaggedDropdownClass] = useState('btn btn-secondary dropdown-toggle');

    useEffect(() => {
        setUntaggedDropdownClass(categoriesState.untagged.length != 0 ? 'btn btn-secondary dropdown-toggle' : 'btn btn-secondary dropdown-toggle disabled');
    }, [categoriesState]);

    useEffect(() => {
        if (reset) {
            setId(undefined);
            setCategoriesState({
                untagged: allCategories,
                toBeTagged: []
            });
            setReset(false);
        }
    }, [reset])

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

    if (id) {
        if (categoriesState.toBeTagged.length != 0) {
            console.log("calling api to tag");
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
        setId(undefined);
        refreshHome();
    }
    return (
        <>
        <div className="row">
            <div className="col-6 dropdown" id="dropdown">
                <button className={untaggedDropdownClass} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Category
                </button>
                <ul className="dropdown-menu">
                    {untaggedDropdown}
                </ul>
            </div>
        </div>
        <div className="row">
            <div className="col-6">
                {toBeTagged}
            </div>
        </div>
        </>
    )
}
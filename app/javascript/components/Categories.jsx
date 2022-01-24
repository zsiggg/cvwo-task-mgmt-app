import React, { useState, useEffect, useRef, useContext } from "react";
import UpdateCategory from "./UpdateCategory";
import DeleteCategory from "./DeleteCategory";
import NewCategory from "./NewCategory";
import { Modal } from "bootstrap";
import { CategoriesContext } from "./CategoriesContext";

export default React.forwardRef((props,ref) => {
    const [categories, setCategories] = useState([]);
    const [updateCategoryId, setUpdateCategoryId] = useState();
    const updateCategoryRef = useRef();
    const [deleteCategoryId, setDeleteCategoryId] = useState();
    const deleteCategoryRef = useRef();
    const newCategoryRef = useRef();
    const [refreshCategories, setRefreshCategories] = useState(true);
    const setRefreshHome = props.setRefreshHome;
    const contextForCategories = useContext(CategoriesContext);

    const url = "/api/categories/read";
    useEffect(() => {
        if (refreshCategories) {
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Network response was not ok.");
                })
                .then(response => { 
                    setCategories(response);
                    contextForCategories.setCategories(response);
                })
                .catch(error => console.log(error.message));
            setRefreshCategories(false);
        }
    }, [refreshCategories]);

    function showModal(newModalRef) {
        const modal = new Modal(newModalRef.current);
        modal.show();
    }

    useEffect(() => {
        if (updateCategoryId !== undefined) {
            showModal(updateCategoryRef);
        }
    }, [updateCategoryId]);

    useEffect(() => {
        if (deleteCategoryId !== undefined) {
            showModal(deleteCategoryRef);
        }
    }, [deleteCategoryId]);


    const allCategories = categories.map((category, index) => (
        <li key={index} className="list-group-item d-flex">
            <h6 className="flex-grow-1">{category.name}</h6>
            <button type="button" className="btn btn-primary" onClick={() => setUpdateCategoryId(category.id) } data-bs-dismiss="modal"><i className="bi bi-pencil-square"></i></button>
            <button type="button" className="btn btn-danger"onClick={() => setDeleteCategoryId(category.id)} data-bs-dismiss="modal"><i className="bi bi-trash" /></button>
        </li>
    ))

    const noCategories = (
        <div>
            <h4>
                No categories yet!
            </h4>
        </div>
    )

    return (
        <>
        <NewCategory ref={newCategoryRef} parentModalRef={ref} setRefreshCategories={setRefreshCategories}/>
        <UpdateCategory ref={updateCategoryRef} parentModalRef={ref} id={updateCategoryId} refreshParent={() => { setRefreshCategories(true); setUpdateCategoryId(undefined); }} /> 
        <DeleteCategory ref={deleteCategoryRef} parentModalRef={ref} id={deleteCategoryId} refreshParent={() => { setRefreshCategories(true); setDeleteCategoryId(undefined); }}/> 

        <div className="modal fade" ref={ref} id="modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Categories</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setRefreshHome(true)}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="d-flex">
                                <div className="flex-grow-1"></div>
                                <button type="button" className="btn btn-secondary" onClick={() => showModal(newCategoryRef)} data-bs-dismiss="modal"><i className="bi bi-plus-lg"></i> Add</button>
                            </div>
                        </div>
                        <div className="row">
                            <ul className="list-group">
                                {categories.length > 0 ? allCategories : noCategories}
                            </ul>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setRefreshHome(true)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
    })
import React, { useState, useRef } from "react";
import NewTask from "./NewTask"
import { Modal } from "bootstrap";
import Categories from "./Categories";
import { CategoriesProvider } from "./CategoriesContext";
import Tasks from "./Tasks";

export default () => {
  const newTaskRef = useRef();
  const categoriesRef = useRef();
  const [refresh, setRefresh] = useState(true);
  const [categories, setCategories] = useState([]);
  const [newTasksReset, setNewTaskReset] = useState(false);

  function showModal(ref) {
    const modal = new Modal(ref.current);
    modal.show();
  }

  const context = {
    categories: categories,
    setCategories: setCategories,
  };

  return (
    <>
    <CategoriesProvider value={context}>
      <NewTask ref={newTaskRef} setRefreshHome={setRefresh} reset={newTasksReset} setReset={setNewTaskReset}/>
      <Categories ref={categoriesRef} setRefreshHome={setRefresh}/>

    <div className="container pt-2">
      <nav className="navbar navbar-expand-lg navbar-light mb-3" style={ {backgroundColor: '#e3f2fd'} }>
        <div className="container-fluid">
          <div className="d-flex ms-3">
            <a className="navbar-brand fs-3 me-auto" href="/">Tasks</a>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarToggler">
            <div className="d-flex justify-content-end ms-auto">
              <span className="navbar-text me-3">Username</span>
              <button className="btn btn-outline-secondary" type="button">Sign out</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="row mb-4 ms-3">
        <div className="col-auto">
          <button type="button" className="btn btn-info" onClick={() => { setNewTaskReset(true); showModal(newTaskRef); }}><i className="bi bi-plus-lg"></i> New Task</button>
        </div>
        <div className="col-auto">
          <button type="button" className="btn btn-info" onClick={() => showModal(categoriesRef)}>Categories</button>
        </div>
      </div>
      <Tasks setRefresh={setRefresh} refresh={refresh}/>
    </div>
    </CategoriesProvider>
    </>
  )
}
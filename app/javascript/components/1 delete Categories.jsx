import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Categories() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const allCategories = categories.map((category, index) => (
        <div key={index} className="col-md-6 col-lg-4">
        <div className="card mb-4">
            <div className="card-body">
            <h5 className="card-title">{category.name}</h5>
            <Link to={`/category/${category.id}`} className="btn custom-button">
              View Category
            </Link>
            </div>
        </div>
        </div>
    ));
    const noCategory = (
        <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
        <h4>
            No recipes yet. Why not <Link to="/new_category">create one</Link>
        </h4>
        </div>
    );

    useEffect(() => {
        const url = "/api/categories/read";
        fetch(url)
            .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error("Network response was not ok.");
                    })
            .then(response => setCategories(response))
            //.catch(() => navigate("/"));
    }, []);

    return (
        <>
            <section className="jumbotron jumbotron-fluid text-center">
            <div className="container py-5">
                <h1 className="display-4">Recipes for every occasion</h1>
                <p className="lead text-muted">
                We’ve pulled together our most popular recipes, our latest
                additions, and our editor’s picks, so there’s sure to be something
                tempting for you to try.
                </p>
            </div>
            </section>
            <div className="py-5">
            <main className="container">
                <div className="text-right mb-3">
                <Link to="/category" className="btn custom-button">
                    Create New Recipe
                </Link>
                </div>
                <div className="row">
                {categories.length > 0 ? allCategories : noCategory}
                </div>
                <Link to="/" className="btn btn-link">
                Home
                </Link>
            </main>
            </div>
        </>
    );
    
}

export default Categories;
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function Category() {
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const url = `/api/categories/show/${id}`;
        fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then(response => setCategory(response))
          .catch(() => navigate("/categories"));
    }, []);

    return (
        <div className="">
            <div className="hero position-relative d-flex align-items-center justify-content-center">
                <div className="overlay bg-dark position-absolute" />
                <h1 className="display-4 position-relative text-white">
                {category.name}
                </h1>
            </div>
            <div className="container py-5">
                <div className="col-sm-12 col-lg-2">
                    <button type="button" className="btn btn-danger">
                    Delete Category
                    </button>
                </div>
                <Link to="/categories" className="btn btn-link">
                Back to recipes
                </Link>
            </div>
        </div>
    );
    

}

export default Category;
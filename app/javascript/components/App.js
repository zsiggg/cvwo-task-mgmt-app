import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Home'
import 'bootstrap-icons/font/bootstrap-icons.css'
import "bootstrap/dist/css/bootstrap.min.css"

// import Categories from './Categories'
// import Category from './Category'
// import Tasks from './Tasks'
// import Task from './Task'
// import NewTask from './NewTask'
// import UpdateTask from './UpdateTask'

export default () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
      </Routes>
    </Router>
)}

{/* <Route path="/" element={<Home />}></Route>
<Route path="/categories" element={<Categories />}></Route>
<Route path="/category/:id" element={<Category />}></Route>
<Route path="/tasks" element={<Tasks />}></Route>
<Route path="/task/:id" element={<Task />}></Route>
<Route path="/tasks/create" element={<NewTask />}></Route>
<Route path="/tasks/update/:id" element={<UpdateTask />}></Route> */}

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";

const CreateTask = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);

  const [userDetails, setUserDetails] = useState({
    title: "",
    description: ""
  });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch(`http://localhost:8000/api/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userDetails),
    });
    console.log(localStorage.getItem("token"));

    const result = await res.json();
    if (!result.error) {
      toast.success(`Created [${userDetails.title}] task`);

      setUserDetails({ title: "", description: ""});
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <h2>Create your task</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titleInput" className="form-label mt-4">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="titleInput"
            name="title"
            value={userDetails.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descriptionInput" className="form-label mt-4">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="descriptionInput"
            name="description"
            value={userDetails.description}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <input
          type="submit"
          value="Add task"
          className="btn btn-info my-2"
        />
      </form>
    </>
  );
};

export default CreateTask;
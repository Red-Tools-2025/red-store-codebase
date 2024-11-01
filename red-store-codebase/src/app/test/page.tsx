/*  "use client";
import TestLoginForm from "@/components/testing/TestLogin";
import TestRegisterForm from "@/components/testing/TestRegister";
import { useState } from "react";

const ComponentTestingPage = () => {
  const [authCompView, setAuthCompView] = useState<boolean>(false);
  return (
    <div className="p-5">
      <p className="text-bold">Run all components for testing here</p>
      <button
        onClick={() => setAuthCompView(!authCompView)}
        className="p-2 border-solid border-2 bg-indigo-100"
      >
        setView {authCompView ? "login" : "register"}
      </button>
      <div className="mt-5 flex items-start gap-10">
        {authCompView === false ? <TestLoginForm /> : <TestRegisterForm />}
      </div>
    </div>
  );
};

export default ComponentTestingPage; */

/*   // form to test out add employee api
  "use client"

 import { useState } from "react";

 // Define the type for the form data
 interface AddEmployeeFormData {
   empName: string;
   empPhone: string;
   storeId: number | "";
   roleName: string;
 }

 // Define the available roles
 const roles = [
   { value: "SALES", label: "Sales" },
   { value: "MANAGER", label: "Manager" },
   { value: "INVENTORY_STAFF", label: "Inventory Staff" },
   { value: "STORE_MANAGER", label: "Store Manager" },
 ];

 const AddEmployeeForm = () => {
   const [formData, setFormData] = useState<AddEmployeeFormData>({
     empName: "",
     empPhone: "",
     storeId: "",
     roleName: "",
   });

   const handleChange = (
     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
     const { name, value } = e.target;
     setFormData((prevData) => ({
       ...prevData,
       [name]: name === "storeId" ? Number(value) : value, // Convert storeId to a number
     }));
   };

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();

     try {
       const response = await fetch("/api/employees", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(formData),
       });

       const data = await response.json();

       if (response.ok) {
         alert(`Success: ${data.message}`);
         // Reset form fields
         setFormData({
           empName: "",
           empPhone: "",
           storeId: "",
           roleName: "",
         });
       } else {
         alert(`Error: ${data.error}`);
       }
     } catch (error) {
       console.error("Error adding employee:", error);
       alert("An error occurred while adding the employee.");
     }
   };

   return (
     <form onSubmit={handleSubmit}>
       <h1>Add Employee</h1>
       <label htmlFor="empName">Employee Name:</label>
       <input
         type="text"
         id="empName"
         name="empName"
         value={formData.empName}
         onChange={handleChange}
         required
       />
       <br />

       <label htmlFor="empPhone">Employee Phone:</label>
       <input
         type="text"
         id="empPhone"
         name="empPhone"
         value={formData.empPhone}
         onChange={handleChange}
         required
       />
       <br />

       <label htmlFor="storeId">Store ID:</label>
       <input
         type="number"
         id="storeId"
         name="storeId"
         value={formData.storeId}
         onChange={handleChange}
         required
       />
       <br />

       <label htmlFor="roleName">Role Name:</label>
       <select
         id="roleName"
         name="roleName"
         value={formData.roleName}
         onChange={handleChange}
         required
       >
         <option value="">Select a role</option>
         {roles.map((role) => (
           <option key={role.value} value={role.value}>
             {role.label}
           </option>
         ))}
       </select>
       <br />

       <button type="submit">Add Employee</button>
     </form>
   );
 };

 export default AddEmployeeForm;
 */

// pages/add-store.tsx

/* "use client"

import { useState } from "react";

export default function AddStore() {
  const [storeName, setStoreName] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [storeManagerId, setStoreManagerId] = useState("");
  const [storeStatus, setStoreStatus] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      storeName,
      storeLocation,
      storeManagerId,
      storeStatus,
    };

    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success: ${data.message}`);
        setStoreName("");
        setStoreLocation("");
        setStoreManagerId("");
        setStoreStatus(true);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding store:", error);
      setMessage("An error occurred while adding the store.");
    }
  };

  return (
    <div>
      <h1>Add a New Store</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="storeName">Store Name:</label>
          <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="storeLocation">Store Location:</label>
          <input
            type="text"
            id="storeLocation"
            value={storeLocation}
            onChange={(e) => setStoreLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="storeManagerId">Store Manager ID:</label>
          <input
            type="text"
            id="storeManagerId"
            value={storeManagerId}
            onChange={(e) => setStoreManagerId(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="storeStatus">Store Status:</label>
          <select
            id="storeStatus"
            value={storeStatus ? "true" : "false"}
            onChange={(e) => setStoreStatus(e.target.value === "true")}
            required
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button type="submit">Add Store</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
 */

/* "use client"

import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message); // Success message
      } else {
        setMessage(data.error); // Error message
      }
    } catch (error) {
      setMessage("An error occurred while submitting the form.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Register a New User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="SALES">Sales</option>
            <option value="MANAGER">Manager</option>
            <option value="INVENTORY_STAFF">Inventory Staff</option>
            <option value="STORE_MANAGER">Store Manager</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
 */
/* 
"use client"


import { useState, FC } from "react";
import axios from "axios";

const AddStoreForm: FC = () => {
  const [storeName, setStoreName] = useState<string>("");
  const [storeLocation, setStoreLocation] = useState<string>("");
  const [storeManagerId, setStoreManagerId] = useState<string>("");
  const [storeStatus, setStoreStatus] = useState<boolean>(true); // default to true
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post("/api/management/stores", {
        storeName,
        storeLocation,
        storeManagerId,
        storeStatus,
      });

      setMessage(response.data.message);
      // Reset form fields if needed
      setStoreName("");
      setStoreLocation("");
      setStoreManagerId("");
      setStoreStatus(true);
    } catch (error: any) {
      // Check if error response exists and has the expected structure
      if (error.response && error.response.data) {
        setMessage(
          error.response.data.error ||
            "An error occurred while adding the store"
        );
      } else {
        setMessage("An error occurred while adding the store");
      }
    }
  };

  return (
    <div>
      <h2>Add New Store</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Store Name:
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Store Location:
            <input
              type="text"
              value={storeLocation}
              onChange={(e) => setStoreLocation(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Store Manager ID:
            <input
              type="text"
              value={storeManagerId}
              onChange={(e) => setStoreManagerId(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Store Status:
            <select
              value={storeStatus.toString()}
              onChange={(e) => setStoreStatus(e.target.value === "true")}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>
        </div>
        <button type="submit">Add Store</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddStoreForm;
 */

// components/AddEmployeeForm.tsx
"use client";

import { useState } from "react";
import { employeeType } from "../types/management/employee";

import useStoreServerActions from "../hooks/management/ServerHooks/useStoreServerActions";

export default function AddEmployeeForm() {
  const { handleSubmit } = useStoreServerActions();

  const [formData, setFormData] = useState<employeeType>({
    storeId: "",
    roleId: "",
    empName: "",
    empPhone: "",
    empStatus: true,
    storeManagerId: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "empStatus" ? value === "false" : value,
    }));
  };

  return (
    <div>
      <h1>Add New Employee</h1>
      <form
        onSubmit={(e) => handleSubmit(formData, setMessage, setFormData, e)}
      >
        <label>
          Store ID:
          <input
            type="number"
            name="storeId"
            value={formData.storeId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Role ID:
          <input
            type="number"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Employee Name:
          <input
            type="text"
            name="empName"
            value={formData.empName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Employee Phone:
          <input
            type="text"
            name="empPhone"
            value={formData.empPhone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Employee Status:
          <select
            name="empStatus"
            value={formData.empStatus ? "true" : "false"}
            onChange={handleChange}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
        <label>
          Store Manager ID:
          <input
            type="text"
            name="storeManagerId"
            value={formData.storeManagerId}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Add Employee</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

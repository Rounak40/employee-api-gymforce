import React, { useState } from "react";
import "./Dashboard.css";
import { useEffect } from "react";
interface User {
  id: number;
  user: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  salary: number;
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<number | null>(null);

  const logout = () => {
    fetch("/api/logout/", {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "You are logged out.") {
          localStorage.removeItem("token");
          if (typeof window !== "undefined") {
            window.setTimeout(function () {
              window.location = "/";
            }, 2000);
          }
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const updateUsers = () => {
    fetch("/api/employee/", {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          setUsers(
            data.result.map((item: any) => ({
              id: item.id,
              firstName: item.first_name,
              lastName: item.last_name,
              email: item.email,
              phone: item.phone.toString(), // Convert phone to string
              salary: item.salary,
            }))
          );
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    updateUsers();
  }, []);

  const handleEdit = (id: number) => {
    setEditingUser(id);
  };

  const handleSave = (e) => {
    let fname = document.getElementById("firstName").value;
    let lname = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let salary = document.getElementById("salary").value;

    fetch("/api/employee/" + editingUser + "/", {
      method: "PUT",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: fname,
        last_name: lname,
        phone: phone,
        salary: salary,
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          setUsers(
            data.result.map((item: any) => ({
              id: item.id,
              firstName: item.first_name,
              lastName: item.last_name,
              email: item.email,
              phone: item.phone.toString(), // Convert phone to string
              salary: item.salary,
            }))
          );
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    setEditingUser(null);
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = Array.from(e.target.elements)
      .filter((input) => input.name)
      .reduce(
        (obj, input) => Object.assign(obj, { [input.name]: input.value }),
        {}
      );

    fetch("/api/employee/", {
      method: "POST",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        salary: data.salary,
        email: data.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          setUsers(
            data.result.map((item: any) => ({
              id: item.id,
              firstName: item.first_name,
              lastName: item.last_name,
              email: item.email,
              phone: item.phone.toString(), // Convert phone to string
              salary: item.salary,
            }))
          );
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleDelete = (id: number) => {
    fetch("/api/employee/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="dashboard">
      <div className="top-right">
        <button onClick={logout}>Logout</button>
      </div>
      <div className="left-panel">
        <h2>Add User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" name="firstName" required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" name="lastName" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input type="text" name="phone" required />
          </div>
          <div className="form-group">
            <label htmlFor="salary">Salary:</label>
            <input type="number" name="salary" required />
          </div>
          <button type="submit">Add User</button>
        </form>
      </div>
      <div className="right-panel">
        <h2>User List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      id="firstName"
                      defaultValue={user.firstName}
                    />
                  ) : (
                    user.firstName
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      id="lastName"
                      defaultValue={user.lastName}
                    />
                  ) : (
                    user.lastName
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input type="email" id="email" defaultValue={user.email} />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input type="text" id="phone" defaultValue={user.phone} />
                  ) : (
                    user.phone
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="number"
                      id="salary"
                      defaultValue={user.salary}
                    />
                  ) : (
                    `${user.salary}`
                  )}
                </td>
                <td className="actions-column">
                  {editingUser === user.id ? (
                    <>
                      <button onClick={handleSave}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(user.id)}>Edit</button>
                  )}
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

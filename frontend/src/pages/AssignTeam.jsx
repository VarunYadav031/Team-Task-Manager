import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AssignTeam() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const p = await api.get("/projects");
      const u = await api.get("/users");

      setProjects(p.data);
      setUsers(u.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssign = async () => {
    try {
      await api.put(
        "/projects/assign-team",
        {
          projectId,
          users: selectedUsers,
        }
      );
      fetchData();

      alert("✅ Team Assigned Successfully");
    } catch (err) {
      console.log(err);
      alert("❌ Failed to assign team");
    }
  };

  return (
    <div>
      <h2>Assign Team</h2>

      {/* Project */}
      <select onChange={(e) => setProjectId(e.target.value)}>
        <option>Select Project</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Users */}
      <select
        multiple
        onChange={(e) =>
          setSelectedUsers(
            Array.from(e.target.selectedOptions, (o) => o.value)
          )
        }
      >
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} - {u.email}
          </option>
        ))}
      </select>

      <br />

      <button onClick={handleAssign}>Assign Team</button>

      <h3>Assigned Teams</h3>
      {projects.map((p) => (
        <div key={p._id}>
          <strong>{p.name}</strong>
          <ul>
            {(p.team || []).length === 0 ? (
              <li>No team assigned</li>
            ) : (
              p.team.map((u) => (
                <li key={u._id}>
                  {u.name} - {u.email}
                </li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

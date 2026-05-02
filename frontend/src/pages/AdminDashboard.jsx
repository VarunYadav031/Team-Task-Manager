import { useState, useEffect } from "react";
import api from "../api/axios";

const THEME_COLORS = {
  blue: "#6B5FE4",
  green: "#22C55E",
  red: "#E11D48",
  orange: "#F59E0B",
  pink: "#EC4899",
};

const Input = ({ placeholder, value, onChange, type = "text" }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    style={{
      width: "100%",
      padding: "10px 14px",
      border: "0.5px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      marginBottom: 12,
      outline: "none",
      background: "#fff",
      color: "#1a202c",
    }}
  />
);

const Select = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: "100%",
      padding: "10px 14px",
      border: "0.5px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      marginBottom: 12,
      outline: "none",
      background: "#fff",
      color: "#1a202c",
      cursor: "pointer",
    }}
  >
    {children}
  </select>
);

const Btn = ({ onClick, color = "#6B5FE4", children }) => (
  <button
    onClick={onClick}
    style={{
      background: color,
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "10px 20px",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

const PageHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 24 }}>
    <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1a202c", margin: 0 }}>{title}</h1>
    {subtitle && <p style={{ fontSize: 13, color: "#718096", marginTop: 4 }}>{subtitle}</p>}
  </div>
);

const Card = ({ children, style }) => (
  <div
    style={{
      background: "#fff",
      border: "0.5px solid #e2e8f0",
      borderRadius: 12,
      padding: "20px 24px",
      marginBottom: 16,
      ...style,
    }}
  >
    {children}
  </div>
);

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectTheme, setProjectTheme] = useState("blue");
  const [taskForm, setTaskForm] = useState({ title: "", assignedTo: "", project: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [teamForm, setTeamForm] = useState({ projectId: "", users: [] });
  const [selectedProject, setSelectedProject] = useState("");
  const [tracking, setTracking] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token) return;
    fetchProjects();
    fetchUsers();
    fetchTasks();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) { console.log(err); }
  };

  const createProject = async () => {
    try {
      await api.post(
        "/projects",
        { name: projectName, theme: projectTheme }
      );
      setProjectName("");
      fetchProjects();
      showToast("Project created successfully!");
    } catch (err) { showToast("Failed to create project."); }
  };

  const assignTask = async () => {
    try {
      await api.post("/tasks", taskForm);
      setTaskForm({ title: "", assignedTo: "", project: "" });
      fetchTasks();
      showToast("Task assigned successfully!");
    } catch (err) { showToast("Failed to assign task."); }
  };

  const createUser = async () => {
    try {
      const name = userForm.name.trim();
      const email = userForm.email.trim().toLowerCase();

      if (name.length < 2) return showToast("Enter a valid name.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("Enter a valid email.");
      if (userForm.password.length < 8) return showToast("Password must be at least 8 characters.");
      if (!["admin", "member"].includes(userForm.role)) return showToast("Select a valid role.");

      await api.post(
        "/users",
        { name, email, password: userForm.password, role: userForm.role }
      );
      setUserForm({ name: "", email: "", password: "", role: "member" });
      fetchUsers();
      showToast("User created. Share the email and temporary password with them.");
    } catch (err) { showToast(err.response?.data?.msg || "Failed to create user."); }
  };

  const assignTeam = async () => {
    try {
      await api.put("/projects/assign-team", teamForm);
      setTeamForm({ projectId: "", users: [] });
      fetchProjects();
      showToast("Team assigned successfully!");
    } catch (err) { showToast("Failed to assign team."); }
  };

  const getTracking = async () => {
    try {
      const res = await api.get(`/projects/tracking/${selectedProject}`);
      setTracking(res.data);
    } catch (err) { showToast("Failed to load tracking data."); }
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "⊞" },
    { key: "projects", label: "Projects", icon: "📁" },
    { key: "assign", label: "Assign Task", icon: "✅" },
    { key: "tasks", label: "Tasks", icon: "T" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "createUser", label: "Create User", icon: "➕" },
    { key: "team", label: "Assign Team", icon: "🤝" },
    { key: "tracking", label: "Project Tracking", icon: "📊" },
    { key: "create", label: "Create Project", icon: "🗂️" },
  ];

  const quickActions = [
    { label: "Create Project", sub: "Start a new project", color: "#EEF0FC", icon: "🗂️", accent: "#6B5FE4", target: "create" },
    { label: "Create Task", sub: "Assign to team", color: "#ECFDF5", icon: "✅", accent: "#22C55E", target: "assign" },
    { label: "Invite Team", sub: "Add members", color: "#FFF7ED", icon: "👥", accent: "#F59E0B", target: "team" },
    { label: "View Tracking", sub: "Check progress", color: "#FDF2F8", icon: "📊", accent: "#EC4899", target: "tracking" },
  ];

  const query = searchQuery.trim().toLowerCase();
  const filteredProjects = projects.filter((p) => {
    const teamText = (p.team || []).map((u) => `${u.name} ${u.email}`).join(" ");
    return `${p.name} ${p.theme} ${teamText}`.toLowerCase().includes(query);
  });
  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(query)
  );
  const visibleProjects = query ? filteredProjects : projects;
  const visibleUsers = query ? filteredUsers : users;
  const visibleTasks = query
    ? tasks.filter((task) =>
        `${task.title} ${task.description || ""} ${task.assignedTo?.name || ""} ${task.project?.name || ""}`
          .toLowerCase()
          .includes(query)
      )
    : tasks;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const editProject = async (project) => {
    const name = window.prompt("Project name", project.name);
    if (name === null) return;
    const theme = window.prompt("Theme color", project.theme || "blue");
    if (theme === null) return;

    try {
      await api.put(
        `/projects/${project._id}`,
        { name, theme }
      );
      fetchProjects();
      showToast("Project updated.");
    } catch (err) { showToast(err.response?.data?.msg || "Failed to update project."); }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete project "${project.name}" and its tasks?`)) return;

    try {
      await api.delete(`/projects/${project._id}`);
      fetchProjects();
      fetchTasks();
      showToast("Project deleted.");
    } catch (err) { showToast("Failed to delete project."); }
  };

  const editUser = async (user) => {
    const name = window.prompt("User name", user.name);
    if (name === null) return;
    const email = window.prompt("User email", user.email);
    if (email === null) return;
    const role = window.prompt("Role: admin or member", user.role || "member");
    if (role === null) return;

    try {
      await api.put(
        `/users/${user._id}`,
        { name, email, role }
      );
      fetchUsers();
      fetchProjects();
      fetchTasks();
      showToast("User updated.");
    } catch (err) { showToast(err.response?.data?.msg || "Failed to update user."); }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete user "${user.name}"?`)) return;

    try {
      await api.delete(`/users/${user._id}`);
      fetchUsers();
      showToast("User deleted.");
    } catch (err) { showToast(err.response?.data?.msg || "Failed to delete user."); }
  };

  const editTask = async (task) => {
    const title = window.prompt("Task title", task.title);
    if (title === null) return;
    const description = window.prompt("Task description", task.description || "");
    if (description === null) return;

    try {
      await api.put(
        `/tasks/${task._id}`,
        { title, description }
      );
      fetchTasks();
      showToast("Task updated.");
    } catch (err) { showToast("Failed to update task."); }
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;

    try {
      await api.delete(`/tasks/${task._id}`);
      fetchTasks();
      showToast("Task deleted.");
    } catch (err) { showToast("Failed to delete task."); }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f7f8fc" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, background: "#1a202c", color: "#fff",
          padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 9999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          {toast}
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{
        width: 220, background: "#fff", borderRight: "0.5px solid #e2e8f0",
        display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0,
      }}>
        <div style={{ padding: "0 20px 20px", fontSize: 17, fontWeight: 700, color: "#1a202c", borderBottom: "0.5px solid #e2e8f0", marginBottom: 12 }}>
          Taskboard
        </div>

        {/* Add New Button */}
        <button
          onClick={() => setActive("create")}
          style={{
            margin: "8px 16px 16px", background: "#6B5FE4", color: "#fff",
            border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13,
            fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> Add New
        </button>

        {/* Nav */}
        {navItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setActive(item.key)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 20px", cursor: "pointer", fontSize: 13.5,
              color: active === item.key ? "#6B5FE4" : "#718096",
              background: active === item.key ? "#EEF0FC" : "transparent",
              fontWeight: active === item.key ? 500 : 400,
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}

        {/* Projects list */}
        <div style={{ fontSize: 11, color: "#a0aec0", padding: "14px 20px 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Projects
        </div>
        {visibleProjects.slice(0, 5).map((p) => (
          <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 20px", cursor: "pointer", color: "#718096", fontSize: 13 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: THEME_COLORS[p.theme] || "#6B5FE4", flexShrink: 0 }} />
            {p.name}
          </div>
        ))}

        {/* User profile */}
        <div style={{ marginTop: "auto", padding: "16px 20px 0", borderTop: "0.5px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "#6B5FE4",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600,
            }}>{currentUser?.name?.charAt(0).toUpperCase() || "A"}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a202c" }}>{currentUser?.name || "Admin"}</div>
              <div style={{ fontSize: 11, color: "#a0aec0" }}>{currentUser?.email || "Administrator"}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: "100%", marginTop: 12, background: "#fff", color: "#E11D48",
              border: "0.5px solid #fecdd3", borderRadius: 8, padding: "8px 10px",
              fontSize: 12, fontWeight: 600,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* TOPBAR */}
        <div style={{
          background: "#fff", borderBottom: "0.5px solid #e2e8f0",
          padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1a202c" }}>
            {navItems.find(n => n.key === active)?.label || "Dashboard"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "#f7f8fc", border: "0.5px solid #e2e8f0", borderRadius: 8,
                padding: "7px 14px", fontSize: 13, color: "#718096", width: 180, outline: "none",
              }}
            />
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "#6B5FE4",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600,
            }}>{currentUser?.name?.charAt(0).toUpperCase() || "A"}</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

          {/* DASHBOARD */}
          {active === "dashboard" && (
            <div>
              {/* Quick Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
                {quickActions.map((qa) => (
                  <div
                    key={qa.target}
                    onClick={() => setActive(qa.target)}
                    style={{
                      background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12,
                      padding: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: qa.color,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                    }}>{qa.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#1a202c" }}>{qa.label}</div>
                      <div style={{ fontSize: 11.5, color: "#a0aec0", marginTop: 1 }}>{qa.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
                {[
                  { label: "Total Projects", value: projects.length, color: "#EEF0FC", text: "#6B5FE4" },
                  { label: "Total Users", value: users.length, color: "#ECFDF5", text: "#16A34A" },
                  { label: "Active Tasks", value: tasks.filter((t) => t.progress < 100).length, color: "#FFF7ED", text: "#D97706" },
                ].map((s) => (
                  <div key={s.label} style={{ background: s.color, borderRadius: 12, padding: "18px 20px" }}>
                    <div style={{ fontSize: 12, color: s.text, fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 600, color: s.text }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Projects + Users side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #e2e8f0", fontSize: 14, fontWeight: 500, color: "#1a202c", display: "flex", justifyContent: "space-between" }}>
                    Projects <span style={{ fontSize: 12, color: "#a0aec0", fontWeight: 400 }}>{projects.length} total</span>
                  </div>
                  {visibleProjects.length === 0
                    ? <div style={{ padding: "20px 18px", color: "#a0aec0", fontSize: 13 }}>No projects yet</div>
                    : visibleProjects.map((p) => (
                      <div key={p._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", borderBottom: "0.5px solid #f0f0f0", fontSize: 13, color: "#2d3748" }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: THEME_COLORS[p.theme] || "#6B5FE4" }} />
                        {p.name}
                      </div>
                    ))
                  }
                </div>

                <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #e2e8f0", fontSize: 14, fontWeight: 500, color: "#1a202c", display: "flex", justifyContent: "space-between" }}>
                    Users <span style={{ fontSize: 12, color: "#a0aec0", fontWeight: 400 }}>{users.length} total</span>
                  </div>
                  {visibleUsers.length === 0
                    ? <div style={{ padding: "20px 18px", color: "#a0aec0", fontSize: 13 }}>No users yet</div>
                    : visibleUsers.map((u) => (
                      <div key={u._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", borderBottom: "0.5px solid #f0f0f0" }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", background: "#EEF0FC",
                          color: "#6B5FE4", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 600, flexShrink: 0,
                        }}>{u.name?.charAt(0).toUpperCase()}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#1a202c" }}>{u.name}</div>
                          <div style={{ fontSize: 11.5, color: "#a0aec0" }}>{u.email}</div>
                          <div style={{ fontSize: 10.5, color: "#cbd5e0" }}>ID: {u._id}</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS LIST */}
          {active === "projects" && (
            <div>
              <PageHeader title="All Projects" subtitle="Manage and view your projects" />
              {visibleProjects.length === 0
                ? <div style={{ color: "#a0aec0", fontSize: 14 }}>No projects found. Create one first.</div>
                : visibleProjects.map((p) => (
                  <Card key={p._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: THEME_COLORS[p.theme] || "#6B5FE4", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#1a202c" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#a0aec0", marginTop: 2 }}>
                        {(p.team || []).length
                          ? (p.team || []).map((u) => u.name).join(", ")
                          : "No team assigned"}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 20,
                      background: "#EEF0FC", color: "#6B5FE4", fontWeight: 500,
                    }}>{p.theme || "default"}</span>
                    <Btn onClick={() => editProject(p)} color="#6B5FE4">Edit</Btn>
                    <Btn onClick={() => deleteProject(p)} color="#E11D48">Delete</Btn>
                  </Card>
                ))
              }
            </div>
          )}

          {/* CREATE PROJECT */}
          {active === "create" && (
            <div style={{ maxWidth: 480 }}>
              <PageHeader title="Create Project" subtitle="Set up a new project for your team" />
              <Card>
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Project Name</div>
                <Input
                  placeholder="e.g. Landing Page Redesign"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Theme Color</div>
                <Select value={projectTheme} onChange={(e) => setProjectTheme(e.target.value)}>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="orange">Orange</option>
                  <option value="pink">Pink</option>
                </Select>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  {Object.entries(THEME_COLORS).map(([k, v]) => (
                    <div key={k} style={{
                      width: 24, height: 24, borderRadius: 6, background: v, cursor: "pointer",
                      border: projectTheme === k ? "3px solid #1a202c" : "3px solid transparent",
                    }} onClick={() => setProjectTheme(k)} />
                  ))}
                </div>
                <Btn onClick={createProject} color="#6B5FE4">Create Project</Btn>
              </Card>
            </div>
          )}

          {/* ASSIGN TASK */}
          {active === "assign" && (
            <div style={{ maxWidth: 480 }}>
              <PageHeader title="Assign Task" subtitle="Create and assign a task to a team member" />
              <Card>
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Task Title</div>
                <Input
                  placeholder="e.g. Design the hero section"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Assign To</div>
                <Select value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                  <option value="">Select User</option>
                  {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                </Select>
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Project</div>
                <Select value={taskForm.project} onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}>
                  <option value="">Select Project</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </Select>
                <Btn onClick={assignTask} color="#22C55E">Assign Task</Btn>
              </Card>
            </div>
          )}

          {/* TASKS */}
          {active === "tasks" && (
            <div>
              <PageHeader title="Tasks" subtitle="Edit or delete assigned tasks" />
              {visibleTasks.length === 0 ? (
                <div style={{ color: "#a0aec0", fontSize: 14 }}>No tasks found.</div>
              ) : (
                visibleTasks.map((task) => (
                  <Card key={task._id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1a202c" }}>{task.title}</div>
                      <div style={{ fontSize: 12, color: "#718096", marginTop: 3 }}>
                        {task.description || "No description"}
                      </div>
                      <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 4 }}>
                        {task.assignedTo?.name || "Unassigned"} - {task.project?.name || "No project"} - {task.progress || 0}%
                      </div>
                    </div>
                    <Btn onClick={() => editTask(task)} color="#6B5FE4">Edit</Btn>
                    <Btn onClick={() => deleteTask(task)} color="#E11D48">Delete</Btn>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* USERS */}
          {active === "users" && (
            <div>
              <PageHeader title="Users" subtitle="All registered members" />
              {visibleUsers.length === 0
                ? <div style={{ color: "#a0aec0", fontSize: 14 }}>No users found.</div>
                : visibleUsers.map((u) => (
                  <Card key={u._id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", background: "#EEF0FC",
                      color: "#6B5FE4", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 600, flexShrink: 0,
                    }}>{u.name?.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#1a202c" }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: "#a0aec0" }}>{u.email}</div>
                      <div style={{ fontSize: 11, color: "#cbd5e0", marginTop: 2 }}>ID: {u._id}</div>
                    </div>
                    <span style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 20,
                      background: "#ECFDF5", color: "#16A34A", fontWeight: 500,
                    }}>{u.role || "member"}</span>
                    <Btn onClick={() => editUser(u)} color="#6B5FE4">Edit</Btn>
                    <Btn onClick={() => deleteUser(u)} color="#E11D48">Delete</Btn>
                  </Card>
                ))
              }
            </div>
          )}

          {/* CREATE USER */}
          {active === "createUser" && (
            <div style={{ maxWidth: 480 }}>
              <PageHeader title="Create User" subtitle="Register a new team member" />
              <Card>
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Full Name</div>
                <Input placeholder="e.g. John Doe" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Email</div>
                <Input placeholder="e.g. john@company.com" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Password</div>
                <Input type="password" placeholder="Minimum 8 characters" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Role</div>
                <Select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </Select>
                <Btn onClick={createUser} color="#6B5FE4">Create User</Btn>
              </Card>
            </div>
          )}

          {/* ASSIGN TEAM */}
          {active === "team" && (
            <div style={{ maxWidth: 520 }}>
              <PageHeader title="Assign Team" subtitle="Add members to a project" />
              <Card>
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Select Project</div>
                <Select value={teamForm.projectId} onChange={(e) => setTeamForm({ ...teamForm, projectId: e.target.value })}>
                  <option value="">Select Project</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </Select>
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 8 }}>Select Users <span style={{ color: "#a0aec0" }}>(hold Ctrl/Cmd to multi-select)</span></div>
                <select
                  multiple
                  onChange={(e) => setTeamForm({ ...teamForm, users: Array.from(e.target.selectedOptions, (o) => o.value) })}
                  style={{
                    width: "100%", height: 160, padding: 8, border: "0.5px solid #e2e8f0",
                    borderRadius: 8, fontSize: 14, marginBottom: 16, outline: "none", background: "#fff",
                  }}
                >
                  {users.map((u) => <option key={u._id} value={u._id}>{u.name} — {u.email}</option>)}
                </select>
                <Btn onClick={assignTeam} color="#F59E0B">Assign Team</Btn>
              </Card>

              <PageHeader title="Assigned Teams" subtitle="Members currently attached to each project" />
              {visibleProjects.map((p) => (
                <Card key={p._id} style={{ padding: "14px 18px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a202c", marginBottom: 8 }}>{p.name}</div>
                  {(p.team || []).length === 0 ? (
                    <div style={{ fontSize: 12, color: "#a0aec0" }}>No team assigned</div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {p.team.map((u) => (
                        <span key={u._id} style={{
                          fontSize: 12, padding: "5px 10px", borderRadius: 8,
                          background: "#EEF0FC", color: "#6B5FE4", fontWeight: 500,
                        }}>{u.name} - {u.email}</span>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* TRACKING */}
          {active === "tracking" && (
            <div>
              <PageHeader title="Project Tracking" subtitle="Monitor project and user progress" />
              <Card style={{ maxWidth: 480 }}>
                <div style={{ fontSize: 13, color: "#718096", marginBottom: 6 }}>Select Project</div>
                <Select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                  <option value="">Select Project</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </Select>
                <Btn onClick={getTracking} color="#6B5FE4">Track Progress</Btn>
              </Card>

              {tracking && (
                <div>
                  <Card>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#1a202c", marginBottom: 10 }}>
                      Overall Progress — <span style={{ color: "#6B5FE4" }}>{tracking.progress}%</span>
                    </div>
                    <div style={{ background: "#e2e8f0", borderRadius: 99, height: 10, overflow: "hidden" }}>
                      <div style={{ width: `${tracking.progress}%`, background: "#22C55E", height: "100%", borderRadius: 99, transition: "width 0.5s" }} />
                    </div>
                  </Card>

                  <div style={{ fontSize: 14, fontWeight: 500, color: "#1a202c", marginBottom: 12 }}>User Performance</div>
                  {tracking.users?.map((u, i) => (
                    <Card key={i} style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: "50%", background: "#EEF0FC",
                            color: "#6B5FE4", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 600,
                          }}>{u.name?.charAt(0).toUpperCase()}</div>
                          <span style={{ fontSize: 14, fontWeight: 500, color: "#1a202c" }}>{u.name}</span>
                        </div>
                        <span style={{ fontSize: 13, color: "#6B5FE4", fontWeight: 600 }}>{u.progress}%</span>
                      </div>
                      <div style={{ background: "#e2e8f0", borderRadius: 99, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${u.progress}%`, background: "#6B5FE4", height: "100%", borderRadius: 99, transition: "width 0.5s" }} />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api";

const statusConfig = {
  todo: { label: "To Do", bg: "#FFF7ED", color: "#D97706" },
  "in-progress": { label: "In Progress", bg: "#EEF0FC", color: "#6B5FE4" },
  done: { label: "Done", bg: "#ECFDF5", color: "#16A34A" },
};

const progressColor = (value = 0) => {
  if (value === 100) return "#22C55E";
  if (value >= 75) return "#6B5FE4";
  if (value >= 50) return "#F59E0B";
  return "#E11D48";
};

const Avatar = ({ name, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: "#EEF0FC", color: "#6B5FE4",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
  }}>
    {name?.charAt(0).toUpperCase() || "U"}
  </div>
);

const Badge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.todo;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
      background: cfg.bg, color: cfg.color,
    }}>{cfg.label}</span>
  );
};

const Card = ({ children, style }) => (
  <div style={{
    background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 12,
    padding: "18px 22px", marginBottom: 14, ...style,
  }}>
    {children}
  </div>
);

const ProgressBar = ({ value = 0 }) => (
  <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8, overflow: "hidden" }}>
    <div style={{
      width: `${value}%`, height: "100%", borderRadius: 99,
      background: progressColor(value), transition: "width 0.4s ease",
    }} />
  </div>
);

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeSection, setActiveSection] = useState("tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [taskRes, projectRes] = await Promise.all([
        axios.get(`${API}/tasks`, { headers }),
        axios.get(`${API}/projects`, { headers }),
      ]);
      setTasks(taskRes.data);
      setProjects(projectRes.data);
    } catch (err) {
      console.log(err);
      showToast("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (id, progress) => {
    try {
      await axios.put(
        `${API}/tasks/${id}`,
        { progress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
      showToast(progress === 100 ? "Task marked as done." : `Progress updated to ${progress}%`);
    } catch (err) {
      console.log(err);
      showToast("Failed to update progress.");
    }
  };

  const updateDescription = async (task) => {
    const description = window.prompt("Task description", task.description || "");
    if (description === null) return;

    try {
      await axios.put(
        `${API}/tasks/${task._id}`,
        { description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
      showToast("Description updated.");
    } catch (err) {
      console.log(err);
      showToast("Failed to update description.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const changePassword = async () => {
    try {
      if (!passwordForm.currentPassword) return showToast("Enter your current password.");
      if (passwordForm.newPassword.length < 8) {
        return showToast("New password must be at least 8 characters.");
      }

      await axios.put(
        `${API}/auth/change-password`,
        passwordForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordForm({ currentPassword: "", newPassword: "" });
      showToast("Password changed successfully.");
    } catch (err) {
      console.log(err);
      showToast(err.response?.data?.msg || "Failed to change password.");
    }
  };

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "done" ? task.progress === 100 : task.progress < 100);
      const text = `${task.title} ${task.description || ""} ${task.project?.name || ""}`.toLowerCase();
      return matchesFilter && text.includes(query);
    });
  }, [tasks, filter, searchQuery]);

  const done = tasks.filter((task) => task.progress === 100).length;
  const avgProgress = tasks.length
    ? Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / tasks.length)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fc", fontFamily: "'DM Sans', sans-serif" }}>
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, background: "#1a202c", color: "#fff",
          padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 9999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>{toast}</div>
      )}

      <div style={{
        background: "#fff", borderBottom: "0.5px solid #e2e8f0",
        padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1a202c" }}>Taskboard</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            placeholder="Search work..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "#f7f8fc", border: "0.5px solid #e2e8f0", borderRadius: 8,
              padding: "7px 14px", fontSize: 13, color: "#1a202c", width: 190, outline: "none",
            }}
          />
          <Avatar name={user?.name} size={34} />
          <button onClick={logout} style={{
            background: "#fff", color: "#E11D48", border: "0.5px solid #fecdd3",
            borderRadius: 8, padding: "8px 12px", fontSize: 12, fontWeight: 700,
          }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px" }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar name={user?.name} size={54} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1a202c" }}>{user?.name || "Member"}</div>
            <div style={{ fontSize: 13, color: "#718096", marginTop: 3 }}>{user?.email || "No email found"}</div>
            <div style={{ fontSize: 12, color: "#a0aec0", marginTop: 3 }}>ID: {user?._id || "Not available"}</div>
          </div>
          <Badge status={tasks.length === done && tasks.length > 0 ? "done" : "in-progress"} />
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
          {[
            { label: "Assigned Tasks", value: tasks.length, bg: "#EEF0FC", color: "#6B5FE4" },
            { label: "Assigned Projects", value: projects.length, bg: "#FDF2F8", color: "#EC4899" },
            { label: "Completed", value: done, bg: "#ECFDF5", color: "#16A34A" },
            { label: "Avg. Progress", value: `${avgProgress}%`, bg: "#FFF7ED", color: "#D97706" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 12, color: stat.color, fontWeight: 600, marginBottom: 6 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { key: "tasks", label: "Assigned Tasks" },
            { key: "projects", label: "Assigned Projects" },
            { key: "profile", label: "Profile" },
          ].map((item) => (
            <button key={item.key} onClick={() => setActiveSection(item.key)} style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: "0.5px solid #e2e8f0",
              background: activeSection === item.key ? "#6B5FE4" : "#fff",
              color: activeSection === item.key ? "#fff" : "#718096",
            }}>{item.label}</button>
          ))}
        </div>

        {activeSection === "tasks" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                { key: "all", label: "All" },
                { key: "active", label: "In Progress" },
                { key: "done", label: "Done" },
              ].map((item) => (
                <button key={item.key} onClick={() => setFilter(item.key)} style={{
                  padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: "0.5px solid #e2e8f0",
                  background: filter === item.key ? "#1a202c" : "#fff",
                  color: filter === item.key ? "#fff" : "#718096",
                }}>{item.label}</button>
              ))}
            </div>

            {loading ? (
              <Card style={{ textAlign: "center", color: "#a0aec0", padding: 50 }}>Loading tasks...</Card>
            ) : filteredTasks.length === 0 ? (
              <Card style={{ textAlign: "center", color: "#a0aec0", padding: 50 }}>No assigned tasks found.</Card>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task._id} style={{ borderLeft: `4px solid ${progressColor(task.progress || 0)}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 14, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#1a202c" }}>{task.title}</div>
                  {task.description && <div style={{ fontSize: 13, color: "#718096", marginTop: 3 }}>{task.description}</div>}
                  {!task.description && <div style={{ fontSize: 13, color: "#a0aec0", marginTop: 3 }}>No description yet</div>}
                    </div>
                    <Badge status={task.status} />
                  </div>
                  {task.project?.name && (
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
                      Project: {task.project.name}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#718096" }}>Progress</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: progressColor(task.progress || 0) }}>{task.progress || 0}%</span>
                  </div>
                  <ProgressBar value={task.progress || 0} />
                  <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                    {[25, 50, 75, 100].map((value) => (
                      <button key={value} onClick={() => updateProgress(task._id, value)} style={{
                        padding: "7px 13px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        border: task.progress === value ? "none" : "0.5px solid #e2e8f0",
                        background: task.progress === value ? progressColor(value) : "#fff",
                        color: task.progress === value ? "#fff" : "#718096",
                      }}>{value === 100 ? "Done" : `${value}%`}</button>
                    ))}
                    <button onClick={() => updateDescription(task)} style={{
                      padding: "7px 13px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      border: "0.5px solid #e2e8f0", background: "#fff", color: "#6B5FE4",
                    }}>Edit Description</button>
                  </div>
                </Card>
              ))
            )}
          </>
        )}

        {activeSection === "projects" && (
          projects.length === 0 ? (
            <Card style={{ textAlign: "center", color: "#a0aec0", padding: 50 }}>No assigned projects found.</Card>
          ) : (
            projects.map((project) => (
              <Card key={project._id}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a202c", marginBottom: 8 }}>{project.name}</div>
                <div style={{ fontSize: 12, color: "#718096", marginBottom: 12 }}>Theme: {project.theme || "default"}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(project.team || []).map((member) => (
                    <span key={member._id} style={{
                      fontSize: 12, padding: "5px 10px", borderRadius: 8,
                      background: member._id === user?._id ? "#ECFDF5" : "#EEF0FC",
                      color: member._id === user?._id ? "#16A34A" : "#6B5FE4", fontWeight: 600,
                    }}>{member.name}</span>
                  ))}
                </div>
              </Card>
            ))
          )
        )}

        {activeSection === "profile" && (
          <Card>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a202c", marginBottom: 16 }}>Profile</div>
            {[
              ["Name", user?.name || "Not available"],
              ["Email", user?.email || "Not available"],
              ["User ID", user?._id || "Not available"],
              ["Role", user?.role || "member"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", padding: "10px 0", borderBottom: "0.5px solid #edf2f7" }}>
                <div style={{ width: 110, fontSize: 13, color: "#718096", fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#1a202c" }}>{value}</div>
              </div>
            ))}
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a202c", margin: "20px 0 12px" }}>Change Password</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input
                type="password"
                placeholder="Current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                style={{
                  width: "100%", padding: "10px 14px", border: "0.5px solid #e2e8f0",
                  borderRadius: 8, fontSize: 14, outline: "none",
                }}
              />
              <input
                type="password"
                placeholder="New password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                style={{
                  width: "100%", padding: "10px 14px", border: "0.5px solid #e2e8f0",
                  borderRadius: 8, fontSize: 14, outline: "none",
                }}
              />
            </div>
            <button onClick={changePassword} style={{
              marginTop: 12, background: "#6B5FE4", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 700,
            }}>Change Password</button>
            <button onClick={logout} style={{
              marginTop: 18, marginLeft: 10, background: "#E11D48", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 700,
            }}>Logout</button>
          </Card>
        )}
      </div>
    </div>
  );
}

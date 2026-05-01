import React, { useState } from "react";
import {
  Home,
  Inbox,
  Users,
  BarChart3,
  Settings,
  Plus,
  CheckCircle,
  ChevronDown,
  Search,
  Bell,
  Calendar,
  Flag,
  Folder,
} from "lucide-react";

const tasks = [
  { name: "Solutions Pages", project: "Main Project", date: "March 17 - 09:00AM", flag: "#6B5FE4" },
  { name: "Company Pages", project: "Landing Page", date: "March 17 - 09:00AM", flag: "#e2e8f0" },
  { name: "Help Center Pages", project: "Landing Page", date: null, flag: "#e2e8f0" },
  { name: "Icon Custom", project: "Main Project", date: null, flag: "#e2e8f0" },
  { name: "Solutions Pages", project: "Yellow Branding", date: "March 17 - 09:00AM", flag: "#6B5FE4" },
];

const review = [
  { name: "About Us Illustration", project: "Main Project", flag: "#6B5FE4" },
  { name: "Hero Illustration", project: "Landing Page", flag: "#E11D48" },
  { name: "Moodboarding", project: "Landing Page", flag: "#E11D48" },
  { name: "Research", project: "Yellow Branding", flag: "#e2e8f0" },
];

const activity = [
  { text: "Main Project", sub: "completed", time: "Today, 2:24pm" },
  { text: "Hero Illustration", sub: "moved to review", time: "Today, 11:02am" },
  { text: "Solutions Pages", sub: "assigned to team", time: "Yesterday, 4:15pm" },
];

const projects = [
  { name: "Main Project", color: "#6B5FE4" },
  { name: "Landing Page Project", color: "#22C55E" },
  { name: "Yellow Branding", color: "#F59E0B" },
];

const navItems = [
  { label: "Dashboard", Icon: Home },
  { label: "Inbox", Icon: Inbox },
  { label: "Teams", Icon: Users },
  { label: "Analytics", Icon: BarChart3 },
  { label: "Settings", Icon: Settings },
];

const quickActions = [
  { label: "Create Project", sub: "Organize tasks to your project", bg: "#EEF0FC", accent: "#6B5FE4", Icon: Folder },
  { label: "Create Task", sub: "Organize tasks to your project", bg: "#ECFDF5", accent: "#22C55E", Icon: CheckCircle },
  { label: "Invite Team", sub: "Organize tasks to your project", bg: "#FFF7ED", accent: "#F59E0B", Icon: Users },
  { label: "Send Report", sub: "Organize tasks to your project", bg: "#FDF2F8", accent: "#EC4899", Icon: BarChart3 },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f7f8fc" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <div style={{
        width: 220, background: "#fff", borderRight: "0.5px solid #e2e8f0",
        display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 20px", fontSize: 17, fontWeight: 700, color: "#1a202c", borderBottom: "0.5px solid #e2e8f0", marginBottom: 12 }}>
          Taskboard
        </div>

        {/* Add New */}
        <button style={{
          margin: "8px 16px 16px", background: "#6B5FE4", color: "#fff",
          border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 13,
          fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>
          <Plus size={14} /> Add New
        </button>

        {/* Nav */}
        {navItems.map(({ label, Icon }) => (
          <div
            key={label}
            onClick={() => setActiveNav(label)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 20px", cursor: "pointer", fontSize: 13.5,
              color: activeNav === label ? "#6B5FE4" : "#718096",
              background: activeNav === label ? "#EEF0FC" : "transparent",
              fontWeight: activeNav === label ? 500 : 400,
              transition: "all 0.15s",
            }}
          >
            <Icon size={15} style={{ opacity: activeNav === label ? 1 : 0.6 }} />
            {label}
          </div>
        ))}

        {/* Projects */}
        <div style={{ fontSize: 11, color: "#a0aec0", padding: "14px 20px 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Projects
        </div>
        {projects.map((p) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 20px", cursor: "pointer", color: "#718096", fontSize: 13 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
            {p.name}
            <ChevronDown size={11} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </div>
        ))}

        {/* Add Projects */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", cursor: "pointer", color: "#a0aec0", fontSize: 13 }}>
          <Plus size={13} /> Add Projects
        </div>

        {/* User profile */}
        <div style={{ marginTop: "auto", padding: "16px 20px 0", borderTop: "0.5px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "#6B5FE4",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600,
            }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a202c" }}>Ahmad Faizien</div>
              <div style={{ fontSize: 11, color: "#a0aec0" }}>Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* TOPBAR */}
        <div style={{
          background: "#fff", borderBottom: "0.5px solid #e2e8f0",
          padding: "13px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#1a202c" }}>Dashboard</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f7f8fc", border: "0.5px solid #e2e8f0", borderRadius: 8, padding: "6px 12px" }}>
              <Search size={13} style={{ color: "#a0aec0" }} />
              <input placeholder="Search..." style={{ border: "none", background: "transparent", fontSize: 13, color: "#718096", outline: "none", width: 150 }} />
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "#f7f8fc",
              border: "0.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <Bell size={15} style={{ color: "#718096" }} />
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: "#6B5FE4",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>A</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

          {/* QUICK ACTIONS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
            {quickActions.map((qa) => (
              <div key={qa.label} style={{
                background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 14,
                padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                transition: "box-shadow 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: qa.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <qa.Icon size={18} style={{ color: qa.accent }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1a202c" }}>{qa.label}</div>
                  <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 2 }}>{qa.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* TASK PANELS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

            {/* TO DO */}
            <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a202c" }}>To do this week</span>
                <span style={{ fontSize: 12, color: "#a0aec0" }}>{tasks.length} tasks</span>
              </div>
              {/* Column Headers */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr", padding: "8px 20px", background: "#f7f8fc" }}>
                {["Name", "Projects", "Due Date"].map(h => (
                  <div key={h} style={{ fontSize: 11, color: "#a0aec0", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
                ))}
              </div>
              {tasks.map((task, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr",
                  padding: "11px 20px", borderBottom: "0.5px solid #f7f8fc",
                  alignItems: "center", cursor: "pointer",
                  transition: "background 0.12s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f7f8fc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#1a202c" }}>
                    <Flag size={10} fill={task.flag} color={task.flag} />
                    {task.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#718096", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {task.project}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: task.date ? "#718096" : "#6B5FE4" }}>
                    {task.date
                      ? <><Calendar size={11} />{task.date}</>
                      : "+ Add date"
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* TO REVIEW */}
            <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a202c" }}>To review</span>
                <span style={{ fontSize: 12, color: "#a0aec0" }}>{review.length} tasks</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", padding: "8px 20px", background: "#f7f8fc" }}>
                {["Name", "Projects"].map(h => (
                  <div key={h} style={{ fontSize: 11, color: "#a0aec0", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</div>
                ))}
              </div>
              {review.map((task, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "2fr 1.2fr",
                  padding: "11px 20px", borderBottom: "0.5px solid #f7f8fc",
                  alignItems: "center", cursor: "pointer",
                  transition: "background 0.12s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f7f8fc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#1a202c" }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", background: "#22C55E",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <CheckCircle size={12} color="#fff" fill="#22C55E" />
                    </div>
                    {task.name}
                    <Flag size={10} fill={task.flag} color={task.flag} style={{ marginLeft: 2 }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#718096", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {task.project}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #e2e8f0", fontSize: 14, fontWeight: 600, color: "#1a202c" }}>
              Recent Activity
            </div>
            {activity.map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 20px", borderBottom: i < activity.length - 1 ? "0.5px solid #f7f8fc" : "none",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "#EEF0FC",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <CheckCircle size={14} color="#6B5FE4" />
                </div>
                <div style={{ flex: 1, fontSize: 13, color: "#1a202c" }}>
                  <span style={{ fontWeight: 500 }}>{a.text}</span>{" "}
                  <span style={{ color: "#718096" }}>{a.sub}</span>
                </div>
                <div style={{ fontSize: 12, color: "#a0aec0" }}>{a.time}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

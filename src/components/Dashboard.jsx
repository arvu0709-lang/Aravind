
import React, { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:5000/api";

const Dashboard = () => {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoaded = useRef(false);

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
    fetchCounter();
  }, []);

  // Fetch users when search changes
  useEffect(() => {
    if (hasLoaded.current) {
      fetchUsers();
    }
  }, [search]);

  const fetchUsers = async () => {
    try {
      const url = search 
        ? `${API_BASE}/users?search=${encodeURIComponent(search)}`
        : `${API_BASE}/users`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      
      if (!hasLoaded.current) {
        console.log("=== BACKEND DATA - USERS ===");
        console.log(JSON.stringify(data, null, 2));
        console.log("Total users:", data.length);
        hasLoaded.current = true;
      }
      
      setItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchCounter = async () => {
    try {
      const response = await fetch(`${API_BASE}/counter`);
      const data = await response.json();
      
      if (!hasLoaded.current) {
        console.log("=== BACKEND DATA - COUNTER ===");
        console.log(JSON.stringify(data, null, 2));
      }
      
      setCount(data.counter);
    } catch (err) {
      console.error("Failed to fetch counter:", err);
    }
  };

  const handleIncrement = async () => {
    try {
      const response = await fetch(`${API_BASE}/counter/increment`, {
        method: "POST",
      });
      const data = await response.json();
      setCount(data.counter);
    } catch (err) {
      console.error("Failed to increment:", err);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch(`${API_BASE}/counter/reset`, {
        method: "POST",
      });
      const data = await response.json();
      setCount(data.counter);
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "#10b981",
      Inactive: "#ef4444",
      Pending: "#f59e0b",
    };
    return colors[status] || "#6b7280";
  };

  const getRoleColor = (role) => {
    const colors = {
      Admin: "#8b5cf6",
      Manager: "#3b82f6",
      User: "#6b7280",
    };
    return colors[role] || "#6b7280";
  };

  const activeUsers = items.filter((i) => i.status === "Active").length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>⏳</div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>⚠️ Error: {error}</p>
        <button style={styles.retryButton} onClick={fetchUsers}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Welcome back! Here's your overview</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{items.length}</span>
            <span style={styles.statLabel}>Total Users</span>
          </div>
          <div style={styles.statTrend}>+12%</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{activeUsers}</span>
            <span style={styles.statLabel}>Active</span>
          </div>
          <div style={{ ...styles.statTrend, color: "#10b981" }}>+8%</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔢</div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{count}</span>
            <span style={styles.statLabel}>Counter</span>
          </div>
          <div style={{ ...styles.statTrend, color: "#f59e0b" }}>
            {count > 0 ? "Counting" : "Ready"}
          </div>
        </div>
      </div>

      <div style={styles.actionsSection}>
        <div style={styles.counterCard}>
          <h3 style={styles.counterTitle}>Counter Control</h3>
          <div style={styles.counterDisplay}>
            <span style={styles.counterValue}>{count}</span>
          </div>
          <div style={styles.buttonGroup}>
            <button style={styles.incrementButton} onClick={handleIncrement}>
              ➕ Increment
            </button>
            <button style={styles.resetButton} onClick={handleReset}>
              🔄 Reset
            </button>
          </div>
        </div>

        <div style={styles.searchCard}>
          <h3 style={styles.searchTitle}>Search Users</h3>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          {search && (
            <p style={styles.searchResult}>
              Found {items.length} result{items.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div style={styles.tableSection}>
        <h3 style={styles.tableTitle}>User Management</h3>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Avatar</th>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      ...styles.tr,
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    <td style={styles.td}>
                      <div style={styles.avatar}>{item.avatar}</div>
                    </td>
                    <td style={styles.td}>#{item.id}</td>
                    <td style={styles.td}>
                      <strong>{item.name}</strong>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: getRoleColor(item.role) + "20",
                          color: getRoleColor(item.role),
                        }}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusDot,
                          backgroundColor: getStatusColor(item.status),
                        }}
                      ></span>
                      <span
                        style={{
                          ...styles.statusText,
                          color: getStatusColor(item.status),
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.noResults}>
                    No users found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "32px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  loadingContainer: {
    padding: "32px",
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: "#64748b",
  },
  errorContainer: {
    padding: "32px",
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#ef4444",
  },
  retryButton: {
    padding: "12px 24px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    color: "#ffffff",
    margin: "0 0 8px 0",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    margin: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 24,
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  statIcon: {
    fontSize: 36,
    width: 56,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: 12,
  },
  statContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  statValue: {
    fontSize: 32,
    fontWeight: 700,
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  statTrend: {
    fontSize: 14,
    fontWeight: 600,
    color: "#10b981",
    backgroundColor: "#d1fae5",
    padding: "4px 12px",
    borderRadius: 20,
  },
  actionsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
    marginBottom: 32,
  },
  counterCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  counterTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 16px 0",
  },
  counterDisplay: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: 12,
    padding: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  counterValue: {
    fontSize: 48,
    fontWeight: 700,
    color: "#ffffff",
  },
  buttonGroup: {
    display: "flex",
    gap: 12,
  },
  incrementButton: {
    flex: 1,
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 600,
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  resetButton: {
    flex: 1,
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 600,
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  searchCard: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 16px 0",
  },
  searchContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 16,
    fontSize: 18,
  },
  searchInput: {
    width: "100%",
    padding: "14px 14px 14px 48px",
    fontSize: 14,
    border: "2px solid #e2e8f0",
    borderRadius: 10,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  searchResult: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 12,
  },
  tableSection: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 16px 0",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #e2e8f0",
  },
  tr: {
    transition: "background-color 0.2s",
  },
  td: {
    padding: "16px",
    fontSize: 14,
    color: "#334155",
    borderBottom: "1px solid #e2e8f0",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 14,
  },
  badge: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  statusDot: {
    display: "inline-block",
    width: 8,
    height: 8,
    borderRadius: "50%",
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 500,
  },
  noResults: {
    padding: 40,
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
  },
};

export default Dashboard;


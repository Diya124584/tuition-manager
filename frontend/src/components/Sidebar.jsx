import { Link } from "react-router-dom";

function Sidebar({ open, setOpen }) {
  const menuItems = [
  { name: "Dashboard", icon: "🏠", path: "/" },
  { name: "Students", icon: "👨‍🎓", path: "/students" },
  { name: "Attendance", icon: "📅", path: "/attendance" },
  { name: "Fees", icon: "💰", path: "/fees" },

  { name: "Batches", icon: "🕒", path: "/batches" },

  { name: "Announcements", icon: "📢", path: "/announcements" },
];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 998,
          }}
        />
      )}

      <div
        style={{
          position: window.innerWidth <= 768 ? "fixed" : "relative",
          left:
            window.innerWidth <= 768
              ? open
                ? 0
                : "-260px"
              : 0,
          top: 0,
          transition: "0.3s",
          width: "250px",
          minHeight: "100vh",
          background: "#482728",
          color: "white",
          padding: "20px",
          boxSizing: "border-box",
          zIndex: 999,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#C0F8D1",
            marginBottom: "30px",
          }}
        >
          Tuition Manager
        </h2>

        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setOpen(false)}
            style={{
              display: "block",
              color: "white",
              textDecoration: "none",
              padding: "14px",
              marginBottom: "12px",
              borderRadius: "8px",
              background:
                item.path === "/"
                  ? "#7E4E60"
                  : "transparent",
            }}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </div>
    </>
  );
}

export default Sidebar;
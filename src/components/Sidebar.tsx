import logo from "../../public/logo_minimal_no_bg.png";

interface Link {
  title: string;
  link: string;
}

const links: Array<Link> = [
  {
    title: "Guilds",
    link: "#",
  },
  {
    title: "Nitrado Servers",
    link: "#",
  },
  {
    title: "Guild Config",
    link: "#",
  },
  {
    title: "Economy",
    link: "#",
  },
  {
    title: "Alarms",
    link: "#",
  },
  {
    title: "UAVs",
    link: "#",
  },
  {
    title: "Events",
    link: "#",
  },
  {
    title: "Player Map",
    link: "#",
  },
  {
    title: "Analytics",
    link: "#",
  },
];

export default function Sidebar() {
  return (
    <div
      style={{
        background: "#1A1B1E",
        borderRight: "solid 1px #2A2B2F",
        position: "fixed",
        top: "0",
        left: "0",
        overflowX: "hidden",
        width: "200px",
      }}
    >
      <div>
        <img
          style={{
            margin: "12pt",
            marginLeft: "18pt",
            marginTop: "12pt",
            width: "160px",
          }}
          src={logo}
          alt="Logo"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
          height: "100vh",
        }}
      >
        {links.map((link: Link) => (
          <a
            style={{
              padding: "6pt",
              marginLeft: "12pt",
              fontStyle: "bold",
              color: link.title == "Guilds" ? "white" : "#9C9FA3",
              backgroundColor: link.title == "Guilds" ? "#2a2b2f" : "none",
              borderRadius: "6px",
              paddingBottom: "8pt",
              marginRight: "12pt",
            }}
            href={link.link}
          >
            {link.title}
            {/*{link.title == "Guilds" ? (
              <span style={{ display: "flex" }}>
                <div
                  style={{
                    left: "0px",
                    backgroundColor: "#F46A1F",
                    height: "100%",
                    width: "2px",
                  }}
                ></div>
                {link.title}
              </span>
            ) : (
              <span>{link.title}</span>
            )}*/}
          </a>
        ))}
      </div>
    </div>
  );
}

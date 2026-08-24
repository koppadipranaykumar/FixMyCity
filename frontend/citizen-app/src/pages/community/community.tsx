import "./Community.css";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

const leaderboard = [
  {
    name: "Pranay",
    reports: 48,
    badge: "🥇",
    area: "Kompally",
  },
  {
    name: "Rahul",
    reports: 39,
    badge: "🥈",
    area: "Madhapur",
  },
  {
    name: "Sneha",
    reports: 34,
    badge: "🥉",
    area: "Kukatpally",
  },
  {
    name: "Akash",
    reports: 27,
    badge: "⭐",
    area: "Ameerpet",
  },
];

const successStories = [
  {
    title: "Road Repaired",
    description:
      "A damaged road near Kukatpally was repaired within 4 days after citizen reporting.",
    icon: "🛣️",
  },
  {
    title: "Garbage Cleared",
    description:
      "Garbage dumping near Madhapur park was removed within 24 hours.",
    icon: "🗑️",
  },
  {
    title: "Streetlights Fixed",
    description:
      "Broken streetlights in Kompally are now fully functional.",
    icon: "💡",
  },
];

const updates = [
  {
    title: "Heavy Rain Alert",
    description:
      "Citizens are advised to avoid waterlogged roads this weekend.",
    date: "Today",
  },
  {
    title: "Road Maintenance",
    description:
      "Road resurfacing begins from Monday near HiTech City.",
    date: "Yesterday",
  },
  {
    title: "Garbage Collection",
    description:
      "Morning collection timings updated in several areas.",
    date: "2 Days Ago",
  },
];

function Community() {
  return (
    <>
      <Navbar />

      <div className="community-page">

        {/* HERO */}

        <section className="community-hero">

          <div className="community-hero-content">

            <span className="community-tag">
              🌍 COMMUNITY HUB
            </span>

            <h1>
              Together We Build
              <br />
              Better Cities.
            </h1>

            <p>
              Join thousands of citizens actively reporting,
              tracking and improving civic infrastructure
              across Hyderabad.
            </p>

            <div className="community-buttons">

              <Link
                to="/report"
                className="primary-btn"
              >
                Report an Issue
              </Link>

              <Link
                to="/issues"
                className="secondary-btn"
              >
                Explore Issues
              </Link>

            </div>

          </div>

        </section>

        {/* STATS */}

        <section className="community-stats">

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h2>1,352</h2>
            <p>Registered Citizens</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📢</div>
            <h2>978</h2>
            <p>Issues Reported</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <h2>812</h2>
            <p>Issues Resolved</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <h2>92%</h2>
            <p>Citizen Satisfaction</p>
          </div>

        </section>

        {/* LEADERBOARD */}

        <section className="community-section">

          <div className="section-heading">

            <span>TOP CONTRIBUTORS</span>

            <h2>
              Community Leaderboard
            </h2>

            <p>
              Citizens making the biggest difference
              in keeping Hyderabad clean and safe.
            </p>

          </div>

          <div className="leaderboard">

            {leaderboard.map((user, index) => (

              <div
                className="leader-card"
                key={index}
              >

                <div className="leader-left">

                  <div className="leader-badge">
                    {user.badge}
                  </div>

                  <div>

                    <h3>{user.name}</h3>

                    <span>{user.area}</span>

                  </div>

                </div>

                <div className="leader-score">

                  {user.reports}

                  <small>Reports</small>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* SUCCESS STORIES */}

        <section className="community-section">

          <div className="section-heading">

            <span>SUCCESS STORIES</span>

            <h2>
              Real Impact
            </h2>

            <p>
              Every resolved issue helps create a
              better city for everyone.
            </p>

          </div>

          <div className="story-grid">

            {successStories.map((story, index) => (

              <div
                className="story-card"
                key={index}
              >

                <div className="story-icon">

                  {story.icon}

                </div>

                <h3>

                  {story.title}

                </h3>

                <p>

                  {story.description}

                </p>

              </div>

            ))}

          </div>

        </section>
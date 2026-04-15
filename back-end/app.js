const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = 3001;

const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./config/db");
const { ensureProjectMetaTables } = require("./config/ensureProjectMetaTables");

// Routes
const homeRoutes = require("./routes/homeRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const servicesRoutes = require("./routes/servicesRoutes");
const adminProjectRoutes = require("./routes/adminProjectRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminServiceRoutes = require("./routes/adminServiceRoutes");
const adminMessageRoutes = require("./routes/adminMessageRoutes");
const insightsApiRoutes = require("./routes/api/insightsApiRoutes");
const projectsApiRoutes = require("./routes/api/projectsApiRoutes");
const servicesApiRoutes = require("./routes/api/servicesApiRoutes");
const contactApiRoutes = require("./routes/api/contactApiRoutes");
const partnersApiRoutes = require("./routes/api/partnersApiRoutes");
const adminAuthApiRoutes = require("./routes/api/adminAuthApiRoutes");
const adminProjectsApiRoutes = require("./routes/api/adminProjectsApiRoutes");
const adminServicesApiRoutes = require("./routes/api/adminServicesApiRoutes");
const adminMessagesApiRoutes = require("./routes/api/adminMessagesApiRoutes");
const adminInsightsApiRoutes = require("./routes/api/adminInsightsApiRoutes");
const siteSettingsApiRoutes = require("./routes/api/siteSettingsApiRoutes");
const adminSiteSettingsApiRoutes = require("./routes/api/adminSiteSettingsApiRoutes");
const adminPartnersApiRoutes = require("./routes/api/adminPartnersApiRoutes");
const homePageContentApiRoutes = require("./routes/api/homePageContentApiRoutes");
const homeStatsApiRoutes = require("./routes/api/homeStatsApiRoutes");
const homeWhyItemsApiRoutes = require("./routes/api/homeWhyItemsApiRoutes");
const aboutContentApiRoutes = require("./routes/api/aboutContentApiRoutes");
const aboutFeaturesApiRoutes = require("./routes/api/aboutFeaturesApiRoutes");
const aiPageContentApiRoutes = require("./routes/api/aiPageContentApiRoutes");
const aiFeaturesApiRoutes = require("./routes/api/aiFeaturesApiRoutes");
const serviceProcessStepsApiRoutes = require("./routes/api/serviceProcessStepsApiRoutes");
const serviceProcessFeaturesApiRoutes = require("./routes/api/serviceProcessFeaturesApiRoutes");
const insightsPageContentApiRoutes = require("./routes/api/insightsPageContentApiRoutes");
const adminHomeApiRoutes = require("./routes/api/adminHomeApiRoutes");
const adminAboutApiRoutes = require("./routes/api/adminAboutApiRoutes");
const adminAiApiRoutes = require("./routes/api/adminAiApiRoutes");
const adminServicesPageApiRoutes = require("./routes/api/adminServicesPageApiRoutes");
const adminInsightsPageApiRoutes = require("./routes/api/adminInsightsPageApiRoutes");
const adminProjectMetaApiRoutes = require("./routes/api/adminProjectMetaApiRoutes");

const upload = require("./middleware/uploadProjectImage");


// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
  })
);

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use routes
app.use("/", homeRoutes);
app.use("/", insightsRoutes);
app.use("/", servicesRoutes);
app.use("/", adminProjectRoutes);
app.use("/", adminRoutes);
app.use("/", adminServiceRoutes);
app.use("/", adminMessageRoutes);

// API routes (JSON)
app.use("/api", insightsApiRoutes);
app.use("/api", projectsApiRoutes);
app.use("/api", servicesApiRoutes);
app.use("/api", contactApiRoutes);
app.use("/api", partnersApiRoutes);
app.use("/api", adminAuthApiRoutes);
// Project tags/timelines must register before /admin/projects/:id or nested paths can match the wrong handler
app.use("/api", adminProjectMetaApiRoutes);
app.use("/api", adminProjectsApiRoutes);
app.use("/api", adminServicesApiRoutes);
app.use("/api", adminMessagesApiRoutes);
app.use("/api", adminInsightsApiRoutes);
app.use("/api", siteSettingsApiRoutes);
app.use("/api", adminSiteSettingsApiRoutes);
app.use("/api", adminPartnersApiRoutes);
app.use("/api", homePageContentApiRoutes);
app.use("/api", homeStatsApiRoutes);
app.use("/api", homeWhyItemsApiRoutes);
app.use("/api", aboutContentApiRoutes);
app.use("/api", aboutFeaturesApiRoutes);
app.use("/api", aiPageContentApiRoutes);
app.use("/api", aiFeaturesApiRoutes);
app.use("/api", serviceProcessStepsApiRoutes);
app.use("/api", serviceProcessFeaturesApiRoutes);
app.use("/api", insightsPageContentApiRoutes);
app.use("/api", adminHomeApiRoutes);
app.use("/api", adminAboutApiRoutes);
app.use("/api", adminAiApiRoutes);
app.use("/api", adminServicesPageApiRoutes);
app.use("/api", adminInsightsPageApiRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ ok: true });
});



// Static render pages
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/ai-solutions", (req, res) => {
  res.render("ai-solutions");
});

app.get("/contact", (req, res) => {
  const success = req.query.success;
  const error = req.query.error;

  res.render("contact", {
    success,
    error,
    old: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const old = {
      name: name || "",
      email: email || "",
      subject: subject || "",
      message: message || "",
    };

    if (!name || !email || !message) {
      return res.status(400).render("contact", {
        success: null,
        error: "Please fill in name, email, and message.",
        old,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).render("contact", {
        success: null,
        error: "Please enter a valid email address.",
        old,
      });
    }

    const query = `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(query, [name, email, subject || null, message]);

    return res.render("contact", {
      success: "Your message was sent successfully.",
      error: null,
      old: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
    });
  } catch (error) {
    console.error("Error saving contact message:", error.message);

    return res.status(500).render("contact", {
      success: null,
      error: "Something went wrong while sending your message.",
      old: {
        name: req.body.name || "",
        email: req.body.email || "",
        subject: req.body.subject || "",
        message: req.body.message || "",
      },
    });
  }
});


app.get("/test-route", (req, res) => {
  res.send("test route works");
});

app.get("/success-story-ecta", (req, res) => {
  res.render("success-story-ecta");
});

app.get("/admin/login", (req, res) => {
  res.render("admin/login", { error: null });
});


app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.render("admin/login", { error: "Invalid email or password" });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.render("admin/login", { error: "Invalid email or password" });
    }

    req.session.admin = {
      id: admin.id,
      email: admin.email,
    };

    res.redirect("/admin/projects");
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send("Login error");
  }
});

app.get("/admin/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error.message);
      return res.status(500).send("Logout error");
    }

    res.redirect("/admin/login");
  });
});


app.listen(PORT, async () => {
  try {
    await ensureProjectMetaTables();
  } catch (e) {
    console.error("ensureProjectMetaTables:", e.message);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
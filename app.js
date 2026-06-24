require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { GoogleGenAI } = require("@google/genai");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "defaultsecret",
        resave: false,
        saveUninitialized: false
    })
);

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/signin");
    }
    next();
}

app.get("/", (req, res) => {
    res.redirect("/signin");
});

app.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render("signup", { error: "Please fill in all fields." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword],
            function (err) {
                if (err) {
                    return res.render("signup", {
                        error: "Email already exists. Please use another email."
                    });
                }

                res.redirect("/signin");
            }
        );
    } catch (error) {
        res.render("signup", { error: "Something went wrong." });
    }
});

app.get("/signin", (req, res) => {
    res.render("signin", { error: null });
});

app.post("/signin", (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err || !user) {
            return res.render("signin", { error: "Invalid email or password." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.render("signin", { error: "Invalid email or password." });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.redirect("/dashboard");
    });
});

app.get("/dashboard", requireLogin, (req, res) => {
    db.all(
        "SELECT * FROM schedules WHERE user_id = ? ORDER BY created_at DESC",
        [req.session.user.id],
        (err, schedules) => {
            res.render("dashboard", {
                user: req.session.user,
                schedules: schedules || []
            });
        }
    );
});

app.get("/schedule", requireLogin, (req, res) => {
    res.render("schedule", { user: req.session.user, result: null, error: null });
});

app.post("/schedule", requireLogin, async (req, res) => {
    const { tasks, availableTime, deadline } = req.body;

    if (!tasks || !availableTime || !deadline) {
        return res.render("schedule", {
            user: req.session.user,
            result: null,
            error: "Please complete all fields."
        });
    }

    try {
        const prompt = `
You are an AI scheduling assistant.
Create a clear daily schedule for a student.

Tasks:
${tasks}

Available time:
${availableTime}

Deadline:
${deadline}

Return the answer in a simple organized format with time blocks, priorities, and short advice.
`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt
        });

        const aiSchedule = response.text;

        db.run(
            "INSERT INTO schedules (user_id, task_input, ai_schedule) VALUES (?, ?, ?)",
            [req.session.user.id, tasks, aiSchedule]
        );

        res.render("schedule", {
            user: req.session.user,
            result: aiSchedule,
            error: null
        });
    } catch (error) {
        console.error("Gemini Error:", error);

        res.render("schedule", {
            user: req.session.user,
            result: null,
            error: "AI schedule could not be generated. Check the terminal error."
        });
    }
});

app.post("/delete/:id", requireLogin, (req, res) => {
    db.run(
        "DELETE FROM schedules WHERE id = ? AND user_id = ?",
        [req.params.id, req.session.user.id],
        () => {
            res.redirect("/dashboard");
        }
    );
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/signin");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
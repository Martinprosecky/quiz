const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Připojení k MongoDB
mongoose.connect("mongodb+srv://martin16:JebuTvojiMamu@cluster0.0fs4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ MongoDB připojeno"))
    .catch(err => console.log("❌ Chyba při připojení k MongoDB:", err));

// Schéma pro ukládání výsledků
const resultSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 3  // vždy uložíme 3
    },
    user: String,
    correctShapes: Number,
    totalShapes: Number,
    date: {
        type: Date,
        default: Date.now
    },
    answers: [
        {
            questionId: String,     // např. "Q1"
            questionText: String,   // text otázky
            userAnswer: String,     // odpověď uživatele
            isCorrect: Boolean      // zda odpověď byla správná
        }
    ]
});

const Result = mongoose.model("Result", resultSchema);

// Endpoint pro ukládání výsledků
app.post("/api/save-results", async (req, res) => {
    const { id, user, correctShapes, totalShapes, answers } = req.body;

    try {
        // Vytvoření a uložení výsledku
        const newResult = new Result({ id, user, correctShapes, totalShapes, answers });
        await newResult.save();

        res.status(200).json({
            message: "✅ Výsledky byly uloženy.",
            result: newResult
        });
    } catch (error) {
        console.error("❌ Chyba při ukládání výsledků:", error);
        res.status(500).send("Chyba při ukládání výsledků.");
    }
});

// Endpoint pro získání výsledků
app.get("/api/results", async (req, res) => {
    try {
        const results = await Result.find();
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Chyba při načítání výsledků:", error);
        res.status(500).send("Chyba při načítání výsledků.");
    }
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`🚀 Server běží na http://localhost:${port}`);
});

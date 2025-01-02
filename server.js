const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Server běží správně!"); // Odpověď, kterou uvidíte na adrese /
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Připojení k MongoDB
mongoose.connect("mongodb+srv://martin16:JebuTvojiMamu@cluster0.0fs4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const resultSchema = new mongoose.Schema({
    user: String,
    score: Number,
    date: String,
});

const Result = mongoose.model("Result", resultSchema);

// Endpoint pro ukládání výsledků
app.post("/api/save-results", async (req, res) => {
    const { user, score, date } = req.body;

    try {
        const newResult = new Result({ user, score, date });
        await newResult.save();
        res.status(200).send("Výsledky byly uloženy.");
    } catch (error) {
        res.status(500).send("Chyba při ukládání výsledků.");
    }
});

// Endpoint pro zobrazení výsledků
app.get("/api/results", async (req, res) => {
    try {
        const results = await Result.find();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).send("Chyba při načítání výsledků.");
    }
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});

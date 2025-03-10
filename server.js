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
mongoose.connect("mongodb+srv://proseckymarty2:Kackulicek123@quizCluster.mongodb.net/?retryWrites=true&w=majority&appName=quizCluster", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.log("MongoDB connection error:", err);
});

// Schéma pro uložení výsledků
// Přidáváme pole "answers" pro ukládání odpovědí na otázky.
const resultSchema = new mongoose.Schema({
    user: String,
    score: Number,
    date: Date,
    answers: [
      {
        questionId: String,     // Identifikátor otázky nebo např. "Otázka 1"
        questionText: String,   // Text otázky, pokud jej chcete ukládat
        userAnswer: String,     // Co uživatel zadal
        isCorrect: Boolean      // true/false podle vyhodnocení
      }
    ]
});

const Result = mongoose.model("Result", resultSchema);

// Endpoint pro ukládání výsledků
app.post("/api/save-results", async (req, res) => {
    const { test_id, user, score, date, answers } = req.body;

    // Pro logování dat přijatých z frontendu
    console.log("Přijatá data:", req.body);

    // Zkontroluj, zda všechny potřebné hodnoty existují
    if (!test_id || !user || !score || !date || !answers) {
        return res.status(400).send("Chybí některé požadované údaje.");
    }

    try {
        // Vytvoření nového výsledku
        const newResult = new Result({
            test_id,
            user,
            score,
            date,
            answers
        });

        // Uložení výsledku do databáze
        await newResult.save();

        // Odpověď s uloženým výsledkem
        res.status(200).json({
            message: "Výsledky byly uloženy.",
            result: newResult // Vrátíme uložený výsledek
        });
    } catch (error) {
        // Logování chyb
        console.error("Chyba při ukládání výsledků:", error);

        res.status(500).send("Chyba při ukládání výsledků.");
    }
});

// Endpoint pro zobrazení výsledků
app.get("/api/results", async (req, res) => {
    try {
        const results = await Result.find();
        res.status(200).json(results);
    } catch (error) {
        console.error("Chyba při načítání výsledků:", error);
        res.status(500).send("Chyba při načítání výsledků.");
    }
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});

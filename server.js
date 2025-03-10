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
const mongoURI = process.env.MONGO_URI || "mongodb+srv://proseckymarty2:Kackulicek123@quizcluster.esdbj.mongodb.net/?retryWrites=true&w=majority&appName=quizCluster";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB připojeno");
}).catch(err => {
    console.error("❌ Chyba připojení k MongoDB:", err);
});

// Definice schématu pro výsledky
const resultSchema = new mongoose.Schema({
    answers: {
        shapes: {
            responses: Number,
            correctResponses: Number
        },
        questions: [
            {
                questionId: String,
                questionText: String,
                userAnswer: String,
                isCorrect: Boolean
            }
        ]
    }
}, { timestamps: true });

const Result = mongoose.model("Result", resultSchema);

// Endpoint pro ukládání výsledků
app.post("/api/save-results", async (req, res) => {
    try {
        const { responses, correctResponses, questions } = req.body;

        const newResult = new Result({
            answers: {
                shapes: {
                    responses,
                    correctResponses
                },
                questions
            }
        });

        await newResult.save();

        res.status(200).json({
            message: "✅ Výsledek byl úspěšně uložen.",
            result: newResult
        });
    } catch (error) {
        console.error("❌ Chyba při ukládání výsledků:", error);
        res.status(500).send("Chyba při ukládání výsledků.");
    }
});

// Endpoint pro načítání výsledků
app.get("/api/results", async (req, res) => {
    try {
        const results = await Result.find({}, "_id answers __v");
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

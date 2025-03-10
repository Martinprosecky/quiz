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
 mongoose.connect("mongodb+srv://martin16:JebuTvojiMamu@cluster0.0fs4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
     useNewUrlParser: true, 
     useUnifiedTopology: true 
     useNewUrlParser: true,
     useUnifiedTopology: true
 }).then(() => {
     console.log("MongoDB connected");
 }).catch(err => {
     console.log("MongoDB connection error:", err);
 });
 
 // Schéma pro uložení výsledků
 // Rozšířené o pole "answers" pro detailní záznam odpovědí
 const resultSchema = new mongoose.Schema({
     user: String,
     score: Number,
     date: Date
     date: Date,
     answers: [
       {
         questionId: String,     // např. "Q1"
         questionText: String,   // text otázky
         userAnswer: String,     // otevřená odpověď uživatele
         isCorrect: Boolean      // příznak, zda je správně
       }
     ]
 });
 
 const Result = mongoose.model("Result", resultSchema);
 
 // Endpoint pro ukládání výsledků
 app.post("/api/save-results", async (req, res) => {
     const { user, score, date } = req.body;
     // Nově očekáváme "answers" v req.body
     const { user, score, date, answers } = req.body;
 
     try {
         // Vytvoření nového výsledku
         const newResult = new Result({ user, score, date });
         // Vytvoření nového výsledku (s polem answers)
         const newResult = new Result({ user, score, date, answers });
 
         // Uložení výsledku do databáze
         await newResult.save();
 
         // Odpověď s uloženým výsledkem
         res.status(200).json({
             message: "Výsledky byly uloženy.",
             result: newResult // Vrátíme uložený výsledek
             result: newResult
         });
     } catch (error) {
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

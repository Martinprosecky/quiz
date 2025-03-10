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
 mongoose.connect("mongodb+srv://martin16:JebuTvojiMamu@cluster0.0fs4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
     useNewUrlParser: true,
     useUnifiedTopology: true
 }).then(() => {
     console.log("✅ MongoDB připojeno");
 }).catch(err => {
     console.error("❌ Chyba připojení k MongoDB:", err);
 });
 
 // Schéma pro ukládání výsledků
 // Definice schématu
 const resultSchema = new mongoose.Schema({
     user: String,
     score: Number,
     date: Date,
     answers: [
         {
             questionId: String,     // např. "Q1"
             questionText: String,   // text otázky
             userAnswer: String,     // odpověď uživatele
             isCorrect: Boolean      // zda odpověď byla správná
         }
     ]
 });
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
     const { user, score, date, answers } = req.body;
 
     try {
         // Vytvoření a uložení výsledku
         const newResult = new Result({ user, score, date, answers });
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
             message: "✅ Výsledky byly uloženy.",
             message: "✅ Výsledek byl úspěšně uložen.",
             result: newResult
         });
     } catch (error) {
         console.error("❌ Chyba při ukládání výsledků:", error);
         res.status(500).send("Chyba při ukládání výsledků.");
     }
 });
 
 // Endpoint pro získání výsledků
 // Endpoint pro načítání výsledků
 app.get("/api/results", async (req, res) => {
     try {
         const results = await Result.find();
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

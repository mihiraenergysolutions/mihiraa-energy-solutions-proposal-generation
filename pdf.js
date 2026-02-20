import express from "express";


const app = express();

app.get("/", (req, res) => {
    res.send("PDF server running ✅");
});

app.listen(5000, () => {
    console.log("PDF server running → http://localhost:5000");
});

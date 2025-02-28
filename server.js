const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let postStatus = "Ingen post";
let iosClients = []; // Liste over tilsluttede iOS-klienter

// 📌 1. ESP32 sender en POST-request, når post registreres
app.post('/postkasse', (req, res) => {
    console.log("✅ Post registreret!");

    // Opdater status
    postStatus = "Der er post!";

    // Send respons til ESP32
    res.json({ message: "Poststatus opdateret!" });

    // Send besked til iOS-klienter
    iosClients.forEach(client => {
        try {
            client.json({ status: postStatus });
        } catch (err) {
            console.log("🚨 Fejl ved opdatering af klient:", err.message);
        }
    });

    // Ryd klientlisten
    iosClients = [];
});

// 📌 2. iOS-appen henter den aktuelle status
app.get('/status', (req, res) => {
    res.json({ status: postStatus });
});

// 📌 3. iOS kan nulstille poststatus, når brugeren trykker "OK"
app.post('/reset', (req, res) => {
    console.log("🔄 Poststatus nulstillet!");
    postStatus = "Ingen post";
    res.json({ message: "Status nulstillet" });
});

// 📌 4. Server start (Brug den korrekte port)
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server kører på port ${PORT}`);
});

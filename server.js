require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let postStatus = "Ingen post";

// ESP32 sender en HTTP-anmodning hertil, når post registreres
app.post('/postkasse', (req, res) => {
    console.log("Post registreret!");
    postStatus = "Der er post!";

    // Send notifikation til iOS (tilføjes senere med Firebase Cloud Messaging)
    res.json({ message: "Notifikation sendt til iOS" });
});

// iOS app kan tjekke status
app.get('/status', (req, res) => {
    res.json({ status: postStatus });
});

// iOS kan nulstille status når brugeren trykker "OK"
app.post('/reset', (req, res) => {
    postStatus = "Ingen post";
    res.json({ message: "Status nulstillet" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server kører på port ${PORT}`);
});

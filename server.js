const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let postStatus = "Ingen post";
let iosClients = []; // Holder styr på forbundne iOS-enheder

// ESP32 sender POST-anmodning, når der er post
app.post('/postkasse', (req, res) => {
    console.log("Post registreret!");
    postStatus = "Der er post!";

    // Send besked til alle forbundne iOS-enheder
    iosClients.forEach(res => res.json({ status: postStatus }));

    res.json({ message: "Poststatus opdateret!" });
});

// iOS registrerer sig selv på serveren for at modtage opdateringer
app.get('/status', (req, res) => {
    iosClients.push(res);
});

// iOS kan nulstille poststatus når brugeren trykker "OK"
app.post('/reset', (req, res) => {
    postStatus = "Ingen post";
    res.json({ message: "Status nulstillet" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server kører på port ${PORT}`);
});

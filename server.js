const express = require('express');
const bodyParser = require('body-parser');
const apn = require('apn');

const app = express();
app.use(bodyParser.json());

let deviceTokens = []; // Liste over enheder

// 📌 1. Gem device tokens fra iOS
app.post('/registerToken', (req, res) => {
    const token = req.body.token;
    if (!deviceTokens.includes(token)) {
        deviceTokens.push(token);
        console.log(`📲 Nyt device token registreret: ${token}`);
    }
    res.send({ success: true });
});

// 📌 2. Send push notifikation, når ESP32 registrerer post
app.post('/', (req, res) => {
    console.log("📬 Post registreret!");
    
    // Send push notifikation via APNs
    sendPushNotification("Der er post i din postkasse!");
    
    res.json({ message: "Notifikation sendt!" });
});

// 📌 3. Funktion til at sende push notifikationer via APNs
function sendPushNotification(message) {
    if (deviceTokens.length === 0) {
        console.log("🚨 Ingen registrerede enheder!");
        return;
    }

    let options = {
        token: {
            key: "path/to/AuthKey.p8", // Erstat med din .p8 fil
            keyId: "DIN_KEY_ID",
            teamId: "DIT_TEAM_ID"
        },
        production: false // Skift til "true" for produktion
    };

    let apnProvider = new apn.Provider(options);

    let notification = new apn.Notification();
    notification.topic = "com.ditfirmanavn.postkassealarm"; // Erstat med dit bundle ID
    notification.alert = message;
    notification.sound = "default";

    // Send besked til alle registrerede enheder
    deviceTokens.forEach(token => {
        apnProvider.send(notification, token)
            .then(response => {
                console.log("✅ Notifikation sendt:", response);
            })
            .catch(error => {
                console.error("🚨 Fejl ved afsendelse:", error);
            });
    });
}

// 📌 4. Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server kører på port ${PORT}`);
});

require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

const pendingLink = new Map();

/**
 * 1. Webhook (Messaging API)
 */
app.post("/webhook", async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    // ผู้ใช้พิมพ์ "link"
    if (event.type === "message" && event.message.text === "link") {
      const userId = event.source.userId;

      // 2. ขอ linkToken
      const tokenRes = await axios.post(
        `https://api.line.me/v2/bot/user/${userId}/linkToken`,
        {},
        {
          headers: {
            Authorization: `Bearer ${BOT_TOKEN}`,
          },
        }
      );

      const linkToken = tokenRes.data.linkToken;
      const nonce = Math.random().toString(36).substring(2);

      pendingLink.set(nonce, userId);

      // 3. ส่ง Account Link URL ให้ user
      const linkUrl =
        `https://access.line.me/dialog/bot/accountLink` +
        `?linkToken=${linkToken}&nonce=${nonce}`;

      await axios.post(
        "https://api.line.me/v2/bot/message/push",
        {
          to: userId,
          messages: [
            {
              type: "text",
              text: `กรุณาเชื่อมบัญชี:\n${linkUrl}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${BOT_TOKEN}`,
          },
        }
      );
    }

    /**
     * 4. รับ accountLink event
     */
    if (event.type === "accountLink") {
      const userId = event.source.userId;
      const { result, nonce } = event.link;

      if (result === "ok" && pendingLink.has(nonce)) {
        console.log("Account link success for:", userId);
        // รอ LIFF ส่ง login userId มา confirm
      }
    }
  }

  res.sendStatus(200);
});

/**
 * 5. รับจาก LIFF หลัง login
 */
app.post("/liff/callback", (req, res) => {
  const { idToken, nonce } = req.body;

  try {
    const decoded = jwt.decode(idToken);
    const loginUserId = decoded.sub;

    if (!pendingLink.has(nonce)) {
      return res.status(400).json({ error: "invalid nonce" });
    }

    const messagingUserId = pendingLink.get(nonce);

    // 6. บันทึก mapping (ตัวอย่าง console)
    console.log("LINKED:");
    console.log("Messaging ID:", messagingUserId);
    console.log("Login ID:", loginUserId);

    pendingLink.delete(nonce);

    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "invalid token" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

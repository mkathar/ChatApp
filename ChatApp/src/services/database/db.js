const express = require("express");
const app = express();
const pgp = require("pg-promise")();
const db = pgp("postgresql://postgres:Sanane132@localhost:5432/ChatApp");
const port = 3000;
const session = require("express-session");

const cors = require("cors");
//SOCKET.İO İÇİN GEREKLİ PAKETLER BUNLARI MESAJLAŞMA VE HESAP İŞLEMLERİ İÇİN KULLANACAĞIM
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const bodyParser = require("body-parser");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "ozelsifreyok",
    resave: false,
    saveUninitialized: true,
  })
);
let userData;
let conversationPartners;
let allConversations;
let conversationMessages;

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/register", (req, res) => {
  const { username, password, email } = req.body;

  const query = {
    text: "INSERT INTO users (user_name, user_password,user_email) VALUES($1, $2, $3)",
    values: [username, password, email],
  };

  db.query(query)
    .then(() => {
      res.status(201).send("Kullanıcı başarıyla kaydedildi.");
    })
    .catch((error) => {
      console.error("Kullanıcı kaydedilirken hata oluştu:", error);
      res.status(500).send("Kullanıcı kaydedilirken bir hata oluştu.");
    });
});
app.post("/login", (req, res) => {
  const { user_mail, user_password } = req.body;
  console.log("user_mail", user_mail, "user_password", user_password);

  const query = {
    text: "SELECT user_id, user_name, user_email, user_password FROM users WHERE user_email = $1 AND user_password = $2",
    values: [user_mail, user_password],
  };

  db.query(query)
    .then((result) => {
      const isUserAuthenticated = result.length > 0;

      if (isUserAuthenticated) {
        userData = {
          user_id: result[0].user_id,
          user_name: result[0].user_name,
          user_email: result[0].user_email,
          user_password: result[0].user_password,
        };

        req.session.user = userData;

        console.log("Oturum başarıyla açıldı:", req.session.user);
        getAllData();

        res.status(200).json(req.session.user);
      } else {
        res.status(401).send("Kullanıcı kimlik doğrulama hatası.");
      }
    })
    .catch((error) => {
      console.error(
        "Kullanıcı kimlik doğrulaması sırasında hata oluştu:",
        error
      );
      res
        .status(500)
        .send("Kullanıcı kimlik doğrulaması sırasında bir hata oluştu.");
    });
});
app.post("/sendmessage", (req, res) => {
  const { message_text, message_time, receiver_id, sender_id } = req.body;

  const query = {
    text: "INSERT INTO messages (message_text, message_time, receiver_id, sender_id) VALUES($1, $2, $3, $4)",
    values: [message_text, message_time, receiver_id, sender_id],
  };

  db.query(query)
    .then(() => {
      res.status(201).send("Mesaj  başarıyla kaydedildi.");
    })
    .catch((error) => {
      console.error("Mesaj kaydedilirken hata oluştu:", error);
      res.status(500).send("Mesaj kaydedilirken bir hata oluştu.");
    });
});
app.get("/profile", (req, res) => {
  console.log("userData:", userData);

  if (userData) {
    console.log("userData:", userData);
    getAllData();
    res.status(200).json(userData);
  } else {
    res.send("Oturum açmış bir kullanıcı bulunamadı.");
  }
});

app.get("/oturumu-kapat", (req, res) => {
  if (userData) {
    userData = null;

    req.session.destroy((error) => {
      if (error) {
        console.error("Oturumu sonlandırma sırasında bir hata oluştu:", error);
        res.status(500).send("Oturumu sonlandırma sırasında bir hata oluştu.");
      } else {
        res.status(200).send("Oturum başarıyla sonlandırıldı.");
      }
    });
  } else {
    res.status(200).send("Kullanıcı oturumu zaten kapalı.");
  }
});

server.listen(port, () => {
  console.log(`API çalışıyor: http://localhost:${port}`);
});

app.get("/oturum-durumu", (req, res) => {
  if (req.session) {
    res.status(200).json({ isLoggedIn: true });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});

app.get("/conversationPartners", (req, res) => {
  res.status(200).json(conversationPartners);
});
app.get("/allConversations", (req, res) => {
  res.status(200).json(allConversations);
});
app.get("/conversationMessages", (req, res) => {
  res.status(200).json(conversationMessages);
});
app.post("/api/updateVariable", (req, res) => {
  const newValue = req.body.newValue;

  res.send({ success: true, message: "Değişken güncellendi" });
});
app.get("/getConversationMessages/:userId/:partnerId", async (req, res) => {
  // const userId = 1;
  const userId = req.params.userId;
  const partnerId = req.params.partnerId;

  try {
    const result = await getConversationMessages(userId, partnerId);
    res.json(result);
  } catch (error) {
    console.error("Mesajları alma hatası:", error);
    res.status(500).json({ error: "Mesajları alma hatası" });
  }
});
async function getConversationMessages(userId, partnerId) {
  console.log("selam");
  const query = `
      SELECT
          message_id,
          message_text,
          message_time,
          receiver_id,
          sender_id
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY message_time;
    `;

  try {
    const messages = await db.any(query, [userId, partnerId]);

    const partnerInfoQuery = `
        SELECT user_name,user_id
        FROM users
        WHERE user_id = $1;
      `;

    const partnerInfo = await db.one(partnerInfoQuery, partnerId);
    conversationMessages = {
      mesajlaşılanKişi: {
        user_id: partnerInfo.user_id,
        user_name: partnerInfo.user_name,
      },
      Mesajlar: messages.map((row) => ({
        message_id: row.message_id,
        message_text: row.message_text,
        message_time: row.message_time,
        receiver_id: row.receiver_id,
        sender_id: row.sender_id,
      })),
    };
    return {
      conversationMessages,
    };
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

function getAllData() {
  console.log("getAllDATA çalıştı");
  console.log("USERDATA", userData);
  console.log("USERDATA.USER_İD", userData.user_id);

  if (userData) {
    const userId = userData.user_id;
    console.log("user ID", userId);

    async function getConversationPartners(userId) {
      const query = `
          SELECT DISTINCT
              CASE
                  WHEN m.sender_id = $1 THEN m.receiver_id
                  ELSE m.sender_id
              END AS partner_id,
              u.user_name AS partner_name
          FROM messages m
          JOIN users u ON
              CASE
                  WHEN m.sender_id = $1 THEN m.receiver_id
                  ELSE m.sender_id
              END = u.user_id
          WHERE m.sender_id = $1 OR m.receiver_id = $1;
          
        `;

      try {
        const result = await db.any(query, userId);

        const updatedResult = result.map((row) => ({
          partner_id: row.partner_id,
          partner_name: row.partner_name,
        }));
        conversationPartners = updatedResult;
        return updatedResult;
      } catch (error) {
        console.error("Error executing query:", error);
        throw error;
      }
    }

    getConversationPartners(userId)
      .then((partners) => {
        console.log("Conversation Partners:", partners);
        const partnerId = partners[0].partner_id;
        return getConversationMessages(userId, partnerId);
      })
      .then((messages) => {
        console.log("Conversation Messages:", messages);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    async function getAllConversations(userId) {
      const query = `
            SELECT
              DISTINCT ON (CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END)
              CASE
                  WHEN m.sender_id = $1 THEN m.receiver_id
                  ELSE m.sender_id
              END AS partner_id,
              u.user_name AS partner_name,
              m.message_id,
              m.message_text,
              m.message_time,
              m.receiver_id,
              m.sender_id
            FROM messages m
            JOIN users u ON
              CASE
                  WHEN m.sender_id = $1 THEN m.receiver_id
                  ELSE m.sender_id
              END = u.user_id
            WHERE m.sender_id = $1 OR m.receiver_id = $1
            ORDER BY CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END, m.message_time DESC;
          `;

      try {
        const result = await db.any(query, userId);

        const conversations = {};
        result.forEach((row) => {
          const partnerId = row.partner_id;
          if (!conversations[partnerId]) {
            conversations[partnerId] = {
              mesajlaşılanKişi: row.partner_name,
              mesajlaşılanKişi_Id: partnerId,
              Mesajlar: [],
            };
          }

          conversations[partnerId].Mesajlar.push({
            message_id: row.message_id,
            message_text: row.message_text,
            message_time: row.message_time,
            receiver_id: row.receiver_id,
            sender_id: row.sender_id,
          });
        });

        return Object.values(conversations);
      } catch (error) {
        console.error("Error executing query:", error);
        throw error;
      }
    }

    getAllConversations(userId)
      .then((conversations) => {
        allConversations = conversations;
        console.log("All Conversations:", conversations);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

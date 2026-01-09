const prisma = require("../Config/prisma");

exports.mappingData = async (req, res) => {
  try {
    const { userId, lastName, phone, email } = req.body;

    if (!userId || !lastName || !phone || !email) {
      console.log("Information is Empty!");
      return res
        .status(400)
        .json({ status: "error", msg: "Information is Empty!" });
    }

    // console.log("Payload Data:", { userId, lastName, phone, email });

    const user = await prisma.Users.findFirst({
      where: {
        Lastname: lastName,
        PhoneNumber: phone,
        Email: email,
      },
      select: {
        UserId: true,
        Lastname: true,
        PhoneNumber: true,
        Email: true,
      },
    });

    if (!user) {
      console.log("Data does not match!");
      return res.json({ status: "errordata", msg: "Data does not match!" });
    }

    console.log("Matched User:", user);

    const now = new Date();
    const thaiDateTime = now.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const formattedDateTime = thaiDateTime
      .replace(/\//g, "-")
      .replace(" ", "-");

    const lineToken = `token${formattedDateTime}`;

    const upsertLineUser = await prisma.LineUser.upsert({
      where: { UserId: user.UserId },
      update: { UserIdLine: userId },
      create: {
        UserIdLine: userId,
        LineToken: {
          create: { Token: lineToken },
        },
        Users: { connect: { UserId: user.UserId } },
      },
    });

    if (!upsertLineUser) {
      console.log("Data does not match!");
      return res
        .status(404)
        .json({ status: "error", msg: "Data does not match!" });
    }

    console.log("Upserted LineUser Success:", upsertLineUser);

    res.json({ status: "success", data: { userId, lastName, phone, email } });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

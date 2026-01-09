const prisma = require("../Config/prisma");

exports.mappingData = async (req, res) => {
  try {
    const { userId, lastName, phone, email } = req.body;

    if (!userId) {
      console.log("UserId Not Found!");
      return res
        .status(400)
        .json({ status: "error", msg: "UserId Not Found!" });
    }

    console.log("UserId is:", userId);

    if (!lastName || !phone || !email) {
      console.log("Information is Empty!");
      return res
        .status(400)
        .json({ status: "error", msg: "Information is Empty!" });
    }

    // console.log("Payload Data:", { userId, lastName, phone, email });

    const getLastName = await prisma.Users.findFirst({
      where: { Lastname: lastName },
      select: {
        UserId: true,
        Lastname: true,
        PhoneNumber: true,
        Email: true,
      },
    });

    if (!getLastName) {
      console.log("Lastname does not match!");
      return res.json({
        status: "errorlastname",
        msg: "Lastname does not match!",
      });
    }

    const getPhone = await prisma.Users.findFirst({
      where: { PhoneNumber: phone },
      select: {
        UserId: true,
        Lastname: true,
        PhoneNumber: true,
        Email: true,
      },
    });

    if (!getPhone) {
      console.log("Phonenumber does not match!");
      return res.json({
        status: "errorphonenumber",
        msg: "Phonenumber does not match!",
      });
    }

    const getEmail = await prisma.Users.findFirst({
      where: { Email: email },
      select: {
        UserId: true,
        Lastname: true,
        PhoneNumber: true,
        Email: true,
      },
    });

    if (!getEmail) {
      console.log("Email does not match!");
      return res.json({
        status: "erroremail",
        msg: "Email does not match!",
      });
    }

    const user = await prisma.Users.findFirst({
      where: {
        Lastname: getLastName.userId,
        PhoneNumber: getPhone.userId,
        Email: getEmail.userId,
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
      update: { UserIdLine: userId, ModifiedDate: now },
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

let lineUserId = null;

document.addEventListener("DOMContentLoaded", async function () {
  /* =======================
                      LIFF INIT
                   ======================= */
  try {
    await liff.init({ liffId: "2008846373-wFLvZy1i" });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();
    lineUserId = profile.userId;

    console.log("LINE userId:", lineUserId);
  } catch (err) {
    console.error("LIFF init failed", err);
    alert("ไม่สามารถเชื่อมต่อ LINE ได้");
    return;
  }

  const form = document.getElementById("verificationForm");
  const submitBtn = document.getElementById("submitBtn");
  const successOverlay = document.getElementById("successOverlay");

  const phoneInput = document.getElementById("phone");
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 10) value = value.slice(0, 10);
    e.target.value = value;
  });

  const inputs = form.querySelectorAll(".form-control");

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });
    input.addEventListener("input", function () {
      if (this.classList.contains("is-invalid")) {
        validateField(this);
      }
    });
  });

  function validateField(field) {
    let isValid = true;

    if (field.id === "lastName") {
      isValid = field.value.trim().length >= 2;
    } else if (field.id === "phone") {
      isValid = /^[0-9]{10}$/.test(field.value);
    } else if (field.id === "email") {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    }

    field.classList.toggle("is-valid", isValid);
    field.classList.toggle("is-invalid", !isValid);
    return isValid;
  }

  /* =======================
                      SUBMIT FORM
                   ======================= */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isFormValid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) isFormValid = false;
    });

    if (!lineUserId) {
      alert("ไม่พบ LINE userId");
      return;
    }

    if (isFormValid) {
      submitBtn.classList.add("loading");

      setTimeout(() => {
        submitBtn.classList.remove("loading");
        successOverlay.classList.add("show");

        const formData = {
          userId: lineUserId,
          lastName: document.getElementById("lastName").value,
          phone: document.getElementById("phone").value,
          email: document.getElementById("email").value,
        };

        // URL ของ API ที่จะส่งข้อมูลไป
        const apiUrl = "http://85.204.247.82:26300/api/liff/register";

        fetch(apiUrl, {
          method: "POST", // กำหนดเป็น POST
          headers: {
            "Content-Type": "application/json", // ส่งข้อมูลเป็น JSON
          },
          body: JSON.stringify(formData), // แปลง object เป็น JSON string
        })
          .then((response) => response.json()) // แปลง response เป็น JSON
          .then((data) => {
            console.log("Success:", data);
            // ทำอะไรต่อถ้าส่งสำเร็จ
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        console.log("Submit Data:", formData);

        setTimeout(() => {
          successOverlay.classList.remove("show");
          form.reset();
          inputs.forEach((i) => i.classList.remove("is-valid"));
        }, 3000);
      }, 1500);
    }
  });
});

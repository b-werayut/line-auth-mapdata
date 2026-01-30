let lineUserId = null;

        const errorOverlay = document.getElementById('errorOverlay');
        const errordataMessage = document.getElementById('errordataOverlay');
        const errorMessage = document.getElementById('errorMessage');

        document.addEventListener("DOMContentLoaded", async function () {

            try {
                await liff.init({ liffId: "2008857234-LRlYqZDu" });

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
            const errordataOverlay = document.getElementById("errordataOverlay");
            const errorText = document.querySelector(".errordata-title");
            const errorOverlay = document.getElementById("errorOverlay");

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

                        const formData = {
                            userId: lineUserId,
                            lastName: document.getElementById("lastName").value,
                            phone: document.getElementById("phone").value,
                            email: document.getElementById("email").value,
                        };

                        const apiUrl = "https://www.centrecities.com/api/liff/register";

                        fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(formData),
                        })
                            .then((response) => response.json())
                            .then((data) => {

                                const hideOverlay = (overlay, delay = 3000) => {
                                    setTimeout(() => overlay.classList.remove("show"), delay);
                                };

                                const showError = (message = "ข้อมูลไม่ถูกต้อง") => {
                                    errorText.textContent = message;
                                    errordataOverlay.classList.add("show");
                                    hideOverlay(errordataOverlay);
                                };

                                const errorMessages = {
                                    "1": "นามสกุลไม่ถูกต้อง",
                                    "2": "เบอร์โทรไม่ถูกต้อง",
                                    "3": "อีเมล์ไม่ถูกต้อง",
                                    "4": "ข้อมูลไม่ถูกต้อง",
                                };

                                if (data.status === "5") {
                                    successOverlay.classList.add("show");

                                    setTimeout(() => {
                                        successOverlay.classList.remove("show");
                                        form.reset();
                                        inputs.forEach(i => i.classList.remove("is-valid"));
                                        window.close();
                                    }, 4000);

                                } else if (errorMessages[data.status]) {
                                    showError(errorMessages[data.status]);
                                }

                                console.log("Status:", data.status);

                            })
                            .catch((error) => {
                                errorOverlay.classList.add("show");
                                setTimeout(() => {
                                    errorOverlay.classList.remove("show");
                                    form.reset();
                                    inputs.forEach((i) => i.classList.remove("is-valid"));
                                }, 3000);
                                console.error("Error:", error);
                            });

                        console.log("Submit Data:", formData);
                    }, 1500);
                }
            });
        });

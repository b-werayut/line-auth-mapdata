<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ยืนยันตัวตน | Identity Verification</title>
    <!-- Favicon -->
    <link rel="icon" href="https://example.com/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="https://example.com/favicon.ico" type="image/x-icon">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="./css/styles.css" rel="stylesheet">
    <!-- <link href="./css/styles.css" rel="stylesheet"> -->
    <script src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
</head>
<style>
    
</style>

<body>
    <!-- Floating Particles -->
    <div class="particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
    </div>

    <div class="main-container">
        <div class="verification-card">
            <div class="card-content">
                <!-- Logo Section -->
                <div class="logo-section">
                    <div class="shield-icon">
                        <i class="bi bi-shield-check"></i>
                    </div>
                    <h1 class="header-title">ยืนยันตัวตน</h1>
                    <p class="header-subtitle">
                        กรุณากรอกข้อมูลของท่านเพื่อยืนยันตัวตน<br>ข้อมูลของท่านจะถูกเก็บรักษาอย่างปลอดภัย</p>
                </div>

                <!-- Verification Form -->
                <form id="verificationForm" novalidate>
                    <!-- Last Name -->
                    <div class="form-group">
                        <label class="form-label">
                            <i class="bi bi-person"></i>
                            นามสกุล
                        </label>
                        <div class="input-wrapper">
                            <input type="text" class="form-control" id="lastName" name="lastName"
                                placeholder="กรุณากรอกนามสกุล" required>
                            <i class="bi bi-person-fill input-icon"></i>
                            <div class="invalid-feedback">กรุณากรอกนามสกุลของท่าน</div>
                        </div>
                    </div>

                    <!-- Phone Number -->
                    <div class="form-group">
                        <label class="form-label">
                            <i class="bi bi-telephone"></i>
                            เบอร์โทรศัพท์
                        </label>
                        <div class="input-wrapper">
                            <input type="tel" class="form-control" id="phone" name="phone" placeholder="0XX-XXX-XXXX"
                                pattern="[0-9]{10}" required>
                            <i class="bi bi-telephone-fill input-icon"></i>
                            <div class="invalid-feedback">กรุณากรอกเบอร์โทรศัพท์ 10 หลัก</div>
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="form-group">
                        <label class="form-label">
                            <i class="bi bi-envelope"></i>
                            อีเมล
                        </label>
                        <div class="input-wrapper">
                            <input type="email" class="form-control" id="email" name="email"
                                placeholder="example@email.com" required>
                            <i class="bi bi-envelope-fill input-icon"></i>
                            <div class="invalid-feedback">กรุณากรอกอีเมลที่ถูกต้อง</div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn-verify" id="submitBtn">
                        <span class="btn-text">ยืนยันตัวตน</span>
                        <i class="bi bi-arrow-right-circle-fill btn-text"></i>
                        <div class="spinner"></div>
                    </button>
                </form>

                <!-- Security Badge -->
                <div class="security-badge">
                    <i class="bi bi-lock-fill"></i>
                    <span>ข้อมูลของท่านได้รับการเข้ารหัสและปกป้องอย่างปลอดภัย</span>
                </div>

                <!-- Trust Indicators -->
                <div class="trust-indicators">
                    <div class="trust-item">
                        <i class="bi bi-shield-lock"></i>
                        <span>ปลอดภัย</span>
                    </div>
                    <div class="trust-item">
                        <i class="bi bi-patch-check"></i>
                        <span>น่าเชื่อถือ</span>
                    </div>
                    <div class="trust-item">
                        <i class="bi bi-clock-history"></i>
                        <span>รวดเร็ว</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Success Overlay -->
    <div class="success-overlay" id="successOverlay">
        <div class="success-checkmark">
            <i class="bi bi-check-lg"></i>
        </div>
        <h2 class="success-title">ยืนยันตัวตนสำเร็จ!</h2>
        <p class="success-message">ขอบคุณสำหรับการยืนยันตัวตน</p>
    </div>

    <!-- Error Overlay -->
    <div class="error-overlay" id="errorOverlay">
        <div class="error-icon">
            <i class="bi bi-x-lg"></i>
        </div>
        <h2 class="error-title">เกิดข้อผิดพลาด</h2>
        <p class="error-message" id="errorMessage">
            กรุณาลองใหม่อีกครั้ง
        </p>
    </div>

    <!-- ErrorData Overlay -->
    <div class="errordata-overlay" id="errordataOverlay">
        <div class="error-icon">
            <i class="bi bi-x-lg"></i>
        </div>
        <h2 class="errordata-title">ข้อมูลไม่ถูกต้อง</h2>
        <p class="error-message" id="errordataMessage">
            กรุณาลองใหม่อีกครั้ง
        </p>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="./js/js.js"></script>
</body>

</html>
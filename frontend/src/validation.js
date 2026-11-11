/**
 * Gökçe Hilal Akademi Mağazası - Merkezi Validasyon Motoru
 * Hocanın isteği doğrultusunda tüm form girişleri tek bir merkezden doğrulanır.
 */

export const validateForm = {
    // 1. GİRİŞ FORMU DOĞRULAMA (Login)
    login(email, pass, check) {
        const errors = { email: "", pass: "", check: "", general: "" };
        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(String(email).trim())) {
            errors.email = "Lütfen geçerli bir e-posta adresi giriniz.";
            isValid = false;
        }

        if (!pass || String(pass).length < 6) {
            errors.pass = "Şifreniz en az 6 karakter olmalıdır.";
            isValid = false;
        }

        if (!check) {
            errors.check = "Lütfen robot olmadığınızı doğrulayınız.";
            isValid = false;
        }

        return { isValid, errors };
    },

    // 2. KAYIT FORMU DOĞRULAMA (Register)
    register(userRow, pass, repeatPass) {
        const errors = { firstName: "", lastName: "", email: "", tel: "", pass: "", repeatPass: "", check: "" };
        let isValid = true;

        if (!userRow.firstName || userRow.firstName.trim().length < 2) {
            errors.firstName = "Adınız en az 2 karakter olmalıdır.";
            isValid = false;
        }

        if (!userRow.lastName || userRow.lastName.trim().length < 2) {
            errors.lastName = "Soyadınız en az 2 karakter olmalıdır.";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userRow.email || !emailRegex.test(String(userRow.email).trim())) {
            errors.email = "Lütfen geçerli bir e-posta adresi giriniz.";
            isValid = false;
        }

        const telClean = String(userRow.tel || "").replace(/\s+/g, '');
        const telRegex = /^5[0-9]{9}$/;
        if (!telClean || !telRegex.test(telClean)) {
            errors.tel = "Telefon numarası başında 0 olmadan 10 hane olmalıdır (Örn: 5xx...).";
            isValid = false;
        }

        if (!pass || String(pass).length < 6) {
            errors.pass = "Parolanız en az 6 karakterden oluşmalıdır.";
            isValid = false;
        }

        if (pass !== repeatPass) {
            errors.repeatPass = "Girdiğiniz parolalar birbiriyle eşleşmiyor.";
            isValid = false;
        }

        if (!userRow.check) {
            errors.check = "Lütfen şartları onaylayın.";
            isValid = false;
        }

        return { isValid, errors };
    },

    // 3. İLETİŞİM FORMU DOĞRULAMA (Contact)
    contact(name, email, message) {
        const errors = { name: "", email: "", message: "" };
        let isValid = true;

        if (!name || name.trim().length < 3) {
            errors.name = "Lütfen adınızı ve soyadınızı giriniz.";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(String(email).trim())) {
            errors.email = "Lütfen geçerli bir e-posta adresi giriniz.";
            isValid = false;
        }

        if (!message || message.trim().length < 10) {
            errors.message = "Mesajınız en az 10 karakterden oluşmalıdır.";
            isValid = false;
        }

        return { isValid, errors };
    },

    // 4. ÖDEME FORMU DOĞRULAMA (Checkout) - Sizin Dizi Yapınızla %100 Senkronize
    checkout(orderArray) {
        const errors = { firstName: "", lastName: "", TC: "", email: "", phone: "", address: "", zip: "" };
        let isValid = true;

        // Vue'da dizinin ilk elemanına güvenle erişmek için koruma katmanı
        const data = Array.isArray(orderArray) ? orderArray[0] : orderArray;

        if (!data) {
            return { isValid: false, errors };
        }

        if (!data.firstName || data.firstName.trim().length < 2) {
            errors.firstName = "Ad alanı boş bırakılamaz.";
            isValid = false;
        }

        if (!data.lastName || data.lastName.trim().length < 2) {
            errors.lastName = "Soyad alanı boş bırakılamaz.";
            isValid = false;
        }

        const tcClean = String(data.TC || "").trim();
        if (tcClean.length !== 11 || !/^\d+$/.test(tcClean)) {
            errors.TC = "TC Kimlik Numarası tam 11 haneli rakamlardan oluşmalıdır.";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(String(data.email).trim())) {
            errors.email = "Geçerli bir e-posta adresi gereklidir.";
            isValid = false;
        }

        if (!data.phone || data.phone.trim().length < 10) {
            errors.phone = "Geçerli bir telefon numarası giriniz.";
            isValid = false;
        }

        if (!data.address || data.address.trim().length < 10) {
            errors.address = "Lütfen detaylı teslimat adresinizi giriniz.";
            isValid = false;
        }

        return { isValid, errors };
    }
};

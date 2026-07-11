import Swal from "sweetalert2";
import { isValidEmail } from "./validation";

export const validateLogin = (email, password) => {
    if (!email || !password) {
        Swal.fire({
            icon: "warning",
            title: "Form belum lengkap",
            text: "Email dan password wajib diisi",
        });
        return false;
    }

    if (!isValidEmail(email)) {
        Swal.fire({
            icon: "warning",
            title: "Email tidak valid",
            text: "Masukkan format email yang benar (contoh: user@email.com)",
        });
        return false;
    }

    return true;
};

export const handleSuccessfulLogin = ({
    user,
    remember,
    login,
    navigate,
}) => {
    login(user);

    if (!user.email_verified_at) {
        navigate("/email-verification");
        return;
    }

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("isLoggedIn", "true");

    switch (user.role) {
        case "super_admin":
            navigate("/superadmin/dashboard");
            break;

        case "admin":
            navigate("/admin/dashboard");
            break;

        default:
            navigate("/home");
    }
};
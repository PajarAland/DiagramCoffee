/// <reference types="vitest" />
/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import Register from "../pages/public/Register.jsx";
import API from "../services/api.js";
import Swal from "sweetalert2";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../services/api.js", () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

describe("Register Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("menampilkan halaman register", () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

    expect(
        screen.getByText(/register/i)
    ).toBeInTheDocument();

    expect(
        screen.getByPlaceholderText(/masukkan nama/i)
    ).toBeInTheDocument();

    expect(
        screen.getByPlaceholderText(/masukkan email/i)
    ).toBeInTheDocument();

    expect(
        screen.getByPlaceholderText(/^masukkan password$/i)
    ).toBeInTheDocument();

    expect(
        screen.getByRole("button", {
            name: /buat akun/i,
        })
    ).toBeInTheDocument();
});

    test("menampilkan warning jika field kosong", async () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /buat akun/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "warning",
                    title: "Form belum lengkap",
                })
            );
        });

        expect(API.post).not.toHaveBeenCalled();
    });

    test("email field hanya menerima format email valid", () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText(/masukkan email/i);
        fireEvent.change(emailInput, { target: { value: "email-salah" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan nama/i), { target: { value: "Dimitri" } });
        fireEvent.change(screen.getByPlaceholderText(/^masukkan password$/i), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByPlaceholderText(/konfirmasi password/i), { target: { value: "Password123!" } });

        fireEvent.click(screen.getByRole("button", { name: /buat akun/i }));

        expect(emailInput.validity.valid).toBe(false);
        expect(API.post).not.toHaveBeenCalled();
    });

    test("menampilkan warning jika password kurang dari 8 karakter", async () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan nama/i), { target: { value: "Dimitri" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/^masukkan password$/i), { target: { value: "123" } });
        fireEvent.change(screen.getByPlaceholderText(/konfirmasi password/i), { target: { value: "123" } });

        fireEvent.click(screen.getByRole("button", { name: /buat akun/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "warning",
                    title: "Password terlalu pendek",
                })
            );
        });

        expect(API.post).not.toHaveBeenCalled();
    });

    test("menampilkan warning jika konfirmasi password tidak cocok", async () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan nama/i), { target: { value: "Dimitri" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/^masukkan password$/i), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByPlaceholderText(/konfirmasi password/i), { target: { value: "PasswordSalah" } });

        fireEvent.click(screen.getByRole("button", { name: /buat akun/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "warning",
                    title: "Password tidak cocok",
                })
            );
        });

        expect(API.post).not.toHaveBeenCalled();
    });

    test("mengirim request register ke API", async () => {
        API.post.mockResolvedValueOnce({ data: { success: true } });

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan nama/i), { target: { value: "Dimitri" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/^masukkan password$/i), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByPlaceholderText(/konfirmasi password/i), { target: { value: "Password123!" } });

        fireEvent.click(screen.getByRole("button", { name: /buat akun/i }));

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith(
                "/api/register",
                {
                    name: "Dimitri",
                    email: "user@gmail.com",
                    password: "Password123!",
                    password_confirmation: "Password123!",
                }
            );
        });
    });

    test("menampilkan success message setelah register berhasil", async () => {
        API.post.mockResolvedValueOnce({ data: { success: true } });

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan nama/i), { target: { value: "Dimitri" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/^masukkan password$/i), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByPlaceholderText(/konfirmasi password/i), { target: { value: "Password123!" } });

        fireEvent.click(screen.getByRole("button", { name: /buat akun/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "success",
                    title: "Registrasi berhasil",
                })
            );
        });
    });

    test("redirect ke login setelah register berhasil", async () => {
        API.post.mockResolvedValueOnce({ data: { success: true } });

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan nama/i), { target: { value: "Dimitri" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/^masukkan password$/i), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByPlaceholderText(/konfirmasi password/i), { target: { value: "Password123!" } });

        fireEvent.click(screen.getByRole("button", { name: /buat akun/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    test("menampilkan validation error dari backend", async () => {
        API.post.mockRejectedValueOnce({
            response: {
                data: {
                    errors: { email: ["Email sudah digunakan"] },
                },
            },
        });

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan nama/i), { target: { value: "Dimitri" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/^masukkan password$/i), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByPlaceholderText(/konfirmasi password/i), { target: { value: "Password123!" } });

        fireEvent.click(screen.getByRole("button", { name: /buat akun/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "error",
                    title: "Validasi Gagal",
                })
            );
        });
    });

    test("menampilkan generic error jika server gagal", async () => {
        API.post.mockRejectedValueOnce({
            response: {
                data: { message: "Server error" },
            },
        });

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan nama/i), { target: { value: "Dimitri" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/^masukkan password$/i), { target: { value: "Password123!" } });
        fireEvent.change(screen.getByPlaceholderText(/konfirmasi password/i), { target: { value: "Password123!" } });

        fireEvent.click(screen.getByRole("button", { name: /buat akun/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "error",
                    title: "Error",
                })
            );
        });
    });
});

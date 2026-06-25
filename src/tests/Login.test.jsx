/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import Login from "../pages/public/Login.jsx";
import API from "../services/api.js";
import Swal from "sweetalert2";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../context/useAuth.jsx", () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));

vi.mock("../services/api.js", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

describe("Login Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});

        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "";
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

        test("menampilkan halaman login", () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );

            expect(screen.getByText(/login/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/masukkan email/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/masukkan password/i)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /masuk/i })).toBeInTheDocument(); 
        });

        test("menampilkan warning jika email atau password kosong", async () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );

            fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

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

        test("email field hanya menerima format email valid", async () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );

            const emailInput = screen.getByPlaceholderText(/masukkan email/i);
            fireEvent.change(emailInput, { target: { value: "email-salah" } });
                
            fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
            fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

            expect(emailInput.validity.valid).toBe(false);
            expect(API.post).not.toHaveBeenCalled();
        });

        test("menampilkan warning jika email atau password salah", async () => {
            API.get.mockResolvedValueOnce({});
            API.post.mockRejectedValueOnce({
                response: { data: { message: "Email atau password salah" } },
            });

            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
            fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
            fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

            await waitFor(() => {
                expect(Swal.fire).toHaveBeenCalledWith(
                    expect.objectContaining({
                        icon: "error",
                        title: "Error",
                    })
                );
            });
        });

        test("memanggil csrf endpoint jika cookie belum tersedia", async () => {
            API.get.mockResolvedValueOnce({});
            API.post.mockResolvedValueOnce({
                data: { success: true, data: { role: "customer", email_verified_at: "2026-01-01" } },
            });

            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
            fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
            fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

            await waitFor(() => {
                expect(API.get).toHaveBeenCalledWith("/sanctum/csrf-cookie");
            });
        });

        test("mengirim request login ke API", async () => {
            API.get.mockResolvedValueOnce({});
            API.post.mockResolvedValueOnce({
                data: { success: true, data: { role: "customer", email_verified_at: "2026-01-01" } },
            });

            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
            fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
            fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

            await waitFor(() => {
                expect(API.post).toHaveBeenCalledWith(
                    "/api/login",
                    {
                        email: "user@gmail.com",
                        password: "password123",
                        remember_me: false,
                    }
                );
            });
        });

        test("super admin diarahkan ke dashboard super admin", async () => {
            API.get.mockResolvedValueOnce({});
            API.post.mockResolvedValueOnce({
                data: { success: true, data: { role: "super_admin", email_verified_at: "2026-01-01" } },
            });

            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "superadmin@gmail.com" } });
            fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
            fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/superadmin/dashboard");
            });
        });

        test("admin diarahkan ke dashboard admin", async () => {
            API.get.mockResolvedValueOnce({});
            API.post.mockResolvedValueOnce({
                data: { success: true, data: { role: "admin", email_verified_at: "2026-01-01" } },
            });

            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "admin@gmail.com" } });
            fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
            fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard");
            });
        });

        test("customer diarahkan ke home", async () => {
            API.get.mockResolvedValueOnce({});
            API.post.mockResolvedValueOnce({
                data: { success: true, data: { role: "customer", email_verified_at: "2026-01-01" } },
            });

            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "customer@gmail.com" } });
            fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
            fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/home");
            });
        });


    test("button login disabled saat proses login berlangsung", async () => {

    API.get.mockResolvedValueOnce({});

    API.post.mockImplementation(
        () =>
            new Promise(() => {})
    );

    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    fireEvent.change(
        screen.getByPlaceholderText(/masukkan email/i),
        {
            target: {
                value: "user@gmail.com",
            },
        }
    );

    fireEvent.change(
        screen.getByPlaceholderText(/masukkan password/i),
        {
            target: {
                value: "password123",
            },
        }
    );

    fireEvent.click(
        screen.getByRole("button", {
            name: /masuk/i,
        })
    );

    await waitFor(() => {
        expect(
            screen.getByRole("button")
        ).toBeDisabled();
    });
});

    test("remember me menyimpan login ke localStorage", async () => {
        Storage.prototype.setItem = vi.fn();
        API.get.mockResolvedValueOnce({});
        API.post.mockResolvedValueOnce({
            data: { success: true, data: { role: "customer", email_verified_at: "2026-01-01" } },
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("checkbox"));
        fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalledWith("isLoggedIn", "true");
        });
    });

    test("tanpa remember me menyimpan login ke sessionStorage", async () => {
        Storage.prototype.setItem = vi.fn();
        API.get.mockResolvedValueOnce({});
        API.post.mockResolvedValueOnce({
            data: { success: true, data: { role: "customer", email_verified_at: "2026-01-01" } },
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

        await waitFor(() => {
            expect(sessionStorage.setItem).toHaveBeenCalledWith("isLoggedIn", "true");
        });
    });

    test("email belum verified diarahkan ke email verification", async () => {
        API.get.mockResolvedValueOnce({});
        API.post.mockResolvedValueOnce({
            data: { success: true, data: { role: "customer", email_verified_at: null } },
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan email/i), { target: { value: "user@gmail.com" } });
        fireEvent.change(screen.getByPlaceholderText(/masukkan password/i), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/email-verification");
        });
    });

    test("forgot password mengarah ke halaman forgot password", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const forgotPasswordLink = screen.getByRole("link", { name: /lupa password/i });            
        expect(forgotPasswordLink).toHaveAttribute( "href", "/forgot-password");
    });

    });
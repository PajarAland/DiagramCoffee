/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import ForgotPassword from "../pages/public/ForgotPassword";
import API from "../services/api";
import Swal from "sweetalert2";

// Mock API
vi.mock("../services/api", () => ({
    default: {
        post: vi.fn(),
    },
}));

// Mock Sweetalert2
vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

describe("ForgotPassword Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("menampilkan halaman forgot password", () => {
        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /lupa password/i })).toBeInTheDocument();
        expect(screen.getByText(/masukkan email akun anda untuk menerima link reset password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/masukkan email/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /kirim link reset/i })).toBeInTheDocument();
    });

    test("menampilkan warning jika email kosong", async () => {
        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /kirim link reset/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "warning",
                    title: "Email wajib diisi",
                })
            );
        });

        expect(API.post).not.toHaveBeenCalled();
    });

    test("mengirim request forgot password ke API", async () => {
        API.post.mockResolvedValueOnce({ data: { success: true } });

        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText(/masukkan email/i);
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        fireEvent.click(screen.getByRole("button", { name: /kirim link reset/i }));

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith("/api/forgot-password", {
                email: "test@example.com",
            });
        });
    });

    test("menampilkan success message setelah forgot password berhasil", async () => {
        API.post.mockResolvedValueOnce({ data: { success: true } });

        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText(/masukkan email/i);
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        fireEvent.click(screen.getByRole("button", { name: /kirim link reset/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "success",
                    title: "Berhasil",
                    text: "Link reset password berhasil dikirim",
                })
            );
        });

        expect(emailInput.value).toBe("");
    });

    test("menampilkan error message dari backend", async () => {
        API.post.mockRejectedValueOnce({
            response: {
                data: { message: "Email tidak terdaftar" },
            },
        });

        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText(/masukkan email/i);
        fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });

        fireEvent.click(screen.getByRole("button", { name: /kirim link reset/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "error",
                    title: "Gagal",
                    text: "Email tidak terdaftar",
                })
            );
        });
    });

    test("menampilkan generic error jika server gagal", async () => {
        API.post.mockRejectedValueOnce(new Error("Network Error"));

        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText(/masukkan email/i);
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        fireEvent.click(screen.getByRole("button", { name: /kirim link reset/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "error",
                    title: "Gagal",
                    text: "Terjadi kesalahan",
                })
            );
        });
    });

    test("menampilkan loading/disabled saat mengirim request", async () => {
        let resolveRequest;
        const pendingPromise = new Promise((resolve) => {
            resolveRequest = resolve;
        });
        API.post.mockReturnValueOnce(pendingPromise);

        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText(/masukkan email/i);
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        fireEvent.click(screen.getByRole("button", { name: /kirim link reset/i }));

        // Button should be disabled and show loading text
        const submitButton = screen.getByRole("button");
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent("Mengirim...");

        // Resolve request
        resolveRequest({ data: { success: true } });
    });
});

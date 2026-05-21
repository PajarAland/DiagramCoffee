/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, beforeEach } from "vitest";
import Checkout from "../pages/public/Checkout";
import API from "../services/api";

const mockNavigate = vi.fn();

vi.mock(
    "react-router-dom",
    async () => {

        const actual =
            await vi.importActual(
                "react-router-dom"
            );

        return {
            ...actual,
            useNavigate: () =>
                mockNavigate,
        };
    }
);

vi.mock("../services/api", () => ({
    default: {
        post: vi.fn(),
    },
}));

vi.mock("../context/useAuth", () => ({
    useAuth: () => ({
        user: null,
    }),
}));

vi.mock("../context/useBranch", () => ({
    useBranch: () => ({
        selectedBranch: 1,
    }),
}));

describe("Checkout Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        window.alert = vi.fn();
        delete window.location;

        window.location = {
            href: "",
        };
    });

    describe("Render Page", () => {
        test("menampilkan halaman checkout", () => {
            render(
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            );
            expect(screen.getByText(/checkout/i)).toBeInTheDocument();
            expect(screen.getByText(/ringkasan pembayaran/i)).toBeInTheDocument();
        });
    });

    describe("Cart Flow", () => {
        test("menampilkan item cart dari localStorage", async () => {
            localStorage.setItem(
                "cart",
                JSON.stringify([
                    {
                        id: 1,
                        name: "Americano",
                        base_price: 18000,
                        qty: 2,
                        image_url:
                            "americano.jpg",
                    },
                ])
            );

            render(
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            );

            expect(await screen.findByText("Americano")).toBeInTheDocument();
            expect(screen.getByText(/x2/i)).toBeInTheDocument();
        }
        );

        test("menghitung total pembayaran dengan benar", async () => {
            localStorage.setItem(
                "cart",
                JSON.stringify([
                    {
                        id: 1,
                        name: "Americano",
                        base_price: 20000,
                        qty: 2,
                        image_url:
                            "americano.jpg",
                    },
                ])
            );

            render(
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            );

            expect((await screen.findAllByText(/rp40\.000/i))[0]).toBeInTheDocument();
        }
        );
    });

    describe("Customer Input", () => {
        test("user dapat mengisi nama customer", () => {
            render(
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            );

            const input = screen.getByPlaceholderText(/nama/i);

            fireEvent.change(
                input,
                {
                    target: {
                        value:
                            "Dimitri",
                    },
                }
            );

            expect(input.value).toBe("Dimitri");
        }
        );
    });

    describe("Validation", () => {
        test("button bayar disabled jika cart kosong", () => {
            render(
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            );

            expect(screen.getByRole("button", { name: /bayar/i })).toBeDisabled();
        }
        );
    });

    describe("Checkout Flow", () => {
        test("checkout berhasil dan redirect ke xendit", async () => {
            localStorage.setItem(
                "cart",
                JSON.stringify([
                    {
                        id: 1,
                        branch_id: 1,
                        name:
                            "Americano",
                        base_price:
                            18000,
                        qty: 2,
                        image_url:
                            "americano.jpg",
                    },
                ])
            );

            API.post.mockResolvedValueOnce({
                data: {
                    data: {
                        xendit_invoice_url:
                            "https://xendit.test/invoice",
                    },
                },
            });

            render(
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            );

            fireEvent.change(
                screen.getByPlaceholderText(
                    /nama/i
                ),
                {
                    target: {
                        value:
                            "Dimitri",
                    },
                }
            );

            fireEvent.click(
                screen.getByRole(
                    "button",
                    {
                        name:
                            /bayar/i,
                    }
                )
            );

            await waitFor(() => {
                expect(API.post).toHaveBeenCalled();
            });

            expect(window.location.href).toBe("https://xendit.test/invoice");
        }
        );

        test("menampilkan alert jika checkout gagal", async () => {
            localStorage.setItem(
                "cart",
                JSON.stringify([
                    {
                        id: 1,
                        branch_id: 1,
                        name:
                            "Americano",
                        base_price:
                            18000,
                        qty: 1,
                        image_url:
                            "americano.jpg",
                    },
                ])
            );

            API.post.mockRejectedValueOnce({
                response: {
                    data: {
                        message:
                            "Checkout gagal",
                    },
                },
            });

            render(
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            );

            fireEvent.click(
                screen.getByRole(
                    "button",
                    {
                        name:
                            /bayar/i,
                    }
                )
            );

            expect(await screen.findByText(/memproses/i)).toBeInTheDocument();

            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith("Checkout gagal");
            });
        });
    });

    describe("Navigation", () => {

        test("tombol kembali memanggil navigate", () => {
            render(
                <MemoryRouter>
                    <Checkout />
                </MemoryRouter>
            );

            fireEvent.click(
                screen.getByText(
                    /kembali/i
                )
            );

            expect(mockNavigate).toHaveBeenCalledWith(-1);
        }
        );
    });
});
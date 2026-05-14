/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import Checkout from "../pages/Checkout";

// =====================================
// MOCK NAVIGATE
// =====================================
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// =====================================
// MOCK API
// =====================================
vi.mock("../services/api", () => ({
    default: {
        post: vi.fn(),
    },
}));

import API from "../services/api";

describe("Checkout Page (TDD)", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.clear();

        window.alert = vi.fn();

        delete window.location;

        window.location = {
            href: "",
        };
    });

    // =========================================
    // TC01 - Render Checkout Page
    // =========================================
    test("menampilkan halaman checkout", () => {

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(
            screen.getByText(/checkout/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/payment summary/i)
        ).toBeInTheDocument();
    });

    // =========================================
    // TC02 - Load Cart From LocalStorage
    // =========================================
    test("menampilkan item cart dari localStorage", async () => {

        localStorage.setItem(
            "cart",
            JSON.stringify([
                {
                    id: 1,
                    name: "Americano",
                    price: 18000,
                    qty: 2,
                    image_url: "americano.jpg",
                },
            ])
        );

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(
            await screen.findByText("Americano")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/qty: 2/i)
        ).toBeInTheDocument();
    });

    // =========================================
    // TC03 - Total Calculation
    // =========================================
    test("menghitung total pembayaran dengan benar", async () => {

        localStorage.setItem(
            "cart",
            JSON.stringify([
                {
                    id: 1,
                    name: "Americano",
                    price: 20000,
                    qty: 2,
                    image_url: "americano.jpg",
                },
            ])
        );

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(/40\.000/i)
        ).toBeInTheDocument();
    });

    // =========================================
    // TC04 - Customer Input
    // =========================================
    test("user dapat mengisi nama customer", async () => {

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText(
            /nama customer/i
        );

        fireEvent.change(input, {
            target: {
                value: "Dimitri",
            },
        });

        expect(input.value)
            .toBe("Dimitri");
    });

    // =========================================
    // TC05 - Empty Cart Alert
    // =========================================
    test("menampilkan alert jika cart kosong", () => {

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/bayar sekarang/i)
        );

        expect(window.alert)
            .toHaveBeenCalledWith("Cart kosong");
    });

    // =========================================
    // TC06 - Successful Checkout
    // =========================================
    test("checkout berhasil dan redirect ke xendit", async () => {

        localStorage.setItem(
            "cart",
            JSON.stringify([
                {
                    id: 1,
                    branch_id: 1,
                    name: "Americano",
                    price: 18000,
                    qty: 2,
                    image_url: "americano.jpg",
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
                /nama customer/i
            ),
            {
                target: {
                    value: "Dimitri",
                },
            }
        );

        fireEvent.click(
            screen.getByText(/bayar sekarang/i)
        );

        expect(API.post)
            .toHaveBeenCalled();

        expect(window.location.href)
            .toBe("https://xendit.test/invoice");
    });

    // =========================================
    // TC07 - API Error Alert
    // =========================================
    test("menampilkan alert jika checkout gagal", async () => {

        localStorage.setItem(
            "cart",
            JSON.stringify([
                {
                    id: 1,
                    branch_id: 1,
                    name: "Americano",
                    price: 18000,
                    qty: 1,
                    image_url: "americano.jpg",
                },
            ])
        );

        API.post.mockRejectedValueOnce({
            response: {
                data: {
                    message: "Checkout gagal",
                },
            },
        });

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/bayar sekarang/i)
        );

        expect(
            await screen.findByText(/processing/i)
        ).toBeInTheDocument();

        expect(window.alert)
            .toHaveBeenCalledWith(
                "Checkout gagal"
            );
    });

    // =========================================
    // TC08 - Back Button
    // =========================================
    test("tombol kembali memanggil navigate", () => {

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/kembali/i)
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith(-1);
    });

});
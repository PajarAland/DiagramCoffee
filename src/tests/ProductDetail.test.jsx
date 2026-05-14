/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import ProductDetail from "../pages/ProductDetail";

// ===============================
// MOCK ROUTER
// ===============================
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({
            id: "1",
        }),
    };
});

// ===============================
// MOCK API
// ===============================
vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

// ===============================
// MOCK MENUCARD
// ===============================
vi.mock("../components/ui/MenuCard.jsx", () => ({
    default: ({ item }) => (
        <div data-testid="menu-card">
            {item.name}
        </div>
    ),
}));

import API from "../services/api";

describe("ProductDetail Page (TDD)", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.clear();

        window.alert = vi.fn();
    });

    // =========================================
    // TC01 - Loading State
    // =========================================
    test("menampilkan loading saat fetch data", () => {

        API.get.mockImplementation(
            () => new Promise(() => {})
        );

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        expect(
            screen.getByText(/loading/i)
        ).toBeInTheDocument();
    });

    // =========================================
    // TC02 - Render Product Detail
    // =========================================
    test("menampilkan detail produk dari API", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 1,
                        name: "Americano",
                        base_price: 18000,
                        description: "Kopi hitam",
                        image_url: "americano.jpg",
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        expect(
            await screen.findByText("Americano")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/kopi hitam/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/18\.000/i)
        ).toBeInTheDocument();
    });

    // =========================================
    // TC03 - Qty Increment
    // =========================================
    test("qty bertambah saat tombol plus diklik", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 1,
                        name: "Americano",
                        base_price: 18000,
                        description: "Kopi",
                        image_url: "americano.jpg",
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        await screen.findByText("Americano");

        const plusBtn = screen.getByText("+");

        fireEvent.click(plusBtn);

        expect(
            screen.getByText("2")
        ).toBeInTheDocument();
    });

    // =========================================
    // TC04 - Qty Decrement
    // =========================================
    test("qty berkurang saat tombol minus diklik", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 1,
                        name: "Americano",
                        base_price: 18000,
                        description: "Kopi",
                        image_url: "americano.jpg",
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        await screen.findByText("Americano");

        const plusBtn = screen.getByText("+");
        const minusBtn = screen.getByText("-");

        fireEvent.click(plusBtn);
        fireEvent.click(plusBtn);

        expect(screen.getByText("3"))
            .toBeInTheDocument();

        fireEvent.click(minusBtn);

        expect(screen.getByText("2"))
            .toBeInTheDocument();
    });

    // =========================================
    // TC05 - Qty Tidak Bisa < 1
    // =========================================
    test("qty tidak bisa kurang dari 1", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 1,
                        name: "Americano",
                        base_price: 18000,
                        description: "Kopi",
                        image_url: "americano.jpg",
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        await screen.findByText("Americano");

        const minusBtn = screen.getByText("-");

        fireEvent.click(minusBtn);

        expect(
            screen.getByText("1")
        ).toBeInTheDocument();
    });

    // =========================================
    // TC06 - Add To Cart
    // =========================================
    test("item berhasil ditambahkan ke cart", async () => {

        Storage.prototype.setItem = vi.fn();

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 1,
                        name: "Americano",
                        base_price: 18000,
                        description: "Kopi",
                        image_url: "americano.jpg",
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        await screen.findByText("Americano");

        fireEvent.click(
            screen.getByText(/tambah ke keranjang/i)
        );

        expect(localStorage.setItem)
            .toHaveBeenCalled();

        expect(window.alert)
            .toHaveBeenCalledWith(
                "Berhasil ditambahkan ke keranjang"
            );
    });

    // =========================================
    // TC07 - Existing Cart Qty Update
    // =========================================
    test("qty item bertambah jika item sudah ada di cart", async () => {

        localStorage.setItem(
            "cart",
            JSON.stringify([
                {
                    id: 1,
                    qty: 1,
                },
            ])
        );

        Storage.prototype.setItem = vi.fn();

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 1,
                        name: "Americano",
                        base_price: 18000,
                        description: "Kopi",
                        image_url: "americano.jpg",
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        await screen.findByText("Americano");

        fireEvent.click(
            screen.getByText(/tambah ke keranjang/i)
        );

        expect(localStorage.setItem)
            .toHaveBeenCalled();
    });

    // =========================================
    // TC08 - Recommended Menu
    // =========================================
    test("menampilkan rekomendasi menu", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: {
                        id: 1,
                        name: "Americano",
                        base_price: 18000,
                        description: "Kopi",
                        image_url: "americano.jpg",
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [
                        {
                            id: 2,
                            name: "Latte",
                        },
                        {
                            id: 3,
                            name: "Cappuccino",
                        },
                    ],
                },
            });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        expect(
            await screen.findByText("Latte")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Cappuccino")
        ).toBeInTheDocument();
    });

    // =========================================
    // TC09 - Item Tidak Ditemukan
    // =========================================
    test("menampilkan pesan jika item tidak ditemukan", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: null,
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(/menu tidak ditemukan/i)
        ).toBeInTheDocument();
    });

});
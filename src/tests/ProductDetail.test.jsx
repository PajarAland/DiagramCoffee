/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, beforeEach } from "vitest";
import ProductDetail from "../pages/public/ProductDetail";
import API from "../services/api";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "1" }),
    };
});

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

vi.mock("../context/useBranch", () => ({
    useBranch: () => ({
        selectedBranch: 1,
    }),
}));

vi.mock("../components/ui/MenuCard.jsx", () => ({
    default: ({ item }) => <div data-testid="menu-card">{item.name}</div>,
}));

describe("ProductDetail Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe("Loading State", () => {
        test("menampilkan loading saat fetch data", () => {
            API.get.mockImplementation(() => new Promise(() => { }));
            render(
                <MemoryRouter>
                    <ProductDetail />
                </MemoryRouter>
            );
            expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });
    });

    describe("Product Detail", () => {
        test("menampilkan detail produk dari API", async () => {
            API.get
                .mockResolvedValueOnce({
                    data: { data: { id: 1, name: "Americano", base_price: 18000, final_price: 18000, description: "Kopi hitam", image_url: "americano.jpg" } },
                })
                .mockResolvedValueOnce({
                    data: { data: { hybrid: [], popularity: [] } },
                });

            render(
                <MemoryRouter>
                    <ProductDetail />
                </MemoryRouter>
            );

            expect(await screen.findByText("Americano")).toBeInTheDocument();
            expect(screen.getByText(/kopi hitam/i)).toBeInTheDocument();
            expect(screen.getAllByText(/rp18\.000/i)[0]).toBeInTheDocument();
        });
    });

    describe("Quantity Selector", () => {
        test("qty bertambah saat tombol plus diklik", async () => {
            API.get
                .mockResolvedValueOnce({
                    data: { data: { id: 1, name: "Americano", base_price: 18000, final_price: 18000, description: "Kopi", image_url: "americano.jpg" } },
                })
                .mockResolvedValueOnce({
                    data: { data: { hybrid: [], popularity: [] } },
                });

            render(
                <MemoryRouter>
                    <ProductDetail />
                </MemoryRouter>
            );

            await screen.findByText("Americano");
            fireEvent.click(screen.getByText("+"));
            expect(screen.getByText("2")).toBeInTheDocument();
        });

        test("qty berkurang saat tombol minus diklik", async () => {
            API.get
                .mockResolvedValueOnce({
                    data: { data: { id: 1, name: "Americano", base_price: 18000, final_price: 18000, description: "Kopi", image_url: "americano.jpg" } },
                })
                .mockResolvedValueOnce({
                    data: { data: { hybrid: [], popularity: [] } },
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
            expect(screen.getByText("3")).toBeInTheDocument();
            fireEvent.click(minusBtn);
            expect(screen.getByText("2")).toBeInTheDocument();
        });

        test("qty tidak bisa kurang dari 1", async () => {
            API.get
                .mockResolvedValueOnce({
                    data: { data: { id: 1, name: "Americano", base_price: 18000, final_price: 18000, description: "Kopi", image_url: "americano.jpg" } },
                })
                .mockResolvedValueOnce({
                    data: { data: { hybrid: [], popularity: [] } },
                });

            render(
                <MemoryRouter>
                    <ProductDetail />
                </MemoryRouter>
            );

            await screen.findByText("Americano");
            fireEvent.click(screen.getByText("-"));
            expect(screen.getByText("1")).toBeInTheDocument();
        });
    });

    describe("Cart Flow", () => {
        test("item berhasil ditambahkan ke cart", async () => {
            Storage.prototype.setItem = vi.fn();
            API.get
                .mockResolvedValueOnce({
                    data: { data: { id: 1, name: "Americano", base_price: 18000, final_price: 18000, description: "Kopi", image_url: "americano.jpg" } },
                })
                .mockResolvedValueOnce({
                    data: { data: { hybrid: [], popularity: [] } },
                });

            render(
                <MemoryRouter>
                    <ProductDetail />
                </MemoryRouter>
            );

            await screen.findByText("Americano");
            fireEvent.click(screen.getByText(/tambah ke keranjang/i));
            await waitFor(() => {
                expect(localStorage.setItem).toHaveBeenCalled();
            });
            expect(await screen.findByText(/berhasil ditambahkan/i)).toBeInTheDocument();
        });

        test("qty item bertambah jika item sudah ada di cart", async () => {
            localStorage.setItem("cart", JSON.stringify([{ id: 1, qty: 1 }]));
            Storage.prototype.setItem = vi.fn();
            API.get
                .mockResolvedValueOnce({
                    data: { data: { id: 1, name: "Americano", base_price: 18000, final_price: 18000, description: "Kopi", image_url: "americano.jpg" } },
                })
                .mockResolvedValueOnce({
                    data: { data: { hybrid: [], popularity: [] } },
                });

            render(
                <MemoryRouter>
                    <ProductDetail />
                </MemoryRouter>
            );

            await screen.findByText("Americano");
            fireEvent.click(screen.getByText(/tambah ke keranjang/i));
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });

    describe("Recommendation Section", () => {
        test("menampilkan rekomendasi menu", async () => {
            API.get
                .mockResolvedValueOnce({
                    data: { data: { id: 1, name: "Americano", base_price: 18000, final_price: 18000, description: "Kopi", image_url: "americano.jpg" } },
                })
                .mockResolvedValueOnce({
                    data: { data: { hybrid: [{ id: 2, name: "Latte" }, { id: 3, name: "Cappuccino" }] } },
                });

            render(
                <MemoryRouter>
                    <ProductDetail />
                </MemoryRouter>
            );

            expect(await screen.findByText(/sering dipesan bersama/i)).toBeInTheDocument();
            expect(screen.getByText("Latte")).toBeInTheDocument();
            expect(screen.getByText("Cappuccino")).toBeInTheDocument();
        });

        test("menampilkan empty recommendation", async () => {
            API.get
                .mockResolvedValueOnce({
                    data: { data: { id: 1, name: "Americano", base_price: 18000, final_price: 18000, description: "Kopi", image_url: "americano.jpg" } },
                })
                .mockResolvedValueOnce({
                    data: { data: { hybrid: [], popularity: [] } },
                });

            render(
                <MemoryRouter>
                    <ProductDetail />
                </MemoryRouter>
            );

            expect(await screen.findByText(/belum ada rekomendasi/i)).toBeInTheDocument();
        });
    });

    describe("Not Found State", () => {
        test("menampilkan pesan jika item tidak ditemukan", async () => {
            API.get
                .mockResolvedValueOnce({
                    data: { data: null },
                })
                .mockResolvedValueOnce({
                    data: { data: { hybrid: [], popularity: [] } },
                });

            render(
                <MemoryRouter>
                    <ProductDetail />
                </MemoryRouter>
            );

            expect(await screen.findByText(/menu tidak ditemukan/i)).toBeInTheDocument();
        });
    });
});
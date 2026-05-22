import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import OrderStatus from "../pages/public/OrderStatus";
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
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe("OrderStatus Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPage = () => {
        return render(
            <MemoryRouter initialEntries={["/orders/status/ORD-001"]}>
                <Routes>
                    <Route path="/orders/status/:orderNumber" element={<OrderStatus />} />
                </Routes>
            </MemoryRouter>
        );
    };

    test("renders loading state", () => {
        API.get.mockImplementation(() => new Promise(() => { }));
        renderPage();
        expect(document.querySelector(".animate-spin")).toBeInTheDocument();
        expect(screen.getByText(/memuat status pesanan/i)).toBeInTheDocument();
    });

    test("renders pending order", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "pending",
                    payment_method: "xendit",
                    payment_status: "pending",
                    total_amount: 18000,
                    created_at: "2026-05-21T10:00:00.000000Z",
                    branch: { name: "Cabang Bandung" },
                    items: [
                        { id: 1, menu_item_name: "Cappuccino", quantity: 2, unit_price: 9000, subtotal: 18000 },
                    ],
                },
            },
        });

        renderPage();
        expect(await screen.findByText(/menunggu pembayaran/i)).toBeInTheDocument();
        expect(screen.getByText("Cappuccino")).toBeInTheDocument();
        expect(screen.getByText(/xendit/i)).toBeInTheDocument();
    });

    test("renders completed order", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "completed",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 25000,
                    created_at: "2026-05-21T10:00:00.000000Z",
                    branch: { name: "Cabang Jakarta" },
                    items: [],
                },
            },
        });

        renderPage();
        expect(await screen.findByText(/pesanan selesai/i)).toBeInTheDocument();
        expect(screen.getByText(/terima kasih/i)).toBeInTheDocument();
    });

    test("renders cancelled order", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "cancelled",
                    payment_method: "cash",
                    payment_status: "failed",
                    total_amount: 10000,
                    created_at: "2026-05-21T10:00:00.000000Z",
                    branch: { name: "Cabang Bogor" },
                    items: [],
                },
            },
        });

        renderPage();
        expect(await screen.findByText(/pesanan dibatalkan/i)).toBeInTheDocument();
    });

    test("renders order items", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "confirmed",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 36000,
                    created_at: "2026-05-21T10:00:00.000000Z",
                    branch: { name: "Cabang Depok" },
                    items: [
                        { id: 1, menu_item_name: "Americano", quantity: 2, unit_price: 18000, subtotal: 36000 },
                    ],
                },
            },
        });

        renderPage();
        expect(await screen.findByText("Americano")).toBeInTheDocument();
        expect(screen.getByText(/@rp 18\.000/i)).toBeInTheDocument();
        expect(screen.getAllByText(/rp 36\.000/i).length).toBeGreaterThan(0);
    });

    test("renders notes section", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "confirmed",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 20000,
                    notes: "Jangan terlalu manis",
                    created_at: "2026-05-21T10:00:00.000000Z",
                    branch: { name: "Cabang Bekasi" },
                    items: [],
                },
            },
        });

        renderPage();
        expect(await screen.findByText(/catatan/i)).toBeInTheDocument();
        expect(screen.getByText(/jangan terlalu manis/i)).toBeInTheDocument();
    });

    test("lanjutkan pembayaran membuka xendit invoice", async () => {
        window.open = vi.fn();
        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    id: 1,
                    order_number: "ORD-001",
                    status: "pending",
                    payment_method: "xendit",
                    payment_status: "unpaid",
                    xendit_invoice_url:
                        "https://xendit.co/invoice/123",
                    total_amount: 18000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Bandung"
                    },
                    items: [],
                },
            },
        });
        renderPage();
        const payButton = await screen.findByText(/lanjutkan pembayaran/i);
        fireEvent.click(payButton);

        expect(window.open)
            .toHaveBeenCalledWith(
                "https://xendit.co/invoice/123",
                "_blank"
            );
    });

    test("cancel order memanggil endpoint cancel", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    id: 1,
                    order_number: "ORD-001",
                    status: "pending",
                    payment_method: "cash",
                    payment_status: "unpaid",
                    total_amount: 18000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Bandung"
                    },
                    items: [],
                },
            },
        });

        API.post.mockResolvedValueOnce({
            data: {
                success: true,
            },
        });

        renderPage();

        const cancelButton =
            await screen.findByText(
                /batalkan pesanan/i
            );

        fireEvent.click(
            cancelButton
        );

        expect(API.post)
            .toHaveBeenCalledWith(
                "/api/orders/1/cancel"
            );
    });

    test("shows error state when API fails", async () => {
        API.get.mockReset();
        API.get.mockRejectedValueOnce({
            response: {
                data: {
                    message:
                        "Pesanan tidak ditemukan",
                },
            },
        });

        renderPage();
        expect(await screen.findByText(/terjadi kesalahan/i)).toBeInTheDocument();
        expect(screen.getByText(/pesanan tidak ditemukan/i)).toBeInTheDocument();
    });

    test("navigate back home works", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "completed",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 10000,
                    created_at: "2026-05-21T10:00:00.000000Z",
                    branch: { name: "Cabang Tangerang" },
                    items: [],
                },
            },
        });

        renderPage();
        fireEvent.click(await screen.findByText(/kembali ke home/i));
        expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
});
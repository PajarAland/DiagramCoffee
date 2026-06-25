import { describe, test, expect, vi, beforeEach ,afterEach} from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import OrderStatus from "../pages/public/OrderStatus";
import API from "../services/api";
import Swal from "sweetalert2";

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

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

describe("OrderStatus Page", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(console, "error")
            .mockImplementation(() => {});
        
            Object.defineProperty(
    window,
    "location",
    {
        writable: true,
        value: {
            reload: vi.fn(),
        },
    }
);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const renderPage = () => {
        return render(
            <MemoryRouter
                initialEntries={[
                    "/orders/status/ORD-001",
                ]}
            >
                <Routes>
                    <Route
                        path="/orders/status/:orderNumber"
                        element={<OrderStatus />}
                    />
                </Routes>
            </MemoryRouter>
        );
    };

    test("render OrderStatus page", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "pending",
                    payment_method: "xendit",
                    payment_status: "unpaid",
                    total_amount: 18000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Bandung",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                /nomor pesanan/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /payment status/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan detail order sesuai fetch", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "confirmed",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 36000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Jakarta",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                "#ORD-001"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /cash/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /cabang jakarta/i
            )
        ).toBeInTheDocument();

    });

    test("jika payment status unpaid maka menampilkan status menunggu pembayaran", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "pending",
                    payment_method: "xendit",
                    payment_status: "unpaid",
                    total_amount: 18000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Bandung",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                /menunggu pembayaran/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /selesaikan pembayaran/i
            )
        ).toBeInTheDocument();

    });

    test("jika payment status paid maka menampilkan status pembayaran dikonfirmasi", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "confirmed",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 25000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Bogor",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                /pembayaran dikonfirmasi/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /akan segera diproses/i
            )
        ).toBeInTheDocument();

    });

    test("jika status preparing maka menampilkan status sedang disiapkan", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "preparing",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 30000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Bekasi",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                /sedang disiapkan/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /barista kami sedang menyiapkan/i
            )
        ).toBeInTheDocument();

    });

    test("jika status ready maka menampilkan status pesanan siap diambil", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "ready",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 30000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Tangerang",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                /pesanan siap diambil/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /silakan ambil di kasir/i
            )
        ).toBeInTheDocument();

    });

    test("jika status completed maka menampilkan status pesanan selesai", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "completed",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 18000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Depok",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                /pesanan selesai/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /selamat menikmati/i
            )
        ).toBeInTheDocument();

    });

    
    test("menampilkan detail item pesanan", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "confirmed",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 36000,
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Bandung",
                    },
                    items: [
                        {
                            id: 1,
                            menu_item_name:
                                "Americano",
                            quantity: 2,
                            unit_price: 18000,
                            subtotal: 36000,
                        },
                    ],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                "Americano"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /@rp 18\.000/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan catatan pesanan", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: {
                    order_number: "ORD-001",
                    status: "confirmed",
                    payment_method: "cash",
                    payment_status: "paid",
                    total_amount: 20000,
                    notes:
                        "Jangan terlalu manis",
                    created_at:
                        "2026-05-21T10:00:00.000000Z",
                    branch: {
                        name: "Cabang Bekasi",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                /catatan/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /jangan terlalu manis/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan error ketika fetch order gagal", async () => {

        API.get.mockRejectedValueOnce({
            response: {
                data: {
                    message:
                        "Pesanan tidak ditemukan",
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                /terjadi kesalahan/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /pesanan tidak ditemukan/i
            )
        ).toBeInTheDocument();

    });

    test("jika pembayaran gagal maka menampilkan tombol lanjutkan pembayaran dan batalkan pesanan", async () => {

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
                        name: "Cabang Bandung",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        expect(
            await screen.findByText(
                /lanjutkan pembayaran/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /batalkan pesanan/i
            )
        ).toBeInTheDocument();

    });

    test("tombol lanjutkan pembayaran membuka invoice xendit", async () => {

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
                        name: "Cabang Bandung",
                    },
                    items: [],
                },
            },
        });

        renderPage();

        fireEvent.click(
            await screen.findByText(
                /lanjutkan pembayaran/i
            )
        );

        expect(window.open)
            .toHaveBeenCalledWith(
                "https://xendit.co/invoice/123",
                "_blank"
            );

    });

    test("tombol batalkan pesanan memanggil endpoint cancel", async () => {

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
                        name: "Cabang Bandung",
                    },
                    items: [],
                },
            },
        });

        Swal.fire.mockResolvedValueOnce({
            isConfirmed: true,
        });

        API.post.mockResolvedValueOnce({
            data: {
                success: true,
            },
        });

        renderPage();

        fireEvent.click(
            await screen.findByText(
                /batalkan pesanan/i
            )
        );

        expect(Swal.fire)
            .toHaveBeenCalled();

        await waitFor(() => {

    expect(API.post)
        .toHaveBeenCalledWith(
            "/api/orders/1/cancel"
        );

});

    });




});
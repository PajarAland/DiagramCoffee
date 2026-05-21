import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Riwayat from "../pages/user/Riwayat";
import API from "../services/api";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {

    const actual =
        await vi.importActual(
            "react-router-dom"
        );

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

describe("Riwayat Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders loading state", () => {
        API.get.mockImplementation(() => new Promise(() => { }));
        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );
        expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    test("renders orders from API", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    { id: 1, order_number: "ORD-001", status: "completed", payment_method: "cash", total_amount: 18000, items: [{ id: 1, menu_item_name: "Cappuccino", quantity: 2, subtotal: 18000 }] },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        expect(await screen.findByText("ORD-001")).toBeInTheDocument();
        expect(screen.getByText(/cappuccino/i)).toBeInTheDocument();
        expect((screen.getAllByText(/completed/i))[0]).toBeInTheDocument();
    });

    test("renders empty state", async () => {
        API.get.mockResolvedValueOnce({ data: { data: [] } });
        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        expect(await screen.findByText(/belum ada pesanan/i)).toBeInTheDocument();
        expect(screen.getByText(/pesanan kamu akan muncul di sini/i)).toBeInTheDocument();
    });

    test("filter completed orders works", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    { id: 1, order_number: "ORD-001", status: "completed", payment_method: "cash", total_amount: 18000, items: [] },
                    { id: 2, order_number: "ORD-002", status: "pending", payment_method: "xendit", total_amount: 20000, items: [] },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        await screen.findByText("ORD-001");
        fireEvent.click(screen.getAllByText(/completed/i)[0]);
        expect(screen.getByText("ORD-001")).toBeInTheDocument();
        expect(screen.queryByText("ORD-002")).not.toBeInTheDocument();
    });

    test("navigate to menu from empty state", async () => {
        API.get.mockResolvedValueOnce({ data: { data: [] } });
        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByText(/pesan sekarang/i));
        expect(mockNavigate).toHaveBeenCalledWith("/menu");
    });

    test("navigate to order detail", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    { id: 1, order_number: "ORD-001", status: "completed", payment_method: "cash", total_amount: 18000, items: [] },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByText(/lihat detail/i));
        expect(mockNavigate).toHaveBeenCalledWith("/orders/ORD-001");
    });

    test("renders formatted currency", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    { id: 1, order_number: "ORD-001", status: "completed", payment_method: "cash", total_amount: 18000, items: [{ id: 1, menu_item_name: "Cappuccino", quantity: 1, subtotal: 18000 }] },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        expect((await screen.findAllByText(/rp 18\.000/i)).length).toBeGreaterThan(0);
    });

    test("renders payment method", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    { id: 1, order_number: "ORD-001", status: "completed", payment_method: "xendit", total_amount: 18000, items: [] },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        expect(await screen.findByText(/xendit/i)).toBeInTheDocument();
    });
});
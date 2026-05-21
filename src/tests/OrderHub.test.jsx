import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Kasir from "../pages/admin/OrderHub";
import API from "../services/api";

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
    },
}));

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

const mockOrders = [
    {
        id: 1,
        order_number: "ORD-001",
        guest_name: "Dimitri",
        payment_method: "cash",
        payment_status: "unpaid",
        status: "pending",
        total_amount: 50000,
        notes: "Less sugar",
        items: [
            {
                id: 1,
                menu_item_name: "Cafe Latte",
                quantity: 2,
                subtotal: 50000,
            },
        ],
    },

    {
        id: 2,
        order_number: "ORD-002",
        guest_name: "Alan",
        payment_method: "xendit",
        payment_status: "paid",
        status: "confirmed",
        total_amount: 70000,
        notes: null,
        items: [
            {
                id: 2,
                menu_item_name: "Americano",
                quantity: 1,
                subtotal: 70000,
            },
        ],
    },

    {
        id: 3,
        order_number: "ORD-003",
        guest_name: "John",
        payment_method: "xendit",
        payment_status: "paid",
        status: "completed",
        total_amount: 40000,
        notes: null,
        items: [],
    },
];

describe("Kasir Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        API.get.mockResolvedValue({
            data: {
                data: mockOrders,
            },
        });
    });

    test("menampilkan loading state", () => {
        render(
            <Kasir />
        );
        expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });

    test("menampilkan title dashboard", async () => {
        render(
            <Kasir />
        );
        expect(await screen.findByText("Kasir Dashboard")).toBeInTheDocument();
    });

    test("menampilkan waiting payment section", async () => {
        render(
            <Kasir />
        );
        expect(await screen.findByText("Waiting Payment")).toBeInTheDocument();
        expect(await screen.findByText("ORD-001")).toBeInTheDocument();
    });

    test("menampilkan kitchen queue section", async () => {
        render(
            <Kasir />
        );
        expect(await screen.findByText("Kitchen Queue")).toBeInTheDocument();
        expect((await screen.findAllByText("ORD-002"))[0]).toBeInTheDocument();
    });

    test("menampilkan completed section", async () => {
        render(
            <Kasir />
        );
        const completedTab = await screen.findByRole("button", { name: /completed/i });
        fireEvent.click(completedTab);
        expect(await screen.findByText("ORD-003")).toBeInTheDocument();
        expect((await screen.findAllByText("Completed"))[0]).toBeInTheDocument();
        expect(await screen.findByText("ORD-003")).toBeInTheDocument();
    });

    test("search order bekerja", async () => {
        render(
            <Kasir />
        );
        const input = await screen.findByPlaceholderText("Cari order...");
        fireEvent.change(input, { target: { value: "ORD-002" } });
        expect((screen.getAllByText("ORD-002"))[0]).toBeInTheDocument();
        expect(screen.queryByText("ORD-001")).not.toBeInTheDocument();
    });

    test("klik order menampilkan detail", async () => {
        render(
            <Kasir />
        );
        const order = (await screen.findAllByText("ORD-002"))[0];
        fireEvent.click(order);
        expect(await screen.findByText("Americano")).toBeInTheDocument();
        expect(await screen.findByText("Payment Status")).toBeInTheDocument();
    });

    test("confirm cash memanggil endpoint", async () => {
        API.post.mockResolvedValue({ data: { success: true } });
        render(
            <Kasir />
        );
        const button = await screen.findByText("Confirm Cash");
        fireEvent.click(button);
        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith("/api/admin/orders/1/confirm-cash");
        });
    });

    test("confirmed order menampilkan tombol preparing", async () => {
        render(
            <Kasir />
        );
        const order = (await screen.findAllByText("ORD-002"))[0];
        fireEvent.click(order);
        expect(await screen.findByText("Start Preparing")).toBeInTheDocument();
    });

    test("update status preparing memanggil endpoint", async () => {
        API.put.mockResolvedValue({ data: { success: true } });
        render(
            <Kasir />
        );
        const order = (await screen.findAllByText("ORD-002"))[0];
        fireEvent.click(order);
        const button = await screen.findByText("Start Preparing");
        fireEvent.click(button);
        await waitFor(() => {
            expect(API.put).toHaveBeenCalledWith("/api/admin/orders/2/status", { status: "preparing" });
        });
    });

    test("menampilkan total order", async () => {
        render(
            <Kasir />
        );
        expect((await screen.findAllByText("Rp 70.000"))[0]).toBeInTheDocument();
    });

    test("menampilkan notes order", async () => {
        render(
            <Kasir />
        );
        const order = await screen.findByText("ORD-001");
        fireEvent.click(order);
        expect(await screen.findByText("Less sugar")).toBeInTheDocument();
    });

    test("menampilkan empty state jika tidak ada order", async () => {
        API.get.mockResolvedValue({ data: { data: [] } });
        render(
            <Kasir />
        );
        expect(await screen.findByText("Pilih order")).toBeInTheDocument();
    });
});
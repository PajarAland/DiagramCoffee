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

    test("menampilkan halaman riwayat", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(
                /riwayat pesanan/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /lihat semua pesanan kamu/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan riwayat orders dari API", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        order_number: "ORD-001",
                        status: "completed",
                        payment_method: "cash",
                        total_amount: 18000,
                        items: [
                            {
                                id: 1,
                                menu_item_name:
                                    "Cappuccino",
                                quantity: 2,
                                subtotal: 18000,
                            },
                        ],
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(
                "ORD-001"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /cappuccino/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan detail riwayat order", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        order_number: "ORD-001",
                        status: "completed",
                        payment_method: "xendit",
                        total_amount: 36000,
                        items: [
                            {
                                id: 1,
                                menu_item_name:
                                    "Americano",
                                quantity: 2,
                                subtotal: 36000,
                            },
                        ],
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(
                "ORD-001"
            )
        ).toBeInTheDocument();

        expect(
            screen.getAllByText(
                /completed/i
            ).length
        ).toBeGreaterThan(0);

        expect(
            screen.getByText(
                /xendit/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /americano/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getAllByText(
                /rp 36\.000/i
            ).length
        ).toBeGreaterThan(0);

    });

    test("memfilter tampilan order berdasarkan status", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        order_number: "ORD-001",
                        status: "completed",
                        payment_method: "cash",
                        total_amount: 18000,
                        items: [],
                    },
                    {
                        id: 2,
                        order_number: "ORD-002",
                        status: "pending",
                        payment_method: "xendit",
                        total_amount: 20000,
                        items: [],
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        await screen.findByText(
            "ORD-001"
        );

        fireEvent.click(
            screen.getAllByText(
                /completed/i
            )[0]
        );

        expect(
            screen.getByText(
                "ORD-001"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "ORD-002"
            )
        ).not.toBeInTheDocument();

    });

    test("filter pending menampilkan order pending", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        order_number: "ORD-001",
                        status: "pending",
                        payment_method: "cash",
                        total_amount: 18000,
                        items: [],
                    },
                    {
                        id: 2,
                        order_number: "ORD-002",
                        status: "completed",
                        payment_method: "cash",
                        total_amount: 20000,
                        items: [],
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        await screen.findByText(
            "ORD-001"
        );

        fireEvent.click(
            screen.getByRole(
                "button",
                {
                    name: /pending/i,
                }
            )
        );

        expect(
            screen.getByText(
                "ORD-001"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "ORD-002"
            )
        ).not.toBeInTheDocument();

    });

    test("filter confirmed menampilkan order confirmed", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        order_number: "ORD-001",
                        status: "confirmed",
                        payment_method: "cash",
                        total_amount: 18000,
                        items: [],
                    },
                    {
                        id: 2,
                        order_number: "ORD-002",
                        status: "pending",
                        payment_method: "cash",
                        total_amount: 20000,
                        items: [],
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        await screen.findByText(
            "ORD-001"
        );

        fireEvent.click(
            screen.getByRole(
                "button",
                {
                    name: /confirmed/i,
                }
            )
        );

        expect(
            screen.getByText(
                "ORD-001"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "ORD-002"
            )
        ).not.toBeInTheDocument();

    });

    test("filter completed menampilkan order completed", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        order_number: "ORD-001",
                        status: "completed",
                        payment_method: "cash",
                        total_amount: 18000,
                        items: [],
                    },
                    {
                        id: 2,
                        order_number: "ORD-002",
                        status: "pending",
                        payment_method: "cash",
                        total_amount: 20000,
                        items: [],
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        await screen.findByText(
            "ORD-001"
        );

        fireEvent.click(
            screen.getByRole(
                "button",
                {
                    name: /completed/i,
                }
            )
        );

        expect(
            screen.getByText(
                "ORD-001"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "ORD-002"
            )
        ).not.toBeInTheDocument();

    });

    test("lihat detail mengarah ke halaman order status", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        order_number: "ORD-001",
                        status: "completed",
                        payment_method: "cash",
                        total_amount: 18000,
                        items: [],
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Riwayat />
            </MemoryRouter>
        );

        fireEvent.click(
            await screen.findByText(
                /lihat detail/i
            )
        );

        expect(mockNavigate)
            .toHaveBeenCalledWith(
                "/orders/ORD-001"
            );

    });

    test("menampilkan loading state saat data riwayat dimuat", () => {

    API.get.mockImplementation(
        () => new Promise(() => {})
    );

    render(
        <MemoryRouter>
            <Riwayat />
        </MemoryRouter>
    );

    expect(
        document.querySelector(
            ".animate-pulse"
        )
    ).toBeInTheDocument();

});

test("menampilkan tanggal dan waktu pembelian", async () => {

    API.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    id: 1,
                    order_number: "ORD-001",
                    created_at: "2026-05-23T17:14:00",
                    status: "completed",
                    payment_method: "cash",
                    total_amount: 18000,
                    items: [],
                },
            ],
        },
    });

    render(
        <MemoryRouter>
            <Riwayat />
        </MemoryRouter>
    );

    expect(
    await screen.findByText(
        /23 mei 2026,\s+17\.14/i
    )
).toBeInTheDocument();

});

test("mencari order berdasarkan nomor pesanan", async () => {

    API.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    id: 1,
                    order_number: "ORD-001",
                    status: "completed",
                    payment_method: "cash",
                    total_amount: 18000,
                    items: [],
                },
                {
                    id: 2,
                    order_number: "ORD-002",
                    status: "pending",
                    payment_method: "cash",
                    total_amount: 20000,
                    items: [],
                },
            ],
        },
    });

    render(
        <MemoryRouter>
            <Riwayat />
        </MemoryRouter>
    );

    await screen.findByText(
        "ORD-001"
    );

    fireEvent.change(
        screen.getByPlaceholderText(
            /cari pesanan/i
        ),
        {
            target: {
                value: "ORD-001",
            },
        }
    );

    expect(
        screen.getByText(
            "ORD-001"
        )
    ).toBeInTheDocument();

    expect(
        screen.queryByText(
            "ORD-002"
        )
    ).not.toBeInTheDocument();

});



});
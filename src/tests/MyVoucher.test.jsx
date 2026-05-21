import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyVoucher from "../pages/user/MyVoucher";
import API from "../services/api";

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

describe("MyVoucher Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders loading state", () => {
        API.get.mockImplementation(() => new Promise(() => { }));
        render(
            <MemoryRouter>
                <MyVoucher />
            </MemoryRouter>
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test("renders vouchers from API", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        is_used: false,
                        expired_at:
                            "2099-12-31",
                        voucher: {
                            code: "DISC10K",
                            name: "Diskon 10K",
                            discount_amount: 10000,
                            min_transaction_amount:
                                50000,
                        },
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <MyVoucher />
            </MemoryRouter>
        );

        expect(await screen.findByText("DISC10K")).toBeInTheDocument();
        expect(screen.getByText(/diskon 10k/i)).toBeInTheDocument();
        expect(screen.getByText(/siap digunakan/i)).toBeInTheDocument();
    });

    test("renders empty state", async () => {
        API.get.mockResolvedValueOnce({ data: { data: [] } });
        render(
            <MemoryRouter>
                <MyVoucher />
            </MemoryRouter>
        );
        expect(await screen.findByText(/belum ada voucher/i)).toBeInTheDocument();
    });

    test("filters used vouchers", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        is_used: true,
                        expired_at:
                            "2099-12-31",
                        voucher: {
                            code: "USED10",
                            name: "Used Voucher",
                            discount_amount: 10000,
                            min_transaction_amount:
                                50000,
                        },
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <MyVoucher />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText("USED10")).not.toBeInTheDocument();
        });
    });

    test("filters expired vouchers", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        is_used: false,
                        expired_at:
                            "2020-01-01",
                        voucher: {
                            code: "EXP10",
                            name: "Expired Voucher",
                            discount_amount: 10000,
                            min_transaction_amount:
                                50000,
                        },
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <MyVoucher />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText("EXP10")).not.toBeInTheDocument();
        });
    });

    test("sorts vouchers by nearest expiry", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        is_used: false,
                        expired_at:
                            "2099-12-31",
                        voucher: {
                            code: "LAST",
                            name: "Last",
                            discount_amount: 10000,
                            min_transaction_amount:
                                50000,
                        },
                    },
                    {
                        id: 2,
                        is_used: false,
                        expired_at:
                            "2099-01-01",
                        voucher: {
                            code: "FIRST",
                            name: "First",
                            discount_amount: 10000,
                            min_transaction_amount:
                                50000,
                        },
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <MyVoucher />
            </MemoryRouter>
        );

        const vouchers = await screen.findAllByText(/first|last/i);
        expect(vouchers[0]).toHaveTextContent("FIRST");
    });

    test("API Error handling", async () => {
        API.get.mockRejectedValueOnce(new Error("API Error"));
        render(
            <MemoryRouter>
                <MyVoucher />
            </MemoryRouter>
        );
        expect(await screen.findByText(/belum ada voucher/i)).toBeInTheDocument();
    });

    test("renders formatted currency", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        is_used: false,
                        expired_at:
                            "2099-12-31",
                        voucher: {
                            code: "DISC10K",
                            name: "Diskon 10K",
                            discount_amount: 10000,
                            min_transaction_amount:
                                50000,
                        },
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <MyVoucher />
            </MemoryRouter>
        );

        expect(await screen.findByText(/rp 10\.000/i)).toBeInTheDocument();
        expect(screen.getByText(/rp 50\.000/i)).toBeInTheDocument();
    });
});
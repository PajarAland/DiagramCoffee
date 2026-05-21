import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Voucher from "../pages/user/Voucher";
import API from "../services/api";
import Swal from "sweetalert2";

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

describe("Voucher Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders loading state", () => {
        API.get.mockImplementation(() => new Promise(() => { }));
        render(
            <Voucher />
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test("renders vouchers from API", async () => {
        API.get
            .mockResolvedValueOnce({
                data: {
                    data: [
                        {
                            id: 1,
                            code: "DISC10K",
                            name: "Diskon 10K",
                            discount_amount: 10000,
                            min_transaction_amount: 50000,
                            points_required: 50,
                        },
                    ],
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: {
                        loyalty_points: 120,
                    },
                },
            });

        render(
            <Voucher />
        );

        expect(await screen.findByText("DISC10K")).toBeInTheDocument();
        expect(screen.getByText(/diskon 10k/i)).toBeInTheDocument();
        expect(screen.getByText(/50 pts/i)).toBeInTheDocument();
    });

    test("renders empty state", async () => {
        API.get
            .mockResolvedValueOnce({ data: { data: [] } })
            .mockResolvedValueOnce({ data: { data: { loyalty_points: 0 } } });

        render(
            <Voucher />
        );

        expect(await screen.findByText(/voucher tidak tersedia/i)).toBeInTheDocument();
    });

    test("button disabled if points insufficient", async () => {
        API.get
            .mockResolvedValueOnce({
                data: {
                    data: [
                        {
                            id: 1,
                            code: "DISC10K",
                            name: "Diskon 10K",
                            discount_amount: 10000,
                            min_transaction_amount: 50000,
                            points_required: 200,
                        },
                    ],
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: {
                        loyalty_points: 50,
                    },
                },
            });

        render(
            <Voucher />
        );

        const button = await screen.findByRole("button", { name: /poin tidak cukup/i });
        expect(button).toBeDisabled();
    });

    test("successful exchange calls API POST", async () => {
        Swal.fire
            .mockResolvedValueOnce({ isConfirmed: true })
            .mockResolvedValueOnce({});

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: [
                        {
                            id: 1,
                            code: "DISC10K",
                            name: "Diskon 10K",
                            discount_amount: 10000,
                            min_transaction_amount: 50000,
                            points_required: 50,
                        },
                    ],
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: {
                        loyalty_points: 200,
                    },
                },
            });

        API.post.mockResolvedValueOnce({
            data: {
                success: true,
            },
        });

        render(
            <Voucher />
        );

        fireEvent.click(await screen.findByRole("button", { name: /tukar voucher/i }));

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith("/api/vouchers/exchange", { voucher_id: 1 });
        });
    });

    test("exchange cancelled does not call API", async () => {
        Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
        API.get
            .mockResolvedValueOnce({
                data: {
                    data: [
                        {
                            id: 1,
                            code: "DISC10K",
                            name: "Diskon 10K",
                            discount_amount: 10000,
                            min_transaction_amount: 50000,
                            points_required: 50,
                        },
                    ],
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: {
                        loyalty_points: 200,
                    },
                },
            });

        render(
            <Voucher />
        );

        fireEvent.click(await screen.findByRole("button", { name: /tukar voucher/i }));

        await waitFor(() => {
            expect(API.post).not.toHaveBeenCalled();
        });
    });

    test("shows swal error when API fails", async () => {
        API.get.mockRejectedValueOnce(new Error("API Error"));
        render(
            <Voucher />
        );
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalled();
        });
    });

    test("renders loyalty points", async () => {
        API.get
            .mockResolvedValueOnce({ data: { data: [] } })
            .mockResolvedValueOnce({ data: { data: { loyalty_points: 150 } } });

        render(
            <Voucher />
        );

        expect(await screen.findByText("150")).toBeInTheDocument();
        expect(screen.getByText(/loyalty points/i)).toBeInTheDocument();
    });
});
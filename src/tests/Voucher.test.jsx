import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
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

        vi.spyOn(console, "error")
            .mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("menampilkan halaman voucher", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: {
                        loyalty_points: 0,
                    },
                },
            });

        render(
            <Voucher />
        );

        expect(
            await screen.findByText(
                /loyalty voucher/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /tukarkan poin loyalty/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan voucher dari API", async () => {

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

        expect(
            await screen.findByText(
                "DISC10K"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /diskon 10k/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan detail voucher", async () => {

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

        expect(
            await screen.findByText(
                "DISC10K"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /diskon 10k/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /rp 10\.000/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /rp 50\.000/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /50 pts/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan poin loyalty user", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: {
                        loyalty_points: 150,
                    },
                },
            });

        render(
            <Voucher />
        );

        expect(
            await screen.findByText(
                "150"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /loyalty points/i
            )
        ).toBeInTheDocument();

    });

    test("memunculkan konfirmasi sebelum redeem voucher", async () => {

        Swal.fire.mockResolvedValueOnce({
            isConfirmed: false,
        });

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

        fireEvent.click(
            await screen.findByRole(
                "button",
                {
                    name: /tukar voucher/i,
                }
            )
        );

        await waitFor(() => {

            expect(Swal.fire)
                .toHaveBeenCalledWith(
                    expect.objectContaining({
                        title:
                            "Tukar Voucher?",
                    })
                );

        });

        expect(API.post)
            .not.toHaveBeenCalled();

    });

    test("voucher berhasil ditukar", async () => {

        Swal.fire
            .mockResolvedValueOnce({
                isConfirmed: true,
            })
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

        fireEvent.click(
            await screen.findByRole(
                "button",
                {
                    name: /tukar voucher/i,
                }
            )
        );

        await waitFor(() => {

            expect(API.post)
                .toHaveBeenCalledWith(
                    "/api/vouchers/exchange",
                    {
                        voucher_id: 1,
                    }
                );

        });

        expect(Swal.fire)
            .toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "success",
                    title: "Berhasil",
                })
            );

    });

    test("memunculkan warning jika redeem voucher gagal", async () => {

        Swal.fire.mockResolvedValueOnce({
            isConfirmed: true,
        });

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

        API.post.mockRejectedValueOnce({
            response: {
                data: {
                    message:
                        "Gagal menukar voucher",
                },
            },
        });

        render(
            <Voucher />
        );

        fireEvent.click(
            await screen.findByRole(
                "button",
                {
                    name: /tukar voucher/i,
                }
            )
        );

        await waitFor(() => {

            expect(Swal.fire)
                .toHaveBeenCalledWith(
                    expect.objectContaining({
                        icon: "error",
                        title: "Gagal",
                    })
                );

        });

    });

    test("tombol tukar disabled jika poin tidak mencukupi", async () => {

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

        const button =
            await screen.findByRole(
                "button",
                {
                    name:
                        /poin tidak cukup/i,
                }
            );

        expect(button)
            .toBeDisabled();

    });

    test("menampilkan empty state jika voucher tidak tersedia", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: [],
                },
            })
            .mockResolvedValueOnce({
                data: {
                    data: {
                        loyalty_points: 0,
                    },
                },
            });

        render(
            <Voucher />
        );

        expect(
            await screen.findByText(
                /voucher tidak tersedia/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan loading state saat voucher dimuat", () => {

    API.get.mockImplementation(
        () => new Promise(() => {})
    );

    render(
        <Voucher />
    );

    expect(
        screen.getByText(
            /loading/i
        )
    ).toBeInTheDocument();

});

test("button berubah menjadi menukar saat proses redeem berlangsung", async () => {

    Swal.fire.mockResolvedValueOnce({
        isConfirmed: true,
    });

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

    API.post.mockImplementation(
        () => new Promise(() => {})
    );

    render(
        <Voucher />
    );

    fireEvent.click(
        await screen.findByRole(
            "button",
            {
                name: /tukar voucher/i,
            }
        )
    );

    expect(
        await screen.findByText(
            /menukar/i
        )
    ).toBeInTheDocument();

});

test("menampilkan error ketika gagal mengambil data voucher", async () => {

    API.get.mockRejectedValueOnce(
        new Error("Server Error")
    );

    render(
        <Voucher />
    );

    await waitFor(() => {

        expect(Swal.fire)
            .toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "error",
                    title: "Gagal",
                    text:
                        "Gagal mengambil data voucher",
                })
            );

    });

});

});
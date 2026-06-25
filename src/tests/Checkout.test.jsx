/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, beforeEach, afterEach } from "vitest";
import Checkout from "../pages/public/Checkout";
import API from "../services/api";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual, useNavigate: () => mockNavigate,
    };
});

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

const mockUser = {
    name: "Dimitri",
};

vi.mock("../context/useAuth", () => ({
    useAuth: () => ({
        user: mockUser,
    }),
}));

vi.mock("../context/useBranch", () => ({
    useBranch: () => ({
        selectedBranch: 1,
    }),
}));

describe("Checkout Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
        localStorage.clear();

        API.get.mockResolvedValue({
            data: {
                data: [],
            },
        });

        API.post.mockImplementation((url) => {
            if (url === "/api/orders/preview") {
                return Promise.resolve({
                    data: {
                        data: {
                            subtotal: "40000.00",
                            discount_total: "0.00",
                            fees: [
                                {
                                    key: "admin_fee",
                                    label: "Admin Fee",
                                    amount: "2000.00",
                                },
                            ],
                            total_amount: "42000.00",
                            voucher: null,
                        },
                    },
                });
            }

            return Promise.resolve({
                data: {
                    data: {},
                },
            });
        });

        window.alert = vi.fn();
        delete window.location;
        window.location = {
            href: "",
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("menampilkan halaman checkout", () => {
        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(screen.getByText(/checkout/i)).toBeInTheDocument();
        expect(screen.getByText(/ringkasan pembayaran/i)).toBeInTheDocument(); 
    });

    test("menampilkan item yang tersimpan dari item cart", async () => {
        localStorage.setItem("cart", JSON.stringify([
                {
                    id: 1,
                    name: "Americano",
                    base_price: 18000,
                    qty: 2,
                    image_url: "americano.jpg",
                },
            ])
        );

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(await screen.findByText("Americano")).toBeInTheDocument();
        expect(screen.getByText(/x2/i)).toBeInTheDocument();
    });

    test("customer dapat mengisi catatan pesanan", () => {
        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        const notesInput = screen.getByPlaceholderText(/catatan/i);

        fireEvent.change(notesInput,
            {
                target: {
                    value: "Jangan pakai gula",     
                },
            }
        );

        expect(notesInput.value).toBe("Jangan pakai gula");
    });

    test("menghitung dan menampilkan total pembayaran", async () => {
        localStorage.setItem("cart", JSON.stringify([
                {
                    id: 1,
                    name: "Americano",
                    base_price: 20000,
                    qty: 2,
                },
            ])
        );

        API.post.mockImplementation((url) => {
            if (url === "/api/orders/preview") {
                return Promise.resolve({
                    data: {
                        data: {
                            subtotal: "40000.00",
                            discount_total: "0.00",
                            fees: [
                                {
                                    key: "admin_fee",
                                    label: "Admin Fee",
                                    amount: "2000.00",
                                },
                            ],
                            total_amount: "42000.00",
                            voucher: null,
                        },
                    },
                });
            }
        });

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect((await screen.findAllByText(/rp40\.000/i))[0]).toBeInTheDocument();
        expect(await screen.findByText(/rp2\.000/i)).toBeInTheDocument();
        expect((await screen.findAllByText(/rp42\.000/i))[0]).toBeInTheDocument();
    });

    test("button bayar disabled jika cart kosong", () => {
        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("button",
                {
                    name: /bayar/i,
                }
            )).toBeDisabled();
    });

    test("jika checkout berhasil maka redirect ke xendit", async () => {
        API.post.mockImplementation((url) => {
            if (url === "/api/orders/preview") {
                return Promise.resolve({
                    data: {
                        data: {
                            subtotal: "36000.00",
                            discount_total: "0.00",
                            fees: [],
                            total_amount: "36000.00",
                            voucher: null,
                        },
                    },
                });
            }

            if (url === "/api/orders") {
                return Promise.resolve({
                    data: {
                        data: {
                            xendit_invoice_url:
                                "https://xendit.test/invoice",
                        },
                    },
                });
            }
        });
    });

    test("jika checkout gagal maka menampilkan warning", async () => {
        localStorage.setItem("cart", JSON.stringify([
            {
                id: 1,
                branch_id: 1,
                name: "Americano",
                base_price: 18000,
                qty: 1,
                image_url: "americano.jpg",
            },
        ]));
        
        API.post.mockImplementation((url) => {
            if (url === "/api/orders/preview") {
                return Promise.resolve({
                    data: {
                        data: {
                            subtotal: "18000.00",
                            discount_total: "0.00",
                            fees: [],
                            total_amount: "18000.00",
                            voucher: null,
                        },
                    },
                });
            }

            if (url === "/api/orders") {
                return Promise.reject({
                    response: {
                        data: {
                            message: "Checkout gagal",
                        },
                    },
                });
            }
        });

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/nomor meja/i),
            {
                target: {
                    value: "A01",
                },
            }
        );

        fireEvent.click(screen.getByRole("button",
            {
                name: /bayar/i,
            }
        ));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Checkout gagal");
        });
    });

    test("jika user login maka nama otomatis terisi dan disabled", () => {
        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText(/nama/i);
        expect(input).toBeDisabled();
    });

    test("menampilkan warning jika customer dine in tidak mengisi nomor meja", async () => {
        localStorage.setItem("cart", JSON.stringify([
            {
                id: 1,
                branch_id: 1,
                name: "Americano",
                base_price: 18000,
                qty: 1,
                image_url: "americano.jpg",
            },
        ]));
        
        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/nama/i),
            {
                target: {
                    value: "Dimitri",
                },
            }
        );

        fireEvent.click(screen.getByRole("button",
            {
                name: /bayar/i,
            }
        ));      

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Nomor meja wajib diisi");
        });
    });

    test("jika user memilih take away maka input nomor meja dihilangkan", () => {
        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByRole("button",
                {
                    name: /take away/i,
                }
            )
        );

        expect(screen.queryByPlaceholderText(/nomor meja/i)).not.toBeInTheDocument();
    });

    test("jika user memilih dine in maka input nomor meja ditampilkan", () => {
        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button",
            {
                name: /dine in/i,
            }
        ));
        
        expect(screen.getByPlaceholderText(/nomor meja/i)).toBeInTheDocument();
    });

    test("menampilkan voucher yang dimiliki user login", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        expired_at: "2027-01-01",
                        is_used: false,
                        voucher: {
                            name: "Diskon 10K",
                            min_transaction_amount: 20000,
                            discount_amount: 10000,
                        },
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        await screen.findByRole("button",  
        {
            name: /voucher/i,
        })
    });

    test("menghitung total pembayaran setelah voucher digunakan", async () => {
        localStorage.setItem("cart", JSON.stringify([
            {
                id: 1,
                name: "Americano",
                base_price: 30000,
                qty: 2,
            },
        ]));

        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        expired_at: "2027-01-01",
                        is_used: false,
                        voucher: {
                            name: "Diskon 10K",
                            min_transaction_amount: 20000,
                            discount_amount: 10000,
                        },
                    },
                ],
            },
        });
        
        API.post.mockImplementation((url, payload) => {
            if (url === "/api/orders/preview") {

                if (payload?.voucher_id) {
                    return Promise.resolve({
                        data: {
                            data: {
                                subtotal: "60000.00",
                                discount_total: "10000.00",
                                fees: [
                                    {
                                        key: "admin_fee",
                                        label: "Admin Fee",
                                        amount: "2000.00",
                                    },
                                ],
                                total_amount: "52000.00",
                                voucher: {
                                    voucher_discount: "10000.00",
                                },
                            },
                        },
                    });
                }

                return Promise.resolve({
                    data: {
                        data: {
                            subtotal: "60000.00",
                            discount_total: "0.00",
                            fees: [
                                {
                                    key: "admin_fee",
                                    label: "Admin Fee",
                                    amount: "2000.00",
                                },
                            ],
                            total_amount: "62000.00",
                            voucher: null,
                        },
                    },
                });
            }

            return Promise.resolve({
                data: {
                    data: {},
                },
            });
        });

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByRole("button",
            {
                name: /voucher/i,
            })
        );
        
        fireEvent.click(screen.getByRole("button",
            {
                name: /diskon 10k/i,
            }
        ));

        await waitFor(() => {
            expect(screen.getByRole("button", 
                {
                    name: /bayar rp52\.000/i,
                })
            ).toBeInTheDocument();
        });
    });

    test("checkout mengirim voucher yang dipilih", async () => {
        localStorage.setItem("cart", JSON.stringify([
            {
                id: 1,
                branch_id: 1,
                name: "Americano",
                base_price: 30000,
                qty: 2,
            },
        ]));
        
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 99,
                        expired_at: "2027-01-01",
                        is_used: false,
                        voucher: {
                            name: "Diskon 10K",
                            min_transaction_amount: 20000,
                            discount_amount: 10000,
                        },
                    },
                ],
            },
        });

        API.post.mockResolvedValueOnce({
            data: {
                data: {
                    xendit_invoice_url: "https://xendit.test/invoice",    
                },
            },
        });

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        fireEvent.click(await screen.findByRole("button",           
            {
                name: /voucher/i,
            }
        ));
        
        fireEvent.click(screen.getByRole("button",
            {
                name: /diskon 10k/i,
            }
        ));
        
        fireEvent.change(screen.getByPlaceholderText(/nomor meja/i),
            {
                target: {
                    value: "A01",
                },
            }
        );

        fireEvent.click(screen.getByRole("button",
            {
                name: /bayar/i,
            }
        ));

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith(expect.any(String),
                expect.objectContaining({
                    voucher_id: 99,
                })
            );
        });
    });

    test("menampilkan promo cabang dari preview", async () => {
        localStorage.setItem(
            "cart",
            JSON.stringify([
                {
                    id: 1,
                    name: "Americano",
                    base_price: 30000,
                    qty: 2,
                },
            ])
        );

        API.post.mockImplementation((url) => {
            if (url === "/api/orders/preview") {
                return Promise.resolve({
                    data: {
                        data: {
                            subtotal: "60000.00",
                            discount_total: "10000.00",
                            fees: [],
                            total_amount: "50000.00",
                            voucher: null,
                        },
                    },
                });
            }
        });

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(/promo cabang/i)
        ).toBeInTheDocument();

        expect(
            await screen.findByText(/rp10\.000/i)
        ).toBeInTheDocument();
    });

    test("menampilkan diskon voucher dari preview", async () => {
        localStorage.setItem(
            "cart",
            JSON.stringify([
                {
                    id: 1,
                    name: "Americano",
                    base_price: 30000,
                    qty: 2,
                },
            ])
        );

        API.post.mockImplementation((url) => {
            if (url === "/api/orders/preview") {
                return Promise.resolve({
                    data: {
                        data: {
                            subtotal: "60000.00",
                            discount_total: "10000.00",
                            fees: [],
                            total_amount: "50000.00",
                            voucher: {
                                voucher_discount: "10000.00",
                            },
                        },
                    },
                });
            }
        });

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(/diskon voucher/i)
        ).toBeInTheDocument();
    });

    test("menampilkan loading saat preview dihitung", async () => {
        localStorage.setItem(
            "cart",
            JSON.stringify([
                {
                    id: 1,
                    name: "Americano",
                    base_price: 30000,
                    qty: 1,
                },
            ])
        );

        API.post.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                data: {
                                    data: {
                                        subtotal: "30000.00",
                                        discount_total: "0.00",
                                        fees: [],
                                        total_amount: "30000.00",
                                    },
                                },
                            }),
                        100
                    )
                )
        );

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(
            screen.getByText(/menghitung total/i)
        ).toBeInTheDocument();
    });
});
/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import BranchStock from "../pages/admin/BranchStock";
import API from "../services/api";
import Swal from "sweetalert2";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams({ branch: "5" })],
    };
});

// Mock API
vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
    },
}));

// Mock Sweetalert2
vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(() =>
            Promise.resolve({
                isConfirmed: true,
            })
        ),
    },
}));

describe("BranchStock Page", () => {
    const originalLocation = window.location;

    beforeEach(() => {
        vi.resetAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
        
        // Mock window.location.reload
        delete window.location;
        window.location = { reload: vi.fn() };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        window.location = originalLocation;
    });

    const mockAdminUser = {
        data: {
            data: {
                id: 1,
                name: "Admin Cabang",
                role: "admin",
                branch_id: 3,
            },
        },
    };

    const mockSuperAdminUser = {
        data: {
            data: {
                id: 2,
                name: "Super Admin",
                role: "super_admin",
                branch_id: null,
            },
        },
    };

    const mockStockList = {
        data: {
            data: [
                {
                    id: 101,
                    menu_item_id: 10,
                    stock: 20,
                    is_available: true,
                    discount_type: "percentage",
                    discount_percentage: 10,
                    discount_amount: null,
                    menu_item: {
                        name: "Es Kopi Susu",
                        base_price: 15000,
                        category: { name: "Coffee" },
                    },
                },
            ],
        },
    };

    const mockAllMenus = {
        data: {
            data: [
                { id: 10, name: "Es Kopi Susu" },
                { id: 11, name: "Roti Bakar" },
            ],
        },
    };

    test("menampilkan loading saat pertama render", () => {
        API.get.mockImplementation(() => new Promise(() => {}));

        render(
            <MemoryRouter>
                <BranchStock />
            </MemoryRouter>
        );

        expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    });

    test("menampilkan data stock cabang untuk admin biasa", async () => {
        API.get
            .mockResolvedValueOnce(mockAdminUser)
            .mockResolvedValueOnce(mockStockList);

        render(
            <MemoryRouter>
                <BranchStock />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Es Kopi Susu")).toBeInTheDocument();
        });

        expect(screen.getByText("Coffee")).toBeInTheDocument();
        expect(screen.getByText("Rp 15.000")).toBeInTheDocument();
        
        // Stock input
        const stockInput = screen.getAllByRole("spinbutton")[0];
        expect(stockInput.value).toBe("20");

        // Status select
        const selects = screen.getAllByRole("combobox");
        expect(selects[0].value).toBe("1"); // Available
        expect(selects[1].value).toBe("percentage"); // Discount type

        // Super Admin only buttons should not be present
        expect(screen.queryByText("+ Tambah Menu")).not.toBeInTheDocument();
        expect(screen.queryByText("← Kembali ke Cabang")).not.toBeInTheDocument();
    });

    test("menampilkan data stock cabang untuk super admin", async () => {
        API.get
            .mockResolvedValueOnce(mockSuperAdminUser)
            .mockResolvedValueOnce(mockStockList)
            .mockResolvedValueOnce(mockAllMenus);

        render(
            <MemoryRouter>
                <BranchStock />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Es Kopi Susu")).toBeInTheDocument();
        });

        // Super admin specific elements should be visible
        const assignButton = screen.getByRole("button", { name: /\+ tambah menu/i });
        const backButton = screen.getByRole("button", { name: /← kembali ke cabang/i });

        expect(assignButton).toBeInTheDocument();
        expect(backButton).toBeInTheDocument();

        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith("/superadmin/cabang");
    });

    test("search filter bekerja", async () => {
        const doubleStockList = {
            data: {
                data: [
                    {
                        id: 101,
                        menu_item_id: 10,
                        stock: 20,
                        is_available: true,
                        discount_type: null,
                        menu_item: { name: "Es Kopi Susu", base_price: 15000, category: { name: "Coffee" } },
                    },
                    {
                        id: 102,
                        menu_item_id: 11,
                        stock: 15,
                        is_available: true,
                        discount_type: null,
                        menu_item: { name: "Roti Bakar", base_price: 12000, category: { name: "Food" } },
                    },
                ],
            },
        };

        API.get
            .mockResolvedValueOnce(mockAdminUser)
            .mockResolvedValueOnce(doubleStockList);

        render(
            <MemoryRouter>
                <BranchStock />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Es Kopi Susu")).toBeInTheDocument();
        });
        expect(screen.getByText("Roti Bakar")).toBeInTheDocument();

        const searchInput = screen.getByPlaceholderText(/cari menu.../i);
        fireEvent.change(searchInput, { target: { value: "Roti" } });

        expect(screen.getByText("Roti Bakar")).toBeInTheDocument();
        expect(screen.queryByText("Es Kopi Susu")).not.toBeInTheDocument();
    });

    test("update stock memanggil API put", async () => {
        API.get
            .mockResolvedValueOnce(mockAdminUser)
            .mockResolvedValueOnce(mockStockList);

        API.put.mockResolvedValueOnce({ data: { success: true } });

        render(
            <MemoryRouter>
                <BranchStock />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Es Kopi Susu")).toBeInTheDocument();
        });

        // Change stock value to 25
        const stockInput = screen.getAllByRole("spinbutton")[0];
        fireEvent.change(stockInput, { target: { value: "25" } });

        // Change availability to Unavailable
        const selects = screen.getAllByRole("combobox");
        fireEvent.change(selects[0], { target: { value: "0" } });

        // Click Simpan button
        const simpanButton = screen.getByRole("button", { name: /simpan/i });
        fireEvent.click(simpanButton);

        await waitFor(() => {
            expect(API.put).toHaveBeenCalledWith(
                "/api/admin/branches/3/menu-items/10/stock",
                {
                    stock: "25",
                    is_available: false,
                    discount_type: "percentage",
                    discount_percentage: 10,
                    discount_amount: null,
                }
            );
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "success",
                title: "Berhasil",
                text: "Stock berhasil diupdate",
            })
        );
    });

    test("jika update stock gagal tampil swal error", async () => {
        API.get
            .mockResolvedValueOnce(mockAdminUser)
            .mockResolvedValueOnce(mockStockList);

        API.put.mockRejectedValueOnce(new Error("Update failed"));

        render(
            <MemoryRouter>
                <BranchStock />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Es Kopi Susu")).toBeInTheDocument();
        });

        const simpanButton = screen.getByRole("button", { name: /simpan/i });
        fireEvent.click(simpanButton);

        await waitFor(() => {
            expect(API.put).toHaveBeenCalled();
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "error",
                title: "Gagal",
                text: "Gagal update stock",
            })
        );
    });

    test("tambah menu cabang memanggil API post dan reload halaman", async () => {
        API.get
            .mockResolvedValueOnce(mockSuperAdminUser)
            .mockResolvedValueOnce(mockStockList)
            .mockResolvedValueOnce(mockAllMenus);

        API.post.mockResolvedValueOnce({ data: { success: true } });

        render(
            <MemoryRouter>
                <BranchStock />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Es Kopi Susu")).toBeInTheDocument();
        });

        const assignButton = screen.getByRole("button", { name: /\+ tambah menu/i });
        fireEvent.click(assignButton);

        // Expect Modal open and select target menu
        const modalSelectElement = document.querySelector('select[name="selectedMenuId"]');
        fireEvent.change(modalSelectElement, { target: { value: "11" } });

        const saveBtnInModal = screen.getAllByRole("button", { name: /simpan/i });
        // The last Simpan button should be the one in the modal
        fireEvent.click(saveBtnInModal[saveBtnInModal.length - 1]);

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith("/api/admin/branches/5/menu-items/11");
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "success",
                title: "Berhasil",
                text: "Menu berhasil ditambahkan",
            })
        );
        expect(window.location.reload).toHaveBeenCalled();
    });

    test("tambah menu cabang warning jika menu belum dipilih", async () => {
        API.get
            .mockResolvedValueOnce(mockSuperAdminUser)
            .mockResolvedValueOnce(mockStockList)
            .mockResolvedValueOnce(mockAllMenus);

        render(
            <MemoryRouter>
                <BranchStock />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Es Kopi Susu")).toBeInTheDocument();
        });

        const assignButton = screen.getByRole("button", { name: /\+ tambah menu/i });
        fireEvent.click(assignButton);

        const saveBtnInModal = screen.getAllByRole("button", { name: /simpan/i });
        fireEvent.click(saveBtnInModal[saveBtnInModal.length - 1]);

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "warning",
                    title: "Pilih menu",
                })
            );
        });

        expect(API.post).not.toHaveBeenCalled();
    });

    test("jika API get gagal tampil swal error", async () => {
        API.get.mockRejectedValueOnce(new Error("Fetch failed"));

        render(
            <MemoryRouter>
                <BranchStock />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(API.get).toHaveBeenCalled();
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "error",
                title: "Gagal",
                text: "Gagal mengambil data",
            })
        );
    });
});

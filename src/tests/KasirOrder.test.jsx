import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import AuthContext from "../context/AuthContext";
import KasirOrder from "../pages/admin/KasirOrder";
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

const mockMenus = [
    {
        id: 1,
        name: "Americano",
        base_price: 20000,
        final_price: 18000,
        category: {
            id: 1,
            name: "Coffee",
        },
    },
    {
        id: 2,
        name: "Latte",
        base_price: 30000,
        final_price: 25000,
        category: {
            id: 1,
            name: "Coffee",
        },
    },
];

const mockCategories = [
    {
        id: 1,
        name: "Coffee",
    },
];

function renderPage() {
    return render(
        <AuthContext.Provider
            value={{
                user: {
                    id: 1,
                    name: "Admin",
                    role: "admin",
                    branch_id: 1,
                },
            }}
        >
            <BrowserRouter>
                <KasirOrder />
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

describe("KasirOrder Page", () => {

    beforeEach(() => {

        vi.clearAllMocks();

        API.get.mockImplementation((url) => {

            if (url.includes("/menus")) {

                return Promise.resolve({
                    data: {
                        data: mockMenus,
                    },
                });
            }

            if (url.includes("/categories")) {

                return Promise.resolve({
                    data: {
                        data: mockCategories,
                    },
                });
            }

            return Promise.reject(
                new Error("Unknown endpoint")
            );
        });
    });

    test("menampilkan loading state", () => {

        API.get.mockImplementation(
            () => new Promise(() => {})
        );

        renderPage();

        expect(
            document.querySelector(".animate-spin")
        ).toBeInTheDocument();
    });

    test("menampilkan daftar menu", async () => {

        renderPage();

        expect(
            await screen.findByText("Americano")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Latte")
        ).toBeInTheDocument();
    });

    test("menambahkan menu ke cart", async () => {

        renderPage();

        const addButtons =
            await screen.findAllByText(/tambah/i);

        fireEvent.click(addButtons[0]);

        expect(
            screen.getAllByText("Americano")
        ).toHaveLength(2);
    });

    test("menambah quantity menu", async () => {

        renderPage();

        const addButtons =
            await screen.findAllByText(/tambah/i);

        fireEvent.click(addButtons[0]);

        const plusButtons =
            await screen.findAllByText("+");

        fireEvent.click(plusButtons[0]);

        expect(
            screen.getByText("2")
        ).toBeInTheDocument();
    });

    test("mengurangi quantity menu", async () => {

        renderPage();

        const addButtons =
            await screen.findAllByText(/tambah/i);

        fireEvent.click(addButtons[0]);

        const plusButtons =
            await screen.findAllByText("+");

        fireEvent.click(plusButtons[0]);

        const minusButtons =
            await screen.findAllByText("-");

        fireEvent.click(minusButtons[0]);

        expect(
            screen.getByText("1")
        ).toBeInTheDocument();
    });

    test("menghitung total pembayaran dengan benar", async () => {

        renderPage();

        const addButtons =
            await screen.findAllByText(/tambah/i);

        fireEvent.click(addButtons[0]);

        expect(
            screen.getAllByText(/18.000/i)
        ).toHaveLength(3);
    });

    test("menampilkan input nomor meja untuk dine in", async () => {

        renderPage();

        await screen.findByText("Americano");

        expect(
            screen.getByPlaceholderText(/no. meja/i)
        ).toBeInTheDocument();
    });

    test("menyembunyikan input nomor meja untuk take away", async () => {

        renderPage();

        await screen.findByText("Americano");

        const select =
            screen.getByDisplayValue(/dine in/i);

        fireEvent.change(select, {
            target: {
                value: "take_away",
            },
        });

        expect(
            screen.queryByPlaceholderText(/nomor meja/i)
        ).not.toBeInTheDocument();
    });

    test("memproses pesanan berhasil", async () => {

        API.post.mockResolvedValue({
            data: {
                message:
                    "Pesanan berhasil dibuat",
            },
        });

        renderPage();

        const addButtons =
            await screen.findAllByText(/tambah/i);

        fireEvent.click(addButtons[0]);

        const submitButton =
            screen.getByText(/buat pesanan/i);

        fireEvent.click(submitButton);

        await waitFor(() => {

            expect(API.post).toHaveBeenCalled();
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "success",
            })
        );
    });

    test("menampilkan warning ketika cart kosong", async () => {

        renderPage();

        await screen.findByText("Americano");

        const submitButton =
            screen.getByText(/buat pesanan/i);

        fireEvent.click(submitButton);

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "warning",
            })
        );
    });
});
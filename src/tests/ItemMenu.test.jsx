/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ItemMenu from "../pages/ItemMenu.jsx";
import API from "../services/api";
import { vi } from "vitest";
import Swal from "sweetalert2";

// mock auth
vi.mock("../context/useAuth.jsx", () => ({
    useAuth: () => ({
        user: { name: "Tester" },
        logout: vi.fn(),
    }),
}));

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

// mock layout
vi.mock("../components/ui/SidebarAdmin.jsx", () => ({
    default: () => <div>Sidebar</div>,
}));

vi.mock("../components/ui/NavBarAdmin.jsx", () => ({
    default: () => <div>Navbar</div>,
}));

// mock API
vi.mock("../services/api");

describe("ItemMenu Page", () => {

    test("menampilkan loading", () => {
        API.get.mockResolvedValue({ data: { data: [] } });

        render(<ItemMenu />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test("menampilkan data menu", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Americano",
                        base_price: 20000,
                        status: "active",
                        category: { name: "Coffee" },
                    },
                ],
            },
        });

        render(<ItemMenu />);

        await waitFor(() => {
            expect(screen.getByText("Americano")).toBeInTheDocument();
        });

        expect(screen.getByText("Coffee")).toBeInTheDocument();
        expect(screen.getByText("20000")).toBeInTheDocument();
    });

    test("empty state", async () => {
        API.get.mockResolvedValue({
            data: { data: [] },
        });

        render(<ItemMenu />);

        await waitFor(() => {
            expect(screen.getByText(/data tidak ditemukan/i)).toBeInTheDocument();
        });
    });

    test("search filter bekerja", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Americano",
                        base_price: 20000,
                        status: "active",
                        category: { name: "Coffee" },
                    },
                    {
                        id: 2,
                        name: "Matcha Latte",
                        base_price: 25000,
                        status: "active",
                        category: { name: "Non Coffee" },
                    },
                ],
            },
        });

        render(<ItemMenu />);

        await waitFor(() => {
            expect(screen.getByText("Americano")).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/search/i);

        fireEvent.change(input, { target: { value: "matcha" } });

        await waitFor(() => {
            expect(screen.getByText("Matcha Latte")).toBeInTheDocument();
        });
    });

    test("klik edit membuka modal dengan data", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Americano",
                        base_price: 20000,
                        status: "active",
                        category: { name: "Coffee" },
                    },
                ],
            },
        });

        render(<ItemMenu />);

        // tunggu data muncul
        await screen.findByText("Americano");

        // klik tombol edit
        const editBtn = screen.getByText(/edit/i);
        fireEvent.click(editBtn);

        // modal harus muncul
        expect(screen.getByText(/edit menu/i)).toBeInTheDocument();

        // form terisi
        expect(screen.getByDisplayValue("Americano")).toBeInTheDocument();
    });

    test("submit edit memanggil API dan menampilkan swal sukses", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Americano",
                        base_price: 20000,
                        status: "active",
                    },
                ],
            },
        });

        API.put.mockResolvedValue({
            data: { success: true },
        });

        Swal.fire.mockResolvedValue({ isConfirmed: true });

        render(<ItemMenu />);

        await screen.findByText("Americano");

        // klik edit
        fireEvent.click(screen.getByText(/edit/i));

        // ubah nama
        const input = screen.getByDisplayValue("Americano");
        fireEvent.change(input, { target: { value: "Latte" } });

        // klik simpan
        fireEvent.click(screen.getByText(/simpan/i));

        await waitFor(() => {
            expect(API.put).toHaveBeenCalled();
        });

        expect(Swal.fire).toHaveBeenCalled();
    });

    test("jika user batal confirm, API tidak dipanggil", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Americano",
                        base_price: 20000,
                        status: "active",
                    },
                ],
            },
        });

        Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

        render(<ItemMenu />);

        await screen.findByText("Americano");

        fireEvent.click(screen.getByText(/edit/i));

        fireEvent.click(screen.getByText(/simpan/i));

        await waitFor(() => {
            expect(API.put).not.toHaveBeenCalled();
        });
    });

    test("jika API gagal, tampil swal error", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Americano",
                        base_price: 20000,
                        status: "active",
                    },
                ],
            },
        });

        API.put.mockRejectedValue(new Error("Server error"));

        Swal.fire
            .mockResolvedValueOnce({ isConfirmed: true }) // confirm
            .mockResolvedValueOnce({}); // error swal

        render(<ItemMenu />);

        await screen.findByText("Americano");

        fireEvent.click(screen.getByText(/edit/i));
        fireEvent.click(screen.getByText(/simpan/i));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: "error",
                })
            );
        });
    });

    test("klik tambah menu membuka modal kosong", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        render(<ItemMenu />);

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        expect(
            screen.getByText(/tambah menu/i)
        ).toBeInTheDocument();

        expect(
            screen.getByRole("textbox", { name: "" })
        ).toBeInTheDocument();
    });

    test("submit add memanggil API POST", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [
                        { id: 1, name: "Coffee" },
                    ],
                },
            });

        API.post.mockResolvedValue({
            data: { success: true },
        });

        Swal.fire.mockResolvedValue({
            isConfirmed: true,
        });

        render(<ItemMenu />);

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        fireEvent.change(
            screen.getByRole("combobox"),
            {
                target: { value: "1" },
            }
        );

        fireEvent.change(
            screen.getAllByRole("textbox")[0],
            {
                target: { value: "Latte" },
            }
        );

        fireEvent.click(
            screen.getByText(/simpan/i)
        );

        await waitFor(() => {
            expect(API.post).toHaveBeenCalled();
        });
    });

    test("cancel modal tanpa perubahan langsung menutup modal", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        render(<ItemMenu />);

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        fireEvent.click(
            screen.getByText(/batal/i)
        );

        await waitFor(() => {
            expect(
                screen.queryByText(/tambah menu/i)
            ).not.toBeInTheDocument();
        });
    });

    test("dirty form memunculkan konfirmasi saat cancel", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        Swal.fire.mockResolvedValue({
            isConfirmed: true,
        });

        render(<ItemMenu />);

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        fireEvent.change(
            screen.getAllByRole("textbox")[0],
            {
                target: { value: "Latte" },
            }
        );

        fireEvent.click(
            screen.getByText(/batal/i)
        );

        expect(Swal.fire).toHaveBeenCalled();
    });

    test("user dapat upload gambar", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        render(<ItemMenu />);

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        const file = new File(
            ["dummy"],
            "coffee.png",
            { type: "image/png" }
        );

        const input = screen.getByLabelText("", {
            selector: 'input[type="file"]'
        });

        fireEvent.change(input, {
            target: {
                files: [file],
            },
        });

        expect(input.files[0].name)
            .toBe("coffee.png");
    });

});
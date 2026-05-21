/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Categories from "../pages/super_admin/Categories";
import { vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import API from "../services/api";

// MOCK API
vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
    },
}));

// MOCK AUTH
vi.mock("../context/useAuth", () => ({
    useAuth: () => ({
        user: { name: "admin" },
        logout: vi.fn(),
    }),
}));

// MOCK SWAL
vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(() =>
            Promise.resolve({ isConfirmed: true })
        ),
    },
}));

describe("Categories Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("menampilkan loading lalu data", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [{ id: 1, name: "Makanan", description: "desc", sort_order: 1 }],
            },
        });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
        expect((await screen.findAllByText("Makanan"))[0]).toBeInTheDocument();
    });

    test("buka modal tambah kategori", async () => {
        API.get.mockResolvedValueOnce({
            data: { data: [] },
        });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        const btn = await screen.findAllByText(/tambah kategori/i);
        fireEvent.click(btn[0]);
        expect(screen.getByRole("heading", { name: /tambah kategori/i })).toBeInTheDocument();
    });

    test("submit ADD kategori → API POST terpanggil", async () => {
        API.get.mockResolvedValue({
            data: { data: [] },
        });

        API.post.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        fireEvent.click(
            (await screen.findAllByText(/tambah kategori/i))[0]
        );

        fireEvent.change(screen.getByPlaceholderText(/masukkan nama kategori/i), {
            target: { value: "Minuman" },
        });

        fireEvent.change(screen.getByPlaceholderText(/masukkan deskripsi kategori/i), {
            target: { value: "desc" },
        });

        fireEvent.change(screen.getByPlaceholderText("0"), {
            target: { value: "1" },
        });

        fireEvent.click(screen.getByText("Simpan"));

        await waitFor(() => {
            expect(API.post).toHaveBeenCalled();
        });
    });

    test("submit EDIT kategori → API PUT terpanggil", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [{ id: 1, name: "Makanan", description: "desc", sort_order: 1 }],
            },
        });
        API.put.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        const editBtn = await screen.findByText("Edit");
        fireEvent.click(editBtn);

        fireEvent.change(screen.getByPlaceholderText(/masukkan nama kategori/i), {
            target: { value: "Makanan Updated" },
        });

        fireEvent.click(screen.getByText("Simpan"));

        await waitFor(() => {
            expect(API.put).toHaveBeenCalled();
        });
    });

    test("menampilkan empty state jika data kosong", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [],
            },
        });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        expect(await screen.findByText(/kategori tidak ditemukan/i)).toBeInTheDocument();
    });

    test("search kategori bekerja", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Makanan",
                        description: "desc",
                        sort_order: 1,
                    },
                    {
                        id: 2,
                        name: "Minuman",
                        description: "desc",
                        sort_order: 2,
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        expect(
            (await screen.findAllByText("Makanan"))[0]
        ).toBeInTheDocument();

        fireEvent.change(
            screen.getByPlaceholderText(/cari kategori/i),
            {
                target: {
                    value: "minuman",
                },
            }
        );

        expect(screen.getAllByText("Minuman")[0]).toBeInTheDocument();
    });

    test("modal edit terisi data kategori", async () => {
        API.get.mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Makanan",
                        description: "desc",
                        sort_order: 1,
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        fireEvent.click(
            await screen.findByText("Edit")
        );

        expect(screen.getByDisplayValue("Makanan")).toBeInTheDocument();
        expect(screen.getByDisplayValue("desc")).toBeInTheDocument();
    });

    test("modal tertutup saat tombol batal diklik", async () => {

        API.get.mockResolvedValueOnce({
            data: {
                data: [],
            },
        });

        render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        const btn = await screen.findAllByText(/tambah kategori/i);
        fireEvent.click(btn[0]);
        expect(screen.getByPlaceholderText(/masukkan nama kategori/i)).toBeInTheDocument();
        
        fireEvent.click(
            screen.getByText("Batal")
        );
        await waitFor(() => {
            expect(screen.queryByPlaceholderText("Nama")).not.toBeInTheDocument();
        });
    });
});
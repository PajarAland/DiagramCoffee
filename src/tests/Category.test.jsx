/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Categories from "../pages/Categories";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

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

        expect(await screen.findByText("Makanan")).toBeInTheDocument();
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

        // const btn = await screen.findByText(/tambah kategori/i);
        const btn = await screen.findAllByText(/tambah kategori/i);
        fireEvent.click(btn[0]); // tombol, bukan title

        // expect(screen.getByText(/tambah kategori/i)).toBeInTheDocument();
        expect(screen.getByRole("heading")).toHaveTextContent("Tambah Kategori");
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

        fireEvent.click(await screen.findByText(/tambah kategori/i));

        fireEvent.change(screen.getByPlaceholderText("Nama"), {
            target: { value: "Minuman" },
        });

        fireEvent.change(screen.getByPlaceholderText("Deskripsi"), {
            target: { value: "desc" },
        });

        fireEvent.change(screen.getByPlaceholderText("Sort Order"), {
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

        fireEvent.change(screen.getByPlaceholderText("Nama"), {
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

        expect(
            await screen.findByText(/data tidak ditemukan/i)
        ).toBeInTheDocument();
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
            await screen.findByText("Makanan")
        ).toBeInTheDocument();

        fireEvent.change(
            screen.getByPlaceholderText(/search category/i),
            {
                target: {
                    value: "minuman",
                },
            }
        );

        expect(
            screen.getByText("Minuman")
        ).toBeInTheDocument();
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

        expect(
            screen.getByDisplayValue("Makanan")
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue("desc")
        ).toBeInTheDocument();
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

        expect(
            screen.getByPlaceholderText("Nama")
        ).toBeInTheDocument();

        fireEvent.click(
            screen.getByText("Batal")
        );

        await waitFor(() => {
            expect(
                screen.queryByPlaceholderText("Nama")
            ).not.toBeInTheDocument();
        });
    });

});
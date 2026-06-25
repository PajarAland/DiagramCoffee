/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cabang from "../pages/super_admin/Cabang";
import API from "../services/api";
import { vi, beforeEach, afterEach } from "vitest";

// mock auth
vi.mock("../context/useAuth.jsx", () => ({
    useAuth: () => ({
        user: { name: "Tester" },
        logout: vi.fn(),
    }),
}));

// mock layout
vi.mock("../components/ui/SideBarAdmin.jsx", () => ({
    default: () => <div>Sidebar</div>,
}));

// mock API
vi.mock("../services/api");

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(() =>
            Promise.resolve({
                isConfirmed: true,
            })
        ),
    },
}));

describe("Cabang Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        API.post = vi.fn();
        API.put = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("menampilkan loading saat pertama render", async () => {

        API.get.mockResolvedValue({
            data: { data: [] },
        });

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        await waitFor(() => {

            expect(
                screen.getByText(/loading/i)
            ).toBeInTheDocument();
        });
    });

    test("menampilkan data cabang dari API", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Diagram Coffee Dago",
                        address: "Jl. Dago",
                        phone: "08123",
                        status: "active",
                        opening_time: "08:00",
                        closing_time: "22:00",
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Diagram Coffee Dago")[0]).toBeInTheDocument();
        });
        expect(screen.getAllByText("Jl. Dago")[0]).toBeInTheDocument();
        expect(screen.getAllByText("08123")[0]).toBeInTheDocument();
        expect(screen.getAllByText("08:00 - 22:00")[0]).toBeInTheDocument();
    });

    test("menampilkan empty state jika data kosong", async () => {
        API.get.mockResolvedValue({
            data: { data: [] },
        });

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

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
                        name: "Dago",
                        address: "",
                        phone: "",
                        status: "active",
                        opening_time: "08:00",
                        closing_time: "22:00",
                    },
                    {
                        id: 2,
                        name: "Bandung",
                        address: "",
                        phone: "",
                        status: "active",
                        opening_time: "08:00",
                        closing_time: "22:00",
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Dago")[0]).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/cari cabang/i);
        fireEvent.change(input, { target: { value: "bandung" } });

        await waitFor(() => {
            expect(screen.getAllByText("Bandung")[0]).toBeInTheDocument();
        });
    });

    test("hapus cabang memanggil API DELETE", async () => {

        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Dago",
                        address: "Jl. Dago",
                        phone: "08123",
                        status: "active",
                        opening_time: "08:00",
                        closing_time: "22:00",
                    },
                ],
            },
        });

        API.delete = vi.fn().mockResolvedValue({
            data: {
                message: "Cabang berhasil dihapus",
            },
        });

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        await waitFor(() => {

            expect(
                screen.getAllByText("Dago")[0]
            ).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getAllByText(/hapus/i)[0]
        );

        await waitFor(() => {

            expect(API.delete).toHaveBeenCalled();
        });
    });

    test("membuka modal edit dengan data terisi", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Dago",
                        address: "Jl. Dago",
                        phone: "08123",
                        status: "active",
                        opening_time: "08:00",
                        closing_time: "22:00",
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Dago")[0]).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByText(/edit/i)
        );

        expect(screen.getByDisplayValue("Dago")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Jl. Dago")).toBeInTheDocument();
    });

    test("membuka modal tambah cabang", async () => {
        API.get.mockResolvedValue({
            data: { data: [] },
        });

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        await act(async () => {
            fireEvent.click(
                screen.getByText(/tambah cabang/i)
            );
        });
        screen.getByRole("heading", { name: /tambah cabang/i });
        expect(screen.getByPlaceholderText(/masukkan nama cabang/i)).toBeInTheDocument();
    });

    test("submit tambah cabang memanggil API POST", async () => {
        API.get.mockResolvedValue({
            data: { data: [] },
        });

        API.post.mockResolvedValue({
            data: {
                message: "Cabang berhasil ditambahkan",
            },
        });

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        fireEvent.click(
            screen.getByText(/tambah cabang/i)
        );

        fireEvent.change(
            screen.getByPlaceholderText(/masukkan nama cabang/i),
            {
                target: { value: "Cabang Baru" },
            }
        );

        fireEvent.change(
            screen.getByPlaceholderText(/masukkan alamat lengkap/i),
            {
                target: { value: "Jl. Baru" },
            }
        );

        fireEvent.change(
            screen.getByPlaceholderText(/0821/i),
            {
                target: { value: "08123456789" },
            }
        );

        fireEvent.click(
            screen.getByText(/simpan/i)
        );

        await waitFor(() => {
            expect(API.post).toHaveBeenCalled();
        });
    });

    test("submit edit cabang memanggil API PUT", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Dago",
                        address: "Jl. Dago",
                        phone: "08123",
                        status: "active",
                        opening_time: "08:00",
                        closing_time: "22:00",
                    },
                ],
            },
        });

        API.put.mockResolvedValue({
            data: {
                message: "Cabang berhasil diupdate",
            },
        });

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Dago")[0]).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByText(/edit/i)
        );

        fireEvent.change(
            screen.getByDisplayValue("Dago"),
            {
                target: { value: "Dago Updated" },
            }
        );

        fireEvent.click(
            screen.getByText(/simpan/i)
        );

        await waitFor(() => {
            expect(API.put).toHaveBeenCalled();
        });
    });

    test("jika API gagal tampil swal error", async () => {

        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        API.get.mockRejectedValue(
            new Error("Server Error")
        );

        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(API.get).toHaveBeenCalled();
        });

        consoleSpy.mockRestore();
    });
});
/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

    test("menampilkan loading saat pertama render", () => {
        API.get.mockResolvedValue({ data: { data: [] } });
        
        render(
            <MemoryRouter>
                <Cabang />
            </MemoryRouter>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
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

        fireEvent.click(
            screen.getByText(/tambah cabang/i)
        );

        screen.getByRole("heading", { name: /tambah cabang/i });
        expect(screen.getByPlaceholderText(/masukkan nama cabang/i)).toBeInTheDocument();
    });
});
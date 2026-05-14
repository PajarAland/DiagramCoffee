/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, waitFor, fireEvent, } from "@testing-library/react";
import Cabang from "../pages/Cabang";
import API from "../services/api";
import { vi } from "vitest";

// mock auth
vi.mock("../context/useAuth.jsx", () => ({
    useAuth: () => ({
        user: { name: "Tester" },
        logout: vi.fn(),
    }),
}));

// mock layout (biar test fokus ke logic)
vi.mock("../components/ui/SidebarAdmin.jsx", () => ({
    default: () => <div>Sidebar</div>,
}));

vi.mock("../components/ui/NavBarAdmin.jsx", () => ({
    default: () => <div>Navbar</div>,
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


describe("Cabang Page (TDD)", () => {

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

        render(<Cabang />);

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

        render(<Cabang />);

        await waitFor(() => {
            expect(
                screen.getByText("Diagram Coffee Dago")
            ).toBeInTheDocument();
        });

        expect(screen.getByText("Jl. Dago")).toBeInTheDocument();
        expect(screen.getByText("08123")).toBeInTheDocument();
        expect(screen.getByText("08:00 - 22:00")).toBeInTheDocument();
    });

    test("menampilkan empty state jika data kosong", async () => {
        API.get.mockResolvedValue({
            data: { data: [] },
        });

        render(<Cabang />);

        await waitFor(() => {
            expect(
                screen.getByText(/data tidak ditemukan/i)
            ).toBeInTheDocument();
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

        render(<Cabang />);

        await waitFor(() => {
            expect(screen.getByText("Dago")).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/search/i);

        fireEvent.change(input, { target: { value: "bandung" } });

        await waitFor(() => {
            expect(screen.getByText("Bandung")).toBeInTheDocument();
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

        render(<Cabang />);

        await waitFor(() => {
            expect(screen.getByText("Dago"))
                .toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByText(/edit/i)
        );

        expect(
            screen.getByDisplayValue("Dago")
        ).toBeInTheDocument();

        expect(
            screen.getByDisplayValue("Jl. Dago")
        ).toBeInTheDocument();
    });

    test("membuka modal tambah cabang", async () => {

        API.get.mockResolvedValue({
            data: { data: [] },
        });

        render(<Cabang />);

        fireEvent.click(
            screen.getByText(/tambah cabang/i)
        );

        expect(
            screen.getByRole("heading")
        ).toHaveTextContent("Tambah Cabang");

        expect(
            screen.getByPlaceholderText("Nama")
        ).toBeInTheDocument();
    });

});
/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FeeManagement from "../pages/super_admin/FeeManagement";
import API from "../services/api";
import { vi, beforeEach, afterEach } from "vitest";

// mock API
vi.mock("../services/api");

// mock sweetalert2
vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(() =>
            Promise.resolve({
                isConfirmed: true,
            })
        ),
    },
}));

describe("FeeManagement Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        API.get = vi.fn();
        API.post = vi.fn();
        API.put = vi.fn();
        API.delete = vi.fn();
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
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });
    });

    test("menampilkan data fee dari API", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        key: "service_fee",
                        label: "Service Fee",
                        value: 2000,
                        type: "fixed",
                    },
                    {
                        id: 2,
                        key: "tax_fee",
                        label: "Tax Fee",
                        value: 10,
                        type: "percentage",
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("service_fee")[0]).toBeInTheDocument();
        });
        expect(screen.getAllByText("Service Fee")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Rp2.000")[0]).toBeInTheDocument();
        expect(screen.getAllByText("fixed")[0]).toBeInTheDocument();

        expect(screen.getAllByText("tax_fee")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Tax Fee")[0]).toBeInTheDocument();
        expect(screen.getAllByText("10%")[0]).toBeInTheDocument();
        expect(screen.getAllByText("percentage")[0]).toBeInTheDocument();
    });

    test("menampilkan empty state jika data kosong", async () => {
        API.get.mockResolvedValue({
            data: { data: [] },
        });

        render(
            <MemoryRouter>
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/fee tidak ditemukan/i)).toBeInTheDocument();
        });
    });

    test("search filter bekerja", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        key: "service_fee",
                        label: "Service Fee",
                        value: 2000,
                        type: "fixed",
                    },
                    {
                        id: 2,
                        key: "tax_fee",
                        label: "Tax Fee",
                        value: 10,
                        type: "percentage",
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Service Fee")[0]).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/cari fee.../i);
        fireEvent.change(input, { target: { value: "tax" } });

        await waitFor(() => {
            expect(screen.getAllByText("Tax Fee")[0]).toBeInTheDocument();
        });
        expect(screen.queryByText("Service Fee")).not.toBeInTheDocument();
    });

    test("hapus fee memanggil API DELETE", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        key: "service_fee",
                        label: "Service Fee",
                        value: 2000,
                        type: "fixed",
                    },
                ],
            },
        });

        API.delete.mockResolvedValue({
            data: {
                message: "Fee berhasil dihapus",
            },
        });

        render(
            <MemoryRouter>
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Service Fee")[0]).toBeInTheDocument();
        });

        // Click delete button (alt="delete")
        fireEvent.click(screen.getAllByAltText("delete")[0]);

        await waitFor(() => {
            expect(API.delete).toHaveBeenCalledWith("/api/admin/settings/fee/service_fee");
        });
    });

    test("membuka modal edit dengan data terisi", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        key: "service_fee",
                        label: "Service Fee",
                        value: 2000,
                        type: "fixed",
                    },
                ],
            },
        });

        render(
            <MemoryRouter>
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Service Fee")[0]).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/edit/i));

        expect(screen.getByDisplayValue("service_fee")).toBeInTheDocument();
        expect(screen.getByDisplayValue("service_fee")).toBeDisabled();
        expect(screen.getByDisplayValue("Service Fee")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2000")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toHaveValue("fixed");
    });

    test("membuka modal tambah fee", async () => {
        API.get.mockResolvedValue({
            data: { data: [] },
        });

        render(
            <MemoryRouter>
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/fee tidak ditemukan/i)).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByText(/tambah fee/i));
        });

        expect(screen.getByRole("heading", { name: /tambah fee/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("admin_fee")).toBeInTheDocument();
    });

    test("submit tambah fee memanggil API POST", async () => {
        API.get.mockResolvedValue({
            data: { data: [] },
        });

        API.post.mockResolvedValue({
            data: {
                message: "Fee berhasil ditambahkan",
            },
        });

        render(
            <MemoryRouter>
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/fee tidak ditemukan/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/tambah fee/i));

        fireEvent.change(screen.getByPlaceholderText("admin_fee"), {
            target: { value: "service_fee" },
        });

        fireEvent.change(screen.getByPlaceholderText("Admin Fee"), {
            target: { value: "Service Fee" },
        });

        fireEvent.change(screen.getByPlaceholderText("2000"), {
            target: { value: "2000" },
        });

        fireEvent.click(screen.getByText(/simpan/i));

        await waitFor(() => {
            expect(API.post).toHaveBeenCalledWith("/api/admin/settings/fee", {
                key: "service_fee",
                label: "Service Fee",
                value: "2000",
                type: "fixed",
            });
        });
    });

    test("submit edit fee memanggil API PUT", async () => {
        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        key: "service_fee",
                        label: "Service Fee",
                        value: 2000,
                        type: "fixed",
                    },
                ],
            },
        });

        API.put.mockResolvedValue({
            data: {
                message: "Fee berhasil diupdate",
            },
        });

        render(
            <MemoryRouter>
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Service Fee")[0]).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/edit/i));

        fireEvent.change(screen.getByDisplayValue("Service Fee"), {
            target: { value: "Service Fee Updated" },
        });

        fireEvent.click(screen.getByText(/simpan/i));

        await waitFor(() => {
            expect(API.put).toHaveBeenCalledWith("/api/admin/settings/fee/service_fee", {
                key: "service_fee",
                label: "Service Fee Updated",
                value: 2000,
                type: "fixed",
            });
        });
    });

    test("jika API gagal tampil swal error", async () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        API.get.mockRejectedValue(new Error("Server Error"));

        render(
            <MemoryRouter>
                <FeeManagement />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(API.get).toHaveBeenCalled();
        });

        consoleSpy.mockRestore();
    });
});

/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import AdminProductDetail from "../pages/super_admin/AdminProductDetail";
import API from "../services/api";
import Swal from "sweetalert2";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "1" }),
    };
});

// Mock API
vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
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

describe("AdminProductDetail Page", () => {
    const mockCategories = {
        data: {
            data: [
                { id: 1, name: "Coffee" },
                { id: 2, name: "Non-Coffee" },
            ],
        },
    };

    const mockProductDetail = {
        data: {
            data: {
                id: 1,
                category_id: 2,
                name: "Iced Latte",
                description: "Espresso with milk and ice",
                base_price: 25000,
                is_active: true,
                image_url: "latte.jpg",
            },
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
        global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock-url");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("menampilkan loading saat pertama render", () => {
        API.get.mockImplementation(() => new Promise(() => {}));

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        expect(screen.getByText(/loading menu details.../i)).toBeInTheDocument();
    });

    test("menampilkan detail menu dan kategori dari API", async () => {
        API.get
            .mockResolvedValueOnce(mockProductDetail)
            .mockResolvedValueOnce(mockCategories);

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue("Iced Latte")).toBeInTheDocument();
        });

        expect(screen.getByDisplayValue("Espresso with milk and ice")).toBeInTheDocument();
        expect(screen.getByDisplayValue("25000")).toBeInTheDocument();
        expect(screen.getAllByRole("combobox")[0]).toHaveValue("2"); // category_id select
        expect(screen.getAllByRole("combobox")[1]).toHaveValue("true"); // is_active select
        
        const previewImage = screen.getByAltText("Preview");
        expect(previewImage).toBeInTheDocument();
        expect(previewImage.src).toContain("latte.jpg");
    });

    test("jika API gagal load data tampil swal error", async () => {
        API.get.mockRejectedValue(new Error("Server Error"));

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(API.get).toHaveBeenCalled();
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "error",
                title: "Gagal load data",
            })
        );
    });

    test("input fields change values correctly", async () => {
        API.get
            .mockResolvedValueOnce(mockProductDetail)
            .mockResolvedValueOnce(mockCategories);

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue("Iced Latte")).toBeInTheDocument();
        });

        const nameInput = screen.getByPlaceholderText(/e.g. Espresso Romano/i);
        fireEvent.change(nameInput, { target: { name: "name", value: "Updated Latte" } });
        expect(nameInput.value).toBe("Updated Latte");

        const descInput = screen.getByPlaceholderText(/Brief description about this coffee/i);
        fireEvent.change(descInput, { target: { name: "description", value: "Updated description" } });
        expect(descInput.value).toBe("Updated description");

        const priceInput = screen.getByPlaceholderText("0");
        fireEvent.change(priceInput, { target: { name: "base_price", value: "30000" } });
        expect(priceInput.value).toBe("30000");

        const categorySelect = screen.getAllByRole("combobox")[0];
        fireEvent.change(categorySelect, { target: { name: "category_id", value: "1" } });
        expect(categorySelect.value).toBe("1");

        const statusSelect = screen.getAllByRole("combobox")[1];
        fireEvent.change(statusSelect, { target: { name: "is_active", value: "false" } });
        expect(statusSelect.value).toBe("false");
    });

    test("handleImageFileUpload updates image preview", async () => {
        API.get
            .mockResolvedValueOnce(mockProductDetail)
            .mockResolvedValueOnce(mockCategories);

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue("Iced Latte")).toBeInTheDocument();
        });

        const file = new File(["dummy content"], "test-image.png", { type: "image/png" });
        const input = document.querySelector('input[type="file"]');
        
        fireEvent.change(input, { target: { files: [file] } });

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        const previewImage = screen.getByAltText("Preview");
        expect(previewImage.src).toBe("blob:http://localhost/mock-url");
    });

    test("submit form memanggil API post dengan FormData", async () => {
        API.get
            .mockResolvedValueOnce(mockProductDetail)
            .mockResolvedValueOnce(mockCategories);

        API.post.mockResolvedValueOnce({ data: { success: true } });

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue("Iced Latte")).toBeInTheDocument();
        });

        const saveButton = screen.getByRole("button", { name: /save changes/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(API.post).toHaveBeenCalled();
        });

        const callArgs = API.post.mock.calls[0];
        expect(callArgs[0]).toBe("/api/admin/menu-items/1");
        
        const calledFormData = callArgs[1];
        expect(calledFormData).toBeInstanceOf(FormData);
        expect(calledFormData.get("category_id")).toBe("2");
        expect(calledFormData.get("name")).toBe("Iced Latte");
        expect(calledFormData.get("description")).toBe("Espresso with milk and ice");
        expect(calledFormData.get("base_price")).toBe("25000");
        expect(calledFormData.get("is_active")).toBe("1");
        expect(calledFormData.get("_method")).toBe("PUT");

        expect(callArgs[2]).toEqual({
            headers: { "Content-Type": "multipart/form-data" },
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "success",
                title: "Berhasil",
                text: "Menu berhasil diupdate",
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith("/superadmin/item-menu");
    });

    test("jika API update gagal tampil swal error", async () => {
        API.get
            .mockResolvedValueOnce(mockProductDetail)
            .mockResolvedValueOnce(mockCategories);

        API.post.mockRejectedValueOnce(new Error("Update failed"));

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue("Iced Latte")).toBeInTheDocument();
        });

        const saveButton = screen.getByRole("button", { name: /save changes/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(API.post).toHaveBeenCalled();
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "error",
                title: "Gagal update data",
            })
        );
    });

    test("delete menu memanggil API delete dan redirect", async () => {
        API.get
            .mockResolvedValueOnce(mockProductDetail)
            .mockResolvedValueOnce(mockCategories);

        API.delete.mockResolvedValueOnce({ data: { success: true } });

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue("Iced Latte")).toBeInTheDocument();
        });

        const deleteButton = screen.getByRole("button", { name: /delete menu/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(API.delete).toHaveBeenCalledWith("/api/admin/menu-items/1");
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "success",
                title: "Menu Deleted",
                text: "Iced Latte berhasil dihapus",
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith("/superadmin/item-menu");
    });

    test("jika API delete gagal tampil swal error", async () => {
        API.get
            .mockResolvedValueOnce(mockProductDetail)
            .mockResolvedValueOnce(mockCategories);

        API.delete.mockRejectedValueOnce(new Error("Delete failed"));

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue("Iced Latte")).toBeInTheDocument();
        });

        const deleteButton = screen.getByRole("button", { name: /delete menu/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(API.delete).toHaveBeenCalled();
        });

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "error",
                title: "Gagal menghapus menu",
            })
        );
    });

    test("navigation back when clicking back button", async () => {
        API.get
            .mockResolvedValueOnce(mockProductDetail)
            .mockResolvedValueOnce(mockCategories);

        render(
            <MemoryRouter>
                <AdminProductDetail />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue("Iced Latte")).toBeInTheDocument();
        });

        const backButton = screen.getAllByRole("button")[0];
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});

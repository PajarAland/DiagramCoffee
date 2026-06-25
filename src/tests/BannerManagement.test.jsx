import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import BannerManagement from "../pages/super_admin/BannerManagement";
import API from "../services/api";
import Swal from "sweetalert2";

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(() =>
            Promise.resolve({
                isConfirmed: true,
            })
        ),
    },
}));

describe("BannerManagement Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        API.get.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 1,
                        title: "Promo Kopi",
                        description: "Diskon 50%",
                        image_url: "banner.jpg",
                        is_active: true,
                        sort_order: 1,
                    },
                ],
            },
        });
    });

    test("menampilkan halaman BannerManagement", async () => {
        render(
            <BannerManagement />
        );

        expect(
            await screen.findByRole("heading", {
                name: /banner promo/i,
            })
        ).toBeInTheDocument();
    });

    test("menampilkan data banner", async () => {

        render(
            <BannerManagement />
        );

        expect(
            await screen.findByText(/promo kopi/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/diskon 50%/i)
        ).toBeInTheDocument();
    });

    test("modal tambah banner tersedia", async () => {

        render(
            <BannerManagement />
        );

        expect(
            await screen.findByText(/tambah banner/i)
        ).toBeInTheDocument();
    });

    test("klik tambah banner membuka modal", async () => {

        render(
            <BannerManagement />
        );

        fireEvent.click(
            await screen.findByText(/\+ tambah banner/i)
        );

        expect(
            screen.getByPlaceholderText(/judul banner/i)
        ).toBeInTheDocument();
    });

    test("submit tambah banner memanggil API POST", async () => {

        API.post.mockResolvedValue({
            data: {
                message: "Banner berhasil ditambahkan",
            },
        });

        render(
            <BannerManagement />
        );

        fireEvent.click(
            await screen.findByText(/\+ tambah banner/i)
        );

        fireEvent.change(
            screen.getByPlaceholderText(/judul banner/i),
            {
                target: {
                    value: "Banner Baru",
                },
            }
        );

        fireEvent.change(
            screen.getByPlaceholderText(/deskripsi/i),
            {
                target: {
                    value: "Promo terbaru",
                },
            }
        );

        fireEvent.change(
            screen.getByPlaceholderText(/sort order/i),
            {
                target: {
                    value: 1,
                },
            }
        );

        const file =
            new File(
                ["banner"],
                "banner.png",
                {
                    type: "image/png",
                }
            );

        const input =
            document.querySelector(
                'input[type="file"]'
            );

        fireEvent.change(input, {
            target: {
                files: [file],
            },
        });

        expect(
            input.files[0].name
        ).toBe("banner.png");

        fireEvent.click(
            screen.getByText(/simpan/i)
        );

        await waitFor(() => {

            expect(API.post).toHaveBeenCalled();
        });
    });

    test("membuka modal edit banner", async () => {

        render(
            <BannerManagement />
        );

        const editButtons =
            await screen.findAllByText(/edit/i);

        fireEvent.click(
            editButtons[0]
        );

        expect(
            screen.getByDisplayValue(/promo kopi/i)
        ).toBeInTheDocument();

    });

    test("submit edit banner memanggil API POST", async () => {

        API.post.mockResolvedValue({
            data: {
                success: true,
            },
        });

        render(
            <BannerManagement />
        );

        const editButtons =
            await screen.findAllByText(/edit/i);

        fireEvent.click(
            editButtons[0]
        );

        fireEvent.change(
            screen.getByDisplayValue(/promo kopi/i),
            {
                target: {
                    value: "Promo Baru",
                },
            }
        );

        fireEvent.click(
            screen.getByText(/simpan/i)
        );

        await waitFor(() => {

            expect(API.post)
                .toHaveBeenCalled();

        });

    });

    test("hapus banner memanggil API DELETE", async () => {

        API.delete.mockResolvedValue({
            data: {
                message: "Banner berhasil dihapus",
            },
        });

        render(
            <BannerManagement />
        );

        fireEvent.click(
            await screen.findByText(/hapus/i)
        );

        await waitFor(() => {

            expect(API.delete)
                .toHaveBeenCalled();

        });

    });

    test("jika API gagal tampil swal error", async () => {

        const consoleSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        API.post.mockRejectedValue(
            new Error("Server Error")
        );

        render(
            <BannerManagement />
        );

        fireEvent.click(
            await screen.findByText(/\+ tambah banner/i)
        );

        fireEvent.change(
            screen.getByPlaceholderText(/judul banner/i),
            {
                target: {
                    value: "Banner Baru",
                },
            }
        );

        fireEvent.click(
            screen.getByText(/simpan/i)
        );

        await waitFor(() => {

            expect(Swal.fire)
                .toHaveBeenCalledWith(
                    expect.objectContaining({
                        icon: "error",
                    })
                );

        });

        consoleSpy.mockRestore();

    });


    test("menampilkan empty state", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            

        render(
            <BannerManagement />
        );

        expect(
            await screen.findByText(/banner tidak tersedia/i)
        ).toBeInTheDocument();

    }); 
});
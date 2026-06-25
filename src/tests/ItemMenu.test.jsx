/// <reference types="vitest" />
/* eslint-env vitest */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import ItemMenu from "../pages/super_admin/ItemMenu.jsx";
import API from "../services/api";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () =>
            mockNavigate,
    };
});

vi.mock("../context/useAuth.jsx", () => ({
    useAuth: () => ({
        user: {
            name: "Tester",
        },
        logout: vi.fn(),
    }),
}));

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

vi.mock("../services/api");

vi.mock("../components/ui/MenuCard.jsx", () => ({
    default: ({ item, onClick }) => (
        <div data-testid={`menu-${item.id}`} onClick={() => onClick(item)}>
            <p>{item.name}</p>
            <p>Rp{item.base_price}</p>
            <p>{item.category?.name}</p>
            <button onClick={(e) => { e.stopPropagation(); item.onEdit?.(); }}>Fake Edit</button>
        </div>
    ),
}));

vi.mock("../components/ui/ModalForm.jsx", () => ({
    default: ({ isOpen, title, children, onClose, onSubmit }) => {
        if (!isOpen) return null;
        return (
            <div>
                <h1>{title}</h1>
                {children(() => { })}
                <button onClick={onSubmit}>Simpan</button>
                <button onClick={onClose}>Batal</button>
            </div>
        );
    },
}));

describe("ItemMenu Page", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("menampilkan halaman ItemMenu", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(/manajemen menu/i)
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText(/cari menu/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/tambah menu/i)
        ).toBeInTheDocument();

    });

    test("menampilkan data menu", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: [
                        {
                            id: 1,
                            name: "Americano",
                            base_price: 20000,
                            category: {
                                name: "Coffee",
                            },
                        },
                    ],
                },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        expect(
            await screen.findByText("Americano")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Coffee")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/rp20000/i)
        ).toBeInTheDocument();

    });

    test("modal add menu tersedia", async () => {

    API.get
        .mockResolvedValueOnce({
            data: { data: [] },
        })
        .mockResolvedValueOnce({
            data: {
                data: [
                    {
                        id: 1,
                        name: "Coffee",
                    },
                ],
            },
        });

    render(
        <MemoryRouter>
            <ItemMenu />
        </MemoryRouter>
    );

    await screen.findByText(/tambah menu/i);

    expect(
        screen.queryByRole("heading", {
            name: /tambah menu/i,
        })
    ).not.toBeInTheDocument();

});

    test("klik tambah menu membuka modal", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [
                        {
                            id: 1,
                            name: "Coffee",
                        },
                    ],
                },
            });

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        expect(
            screen.getAllByText(/tambah menu/i)[1]
        ).toBeInTheDocument();

    });

    test("submit add menu memanggil API POST", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: {
                    data: [
                        {
                            id: 1,
                            name: "Coffee",
                        },
                    ],
                },
            });

        API.post.mockResolvedValue({
            data: {
                success: true,
            },
        });

        API.get.mockResolvedValueOnce({
    data: {
        data: [],
    },
});

        Swal.fire.mockResolvedValue({
            isConfirmed: true,
        });

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        fireEvent.click(
            screen.getByText(/simpan/i)
        );

        await waitFor(() => {

            expect(API.post)
                .toHaveBeenCalled();

        });

        expect(Swal.fire)
            .toHaveBeenCalled();

    });

    test("dirty form memunculkan confirm", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        expect(
            screen.getByRole("heading", {
                name: /tambah menu/i,
            })
        ).toBeInTheDocument();

    });

    test("cancel modal menutup modal", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        fireEvent.click(
            screen.getByText(/batal/i)
        );

        await waitFor(() => {

            expect(
                screen.queryByRole("heading", {
                    name: /tambah menu/i,
                })
            ).not.toBeInTheDocument();

        });

    });

    test("jika API gagal tampil swal error", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        API.post.mockRejectedValue(
            new Error("Server Error")
        );

        Swal.fire
            .mockResolvedValueOnce({
                isConfirmed: true,
            })
            .mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        fireEvent.click(
            await screen.findByText(/tambah menu/i)
        );

        fireEvent.click(
            screen.getByText(/simpan/i)
        );

        const file =
            new File(
                ["menu"],
                "menu.png",
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
            screen.getByText(
                /gambar siap diupload/i
            )
        ).toBeInTheDocument();

        await waitFor(() => {

            expect(Swal.fire)
                .toHaveBeenCalledWith(
                    expect.objectContaining({
                        icon: "error",
                    })
                );
        });
    });

    test("loading state ditampilkan", () => {

        API.get.mockImplementation(
            () => new Promise(() => {})
        );

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        expect(
            screen.getByText(
                /loading menu items/i
            )
        ).toBeInTheDocument();

    });

    test("menampilkan empty state", async () => {

        API.get
            .mockResolvedValueOnce({
                data: { data: [] },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        expect(
            await screen.findByText(/menu tidak ditemukan/i)
        ).toBeInTheDocument();

    });

    test("search filter bekerja", async () => {

        API.get
            .mockResolvedValueOnce({
                data: {
                    data: [
                        {
                            id: 1,
                            name: "Americano",
                            base_price: 20000,
                            category: {
                                name: "Coffee",
                            },
                        },
                        {
                            id: 2,
                            name: "Matcha Latte",
                            base_price: 25000,
                            category: {
                                name: "Non Coffee",
                            },
                        },
                    ],
                },
            })
            .mockResolvedValueOnce({
                data: { data: [] },
            });

        render(
            <MemoryRouter>
                <ItemMenu />
            </MemoryRouter>
        );

        await screen.findByText("Americano");

        const input =
            screen.getByPlaceholderText(/cari menu/i);

        fireEvent.change(input, {
            target: {
                value: "matcha",
            },
        });

        expect(
            screen.getByText("Matcha Latte")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Americano")
        ).not.toBeInTheDocument();

    });

});
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../pages/admin/Dashboard";
import API from "../services/api";

vi.mock("../services/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

vi.mock("sweetalert2", () => ({
    default: {
        fire: vi.fn(),
    },
}));

vi.mock("../context/useAuth", () => ({
    useAuth: () => ({
        user: {
            role: "super_admin",
        },
    }),
}));

vi.mock("recharts", async () => {
    const React = await import("react");
    return {
        ResponsiveContainer: ({ children }) => React.createElement("div", {}, children),
        LineChart: ({ children }) => React.createElement("div", {}, children),
        Line: () => React.createElement("div"),
        CartesianGrid: () => React.createElement("div"),
        XAxis: () => React.createElement("div"),
        YAxis: () => React.createElement("div"),
        Tooltip: () => React.createElement("div"),
        BarChart: ({ children }) => React.createElement("div", {}, children),
        Bar: () => React.createElement("div"),
    };
});

describe("Dashboard Page", () => {
    const mockStatistics = {
        today_transactions: 12,
        today_revenue: 450000,
        daily_revenue: [
            {
                date: "2026-05-18",
                revenue: 120000,
                transaction_count: 3,
            },

            {
                date: "2026-05-19",
                revenue: 180000,
                transaction_count: 5,
            },
        ],
        top_menus: [
            {
                menu_item_id: 1,
                menu_item_name:
                    "Americano",
                total_sold: 22,
                total_sales: 440000,
            },

            {
                menu_item_id: 2,
                menu_item_name:
                    "Latte",
                total_sold: 14,
                total_sales: 350000,
            },
        ],
    };

    const mockBranches = [
        {
            id: 1,
            name: "Diagram Dago",
        },

        {
            id: 2,
            name: "Diagram Braga",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        API.get.mockImplementation((url) => {
            if (url.includes("/statistics")) {
                return Promise.resolve(
                    {
                        data: {
                            data: mockStatistics,
                        },
                    }
                );
            }
            if (url.includes("/admin/branches")) {
                return Promise.resolve(
                    {
                        data: {
                            data: mockBranches,
                        },
                    }
                );
            }
            return Promise.reject(new Error("Unknown endpoint"));
        });
    });

    it("renders loading state", () => {
        render(
            <Dashboard />
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("renders dashboard title", async () => {
        render(
            <Dashboard />
        );
        expect(await screen.findByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
    });

    it("renders today transactions", async () => {
        render(
            <Dashboard />
        );
        expect(await screen.findByText("12")).toBeInTheDocument();
    });

    it("renders revenue correctly", async () => {
        render(
            <Dashboard />
        );
        expect(await screen.findByText(/450.000/i)).toBeInTheDocument();
    });

    it("renders top menu", async () => {
        render(
            <Dashboard />
        );
        expect(await screen.findByText(/americano/i)).toBeInTheDocument();
    });

    it("renders branch options", async () => {
        render(
            <Dashboard />
        );
        expect(await screen.findByText(/diagram dago/i)).toBeInTheDocument();
        expect(screen.getByText(/diagram braga/i)).toBeInTheDocument();
    });

    it("changes days filter", async () => {
        render(
            <Dashboard />
        );
        const selects = await screen.findAllByRole("combobox");
        fireEvent.change(selects[0], { target: { value: "30" } });
        await waitFor(() => {
            expect(API.get).toHaveBeenCalledWith(expect.stringContaining("days=30"));
        });
    });

    it("changes branch filter", async () => {
        render(
            <Dashboard />
        );
        const selects = await screen.findAllByRole("combobox");
        fireEvent.change(
            selects[1],
            {
                target: {
                    value: "2",
                },
            }
        );
        await waitFor(() => {
            expect(API.get).toHaveBeenCalledWith(expect.stringContaining("branch_id=2"));
        });
    });

    it("calculates average transaction", async () => {
        render(
            <Dashboard />
        );
        expect(await screen.findByText(/37.500/i)).toBeInTheDocument();
    });

    it("renders chart section titles", async () => {
        render(
            <Dashboard />
        );
        expect(await screen.findByText(/revenue trend/i)).toBeInTheDocument();
        expect(screen.getByText(/top selling menu/i)).toBeInTheDocument();
    });
});
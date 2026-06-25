import { useCallback, useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useAuth } from "../../context/useAuth";

function Dashboard() {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === "super_admin";   
    const [stats, setStats] = useState(null);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [selectedBranch, setSelectedBranch] = useState("");
        
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const requests = [
                API.get(`/api/admin/statistics?days=${days}${selectedBranch ? `&branch_id=${selectedBranch}` : ""}`)
            ];

            if (isSuperAdmin) {
                requests.push(API.get("/api/admin/branches"));
            }

            const responses = await Promise.all(requests);
            const statsRes = responses[0];
            const branchRes = responses[1];
                
            setStats(statsRes.data.data);
            if (branchRes) {
                setBranches(branchRes.data.data || []);
            }
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal mengambil statistik",
            });
        } finally {
            setLoading(false);
        }
    }, [days, selectedBranch, isSuperAdmin]);

    useEffect(() => {
        const load =
            async () => {
                await fetchData();
            };
        load();
    }, [fetchData]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price || 0);
    };

    const averageTransaction = stats?.today_transactions ? stats.today_revenue / stats.today_transactions : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-500 mt-2">Statistik penjualan Diagram Coffee</p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="px-4 py-3 rounded-xl border bg-white"
                        >
                            <option value={7}>7 Hari</option>
                            <option value={14}>14 Hari</option>
                            <option value={30}>30 Hari</option>
                        </select>

                        {isSuperAdmin && (
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="px-4 py-3 rounded-xl border bg-white"
                            >
                                <option value="">Semua Cabang</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-3xl p-6 shadow-lg">
                        <p className="text-gray-500 text-sm">Transaksi Hari Ini</p>
                        <h2 className="text-4xl font-bold mt-3 text-gray-800">
                            {stats.today_transactions}
                        </h2>
                    </div>

                    <div className="bg-gradient-to-r from-[#2F5231] to-[#1e3a20] text-white rounded-3xl p-6 shadow-xl min-w-0">
                        <p className="text-white/70 text-sm">Revenue Hari Ini</p>
                        <h2 className="text-3xl font-bold mt-3">
                            {formatPrice(stats.today_revenue)}
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-lg">
                        <p className="text-gray-500 text-sm">Avg Transaction</p>
                        <h2 className="text-2xl font-bold mt-3 text-gray-800">
                            {formatPrice(averageTransaction)}
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-lg">
                        <p className="text-gray-500 text-sm">Top Menu</p>
                        <h2 className="text-2xl font-bold mt-3 text-gray-800">
                            {stats.top_menus?.[0]?.menu_item_name || "-"}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl p-6 shadow-lg">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Revenue Trend</h2>
                            <p className="text-gray-500 text-sm mt-1">Revenue harian</p>
                        </div>

                        <div className="w-full">
                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={stats.daily_revenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="revenue" stroke="#2F5231" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-lg min-w-0">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Top Selling Menu</h2>
                            <p className="text-gray-500 text-sm mt-1">Menu paling laris</p>
                        </div>

                        <div className="w-full">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={stats.top_menus}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="menu_item_name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="total_sold" fill="#2F5231" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
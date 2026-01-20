import { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { menuAPI, statsAPI } from '../../utils/api';

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState({
        totalOrders: 0,
        revenue: 0,
        activeOrders: 0,
        menuItems: 0
    });
    const user = JSON.parse(localStorage.getItem('user'));
    const activeOrders = []; // To be implemented with real orders logic later

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statsAPI.getAdminStats();
                setStatsData(response.data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Total Orders', value: statsData.totalOrders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', trend: 'Live' },
        { label: 'Total Revenue', value: `₹${statsData.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-50 text-green-600', trend: 'Live' },
        { label: 'Active Orders', value: statsData.activeOrders, icon: Clock, color: 'bg-orange-50 text-orange-600', trend: 'Live' },
        { label: 'Menu Items', value: statsData.menuItems, icon: CheckCircle, color: 'bg-purple-50 text-purple-600', trend: 'Active' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{user?.restaurantName || 'Restaurant'} Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'Admin'}! Manage your orders and track performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-44">
                        <div className="flex justify-between items-start">
                            <div className={`${stat.color} p-4 rounded-2xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Active Orders List */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col min-h-[500px]">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Active Orders</h2>
                        <button className="text-[#FD6941] text-sm font-bold hover:underline">View All</button>
                    </div>

                    {activeOrders.length > 0 ? (
                        <div className="space-y-4">
                            {/* Order items would go here */}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">No Active Orders</h3>
                            <p className="text-gray-500 text-sm max-w-xs mt-1">
                                When customers place orders, they will appear here in real-time.
                            </p>
                        </div>
                    )}
                </div>

                {/* Performance Summary Card */}
                <div className="bg-[#1A1C1E] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FD6941] rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>

                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#FD6941]" />
                        Today Orders Complete
                    </h2>

                    <div className="space-y-8">
                        <div className="flex items-end gap-3">
                            <span className="text-6xl font-bold">124</span>
                            <span className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-xs">Total</span>
                        </div>

                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FD6941] w-[85%] rounded-full shadow-[0_0_15px_rgba(253,105,65,0.5)]"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dine-in</p>
                                <p className="text-xl font-bold">86</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Takeaway</p>
                                <p className="text-xl font-bold">38</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-12 py-4 rounded-2xl bg-[#FD6941] text-white font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                        View Detailed Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

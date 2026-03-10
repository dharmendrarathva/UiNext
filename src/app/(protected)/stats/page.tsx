"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCube,
  HiOutlineEye,
  HiOutlineHeart,
  HiOutlineStar,
  HiOutlineTrendingUp,
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineRefresh,
  HiOutlineCalendar,
  HiOutlineFilter,
  HiOutlineDownload,
  
} from "react-icons/hi";
import { FaRegHeart,FaEye,FaRegStar  } from "react-icons/fa";
import CountUp from "react-countup";
import { format, subDays } from "date-fns";

interface StatsData {
  totals: {
    products: number;
    views: number;
    likes: number;
    favorites: number;
    revenue?: number;
    conversionRate?: number;
  };
  products: {
    title: string;
    viewsCount: number;
        favoritesCount?: number;  // Changed from savesCount to favoritesCount

    likesCount?: number;
    trend?: number;
  }[];
  categories: {
    name: string;
    views: number;
    color?: string;
  }[];
  timeline?: {
    date: string;
    views: number;
    likes: number;
  }[];
}

const COLORS = [
  '#404040', // neutral-700
  '#525252', // neutral-600
  '#737373', // neutral-500
  '#A3A3A3', // neutral-400
  '#52525B', // zinc-600
  '#71717A', // zinc-500
  '#A1A1AA', // zinc-400
  '#D4D4D8'  // zinc-300
];
export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'products' | 'categories'>('overview');

  async function loadStats() {
    try {
      const res = await fetch(`/api/stats?range=${timeRange}`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Stats fetch error:", error);
      setData({
        totals: { 
          products: 0, 
          views: 0, 
          likes: 0, 
          favorites: 0,
          revenue: 0,
          conversionRate: 0
        },
        products: [],
        categories: [],
        timeline: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStats();
  };

  const handleExport = () => {
    // Export functionality
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `stats-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Statistics</h2>
          <p className="text-neutral-400 mb-6">Unable to fetch the latest statistics</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="px-6 py-3 bg-yellow-400 text-neutral-950 rounded-xl font-semibold"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/80 border-b border-neutral-800"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-xl">
                <HiOutlineChartBar className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Platform Analytics
                </h1>
                <p className="text-neutral-400 text-sm mt-1">
                  Real-time insights and performance metrics
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
              >
                <HiOutlineRefresh className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="p-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
              >
                <HiOutlineDownload className="w-5 h-5" />
              </motion.button>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="year">Last 12 months</option>
              </select>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-6">
            {['overview', 'products', 'categories'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedView(tab as typeof selectedView)}
                className={`px-6 py-2 rounded-xl capitalize transition-all ${
                  selectedView === tab
                    ? 'bg-yellow-400 text-neutral-950 font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <AnimatePresence mode="wait">
          {selectedView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Products"
                  value={data.totals.products}
                  icon={<HiOutlineCube />}
                  color="from-blue-500 to-cyan-500"
                  delay={0.1}
                />
                <MetricCard
                  title="Total Views"
                  value={data.totals.views}
                  icon={<HiOutlineEye />}
                  color="from-green-500 to-emerald-500"
                  delay={0.2}
                />
                <MetricCard
                  title="Total Likes"
                  value={data.totals.likes}
                  icon={<HiOutlineHeart />}
                  color="from-red-500 to-pink-500"
                  delay={0.3}
                />
                <MetricCard
                  title="Total Favorites"
                  value={data.totals.favorites}
                  icon={<HiOutlineStar />}
                  color="from-yellow-400 to-orange-500"
                  delay={0.4}
                />
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <HiOutlineTrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="font-semibold">Conversion Rate</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-400">
                    {((data.totals.likes / data.totals.views) * 100 || 0).toFixed(1)}%
                  </p>
                  <p className="text-sm text-neutral-400 mt-2">
                    Based on total views and likes
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <HiOutlineCollection className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="font-semibold">Engagement Rate</h3>
                  </div>
                  <p className="text-3xl font-bold text-yellow-400">
                    {((data.totals.favorites / data.totals.views) * 100 || 0).toFixed(1)}%
                  </p>
                  <p className="text-sm text-neutral-400 mt-2">
                    Favorites per view ratio
                  </p>
                </motion.div>
              </div>

              {/* Timeline Chart */}
              {data.timeline && data.timeline.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700"
                >
                  <h3 className="text-xl font-semibold mb-6">Activity Timeline</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.timeline}>
                        <defs>
                          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          stroke="#666"
                          tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f1f1f', 
                            border: '1px solid #333',
                            borderRadius: '12px',
                            color: '#fff'
                          }}
                          labelFormatter={(value) => format(new Date(value), 'MMMM dd, yyyy')}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="views" 
                          stroke="#FF6B6B" 
                          fillOpacity={1}
                          fill="url(#viewsGradient)" 
                          name="Views"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="likes" 
                          stroke="#4ECDC4" 
                          fillOpacity={1}
                          fill="url(#likesGradient)" 
                          name="Likes"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {selectedView === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Top Performing Products
              </h2>
              
   


<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
  {/* Views Chart */}
  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-[#FF6B6B]/20 rounded-lg">
        <FaEye className="w-4 h-4 text-[#FF6B6B]" />
      </div>
      <h3 className="text-sm font-medium text-white">Top Products by Views</h3>
    </div>
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.products} layout="horizontal">
          <XAxis 
            dataKey="title" 
            stroke="#666"
            tick={{ fill: '#fff', angle: -45, textAnchor: 'end' }}
            height={80}
            interval={0}
          />
          <YAxis 
            type="number" 
            stroke="#666"
            tick={{ fill: '#fff' }}
          />
          
          <Bar dataKey="viewsCount" fill="#FF6B6B" radius={[4, 4, 0, 0]}>
            {data.products.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`hsl(${0 + index * 15}, 70%, 60%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Likes Chart */}
  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-[#4ECDC4]/20 rounded-lg">
        <FaRegHeart className="w-4 h-4 text-[#4ECDC4]" />
      </div>
      <h3 className="text-sm font-medium text-white">Top Products by Likes</h3>
    </div>
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.products} layout="horizontal">
          <XAxis 
            dataKey="title" 
            stroke="#666"
            tick={{ fill: '#fff', angle: -45, textAnchor: 'end' }}
            height={80}
            interval={0}
          />
          <YAxis 
            type="number" 
            stroke="#666"
            tick={{ fill: '#fff' }}
          />
        
          <Bar dataKey="likesCount" fill="#4ECDC4" radius={[4, 4, 0, 0]}>
            {data.products.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`hsl(${170 + index * 15}, 70%, 60%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Favorites Chart */}
  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 bg-[#FFD93D]/20 rounded-lg">
        <FaRegStar className="w-4 h-4 text-[#FFD93D]" />
      </div>
      <h3 className="text-sm font-medium text-white">Top Products by Favorites</h3>
    </div>
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.products} layout="horizontal">
          <XAxis 
            dataKey="title" 
            stroke="#666"
            tick={{ fill: '#fff', angle: -45, textAnchor: 'end' }}
            height={80}
            interval={0}
          />
          <YAxis 
            type="number" 
            stroke="#666"
            tick={{ fill: '#fff' }}
          />
         
          <Bar dataKey="favoritesCount" fill="#FFD93D" radius={[4, 4, 0, 0]}>
            {data.products.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`hsl(${50 + index * 15}, 80%, 60%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

            </motion.div>
          )}

          {selectedView === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Category Distribution
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.categories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="views"
                        >
                          {data.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f1f1f', 
                            border: '1px solid #333',
                            borderRadius: '12px',
                            color: '#fff'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.categories}>
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f1f1f', 
                            border: '1px solid #333',
                            borderRadius: '12px',
                            color: '#fff'
                          }}
                        />
                        <Bar dataKey="views" fill="#4ECDC4" radius={[4, 4, 0, 0]}>
                          {data.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Category List */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {data.categories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-neutral-800/50 backdrop-blur-sm rounded-xl p-4 border border-neutral-700 text-center"
                  >
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-2xl font-bold mt-2" style={{ color: COLORS[index % COLORS.length] }}>
                      {category.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-400">views</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, delay }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
      className="group perspective"
    >
      <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 border border-neutral-700 overflow-hidden transform-gpu transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-br ${color} bg-opacity-20 rounded-xl`}>
              <div className="text-white text-xl">
                {icon}
              </div>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-3xl opacity-20"
            >
              {icon}
            </motion.div>
          </div>
          
          <h3 className="text-neutral-400 text-sm font-medium mb-2">{title}</h3>
          
          <div className="text-3xl font-bold">
            <CountUp
              end={value}
              duration={2}
              separator=","
              delay={delay}
              className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent"
            />
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-green-400">↑ 12%</span>
            <span className="text-neutral-500">vs last period</span>
          </div>
        </div>

        {/* Shine Effect */}    
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}
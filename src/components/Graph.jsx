import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", uv: 45 },
  { name: "Tue", uv: 65 },
  { name: "Wed", uv: 60 },
  { name: "Thu", uv: 75 },
  { name: "Fri", uv: 90 },
  { name: "Sat", uv: 95 },
  { name: "Sun", uv: 60 },
];

export default function Graph() {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" aspect={2}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#1E293B"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "none",
              borderRadius: "8px",
              color: "#F8FAFC",
            }}
            itemStyle={{ color: "#F8FAFC" }}
          />

          <Area
            type="monotone"
            dataKey="uv"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

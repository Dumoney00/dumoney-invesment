
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";
import { useAllUserTransactions } from "@/hooks/useAllUserTransactions";
import { ChartContainer } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatUtils";

export const ReferralAgentsChart = () => {
  const { users } = useAllUserTransactions();
  
  // Generate mock referral data based on users
  const referralData = users.map(user => {
    // Random values for demonstration
    const referralCount = Math.floor(Math.random() * 10);
    const commission = Math.floor(Math.random() * 10000);
    
    return {
      name: user.username,
      referrals: referralCount,
      commission: commission,
    };
  }).sort((a, b) => b.referrals - a.referrals).slice(0, 6);
  
  const colors = [
    "#8B5CF6", "#EC4899", "#F97316", "#FBBF24", "#34D399", "#06B6D4"
  ];
  
  const chartConfig = {
    referrals: { label: "Referrals", color: "#8B5CF6" },
    commission: { label: "Commission", color: "#F97316" },
  };
  
  return (
    <Card className="col-span-2 bg-gray-800/50 backdrop-blur-md border-gray-700">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-medium text-gray-200">Top Referral Agents</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-80">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={referralData}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                  minTickGap={0}
                  tickFormatter={(value) => value.substring(0, 6) + "..."}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#9CA3AF" }}
                  tickLine={{ stroke: "#4B5563" }}
                  axisLine={{ stroke: "#4B5563" }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", borderRadius: "0.5rem" }}
                  itemStyle={{ color: "#E5E7EB" }}
                  formatter={(value, name) => {
                    if (name === "commission") {
                      return [formatCurrency(value as number), "Commission"];
                    }
                    return [value, "Referrals"];
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="referrals" 
                  name="Referrals"
                  radius={[4, 4, 0, 0]}
                >
                  {referralData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
                <Bar 
                  yAxisId="right"
                  dataKey="commission" 
                  name="Commission" 
                  radius={[4, 4, 0, 0]}
                  fill="#F97316" 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

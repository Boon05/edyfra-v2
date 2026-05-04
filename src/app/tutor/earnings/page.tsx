"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wallet, TrendingUp, ArrowDownCircle, 
  History, CreditCard, ShieldCheck, 
  ArrowUpRight, Loader2, DollarSign, Sparkles
} from "lucide-react";
import { getTutorStats } from "@/app/actions/tutor";
import { Badge } from "@/components/ui/badge";

export default function TutorEarningsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getTutorStats();
    setStats(data);
    setLoading(false);
  };

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
    }, 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[600px]">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-sans">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tightest">Your Earnings.</h1>
        <p className="text-muted-foreground text-lg font-medium">Manage your payouts and track your growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Balance Card */}
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] bg-card border border-border overflow-hidden relative">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Wallet className="h-64 w-64" />
           </div>
           <CardHeader className="p-12 pb-6 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Available Balance</p>
              <div className="flex items-end gap-3 mt-6">
                 <h2 className="text-6xl md:text-7xl font-black tracking-tightest">Ksh {stats?.totalEarnings || 0}</h2>
                 <Badge className="mb-4 bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest px-3 py-1">NET</Badge>
              </div>
           </CardHeader>
           <CardContent className="p-12 pt-0 space-y-10 relative z-10">
              <div className="flex flex-col sm:flex-row gap-4">
                 <Button 
                   onClick={handleWithdraw}
                   disabled={withdrawing || (stats?.totalEarnings || 0) < 50}
                   className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs tracking-widest uppercase shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                 >
                   {withdrawing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ArrowDownCircle className="h-5 w-5 mr-2" />}
                   Withdraw to M-Pesa
                 </Button>
                 <Button variant="outline" className="h-16 px-10 rounded-2xl border-border bg-secondary/50 hover:bg-secondary font-black text-xs tracking-widest uppercase transition-all">
                   Payment Settings
                 </Button>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                 <ShieldCheck className="h-4 w-4 text-emerald-500" />
                 Secured by Edyfra Escrow Protection
              </div>
           </CardContent>
        </Card>

        {/* Growth Stats */}
        <div className="space-y-6">
           <Card className="border-border bg-secondary/30 rounded-[2.5rem] group hover:border-primary/50 transition-all">
              <CardContent className="p-8 flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center transition-transform group-hover:scale-110">
                    <TrendingUp className="h-7 w-7" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">This Month</p>
                    <h3 className="text-2xl font-black tracking-tightest">+24%</h3>
                 </div>
              </CardContent>
           </Card>
           <Card className="border-border bg-secondary/30 rounded-[2.5rem] group hover:border-primary/50 transition-all">
              <CardContent className="p-8 flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Sparkles className="h-7 w-7" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Est. Payout</p>
                    <h3 className="text-2xl font-black tracking-tightest">Ksh 1,200</h3>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-8">
        <h2 className="text-3xl font-black tracking-tightest px-2">History</h2>
        <Card className="border-border bg-card/50 rounded-[3rem] overflow-hidden">
          <CardContent className="p-0">
             <div className="divide-y divide-border">
                {[
                  { type: "Session Payout", student: "Mercy W.", amount: "+500", date: "Today, 2:30 PM", status: "COMPLETED" },
                  { type: "Withdrawal", student: "M-Pesa Payout", amount: "-1,500", date: "Yesterday, 4:15 PM", status: "PROCESSING" },
                  { type: "Session Payout", student: "Kelvin O.", amount: "+500", date: "2 days ago", status: "COMPLETED" },
                ].map((tx, i) => (
                  <div key={i} className="p-8 flex items-center justify-between hover:bg-secondary/30 transition-all group">
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.amount.startsWith("+") ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                           {tx.amount.startsWith("+") ? <DollarSign className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
                        </div>
                        <div>
                           <p className="font-black text-lg tracking-tight">{tx.type}</p>
                           <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">{tx.student} • {tx.date}</p>
                        </div>
                     </div>
                     <div className="text-right space-y-2">
                        <p className={`font-black text-xl tracking-tightest ${tx.amount.startsWith("+") ? "text-primary" : "text-foreground"}`}>{tx.amount} Ksh</p>
                        <Badge variant="outline" className={`text-[9px] font-black border-none px-3 py-1 uppercase tracking-widest ${tx.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"}`}>
                          {tx.status}
                        </Badge>
                     </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

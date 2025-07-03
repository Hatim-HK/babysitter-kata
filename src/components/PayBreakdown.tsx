import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Calculator, TrendingUp, Star } from 'lucide-react';

interface PayBreakdownProps {
  payResult: {
    totalPay: number;
    totalHours: number;
    breakdown: Array<{
      period: string;
      hours: number;
      rate: number;
      pay: number;
    }>;
    family: string;
  };
}

const PayBreakdown = ({ payResult }: PayBreakdownProps) => {
  const familyEmojis = {
    A: '👨‍👩‍👧‍👦',
    B: '👪',
    C: '👨‍👩‍👧'
  };

  const familyColors = {
    A: 'from-purple-500 to-pink-500',
    B: 'from-blue-500 to-cyan-500',
    C: 'from-green-500 to-emerald-500'
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${familyColors[payResult.family as keyof typeof familyColors]} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <DollarSign className="h-5 w-5" />
            </div>
            Payment Breakdown
            <div className="ml-auto flex items-center gap-2">
              <span className="text-2xl">{familyEmojis[payResult.family as keyof typeof familyEmojis]}</span>
              <Star className="h-4 w-4 text-yellow-300" />
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Total Pay Display */}
        <div className="text-center p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <span className="text-green-300 font-medium">Total Earnings</span>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2" data-testid="main-total-pay">
              ${payResult.totalPay.toFixed(2)}
            </div>
            <div className="flex items-center justify-center gap-3 text-green-200">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{payResult.totalHours} hours</span>
              </div>
              <div className="w-1 h-1 bg-green-300 rounded-full"></div>
              <span>Family {payResult.family}</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-medium mb-4">
            <Calculator className="h-5 w-5 text-purple-400" />
            Hourly Breakdown
          </div>
          
          <div className="space-y-3">
            {payResult.breakdown.map((item, index) => (
              <div 
                key={index} 
                className="group p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{item.period}</span>
                    <span className="text-white/60 text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.hours} hours × ${item.rate}/hr
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white text-lg" data-testid={`breakdown-item-pay-${index}`}>
                      ${item.pay.toFixed(2)}
                    </div>
                    <div className="text-xs text-white/60">
                      ${item.rate}/hr
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-white/20">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-white">{payResult.totalHours}</div>
              <div className="text-xs text-white/60">Total Hours</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-green-400">${(payResult.totalPay / payResult.totalHours).toFixed(2)}</div>
              <div className="text-xs text-white/60">Avg Rate</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-white/20">
            <span className="text-white font-semibold">Final Total:</span>
            <span className="text-2xl font-bold text-white" data-testid="summary-total-pay">
              ${payResult.totalPay.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayBreakdown;
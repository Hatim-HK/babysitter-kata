import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle, Clock, DollarSign, Users, Calculator, Moon, Sun } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TimeInput from '@/components/TimeInput';
import PayBreakdown from '@/components/PayBreakdown';
import { calculatePay } from '@/utils/payCalculator';

const Index = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [family, setFamily] = useState('');
  const [error, setError] = useState('');
  const [payResult, setPayResult] = useState(null);

  const families = [
    {
      id: 'A',
      name: 'Family A',
      description: '$15/hr before 11PM, $20/hr after',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-purple-500 to-pink-500',
      rates: [
        { time: 'before 11:00PM', rate: '$15/hr' },
        { time: 'after 11:00PM', rate: '$20/hr' }
      ]
    },
    {
      id: 'B',
      name: 'Family B',
      description: '$12/hr before 10PM, $8/hr 10PM-12AM, $16/hr after',
      icon: '👪',
      color: 'from-blue-500 to-cyan-500',
      rates: [
        { time: 'before 10:00PM', rate: '$12/hr' },
        { time: '10:00PM - 12:00AM', rate: '$8/hr' },
        { time: 'after 12:00AM', rate: '$16/hr' }
      ]
    },
    {
      id: 'C',
      name: 'Family C',
      description: '$21/hr before 9PM, $15/hr after',
      icon: '👨‍👩‍👧',
      color: 'from-green-500 to-emerald-500',
      rates: [
        { time: 'before 9:00PM', rate: '$21/hr' },
        { time: 'after 9:00PM', rate: '$15/hr' }
      ]
    }
  ];

  const handleCalculate = () => {
    setError('');
    setPayResult(null);

    if (!startTime || !endTime || !family) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const result = calculatePay(startTime, endTime, family);
      setPayResult(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const selectedFamily = families.find(f => f.id === family);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center py-8 md:py-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-75"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                  <Moon className="h-8 w-8 md:h-12 md:w-12 text-purple-300" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Babysitter Kata Pay Calculator
            </h1>
            <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Calculate your babysitting earnings with precision and style
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-purple-300">
              <Clock className="h-4 w-4" />
              <span className="text-sm">5:00 PM - 4:00 AM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white rounded-t-lg border-b border-white/20">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Calculator className="h-6 w-6" />
                    Job Details
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Enter your work hours and select a family to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  {/* Time Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="start-time" className="text-white font-medium flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-400" />
                        Start Time
                      </Label>
                      <TimeInput
                        id="start-time"
                        value={startTime}
                        onChange={setStartTime}
                        placeholder="5:00 PM"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="end-time" className="text-white font-medium flex items-center gap-2">
                        <Moon className="h-4 w-4 text-purple-400" />
                        End Time
                      </Label>
                      <TimeInput
                        id="end-time"
                        value={endTime}
                        onChange={setEndTime}
                        placeholder="12:00 AM"
                      />
                    </div>
                  </div>

                  {/* Family Selection */}
                  <div className="space-y-4">
                    <Label className="text-white font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      Family
                    </Label>
                    <Select value={family} onValueChange={setFamily}>
                      <SelectTrigger className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 hover:bg-white/20 transition-colors">
                        <SelectValue placeholder="Choose a family" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {families.map((fam) => (
                          <SelectItem key={fam.id} value={fam.id} className="text-white hover:bg-slate-700">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{fam.icon}</span>
                              <div className="flex flex-col">
                                <span className="font-medium">{fam.name}</span>
                                <span className="text-xs text-slate-400">{fam.description}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Family Rate Display */}
                  {selectedFamily && (
                    <div className={`bg-gradient-to-r ${selectedFamily?.color || ''} p-6 rounded-xl border border-white/20 shadow-lg`}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{selectedFamily.icon}</span>
                        <h4 className="font-bold text-white text-lg">{selectedFamily.name} Rates</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedFamily.rates.map((rate, index) => (
                          <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                            <div className="flex justify-between items-center">
                              <span className="text-white/90 text-sm">{rate.time}</span>
                              <span className="font-bold text-white text-lg">{rate.rate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <Alert variant="destructive" className="bg-red-500/20 border-red-400/50 text-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Calculate Button */}
                  <Button 
                    onClick={handleCalculate} 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    size="lg"
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    Calculate My Earnings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results and Info */}
            <div className="space-y-6">
              {payResult && (
                <div className="transform transition-all duration-500 animate-in slide-in-from-right">
                  <PayBreakdown payResult={payResult} />
                </div>
              )}
              
              {/* Instructions Card */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></div>
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Clock, text: "Work hours must be between 5:00 PM and 4:00 AM" },
                    { icon: Calculator, text: "Payment calculated for full hours only" },
                    { icon: Users, text: "Each family has different hourly rates" },
                    { icon: Moon, text: "Midnight crossover handled automatically" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="mt-0.5">
                        <item.icon className="h-4 w-4 text-purple-300" />
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
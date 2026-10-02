import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Repeat,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowUpRight,
  Share2,
  Copy,
  Check,
  Calculator,
  Percent,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';

interface MerchantRoiSimulatorProps {
  language: Language;
  businessName?: string;
}

export const MerchantRoiSimulator: React.FC<MerchantRoiSimulatorProps> = ({
  language,
  businessName = 'Tu Negocio Local',
}) => {
  const isEs = language === 'es';

  // Input States (values in MXN)
  const [avgTicket, setAvgTicket] = useState<number>(380); // $380 MXN
  const [monthlyCustomers, setMonthlyCustomers] = useState<number>(450); // 450 customers/mo
  const [retentionLift, setRetentionLift] = useState<number>(25); // +25% repeat visits
  const [rewardCost, setRewardCost] = useState<number>(55); // $55 MXN COGS of free item
  const [thirdPartyCommission, setThirdPartyCommission] = useState<number>(28); // 28% delivery commission comparison
  const [copied, setCopied] = useState(false);

  // Calculations
  const metrics = useMemo(() => {
    // Current Monthly Base
    const currentMonthlyGross = monthlyCustomers * avgTicket;

    // With Loyalty Program:
    // Portion of customers that return an extra time per month due to punch card incentive
    const additionalVisits = Math.round(monthlyCustomers * (retentionLift / 100));
    const grossRevenueUplift = additionalVisits * avgTicket;

    // Cost of rewards issued (assumes 1 reward per 8-10 visits)
    const rewardsIssued = Math.floor((monthlyCustomers + additionalVisits) / 9);
    const totalRewardCost = rewardsIssued * rewardCost;

    // Net Monthly Profit Gain
    const netMonthlyProfit = grossRevenueUplift - totalRewardCost;
    const netAnnualProfit = netMonthlyProfit * 12;

    // Aggregator Commission Saved (vs paying 28% on those orders to third parties)
    const savedAggregatorFees = Math.round(grossRevenueUplift * (thirdPartyCommission / 100));

    // Return on Investment multiple (ROI on PlayaVida $0 commission model)
    const annualRoiPercentage = Math.round((netAnnualProfit / (totalRewardCost * 12 || 1)) * 100);

    return {
      currentMonthlyGross,
      additionalVisits,
      grossRevenueUplift,
      rewardsIssued,
      totalRewardCost,
      netMonthlyProfit,
      netAnnualProfit,
      savedAggregatorFees,
      annualRoiPercentage,
    };
  }, [avgTicket, monthlyCustomers, retentionLift, rewardCost, thirdPartyCommission]);

  const handleCopySummary = () => {
    const text = isEs
      ? `📊 Simulación ROI de Lealtad PlayaVida (${businessName}):\n` +
        `• Ticket Promedio: $${avgTicket} MXN\n` +
        `• Clientes Mensuales: ${monthlyCustomers}\n` +
        `• Incremento en Retención: +${retentionLift}%\n` +
        `• Visitas Adicionales/mes: +${metrics.additionalVisits}\n` +
        `• Ingresos Brutos Extra: +$${metrics.grossRevenueUplift.toLocaleString()} MXN/mes\n` +
        `• Beneficio Neto Anual Proyectado: +$${metrics.netAnnualProfit.toLocaleString()} MXN/año\n` +
        `• Ahorro en Comisiones de Terceros: $${metrics.savedAggregatorFees.toLocaleString()} MXN/mes`
      : `📊 PlayaVida Loyalty ROI Simulation (${businessName}):\n` +
        `• Average Ticket: $${avgTicket} MXN\n` +
        `• Monthly Customers: ${monthlyCustomers}\n` +
        `• Retention Lift: +${retentionLift}%\n` +
        `• Extra Monthly Visits: +${metrics.additionalVisits}\n` +
        `• Gross Revenue Uplift: +$${metrics.grossRevenueUplift.toLocaleString()} MXN/mo\n` +
        `• Projected Annual Net Profit: +$${metrics.netAnnualProfit.toLocaleString()} MXN/yr\n` +
        `• Third-Party Commission Saved: $${metrics.savedAggregatorFees.toLocaleString()} MXN/mo`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>{isEs ? 'Calculadora Financiera para Negocios' : 'Merchant Financial Calculator'}</span>
          </div>
          <h3 className="font-['Outfit',sans-serif] text-2xl font-bold text-stone-900">
            {isEs ? 'Simulador de Retención & Retorno de Inversión (ROI)' : 'Retention & Merchant ROI Simulator'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">
            {isEs
              ? 'Calcula cómo un programa de sellos y lealtad nativo transforma clientes casuales en clientes habituales recurrentes.'
              : 'Estimate how native digital punch cards turn one-time visitors into high-LTV loyal customers.'}
          </p>
        </div>

        <button
          onClick={handleCopySummary}
          className="self-start sm:self-auto py-2 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-teal-50 hover:border-teal-300 text-stone-700 hover:text-teal-800 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">{isEs ? 'Copiado al Portapapeles' : 'Copied to Clipboard'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>{isEs ? 'Copiar Resumen Financiero' : 'Copy Financial Summary'}</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: Inputs (Left) vs Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Average Ticket */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <label className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-teal-700" />
                <span>{isEs ? 'Ticket Promedio por Consumo (MXN)' : 'Average Ticket Size (MXN)'}</span>
              </label>
              <span className="font-mono font-bold text-sm text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                ${avgTicket.toLocaleString()} MXN
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="2000"
              step="20"
              value={avgTicket}
              onChange={(e) => setAvgTicket(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>$80 (Café/Snack)</span>
              <span>$400 (Almuerzo)</span>
              <span>$1,200+ (Cena/Club)</span>
            </div>
          </div>

          {/* Slider 2: Monthly Unique Customers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <label className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-700" />
                <span>{isEs ? 'Clientes Únicos Mensuales Estimados' : 'Estimated Unique Monthly Customers'}</span>
              </label>
              <span className="font-mono font-bold text-sm text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                {monthlyCustomers.toLocaleString()} {isEs ? 'clientes' : 'customers'}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={monthlyCustomers}
              onChange={(e) => setMonthlyCustomers(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>100 (Boutique)</span>
              <span>800 (Restaurante activo)</span>
              <span>2,500+ (Cadena / Club)</span>
            </div>
          </div>

          {/* Slider 3: Retention Lift */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <label className="flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-teal-700" />
                <span>{isEs ? 'Aumento en Visitas Recurrentes (%)' : 'Repeat Visit Frequency Lift (%)'}</span>
              </label>
              <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                +{retentionLift}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={retentionLift}
              onChange={(e) => setRetentionLift(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>+10% (Conservador)</span>
              <span>+25% (Estándar digital)</span>
              <span>+50% (Gamificado)</span>
            </div>
          </div>

          {/* Slider 4: Cost of Reward item */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <label className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>{isEs ? 'Costo Real del Premio / Recompensa (COGS)' : 'Cost of Free Reward Item (COGS)'}</span>
              </label>
              <span className="font-mono font-bold text-sm text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                ${rewardCost} MXN
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              step="5"
              value={rewardCost}
              onChange={(e) => setRewardCost(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <p className="text-[11px] text-stone-400">
              {isEs
                ? 'El costo de producción para el negocio del producto otorgado (ej. café, postre o coctel).'
                : 'Your cost of ingredients/production for the item given away after 10 stamps.'}
            </p>
          </div>

          {/* Comparison Slider: Third-party Delivery / Aggregator Commission */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <label className="flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-stone-500" />
                <span>{isEs ? 'Comisión Habitual de Plataformas de Entrega' : 'Typical Third-Party Aggregator Fee'}</span>
              </label>
              <span className="font-mono font-bold text-sm text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200">
                {thirdPartyCommission}%
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="35"
              step="1"
              value={thirdPartyCommission}
              onChange={(e) => setThirdPartyCommission(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
            />
          </div>
        </div>

        {/* Financial Results Dashboard (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Profit Card */}
          <motion.div
            layout
            className="p-6 rounded-3xl bg-gradient-to-br from-teal-900 via-stone-900 to-stone-950 text-white shadow-xl border border-teal-700/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  {isEs ? 'Beneficio Anual Proyectado' : 'Projected Annual Net Gain'}
                </span>
                <span className="text-[11px] font-mono py-0.5 px-2 bg-teal-500/20 text-teal-300 rounded-md border border-teal-400/30">
                  +{(metrics.annualRoiPercentage).toLocaleString()}% ROI
                </span>
              </div>

              <div>
                <div className="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-extrabold text-white">
                  +${metrics.netAnnualProfit.toLocaleString()} <span className="text-sm font-normal text-teal-200">MXN</span>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  {isEs
                    ? 'Beneficio neto extra anual directo al bolsillo de tu negocio.'
                    : 'Direct net additional profit added to your bottom line per year.'}
                </p>
              </div>

              {/* Monthly Breakdown Rows */}
              <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex justify-between items-center text-stone-300">
                  <span>{isEs ? 'Ingresos brutos extra / mes:' : 'Extra gross monthly revenue:'}</span>
                  <span className="font-bold text-white font-mono">
                    +${metrics.grossRevenueUplift.toLocaleString()} MXN
                  </span>
                </div>

                <div className="flex justify-between items-center text-stone-300">
                  <span>{isEs ? 'Visitas adicionales ganadas / mes:' : 'Extra repeat visits / month:'}</span>
                  <span className="font-bold text-teal-300 font-mono">
                    +{metrics.additionalVisits} {isEs ? 'visitas' : 'visits'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-stone-400">
                  <span>{isEs ? 'Costo en premios otorgados / mes:' : 'Cost of rewards issued / mo:'}</span>
                  <span className="font-mono text-stone-300">
                    -${metrics.totalRewardCost.toLocaleString()} MXN
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Aggregator Fee Savings Card */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>{isEs ? 'Ahorro vs Plataformas de Terceros' : 'Saved Third-Party Commissions'}</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-800">
                ${metrics.savedAggregatorFees.toLocaleString()} MXN/mes
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {isEs
                ? `Al fidelizar a tus comensales directamente con tu tarjeta QR PlayaVida (sin comisiones del ${thirdPartyCommission}%), ahorras aproximadamente $${(metrics.savedAggregatorFees * 12).toLocaleString()} MXN anuales en intermediarios.`
                : `By owning your customers with direct digital passes (0% PlayaVida commission), you save ~$${(metrics.savedAggregatorFees * 12).toLocaleString()} MXN annually on third-party aggregators.`}
            </p>
          </div>

          {/* Platform Zero-Commission Guarantee */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
            <span className="font-bold text-stone-900 block">
              {isEs ? '✓ Política de Cero Comisiones PlayaVida' : '✓ PlayaVida 0% Commission Policy'}
            </span>
            <p className="text-[11px] text-stone-500">
              {isEs
                ? 'PlayaVida no procesa tus pagos ni cobra porcentaje sobre el ticket de tus clientes. Cada peso ganado queda 100% en tu negocio.'
                : 'PlayaVida never takes a cut of your customer checks. Every peso generated stays 100% in your register.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

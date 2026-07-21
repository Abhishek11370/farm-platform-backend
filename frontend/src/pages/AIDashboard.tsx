import React from 'react';
import { useAI } from '../hooks/useAI';
import { Brain, TrendingUp, AlertCircle, Sprout, BarChart2, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AIDashboard() {
  const { insights } = useAI();

  const renderContent = () => {
    // Loading state
    if (insights.isLoading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-4 ${i === 2 ? 'lg:col-span-2' : ''}`}
            >
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      );
    }

    // Error state
    if (insights.isError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Failed to load AI insights</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {(insights.error as any)?.message ?? 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => insights.refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      );
    }

    const data = insights.data;

    // Empty/null data guard — show a message instead of blank or infinite spinner
    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Brain className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">No AI insights available</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Insights will appear once the platform has sufficient data.</p>
          <button
            onClick={() => insights.refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Prediction */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Price Prediction</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Market Trend</div>
              <div
                className={`text-xl font-bold ${
                  data.pricePrediction?.trend === 'UPWARD' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {data.pricePrediction?.trend ?? 'STABLE'}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex gap-3">
              <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {data.pricePrediction?.message ?? 'Market analysis is currently unavailable.'}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">AI Confidence Score</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.pricePrediction?.confidence ?? 0}%
              </span>
            </div>

            {/* Confidence bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.pricePrediction?.confidence ?? 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Demand Forecast */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <BarChart2 size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Demand Forecast</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Demand Level</div>
              <div
                className={`text-xl font-bold ${
                  data.demandForecast?.level === 'HIGH'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}
              >
                {data.demandForecast?.level ?? 'MODERATE'}
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl flex gap-3">
              <AlertCircle className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-orange-800 dark:text-orange-300">
                {data.demandForecast?.message ?? 'Demand analysis is currently unavailable.'}
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trending Products:</div>
              {data.demandForecast?.hotProducts?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.demandForecast.hotProducts.map((p: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">No trending products yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Crop Recommendation */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <Sprout size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Crop Recommendations</h2>
            {data.lastUpdated && (
              <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl flex gap-3">
              <AlertCircle className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-green-800 dark:text-green-300">
                {data.cropRecommendation?.message ?? 'Crop recommendations will appear based on platform activity.'}
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Suggested for {data.cropRecommendation?.season ?? 'Upcoming'} Season:
              </div>
              {data.cropRecommendation?.suggestions?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {data.cropRecommendation.suggestions.map((crop: string, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
                    >
                      <span className="text-2xl mb-1">🌱</span>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{crop}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">No crop suggestions available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="text-purple-600 dark:text-purple-500" />
            AI Engine &amp; Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Predictive analytics, demand forecasting, and smart insights based on live platform data.
          </p>
        </div>
        <button
          onClick={() => insights.refetch()}
          disabled={insights.isFetching}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={insights.isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {renderContent()}
    </div>
  );
}

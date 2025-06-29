'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ChartProps {
  children: React.ReactNode
  className?: string
}

interface ChartContainerProps {
  children: React.ReactNode
  className?: string
  config?: Record<string, any>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  className?: string
}

interface ChartLegendProps {
  payload?: any[]
  className?: string
}

// Basic Chart Container
const Chart: React.FC<ChartProps> = ({ children, className }) => (
  <div className={cn('w-full h-full', className)}>
    {children}
  </div>
)

// Chart Container with configuration
const ChartContainer: React.FC<ChartContainerProps> = ({ 
  children, 
  className, 
  config 
}) => (
  <div className={cn('w-full h-[350px]', className)}>
    {children}
  </div>
)

// Custom Tooltip Component
const ChartTooltip: React.FC<ChartTooltipProps> = ({ 
  active, 
  payload, 
  label, 
  className 
}) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className={cn(
      'rounded-lg border bg-background p-2 shadow-md',
      className
    )}>
      <div className="grid gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            {label}
          </span>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Custom Legend Component
const ChartLegend: React.FC<ChartLegendProps> = ({ payload, className }) => {
  if (!payload || !payload.length) {
    return null
  }

  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// Chart Title Component
interface ChartTitleProps {
  children: React.ReactNode
  className?: string
}

const ChartTitle: React.FC<ChartTitleProps> = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold mb-4', className)}>
    {children}
  </h3>
)

// Chart Description Component
interface ChartDescriptionProps {
  children: React.ReactNode
  className?: string
}

const ChartDescription: React.FC<ChartDescriptionProps> = ({ children, className }) => (
  <p className={cn('text-sm text-muted-foreground mb-4', className)}>
    {children}
  </p>
)

// Mock Chart Components for demonstration
interface LineChartProps {
  data: any[]
  className?: string
  children?: React.ReactNode
}

const LineChart: React.FC<LineChartProps> = ({ data, className, children }) => (
  <div className={cn('w-full h-full bg-gray-50 rounded-lg flex items-center justify-center', className)}>
    <div className="text-center">
      <div className="text-2xl mb-2">📈</div>
      <div className="text-sm text-gray-600">Line Chart</div>
      <div className="text-xs text-gray-500">{data.length} data points</div>
    </div>
    {children}
  </div>
)

interface BarChartProps {
  data: any[]
  className?: string
  children?: React.ReactNode
}

const BarChart: React.FC<BarChartProps> = ({ data, className, children }) => (
  <div className={cn('w-full h-full bg-gray-50 rounded-lg flex items-center justify-center', className)}>
    <div className="text-center">
      <div className="text-2xl mb-2">📊</div>
      <div className="text-sm text-gray-600">Bar Chart</div>
      <div className="text-xs text-gray-500">{data.length} data points</div>
    </div>
    {children}
  </div>
)

interface PieChartProps {
  data: any[]
  className?: string
  children?: React.ReactNode
}

const PieChart: React.FC<PieChartProps> = ({ data, className, children }) => (
  <div className={cn('w-full h-full bg-gray-50 rounded-lg flex items-center justify-center', className)}>
    <div className="text-center">
      <div className="text-2xl mb-2">🥧</div>
      <div className="text-sm text-gray-600">Pie Chart</div>
      <div className="text-xs text-gray-500">{data.length} data points</div>
    </div>
    {children}
  </div>
)

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartTitle,
  ChartDescription,
  LineChart,
  BarChart,
  PieChart,
  type ChartProps,
  type ChartContainerProps,
  type ChartTooltipProps,
  type ChartLegendProps,
  type ChartTitleProps,
  type ChartDescriptionProps,
  type LineChartProps,
  type BarChartProps,
  type PieChartProps
}


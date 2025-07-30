"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResponsiveGrid, ResponsiveContainer } from "@/components/layout/responsive-container"
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Layout, 
  Maximize2,
  Grid3X3
} from "lucide-react"

export function ResponsiveLayoutDemo() {
  const [currentView, setCurrentView] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  const responsiveFeatures = [
    {
      device: 'Mobile',
      icon: Smartphone,
      features: ['Single column layout', 'Touch-friendly controls', 'Collapsible navigation', 'Optimized spacing'],
      breakpoint: '< 768px'
    },
    {
      device: 'Tablet', 
      icon: Tablet,
      features: ['Two column layout', 'Adaptive grid system', 'Touch and mouse support', 'Flexible components'],
      breakpoint: '768px - 1024px'
    },
    {
      device: 'Desktop',
      icon: Monitor,
      features: ['Multi-column layout', 'Full feature set', 'Hover interactions', 'Maximum data density'],
      breakpoint: '> 1024px'
    }
  ]

  const sampleCards = [
    { title: "Revenue", value: "$45,231", color: "bg-blue-500" },
    { title: "Users", value: "12,543", color: "bg-green-500" },
    { title: "Conversions", value: "8.4%", color: "bg-purple-500" },
    { title: "Growth", value: "+23%", color: "bg-orange-500" }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Responsive Design Showcase
          </CardTitle>
          <CardDescription>
            Adaptive layouts that work seamlessly across all device sizes and orientations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Device Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {responsiveFeatures.map((device, index) => (
                <motion.div
                  key={device.device}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <device.icon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{device.device}</span>
                    <Badge variant="outline" className="text-xs">
                      {device.breakpoint}
                    </Badge>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {device.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Responsive Grid Demo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                <span className="font-medium">Responsive Grid System</span>
              </div>
              
              <ResponsiveContainer>
                <ResponsiveGrid 
                  cols={{ default: 1, sm: 2, lg: 4 }}
                  gap="md"
                >
                  {sampleCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border shadow-sm"
                    >
                      <div className={`w-8 h-8 ${card.color} rounded-lg mb-3`}></div>
                      <div className="text-2xl font-bold">{card.value}</div>
                      <div className="text-sm text-muted-foreground">{card.title}</div>
                    </motion.div>
                  ))}
                </ResponsiveGrid>
              </ResponsiveContainer>
            </div>

            {/* Responsive Features */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Maximize2 className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Responsive Features
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Layout Adaptations:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Fluid grid system</li>
                    <li>• Flexible component sizing</li>
                    <li>• Adaptive navigation</li>
                    <li>• Content prioritization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Interaction Modes:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Touch-friendly controls</li>
                    <li>• Hover state management</li>
                    <li>• Keyboard navigation</li>
                    <li>• Gesture support</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Breakpoint Information */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                Mobile First
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Grid3X3 className="h-3 w-3" />
                CSS Grid
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Layout className="h-3 w-3" />
                Flexbox
              </Badge>
              <Badge variant="secondary">
                Tailwind CSS
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
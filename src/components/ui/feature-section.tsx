"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Feature {
  step: string
  title?: string
  content: string
  image: string
}

interface FeatureStepsProps {
  features: Feature[]
  className?: string
  title?: string
  autoPlayInterval?: number
  imageHeight?: string
}

// Individual step item with scroll animation
function FeatureStepItem({
  feature,
  index,
  currentFeature,
  onClick,
}: {
  feature: Feature
  index: number
  currentFeature: number
  onClick: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-6 md:gap-8 cursor-pointer"
      initial={{ opacity: 0, x: -50 }}
      animate={{
        opacity: isInView ? (index === currentFeature ? 1 : 0.3) : 0,
        x: isInView ? 0 : -50,
      }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
          index === currentFeature
            ? "bg-[#6da7cc] border-[#6da7cc] text-white scale-110"
            : "bg-white border-[#88a9c3] text-[#345e7d]",
        )}
      >
        {index <= currentFeature ? (
          <span className="text-lg font-bold">✓</span>
        ) : (
          <span className="text-lg font-semibold">{index + 1}</span>
        )}
      </motion.div>

      <div className="flex-1">
        <h3 className="text-xl md:text-2xl font-semibold text-[#2a4358]">
          {feature.title || feature.step}
        </h3>
        <p className="text-lg md:text-xl text-[#345e7d]">
          {feature.content}
        </p>
      </div>
    </motion.div>
  )
}

export function FeatureSteps({
  features,
  className,
  title = "How to get Started",
  autoPlayInterval = 3000,
  imageHeight = "h-[400px]",
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval])

  return (
    <div className={cn("p-8 md:p-12", className)}>
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center text-[#2a4358]">
          {title}
        </h2>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="order-2 md:order-1 space-y-8">
            {features.map((feature, index) => (
              <FeatureStepItem
                key={index}
                feature={feature}
                index={index}
                currentFeature={currentFeature}
                onClick={() => {
                  setCurrentFeature(index)
                  setProgress(0)
                }}
              />
            ))}
          </div>

          <div
            className={cn(
              "order-1 md:order-2 relative h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-lg"
            )}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Image
                        src={feature.image}
                        alt={feature.step}
                        className="w-full h-full object-cover transition-transform transform"
                        width={1000}
                        height={500}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-white via-white/50 to-transparent" />
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

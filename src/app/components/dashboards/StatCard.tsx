import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

// ─── useCountUp hook ───
function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);
  const targetRef = useRef(target);
  targetRef.current = target;

  const animate = useCallback(() => {
    if (started.current) {
      return;
    }
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      setValue(Math.round(eased * targetRef.current));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      animate();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  useEffect(() => {
    if (started.current) {
      setValue(target);
    }
  }, [target]);

  return { value, ref };
}

// ─── Types ───
export interface StatCardProps {
  color: {
    icon: string;
    iconBg: string;
    spark: string;
  };
  icon: LucideIcon;
  index?: number;
  onClick?: () => void;
  sparklineData?: number[];
  title: string;
  trend?: {
    label: string;
    positive: boolean | null;
  };
  value: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  sparklineData,
  index = 0,
  onClick,
}: StatCardProps) {
  const counter = useCountUp(value, 1600 + index * 200);

  const trendBg =
    trend?.positive === true
      ? "#f0fdf4"
      : trend?.positive === false
        ? "#fef2f2"
        : "#f5f3f0";
  const trendColor =
    trend?.positive === true
      ? "#078810"
      : trend?.positive === false
        ? "#e71008"
        : "#8d785e";

  const sparkData = sparklineData?.map((v) => ({ v })) ?? [];

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex cursor-pointer flex-col gap-1 overflow-hidden rounded-xl border border-[#e7e1da] bg-white p-5 pb-2 text-right shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:border-[#d4cdc3] hover:shadow-lg"
      initial={{ opacity: 0, y: 24 }}
      onClick={onClick}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="flex items-start justify-between">
        {trend && (
          <span
            className="rounded px-2 py-1 text-[12px]"
            style={{
              backgroundColor: trendBg,
              color: trendColor,
              fontWeight: 700,
            }}
          >
            {trend.label}
          </span>
        )}
        <div
          className="flex h-[36px] w-[34px] items-center justify-center rounded-lg"
          style={{ backgroundColor: color.iconBg }}
        >
          <Icon size={18} style={{ color: color.icon }} />
        </div>
      </div>
      <p className="mt-1 text-[#8d785e] text-[14px]">{title}</p>
      <p
        className="text-[#181510] text-[30px] leading-[36px]"
        ref={counter.ref as React.Ref<HTMLParagraphElement>}
        style={{ fontWeight: 700 }}
      >
        {counter.value}
      </p>
      {sparkData.length > 0 && (
        <div
          className="-mx-2 mt-1 h-[36px] opacity-60 transition-opacity group-hover:opacity-100"
          style={{ minWidth: 0, minHeight: 36 }}
        >
          <ResponsiveContainer height={36} minWidth={50} width="100%">
            <LineChart data={sparkData}>
              <Line
                animationBegin={600 + index * 150}
                animationDuration={2000}
                dataKey="v"
                dot={false}
                isAnimationActive={true}
                stroke={color.spark}
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.button>
  );
}

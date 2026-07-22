import { MetricKey } from "../../mocks/weeklyStats.mock";

export const formatNumber = (n: number): string =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const totalDisplay = (key: MetricKey, total: number): string =>
  key === "water" ? `${(total / 1000).toFixed(1)} L` : formatNumber(total);

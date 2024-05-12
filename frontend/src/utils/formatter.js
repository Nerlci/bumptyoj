import { DateTime } from "luxon";

function getMemoryUnit(value) {
  const thresholds = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
  };
  let unit = "B";
  for (const [key, threshold] of Object.entries(thresholds)) {
    if (value >= threshold) {
      unit = key;
    } else {
      break;
    }
  }
  return { unit, threshold: thresholds[unit] };
}

export function formatTimestamp(value) {
  const dt = DateTime.fromISO(value.timestamp, { zone: "Asia/Shanghai" });
  return dt.toRelative();
}

export function formatTime(value) {
  if (value.time > 1000) {
    return `${(value.time / 1000).toFixed(2)} s`;
  } else {
    return `${value.time} ms`;
  }
}

export function formatMemory(value) {
  let length = value.memory;
  const { unit, threshold } = getMemoryUnit(length);
  length = length / threshold;
  return `${unit === "B" ? length : length.toFixed(2)} ${unit}`;
}

export function formatCodeLength(value) {
  let length = value.length;
  const { unit, threshold } = getMemoryUnit(length);
  length = length / threshold;
  return `${unit === "B" ? length : length.toFixed(2)} ${unit}`;
}

export function formatStartTime(value) {
  const dt = DateTime.fromISO(value.startTime, { zone: "Asia/Shanghai" });
  return dt.toFormat("yyyy-MM-dd HH:mm:ss");
}

export function formatEndTime(value) {
  const dt = DateTime.fromISO(value.endTime, { zone: "Asia/Shanghai" });
  return dt.toFormat("yyyy-MM-dd HH:mm:ss");
}

export function formatLongText(value) {
  const desc = value.description;
  return desc.length > 20 ? desc.slice(0, 20) + "..." : desc;
}

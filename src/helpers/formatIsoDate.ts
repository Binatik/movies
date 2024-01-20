function formatIsoDate(date: Date, type: "en-US" | "ru-RU") {
  const options = { month: "long", day: "numeric", year: "numeric" } as const;
  return date.toLocaleDateString(type, options);
}

export { formatIsoDate };

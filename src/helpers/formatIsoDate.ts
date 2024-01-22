function formatIsoDate(date: Date, type: "en-US" | "ru-RU") {
  if (!date) {
    return "Дата неизвестная";
  }

  const options = { month: "long", day: "numeric", year: "numeric" } as const;
  return date.toLocaleDateString(type, options);
}

export { formatIsoDate };

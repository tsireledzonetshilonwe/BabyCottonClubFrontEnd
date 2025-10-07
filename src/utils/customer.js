// Helper to read and normalize a stored customer object from localStorage
export function getStoredCustomer() {
  const raw = localStorage.getItem("customer");
  if (!raw) return {};
  try {
    const c = JSON.parse(raw);
    return {
      customerId: c?.customerId ?? c?.id ?? c?.userId ?? null,
      id: c?.customerId ?? c?.id ?? c?.userId ?? null,
      firstName:
        c?.firstName ?? (c?.name ? String(c.name).split(" ")[0] : "") ?? "",
      lastName:
        c?.lastName ?? (c?.name ? String(c.name).split(" ").slice(1).join(" ") : "") ?? "",
      name: c?.name ?? `${c?.firstName ?? ""} ${c?.lastName ?? ""}`.trim(),
      email: c?.email ?? c?.username ?? "",
      phoneNumber: c?.phoneNumber ?? c?.phone ?? "",
    };
  } catch (e) {
    // Fall back to an empty object if parsing fails
    // Keep error logging minimal here to avoid noisy console output in production
    console.debug("getStoredCustomer: failed to parse localStorage.customer", e);
    return {};
  }
}

export type Customer = {
id: string;
name: string;
balance: number;
lastPaid: string;
};
const BASE = process.env.EXPO_PUBLIC_API_URL?.trim();

function timeout(ms: number): Promise<never> {
	return new Promise((_, reject) => {
		setTimeout(() => reject(new Error('request-timeout')), ms);
	});
}

function request(path: string, init?: RequestInit) {
	return Promise.race([fetch(BASE + path, init), timeout(8000)]);
}

async function get(path: string) {
if (!BASE) throw new Error("Set EXPO_PUBLIC_API_URL in .env");
const res = await request(path);
if (!res.ok) throw new Error(String(res.status));
return res.json();

}
export const fetchCustomers = (): Promise<Customer[]> => get("/api/customers");
export const fetchCustomer = (id: string): Promise<Customer> =>
get(`/api/customers/${encodeURIComponent(id)}`);

export async function addCustomer(name: string, balance: number): Promise<Customer> {
if (!BASE) throw new Error("Set EXPO_PUBLIC_API_URL in .env");
const res = await request("/api/customers", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ name, balance }),
});
if (!res.ok) throw new Error(String(res.status));
return res.json();
}

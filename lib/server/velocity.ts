import crypto from "crypto";

export interface VelocityCustomerAddress {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface VelocityCustomer {
  name: string;
  email: string;
  phone: string;
  address: VelocityCustomerAddress;
}

export interface VelocityLineItem {
  name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  discount?: number;
  tax?: number;
}

export interface VelocityOrderDetails {
  total_price: number;
  total_discount?: number;
  total_tax?: number;
  line_items: VelocityLineItem[];
}

export interface CreateVelocityOrderPayload {
  order_id: string;
  customer: VelocityCustomer;
  order_details: VelocityOrderDetails;
  notes?: string;
}

export interface VelocityOrderResponse {
  velocity_order_id: string;
  order_id: string;
  customer: VelocityCustomer;
  order_details: VelocityOrderDetails;
  notes?: string;
  payments: any[];
  status: string;
  created_at: string;
}

export function getVelocityConfig() {
  const isProd = process.env.VELOCITY_ENVIRONMENT === "production";
  const apiKey = process.env.VELOCITY_API_KEY || "";
  const apiSecret = process.env.VELOCITY_API_SECRET || "";
  const merchantId = process.env.VELOCITY_MERCHANT_ID || "";
  const webhookSecret = process.env.VELOCITY_WEBHOOK_SECRET || "";

  const apiBaseUrl = isProd
    ? "https://loki.velocity.in"
    : "https://loki.stagingvelocity.in";

  const checkoutBaseUrl = isProd
    ? "https://checkout.velocity.in"
    : "https://checkout.stagingvelocity.in";

  return {
    isProd,
    apiKey,
    apiSecret,
    merchantId,
    webhookSecret,
    apiBaseUrl,
    checkoutBaseUrl,
  };
}

/**
 * Creates an order in Velocity's server API
 */
export async function createVelocityOrder(
  payload: CreateVelocityOrderPayload
): Promise<VelocityOrderResponse> {
  const config = getVelocityConfig();

  if (!config.apiKey || !config.apiSecret || !config.merchantId) {
    // In dev / test mode without configured credentials, provide a mock response for simulation
    if (process.env.NODE_ENV !== "production") {
      const mockVelId = `vel_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      return {
        velocity_order_id: mockVelId,
        order_id: payload.order_id,
        customer: payload.customer,
        order_details: payload.order_details,
        notes: payload.notes,
        payments: [],
        status: "created",
        created_at: new Date().toISOString(),
      };
    }
    throw new Error(
      "Velocity credentials (VELOCITY_API_KEY, VELOCITY_API_SECRET, VELOCITY_MERCHANT_ID) are missing."
    );
  }

  const authHeader = `Basic ${Buffer.from(
    `${config.apiKey}:${config.apiSecret}`
  ).toString("base64")}`;

  const res = await fetch(`${config.apiBaseUrl}/merchant/api/orders`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "X-Merchant-ID": config.merchantId,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data) {
    const errorMsg =
      data?.message || data?.error || `Velocity API error (Status: ${res.status})`;
    throw new Error(errorMsg);
  }

  return data as VelocityOrderResponse;
}

/**
 * Builds the hosted Velocity checkout redirection URL
 */
export function buildVelocityRedirectUrl(params: {
  velocityOrderId: string;
  stateToken: string;
  redirectUri: string;
}): string {
  const config = getVelocityConfig();
  const searchParams = new URLSearchParams({
    order_id: params.velocityOrderId,
    state: params.stateToken,
    redirect_uri: params.redirectUri,
    api_key: config.apiKey || "demo_key",
    merchant_id: config.merchantId || "demo_merchant",
  });

  return `${config.checkoutBaseUrl}/payments?${searchParams.toString()}`;
}

/**
 * Validates HMAC SHA-256 signature on Velocity Webhooks
 */
export function verifyVelocityWebhook(
  rawBody: string,
  receivedSignature: string | null | undefined,
  webhookSecret: string
): boolean {
  if (!receivedSignature || !webhookSecret) return false;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const receivedBuf = Buffer.from(receivedSignature, "utf8");
    const expectedBuf = Buffer.from(expectedSignature, "utf8");

    if (receivedBuf.length !== expectedBuf.length) return false;

    return crypto.timingSafeEqual(receivedBuf, expectedBuf);
  } catch (err) {
    console.error("Velocity signature verification error:", err);
    return false;
  }
}

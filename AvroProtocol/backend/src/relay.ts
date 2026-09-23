/**
 * Relay (https://relay.link) client for cross-chain bridging.
 *
 * Quotes are requested server-side so that the fee figures a rebate is computed
 * from come from Relay directly, never from the client.
 */

export const RELAY_API_URL = process.env.RELAY_API_URL?.trim() || "https://api.relay.link";

/** Ethereum, Base, Arbitrum, Robinhood Chain. */
export const BRIDGE_CHAIN_IDS = [1, 8453, 42161, 4663] as const;

export const BRIDGE_CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  8453: "Base",
  42161: "Arbitrum",
  4663: "Robinhood Chain",
};

export const NATIVE_CURRENCY = "0x0000000000000000000000000000000000000000";

/** AVRO (Avro) on Robinhood Chain. */
export const AVRO_ADDRESS = process.env.AVRO_TOKEN_ADDRESS?.trim() || "";
export const AVRO_DECIMALS = 18;
export const SETTLEMENT_CHAIN_ID = 4663;

/** Share of the relayer spread rebated to the user, in basis points. */
export const REBATE_BPS = Number(process.env.BRIDGE_REBATE_BPS || 2500);

/** Avro's own fee on each route, in basis points. Funds the rebate pool. */
export const APP_FEE_BPS = Number(process.env.BRIDGE_APP_FEE_BPS || 0);
export const APP_FEE_RECIPIENT = process.env.BRIDGE_APP_FEE_RECIPIENT?.trim() || "";

/** Minimum claimable balance, in micro-USD. Avoids dust payouts costing more than they pay. */
export const MIN_CLAIM_MICROS = BigInt(process.env.BRIDGE_MIN_CLAIM_MICROS || 1_000_000); // $1.00

export interface RelayFeeAmount {
  amount?: string;
  amountFormatted?: string;
  amountUsd?: string;
  currency?: { symbol?: string; decimals?: number; chainId?: number; address?: string };
}

export interface RelayQuoteResponse {
  requestId?: string;
  steps?: Array<{ requestId?: string; id?: string; kind?: string; items?: unknown[] }>;
  fees?: {
    gas?: RelayFeeAmount;
    relayer?: RelayFeeAmount;
    relayerGas?: RelayFeeAmount;
    relayerService?: RelayFeeAmount;
    app?: RelayFeeAmount;
  };
  details?: Record<string, unknown>;
}

export interface RelayIntentStatus {
  status: "unknown" | "pending" | "success" | "failure" | "refund" | "delayed";
  details?: string;
  txHashes?: string[];
}

export function isBridgeChainId(chainId: number): boolean {
  return (BRIDGE_CHAIN_IDS as readonly number[]).includes(chainId);
}

/** Parses a decimal USD string into integer micro-USD, so the ledger never drifts. */
export function usdToMicros(usd: string | number | undefined | null): bigint {
  if (usd === undefined || usd === null || usd === "") return 0n;
  const text = String(usd).trim();
  if (!/^-?\d*\.?\d*$/.test(text) || text === "" || text === ".") return 0n;
  const negative = text.startsWith("-");
  const [whole = "0", fraction = ""] = text.replace("-", "").split(".");
  const micros = BigInt(whole || "0") * 1_000_000n + BigInt((fraction + "000000").slice(0, 6) || "0");
  return negative ? -micros : micros;
}

export function microsToUsd(micros: bigint): string {
  const negative = micros < 0n;
  const abs = negative ? -micros : micros;
  return `${negative ? "-" : ""}${abs / 1_000_000n}.${(abs % 1_000_000n).toString().padStart(6, "0")}`;
}

/**
 * The relayer spread: the relayer's margin above the destination gas it fronts.
 * Falls back to `relayer - relayerGas` when `relayerService` is absent.
 */
export function extractSpreadMicros(quote: RelayQuoteResponse): bigint {
  const fees = quote.fees ?? {};
  const service = usdToMicros(fees.relayerService?.amountUsd);
  if (service > 0n) return service;

  const derived = usdToMicros(fees.relayer?.amountUsd) - usdToMicros(fees.relayerGas?.amountUsd);
  return derived > 0n ? derived : 0n;
}

export function calculateRebateMicros(spreadMicros: bigint, rebateBps = REBATE_BPS): bigint {
  if (spreadMicros <= 0n || rebateBps <= 0) return 0n;
  return (spreadMicros * BigInt(rebateBps)) / 10_000n;
}

/** Converts a micro-USD amount into AVRO wei at the supplied AVRO/USD price. */
export function microsToAvroWei(micros: bigint, avroUsdPrice: string | number): bigint {
  const priceMicros = usdToMicros(avroUsdPrice);
  if (micros <= 0n || priceMicros <= 0n) return 0n;
  return (micros * 10n ** BigInt(AVRO_DECIMALS)) / priceMicros;
}

export interface QuoteParams {
  user: string;
  recipient?: string;
  originChainId: number;
  destinationChainId: number;
  originCurrency?: string;
  destinationCurrency?: string;
  amount: string;
  tradeType?: "EXACT_INPUT" | "EXACT_OUTPUT";
}

export async function fetchRelayQuote(params: QuoteParams): Promise<RelayQuoteResponse> {
  const body: Record<string, unknown> = {
    user: params.user,
    recipient: params.recipient ?? params.user,
    originChainId: params.originChainId,
    destinationChainId: params.destinationChainId,
    originCurrency: params.originCurrency ?? NATIVE_CURRENCY,
    destinationCurrency: params.destinationCurrency ?? NATIVE_CURRENCY,
    amount: params.amount,
    tradeType: params.tradeType ?? "EXACT_INPUT",
  };

  if (APP_FEE_RECIPIENT && APP_FEE_BPS > 0) {
    body.appFees = [{ recipient: APP_FEE_RECIPIENT, fee: String(APP_FEE_BPS) }];
  }

  const response = await fetch(`${RELAY_API_URL}/quote/v2`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Relay quote failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  return (await response.json()) as RelayQuoteResponse;
}

export async function fetchRelayStatus(requestId: string): Promise<RelayIntentStatus> {
  const response = await fetch(
    `${RELAY_API_URL}/intents/status/v3?requestId=${encodeURIComponent(requestId)}`
  );
  if (!response.ok) {
    throw new Error(`Relay status lookup failed (${response.status})`);
  }
  return (await response.json()) as RelayIntentStatus;
}

/**
 * AVRO/USD pricing.
 *
 * AVRO has roughly $4.8k of on-chain liquidity, so spot price is cheap to move.
 * That matters because a *lower* AVRO price pays out *more* AVRO for the same
 * USD rebate - so anyone holding confirmed rebates has an incentive to push the
 * price down just before claiming.
 *
 * Claims are therefore priced against AVRO_USD_REFERENCE_PRICE and the live
 * quote is only accepted when it sits within AVRO_PRICE_MAX_DEVIATION_BPS of it.
 */

/** Operator-set reference price. Required before any claim can be priced. */
export const AVRO_REFERENCE_PRICE = process.env.AVRO_USD_REFERENCE_PRICE?.trim() || "";

/** How far live spot may drift from the reference before a claim is refused. */
export const AVRO_PRICE_MAX_DEVIATION_BPS = Number(
  process.env.AVRO_PRICE_MAX_DEVIATION_BPS || 2000
); // 20%

export type AvroPriceSource = "configured" | "relay" | "reference";

export interface AvroPriceResult {
  /** Price to bill the claim at, as a decimal string. "0" means unusable. */
  price: string;
  source: AvroPriceSource;
  referencePrice: string;
  /** Live spot, when it could be read. Informational. */
  spotPrice: string | null;
  deviationBps: number | null;
  /** Populated when the price cannot be trusted; the claim should be refused. */
  rejection: string | null;
}

/** Live AVRO spot from Relay's currency feed, or null when unavailable. */
export async function fetchAvroSpotPrice(): Promise<string | null> {
  if (!/^0x[0-9a-fA-F]{40}$/.test(AVRO_ADDRESS)) return null;
  try {
    const response = await fetch(`${RELAY_API_URL}/chains/${SETTLEMENT_CHAIN_ID}/currencies/${AVRO_ADDRESS}`);
    if (!response.ok) return null;
    const payload = (await response.json()) as { price?: number | string };
    if (payload.price === undefined || !(Number(payload.price) > 0)) return null;
    // Relay returns scientific notation for sub-cent tokens; normalise it.
    return Number(payload.price).toFixed(18).replace(/0+$/, "").replace(/\.$/, "");
  } catch (error) {
    console.error("[relay] AVRO spot price error:", error);
    return null;
  }
}

export function deviationBps(price: bigint, reference: bigint): number {
  if (reference <= 0n) return 0;
  const diff = price > reference ? price - reference : reference - price;
  return Number((diff * 10_000n) / reference);
}

/**
 * Resolves the price a claim should be settled at.
 *
 * A pinned AVRO_USD_PRICE short-circuits everything (useful for a fixed-rate
 * promotion). Otherwise live spot is checked against the reference and refused
 * when it has drifted too far in either direction.
 */
export async function resolveAvroPrice(): Promise<AvroPriceResult> {
  const pinned = process.env.AVRO_USD_PRICE?.trim();
  const reference = AVRO_REFERENCE_PRICE;

  if (pinned && Number(pinned) > 0) {
    return {
      price: pinned,
      source: "configured",
      referencePrice: reference || pinned,
      spotPrice: null,
      deviationBps: null,
      rejection: null,
    };
  }

  if (!reference || !(Number(reference) > 0)) {
    return {
      price: "0",
      source: "reference",
      referencePrice: "0",
      spotPrice: null,
      deviationBps: null,
      rejection:
        "AVRO_USD_REFERENCE_PRICE is not set, so a claim cannot be priced safely against a thin market",
    };
  }

  const spot = await fetchAvroSpotPrice();
  if (!spot) {
    // Falling back to the reference is safe: it is operator-set, not market-moved.
    return {
      price: reference,
      source: "reference",
      referencePrice: reference,
      spotPrice: null,
      deviationBps: null,
      rejection: null,
    };
  }

  const drift = deviationBps(usdToMicros(spot), usdToMicros(reference));
  if (drift > AVRO_PRICE_MAX_DEVIATION_BPS) {
    return {
      price: "0",
      source: "relay",
      referencePrice: reference,
      spotPrice: spot,
      deviationBps: drift,
      rejection: `AVRO spot price deviates ${drift}bps from the reference (max ${AVRO_PRICE_MAX_DEVIATION_BPS}bps)`,
    };
  }

  return {
    price: spot,
    source: "relay",
    referencePrice: reference,
    spotPrice: spot,
    deviationBps: drift,
    rejection: null,
  };
}

/** Back-compat helper: the price alone, or "0" when a claim must be refused. */
export async function fetchAvroUsdPrice(): Promise<string> {
  return (await resolveAvroPrice()).price;
}

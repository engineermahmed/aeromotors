import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FINANCE_FILE = path.join(process.cwd(), "data", "finance.json");

interface FinanceSettings {
  defaultRate: number;
  defaultTerm: number;
  defaultDeposit: number;
  defaultVehiclePrice: number;
  availableTerms: number[];
  minRate: number;
  maxRate: number;
}

const DEFAULTS: FinanceSettings = {
  defaultRate: 5.99,
  defaultTerm: 84,
  defaultDeposit: 5000,
  defaultVehiclePrice: 40000,
  availableTerms: [24, 36, 48, 60, 72, 84],
  minRate: 1.99,
  maxRate: 29.99,
};

function readSettings(): FinanceSettings {
  try {
    if (!fs.existsSync(FINANCE_FILE)) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(FINANCE_FILE, "utf-8")) };
  } catch {
    return DEFAULTS;
  }
}

function writeSettings(data: FinanceSettings) {
  fs.mkdirSync(path.dirname(FINANCE_FILE), { recursive: true });
  fs.writeFileSync(FINANCE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(readSettings());
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const current = readSettings();
    const updated: FinanceSettings = {
      ...current,
      ...(body.defaultRate !== undefined && { defaultRate: Number(body.defaultRate) }),
      ...(body.defaultTerm !== undefined && { defaultTerm: Number(body.defaultTerm) }),
      ...(body.defaultDeposit !== undefined && { defaultDeposit: Number(body.defaultDeposit) }),
      ...(body.defaultVehiclePrice !== undefined && { defaultVehiclePrice: Number(body.defaultVehiclePrice) }),
      ...(body.minRate !== undefined && { minRate: Number(body.minRate) }),
      ...(body.maxRate !== undefined && { maxRate: Number(body.maxRate) }),
    };
    writeSettings(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

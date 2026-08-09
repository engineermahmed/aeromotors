import { NextRequest, NextResponse } from "next/server";
import { addContact, getAllContacts } from "@/lib/contacts";
import { ContactSubmission } from "@/types";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const contacts = getAllContacts();
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: "Failed to load contacts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contact: ContactSubmission = {
      id: randomUUID(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : undefined,
      subject: String(subject).trim(),
      message: String(message).trim(),
      submittedAt: new Date().toISOString(),
      read: false,
    };

    const saved = addContact(contact);
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}

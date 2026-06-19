import type { Request, Response } from "express";
import { getEnv } from "../lib/.env.js";
import { users } from "../db/schema.js";
import { db } from "../db/index.js";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { eq } from "drizzle-orm";
import { parseRole } from "../lib/roles.js";

export async function clerkWebhookHandler(req: Request, res: Response) {
    const env = getEnv();

    try {
        if (!env.CLERK_WEBHOOK_SECRET) {
            res.status(503).send("webhooks not configured");
            return;
        }

        // CONTROL ULTRA SEGURO: Convertir el Buffer de express.raw directamente
        const payload = Buffer.isBuffer(req.body) 
            ? req.body.toString("utf-8") 
            : typeof req.body === "string" 
                ? req.body 
                : JSON.stringify(req.body);

        const request = new Request("https://internal/webhooks/clerk", {
            method: "POST",
            headers: new Headers(req.headers as HeadersInit),
            body: payload,
        });

        const evt = await verifyWebhook(request, { signingSecret: env.CLERK_WEBHOOK_SECRET });
       
        if (evt.type === "user.created" || evt.type === "user.updated") {
            const u = evt.data;
            const email = u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address 
                ?? u.email_addresses?.[0]?.email_address 
                ?? ""; // Aseguramos un fallback string ya que Drizzle tiene .notNull()
        
            const displayName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || null;
            const role = parseRole(u.public_metadata?.role);

            await db.insert(users).values({
                clerkUserId: u.id,
                email,
                displayName,
                role
            })
            .onConflictDoUpdate({
                target: users.clerkUserId,
                set: { email, displayName, role, updatedAt: new Date() }
            });
        }

        if (evt.type === "user.deleted") {
            const id = evt.data.id;
            if (id) {
                await db.delete(users).where(eq(users.clerkUserId, id));
            }
        }

        res.json({ ok: true });
    } catch (error) {
        console.error("Clerk webhook error:", error);
        res.status(400).json({ error: "Invalid webhook" });
    }
}
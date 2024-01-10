import nodemailer from "nodemailer";

import { mailerConfig } from "./config";
import { getHTML } from "./utils";

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

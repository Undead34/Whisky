import TextTemplate from "@/app/dashboard/templates/components/TextTemplate";
import { setDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import nodemailer, { Transporter } from "nodemailer";
import { ILot, IUser } from "@/types/globals";
import { db } from "@/config";
import { b64Image } from "./b64";

const gmail = {
  host: "smtp.gmail.com",
  service: "gmail",
  secure: false,
  pool: true,
  port: 587,
  maxConnections: 5,
  maxMessages: 30,
  auth: {
    user: process.env.MAILER_USER || "maizogabriel@gmail.com",
    pass: process.env.MAILER_PASS || "fbxudjriivkldjjm",
  },
};

class Mailer {
  private transporter: Transporter;
  private queue: IUser[];
  private isOpen: boolean;
  origin: string | undefined;

  constructor() {
    this.transporter = nodemailer.createTransport(gmail);
    this.queue = [];
    this.isOpen = true;
  }

  async sendMail(email: IUser) {
    return new Promise(async (resolve, reject) => {
      const html = TextTemplate({
        image: b64Image,
        observer: `${
          this.origin || "https://www.google.com"
        }/observer.png?id=${email.id}`,
        redirect: `${this.origin || "https://www.google.com"}?id=${email.id}`,
      });

      const options = {
        subject: "Cambio de contraseña de la cuenta Microsoft",

        to: email.email,
        html,
      };

      this.transporter.sendMail(options, (err, response) => {
        if (err) {
          console.log(err);
          reject(err);
        } else if (response.rejected && response.rejected.length) {
          const err = new Error(); // @ts-ignore
          err.code = "REJECT_BY_USER";
          reject(err);
        }

        resolve(response);
      });
    });
  }

  async runner(lotID: string | undefined) {
    while (this.transporter.isIdle() && this.queue.length && this.isOpen) {
      try {
        await this.sendMail(this.queue[0]);

        if (lotID) {
          const docRef = doc(db, "lots", lotID);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as ILot;
            const nodes = data.nodes.map((item) => {
              if (item.id === this.queue[0].id) {
                return { ...item, sended: true };
              }
              return item;
            });

            nodes.map(async (item) => {
              if (item.sended) {
                await updateDoc(doc(db, "users", item.id), {
                  sended: true,
                });
              }
            });

            await updateDoc(docRef, { nodes: nodes });
          }
        }

        this.queue.shift();
      } catch (error: any) {
        console.log("Error in runner", error);
        const code = error.code;

        switch (code) {
          case "EAUTH":
            if (error.response.includes("Too many login attempts")) {
              // hacer algo
            }

            this.close();
            this.queue = [];
            break;
          case "EENVELOPE":
            this.close();
            break;
          case "REJECT_BY_USER":
            break;

          default:
            if (this.queue[0].attempts >= 3) {
              if (lotID) {
                const docRef = doc(db, "lots", lotID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                  const data = docSnap.data() as ILot;
                  const nodes = data.nodes.map((item) => {
                    if (item.id === this.queue[0].id) {
                      return { ...item, sended: true };
                    }
                    return item;
                  });

                  nodes.map(async (item) => {
                    if (item.sended) {
                      await updateDoc(doc(db, "users", item.id), {
                        sended: true,
                      });
                    }
                  });

                  await updateDoc(docRef, { nodes: nodes });
                }
              }

              this.queue.shift();
            } else {
              this.queue[0].attempts++;
            }
            break;
        }
      }
    }

    this.close();
  }

  push(email: IUser | IUser[], lotID?: string) {
    if (this.isOpen) {
      if (!(this.transporter.isIdle() && this.queue.length)) {
        console.log("running...");
        if (Array.isArray(email)) {
          this.queue.push(...email);
        } else {
          this.queue.push(email);
        }
        this.runner(lotID);
      } else {
        if (Array.isArray(email)) {
          this.queue.push(...email);
        } else {
          this.queue.push(email);
        }
      }
    } else {
      this.close();
      this.queue = [];
      this.transporter = nodemailer.createTransport(gmail);
      if (Array.isArray(email)) {
        this.queue.push(...email);
      } else {
        this.queue.push(email);
      }
      this.isOpen = true;
      this.runner(lotID);
    }
  }

  close() {
    this.transporter.close();
    this.isOpen = false;
    console.log("closing connection pool");
  }
}

export async function oneTimeEmail(email: any) {
  return new Promise((resolve, reject) => {
    const html = TextTemplate({
      image: b64Image,
      observer: `${mailer.origin || "https://www.google.com"}/observer.png?id=${
        email.id
      }`,
      redirect: `${mailer.origin || "https://www.google.com"}?id=${email.id}`,
    });

    const options = {
      subject: "Cambio de contraseña de la cuenta Microsoft",
      to: email.email,
      html,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      port: 587,
      auth: {
        user: process.env.MAILER_USER || "maizogabriel@gmail.com",
        pass: process.env.MAILER_PASS || "fbxudjriivkldjjm",
      },
    });

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(info);
    });
  });
}

const mailer = new Mailer();
export default mailer;

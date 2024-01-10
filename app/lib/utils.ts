import { HTMLTemplate } from "../ui/dashboard/templates/text-template";
import { parse } from "csv-parse";

export function checkError(data: string): boolean {
    const email = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ).test(data);
    const phone = new RegExp(
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    ).test(data);
    const user = new RegExp(/^[a-zA-Z0-9]{5,31}$/).test(data);
    return email || phone || user;
}

export async function parseCSV<T>(data: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    parse(data, { columns: true, skip_empty_lines: true }, (err, output) => {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

export function getHTML(userID: string, origin: string) {
  return HTMLTemplate({
    redirect: `${origin}?id=${userID}`,
    observer: `${origin}/observer.png?id=${userID}`,
    image: `${origin}/microsoft-logo.png`,
  });
}

import TextTemplate from "@/app/dashboard/templates/components/TextTemplate";
import { parse } from "csv-parse";
import { b64Image } from "./b64";

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
  return TextTemplate({
    image: b64Image,
    redirect: `${origin}?id=${userID}`,
    observer: `${origin}/observer.png?id=${userID}`,
  });
}

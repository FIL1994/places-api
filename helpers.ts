import { Column, ColumnOptions } from "typeorm";
import { createClient } from "@google/maps";

export function RelationColumn(options?: ColumnOptions) {
  return Column({ nullable: true, ...options });
}

export const client = createClient({
  key: process.env.GOOGLE_API_KEY
});

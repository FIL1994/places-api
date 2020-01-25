import { Column, ColumnOptions } from "typeorm";
import { createClient } from "@google/maps";

export function RelationColumn(options?: ColumnOptions) {
  return Column({ nullable: true, ...options });
}

export const googleMapsClient = createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  language: "en",
  Promise: require("q").Promise
});

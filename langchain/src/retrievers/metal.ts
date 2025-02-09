import type MetalSDK from "@getmetal/metal-sdk";

import { BaseRetriever } from "../schema/index.js";
import { Document } from "../document.js";

export interface MetalRetrieverFields {
  client: MetalSDK.default;
}

interface ResponseItem {
  text: string;
  [key: string]: unknown;
}

export class MetalRetriever extends BaseRetriever {
  client: MetalSDK.default;

  constructor(fields: MetalRetrieverFields) {
    super();

    this.client = fields.client;
  }

  async getRelevantDocuments(query: string): Promise<Document[]> {
    const res = await this.client.search({ text: query });

    const items = ("data" in res ? res.data : res) as ResponseItem[];
    return items.map(
      ({ text, metadata }) =>
        new Document({
          pageContent: text,
          metadata: metadata as Record<string, unknown>,
        })
    );
  }
}

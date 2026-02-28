import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { envs } from "../../config/envs";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  constructor() {
    if (!envs.databaseUrl) {
      throw new Error("DATABASE_URL env var is not defined");
    }
    const pool = new Pool({ connectionString: envs.databaseUrl });
    const adapter = new PrismaPg(pool, { schema: 'public' });
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  get product() {
    return this.client.product;
  }

  get customer() {
    return this.client.customer;
  }

  get stock() {
    return this.client.stock;
  }

  get transaction() {
    return this.client.transaction;
  }

  get delivery() {
    return this.client.delivery;
  }

  get $transaction() {
    return this.client.$transaction.bind(this.client);
  }
}

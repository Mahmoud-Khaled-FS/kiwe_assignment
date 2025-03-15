import { Request, Response } from 'express';
import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();
export async function metrics(_: Request, res: Response) {
  res.set('Content-Type', client.register.contentType);

  res.send(await client.register.metrics());
}

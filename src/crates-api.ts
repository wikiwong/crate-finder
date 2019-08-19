import axios, { AxiosResponse } from 'axios';

const hostname = `https://crates.io`;

type CratesResponse = AxiosResponse<{
  crates: Crate[]
}>;

export type Crate = {
  name: string;
  description: string;
  documentation: string;
  downloads: number;
  repository: string;
  max_version: string;
};

export async function search(query: string): Promise<Crate[]> {
  const { data: { crates } }: CratesResponse = await axios(`${hostname}/api/v1/crates?page=1&per_page=10&q=${query}`);
  return crates;
}

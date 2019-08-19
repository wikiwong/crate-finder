import axios, { AxiosResponse } from 'axios';

const hostname = `https://crates.io`;

type Links = {
  versions: string;
};

type Version = {
  num: string;
  downloads: number;
  yanked: boolean,
  license: string,
  crate_size: number,
  published_by: string
};

type CratesResponse = AxiosResponse<{
  crates: Crate[]
}>;

type VersionsResponse = AxiosResponse<{
  versions: Version[]
}>;

export type Crate = {
  name: string;
  description: string;
  documentation: string;
  downloads: number;
  repository: string;
  links: Links;
  versions: Version[]; // this is the property we add to the crate
  max_version: string;
};

export async function search(query: string): Promise<Crate[]> {
  const { data: { crates } }: CratesResponse = await axios(`${hostname}/api/v1/crates?page=1&per_page=10&q=${query}`);
  return await Promise.all<Crate>(crates.map(async (crate) => {
    const { data: { versions } }: VersionsResponse = await axios(`${hostname}${crate.links.versions}`);
    return {
      ...crate,
      versions
    };
  }));
}

// https://crates.io/api/v1/crates?page=1&per_page=10&q=hyper
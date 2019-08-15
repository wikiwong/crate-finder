import axios, { AxiosResponse } from 'axios';

const baseUrl = `https://crates.io/api/v1/crates`;

export function search(query: string): Promise<AxiosResponse> {
  return axios(`${baseUrl}?page=1&per_page=10&q=${query}`)
}

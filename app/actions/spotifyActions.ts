'use server'

import { spotifyService } from "@/services/spotifyService";

export async function searchSpotify(query: string) {
  return await spotifyService.search(query);
  }

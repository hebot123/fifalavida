export interface NftVideo {
  id: number; // Add this line
  link: string;
  country?: string;
  description: string;
  edition?: string;
}

export const nftVideos: NftVideo[] = [
  {
    id: 1, // Add id
    link: "https://storage.googleapis.com/prod-fifa-cms-storage/015b109b-cb86-4a71-9c41-e1e776c21052.mp4#t=0.001",
    country: "Argentina",
    description: "2022 FIFA World Cup Qatar™ – ARG 3 - 0 CRO, GOAL: Julian Alvarez 69'",
    edition: "#108 of 160",
  },
  {
    id: 2, // Add id
    link: "https://storage.googleapis.com/prod-fifa-cms-storage/a92e6418-46c5-47d0-8b83-1b2f1bfb3132.mp4#t=0.001",
    country: "France",
    description: "2022 FIFA World Cup Qatar™ – FRA 4 - 1 AUS, CELEBRATION: Kylian Mbappe 68'",
    edition: "#87 of 222",
  },
  {
    id: 3, // Add id
    link: "https://storage.googleapis.com/prod-fifa-cms-storage/752ffcfe-7ccf-42de-8471-b555e5a5277e.mp4#t=0.001",
    country: "Korea Republic",
    description: "2002 FIFA World Cup Korea/Japan™ – KOR 2-1 ITA GOLDEN GOAL: Ahn 117'",
    edition: "#250 of 425",
  },
  // ... continue adding a unique id for every object in the list ...
  {
    id: 15, // Ensure this id is unique
    link: "https://storage.googleapis.com/prod-fifa-cms-storage/4f8f2007-4f1e-4f32-82a4-75e8fcbafac9.mp4#t=0.001",
    description: "Football Unites Europe",
    edition: "#187 of 200",
  },
];

// This should be the default export, not a named one.
export default nftVideos;

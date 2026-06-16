export interface Award {
  year: string;
  name: string;
  category: string;
  organization: string;
}

export interface Publication {
  name: string;
  displayName: string;
}

export interface Equipment {
  category: string;
  items: string[];
}

export const awards: Award[] = [
  { year: "2025", name: "AZAL Pyramids Hotel", category: "Official Event Photography Partner", organization: "Cairo" },
  { year: "2025", name: "KUFPEC International Exhibition", category: "Corporate Media Coverage", organization: "Egypt" },
  { year: "2024", name: "Fourth Education Forum", category: "Official Media Production", organization: "Cairo" },
  { year: "2024", name: "Corporate Leadership Summit", category: "Exclusive Photography Partner", organization: "Egypt" },
  { year: "2023", name: "Ramadan Gala Series", category: "Hotel Event Photography", organization: "Cairo" },
  { year: "2022", name: "Regional Business Conference", category: "Multi-Day Media Coverage", organization: "Egypt" },
  { year: "2021", name: "Gulf Industry Summit", category: "Conference Photography", organization: "Region" },
  { year: "2020", name: "Cairo Corporate Week", category: "Event Series Coverage", organization: "Cairo" },
];

export const publications: Publication[] = [
  { name: "AZAL Hotels", displayName: "AZAL Hotels" },
  { name: "KUFPEC", displayName: "KUFPEC" },
  { name: "Gulf Summit", displayName: "Gulf Summit" },
  { name: "Forum Network", displayName: "Forum Network" },
  { name: "Cairo Elite", displayName: "Cairo Elite" },
  { name: "Maison Azur", displayName: "Maison Azur" },
];

export const equipment: Equipment[] = [
  {
    category: "Cameras",
    items: [
      "Sony Alpha A7R V",
      "Canon EOS R5",
      "Sony Alpha A9 III",
      "Fujifilm GFX 100S",
    ],
  },
  {
    category: "Lenses",
    items: [
      "Sony 24-70mm f/2.8 GM",
      "Canon RF 85mm f/1.2L",
      "Sony 70-200mm f/2.8 GM",
      "Canon RF 16mm f/2.8",
    ],
  },
  {
    category: "Lighting",
    items: [
      "Profoto B10X Plus",
      "Aputure 600d Pro",
      "Godox AD600 Pro",
      "Profoto OCF Softbox",
    ],
  },
  {
    category: "Post-Production",
    items: [
      "Adobe Lightroom Classic",
      "Adobe Photoshop",
      "Capture One 23",
      "DaVinci Resolve",
    ],
  },
];

export const timeline = [
  {
    year: "2015",
    title: "GJ Studio Founded",
    description:
      "Established GJ Studio in Cairo with a focus on professional event and corporate photography. First major hotel event coverage completed at a leading Cairo venue.",
  },
  {
    year: "2017",
    title: "Corporate Partnerships",
    description:
      "Secured first long-term corporate photography partnerships with leading Egyptian businesses. Expanded services to include multi-day conference coverage.",
  },
  {
    year: "2019",
    title: "Hotel & Hospitality Focus",
    description:
      "Became a trusted photography partner for five-star hotels across Cairo. Ramadan season coverage at AZAL Pyramids Hotel became a signature annual project.",
  },
  {
    year: "2021",
    title: "Regional Expansion",
    description:
      "Extended coverage to regional summits and Gulf industry events. Introduced video production as an additional service alongside photography.",
  },
  {
    year: "2023",
    title: "International Exhibitions",
    description:
      "Covered the KUFPEC international industry exhibition — marking a milestone in large-scale, multi-day international event coverage for the studio.",
  },
  {
    year: "2025",
    title: "Media Production Growth",
    description:
      "Produced the Fourth Education Forum promo video and continued as official photography partner for major hotel groups and corporate clients across Egypt.",
  },
];

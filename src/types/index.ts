export interface Template {
  id: number;
  texts: string[];
  selectedIndex: number;
  textImages: { [key: number]: string[] }; // Maps text index to its images
}

export interface ProjectData {
  images: string[];
  templates: Template[];
}

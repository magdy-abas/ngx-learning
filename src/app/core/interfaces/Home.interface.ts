// export interface IHomeSection {
//   id: number;
//   title: string;
//   short_title: string;
//   description: string;
//   display_type: string;
//   grid_columns_count: number;
//   type: 'sliders' | 'courses' | 'doctors' | 'banar' | 'categories';
//   data: any[];
// }

// types.ts

export interface IHomeSection {
  id: number;
  title: string;
  short_title: string;
  description: string;
  display_type: string;
  grid_columns_count: number;
  type: 'sliders' | 'courses' | 'doctors' | 'banar' | 'categories';
  data: ISlider[] | ICourse[] | IDoctor[] | ICategory[] | IBanner[];
}

export interface ISlider {
  id: number;
  title: string;
  description: string;
  image: string;
  video: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface ICourse {
  id: number;
  title: string;
  price: string;
  description: string;
  rate: string;
  image: string;
  client_complete_percentage: string;
  complete_status: string | null;
  client_status: string;
  doctor: string;
  doctor_image: string;
}

export interface IDoctor {
  id: number;
  name: string;
  courses_count: number;
  job_title: string;
  image: string;
  facebook: string | null;
  telegram: string | null;
  whatsapp: string | null;
  phone_number: string | null;
}

export interface ICategory {
  id: number;
  title: string;
  image: string;
  has_sub_categories: number;
}

export interface IBanner {
  id: number;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  image: string;
  video: string | null;
}

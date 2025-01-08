// src/app/core/utils/section-type-guards.utils.ts

import {
  IBanner,
  ICategory,
  ICourse,
  IDoctor,
  ISlider,
} from '../../core/interfaces/Home.interface';

export class SectionTypeGuards {
  /**
   * Type guard for Slider data
   * @param data Any array to be checked
   * @returns Type predicate confirming if data is ISlider[]
   */
  static isSliderData(data: any[]): data is ISlider[] {
    return data?.length > 0 && 'video' in data[0];
  }

  /**
   * Type guard for Course data
   * @param data Any array to be checked
   * @returns Type predicate confirming if data is ICourse[]
   */
  static isCourseData(data: any[]): data is ICourse[] {
    return data?.length > 0 && 'price' in data[0];
  }

  /**
   * Type guard for Doctor data
   * @param data Any array to be checked
   * @returns Type predicate confirming if data is IDoctor[]
   */
  static isDoctorData(data: any[]): data is IDoctor[] {
    return data?.length > 0 && 'courses_count' in data[0];
  }

  /**
   * Type guard for Category data
   * @param data Any array to be checked
   * @returns Type predicate confirming if data is ICategory[]
   */
  static isCategoryData(data: any[]): data is ICategory[] {
    return data?.length > 0 && 'has_sub_categories' in data[0];
  }

  /**
   * Type guard for Banner data
   * @param data Any array to be checked
   * @returns Type predicate confirming if data is IBanner[]
   */
  static isBannerData(data: any[]): data is IBanner[] {
    return data?.length > 0 && 'start_date' in data[0] && 'video' in data[0];
  }
}

export class SectionDataHelpers {
  /**
   * Safely get typed Slider data
   * @param data Input array
   * @returns ISlider[] or empty array if invalid
   */
  static getSliderData(data: any[]): ISlider[] {
    return SectionTypeGuards.isSliderData(data) ? data : [];
  }

  /**
   * Safely get typed Course data
   * @param data Input array
   * @returns ICourse[] or empty array if invalid
   */
  static getCourseData(data: any[]): ICourse[] {
    return SectionTypeGuards.isCourseData(data) ? data : [];
  }

  /**
   * Safely get typed Doctor data
   * @param data Input array
   * @returns IDoctor[] or empty array if invalid
   */
  static getDoctorData(data: any[]): IDoctor[] {
    return SectionTypeGuards.isDoctorData(data) ? data : [];
  }

  /**
   * Safely get typed Category data
   * @param data Input array
   * @returns ICategory[] or empty array if invalid
   */
  static getCategoryData(data: any[]): ICategory[] {
    return SectionTypeGuards.isCategoryData(data) ? data : [];
  }

  /**
   * Safely get typed Banner data
   * @param data Input array
   * @returns IBanner[] or empty array if invalid
   */
  static getBannerData(data: any[]): IBanner[] {
    return SectionTypeGuards.isBannerData(data) ? data : [];
  }
}

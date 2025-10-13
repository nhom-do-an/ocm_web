// Region types
export interface Region {
  code: string;
  id: number;
  name: string;
  parent_code: string;
  priority: number;
  type: RegionType;
}

export interface OldRegion {
  code: string;
  id: number;
  name: string;
  parent_code: string;
  priority: number;
  type: RegionType;
}

export enum RegionType {
  Country = 1,
  Province = 2,
  District = 3,
  Ward = 4,
}

export interface ConvertRegionRequest {
  old_district_name: string;
  old_province_name: string;
  old_ward_code: string;
}

// Region types
export interface Region {
  code: string;
  id: number;
  name: string;
  parent_code: string;
  priority: number;
  type: RegionType;
}

// mirrors Spring Data's org.springframework.data.domain.Page JSON shape
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

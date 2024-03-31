export class CreateProductDto {
  readonly seller_id: number;
  readonly brand: string;
  readonly product_name: string;
  readonly category_detail_id: number;
  readonly price: number;
  readonly description: number;
  readonly stock: number;
  readonly is_deleted: boolean;
  readonly sales_count: number;
}

export class Product {
  name: string;
  category: string;
  subcategory?: string;

  constructor(name: string, category: string, subcategory?: string);
  constructor(productData: { name: string; category: string; subcategory?: string });
  constructor(
    productNameOrData: string | { name: string; category: string; subcategory?: string },
    category?: string,
    subcategory?: string
  ) {
    if (typeof productNameOrData === 'string') {
      this.name = productNameOrData;
      this.category = category!;
      this.subcategory = subcategory;
    } else {
      this.name = productNameOrData.name;
      this.category = productNameOrData.category;
      this.subcategory = productNameOrData.subcategory;
    }
  }

  toJSON(): { name: string; category: string; subcategory?: string } {
    return {
      name: this.name,
      category: this.category,
      subcategory: this.subcategory,
    };
  }
}

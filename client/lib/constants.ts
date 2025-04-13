export interface Category {
  name: string;
  slug: string;
}

export const categories: Category[] = [
  {
    name: "Portrait",
    slug: "portrait",
  },
  {
    name: "Wildlife",
    slug: "wildlife",
  },
  {
    name: "Nature",
    slug: "nature",
  },
  {
    name: "Abstract",
    slug: "abstract",
  },
  {
    name: "Black & White",
    slug: "black-and-white",
  },
  {
    name: "Fashion",
    slug: "fashion",
  },
];

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((category) => category.slug === slug);
};

// Helper function to validate category slug
export const isValidCategorySlug = (slug: string): boolean => {
  return categories.some((category) => category.slug === slug);
};

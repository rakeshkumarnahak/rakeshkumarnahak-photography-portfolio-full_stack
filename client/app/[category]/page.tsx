import { Gallery } from "@/components/gallery";

import { Category } from "@/lib/types";
import { categories } from "@/lib/constants";

// Define the page props to get the category parameter from the URL
interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  return categories.map((category: Category) => ({
    category: category.slug,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  // Validate if the category exists using the helper function
  const isValidCategory = categories.some(
    (cat: Category) => cat.slug === category
  );

  if (!isValidCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Category not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 capitalize">{category}</h1>
      <Gallery key={category} category={category} />
    </div>
  );
}

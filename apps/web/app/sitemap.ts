import { MetadataRoute } from 'next';

import { fetchProductsWithPrisma } from '@/services/products';

import { ProductCardAPIResponse } from '@/types';

export const revalidate = 1800; // 30분마다 업데이트

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_DEPLOY_URL!;

  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/products/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/location`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  // 동적 상품 페이지들
  // 추후 활성 경매 상품만 포함하고, 조회수에 따라 우선순위 차등 적용 (SEO 최적화)
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const products = await fetchProductsWithPrisma();

    productPages = products.map((product: ProductCardAPIResponse) => ({
      url: `${baseUrl}/products/${product.product_id}`,
      lastModified: new Date(product.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching products for sitemap:', error);
    }
  }

  return [...staticPages, ...productPages];
}

import Heading from '@/components/Heading';
import Image from 'next/image';
import Link from 'next/link';
import { getReviews } from '@/lib/reviews';

export const metadata = {
  title: 'Reviews',
};

export default async function ReviewsPage() {
  const reviews = await getReviews(6);
  console.log('[ReviewsPage] reviews:',
    reviews.map((review) => review.slug).join(', '));

  return (
    <>
      <Heading>Reviews</Heading>
      <ul className="flex flex-row flex-wrap gap-3">
        {reviews.map((review, index) => (
          <li key={review.slug}
          className="bg-white border rounded shadow w-80 hover:shadow-xl">
            <Link href={`/reviews/${review.slug}`}>
              <Image src={review.image} alt="" priority={index << 2}
                width="320" height="180" className="rounded-t"
              />
              <h2 className="font-orbitron font-semibold py-1 text-center">
                {review.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

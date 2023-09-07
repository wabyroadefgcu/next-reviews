import { readdir } from 'node:fs/promises';
import { marked } from 'marked';
import qs from 'qs';

const CMS_URL = 'http://localhost:1337';

export async function getFeaturedReview() {
  const reviews = await getReviews();
  return reviews[0];
}

export async function getReview(slug) {
  // const text = await readFile(`./content/reviews/${slug}.md`, 'utf8');
  // const { content, data: { title, date, image } } = matter(text);
  // const body = marked(content, { headerIds: false, mangle: false });
  // return { slug, title, date, image, body };

  const url = `${CMS_URL}/api/reviews?`
    + qs.stringify({
        filters: { slug: { $eq: slug } },
        fields: ['slug', 'title', 'subtitle', 'publishedAt', 'body'],
        populate: { image: {fields: ['url'] } },
        pagination: { pageSize: 1, withCount: false },
      }, { encodeValuesOnly: true });
  console.log('getReview():', url);
  const response = await fetch(url);
  const { data } = await response.json();
  console.log(data);
  const { attributes } = data[0];

  const returnData = {
    slug: attributes.slug,
    title: attributes.title,
    date: attributes.publishedAt.slice(0, 'yyyy-mm-dd'.length),
    image: CMS_URL + attributes.image.data.attributes.url,
    body: marked(attributes.body, { headerIds: false, mangle: false }),
  };
  console.log(returnData);
  return returnData;
}

export async function getReviews() {
  // const url = `${CMS_URL}/api/reviews?`
  //   + qs.stringify({
  //       fields: ['slug', 'title', 'subtitle', 'publishedAt'],
  //       populate: { image: {fields: ['url'] } },
  //       sort: ['publishedAt:desc'],
  //       pagination: { pageSize: 6},
  //     }, { encodeValuesOnly: true });
  // console.log('getReviews:', url);
  // const response = await fetch(url);
  // const { data } = await response.json();


  const { data } = await fetchReviews({
        fields: ['slug', 'title', 'subtitle', 'publishedAt'],
        populate: { image: {fields: ['url'] } },
        sort: ['publishedAt:desc'],
        pagination: { pageSize: 6},
      })

  return data.map(({ attributes }) => ({
    slug: attributes.slug,
    title: attributes.title,
    date: attributes.publishedAt.slice(0, 'yyyy-mm-dd'.length),
    image: CMS_URL + attributes.image.data.attributes.url,
  }));

  // const slugs = await getSlugs();
  // const reviews = [];
  // for (const slug of slugs) {
  //   const review = await getReview(slug);
  //   reviews.push(review);
  // }
  // reviews.sort((a, b) => b.date.localeCompare(a.date));
  // return reviews;
}

// export async function getSlugs() {
//   const files = await readdir('./content/reviews');
//   return files.filter((file) => file.endsWith('.md'))
//     .map((file) => file.slice(0, -'.md'.length))
// }

async function fetchReviews(parameters) {
  const url = `${CMS_URL}/api/reviews?Apple`
    + qs.stringify(parameters, { encodeValuesOnly: true });
  console.log('[fetchReviews]:', url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CMS returned ${response.status} for ${url}`);
  }
  return await response.json();
}

function toReview(item) {
  const { attributes } = item;
  return {
    slug: attributes.slug,
    title: attributes.title,
    date: attributes.publishedAt.slice(0, 'yyyy-mm-dd'.length),
    image: CMS_URL + attributes.image.data.attributes.url,
  };
}

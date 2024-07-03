import { getSubCategory } from '@/actions/getSubCategory';
import React from 'react';

interface Props {
  params: { subCategoryId: string };
}

const page = async ({ params }: Props) => {
  const categoryName = await getSubCategory({ subId: params.subCategoryId });

  return <div> {categoryName?.name}</div>;
};

export default page;

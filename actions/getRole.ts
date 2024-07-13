'use server';

import axios from 'axios';

export const getRole = async () => {
  const res = await axios.get(`/api/role`);

  console.log(res.data);

  return res.data;
};

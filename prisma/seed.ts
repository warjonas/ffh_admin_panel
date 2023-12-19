// import

// async function main() {
//   await prisma.user.create({
//     data: {
//       name: 'Rich',
//       email: 'hello@prisma.com',
//       posts: {
//         create: {
//           title: 'My first post',
//           body: 'Lots of really interesting stuff',
//           slug: 'my-first-post',
//         },
//       },
//     },
//   });

//   const allUsers = await prisma.user.findMany({
//     include: {
//       posts: true,
//     },
//   });
//   console.dir(allUsers, { depth: null });
// }

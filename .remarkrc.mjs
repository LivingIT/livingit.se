import remarkValidateLinks from 'remark-validate-links';

// Checks local links and GitHub heading anchors; nothing is fetched. The
// repository is fixed so links resolve the same with any remote URL.
export default {
  plugins: [
    [
      remarkValidateLinks,
      { repository: 'https://github.com/LivingIT/livingit.se' },
    ],
  ],
};

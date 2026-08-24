module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("readableDate", (date, lang) => {
    const locale = lang === "en" ? "en-US" : "de-DE";
    return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
  });

  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/documents": "assets/documents" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/newsreader/files": "assets/fonts/newsreader/files",
    "node_modules/@fontsource/public-sans/files": "assets/fonts/public-sans/files",
  });

  // Maps a shared `translationKey` front-matter value to each language's URL,
  // e.g. { home: { de: "/", en: "/en/" } }. Drives the language switcher and hreflang tags.
  eleventyConfig.addCollection("byTranslationKey", (api) => {
    const map = {};
    api.getAll().forEach((item) => {
      const key = item.data.translationKey;
      if (!key || !item.data.lang) return;
      map[key] = map[key] || {};
      map[key][item.data.lang] = item.url;
    });
    return map;
  });

  const byDateDesc = (a, b) => (b.date || 0) - (a.date || 0);
  eleventyConfig.addCollection("insightsDe", (api) =>
    api.getFilteredByGlob("src/de/insights/*.md").sort(byDateDesc)
  );
  eleventyConfig.addCollection("insightsEn", (api) =>
    api.getFilteredByGlob("src/en/insights/*.md").sort(byDateDesc)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};

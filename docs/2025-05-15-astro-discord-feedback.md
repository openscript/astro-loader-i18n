As you maybe have seen in the #showcase channel, I've been working on a [new Astro loader](https://github.com/openscript/astro-loader-i18n) that simplifies the process of managing internationalization. I've already developed the same for [Gatsby](https://github.com/openscript-ch/gatsby-plugin-i18n-l10n). I think I've maybe missed in some cases the Astro way of doing things or Astro has some rough edges. I've collected them and some of them I've previously discussed here.

1. Provide routing information to `getStaticPaths()` such as the `routePattern` to avoid manual repetition. Also see this pull request: https://github.com/withastro/astro/pull/13520 It would be great to proceed with this PR and get it eventually merged.
2. Allow to define custom parameters for `getStaticPaths()` like `paginate` from integrations and loaders. This makes integrating additional helpers for building `getStaticPaths()` way easier.
3. Allow to define different schemas for input (this already exists, today) and output (that is missing) of a loader. This is useful if a loader transforms the data. Currently the schema wouldn't match the output of the loader anymore.

What do you think?

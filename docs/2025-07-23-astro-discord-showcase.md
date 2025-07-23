## astro-nanostores-i18n

Hey Astro community! 👋

Last few days, I've been working on a new integration for Astro that helps you to use [@nanostores/i18n](https://github.com/nanostores/i18n) in your projects. The key features are:

- **Everything the original @nanostores/i18n provides**: It supports the same API and functionality, so you can use it seamlessly in your Astro projects.
- **Automatic locale detection** based on the URL pathname via a middleware.
- **Extract messages from your translations** by a included script that uses the Astro compiler to read your translations and extract the messages.

Check it out here: https://github.com/openscript/astro-i18n/tree/main/libs/astro-nanostores-i18n

Using `astro-nanostores-i18n` is straightforward:

```tsx
---
import Page from "../layouts/Page.astro";
import { useI18n, useFormat, currentLocale } from "astro-nanostores-i18n:runtime";
import { count, params } from "@nanostores/i18n";

// Override the current locale if needed
currentLocale.set("zh-CN");

// Name the constant `messages` to be able to use the extraction script.
const messages = useI18n("example", {
  message: "Irgend eine Nachricht.",
  param: params("Eine Nachricht mit einem Parameter: {irgendwas}"),
  count: count({
    one: "Ein Eintrag",
    many: "{count} Einträge",
  }),
});

const format = useFormat();
---

<Page>
  <h1>astro-nanostores-i18n</h1>
  <p>{messages.message}</p>
  <p>{messages.param({ irgendwas: "Something" })}</p>
  <p>{format.time(new Date())}</p>
</Page>
```

Let me know if you have any questions or feedback! I'm always open to suggestions and improvements.


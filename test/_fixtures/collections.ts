import { DataEntry } from "astro:content";

export const filesCollectionFixture: DataEntry[] = [
  {
    id: "about.de-CH",
    filePath: "src/content/pages/about.de-CH.mdx",
    data: {
      title: "Über mich",
    },
    body: `---
title: Über mich
---

Test
`,
  },
  {
    id: "projects.de-CH",
    filePath: "src/content/pages/projects.de-CH.mdx",
    data: {
      title: "Projekte",
    },
    body: `---
title: Projekte
---

Test
`
  },
  {
    id: "about.zh-CN",
    filePath: "src/content/pages/about.zh-CN.mdx",
    data: {
      title: "关于我",
    },
    body: `---
title: 关于我
---

测试
`
  },
  {
    id: "projects.zh-CN",
    filePath: "src/content/pages/projects.zh-CN.mdx",
    data: {
      title: "项目",
    },
    body: `---
title: 项目
---

测试
`
  },
]

export const folderCollectionFixture: DataEntry[] = [
  {
    id: "de-CH/about",
    filePath: "src/content/pages/de-CH/about.mdx",
    data: {
      title: "Über mich",
    },
    body: `---
title: Über mich
---

Test
`,
  },
  {
    id: "de-CH/projects",
    filePath: "src/content/pages/de-CH/projects.mdx",
    data: {
      title: "Projekte",
    },
    body: `---
title: Projekte
---

Test
`
  },
  {
    id: "zh-CN/about",
    filePath: "src/content/pages/zh-CN/about.mdx",
    data: {
      title: "关于我",
    },
    body: `---
title: 关于我
---

测试
`
  },
  {
    id: "zh-CN/projects",
    filePath: "src/content/pages/zh-CN/projects.mdx",
    data: {
      title: "项目",
    },
    body: `---
title: 项目
---

测试
`
  },
];

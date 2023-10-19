# @plumbiu/blog

> A blog with material style! [my blog](https://blog.plumbiu.top/)

## TODO

- [x] header
- [x] article
- [x] myself
- [x] code highlight
- [x] toc
- [x] cover image
- [x] mobile display
- [x] lazy load(image)
- [x] article search
- [x] pagination
- [x] tags page
- [x] categories page
- [x] archive page
- [x] about me page
- [x] friends page
- [x] dark theme
- [x] footer component
- [ ] message page(delete once as I didn't like the style)
- [ ] toc scroll height mouse following effect
- [ ] comment system

## friends

you can update `config/friends.json` and upload your avatar in `public/friends` to become my friend!

`scripts/screenshots.js` will automatically screenshot your blog page.

`friends.json` type:

```json
{
  "name": "your name",
  "link": "your blog site url",
  "desc": "introduce yourself!",
  "avatar": "your avatar filename" // update in public/friends/${avatar}, please contain suffix, like Plumbiu.png
}
```

## DIY

### Update `config.json`:

```json
{
  "name": "Plumbiu", // Your name in blog
  "github_name": "Plumbiu", // Your GitHub name
  "twitter": "Plumbiu", // Your twitter name
  "title": "Plumbiu の 小屋", // Blog title name
  "location": "Hang Zhou, China", // Your home location
  "email": "plumbiuzz@gmail.com", // Email
  "url": "https://blog.plumbiu.top", // Your blog site url
  "yourself": "plumbiuzz@gmail.com(Plumbiu)", // Email + name
  "blog_message_repo": "blog_message", // Your message repo in github, it can be private
  "blog_repo": "https://github.com/Plumbiu/blog" // the blog repo in your github
}
```

### Update article

Your post file name should be `2023-2-1-xxxx.md`!

Put your artilce in the `posts` folder, you should have these `front-matter`:

```md
---
title: React 全家桶(持续更新~~)
date: 2022-12-30 16:33:52
updated: 2022-12-30 16:33:52
tags:
  - React
categories:
  - FE
---
```

### Env file

See `.example.env` file, After the configuration file, you can name it `.env.*`

### Github Action

In the folder `.github/workflows/`, you can find code like this:

```yml
# ....
- name: Configure Git
  run: |
    git config --global user.email 3434909403@qq.com
    git config --global user.name Plumbiu
    git add .
    git commit -m "feat: update events.json"
    git pull --rebase

# ....
```

Set the `user.email` and `user.name` for yourself.

### Other

This repo use my own eslint plugin `@plumbiu/eslint-config`, if you don't like it, you can change it in the `package.json`:

```json
{
  // ...
-  "eslintConfig": {
-    "extends": ["@plumbiu"],
-    "ignorePatterns": ["/assets"]
-  }
}
```

And for `simple-git-hooks`:

```json
{
  "scripts": {
-    "prepare": "simple-git-hooks"
  },
  "devDependencies": {
-    "simple-git-hooks": "^2.9.0"
  }
}
```

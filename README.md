# `CommentJS`

`CommentJS` 参考 [Gitalk](https://github.com/gitalk/gitalk, 'gitalk')，主要用于博客或其他系统定制化评论    

# 特性
- 定制化, 开箱即用
- 多语言 [ `zh-CN`, `en` ]

[在线示例](https://www.itlangzi.com "IT浪子の博客")


# 安装
- 浏览器直接使用
```html
<link href="https://cdn.jsdelivr.net/npm/@itlangzi/comment-js/dist/style.css" rel="stylesheet" >
<script src="https://cdn.jsdelivr.net/npm/@itlangzi/comment-js/dist/comment-js.js"></script>
```
- `Npm` 安装
```bash
npm i --save @itlangzi/comment-js
```
或者
```bash
yarn add @itlangzi/comment-js
```
```js
import '@itlangzi/comment-js/dist/style.css'
import CommentJS from '@itlangzi/comment-js'
```
# 使用
添加一个容器
```html
<div id="container"></div>
```
初始化挂在 `comment-js` 插件
```js
const commentJS = new CommentJS({
    // 发布评论的接口
    commentUrl: '',
    // 获取评论列表的接口
    commentsUrl: ''
})
commentJS.render('container')
```
## 在 `React` 中使用
```js
import '@itlangzi/comment-js/dist/style.css'
import CommentJSComponent from '@itlangzi/comment-js/dist/react'
```
```jsx
<CommentJSComponent options={options} />
```

# 参数【options】
- **commentUrl**  `String`  
**必填** 发布评论的接口

- **commentsUrl**  `String`  
**必填** 获取评论列表的接口  

- **title**  `String`  
默认  `window.document.title`  

- **language**  `String`  
默认  `window.navigator.language || window.navigator.userLanguage`  

- **showCopyright**  `Boolean`  
默认  `true`  

- **markdownGuide**  `Boolean`  
默认  `true`  

- **commentHeader**  `Object || Function`  
默认  `{}`  
发布评论添加额外的请求头 

- **commentParams**  `Object || Function`  
默认  `{}`  
发布评论添加额外的参数    

- **commentBodyResolve**  `Function`  
默认  `{}`    

- **commentsHeader**  `Object || Function`  
默认  `{}`  
获取评论添加额外的请求头

- **commentsParams**  `Object || Function`  
默认  `{}`  
获取评论添加额外的参数    

- **commentsBodyResolve**  `Function`  
默认  `{}`  

- **placeholder** `String`  
默认 `Say words`  
占位文字  

# 实例方法
- **render( String | HTMLElement )**  
挂载评论插件

# `LICENSE`

**`MIT License Copyright (c) 2020 Lang zi`**

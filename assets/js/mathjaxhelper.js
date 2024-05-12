// https://squidfunk.github.io/mkdocs-material/reference/math/#mathjax-mkdocsyml

// window.MathJax = {
//   tex: {
//     inlineMath: [['$','$']],
//     displayMath: [['$$', '$$']],
//     processEscapes: true,
//     processEnvironments: true
//   },
//   options: {
//     ignoreHtmlClass: ".*|",
//     processHtmlClass: "arithmatex"
//   }
// };

// document$.subscribe(() => { // (1)!
//   MathJax.startup.output.clearCache()
//   MathJax.typesetClear()
//   MathJax.texReset()
//   MathJax.typesetPromise()
// })

document$.subscribe(({ body }) => {
  renderMathInElement(body, {
    delimiters: [
      { left: "$$",  right: "$$",  display: true },
      { left: "$",   right: "$",   display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
  })
})

'use strict';

module.exports = (html) => {
  return `
 <!doctype html>
 <html>  
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body, html {
        margin:0; padding: 0;
        height: 100%;
        text-align: center;
      }
      body {
        font-family: Helvetica Neue, Helvetica, Arial;
        font-size: 16px;
        color:#333;
      }
      table {
        width: 100%;
      }
      tr {
        height: 35px;
      }
    </style>
  </head>
  <body>${html}
  </body>
 </html>`;
};

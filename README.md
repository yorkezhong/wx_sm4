### wx_sm4
小程序sm4加密，支持传输key，iv，mode

### 使用示例
```js
   cbc.js中引用base64js.min.js 
   const base64js = require('./base64js.min.js')
   ---------------------------------------------------------------------------------------------------------------------------------------
   调用
   const SM4 =require('./cbc.js')
   let encryptInfo="xxxxxxxxx";
   let key="xxxxxxx";
   let iv="xxxxxx";
   let model="base64"
   let ciphertext = SM4.encrypt_cbc(encryptInfo, key, iv,model);

```

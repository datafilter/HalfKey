# Contributing

## Code

Any suggestions and discussions are more than welcome! The more eyeballs the merrier. 
There is a lot that can be done to improve the css and usability of the PWA.

I'd like to rely on this for a lifetime, and therefore prefer accretion-only changes. In other words, no edits as far as possible and only add new files.

Preferably, changes are new implementations, so that when one is completed, it doesn't change except for security updates. The intent is that users don't experience the app constantly changing out under them. New or [seperate variants of the PWA](/pwa/variants/) belong in one of these two paths:
```
pwa >> variants >> yyymm_offline_description
or
pwa >> variants >> yyymm_online_description
```
---
### yyymm

year/month, eg November 2505 is 50511

### online or offline

Whether or not the variant does any network calls. In both cases the app should be able to work offline.

If the app is an online variant, the user should be informed about where network calls are made to and why. The app should get agreement from the user regarding the sending/storage of their data *before* it is sent. The user should be able to delete their account/data. If half-keys are transmitted, they should be encrypted before sending, and only the user should be able to decrypt them locally.

### description

A unique camelCase identifier that sets this variant apart.

---

## Reviews / Bugs

If you find any bugs/risks/vulnerabilities please open an issue describing the problem. Bonus points for possible solution(s)!
It would help if these are also phrased in terms of Alice and Bob, explaining how person A gets the data of person B.

## Documentation

Questions, comments? I'd appreciate any feedback. Please open an issue and we can discuss & document it.

## Support

Any support would be greatly appreciated. If there is enough interest, I'd like to make an additional online version of the PWA that can backup halfkeys online, write an open source server which users can also self-host if they like, and also host it to use for free.

Contributions to these great organizations that help to secure our digital world would be great too. I'm not affiliated, I just think they are super:

[OpenSSL](https://github.com/sponsors/openssl)

[OWASP](https://owasp.org/donate/)

[EFF](https://www.eff.org/)

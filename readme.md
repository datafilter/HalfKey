# Half Key

A key stretching approach to supplement login credentials.

# Motivation

[How can you use a password manager, without trusting a password manager?](motivation.md)

I don't want to save my most sensitive passwords exactly.

I want something like a hardware authentication device, but that isn't a physical thing you can lose. Something like 2-factor authentication, for important accounts that don't support any/strong 2FA.

I know its generally a bad idea to roll-your-own security algorithms/procedures. Maybe there is a recommended approach to get around this problem that I'm not aware of, and someone will recommend that here!

I may have found a simpler solution to this already, but I'm still thinking it over. I'm sharing/doing this project to have something specific I find useful to implement in multiple different ways.

# Web app

## Proof of concept --> [halfkey.datafilter.app](https://halfkey.datafilter.app/)

NOTE:
Persistent storage on a PWA is not guaranteed, data you save on a PWA could be deleted by your browser/device.
Backup your HalfKey data somewhere, for example, along with your passwords in your password manager.

The PWA is functional and can be used as-is, but doesn't yet guide the user (TBD)
* Add in-app instructions/explainers
https://github.com/datafilter/HalfKey/issues/4
* Improve UI for bigger non-mobile displays
https://github.com/datafilter/HalfKey/issues/6

The PWA is written in vanilla js/css without libraries, no build steps, no frameworks. WYSIWYG - less things to review.

It only runs on your device, doesn't do any network calls, and doesn't read from the clipboard.

# Goals

* An approach that is relatively easy to memorize
* Human readable output in a small set characters easy to read and type
* Can be run on browsers and most operating systems without installing anything
* If an attacker has your saved passwords, and even one or more derived actual passwords, it is still hard for them to derive the other actual passwords

# Non-goals

* To be used instead of a [good password](https://diceware.dmuth.org/?debug=7)
* To be used instead of or replace a KDF, eg. PBKDF or Argon2id

# Algorithm

This is what is saved in the password manager:
```
Password: TheToothFairyTakesThe109BusOnTuesdays
Salt: Detective 8
```
This is what is only memorized, not written down anywhere:
```
Pepper: PaintbrushAdvisor
```

To get the actual password, do the following:

* Compute the hash of a memorized secret (Pepper)
* Compute the hash of the Salt, without the number
* Compute the hash of the hashes, so that both the Salt and Pepper contribute equally to output
* Then use the number of the half-key to get a subset of the last hash and add it to the original password get the final password

Pseudocode
```
s = hash(Detective) = 2653CEEEC1FD951707A31D9E357218EA41A511DB896747A7A41BB6528D927B09
p = hash(PaintbrushAdvisor) = 155794176D7A7E0F924683FF5A6CFA5E94EF157FD5146305A9D19CE27B4A230D
h = hash(a + b)
  = hash (265...B09155...30D)
  = B58D8541047464CB311EFE863DA80883FA79EF2C153FDC0A8A6EC7A407128F26
n = 8
o = c[0..8]
  = B58D8541
f = TheToothFairyTakesThe109BusOnTuesdays + o
  = TheToothFairyTakesThe109BusOnTuesdaysB58D8541
```

The chosen hash function is Sha2-256 because it's widely used and avaliable.

Code that runs on any browser:

```javascript
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                             // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);             // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                       // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}
const salt = "Detective"
const pepper = "PaintbrushAdvisor"
const saltHash = await digestMessage(salt)
const pepperHash = await digestMessage(pepper)
const hashHash = await digestMessage(saltHash + pepperHash)
const finalPassword = "TheToothFairyTakesThe109BusOnTuesdays" + hashHash.substring(0,8)
```

Code that runs on most operating systems:
```sh
todo add openssl example
```

On IOS you can create shortcut natively without installing anything:

> Todo add screenshot of shortcut-app

# Basis of the algorithm

A common practice to save passwords in a database is to use a [Salt](https://en.wikipedia.org/wiki/Salt_(cryptography))(S)

Salt combined with password is hashed together, so that the password is not easy to guess.

Half Key is the same thing, to combine a known part, Salt, and a number(N) with an unknown part - a secret Salt, aka [Pepper](https://en.wikipedia.org/wiki/Pepper_(cryptography))(P)

Half Key is intentionally separate from the saved password so that:
* The saved password remains unknown to external applications
* It is still up to the user to pick a good password to begin with
* Even if it doesn't add any extra security, at least it doesn't take away any security. Which is similar to just appending the phrase "WithPeanutButter" to the end of saved passwords.

Eg.  
Saved Password(W)  
Half Key output (O) = Subset(N, hash(hash(S) + hash(P)))  
Actual Password = W + O

instead of

Actual Password = HK(W, N, S, P)  
which would require a solid understanding of KDF

# Vue, Angular, React, Elm, Not-a-framework?

Contributions using different approaches are welcome, see [contributing](contributing.md)

# Planned redundancy
PWA also hosted on a non-Microsoft(Github) server   
Source code on both GitHub and GitLab

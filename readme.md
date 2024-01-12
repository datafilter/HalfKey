# Half Key

A key stretching approach to supplement login credentials.

# Motivation

[How can you use a password manager, without trusting a password manager?](motivation.md)

I don't want to save my most sensitive passwords exactly.

I want something like a hardware authentication device, but that isn't a physical thing you can lose. Something like 2-factor authentication, for important accounts that don't support any/strong 2FA.

It's usually a bad idea to roll-your-own security algorithms/procedures. Maybe there is a recommended approach to get around this problem that I'm not aware of, and someone will share it! If I find a standard or simpler solution than the approach described here, I'll add a description & reference to it here.

# Web app

How to use the PWA is [explained here](usage.md)

Stable version, updated as needed:  
[halfkey.datafilter.app](https://halfkey.datafilter.app)  

Automated release on any changes:  
[datafilter.github.io/HalfKey](https://datafilter.github.io/HalfKey)

It only runs on your device, doesn't do any network calls, and doesn't read from the clipboard.

__NOTE__:  
Persistent storage on a PWA is not guaranteed and in the hands of the browser/device. Also, you could lose/break your device. As nothing is uploaded anywhere, __backup your own data__ i.e. save Halfkey data along with your passwords in your password manager.

The PWA is written in vanilla js/css without libraries, no build steps, no frameworks. WYSIWYG - less things to review.

# Goals

* An approach that is relatively easy to memorize
* Human readable output in a small set characters easy to read and type
* Can be run on browsers and most operating systems without installing anything
* If an attacker has your saved passwords, and even one or more derived actual passwords, it is still hard for them to derive the other actual passwords

# Non-goals

* To be used instead of a [good password](https://diceware.dmuth.org/?debug=7)
* To be used instead of or replace a [KDF](https://en.wikipedia.org/wiki/Key_derivation_function), eg. PBKDF or Argon2id

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

Code that runs on most operating systems:
### Shell
```sh
salt="Detective"
pepper="PaintbrushAdvisor"
saltHash=$(printf "$salt" | openssl dgst -sha256)
pepperHash=$(printf "$pepper" | openssl dgst -sha256)
hashHash=$(printf "$saltHash$pepperHash" | openssl dgst -sha256)
subset=$(printf "$hashHash" | head -c 8)

printf "modifier: $subset"

password="TheToothFairyTakesThe109BusOnTuesdays"
printf "final password: $password$subset"
```

Code that runs on any browser:
### JS
```javascript
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                             
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);             
  const hashArray = Array.from(new Uint8Array(hashBuffer));                       
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
const salt = "Detective"
const pepper = "PaintbrushAdvisor"
const saltHash = await digestMessage(salt)
const pepperHash = await digestMessage(pepper)
const hashHash = await digestMessage(saltHash + pepperHash)
const finalPassword = "TheToothFairyTakesThe109BusOnTuesdays" + hashHash.substring(0,8)
```
### Pseudocode
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

# Basis of the algorithm

A common practice to save passwords in a database is to use a [Salt](https://en.wikipedia.org/wiki/Salt_(cryptography))(S)

Salt combined with password is hashed together, so that the password is not easy to guess.

Half Key is the same thing, to combine a known part, Salt, and a number(N) with an unknown part - a secret Salt, aka [Pepper](https://en.wikipedia.org/wiki/Pepper_(cryptography))(P)

The steps are as follows:

Given 
For all accounts
P - a memorized secret (Secret Salt aka Pepper)
For each account in the password manager
W - the saved password, NOT used in HalfKey
S - a second password (Salt)
N - an output length of the algorithm
O - the output of the algorithm
H - a secure hash function

The chosen hash function is Sha2-256 because it's widely used and avaliable.

Steps:
* Compute the hash of the Pepper
* Compute the hash of the Salt
* Compute the hash of the hashes, so that both the Salt and Pepper contribute equally to output
* Then use the number N to get a subset of the previous output (O).
* Combine it with the original password get the final password.
* How the subset is chosen and combined with W is left up to the user/implementation.

In the case of [02401_offline_takeLastN](pwa/variants/02401_offline_takeLastN)
* The subset is the last N characters of O
* The combination with W is done by appending the subset

Eg.  
Given a saved password (W)  
Half Key output (O) = Subset(N, hash(hash(S) + hash(P)))  
Actual Password = W + O

The above algorithm is used instead of something like: 
`Actual Password = HK(W, N, S, P)`  
This intentionally avoids using the saved password(W) as input so that:
* The saved password remains unknown to external applications
* It is still up to the user to pick a good password to begin with
* Even if it doesn't add any extra security, at least it doesn't take away any security. Which is similar to just appending the phrase "WithPeanutButter" to the end of saved passwords.


# Vue, Angular, React, Elm, Not-a-framework?

Contributions using different approaches are welcome, see [contributing](contributing.md)

# How can you use a password manager, without trusting a password manager?

## TLDR

Don't save sensitive passwords as-is in a password manager. Modify it in some way that makes it longer.

### For example

The password you have saved is:  
`TheToothFairyTakesThe109BusOnTuesdays`

And by using a secret that is not written down anywhere, and only in your mind:  
`OrWhenItsRainy`

Your actual password is:  
`TheToothFairyTakesThe109BusOnTuesdaysOrWhenItsRainy`

This article is my approach to that, but with a modification that is seemingly random to each password.

## Pros and cons of various approaches

### 1. Just using your passwords as they are saved

++ You only have 1 password to remember, your master password  
-- If someone has access to your passwords, they have your passwords

### 2. Using a second secret to modify your sensitive passwords

++ If someone has access to your passwords, without your modifier secret, they still dont have your actual passwords  
++ Your actual(extended) passwords you use are longer  
-- It's an inconvenient extra step  
-- You have to remember 2 passwords, your master password and your extra modifier secret  
-- Possibly incompatible with your autofill solution that guards you from entering your credentials on a fake site  

### 2.1 Using a simple approach, like only appending a modifier secret  
-- If someone has access to your passwords, and one of your actual passwords, its possible to derive your other actual passwords

### 2.2 Using an approach that results in a unique modifier for each password  
++ If someone has access to your passwords, and one of your actual passwords, it's not easy/feasible to derive your other actual passwords  
-- It's even more inconvenient, for a scenario so unlikely that it's probably not worth the effort

## Background - Broken trust

On the security-convenience line, I consider myself to be slightly more to the left than most people. I don't use an amnesic operating system with an offline password manager. I'm not quite comfortable having all my passwords managed for me by my device/platform, so I use a password manager. And then it happened..

The password manager I used got hacked. ~~Twice~~ Three times. That I know of. Even though the company has hundreds of employees.

I got tired of changing all my passwords again and again so I sought a solution where I wouldn't mind if my saved passwords were leaked.

Since I was about to change all my passwords, I decided to migrate to a different provider as well.

## Choosing 'the best' password manager

There are several sources of information on password managers, with varying usefulness:
- Trust us, we are Canadian/Swiss/[insert your nationality here] (this tells me nothing, no-one is perfect)
- Blog posts providing/demonstrating infosec knowledge
- Forum contributions and explanations
- Security white papers
- Audits and reports
- Source code

While most password managers have a solid approach to zero-knowledge secure encrypted data storage, there are some differences in the algorithms used. Some follow OWASP guidelines religiously and others deviate from it where they understand the topic in depth. For example, understanding that password length is more important PBKDF iterations by doing the math.

None of the audits I read had any serious issue with the security design in general. The different algorithms have all been proven to be resistant to brute-force attacks and won security competitions. However, some workarounds to access password manager data without the master password are surprisingly trivial! Thankfully most of the workarounds require root access (ie malware).

Of the password managers that seem trustworthy to me, I ranked them in order of least disgusting in terms of:  
* __Privacy__ - information collected about you, trackers, analytics, telemetry, application permissions, etc.
* __App size__ - Without any 3D images or any assets that could take up a lot of space, I think app size can give us a rough indication of the number of dependendencies. A password manager is just a (very) fancy text editor. It seems wild to me how some of these apps manage to be a third of a GIGABYTE. A big house of cards with potential everywhere for silly things like buffer overflows.

Regardless of password manager implementation, their response time to zero-day announcents or internal company data access policies, there is little to protect you if you leave your phone unlocked with your password manager open.

## Migrating whatever passwords

Since passwords managers import/export to files that are not password protected, I decided to change all my passwords air-gapped one by one, and managed to delete about half of my accounts in the process.

Turns out I don't actually care about more than 90% of my passwords. So I just save those verbatim. If someone gets my "you have to register to keep using this website" account, I'll just create a new one.

## Conclusion - only partially migrating sensitive passwords with HalfKey

For the accounts that I do care about, for which there is no option to force non-weak(sms/email) 2-factor-authentication, I wanted a way to generate a longer password than the one saved in the password manager. 

To do that, I supplement my sensitive passwords with [HalfKey](readme.md)

it works like this:

You memorize 2 passwords - your password manager password, and a "pepper" password.

For each sensitive password, you save both the password and a "salt" in your password manager.
```
Salt & Pepper to spice up your password

> Salt   -> Some random characters saved along with each password, and a number. for example: "twin.belong.hawk 8"
> Pepper -> A secondary password that you memorize (The same pepper is used for all passwords)
```

To reconstruct your password, you run HalfKey and enter your pepper password in HalfKey to derive generate a password modification.

For example suppose you have the following account at MyBank, and you have memorized a pepper password `hello`

### Within your Password manager:  
MyBank  
username: me@example.com  
password: `the.longer.the.password.the.better`  
notes: hk/twin.belong.hawk/8 <-- saved here in password manager, but could be somewhere else you consider safe.

### Within HalfKey:  
name: MyBank  
salt: twin.belong.hawk  
size: 8  

When you enter the pepper password in HalfKey, that outputs `8e01d42f`

You use that to extend your password, for example just adding it to the end of your password, so your actual password becomes:
`the.longer.the.password.the.better` `8e01d42f`

This way, your sensitive passwords are never fully saved anywhere, and even without the internet, you can still reconstruct your passwords since the algorithm is relatively easy to memorize and execute on any machine without installing anything.